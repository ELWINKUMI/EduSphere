import mongoose, { Schema, Document } from 'mongoose'

export interface ICourse extends Document {
  title: string // e.g., "Mathematics - Class 5"
  description: string
  subject: string // e.g., "Mathematics", "English", "Science"
  gradeLevel: string // e.g., "Class 5", "JHS 2", "SHS 1"
  teacher: mongoose.Types.ObjectId
  students: mongoose.Types.ObjectId[] // Enrolled students
  assignments: mongoose.Types.ObjectId[]
  quizzes: mongoose.Types.ObjectId[]
  resources: mongoose.Types.ObjectId[]
  announcements: mongoose.Types.ObjectId[]
  enrollmentCode: string // Unique course code for enrollment
  maxStudents: number // Maximum number of students
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  gradeLevel: {
    type: String,
    enum: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
           'JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3'],
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignments: [{
    type: Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  quizzes: [{
    type: Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  resources: [{
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  announcements: [{
    type: Schema.Types.ObjectId,
    ref: 'Announcement'
  }],
  enrollmentCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    default: function () {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  },
  maxStudents: {
    type: Number,
    default: 30,
    min: 1,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
})


// Ensure unique enrollmentCode before saving
CourseSchema.pre('validate', async function (next) {
  // @ts-ignore
  if (!this.enrollmentCode) {
    let code: string = '';
    let exists = true;
    let tries = 0;
    while (exists && tries < 10) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = !!(await mongoose.models.Course.exists({ enrollmentCode: code }));
      tries++;
    }
    if (exists) {
      return next(new Error('Could not generate unique enrollment code'));
    }
    // @ts-ignore
    this.enrollmentCode = code;
  }
  next();
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)
