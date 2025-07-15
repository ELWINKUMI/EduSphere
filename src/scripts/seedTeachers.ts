import { config } from 'dotenv'
import { resolve } from 'path'
import mongoose from 'mongoose'
import * as UserModule from '../models/User';
import 'dotenv/config';
const User = (UserModule as any).default || UserModule;

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

function generateUserId() {
  // Generates a random 8-digit string
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

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
];

export async function seedTeachers() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined')
    }
    
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing teachers (optional)
    // await User.deleteMany({ role: 'teacher' })
    // console.log('Cleared existing teachers')

    // Add teachers with unique userId
    for (const teacherData of teachers) {
      // Check if teacher already exists by name and pin
      const existingTeacher = await User.findOne({ name: teacherData.name, pin: teacherData.pin })
      if (!existingTeacher) {
        // Generate a unique userId
        let userId;
        let exists = true;
        let attempts = 0;
        while (exists && attempts < 10) {
          userId = generateUserId();
          exists = (await User.exists({ userId })) !== null;
          attempts++;
        }
        if (exists) {
          throw new Error('Could not generate unique userId for teacher');
        }
        const teacher = new User({ ...teacherData, userId });
        await teacher.save();
        console.log(`Added teacher: ${teacherData.name} (ID: ${userId}, PIN: ${teacherData.pin})`);
      } else {
        // Optionally update existing teacher to have a userId if missing
        if (!existingTeacher.userId) {
          let userId;
          let exists = true;
          let attempts = 0;
          while (exists && attempts < 10) {
            userId = generateUserId();
            exists = (await User.exists({ userId })) !== null;
            attempts++;
          }
          if (exists) {
            throw new Error('Could not generate unique userId for teacher');
          }
          existingTeacher.userId = userId;
          await existingTeacher.save();
          console.log(`Updated teacher ${existingTeacher.name} with userId: ${userId}`);
        } else {
          console.log(`Teacher ${teacherData.name} already exists (ID: ${existingTeacher.userId})`);
        }
      }
    }

    console.log('✅ Teacher seeding completed')
    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error seeding teachers:', error)
    await mongoose.disconnect()
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedTeachers()
}
