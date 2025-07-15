import mongoose, { Schema } from 'mongoose';
var NotificationSchema = new Schema({
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: false, index: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: false, index: true },
    type: { type: String, enum: ['assignment_submission', 'quiz_submission', 'quiz_created', 'message', 'other'], required: true },
    studentName: { type: String },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: false },
});
export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
