import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

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

    // Verify user is a teacher
    const teacher = await User.findById(decoded.userId)
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can view subjects' },
        { status: 403 }
      )
    }

    // Get teacher's subjects (courses)
    const subjects = await Course.find({ teacher: teacher._id })
      .populate('students', 'name gradeLevel')
      .sort({ createdAt: -1 })

    const formattedSubjects = subjects.map(subject => ({
      _id: subject._id,
      title: subject.title,
      subject: subject.subject,
      gradeLevel: subject.gradeLevel,
      description: subject.description,
      enrollmentCode: subject.enrollmentCode,
      maxStudents: subject.maxStudents,
      currentStudents: subject.students.length,
      students: subject.students,
      isActive: subject.isActive,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt
    }))

    return NextResponse.json({
      subjects: formattedSubjects
    })

  } catch (error) {
    console.error('Get teacher subjects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
