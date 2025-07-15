import { config } from 'dotenv'
import 'dotenv/config'
import { resolve } from 'path'
import mongoose from 'mongoose'
import Course from '../models/Course'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

function generateEnrollmentCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

async function fixNullEnrollmentCodes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('Connected to MongoDB')

    // Find all courses with null or empty enrollmentCode
    const courses = await Course.find({ $or: [ { enrollmentCode: null }, { enrollmentCode: '' } ] })
    console.log(`Found ${courses.length} courses with null/empty enrollmentCode`)

    let updated = 0
    for (const course of courses) {
      let code
      let exists = true
      let tries = 0
      while (exists && tries < 10) {
        code = generateEnrollmentCode()
        exists = !!(await Course.exists({ enrollmentCode: code }))
        tries++
      }
      if (!exists) {
        course.enrollmentCode = code
        await course.save()
        updated++
        console.log(`Updated course ${course._id} with code ${code}`)
      } else {
        console.error(`Could not generate unique code for course ${course._id}`)
      }
    }

    console.log(`Updated ${updated} courses.`)
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  } catch (error) {
    console.error('Error:', error)
    await mongoose.disconnect()
  }
}

fixNullEnrollmentCodes()
