import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import the User model from the compiled JS output (dist/)
import User from '../dist/src/models/User.js';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
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
