import mongoose, { Schema } from 'mongoose';
var AssignmentSchema = new Schema({
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
});
export default mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
