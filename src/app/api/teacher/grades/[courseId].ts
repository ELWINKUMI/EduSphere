import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import StudentReport from '@/models/StudentReport';
import User from '@/models/User';
import { getServerSession } from '@/lib/auth';

// GET: Get all student reports for a course
export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = params;
  const course = await Course.findById(courseId);
  if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });
  // Only the teacher can view
  if (course.teacher.toString() !== session.user._id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  const reports = await StudentReport.find({ course: courseId }).populate('student');
  return NextResponse.json({ reports });
}

// PATCH: Edit a student's report (manual adjustment)
export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = params;
  const { studentId, manualAdjustments } = await req.json();
  const report = await StudentReport.findOne({ course: courseId, student: studentId });
  if (!report) return NextResponse.json({ message: 'Report not found' }, { status: 404 });
  report.manualAdjustments = manualAdjustments;
  if (manualAdjustments.score !== undefined) report.finalScore = manualAdjustments.score;
  if (manualAdjustments.grade) report.grade = manualAdjustments.grade;
  await report.save();
  return NextResponse.json({ report });
}

// POST: Release reports for students
export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = params;
  const { studentIds } = await req.json(); // array of student IDs to release
  const result = await StudentReport.updateMany(
    { course: courseId, student: { $in: studentIds } },
    { $set: { released: true, dateReleased: new Date() } }
  );
  return NextResponse.json({ updated: result.modifiedCount });
}
