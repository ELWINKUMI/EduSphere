import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Course from '@/models/Course'
import Assignment from '@/models/Assignment'
import Submission from '@/models/Submission'
import Quiz from '@/models/Quiz'
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
        { error: 'Only teachers can view stats' },
        { status: 403 }
      )
    }

    // Get total students count (all students in the school)
    const studentsCount = await User.countDocuments({ 
      role: 'student' 
    })

    // Get teacher's courses count
    const coursesCount = await Course.countDocuments({ 
      teacher: teacher._id 
    })

    // Get pending assignments (assignments with submissions that need grading)
    // Count ungraded submissions for teacher's courses
    const teacherCourses = await Course.find({ teacher: teacher._id }).select('_id')
    const courseIds = teacherCourses.map(c => c._id)
    
    const teacherAssignments = await Assignment.find({ course: { $in: courseIds } }).select('_id')
    const assignmentIds = teacherAssignments.map(a => a._id)
    
    const pendingSubmissions = await Submission.countDocuments({
      assignment: { $in: assignmentIds },
      isGraded: false
    })

    // Get today's quizzes from teacher's courses
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    
    const todayQuizzes = await Quiz.countDocuments({
      course: { $in: courseIds },
      $or: [
        {
          startDate: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        },
        {
          endDate: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        }
      ]
    })

    return NextResponse.json({
      totalStudents: studentsCount,
      totalCourses: coursesCount,
      pendingAssignments: pendingSubmissions,
      todayQuizzes: todayQuizzes
    })

  } catch (error) {
    console.error('Get teacher stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
