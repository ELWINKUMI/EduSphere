import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import Quiz from '@/models/Quiz'
import QuizSubmission from '@/models/QuizSubmission'
import jwt from 'jsonwebtoken'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id: courseId } = await params
    
    // Get and verify token
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Find the course 
    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }

    // Verify access based on role
    if (decoded.role === 'student') {
      if (!course.students.includes(decoded.userId)) {
        return NextResponse.json({ message: 'You are not enrolled in this course' }, { status: 403 })
      }
    } else if (decoded.role === 'teacher') {
      if (course.teacher.toString() !== decoded.userId) {
        return NextResponse.json({ message: 'You do not have access to this course' }, { status: 403 })
      }
    } else {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    // Get all quizzes for this course
    const quizzes = await Quiz.find({ 
      course: courseId, 
      isActive: true 
    }).sort({ createdAt: -1 })

    // Get student's submissions for these quizzes
    const submissions = await QuizSubmission.find({
      student: decoded.userId,
      quiz: { $in: quizzes.map(q => q._id) }
    })

    // Format quizzes with status
    const formattedQuizzes = quizzes.map(quiz => {
      const submission = submissions.find(s => s.quiz.toString() === quiz._id.toString())
      const now = new Date()
      const startDate = new Date(quiz.startDate)
      const endDate = new Date(quiz.endDate)
      
      let status = 'upcoming'
      if (submission) {
        status = 'completed'
      } else if (now < startDate) {
        status = 'upcoming'
      } else if (now >= startDate && now <= endDate) {
        status = 'available'
      } else {
        status = 'expired'
      }

      return {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        totalQuestions: quiz.questions.length,
        availableFrom: quiz.startDate,
        availableUntil: quiz.endDate,
        status,
        score: submission?.score,
        maxScore: submission?.maxScore
      }
    })

    return NextResponse.json({
      quizzes: formattedQuizzes
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching course quizzes:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
