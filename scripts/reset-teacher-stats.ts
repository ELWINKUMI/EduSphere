import connectDB from '../src/lib/mongodb';
import User from '../src/models/User';
import Course from '../src/models/Course';
import Assignment from '../src/models/Assignment';
import Quiz from '../src/models/Quiz';
import Announcement from '../src/models/Announcement';

async function resetTeacherStats() {
  await connectDB();
  // Reset all teacher stats and records
  const teachers = await User.find({ role: 'teacher' });
  let updated = 0;
  for (const teacher of teachers) {
    // Remove all courses taught by this teacher
    const courses = await Course.find({ teacher: teacher._id });
    for (const course of courses) {
      // Remove assignments, quizzes, announcements for this course
      await Assignment.deleteMany({ _id: { $in: course.assignments } });
      await Quiz.deleteMany({ _id: { $in: course.quizzes } });
      await Announcement.deleteMany({ _id: { $in: course.announcements } });
      // Remove the course itself
      await course.deleteOne();
    }
    // Optionally, reset teacher's subjects/grades if needed
    // teacher.subjects = [];
    // teacher.grades = [];
    // await teacher.save();
    updated++;
    console.log(`Reset records for teacher: ${teacher.name}`);
  }
  console.log(`Reset stats for ${updated} teachers.`);
  process.exit(0);
}

resetTeacherStats().catch(err => {
  console.error('Error resetting teacher stats:', err);
  process.exit(1);
});
