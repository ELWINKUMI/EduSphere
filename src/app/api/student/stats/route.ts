import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Course from '@/models/Course'
import Assignment from '@/models/Assignment'
import Quiz from '@/models/Quiz'
import Submission from '@/models/Submission'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

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

    // Verify user is a student
    const student = await User.findById(decoded.userId)
    if (!student || student.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can view these stats' },
        { status: 403 }
      )
    }

    // Get courses for student's grade level
    const enrolledCourses = await Course.countDocuments({ 
      gradeLevel: student.gradeLevel,
      isActive: true
    })

    // Get assignments for student's grade level
    const gradeAssignments = await Assignment.find({ 
      course: { $in: await Course.find({ gradeLevel: student.gradeLevel }).select('_id') },
      isActive: true
    }).select('_id')

    const assignmentIds = gradeAssignments.map(a => a._id)
    
    const submittedAssignments = await Submission.find({
      student: new mongoose.Types.ObjectId(student._id),
      assignment: { $in: assignmentIds }
    }).select('assignment')

    const submittedAssignmentIds = submittedAssignments.map(s => s.assignment.toString())
    const pendingAssignments = assignmentIds.length - submittedAssignmentIds.length

    // Get upcoming quizzes for student's grade level
    const now = new Date()
    const upcomingQuizzes = await Quiz.countDocuments({
      course: { $in: await Course.find({ gradeLevel: student.gradeLevel }).select('_id') },
      endDate: { $gt: now },
      isActive: true
    })

    // Calculate overall grade (percentage-based average)
    const gradedSubmissions = await Submission.find({
      student: new mongoose.Types.ObjectId(student._id),
      isGraded: true,
      grade: { $exists: true }
    }).populate('assignment', 'maxPoints').select('grade assignment')

    let overallGrade = 'N/A'
    if (gradedSubmissions.length > 0) {
      let totalPercentage = 0
      let validSubmissions = 0

      for (const submission of gradedSubmissions) {
        const assignment = submission.assignment as any
        if (assignment && assignment.maxPoints > 0) {
          const percentage = (submission.grade / assignment.maxPoints) * 100
          totalPercentage += percentage
          validSubmissions++
        }
      }

      if (validSubmissions > 0) {
        const averagePercentage = totalPercentage / validSubmissions
        
        if (averagePercentage >= 97) overallGrade = 'A+'
        else if (averagePercentage >= 93) overallGrade = 'A'
        else if (averagePercentage >= 90) overallGrade = 'A-'
        else if (averagePercentage >= 87) overallGrade = 'B+'
        else if (averagePercentage >= 83) overallGrade = 'B'
        else if (averagePercentage >= 80) overallGrade = 'B-'
        else if (averagePercentage >= 77) overallGrade = 'C+'
        else if (averagePercentage >= 73) overallGrade = 'C'
        else if (averagePercentage >= 70) overallGrade = 'C-'
        else if (averagePercentage >= 67) overallGrade = 'D+'
        else if (averagePercentage >= 63) overallGrade = 'D'
        else if (averagePercentage >= 60) overallGrade = 'D-'
        else overallGrade = 'F'
        
        console.log('Grade calculation:', {
          validSubmissions,
          totalPercentage,
          averagePercentage,
          overallGrade
        })
      }
    }

    return NextResponse.json({
      enrolledCourses,
      pendingAssignments,
      upcomingQuizzes,
      overallGrade
    })

  } catch (error) {
    console.error('Get student stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
