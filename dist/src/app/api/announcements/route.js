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
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Announcement from '@/models/Announcement';
import Course from '@/models/Course';
import User from '@/models/User';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, teacher, _a, title, content, courseId, priority, sendEmail, publishAt, course, announcement, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _b.sent();
                    authHeader = request.headers.get('authorization');
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ error: 'Authorization token required' }, { status: 401 })];
                    }
                    token = authHeader.substring(7);
                    decoded = void 0;
                    try {
                        decoded = jwt.verify(token, process.env.JWT_SECRET);
                    }
                    catch (error) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid token' }, { status: 401 })];
                    }
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 2:
                    teacher = _b.sent();
                    if (!teacher || teacher.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can create announcements' }, { status: 403 })];
                    }
                    return [4 /*yield*/, request.json()
                        // Validate input
                    ];
                case 3:
                    _a = _b.sent(), title = _a.title, content = _a.content, courseId = _a.courseId, priority = _a.priority, sendEmail = _a.sendEmail, publishAt = _a.publishAt;
                    // Validate input
                    if (!title || !content || !courseId) {
                        return [2 /*return*/, NextResponse.json({ error: 'Title, content, and course are required' }, { status: 400 })];
                    }
                    return [4 /*yield*/, Course.findById(courseId)];
                case 4:
                    course = _b.sent();
                    if (!course || course.teacher.toString() !== teacher._id.toString()) {
                        return [2 /*return*/, NextResponse.json({ error: 'You can only create announcements for your own courses' }, { status: 403 })];
                    }
                    announcement = new Announcement({
                        title: title,
                        content: content,
                        course: courseId,
                        teacher: teacher._id,
                        priority: priority || 'normal',
                        sendEmail: sendEmail || false,
                        publishAt: publishAt ? new Date(publishAt) : new Date(),
                        isPublished: !publishAt // If no publishAt time, publish immediately
                    });
                    return [4 /*yield*/, announcement.save()
                        // Populate course and teacher info
                    ];
                case 5:
                    _b.sent();
                    // Populate course and teacher info
                    return [4 /*yield*/, announcement.populate('course', 'title subject gradeLevel')];
                case 6:
                    // Populate course and teacher info
                    _b.sent();
                    return [4 /*yield*/, announcement.populate('teacher', 'name')];
                case 7:
                    _b.sent();
                    return [2 /*return*/, NextResponse.json({
                            message: 'Announcement created successfully',
                            announcement: announcement
                        }, { status: 201 })];
                case 8:
                    error_1 = _b.sent();
                    console.error('Error creating announcement:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, user, announcements, teacherCourses, courseIds, studentCourses, courseIds, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _a.sent();
                    authHeader = request.headers.get('authorization');
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ error: 'Authorization token required' }, { status: 401 })];
                    }
                    token = authHeader.substring(7);
                    decoded = void 0;
                    try {
                        decoded = jwt.verify(token, process.env.JWT_SECRET);
                    }
                    catch (error) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid token' }, { status: 401 })];
                    }
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, NextResponse.json({ error: 'User not found' }, { status: 404 })];
                    }
                    announcements = void 0;
                    if (!(user.role === 'teacher')) return [3 /*break*/, 5];
                    return [4 /*yield*/, Course.find({ teacher: user._id })];
                case 3:
                    teacherCourses = _a.sent();
                    courseIds = teacherCourses.map(function (course) { return course._id; });
                    return [4 /*yield*/, Announcement.find({
                            course: { $in: courseIds },
                            isPublished: true
                        })
                            .populate('course', 'title subject gradeLevel')
                            .populate('teacher', 'name')
                            .sort({ createdAt: -1 })];
                case 4:
                    announcements = _a.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, Course.find({ students: user._id })];
                case 6:
                    studentCourses = _a.sent();
                    courseIds = studentCourses.map(function (course) { return course._id; });
                    return [4 /*yield*/, Announcement.find({
                            course: { $in: courseIds },
                            isPublished: true,
                            publishAt: { $lte: new Date() }
                        })
                            .populate('course', 'title subject gradeLevel')
                            .populate('teacher', 'name')
                            .sort({ createdAt: -1 })];
                case 7:
                    announcements = _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, NextResponse.json({ announcements: announcements })];
                case 9:
                    error_2 = _a.sent();
                    console.error('Error fetching announcements:', error_2);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
