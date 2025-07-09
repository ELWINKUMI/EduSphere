import { config } from 'dotenv'
import { resolve } from 'path'
import mongoose from 'mongoose'
import User from '../models/User'
import Course from '../models/Course'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

async function testCourseCreation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('Connected to MongoDB')

    // Find a teacher
    const teacher = await User.findOne({ role: 'teacher', name: 'John Smith' })
    if (!teacher) {
      console.log('No teacher found')
      return
    }
    
    console.log('Found teacher:', teacher.name, 'ID:', teacher._id)

    // Check existing courses for this teacher
    const existingCourses = await Course.find({ teacher: teacher._id })
    console.log('Existing courses for teacher:', existingCourses.length)
    existingCourses.forEach(course => {
      console.log(`  - ${course.title} (${course.subject} - ${course.gradeLevel})`)
    })

    // Create a test course
    const testCourse = new Course({
      title: 'Mathematics - Class 5',
      description: 'Basic mathematics for Class 5 students',
      subject: 'Mathematics',
      gradeLevel: 'Class 5',
      teacher: teacher._id,
      enrollmentCode: 'MAT5TEST',
      maxStudents: 30,
      students: [],
      assignments: [],
      quizzes: [],
      resources: [],
      announcements: [],
      isActive: true
    })

    // Check if course already exists
    const existingCourse = await Course.findOne({
      subject: 'Mathematics',
      gradeLevel: 'Class 5',
      teacher: teacher._id
    })

    if (existingCourse) {
      console.log('Course already exists:', existingCourse.title)
    } else {
      await testCourse.save()
      console.log('Created new course:', testCourse.title)
    }

    // Count courses after creation
    const finalCount = await Course.countDocuments({ teacher: teacher._id })
    console.log('Final course count for teacher:', finalCount)

    // List all courses for this teacher
    const allCourses = await Course.find({ teacher: teacher._id })
    console.log('All courses for teacher:')
    allCourses.forEach(course => {
      console.log(`  - ${course.title} (${course.subject} - ${course.gradeLevel}) - Code: ${course.enrollmentCode}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

testCourseCreation()
