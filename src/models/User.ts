import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  pin: string
  role: 'teacher' | 'student'
  avatar?: string
  
  // For Students
  gradeLevel?: 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6' | 
              'JHS 1' | 'JHS 2' | 'JHS 3' | 'SHS 1' | 'SHS 2' | 'SHS 3'
  
  // For Teachers  
  subjects?: string[] // e.g., ['Mathematics', 'English']
  grades?: string[]   // e.g., ['Class 5', 'Class 6'] - grades this teacher teaches
  
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
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

// Compound index to ensure unique name+pin combination
UserSchema.index({ name: 1, pin: 1 }, { unique: true })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
