var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import Course from '@/models/Course';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { writeFile } from 'fs/promises';
import path from 'path';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, teacher, title, description, courseId, dueDate, maxPoints, submissionType, attachmentFiles, contentType, formData, body, course, attachments, _loop_1, _i, attachmentFiles_1, file, assignment_1, Notification_1, courseWithStudents, notifications, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 18, , 19]);
                    return [4 /*yield*/, connectDB()
                        // Get token from authorization header
                    ];
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
                    teacher = _a.sent();
                    if (!teacher || teacher.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can create assignments' }, { status: 403 })];
                    }
                    title = void 0, description = void 0, courseId = void 0, dueDate = void 0, maxPoints = void 0, submissionType = void 0, attachmentFiles = void 0;
                    contentType = request.headers.get('content-type') || '';
                    if (!contentType.includes('multipart/form-data')) return [3 /*break*/, 4];
                    return [4 /*yield*/, request.formData()];
                case 3:
                    formData = _a.sent();
                    title = formData.get('title');
                    description = formData.get('description');
                    courseId = formData.get('course');
                    dueDate = formData.get('dueDate');
                    maxPoints = parseInt(formData.get('maxPoints'));
                    submissionType = formData.get('submissionType') || 'both';
                    attachmentFiles = formData.getAll('attachments');
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, request.json()];
                case 5:
                    body = _a.sent();
                    title = body.title;
                    description = body.description;
                    courseId = body.courseId;
                    dueDate = body.dueDate;
                    maxPoints = body.maxPoints;
                    submissionType = body.submissionType || 'both';
                    attachmentFiles = [];
                    _a.label = 6;
                case 6:
                    // Validate input
                    if (!title || !description || !courseId || !dueDate || !maxPoints) {
                        return [2 /*return*/, NextResponse.json({ error: 'All fields are required' }, { status: 400 })];
                    }
                    // Validate courseId is a valid ObjectId
                    if (!mongoose.Types.ObjectId.isValid(courseId)) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid course ID format. Please select a valid course.' }, { status: 400 })];
                    }
                    return [4 /*yield*/, Course.findById(courseId)];
                case 7:
                    course = _a.sent();
                    if (!course || course.teacher.toString() !== teacher._id.toString()) {
                        return [2 /*return*/, NextResponse.json({ error: 'Course not found or you do not have permission to create assignments for this course' }, { status: 403 })];
                    }
                    attachments = [];
                    if (!(attachmentFiles && attachmentFiles.length > 0)) return [3 /*break*/, 11];
                    _loop_1 = function (file) {
                        var bytes, buffer, filename, filepath, uploadDir_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(file && file.size > 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, file.arrayBuffer()];
                                case 1:
                                    bytes = _b.sent();
                                    buffer = Buffer.from(bytes);
                                    filename = "".concat(Date.now(), "-").concat(file.name);
                                    filepath = path.join(process.cwd(), 'public/uploads/assignments', filename);
                                    uploadDir_1 = path.dirname(filepath);
                                    return [4 /*yield*/, import('fs').then(function (fs) {
                                            if (!fs.existsSync(uploadDir_1)) {
                                                fs.mkdirSync(uploadDir_1, { recursive: true });
                                            }
                                        })];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, writeFile(filepath, buffer)];
                                case 3:
                                    _b.sent();
                                    attachments.push(filename);
                                    _b.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, attachmentFiles_1 = attachmentFiles;
                    _a.label = 8;
                case 8:
                    if (!(_i < attachmentFiles_1.length)) return [3 /*break*/, 11];
                    file = attachmentFiles_1[_i];
                    return [5 /*yield**/, _loop_1(file)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 8];
                case 11:
                    assignment_1 = new Assignment({
                        title: title,
                        description: description,
                        course: courseId,
                        teacher: teacher._id,
                        startDate: new Date(),
                        dueDate: new Date(dueDate),
                        maxPoints: maxPoints,
                        attachments: attachments,
                        submissionType: submissionType || 'both',
                        submissions: [],
                        isActive: true
                    });
                    return [4 /*yield*/, assignment_1.save()
                        // Add assignment to course
                    ];
                case 12:
                    _a.sent();
                    // Add assignment to course
                    return [4 /*yield*/, Course.findByIdAndUpdate(courseId, {
                            $push: { assignments: assignment_1._id }
                        })
                        // Notify all students in the course
                    ];
                case 13:
                    // Add assignment to course
                    _a.sent();
                    return [4 /*yield*/, import('@/models/Notification')];
                case 14:
                    Notification_1 = (_a.sent()).default;
                    return [4 /*yield*/, Course.findById(courseId).select('students')];
                case 15:
                    courseWithStudents = _a.sent();
                    if (!(courseWithStudents && Array.isArray(courseWithStudents.students))) return [3 /*break*/, 17];
                    notifications = courseWithStudents.students.map(function (studentId) { return ({
                        student: studentId,
                        type: 'other',
                        content: "New assignment: ".concat(assignment_1.title, " has been posted."),
                        read: false
                    }); });
                    if (!(notifications.length > 0)) return [3 /*break*/, 17];
                    return [4 /*yield*/, Notification_1.insertMany(notifications)];
                case 16:
                    _a.sent();
                    _a.label = 17;
                case 17: return [2 /*return*/, NextResponse.json({
                        message: 'Assignment created successfully',
                        assignment: {
                            id: assignment_1._id,
                            title: assignment_1.title,
                            description: assignment_1.description,
                            dueDate: assignment_1.dueDate,
                            maxPoints: assignment_1.maxPoints,
                            course: course.title
                        }
                    }, { status: 201 })];
                case 18:
                    error_1 = _a.sent();
                    console.error('Create assignment error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 19: return [2 /*return*/];
            }
        });
    });
}
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, user, assignments, courses, courseIds, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, connectDB()
                        // Get token from authorization header
                    ];
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
                    assignments = [];
                    courses = [];
                    if (!(user.role === 'teacher')) return [3 /*break*/, 5];
                    return [4 /*yield*/, Course.find({ teacher: user._id })];
                case 3:
                    // Get teacher's courses
                    courses = _a.sent();
                    courses = courses.map(function (c) {
                        var _a, _b;
                        return ({
                            _id: ((_b = (_a = c._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || '',
                            title: c.title,
                            subject: c.subject,
                            gradeLevel: c.gradeLevel,
                            enrollmentCode: c.enrollmentCode,
                            isActive: c.isActive,
                            createdAt: c.createdAt,
                            code: c.enrollmentCode
                        });
                    });
                    return [4 /*yield*/, Assignment.find({ teacher: user._id })
                            .populate('course', 'title gradeLevel subject')
                            .populate('submissions')
                            .sort({ createdAt: -1 })
                            .lean()];
                case 4:
                    // Get teacher's assignments
                    assignments = _a.sent();
                    // Add submissionCount to each assignment
                    assignments = assignments.map(function (a) { return (__assign(__assign({}, a), { submissionCount: Array.isArray(a.submissions) ? a.submissions.length : 0 })); });
                    return [3 /*break*/, 8];
                case 5:
                    if (!(user.role === 'student')) return [3 /*break*/, 8];
                    return [4 /*yield*/, Course.find({ gradeLevel: user.gradeLevel }).populate('teacher', 'name email')];
                case 6:
                    // Get student's courses
                    courses = _a.sent();
                    courses = courses.map(function (c) {
                        var _a, _b;
                        return ({
                            _id: ((_b = (_a = c._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || '',
                            title: c.title,
                            subject: c.subject,
                            gradeLevel: c.gradeLevel,
                            enrollmentCode: c.enrollmentCode,
                            isActive: c.isActive,
                            createdAt: c.createdAt,
                            code: c.enrollmentCode,
                            teacher: c.teacher && c.teacher.name
                                ? { name: c.teacher.name, email: c.teacher.email }
                                : { name: 'Unknown', email: '' }
                        });
                    });
                    courseIds = courses.map(function (c) { return c._id; });
                    return [4 /*yield*/, Assignment.find({
                            course: { $in: courseIds },
                            isActive: true
                        })
                            .populate('course', 'title gradeLevel subject')
                            .populate('teacher', 'name')
                            .sort({ dueDate: 1 })
                            .lean()];
                case 7:
                    assignments = _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, NextResponse.json({
                        assignments: assignments.map(function (a) { return (__assign(__assign({}, a), { dueDate: a.dueDate instanceof Date ? a.dueDate.toISOString() : (a.dueDate ? new Date(a.dueDate).toISOString() : null) })); }),
                        courses: courses
                    })];
                case 9:
                    error_2 = _a.sent();
                    console.error('Get assignments error:', error_2);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
