import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Assignment from '@/models/Assignment'
import Submission from '@/models/Submission'
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

    // Verify user is a teacher (only teachers should be able to process overdue assignments)
    const user = await User.findById(decoded.userId)
    if (!user || user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can process overdue assignments' },
        { status: 403 }
      )
    }

    const now = new Date()
    
    // Find all overdue assignments that are still active
    const overdueAssignments = await Assignment.find({
      dueDate: { $lt: now },
      isActive: true
    }).populate('course')

    let processedCount = 0
    let createdSubmissions = 0

    for (const assignment of overdueAssignments) {
      // Get all students enrolled in this assignment's course
      const course = assignment.course as any
      if (!course || !course.students) continue

      // Get existing submissions for this assignment
      const existingSubmissions = await Submission.find({
        assignment: assignment._id
      }).select('student')

      const submittedStudentIds = existingSubmissions.map(sub => sub.student.toString())

      // Find students who haven't submitted
      const studentsWhoDidntSubmit = course.students.filter(
        (studentId: any) => !submittedStudentIds.includes(studentId.toString())
      )

      // Create 0-grade submissions for students who didn't submit
      for (const studentId of studentsWhoDidntSubmit) {
        const zeroSubmission = new Submission({
          assignment: assignment._id,
          student: studentId,
          content: 'No submission - automatically graded as 0 due to missed deadline',
          files: [],
          submittedAt: assignment.dueDate, // Use due date as submission date
          grade: 0,
          feedback: 'Assignment not submitted by deadline. Automatic grade: 0/' + assignment.maxPoints,
          gradedAt: now,
          gradedBy: user._id, // The teacher who triggered the process
          isGraded: true,
          isLate: true
        })

        await zeroSubmission.save()
        createdSubmissions++
      }

      processedCount++
    }

    console.log(`Processed ${processedCount} overdue assignments, created ${createdSubmissions} zero-grade submissions`)

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} overdue assignments`,
      processedAssignments: processedCount,
      createdSubmissions: createdSubmissions
    })

  } catch (error) {
    console.error('Process overdue assignments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
