import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

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
        { error: 'Only students can enroll in courses' },
        { status: 403 }
      )
    }

    const { enrollmentCode } = await request.json()

    if (!enrollmentCode) {
      return NextResponse.json(
        { error: 'Enrollment code is required' },
        { status: 400 }
      )
    }

    // Find course by enrollment code
    const course = await Course.findOne({ 
      enrollmentCode: enrollmentCode.trim().toUpperCase() 
    }).populate('teacher', 'name')

    if (!course) {
      return NextResponse.json(
        { error: 'Invalid enrollment code' },
        { status: 404 }
      )
    }

    // Check if student's grade level matches course grade level
    if (student.gradeLevel !== course.gradeLevel) {
      return NextResponse.json(
        { error: `This course is for ${course.gradeLevel} students only` },
        { status: 400 }
      )
    }

    // Check if student is already enrolled
    if (course.students && course.students.includes(student._id)) {
      return NextResponse.json(
        { error: 'You are already enrolled in this course' },
        { status: 409 }
      )
    }

    // Check if course is full
    const currentEnrollment = course.students ? course.students.length : 0
    if (currentEnrollment >= course.maxStudents) {
      return NextResponse.json(
        { error: 'Course is full' },
        { status: 400 }
      )
    }

    // Enroll student in course
    await Course.findByIdAndUpdate(course._id, {
      $addToSet: { students: student._id }
    })

    return NextResponse.json({
      message: 'Successfully enrolled in course',
      course: {
        id: course._id,
        title: course.title,
        subject: course.subject,
        gradeLevel: course.gradeLevel,
        teacher: course.teacher.name
      }
    })

  } catch (error) {
    console.error('Course enrollment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
