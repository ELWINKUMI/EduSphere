import mongoose, { Schema, Document } from 'mongoose'

export interface IQuiz extends Document {
  title: string
  description: string
  course: mongoose.Types.ObjectId
  teacher: mongoose.Types.ObjectId
  questions: {
    question: string
    type: 'multiple-choice' | 'true-false' | 'short-answer'
    options?: string[]
    correctAnswer: string | string[]
    points: number
  }[]
  timeLimit: number // in minutes
  attempts: number
  showResults: 'immediately' | 'after-deadline' | 'manual'
  startDate: Date
  endDate: Date
  submissions: mongoose.Types.ObjectId[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const QuizSchema = new Schema<IQuiz>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer'],
      required: true
    },
    options: [{
      type: String
    }],
    correctAnswer: {
      type: Schema.Types.Mixed,
      required: true
    },
    points: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  timeLimit: {
    type: Number,
    required: true,
    min: 1
  },
  attempts: {
    type: Number,
    default: 1,
    min: 1
  },
  showResults: {
    type: String,
    enum: ['immediately', 'after-deadline', 'manual'],
    default: 'after-deadline'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  submissions: [{
    type: Schema.Types.ObjectId,
    ref: 'QuizSubmission'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema)
