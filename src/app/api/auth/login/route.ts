import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { userId, pin } = await request.json()
    console.log('[LOGIN DEBUG] Received:', { userId, pin })

    // Validate input
    if (!userId || !pin) {
      console.log('[LOGIN DEBUG] Missing userId or pin')
      return NextResponse.json(
        { error: 'Login ID and PIN are required' },
        { status: 400 }
      )
    }

    // Validate PIN format
    if (!/^[0-9]{5}$/.test(pin)) {
      console.log('[LOGIN DEBUG] Invalid PIN format:', pin)
      return NextResponse.json(
        { error: 'PIN must be exactly 5 digits' },
        { status: 400 }
      )
    }

    // Find user by userId
    const user = await User.findOne({ userId: userId.trim() })
    if (!user) {
      console.log('[LOGIN DEBUG] No user found for', { userId: userId.trim() })
      return NextResponse.json(
        { error: 'Invalid Login ID or PIN' },
        { status: 401 }
      )
    }

    // If user has a password (hashed), use bcrypt to compare
    if (user.password) {
      const isMatch = await bcrypt.compare(pin, user.password)
      if (!isMatch) {
        console.log('[LOGIN DEBUG] Password mismatch for', { userId: userId.trim() })
        return NextResponse.json(
          { error: 'Invalid Login ID or PIN' },
          { status: 401 }
        )
      }
    } else {
      // Fallback to legacy pin match
      if (user.pin !== pin) {
        console.log('[LOGIN DEBUG] PIN mismatch for', { userId: userId.trim() })
        return NextResponse.json(
          { error: 'Invalid Login ID or PIN' },
          { status: 401 }
        )
      }
    }

    // If student and firstLogin, require pin change
    if (user.role === 'student' && user.firstLogin) {
      // Generate JWT for temporary session
      const tempToken = jwt.sign(
        { userId: user._id, name: user.name, role: user.role, firstLogin: true },
        process.env.JWT_SECRET!,
        { expiresIn: '30m' }
      )
      return NextResponse.json({
        message: 'First login, PIN change required',
        firstLogin: true,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          gradeLevel: user.gradeLevel,
        },
        token: tempToken
      })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Return user data
    const userData = {
      id: user._id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      gradeLevel: user.gradeLevel, // For students
      subjects: user.subjects,     // For teachers
      grades: user.grades          // For teachers
    }

    return NextResponse.json({
      message: 'Login successful',
      user: userData,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
