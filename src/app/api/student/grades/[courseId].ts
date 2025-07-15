import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import StudentReport from '@/models/StudentReport';
import { getServerSession } from '@/lib/auth';

// GET: Get student's report for a course (released or not)
export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'student') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = params;
  const report = await StudentReport.findOne({ course: courseId, student: session.user._id });
  if (!report) {
    return NextResponse.json({ message: 'Report not available' }, { status: 404 });
  }
  return NextResponse.json({ report });
}
