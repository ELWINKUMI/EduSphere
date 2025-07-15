import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';
import User from '../models/User';
import Course from '../models/Course';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function enrollStudentInCourse(studentName: string, courseSubject: string, courseGrade: string) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Find the student
    const student = await User.findOne({ role: 'student', name: studentName });
    if (!student) {
      console.log('No student found with name', studentName);
      return;
    }
    console.log('Found student:', student.name, 'ID:', student._id);

    // Find the course
    const course = await Course.findOne({ subject: courseSubject, gradeLevel: courseGrade });
    if (!course) {
      console.log('No course found for', courseSubject, courseGrade);
      return;
    }
    console.log('Found course:', course.title, 'ID:', course._id);

    // Enroll student if not already enrolled
    if (!course.students.some((id: any) => id.equals(student._id))) {
      course.students.push(student._id);
      await course.save();
      console.log('Enrolled student in course.');
    } else {
      console.log('Student already enrolled in course.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Example usage:
// Replace with actual student name and course details
enrollStudentInCourse('Student Name', 'Mathematics', 'Class 5');
