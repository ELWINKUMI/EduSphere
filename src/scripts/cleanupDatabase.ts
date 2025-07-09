// Database cleanup script to remove old indexes and collections
// Run this before seeding teachers

import { config } from 'dotenv'
import { resolve } from 'path'
import mongoose from 'mongoose'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

export async function cleanupDatabase() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined')
    }
    
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Drop the users collection to remove old schema and indexes
    const db = mongoose.connection.db
    if (db) {
      try {
        await db.collection('users').drop()
        console.log('✅ Dropped old users collection')
      } catch (error: any) {
        if (error.codeName === 'NamespaceNotFound') {
          console.log('ℹ️  Users collection does not exist, nothing to drop')
        } else {
          throw error
        }
      }
    }

    console.log('✅ Database cleanup completed')
    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error cleaning database:', error)
    await mongoose.disconnect()
  }
}

// Run if this file is executed directly
if (require.main === module) {
  cleanupDatabase()
}
