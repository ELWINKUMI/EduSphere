import mongoose, { Schema } from 'mongoose';
var ResourceSchema = new Schema({
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
});
// Index for efficient queries
ResourceSchema.index({ course: 1, createdAt: -1 });
ResourceSchema.index({ teacher: 1, createdAt: -1 });
ResourceSchema.index({ type: 1 });
export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
