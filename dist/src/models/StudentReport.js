import mongoose, { Schema } from 'mongoose';
var StudentReportSchema = new Schema({
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
export default mongoose.models.StudentReport || mongoose.model('StudentReport', StudentReportSchema);
