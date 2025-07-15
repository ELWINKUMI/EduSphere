import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

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
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'name' in err && err.name === 'TokenExpiredError') {
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Await params for Next.js 14+ dynamic route
    const { id } = await params

    // Validate ObjectId
    if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid course id' }, { status: 400 })
    }

    const course = await Course.findById(id)
      .populate('teacher', 'name email')
      .populate('students', 'name email gradeLevel')

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if student is enrolled in this course (for students)
    if (user.role === 'student') {
      const isEnrolled = course.students.some(
        (student: any) => student._id.toString() === user._id.toString()
      )
      if (!isEnrolled) {
        return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })
      }
    }

    // Check if teacher owns this course (for teachers)
    if (user.role === 'teacher') {
      if (course.teacher._id.toString() !== user._id.toString()) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Transform the course data for the frontend
    const courseData = {
      id: course._id.toString(),
      title: course.title,
      subject: course.subject,
      gradeLevel: course.gradeLevel,
      description: course.description,
      teacher: {
        id: course.teacher._id.toString(),
        name: course.teacher.name,
        email: course.teacher.email,
      },
      maxStudents: course.maxStudents,
      enrollmentCode: course.enrollmentCode,
      enrolledStudents: course.students.map((student: any) => ({
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        gradeLevel: student.gradeLevel,
      })),
      createdAt: course.createdAt,
    }

    return NextResponse.json({
      course: courseData,
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}