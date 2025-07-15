import { NextRequest, NextResponse } from 'next/server';
import { calculateAndUpdateReports } from '@/lib/grading';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

// POST: Recalculate all student reports for a course
export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = params;
  const course = await Course.findById(courseId);
  if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });
  if (course.teacher.toString() !== session.user._id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  const reports = await calculateAndUpdateReports(courseId);
  return NextResponse.json({ reports });
}
