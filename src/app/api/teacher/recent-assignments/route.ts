import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Assignment from '@/models/Assignment'
import Course from '@/models/Course'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

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

    // Get teacher's recent assignments
    const assignments = await Assignment.find({ 
      teacher: new mongoose.Types.ObjectId(decoded.userId)
    })
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()

    // Format assignments for display
    const formattedAssignments = assignments.map(assignment => {
      const dueDate = new Date(assignment.dueDate)
      const now = new Date()
      const diffTime = dueDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      let dueDateText = ''
      if (diffDays < 0) {
        dueDateText = `${Math.abs(diffDays)} days overdue`
      } else if (diffDays === 0) {
        dueDateText = 'Due today'
      } else if (diffDays === 1) {
        dueDateText = 'Due tomorrow'
      } else {
        dueDateText = `Due in ${diffDays} days`
      }

      return {
        id: assignment._id,
        title: assignment.title,
        course: assignment.course?.title || 'Unknown Course',
        due: dueDateText,
        submissions: assignment.submissions?.length || 0
      }
    })

    return NextResponse.json({
      assignments: formattedAssignments
    })

  } catch (error) {
    console.error('Get recent assignments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
