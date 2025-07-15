import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import StudentReport from '@/models/StudentReport';
import Course from '@/models/Course';
import User from '@/models/User';

// Helper to extract token from Authorization header
// (No longer needed, debug log removed)

// GET: Get all student reports for a course
export async function GET(req: NextRequest, context: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = await context.params;
  const reports = await StudentReport.find({ course: courseId })
    .populate('student')
    .lean();
  return NextResponse.json({ reports });
}

// POST: Release reports for students
export async function POST(req: NextRequest, context: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = await context.params;
  const { studentIds } = await req.json();
  await StudentReport.updateMany(
    { course: courseId, student: { $in: studentIds } },
    { $set: { released: true, dateReleased: new Date() } }
  );
  return NextResponse.json({ message: 'Reports released.' });
}

// PATCH: Manual adjust a report
export async function PATCH(req: NextRequest, context: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = await context.params;
  const { studentId, manualAdjustments } = await req.json();
  await StudentReport.findOneAndUpdate(
    { course: courseId, student: studentId },
    { $set: { manualAdjustments } }
  );
  return NextResponse.json({ message: 'Manual adjustment saved.' });
}
