import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Assignment from '@/models/Assignment'
import Course from '@/models/Course'
import User from '@/models/User'
import Submission from '@/models/Submission'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Await params in Next.js 15
    const { id } = await params
    
    const course = await Course.findById(id)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if student is enrolled in this course (for students)
    if (user.role === 'student') {
      const isEnrolled = course.students.some(
        (studentId: any) => studentId.toString() === user._id.toString()
      )
      
      if (!isEnrolled) {
        return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })
      }
    }

    // Get all assignments for this course
    const assignments = await Assignment.find({ 
      course: id, 
      isActive: true 
    })
    .select('title description dueDate maxPoints attachments submissionType')
    .sort({ dueDate: 1 })
    .lean()

    // Get submission status for each assignment (for students)
    if (user.role === 'student') {
      const assignmentsWithStatus = await Promise.all(
        assignments.map(async (assignment) => {
          const submission = await Submission.findOne({
            assignment: assignment._id,
            student: user._id
          }).lean() as (typeof Submission & { isGraded?: boolean; grade?: number; feedback?: string }) | null

          let status = 'pending'
          let grade = undefined
          let feedback = undefined

          if (submission) {
            if ((submission as any).isGraded) {
              status = 'graded'
              grade = (submission as any).grade
              feedback = (submission as any).feedback
            } else {
              status = 'submitted'
            }
          } else if (new Date() > new Date(assignment.dueDate)) {
            status = 'overdue'
          }

          return {
            ...assignment,
            status,
            grade,
            feedback
          }
        })
      )

      return NextResponse.json({ 
        success: true,
        assignments: assignmentsWithStatus 
      })
    }

    // For teachers, just return the assignments without status
    return NextResponse.json({ 
      success: true,
      assignments 
    })

  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
