import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const teacherId = session.user.id;
  // Only fetch notifications for this teacher
  const notifications = await Notification.find({ teacher: teacherId, read: false })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  return NextResponse.json({ notifications });
}

export async function PATCH(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const teacherId = session.user.id;
  await Notification.updateMany({ teacher: teacherId, read: false }, { $set: { read: true } });
  return NextResponse.json({ success: true });
}
