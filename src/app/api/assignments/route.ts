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
    let title: string, description: string, courseId: string, dueDate: string, maxPoints: number, submissionType: string, attachmentFiles: File[], attempts: number
    
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
      attempts = parseInt(formData.get('attempts') as string) || 1
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
      attempts = parseInt(body.attempts) || 1
      attachmentFiles = []
    }

    // Validate input
    if (!title || !description || !courseId || !dueDate || !maxPoints) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID format. Please select a valid course.' },
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

    // Create assignment (include attempts)
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
      isActive: true,
      attempts // <-- add this!
    })

    await assignment.save()

    // Add assignment to course
    await Course.findByIdAndUpdate(courseId, {
      $push: { assignments: assignment._id }
    })

    // Notify all students in the course
    const Notification = (await import('@/models/Notification')).default;
    const courseWithStudents = await Course.findById(courseId).select('students');
    if (courseWithStudents && Array.isArray(courseWithStudents.students)) {
      const notifications = courseWithStudents.students.map((studentId: any) => ({
        student: studentId,
        type: 'other',
        content: `New assignment: ${assignment.title} has been posted.`,
        read: false
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    return NextResponse.json({
      message: 'Assignment created successfully',
      assignment: {
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        maxPoints: assignment.maxPoints,
        course: course.title,
        attempts: assignment.attempts // include attempts in response
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
    let courses: any[] = [];

    if (user.role === 'teacher') {
      // Get teacher's courses
      courses = await Course.find({ teacher: user._id });
      courses = courses.map((c: any) => ({
        _id: c._id?.toString?.() || '',
        title: c.title,
        subject: c.subject,
        gradeLevel: c.gradeLevel,
        enrollmentCode: c.enrollmentCode,
        isActive: c.isActive,
        createdAt: c.createdAt,
        code: c.enrollmentCode
      }));
      // Get teacher's assignments
      assignments = await Assignment.find({ teacher: user._id })
        .populate('course', 'title gradeLevel subject')
        .populate('submissions')
        .sort({ createdAt: -1 })
        .lean();
      // Add submissionCount and attempts to each assignment
      assignments = assignments.map(a => ({
        ...a,
        submissionCount: Array.isArray(a.submissions) ? a.submissions.length : 0,
        attempts: a.attempts ?? 1
      }));
    } else if (user.role === 'student') {
      // Get student's courses
      courses = await Course.find({ gradeLevel: user.gradeLevel }).populate('teacher', 'name email');
      courses = courses.map((c: any) => ({
        _id: c._id?.toString?.() || '',
        title: c.title,
        subject: c.subject,
        gradeLevel: c.gradeLevel,
        enrollmentCode: c.enrollmentCode,
        isActive: c.isActive,
        createdAt: c.createdAt,
        code: c.enrollmentCode,
        teacher: c.teacher && c.teacher.name
          ? { name: c.teacher.name, email: c.teacher.email }
          : { name: 'Unknown', email: '' }
      }));
      const courseIds = courses.map(c => c._id);
      assignments = await Assignment.find({ 
        course: { $in: courseIds },
        isActive: true 
      })
        .populate('course', 'title gradeLevel subject')
        .populate('teacher', 'name')
        .sort({ dueDate: 1 })
        .lean();
      // Ensure attempts is present for students
      assignments = assignments.map(a => ({
        ...a,
        attempts: a.attempts ?? 1
      }));
    }

    return NextResponse.json({
      assignments: assignments.map(a => ({
        ...a,
        dueDate: a.dueDate instanceof Date ? a.dueDate.toISOString() : (a.dueDate ? new Date(a.dueDate).toISOString() : null),
        attempts: a.attempts ?? 1
      })),
      courses: courses
    })

  } catch (error) {
    console.error('Get assignments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}