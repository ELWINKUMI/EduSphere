import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Submission from '@/models/Submission'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get token from authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let decoded: any
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Verify user is a student
    const student = await User.findById(decoded.userId)
    if (!student || student.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can view grades' },
        { status: 403 }
      )
    }

    // Get graded submissions for the student
    const submissions = await Submission.find({
      student: student._id,
      isGraded: true
    })
      .populate({
        path: 'assignment',
        select: 'title maxPoints course',
        populate: {
          path: 'course',
          select: 'title subject'
        }
      })
      .sort({ gradedAt: -1 })
      .lean()

    // Calculate statistics
    const stats = {
      totalAssignments: submissions.length,
      gradedAssignments: submissions.length,
      averageGrade: 0,
      totalPoints: 0,
      earnedPoints: 0,
      highestGrade: 0,
      lowestGrade: 100
    }

    if (submissions.length > 0) {
      const totalPossible = submissions.reduce((sum, sub) => sum + sub.assignment.maxPoints, 0)
      const totalEarned = submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0)
      
      stats.totalPoints = totalPossible
      stats.earnedPoints = totalEarned
      stats.averageGrade = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0

      // Calculate highest and lowest percentages
      const percentages = submissions.map(sub => (sub.grade / sub.assignment.maxPoints) * 100)
      stats.highestGrade = Math.max(...percentages)
      stats.lowestGrade = Math.min(...percentages)
    }

    // Format grades for response
    const grades = submissions.map(submission => ({
      _id: submission._id,
      assignment: {
        title: submission.assignment.title,
        maxPoints: submission.assignment.maxPoints,
        course: {
          title: submission.assignment.course.title,
          subject: submission.assignment.course.subject
        }
      },
      grade: submission.grade,
      feedback: submission.feedback,
      submittedAt: submission.submittedAt,
      gradedAt: submission.gradedAt
    }))

    return NextResponse.json({
      grades,
      stats
    })

  } catch (error) {
    console.error('Get grades error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
