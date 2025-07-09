import mongoose, { Schema, Document } from 'mongoose'

export interface IQuizSubmission extends Document {
  quiz: mongoose.Types.ObjectId
  student: mongoose.Types.ObjectId
  answers: {
    questionIndex: number
    answer: string | string[]
  }[]
  score: number
  maxScore: number
  timeSpent: number // in minutes
  submittedAt: Date
  isGraded: boolean
  feedback?: string
  createdAt: Date
  updatedAt: Date
}

const QuizSubmissionSchema = new Schema<IQuizSubmission>({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    answer: {
      type: Schema.Types.Mixed,
      required: true
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isGraded: {
    type: Boolean,
    default: false
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
})

export default mongoose.models.QuizSubmission || mongoose.model<IQuizSubmission>('QuizSubmission', QuizSubmissionSchema)
