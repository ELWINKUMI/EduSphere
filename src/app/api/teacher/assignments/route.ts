import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Assignment from '@/models/Assignment'
import Course from '@/models/Course'
import User from '@/models/User'
import Submission from '@/models/Submission'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const teacher = await User.findById(decoded.userId)
    
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get all assignments created by this teacher
    const assignments = await Assignment.find({ teacher: teacher._id })
      .populate('course', 'title subject gradeLevel')
      .sort({ createdAt: -1 })
      .lean()

    // Get submission counts for each assignment
    const assignmentsWithCounts = await Promise.all(
      assignments.map(async (assignment) => {
        const submissionCount = await Submission.countDocuments({
          assignment: assignment._id
        })

        return {
          ...assignment,
          submissionCount
        }
      })
    )

    return NextResponse.json({
      success: true,
      assignments: assignmentsWithCounts
    })

  } catch (error) {
    console.error('Error fetching teacher assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
