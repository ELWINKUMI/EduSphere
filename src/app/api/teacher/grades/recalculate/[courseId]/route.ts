import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import StudentReport from '@/models/StudentReport';
import Course from '@/models/Course';
import User from '@/models/User';
import { recalculateReportsForCourse } from '@/lib/grading';

// POST: Recalculate all reports for a course
export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = params;
  // Call grading logic (implement in lib/grading.ts)
  await recalculateReportsForCourse(courseId);
  return NextResponse.json({ message: 'Reports recalculated.' });
}
