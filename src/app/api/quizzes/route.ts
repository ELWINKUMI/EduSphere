import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Quiz from '@/models/Quiz'
import Course from '@/models/Course'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Get and verify token
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    if (decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Only teachers can create quizzes' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      courseId,
      timeLimit,
      maxAttempts,
      showResults,
      startDate,
      endDate,
      questions
    } = body

    // Validate required fields
    if (!title || !courseId || !questions || questions.length === 0) {
      return NextResponse.json({ 
        message: 'Title, course, and at least one question are required' 
      }, { status: 400 })
    }

    // Verify the course belongs to this teacher
    const course = await Course.findOne({ 
      _id: courseId, 
      teacher: decoded.userId 
    })

    if (!course) {
      return NextResponse.json({ 
        message: 'Course not found or you do not have permission to create quizzes for this course' 
      }, { status: 404 })
    }

    // Validate questions
    for (const question of questions) {
      if (!question.question || !question.correctAnswer) {
        return NextResponse.json({ 
          message: 'All questions must have content and correct answers' 
        }, { status: 400 })
      }
      
      if (question.type === 'multiple-choice' && (!question.options || question.options.length < 2)) {
        return NextResponse.json({ 
          message: 'Multiple choice questions must have at least 2 options' 
        }, { status: 400 })
      }
    }

    // Set default dates if not provided
    const now = new Date()
    const defaultStartDate = startDate ? new Date(startDate) : now
    const defaultEndDate = endDate ? new Date(endDate) : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

    // Create the quiz
    const quiz = new Quiz({
      title,
      description: description || '',
      course: courseId,
      teacher: decoded.userId,
      questions: questions.map((q: any) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        points: q.points || 1
      })),
      timeLimit: timeLimit || 30, // Default 30 minutes
      attempts: maxAttempts === -1 ? 999 : (maxAttempts || 1),
      showResults: showResults || 'after-deadline',
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      isActive: true
    })

    await quiz.save()

    // Notify all students in the course about the new quiz
    try {
      const User = (await import('@/models/User')).default;
      const Notification = (await import('@/models/Notification')).default;
      // Find all students enrolled in the course
      const courseWithStudents = await Course.findById(courseId).populate('students', 'name');
      if (courseWithStudents && courseWithStudents.students && courseWithStudents.students.length > 0) {
        const notifications = courseWithStudents.students.map((student: any) => ({
          type: 'quiz_created',
          student: student._id,
          studentName: student.name,
          content: `A new quiz "${quiz.title}" has been posted for your course: ${course.title}`,
          read: false,
          createdAt: new Date(),
          quiz: quiz._id,
        }));
        await Notification.insertMany(notifications);
      }
    } catch (notifyErr) {
      console.error('Failed to create student notifications for quiz:', notifyErr);
    }

    return NextResponse.json({
      message: 'Quiz created successfully',
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        course: quiz.course,
        timeLimit: quiz.timeLimit,
        attempts: quiz.attempts,
        startDate: quiz.startDate,
        endDate: quiz.endDate,
        questionCount: quiz.questions.length
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get and verify token
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    let quizzes

    if (decoded.role === 'teacher') {
      // Teachers see their own quizzes
      quizzes = await Quiz.find({ teacher: decoded.userId })
        .populate('course', 'title subject gradeLevel')
        .sort({ createdAt: -1 })
    } else {
      // Students see quizzes from their enrolled courses
      const studentCourses = await Course.find({ 
        students: decoded.userId 
      }).select('_id')
      
      const courseIds = studentCourses.map(course => course._id)
      
      quizzes = await Quiz.find({ 
        course: { $in: courseIds },
        isActive: true
      })
        .populate('course', 'title subject gradeLevel')
        .sort({ startDate: 1 })
    }

    return NextResponse.json({ quizzes }, { status: 200 })

  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
