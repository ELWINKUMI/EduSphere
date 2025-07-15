"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
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
        required: function () {
            return this.role === 'student';
        }
    },
    // For Teachers
    subjects: [{
            type: String,
            required: function () {
                return this.role === 'teacher';
            }
        }],
    grades: [{
            type: String,
            enum: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
                'JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3'],
            required: function () {
                return this.role === 'teacher';
            }
        }]
}, {
    timestamps: true
});
// Compound index to ensure unique userId+pin combination
UserSchema.index({ userId: 1, pin: 1 }, { unique: true });
exports.default = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
