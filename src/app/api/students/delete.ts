import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }
    const token = authHeader.substring(7)
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    // Only teachers can delete students
    const teacher = await User.findById(decoded.userId)
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can delete students' },
        { status: 403 }
      )
    }
    const { studentId } = await request.json()
    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required' },
        { status: 400 }
      )
    }
    const deleted = await User.findOneAndDelete({ _id: studentId, role: 'student' })
    if (!deleted) {
      return NextResponse.json(
        { error: 'Student not found or already deleted' },
        { status: 404 }
      )
    }
    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Delete student error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
