import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)


    try {
      const decoded: { userId: string; email: string; role: string } = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; role: string };

      const user = await User.findById(decoded.userId).select('-password')
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId,
        role: user.role,
        avatar: user.avatar,
        gradeLevel: user.gradeLevel,
        // Ensure we do not return sensitive information like password or pin
        // Do not return pin here
        // Add more fields here if needed for the frontend
      }

      return NextResponse.json({
        user: userData
      })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'name' in err && (err as { name?: string }).name === 'TokenExpiredError') {
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
