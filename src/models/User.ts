import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  userId: string // 8-digit unique ID for login
  name: string
  pin: string
  role: 'teacher' | 'student'
  avatar?: string
  email?: string
  firstLogin?: boolean
  // For Students
  gradeLevel?: 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6' | 
              'JHS 1' | 'JHS 2' | 'JHS 3' | 'SHS 1' | 'SHS 2' | 'SHS 3'
  // For Teachers  
  subjects?: string[] // e.g., ['Mathematics', 'English']
  grades?: string[]   // e.g., ['Class 5', 'Class 6'] - grades this teacher teaches
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  resetPasswordToken: {
    type: String,
    default: ''
  },
  resetPasswordExpires: {
    type: Number,
    default: 0
  },
  userId: {
    type: String,
    required: true,
    unique: true,
    sparse: true, // Allow multiple nulls for unique index
    match: /^[0-9]{8}$/,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  pin: {
    type: String,
    required: true,
    length: 5,
    match: /^[0-9]{5}$/
  },
  role: {
    type: String,
    enum: ['teacher', 'student'],
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  firstLogin: {
    type: Boolean,
    default: true
  },
  
  // For Students
  gradeLevel: {
    type: String,
    enum: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
           'JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3'],
    required: function(this: IUser) {
      return this.role === 'student'
    }
  },
  
  // For Teachers
  subjects: [{
    type: String,
    required: function(this: IUser) {
      return this.role === 'teacher'
    }
  }],
  grades: [{
    type: String,
    enum: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
           'JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3'],
    required: function(this: IUser) {
      return this.role === 'teacher'
    }
  }]
}, {
  timestamps: true
})

// Compound index to ensure unique userId+pin combination
UserSchema.index({ userId: 1, pin: 1 }, { unique: true, sparse: true })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
