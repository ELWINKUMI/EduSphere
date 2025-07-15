// Script to update all user emails in the EduSphere database
// Usage: npx ts-node scripts/updateUserEmails.ts
// Usage: node scripts/updateUserEmails.js


// Use ts-node to run this script: npx ts-node scripts/updateUserEmails.js

import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import User from '../src/models/User';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || '');
  const users = await User.find({});
  let updated = 0;

  for (const user of users) {
    let newEmail = user.email;
    if (!user.email || !user.email.includes('@')) {
      if (user.role === 'student') {
        newEmail = `student${user.userId || user._id}@example.com`;
      } else if (user.role === 'teacher') {
        newEmail = `teacher${user.userId || user._id}@example.com`;
      } else {
        newEmail = `user${user.userId || user._id}@example.com`;
      }
      user.email = newEmail;
      await user.save();
      updated++;
      console.log(`Updated ${user.role} (${user.userId || user._id}): ${newEmail}`);
    }
  }
  console.log(`\nDone. Updated ${updated} users.`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
