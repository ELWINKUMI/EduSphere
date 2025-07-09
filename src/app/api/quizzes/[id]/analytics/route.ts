import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Quiz from '@/models/Quiz'
import QuizSubmission from '@/models/QuizSubmission'
import Course from '@/models/Course'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id: quizId } = await params
    
    // Get and verify token
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Find the quiz
    const quiz = await Quiz.findById(quizId)
      .populate('course', 'title subject gradeLevel students')
      .populate('teacher', 'name')

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 })
    }

    // Verify access
    if (decoded.role === 'teacher') {
      // Teachers can only view analytics for their own quizzes
      if (quiz.teacher._id.toString() !== decoded.userId) {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 })
      }
    } else if (decoded.role === 'student') {
      // Students can only view analytics if they're enrolled in the course
      const course = quiz.course as any
      if (!course.students.includes(decoded.userId)) {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 })
      }
    } else {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    // Get all submissions for this quiz
    const submissions = await QuizSubmission.find({ quiz: quizId })
      .populate('student', 'name')
      .sort({ submittedAt: -1 })

    // Calculate analytics
    const totalSubmissions = submissions.length
    const totalStudents = (quiz.course as any).students.length
    const completionRate = totalStudents > 0 ? (totalSubmissions / totalStudents) * 100 : 0

    // Calculate score distribution
    const scoreRanges = {
      '0-50': 0,
      '50-60': 0,
      '60-70': 0,
      '70-80': 0,
      '80-90': 0,
      '90-100': 0
    }

    const scores = submissions.map(sub => {
      const percentage = sub.maxScore > 0 ? (sub.score / sub.maxScore) * 100 : 0
      return percentage
    })

    scores.forEach(score => {
      if (score < 50) scoreRanges['0-50']++
      else if (score < 60) scoreRanges['50-60']++
      else if (score < 70) scoreRanges['60-70']++
      else if (score < 80) scoreRanges['70-80']++
      else if (score < 90) scoreRanges['80-90']++
      else scoreRanges['90-100']++
    })

    // Calculate average score
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

    // Get detailed submission data
    const detailedSubmissions = submissions.map(sub => ({
      _id: sub._id,
      student: {
        _id: sub.student._id,
        name: decoded.role === 'teacher' ? sub.student.name : 'Student' // Hide names from students
      },
      score: sub.score,
      maxScore: sub.maxScore,
      percentage: sub.maxScore > 0 ? Math.round((sub.score / sub.maxScore) * 100) : 0,
      timeSpent: sub.timeSpent,
      submittedAt: sub.submittedAt,
      isGraded: sub.isGraded
    }))

    // Quiz statistics
    const analytics = {
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        course: quiz.course,
        teacher: quiz.teacher,
        totalQuestions: quiz.questions.length,
        timeLimit: quiz.timeLimit,
        maxScore: quiz.questions.reduce((sum: number, q: any) => sum + q.points, 0),
        startDate: quiz.startDate,
        endDate: quiz.endDate,
        showResults: quiz.showResults
      },
      statistics: {
        totalStudents,
        totalSubmissions,
        completionRate: Math.round(completionRate),
        averageScore: Math.round(averageScore),
        scoreDistribution: scoreRanges,
        scoreData: Object.entries(scoreRanges).map(([range, count]) => ({
          range,
          count,
          percentage: totalSubmissions > 0 ? Math.round((count / totalSubmissions) * 100) : 0
        }))
      },
      submissions: detailedSubmissions
    }

    return NextResponse.json(analytics, { status: 200 })

  } catch (error) {
    console.error('Error fetching quiz analytics:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
