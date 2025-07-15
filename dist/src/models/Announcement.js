import mongoose, { Schema } from 'mongoose';
var AnnouncementSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
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
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    sendEmail: {
        type: Boolean,
        default: false
    },
    publishAt: {
        type: Date,
        default: Date.now
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
AnnouncementSchema.index({ course: 1, publishAt: -1 });
AnnouncementSchema.index({ teacher: 1, createdAt: -1 });
export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
