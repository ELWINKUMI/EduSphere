import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStudentReport extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  finalScore: number;
  grade: string;
  position: number;
  released: boolean;
  manualAdjustments?: {
    score?: number;
    grade?: string;
  };
  dateReleased?: Date;
  dateDownloaded?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentReportSchema = new Schema<IStudentReport>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  finalScore: { type: Number, required: true },
  grade: { type: String, required: true },
  position: { type: Number, required: true },
  released: { type: Boolean, default: false },
  manualAdjustments: {
    score: { type: Number },
    grade: { type: String },
  },
  dateReleased: { type: Date },
  dateDownloaded: { type: Date },
}, { timestamps: true });

export default mongoose.models.StudentReport || mongoose.model<IStudentReport>('StudentReport', StudentReportSchema);
