import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Resource from '@/models/Resource'
import Course from '@/models/Course'
import User from '@/models/User'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
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

    const teacher = await User.findById(decoded.userId)
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can upload resources' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const courseId = formData.get('courseId') as string
    const type = formData.get('type') as string
    const file = formData.get('file') as File

    // Validate input
    if (!title || !courseId || !file) {
      return NextResponse.json(
        { error: 'Title, course, and file are required' },
        { status: 400 }
      )
    }

    // Verify the course belongs to the teacher
    const course = await Course.findById(courseId)
    if (!course || course.teacher.toString() !== teacher._id.toString()) {
      return NextResponse.json(
        { error: 'You can only upload resources to your own courses' },
        { status: 403 }
      )
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resources')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const filePath = path.join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create resource record
    const resource = new Resource({
      title,
      description: description || '',
      course: courseId,
      teacher: teacher._id,
      type: type || 'document',
      filename,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      url: `/uploads/resources/${filename}`
    })

    await resource.save()

    // Populate course and teacher info
    await resource.populate('course', 'title subject gradeLevel')
    await resource.populate('teacher', 'name')

    return NextResponse.json({
      message: 'Resource uploaded successfully',
      resource
    }, { status: 201 })

  } catch (error) {
    console.error('Error uploading resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
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

    let resources

    if (user.role === 'teacher') {
      // Teachers see resources for their courses
      const teacherCourses = await Course.find({ teacher: user._id })
      const courseIds = teacherCourses.map(course => course._id)
      
      resources = await Resource.find({ 
        course: { $in: courseIds }
      })
      .populate('course', 'title subject gradeLevel')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 })
    } else {
      // Students see resources for their enrolled courses
      const studentCourses = await Course.find({ students: user._id })
      const courseIds = studentCourses.map(course => course._id)
      
      resources = await Resource.find({ 
        course: { $in: courseIds }
      })
      .populate('course', 'title subject gradeLevel')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 })
    }

    return NextResponse.json({ resources })

  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}