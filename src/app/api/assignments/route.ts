import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Assignment from '@/models/Assignment'
import Course from '@/models/Course'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { writeFile } from 'fs/promises'
import path from 'path'

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

    // Verify user is a teacher
    const teacher = await User.findById(decoded.userId)
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can create assignments' },
        { status: 403 }
      )
    }

    // Handle both FormData (with files) and JSON requests
    let title: string, description: string, courseId: string, dueDate: string, maxPoints: number, submissionType: string, attachmentFiles: File[]
    
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with file uploads)
      const formData = await request.formData()
      title = formData.get('title') as string
      description = formData.get('description') as string
      courseId = formData.get('course') as string
      dueDate = formData.get('dueDate') as string
      maxPoints = parseInt(formData.get('maxPoints') as string)
      submissionType = formData.get('submissionType') as string || 'both'
      attachmentFiles = formData.getAll('attachments') as File[]
    } else {
      // Handle JSON request
      const body = await request.json()
      title = body.title
      description = body.description
      courseId = body.courseId
      dueDate = body.dueDate
      maxPoints = body.maxPoints
      submissionType = body.submissionType || 'both'
      attachmentFiles = []
    }

    // Validate input
    if (!title || !description || !courseId || !dueDate || !maxPoints) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Verify course belongs to teacher
    const course = await Course.findById(courseId)
    if (!course || course.teacher.toString() !== teacher._id.toString()) {
      return NextResponse.json(
        { error: 'Course not found or you do not have permission to create assignments for this course' },
        { status: 403 }
      )
    }

    // Handle file uploads
    const attachments: string[] = []
    if (attachmentFiles && attachmentFiles.length > 0) {
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
          attachments.push(filename)
        }
      }
    }

    // Create assignment
    const assignment = new Assignment({
      title,
      description,
      course: courseId,
      teacher: teacher._id,
      startDate: new Date(),
      dueDate: new Date(dueDate),
      maxPoints: maxPoints,
      attachments,
      submissionType: submissionType || 'both',
      submissions: [],
      isActive: true
    })

    await assignment.save()

    // Add assignment to course
    await Course.findByIdAndUpdate(courseId, {
      $push: { assignments: assignment._id }
    })

    return NextResponse.json({
      message: 'Assignment created successfully',
      assignment: {
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        maxPoints: assignment.maxPoints,
        course: course.title
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create assignment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let assignments: any[] = []

    if (user.role === 'teacher') {
      // Get teacher's assignments
      assignments = await Assignment.find({ teacher: user._id })
        .populate('course', 'title gradeLevel subject')
        .sort({ createdAt: -1 })
        .lean()
    } else if (user.role === 'student') {
      // Get assignments for student's grade level
      const courses = await Course.find({ gradeLevel: user.gradeLevel })
      const courseIds = courses.map(c => c._id)
      
      assignments = await Assignment.find({ 
        course: { $in: courseIds },
        isActive: true 
      })
        .populate('course', 'title gradeLevel subject')
        .populate('teacher', 'name')
        .sort({ dueDate: 1 })
        .lean()
    }

    return NextResponse.json({
      assignments: assignments
    })

  } catch (error) {
    console.error('Get assignments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
