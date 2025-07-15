import mongoose, { Schema } from 'mongoose';
var SubmissionSchema = new Schema({
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
    }
}, {
    timestamps: true
});
export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
