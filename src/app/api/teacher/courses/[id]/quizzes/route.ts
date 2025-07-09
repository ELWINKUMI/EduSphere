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

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Only teachers can view this data' }, { status: 403 })
    }

    // Find the course and verify teacher owns it
    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }

    if (course.teacher.toString() !== decoded.userId) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    // Get all quizzes for this course
    const quizzes = await Quiz.find({ 
      course: courseId, 
      teacher: decoded.userId 
    }).sort({ createdAt: -1 })

    // Get submission counts for each quiz
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const submissionCount = await QuizSubmission.countDocuments({ quiz: quiz._id })
        
        return {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          totalQuestions: quiz.questions.length,
          startDate: quiz.startDate,
          endDate: quiz.endDate,
          submissionCount,
          isActive: quiz.isActive
        }
      })
    )

    return NextResponse.json({
      quizzes: quizzesWithStats
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching course quizzes:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
