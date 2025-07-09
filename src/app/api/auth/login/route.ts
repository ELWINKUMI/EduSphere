import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { name, pin } = await request.json()

    // Validate input
    if (!name || !pin) {
      return NextResponse.json(
        { error: 'Name and PIN are required' },
        { status: 400 }
      )
    }

    // Validate PIN format
    if (!/^[0-9]{5}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN must be exactly 5 digits' },
        { status: 400 }
      )
    }

    // Find user by name and pin
    const user = await User.findOne({ name: name.trim(), pin })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid name or PIN' },
        { status: 401 }
      )
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
