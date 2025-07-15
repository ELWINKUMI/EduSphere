import mongoose, { Schema, Document } from 'mongoose'

export interface ISubmission extends Document {
  assignment: mongoose.Types.ObjectId
  student: mongoose.Types.ObjectId
  content: string
  files: string[]
  submittedAt: Date
  grade?: number
  feedback?: string
  gradedAt?: Date
  gradedBy?: mongoose.Types.ObjectId
  isGraded: boolean
  isLate: boolean
  attemptCount: number // <-- Added attemptCount
  createdAt: Date
  updatedAt: Date
}

const SubmissionSchema = new Schema<ISubmission>({
  assignment: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  files: [{
    type: String
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  grade: {
    type: Number,
    min: 0
  },
  feedback: {
    type: String
  },
  gradedAt: {
    type: Date
  },
  gradedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isGraded: {
    type: Boolean,
    default: false
  },
  isLate: {
    type: Boolean,
    default: false
  },
  attemptCount: {
    type: Number,
    default: 1 // <-- Default value for first attempt
  }
}, {
  timestamps: true
})

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema)