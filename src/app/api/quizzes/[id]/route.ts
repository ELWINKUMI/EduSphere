import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Quiz from '@/models/Quiz'
import QuizSubmission from '@/models/QuizSubmission'
import Course from '@/models/Course'
import jwt from 'jsonwebtoken'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in environment');
  return secret;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    const { id } = await params;

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Only teachers can delete quizzes' }, { status: 403 });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    if (quiz.teacher.toString() !== decoded.userId) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    await QuizSubmission.deleteMany({ quiz: id });
    await Course.updateMany({ quizzes: id }, { $pull: { quizzes: id } });
    await Quiz.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Quiz deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    const { id } = await params;

    const quiz = await Quiz.findById(id)
      .populate('course', 'title subject gradeLevel students')
      .populate('teacher', 'name');

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    if (decoded.role === 'student') {
      const course = quiz.course as any;
      if (!course.students.map(String).includes(String(decoded.userId))) {
        console.error('Student not enrolled in course:', decoded.userId, course.students);
        return NextResponse.json({ message: 'Access denied: not enrolled in course' }, { status: 403 });
      }

      let isEligible = true;
      if (quiz.eligibleStudents && Array.isArray(quiz.eligibleStudents) && quiz.eligibleStudents.length > 0) {
        isEligible = quiz.eligibleStudents.map(String).includes(String(decoded.userId));
        if (!isEligible) {
          console.error('Student not eligible for retake quiz:', decoded.userId, quiz.eligibleStudents);
        }
      }

      const submission = await QuizSubmission.findOne({
        quiz: id,
        student: decoded.userId
      });

      const studentQuiz = {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        attempts: quiz.attempts,
        showResults: quiz.showResults,
        startDate: quiz.startDate,
        endDate: quiz.endDate,
        course: quiz.course,
        teacher: quiz.teacher,
        isActive: quiz.isActive,
        questions: quiz.questions.map((q: any) => ({
          _id: q._id,
          question: q.question,
          type: q.type,
          options: q.options,
          points: q.points
        })),
        eligibleStudents: quiz.eligibleStudents
      };

      return NextResponse.json({
        quiz: studentQuiz,
        submission: submission || null,
        isEligible
      }, { status: 200 });

    } else if (decoded.role === 'teacher') {
      if (quiz.teacher._id.toString() !== decoded.userId) {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 });
      }

      const submissions = await QuizSubmission.find({ quiz: id })
        .populate('student', 'name')
        .sort({ submittedAt: -1 });

      return NextResponse.json({
        quiz,
        submissions
      }, { status: 200 });

    } else {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    const { id } = await params;

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Only teachers can update quizzes' }, { status: 403 });
    }

    const {
      newTitle,
      newStartDate,
      newEndDate,
      allowRetakeForAll = false,
      useNewQuestions = false,
      newQuestions = [],
    } = await request.json();

    if (!newTitle || !newStartDate || !newEndDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    if (quiz.teacher.toString() !== decoded.userId) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const course = await Course.findById(quiz.course);
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    let eligibleStudents: string[];
    if (allowRetakeForAll) {
      eligibleStudents = course.students.map((sid: any) => String(sid));
    } else {
      const submissions = await QuizSubmission.find({ quiz: id });
      const studentsWhoSubmitted = submissions.map((s: any) => String(s.student));
      eligibleStudents = course.students
        .map((sid: any) => String(sid))
        .filter((sid: string) => !studentsWhoSubmitted.includes(sid));
    }

    let questionsToUse;
    if (useNewQuestions && Array.isArray(newQuestions) && newQuestions.length > 0) {
      questionsToUse = newQuestions;
    } else {
      questionsToUse = quiz.questions;
    }

    const retakeQuiz = await Quiz.create({
      title: newTitle,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      attempts: quiz.attempts,
      showResults: quiz.showResults,
      startDate: newStartDate,
      endDate: newEndDate,
      course: quiz.course,
      teacher: quiz.teacher,
      isActive: true,
      questions: questionsToUse,
      eligibleStudents,
    });

    if (Array.isArray(course.quizzes)) {
      course.quizzes.push(retakeQuiz._id);
      await course.save();
    }

    return NextResponse.json({ quiz: retakeQuiz });
  } catch (error) {
    console.error('Error creating retake quiz:', error);
    return NextResponse.json({ message: 'Failed to create retake quiz' }, { status: 500 });
  }
}