// scripts/fix-null-course-codes.js
// Run with: node scripts/fix-null-course-codes.js
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edusphere';

const courseSchema = new mongoose.Schema({}, { strict: false });
const Course = mongoose.model('Course', courseSchema, 'courses');

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function main() {
  await mongoose.connect(uri);
  const nullCodeCourses = await Course.find({ code: null });
  let updated = 0;
  for (const course of nullCodeCourses) {
    let newCode;
    let exists = true;
    let tries = 0;
    while (exists && tries < 10) {
      newCode = generateCode();
      exists = await Course.exists({ code: newCode });
      tries++;
    }
    if (!exists) {
      course.code = newCode;
      await course.save();
      updated++;
      console.log(`Updated course ${course._id} with code ${newCode}`);
    } else {
      console.log(`Could not generate unique code for course ${course._id}`);
    }
  }
  console.log(`Updated ${updated} courses.`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
