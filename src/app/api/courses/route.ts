import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import { ALL_GRADES, getSubjectsForGrade } from '@/lib/schoolConfig'

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
        { error: 'Only teachers can create courses' },
        { status: 403 }
      )
    }

    const { title, subject, gradeLevel, description, maxStudents, enrollmentCode } = await request.json()

    // Validate input
    if (!title || !subject || !gradeLevel || !description) {
      return NextResponse.json(
        { error: 'Title, subject, grade level, and description are required' },
        { status: 400 }
      )
    }

    // Validate grade level
    if (!ALL_GRADES.includes(gradeLevel)) {
      return NextResponse.json(
        { error: 'Invalid grade level' },
        { status: 400 }
      )
    }

    // Validate subject for grade level
    const allowedSubjects = getSubjectsForGrade(gradeLevel)
    if (!allowedSubjects.includes(subject)) {
      return NextResponse.json(
        { error: `Subject "${subject}" is not available for ${gradeLevel}` },
        { status: 400 }
      )
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({
      subject,
      gradeLevel,
      teacher: teacher._id
    })

    if (existingCourse) {
      return NextResponse.json(
        { error: `You already have a course for ${subject} in ${gradeLevel}` },
        { status: 409 }
      )
    }

    // Generate enrollment code if not provided
    const finalEnrollmentCode = enrollmentCode ||
      `${subject.substring(0, 3).toUpperCase()}${gradeLevel.replace(/\s/g, '')}${Math.random().toString(36).substring(2, 5).toUpperCase()}`

    // Check if enrollment code already exists
    const existingCode = await Course.findOne({ enrollmentCode: finalEnrollmentCode })
    if (existingCode) {
      return NextResponse.json(
        { error: 'Enrollment code already exists. Please generate a new one.' },
        { status: 409 }
      )
    }

    // Create course
    const course = new Course({
      title: title || `${subject} - ${gradeLevel}`,
      description,
      subject,
      gradeLevel,
      teacher: teacher._id,
      enrollmentCode: finalEnrollmentCode,
      code: finalEnrollmentCode,
      maxStudents: maxStudents ? parseInt(maxStudents) : 30,
      students: [],
      assignments: [],
      quizzes: [],
      resources: [],
      announcements: [],
      isActive: true
    })

    await course.save()

    return NextResponse.json({
      message: 'Course created successfully',
      course: {
        id: course._id.toString(),
        title: course.title,
        subject: course.subject,
        gradeLevel: course.gradeLevel,
        code: course.code
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create course error:', error)
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

    // Find user and check role
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let courses = [];
    if (user.role === 'teacher') {
      // Teacher: return simplified courses they teach
      courses = await Course.find({ teacher: user._id })
        .sort({ createdAt: -1 })
        .select('title subject gradeLevel enrollmentCode isActive createdAt')
        .lean();

      courses = courses.map((c: any) => ({
        id: c._id?.toString?.() || '',
        title: c.title,
        subject: c.subject,
        gradeLevel: c.gradeLevel,
        enrollmentCode: c.enrollmentCode,
        isActive: c.isActive,
        createdAt: c.createdAt,
        code: c.enrollmentCode
      }));
    } else if (user.role === 'student') {
      // Student: return simplified courses they are enrolled in, with teacher's name/email
      courses = await Course.find({ students: user._id })
        .sort({ createdAt: -1 })
        .select('title subject gradeLevel enrollmentCode teacher isActive createdAt')
        .populate({ path: 'teacher', select: 'name email' })
        .lean();

      courses = courses.map((c: any) => ({
        id: c._id?.toString?.() || '',
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
    } else {
      return NextResponse.json(
        { error: 'Unauthorized role' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      courses: courses
    });

  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}