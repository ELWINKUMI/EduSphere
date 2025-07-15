import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

// GET /api/teacher/courses - Get all courses for the logged-in teacher
export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const courses = await Course.find({ teacher: session.user._id })
    .select('_id title subject gradeLevel students assignmentWeight quizWeight gradeRanges')
    .lean();
  return NextResponse.json({ courses });
}
