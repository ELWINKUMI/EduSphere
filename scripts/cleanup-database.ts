import mongoose from 'mongoose'
import Course from '@/models/Course'
import connectDB from '@/lib/mongodb'

/**
 * Database cleanup script to fix enrollment code issues
 * Run this script to clean up duplicate null values and fix indexes
 */
async function cleanupDatabase() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Remove courses with null enrollment codes
    const result = await Course.deleteMany({ 
      $or: [
        { enrollmentCode: null },
        { enrollmentCode: undefined },
        { enrollmentCode: '' }
      ]
    })
    console.log(`Removed ${result.deletedCount} courses with invalid enrollment codes`)

    // Update remaining courses to ensure they have valid enrollment codes
    const coursesWithoutCodes = await Course.find({
      $or: [
        { enrollmentCode: { $exists: false } },
        { enrollmentCode: null },
        { enrollmentCode: '' }
      ]
    })

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
        console.log(`Updated course ${course._id} with enrollment code: ${enrollmentCode}`)
      }
    }

    // Drop and recreate the index to ensure it's sparse
    try {
      await Course.collection.dropIndex('enrollmentCode_1')
      console.log('Dropped existing enrollmentCode index')
    } catch (error) {
      console.log('Index might not exist, continuing...')
    }

    // Create a new unique index that allows for proper uniqueness
    await Course.collection.createIndex(
      { enrollmentCode: 1 }, 
      { 
        unique: true,
        sparse: false,
        background: true
      }
    )
    console.log('Created new enrollmentCode index')

    console.log('Database cleanup completed successfully')
    process.exit(0)

  } catch (error) {
    console.error('Database cleanup failed:', error)
    process.exit(1)
  }
}

// Run the cleanup if this file is executed directly
if (require.main === module) {
  cleanupDatabase()
}

export default cleanupDatabase