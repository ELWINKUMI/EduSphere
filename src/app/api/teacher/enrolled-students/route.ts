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
        { error: 'Only teachers can view enrolled students' },
        { status: 403 }
      )
    }

    // Get teacher's courses with enrolled students
    const courses = await Course.find({ teacher: teacher._id })
      .populate('students', 'name gradeLevel')
      .select('title subject gradeLevel students')

    // Create a map of unique students with their enrolled subjects
    const studentMap = new Map()

    courses.forEach(course => {
      course.students.forEach((student: any) => {
        if (!studentMap.has(student._id.toString())) {
          studentMap.set(student._id.toString(), {
            _id: student._id,
            name: student.name,
            gradeLevel: student.gradeLevel,
            enrolledSubjects: []
          })
        }
        
        const studentData = studentMap.get(student._id.toString())
        studentData.enrolledSubjects.push({
          _id: course._id,
          title: course.title,
          subject: course.subject,
          gradeLevel: course.gradeLevel
        })
      })
    })

    const enrolledStudents = Array.from(studentMap.values())

    return NextResponse.json({
      students: enrolledStudents
    })

  } catch (error) {
    console.error('Get enrolled students error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
