import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

export async function DELETE(request: NextRequest) {
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
        { error: 'Only teachers can remove students' },
        { status: 403 }
      )
    }

    const { studentId, courseId } = await request.json()

    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: 'Student ID and Course ID are required' },
        { status: 400 }
      )
    }

    // Verify the course belongs to the teacher
    const course = await Course.findOne({
      _id: courseId,
      teacher: teacher._id
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or you do not have permission' },
        { status: 404 }
      )
    }

    // Remove student from course
    course.students = course.students.filter(
      (id: any) => id.toString() !== studentId
    )

    await course.save()

    return NextResponse.json({
      message: 'Student removed from subject successfully'
    })

  } catch (error) {
    console.error('Remove student error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
