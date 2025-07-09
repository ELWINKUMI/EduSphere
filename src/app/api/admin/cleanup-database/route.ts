import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Get the authorization token
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

    // Only allow admins or teachers to run cleanup (for safety)
    const user = await User.findById(decoded.userId)
    if (!user || user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Clean up courses with null enrollment codes
    const deleteResult = await Course.deleteMany({
      $or: [
        { enrollmentCode: null },
        { enrollmentCode: undefined },
        { enrollmentCode: '' }
      ]
    })

    // Update courses without enrollment codes
    const coursesWithoutCodes = await Course.find({
      $or: [
        { enrollmentCode: { $exists: false } },
        { enrollmentCode: null },
        { enrollmentCode: '' }
      ]
    })

    let updateCount = 0
    for (const course of coursesWithoutCodes) {
      let enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      
      // Ensure uniqueness
      let isUnique = false
      let attempts = 0
      while (!isUnique && attempts < 10) {
        const existing = await Course.findOne({ enrollmentCode })
        if (!existing) {
          isUnique = true
        } else {
          enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase()
          attempts++
        }
      }

      if (isUnique) {
        await Course.findByIdAndUpdate(course._id, { enrollmentCode })
        updateCount++
      }
    }

    return NextResponse.json({
      message: 'Database cleanup completed',
      deleted: deleteResult.deletedCount,
      updated: updateCount
    })

  } catch (error) {
    console.error('Database cleanup error:', error)
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    )
  }
}