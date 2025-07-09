import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Announcement from '@/models/Announcement'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    if (decoded.role !== 'teacher' && decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const announcements = await Announcement.find({ teacher: decoded.userId })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ announcements }, { status: 200 })
  } catch (err) {
    console.error('Error fetching teacher announcements:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}