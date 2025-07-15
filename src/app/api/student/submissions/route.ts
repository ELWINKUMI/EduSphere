import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Submission from '@/models/Submission'
import Assignment from '@/models/Assignment'  
import User from '@/models/User'
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
      return NextResponse.json({ error: 'Only students can view their submissions' }, { status: 403 })
    }
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '5', 10)
    const submissions = await Submission.find({ student: user._id })
      .populate({
        path: 'assignment',
        select: 'title dueDate maxPoints course',
        populate: {
          path: 'course',
          select: 'title subject gradeLevel'
        }
      })
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean()
    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Get student submissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
