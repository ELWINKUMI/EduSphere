import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Submission from '@/models/Submission'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify user is a teacher
    const teacher = await User.findById(decoded.userId)
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can grade submissions' },
        { status: 403 }
      )
    }

    const { grade, feedback } = await request.json()

    // Validate input
    if (grade === undefined || grade === null) {
      return NextResponse.json(
        { error: 'Grade is required' },
        { status: 400 }
      )
    }

    const numericGrade = parseInt(grade)
    if (isNaN(numericGrade) || numericGrade < 0) {
      return NextResponse.json(
        { error: 'Grade must be a non-negative number' },
        { status: 400 }
      )
    }

    // Find and update submission
    const submission = await Submission.findById(params.id)
      .populate('assignment', 'teacher maxPoints')

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Verify teacher owns the assignment
    if (submission.assignment.teacher.toString() !== teacher._id.toString()) {
      return NextResponse.json(
        { error: 'You can only grade submissions for your own assignments' },
        { status: 403 }
      )
    }

    // Check if grade is within valid range
    if (numericGrade > submission.assignment.maxPoints) {
      return NextResponse.json(
        { error: `Grade cannot exceed maximum points (${submission.assignment.maxPoints})` },
        { status: 400 }
      )
    }

    // Update submission with grade and feedback
    submission.grade = numericGrade
    submission.feedback = feedback || ''
    submission.gradedAt = new Date()
    submission.gradedBy = teacher._id
    submission.isGraded = true

    await submission.save()

    return NextResponse.json({
      message: 'Grade submitted successfully',
      submission: {
        id: submission._id,
        grade: submission.grade,
        feedback: submission.feedback,
        gradedAt: submission.gradedAt
      }
    })

  } catch (error) {
    console.error('Grade submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
