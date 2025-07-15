import 'dotenv/config'
import mongoose from 'mongoose'
import User from '@/models/User'
import connectDB from '@/lib/mongodb'

function generateUserId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

async function assignStudentIds() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Find all students missing userId
    const students = await User.find({ role: 'student', $or: [ { userId: { $exists: false } }, { userId: null }, { userId: '' } ] })
    console.log(`Found ${students.length} students without userId`)

    let updated = 0
    for (const student of students) {
      let userId
      let exists = true
      let attempts = 0
      while (exists && attempts < 10) {
        userId = generateUserId()
        exists = (await User.exists({ userId })) !== null
        attempts++
      }
      if (!exists) {
        student.userId = userId
        await student.save()
        updated++
        console.log(`Assigned userId ${userId} to student ${student.name}`)
      } else {
        console.log(`Could not generate unique userId for student ${student.name}`)
      }
    }
    console.log(`Updated ${updated} students.`)
    await mongoose.disconnect()
  } catch (error) {
    console.error('Error assigning student IDs:', error)
    await mongoose.disconnect()
  }
}

if (require.main === module) {
  assignStudentIds()
}
