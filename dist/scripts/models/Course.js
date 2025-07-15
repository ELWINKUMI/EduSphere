"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var CourseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    gradeLevel: {
        type: String,
        enum: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
            'JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3'],
        required: true
    },
    teacher: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
            // Grading scheme fields
            assignmentWeight: {
                type: Number,
                default: 70, // Default 70%
                min: 0,
                max: 100
            },
            quizWeight: {
                type: Number,
                default: 30, // Default 30%
                min: 0,
                max: 100
            },
            gradeRanges: {
                type: [
                    {
                        min: { type: Number, required: true },
                        max: { type: Number, required: true },
                        grade: { type: String, required: true }
                    }
                ],
                default: [
                    { min: 80, max: 100, grade: 'A' },
                    { min: 70, max: 79, grade: 'B' },
                    { min: 60, max: 69, grade: 'C' },
                    { min: 50, max: 59, grade: 'D' },
                    { min: 0, max: 49, grade: 'F' }
                ]
            },
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    assignments: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Assignment'
        }],
    quizzes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Quiz'
        }],
    resources: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Resource'
        }],
    announcements: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Announcement'
        }],
    enrollmentCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        default: function () {
            return Math.random().toString(36).substring(2, 8).toUpperCase();
        }
    },
    maxStudents: {
        type: Number,
        default: 30,
        min: 1,
        max: 100
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Ensure unique enrollmentCode before saving
CourseSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var code, exists, tries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!this.enrollmentCode) return [3 /*break*/, 4];
                    code = '';
                    exists = true;
                    tries = 0;
                    _a.label = 1;
                case 1:
                    if (!(exists && tries < 10)) return [3 /*break*/, 3];
                    code = Math.random().toString(36).substring(2, 8).toUpperCase();
                    return [4 /*yield*/, mongoose_1.default.models.Course.exists({ enrollmentCode: code })];
                case 2:
                    exists = !!(_a.sent());
                    tries++;
                    return [3 /*break*/, 1];
                case 3:
                    if (exists) {
                        return [2 /*return*/, next(new Error('Could not generate unique enrollment code'))];
                    }
                    // @ts-ignore
                    this.enrollmentCode = code;
                    _a.label = 4;
                case 4:
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
exports.default = mongoose_1.default.models.Course || mongoose_1.default.model('Course', CourseSchema);
