import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Quiz from '@/models/Quiz'
import QuizSubmission from '@/models/QuizSubmission'
import Course from '@/models/Course'
import jwt from 'jsonwebtoken'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    // Get and verify token
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    const { id } = await params

    // Find the quiz
    const quiz = await Quiz.findById(id)
      .populate('course', 'title subject gradeLevel students')
      .populate('teacher', 'name')

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 })
    }

    // Check if user has access to this quiz
    if (decoded.role === 'student') {
      // Students can only see quizzes from courses they're enrolled in
      const course = quiz.course as any
      if (!course.students.includes(decoded.userId)) {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 })
      }

      // Get the student's submission if it exists
      const submission = await QuizSubmission.findOne({
        quiz: id,
        student: decoded.userId
      })

      // Return quiz without detailed question answers for students
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
          // Don't include correctAnswer for students
        }))
      }

      return NextResponse.json({ 
        quiz: studentQuiz,
        submission: submission ? {
          _id: submission._id,
          score: submission.score,
          totalPoints: submission.maxScore,
          submittedAt: submission.submittedAt,
          timeSpent: submission.timeSpent,
          isGraded: submission.isGraded,
          answers: submission.answers
        } : null
      }, { status: 200 })

    } else if (decoded.role === 'teacher') {
      // Teachers can see their own quizzes with full details
      if (quiz.teacher._id.toString() !== decoded.userId) {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 })
      }

      // Get all submissions for this quiz
      const submissions = await QuizSubmission.find({ quiz: id })
        .populate('student', 'name')
        .sort({ submittedAt: -1 })

      return NextResponse.json({ 
        quiz,
        submissions
      }, { status: 200 })

    } else {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
