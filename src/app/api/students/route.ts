import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import { ALL_GRADES } from '@/lib/schoolConfig'

// Generate a unique userId (8-digit string)
function generateUserId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

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
        { error: 'Only teachers can create students' },
        { status: 403 }
      )
    }

    const { name, pin, gradeLevel } = await request.json()

    // Validate input
    if (!name || !pin || !gradeLevel) {
      return NextResponse.json(
        { error: 'Name, PIN, and grade level are required' },
        { status: 400 }
      )
    }

    // Validate PIN format
    if (!/^[0-9]{5}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN must be exactly 5 digits' },
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

    // Check if student with same name and pin already exists
    const existingStudent = await User.findOne({ name: name.trim(), pin })
    if (existingStudent) {
      return NextResponse.json(
        { error: 'A student with this name and PIN already exists' },
        { status: 409 }
      )
    }

    let userId;
    let exists = true;
    let attempts = 0;
    while (exists && attempts < 10) {
      userId = generateUserId();
      exists = (await User.exists({ userId })) !== null;
      attempts++;
    }
    if (exists) {
      return NextResponse.json(
        { error: 'Could not generate unique userId for student' },
        { status: 500 }
      );
    }

    // Create new student with userId
    const student = new User({
      name: name.trim(),
      pin,
      role: 'student',
      gradeLevel,
      userId
    });


    await student.save();
    // Fetch the student again to see what is actually saved
    const savedStudent = await User.findById(student._id);
    console.log('Saved student:', savedStudent);

    return NextResponse.json({
      message: 'Student created successfully',
      student: {
        id: savedStudent._id,
        name: savedStudent.name,
        gradeLevel: savedStudent.gradeLevel,
        role: savedStudent.role,
        userId: savedStudent.userId
        // Do NOT return pin here
      }
    });

  } catch (error) {
    console.error('Create student error:', error)
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

    // Verify user is a teacher
    const teacher = await User.findById(decoded.userId)
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can view students' },
        { status: 403 }
      )
    }

    // Get all students (teachers can see all students to enroll them in courses)
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 })

    return NextResponse.json({
      students
    })

  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
