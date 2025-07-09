import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import Resource from '@/models/Resource'
import Course from '@/models/Course'
import connectDB from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    await connectDB()
    
    const { filename } = await params

    // Get the authorization token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

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

    // Find the resource
    const resource = await Resource.findOne({ filename }).populate('course')
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this resource
    let hasAccess = false

    if (user.role === 'teacher') {
      // Teachers can access resources from their own courses
      hasAccess = resource.teacher.toString() === user._id.toString()
    } else if (user.role === 'student') {
      // Students can access resources from courses they're enrolled in
      const course = await Course.findById(resource.course._id)
      hasAccess = course && course.students.some((studentId: any) => 
        studentId.toString() === user._id.toString()
      )
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Read the file
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'resources', filename)
    
    try {
      const fileBuffer = await readFile(filePath)
      
      // Update download count
      await Resource.findByIdAndUpdate(resource._id, {
        $inc: { downloadCount: 1 }
      })

      // Return the file with proper headers
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': resource.mimeType,
          'Content-Disposition': `attachment; filename="${resource.originalName}"`,
          'Content-Length': resource.fileSize.toString(),
        },
      })
    } catch (fileError) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Error downloading resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}