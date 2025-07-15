import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Assignment from '@/models/Assignment'
import Submission from '@/models/Submission'
import User from '@/models/User'
import Course from '@/models/Course'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Find the assignment and populate related data
    const assignment = await Assignment.findById(id)
      .populate('course', 'title subject gradeLevel')
      .populate('teacher', 'name')
      .lean()

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Check if student is enrolled in the course
    const courseId = (assignment as any).course?._id || (assignment as any).course
    const course = await Course.findById(courseId)
    
    if (
      !course ||
      !course.students.some((studentId: unknown) => (studentId as any).toString() === user._id.toString())
    ) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })
    }

    // Get only the latest submission for this assignment/user (not all attempts)
    const latestSubmission = await Submission.findOne({
      assignment: id,
      student: user._id
    }).sort({ submittedAt: -1 }).lean()

    // Make sure attempts is always included, defaulting to 1 if not set
    const assignmentWithAttempts = !Array.isArray(assignment)
      ? { ...assignment, attempts: (assignment as any).attempts ?? 1 }
      : assignment

    // Include attemptCount in the submission if available, default to 0 if not submitted yet
    let submissionWithAttempts = null;
    if (latestSubmission) {
      submissionWithAttempts = {
        ...latestSubmission,
        attemptCount: (latestSubmission as any).attemptCount ?? 1
      }
    }

    return NextResponse.json({
      success: true,
      assignment: assignmentWithAttempts,
      submission: submissionWithAttempts // return latest submission with attemptCount
    })

  } catch (error) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const teacher = await User.findById(decoded.userId)
    
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if assignment exists and belongs to teacher
    const assignment = await Assignment.findById(id)
    if (!assignment || assignment.teacher.toString() !== teacher._id.toString()) {
      return NextResponse.json({ error: 'Assignment not found or unauthorized' }, { status: 404 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dueDate = formData.get('dueDate') as string
    const maxPoints = parseInt(formData.get('maxPoints') as string)
    const submissionType = formData.get('submissionType') as string
    const existingAttachmentsStr = formData.get('existingAttachments') as string
    // If attempts is 0 or 999, it means unlimited attempts
    const attemptsRaw = formData.get('attempts') as string
    const attempts = attemptsRaw === "0" || attemptsRaw === "999"
      ? 999
      : parseInt(attemptsRaw) || 1

    let existingAttachments: string[] = []
    try {
      existingAttachments = JSON.parse(existingAttachmentsStr || '[]')
    } catch (e) {
      existingAttachments = []
    }

    // Handle file uploads
    const newFiles: string[] = []
    const attachmentFiles = formData.getAll('attachments') as File[]
    
    for (const file of attachmentFiles) {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Create unique filename
        const filename = `${Date.now()}-${file.name}`
        const filepath = path.join(process.cwd(), 'public/uploads/assignments', filename)
        
        // Ensure directory exists
        const uploadDir = path.dirname(filepath)
        await import('fs').then(fs => {
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
          }
        })
        
        await writeFile(filepath, buffer)
        newFiles.push(filename)
      }
    }

    // Remove deleted files from filesystem
    const deletedFiles = assignment.attachments.filter(
      (filename: string) => !existingAttachments.includes(filename)
    )
    
    for (const filename of deletedFiles) {
      try {
        const filepath = path.join(process.cwd(), 'public/uploads/assignments', filename)
        await unlink(filepath)
      } catch (error) {
        console.error('Error deleting file:', filename, error)
      }
    }

    // Update assignment - include attempts!
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      {
        title,
        description,
        dueDate: new Date(dueDate),
        maxPoints,
        submissionType,
        attachments: [...existingAttachments, ...newFiles],
        attempts // <-- update attempts property!
      },
      { new: true }
    ).populate('course', 'title subject gradeLevel')

    return NextResponse.json({
      success: true,
      assignment: updatedAssignment
    })

  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const teacher = await User.findById(decoded.userId)
    
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if assignment exists and belongs to teacher
    const assignment = await Assignment.findById(id)
    if (!assignment || assignment.teacher.toString() !== teacher._id.toString()) {
      return NextResponse.json({ error: 'Assignment not found or unauthorized' }, { status: 404 })
    }

    // Delete associated files
    for (const filename of assignment.attachments) {
      try {
        const filepath = path.join(process.cwd(), 'public/uploads/assignments', filename)
        await unlink(filepath)
      } catch (error) {
        console.error('Error deleting file:', filename, error)
      }
    }

    // Delete the assignment
    await Assignment.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Assignment deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting assignment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}