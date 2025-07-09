import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import User from '@/models/User'
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

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Only teachers can view this data' }, { status: 403 })
    }

    // Find the course and verify teacher owns it
    const course = await Course.findById(courseId).populate('students', 'name email createdAt')
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }

    if (course.teacher.toString() !== decoded.userId) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    // Format student data
    const students = course.students.map((student: any) => ({
      _id: student._id,
      name: student.name,
      email: student.email,
      enrolledAt: student.createdAt
    }))

    return NextResponse.json({
      students
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching course students:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
