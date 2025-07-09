import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import Submission from '@/models/Submission'
import QuizSubmission from '@/models/QuizSubmission'
import Assignment from '@/models/Assignment'
import Quiz from '@/models/Quiz'
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

    // Get all assignments and quizzes for this course
    const assignments = await Assignment.find({ course: courseId })
    const quizzes = await Quiz.find({ course: courseId })

    // Get student's submissions
    const assignmentSubmissions = await Submission.find({
      student: decoded.userId,
      assignment: { $in: assignments.map(a => a._id) }
    }).populate('assignment', 'title maxPoints')

    const quizSubmissions = await QuizSubmission.find({
      student: decoded.userId,
      quiz: { $in: quizzes.map(q => q._id) }
    }).populate('quiz', 'title')

    // Combine and format grades
    const grades = []

    // Add assignment grades
    for (const submission of assignmentSubmissions) {
      if (submission.grade !== undefined && submission.grade !== null) {
        const assignment = submission.assignment as any
        const maxPoints = assignment.maxPoints || 100
        
        grades.push({
          _id: submission._id,
          type: 'assignment',
          title: assignment.title,
          score: submission.grade,
          maxScore: maxPoints,
          percentage: Math.round((submission.grade / maxPoints) * 100),
          submittedAt: submission.submittedAt,
          gradedAt: submission.updatedAt,
          itemId: assignment._id.toString()
        })
      }
    }

    // Add quiz grades
    for (const submission of quizSubmissions) {
      if (submission.isGraded && submission.score !== undefined) {
        const quiz = submission.quiz as any
        
        grades.push({
          _id: submission._id,
          type: 'quiz',
          title: quiz.title,
          score: submission.score,
          maxScore: submission.maxScore,
          percentage: submission.maxScore > 0 ? Math.round((submission.score / submission.maxScore) * 100) : 0,
          submittedAt: submission.submittedAt,
          gradedAt: submission.submittedAt, // Quizzes are auto-graded
          itemId: quiz._id.toString()
        })
      }
    }

    // Sort by submission date (newest first)
    grades.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({
      grades,
      summary: {
        totalGraded: grades.length,
        averagePercentage: grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length) : 0,
        highGrades: grades.filter(g => g.percentage >= 80).length
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching course grades:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
