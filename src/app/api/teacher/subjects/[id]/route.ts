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
    await connectDB();

    // Await params if it's a promise (Next.js dynamic route)
    const awaitedParams = typeof (params as unknown) === 'object' && params && typeof (params as { then?: unknown }).then === 'function' ? await params : params;
    const subjectId: string = (awaitedParams as { id: string }).id;

    // Get token from authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded: unknown;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Type guard for decoded
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }
    const userId = (decoded as { userId: string }).userId;

    // Verify user is a teacher
    const teacher = await User.findById(userId);
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can update subjects' },
        { status: 403 }
      );
    }

    const { title, description, maxStudents, isActive }: { title?: string; description?: string; maxStudents?: string | number; isActive?: boolean } = await request.json();

    // Validate maxStudents
    if (maxStudents && (parseInt(maxStudents as string, 10) > 100)) {
      return NextResponse.json(
        { error: 'Maximum allowed students is 100.' },
        { status: 400 }
      );
    }

    // Find the subject and verify ownership
    const subject = await Course.findOne({
      _id: subjectId,
      teacher: teacher._id
    });

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    // Update the subject
    subject.title = title || subject.title;
    subject.description = description || subject.description;
    subject.maxStudents = maxStudents ? parseInt(maxStudents as string, 10) : subject.maxStudents;
    subject.isActive = isActive !== undefined ? isActive : subject.isActive;
    subject.updatedAt = new Date();

    await subject.save();

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
    });

  } catch (error: unknown) {
    console.error('Update subject error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}