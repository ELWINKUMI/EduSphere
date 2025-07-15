import connectDB from '../src/lib/mongodb';
import User from '../src/models/User';

function generateUserId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

async function assignTeacherIds() {
  await connectDB();
  const teachers = await User.find({ role: 'teacher', $or: [{ userId: { $exists: false } }, { userId: null }] });
  console.log(`Found ${teachers.length} teachers without userId`);
  let updated = 0;
  for (const teacher of teachers) {
    let userId;
    let exists = true;
    let attempts = 0;
    while (exists && attempts < 10) {
      userId = generateUserId();
      exists = (await User.exists({ userId })) !== null;
      attempts++;
    }
    if (!exists) {
      teacher.userId = userId;
      await teacher.save();
      console.log(`Assigned userId ${userId} to teacher ${teacher.name}`);
      updated++;
    } else {
      console.log(`Could not assign userId to teacher ${teacher.name}`);
    }
  }
  console.log(`Updated ${updated} teachers.`);
  process.exit(0);
}

assignTeacherIds().catch(err => {
  console.error('Error assigning teacher userIds:', err);
  process.exit(1);
});
