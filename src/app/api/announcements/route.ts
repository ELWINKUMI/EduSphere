import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Announcement from '@/models/Announcement'
import Course from '@/models/Course'
import User from '@/models/User'

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
        { error: 'Only teachers can create announcements' },
        { status: 403 }
      )
    }

    const { title, content, courseId, priority, sendEmail, publishAt } = await request.json()

    // Validate input
    if (!title || !content || !courseId) {
      return NextResponse.json(
        { error: 'Title, content, and course are required' },
        { status: 400 }
      )
    }

    // Verify the course belongs to the teacher
    const course = await Course.findById(courseId)
    if (!course || course.teacher.toString() !== teacher._id.toString()) {
      return NextResponse.json(
        { error: 'You can only create announcements for your own courses' },
        { status: 403 }
      )
    }

    // Create announcement
    const announcement = new Announcement({
      title,
      content,
      course: courseId,
      teacher: teacher._id,
      priority: priority || 'normal',
      sendEmail: sendEmail || false,
      publishAt: publishAt ? new Date(publishAt) : new Date(),
      isPublished: !publishAt // If no publishAt time, publish immediately
    })

    await announcement.save()

    // Populate course and teacher info
    await announcement.populate('course', 'title subject gradeLevel')
    await announcement.populate('teacher', 'name')

    return NextResponse.json({
      message: 'Announcement created successfully',
      announcement
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating announcement:', error)
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

    let announcements

    if (user.role === 'teacher') {
      // Teachers see announcements for their courses
      const teacherCourses = await Course.find({ teacher: user._id })
      const courseIds = teacherCourses.map(course => course._id)
      
      announcements = await Announcement.find({ 
        course: { $in: courseIds },
        isPublished: true
      })
      .populate('course', 'title subject gradeLevel')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 })
    } else {
      // Students see announcements for their enrolled courses
      const studentCourses = await Course.find({ students: user._id })
      const courseIds = studentCourses.map(course => course._id)
      
      announcements = await Announcement.find({ 
        course: { $in: courseIds },
        isPublished: true,
        publishAt: { $lte: new Date() }
      })
      .populate('course', 'title subject gradeLevel')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 })
    }

    return NextResponse.json({ announcements })

  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}