import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

// Teachers with grade-based data
const teachers = [
  {
    name: 'John Smith',
    pin: '12345',
    role: 'teacher',
    subjects: ['Mathematics'],
    grades: ['Class 5', 'Class 6']
  },
  {
    name: 'Sarah Johnson', 
    pin: '23456',
    role: 'teacher',
    subjects: ['English Language'],
    grades: ['JHS 1', 'JHS 2', 'JHS 3']
  },
  {
    name: 'Michael Brown',
    pin: '34567',
    role: 'teacher',
    subjects: ['Integrated Science'],
    grades: ['JHS 1', 'JHS 2']
  },
  {
    name: 'Emily Davis',
    pin: '45678',
    role: 'teacher',
    subjects: ['Social Studies'],
    grades: ['Class 4', 'Class 5', 'Class 6']
  },
  {
    name: 'David Wilson',
    pin: '56789',
    role: 'teacher',
    subjects: ['Core Mathematics', 'Elective Mathematics'],
    grades: ['SHS 1', 'SHS 2', 'SHS 3']
  }
]

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Clear existing users
    await User.deleteMany({})
    console.log('Cleared existing users')

    // Add new teachers
    for (const teacherData of teachers) {
      const teacher = new User(teacherData)
      await teacher.save()
      console.log(`Added teacher: ${teacherData.name}`)
    }

    return NextResponse.json({
      message: 'Database reset and teachers seeded successfully',
      teachersAdded: teachers.length
    })

  } catch (error) {
    console.error('Reset database error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
