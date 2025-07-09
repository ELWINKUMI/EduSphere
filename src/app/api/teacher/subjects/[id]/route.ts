import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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
        { error: 'Only teachers can update subjects' },
        { status: 403 }
      )
    }

    const { title, description, maxStudents, isActive } = await request.json()

    // Find the subject and verify ownership
    const subject = await Course.findOne({
      _id: params.id,
      teacher: teacher._id
    })

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found or you do not have permission to edit it' },
        { status: 404 }
      )
    }

    // Update the subject
    subject.title = title || subject.title
    subject.description = description || subject.description
    subject.maxStudents = maxStudents ? parseInt(maxStudents) : subject.maxStudents
    subject.isActive = isActive !== undefined ? isActive : subject.isActive
    subject.updatedAt = new Date()

    await subject.save()

    return NextResponse.json({
      message: 'Subject updated successfully',
      subject: {
        _id: subject._id,
        title: subject.title,
        subject: subject.subject,
        gradeLevel: subject.gradeLevel,
        description: subject.description,
        enrollmentCode: subject.enrollmentCode,
        maxStudents: subject.maxStudents,
        isActive: subject.isActive,
        updatedAt: subject.updatedAt
      }
    })

  } catch (error) {
    console.error('Update subject error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
        { error: 'Only teachers can delete subjects' },
        { status: 403 }
      )
    }

    // Find the subject and verify ownership
    const subject = await Course.findOne({
      _id: params.id,
      teacher: teacher._id
    })

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found or you do not have permission to delete it' },
        { status: 404 }
      )
    }

    // Check if subject has students enrolled
    if (subject.students.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete subject with enrolled students. Please remove all students first.' },
        { status: 400 }
      )
    }

    // Delete the subject
    await Course.findByIdAndDelete(params.id)

    return NextResponse.json({
      message: 'Subject deleted successfully'
    })

  } catch (error) {
    console.error('Delete subject error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
