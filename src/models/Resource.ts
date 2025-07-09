import mongoose, { Schema, Document } from 'mongoose'

export interface IResource extends Document {
  title: string
  description: string
  course: mongoose.Types.ObjectId
  teacher: mongoose.Types.ObjectId
  type: 'document' | 'video' | 'link' | 'other'
  filename: string
  originalName: string
  fileSize: number
  mimeType: string
  url: string
  downloadCount: number
  createdAt: Date
  updatedAt: Date
}

const ResourceSchema = new Schema<IResource>({
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
  type: {
    type: String,
    enum: ['document', 'video', 'link', 'other'],
    default: 'document'
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for efficient queries
ResourceSchema.index({ course: 1, createdAt: -1 })
ResourceSchema.index({ teacher: 1, createdAt: -1 })
ResourceSchema.index({ type: 1 })

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema)
