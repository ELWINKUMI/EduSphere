
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import QuizSubmission from '@/models/QuizSubmission'
import Quiz from '@/models/Quiz'
import Course from '@/models/Course'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get and verify token
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Get quiz submissions for the student
    const submissions = await QuizSubmission.find({ 
      student: decoded.userId 
    })
      .populate({
        path: 'quiz',
        select: 'title course',
        populate: {
          path: 'course',
          select: 'title subject gradeLevel',
        },
      })
      .sort({ submittedAt: -1 })

    return NextResponse.json({ submissions }, { status: 200 })

  } catch (error) {
    console.error('Error fetching quiz submissions:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
