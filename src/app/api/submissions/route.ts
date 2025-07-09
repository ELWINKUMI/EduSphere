import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Submission from '@/models/Submission'
import Assignment from '@/models/Assignment'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export async function POST(request: NextRequest) {
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
        { error: 'Only students can submit assignments' },
        { status: 403 }
      )
    }

    const { assignmentId, content, files } = await request.json()

    // Validate input
    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    // Verify assignment exists and is active
    const assignment = await Assignment.findById(assignmentId)
    if (!assignment || !assignment.isActive) {
      return NextResponse.json(
        { error: 'Assignment not found or no longer active' },
        { status: 404 }
      )
    }

    // Check if assignment is past due date
    const now = new Date()
    const isLate = now > assignment.dueDate

    // Check if student already submitted
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: student._id
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted this assignment' },
        { status: 409 }
      )
    }

    // Create submission
    const submission = new Submission({
      assignment: assignmentId,
      student: student._id,
      content: content || '',
      files: files || [],
      submittedAt: now,
      isLate,
      isGraded: false
    })

    await submission.save()

    // Add submission to assignment
    await Assignment.findByIdAndUpdate(assignmentId, {
      $push: { submissions: submission._id }
    })

    return NextResponse.json({
      message: 'Assignment submitted successfully',
      submission: {
        id: submission._id,
        submittedAt: submission.submittedAt,
        isLate: submission.isLate
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Submit assignment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const url = new URL(request.url)
    const assignmentId = url.searchParams.get('assignmentId')
    let submissions: any[] = []

    if (user.role === 'student') {
      // Get student's submissions
      const query: any = { student: user._id }
      if (assignmentId) {
        query.assignment = assignmentId
      }

      submissions = await Submission.find(query)
        .populate('assignment', 'title dueDate maxPoints course')
        .populate({
          path: 'assignment',
          populate: {
            path: 'course',
            select: 'title subject gradeLevel'
          }
        })
        .sort({ submittedAt: -1 })
        .lean()
    } else if (user.role === 'teacher') {
      // Get submissions for teacher's assignments
      let teacherAssignments
      if (assignmentId) {
        // Verify teacher owns this assignment
        teacherAssignments = await Assignment.find({ 
          _id: assignmentId, 
          teacher: user._id 
        })
      } else {
        teacherAssignments = await Assignment.find({ teacher: user._id })
      }
      
      const assignmentIds = teacherAssignments.map(a => a._id)
      
      submissions = await Submission.find({ 
        assignment: { $in: assignmentIds }
      })
        .populate('assignment', 'title dueDate maxPoints teacher')
        .populate('student', 'name gradeLevel')
        .sort({ submittedAt: -1 })
        .lean()
    }

    return NextResponse.json({
      submissions: submissions
    })

  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
