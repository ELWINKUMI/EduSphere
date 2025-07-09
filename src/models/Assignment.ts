import mongoose, { Schema, Document } from 'mongoose'

export interface IAssignment extends Document {
  title: string
  description: string
  course: mongoose.Types.ObjectId
  teacher: mongoose.Types.ObjectId
  startDate: Date
  dueDate: Date
  maxPoints: number
  attachments: string[]
  submissions: mongoose.Types.ObjectId[]
  submissionType: 'file' | 'text' | 'both'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const AssignmentSchema = new Schema<IAssignment>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
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
  startDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  maxPoints: {
    type: Number,
    required: true,
    min: 0
  },
  attachments: [{
    type: String
  }],
  submissionType: {
    type: String,
    enum: ['file', 'text', 'both'],
    default: 'both'
  },
  submissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema)
