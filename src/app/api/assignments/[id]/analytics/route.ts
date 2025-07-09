import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Assignment from '@/models/Assignment'
import Submission from '@/models/Submission'
import Course from '@/models/Course'
import jwt from 'jsonwebtoken'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id: assignmentId } = await params
    
    // Get and verify token
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId)
      .populate('course', 'title subject gradeLevel students teacher')

    if (!assignment) {
      return NextResponse.json({ message: 'Assignment not found' }, { status: 404 })
    }

    const course = assignment.course as any

    // Verify access
    if (decoded.role === 'teacher') {
      // Teachers can only view analytics for their own assignments
      if (course.teacher.toString() !== decoded.userId) {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 })
      }
    } else if (decoded.role === 'student') {
      // Students can only view analytics if they're enrolled in the course
      if (!course.students.includes(decoded.userId)) {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 })
      }
    } else {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    // Get all submissions for this assignment
    const submissions = await Submission.find({ 
      assignment: assignmentId,
      grade: { $nin: [null, undefined] }
    }).populate('student', 'name')

    // Calculate analytics
    const totalSubmissions = submissions.length
    const totalStudents = course.students.length
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

    const maxPoints = assignment.maxPoints || 100
    const scores = submissions.map(sub => {
      const percentage = maxPoints > 0 ? (sub.grade / maxPoints) * 100 : 0
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
      grade: sub.grade,
      maxScore: maxPoints,
      percentage: maxPoints > 0 ? Math.round((sub.grade / maxPoints) * 100) : 0,
      submittedAt: sub.submittedAt,
      isGraded: sub.grade !== null && sub.grade !== undefined
    }))

    // Assignment statistics
    const analytics = {
      assignment: {
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        course: assignment.course,
        maxPoints: maxPoints,
        dueDate: assignment.dueDate,
        submissionType: assignment.submissionType
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
    console.error('Error fetching assignment analytics:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
