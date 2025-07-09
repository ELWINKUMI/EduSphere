import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
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

    // Find the course 
    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }

    // Verify access based on role
    if (decoded.role === 'student') {
      if (!course.students.includes(decoded.userId)) {
        return NextResponse.json({ message: 'You are not enrolled in this course' }, { status: 403 })
      }
    } else if (decoded.role === 'teacher') {
      if (course.teacher.toString() !== decoded.userId) {
        return NextResponse.json({ message: 'You do not have access to this course' }, { status: 403 })
      }
    } else {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    // For now, return empty resources array - this can be expanded when Resource model is created
    const resources: any[] = []

    return NextResponse.json({
      resources
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching course resources:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
