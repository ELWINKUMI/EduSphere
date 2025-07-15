import mongoose, { Schema } from 'mongoose';
var QuizSubmissionSchema = new Schema({
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
            questionIndex: {
                type: Number,
                required: true
            },
            answer: {
                type: Schema.Types.Mixed,
                required: true
            }
        }],
    score: {
        type: Number,
        default: 0
    },
    maxScore: {
        type: Number,
        required: true
    },
    timeSpent: {
        type: Number,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    isGraded: {
        type: Boolean,
        default: false
    },
    feedback: {
        type: String
    }
}, {
    timestamps: true
});
export default mongoose.models.QuizSubmission || mongoose.model('QuizSubmission', QuizSubmissionSchema);
