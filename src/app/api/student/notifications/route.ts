import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Announcement from '@/models/Announcement'
import Assignment from '@/models/Assignment'
import Quiz from '@/models/Quiz'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const user = await User.findById(decoded.userId)
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Only students can view notifications' }, { status: 403 })
    }
    // Find all courses where this student is enrolled
    const Course = (await import('@/models/Course')).default;
    const studentCourses = await Course.find({ students: user._id }).select('_id');
    const courseIds = studentCourses.map((c: any) => c._id);
    // Announcements for enrolled courses (populate teacher and course)
    const announcements = await Announcement.find({
      $or: [
        { course: { $in: courseIds } },
        { isGlobal: true }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: 'teacher', select: 'name _id' })
      .populate({ path: 'course', select: 'title _id' })
      .lean()
    // Assignments for enrolled courses
    const assignments = await Assignment.find({
      course: { $in: user.courses },
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
    // Quizzes for enrolled courses
    const quizzes = await Quiz.find({
      course: { $in: user.courses },
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // Student-specific notifications (e.g., quiz_created)
    const Notification = (await import('@/models/Notification')).default;
    const studentNotifications = await Notification.find({
      student: user._id,
      type: { $in: ['quiz_created'] },
      read: false
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      announcements,
      assignments,
      quizzes,
      studentNotifications
    })
  } catch (error) {
    console.error('Get student notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// For clearing notifications, you would typically update a field in the user profile or a separate notifications collection.
// Here, we just simulate clearing by returning success (extend as needed for persistent clear).
export async function DELETE(request: NextRequest) {
  try {
    // In a real app, mark notifications as read/cleared in DB for this user
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
