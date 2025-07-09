import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Assignment from '@/models/Assignment'
import Submission from '@/models/Submission'
import User from '@/models/User'
import Course from '@/models/Course'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id: assignmentId } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId)
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(assignment.course)
    if (!course || !course.students.includes(user._id)) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })
    }

    // Check if assignment is still active and not overdue
    if (!assignment.isActive) {
      return NextResponse.json({ error: 'Assignment is no longer active' }, { status: 400 })
    }

    if (new Date() > new Date(assignment.dueDate)) {
      return NextResponse.json({ error: 'Assignment deadline has passed' }, { status: 400 })
    }

    // Check if student has already submitted
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: user._id
    })

    if (existingSubmission) {
      return NextResponse.json({ error: 'Assignment already submitted' }, { status: 400 })
    }

    // Parse form data
    const formData = await request.formData()
    const content = formData.get('content') as string || ''
    const files = formData.getAll('files') as File[]

    console.log('Submission data:', {
      assignmentId,
      userId: user._id,
      content: content.substring(0, 50) + '...',
      filesCount: files.length,
      submissionType: assignment.submissionType
    })

    // Validate based on submission type
    if (assignment.submissionType === 'text' && !content.trim()) {
      return NextResponse.json({ error: 'Text content is required for this assignment' }, { status: 400 })
    }
    
    if (assignment.submissionType === 'file' && files.length === 0) {
      return NextResponse.json({ error: 'File upload is required for this assignment' }, { status: 400 })
    }
    
    if (assignment.submissionType === 'both' && !content.trim() && files.length === 0) {
      return NextResponse.json({ error: 'Please provide either text content or upload files' }, { status: 400 })
    }

    // Handle file uploads
    const uploadedFiles: string[] = []
    if (files.length > 0) {
      for (const file of files) {
        if (file && file.size > 0) {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          // Create unique filename
          const filename = `${Date.now()}-${user._id}-${file.name}`
          const filepath = path.join(process.cwd(), 'public/uploads/submissions', filename)
          
          // Ensure directory exists
          const uploadDir = path.dirname(filepath)
          const fs = await import('fs')
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
          }
          
          await writeFile(filepath, buffer)
          uploadedFiles.push(filename)
        }
      }
    }

    // Create submission
    const submission = new Submission({
      assignment: assignmentId,
      student: user._id,
      content: content.trim(),
      files: uploadedFiles,
      submittedAt: new Date(),
      isLate: new Date() > new Date(assignment.dueDate),
      isGraded: false
    })

    await submission.save()

    // Add submission to assignment's submissions array
    assignment.submissions.push(submission._id)
    await assignment.save()

    return NextResponse.json({
      success: true,
      message: 'Assignment submitted successfully',
      submission: {
        _id: submission._id,
        content: submission.content,
        files: submission.files,
        submittedAt: submission.submittedAt,
        isLate: submission.isLate,
        isGraded: submission.isGraded
      }
    })

  } catch (error: any) {
    console.error('Error submitting assignment:', error)
    console.error('Error stack:', error.stack)
    console.error('Error message:', error.message)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
