// GET: Fetch published announcements for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    // Fetch published announcements for this course, sorted by most recent publish date
    const announcements = await Announcement.find({
      course: id,
      isPublished: true
    }).sort({ publishAt: -1 })

    return NextResponse.json({ announcements }, { status: 200 })
  } catch (err) {
    console.error('Error fetching announcements:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Announcement from '@/models/Announcement'
import jwt from 'jsonwebtoken'

// PATCH: Edit an announcement
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    // Auth
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Find announcement
    const announcement = await Announcement.findById(id)
    if (!announcement) {
      return NextResponse.json({ message: 'Announcement not found' }, { status: 404 })
    }

    // Only the owner teacher or admin can edit
    if (
      announcement.teacher.toString() !== decoded.userId &&
      decoded.role !== 'admin'
    ) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Parse body and update allowed fields
    const data = await request.json()
    const updatable = [
      'title',
      'content',
      'priority',
      'sendEmail',
      'publishAt',
      'isPublished'
    ]
    updatable.forEach(field => {
      if (data[field] !== undefined) announcement[field] = data[field]
    })
    await announcement.save()

    return NextResponse.json({ message: 'Announcement updated', announcement }, { status: 200 })
  } catch (err) {
    console.error('Error updating announcement:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// DELETE: Remove an announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    // Auth
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Find announcement
    const announcement = await Announcement.findById(id)
    if (!announcement) {
      return NextResponse.json({ message: 'Announcement not found' }, { status: 404 })
    }

    // Only the owner teacher or admin can delete
    if (
      announcement.teacher.toString() !== decoded.userId &&
      decoded.role !== 'admin'
    ) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await announcement.deleteOne()
    return NextResponse.json({ message: 'Announcement deleted' }, { status: 200 })
  } catch (err) {
    console.error('Error deleting announcement:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}