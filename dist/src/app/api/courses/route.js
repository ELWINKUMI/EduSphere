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
import Course from '@/models/Course';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { ALL_GRADES, getSubjectsForGrade } from '@/lib/schoolConfig';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, teacher, _a, title, subject, gradeLevel, description, maxStudents, enrollmentCode, allowedSubjects, existingCourse, finalEnrollmentCode, existingCode, course, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, connectDB()
                        // Get token from authorization header
                    ];
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
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can create courses' }, { status: 403 })];
                    }
                    return [4 /*yield*/, request.json()
                        // Validate input
                    ];
                case 3:
                    _a = _b.sent(), title = _a.title, subject = _a.subject, gradeLevel = _a.gradeLevel, description = _a.description, maxStudents = _a.maxStudents, enrollmentCode = _a.enrollmentCode;
                    // Validate input
                    if (!title || !subject || !gradeLevel || !description) {
                        return [2 /*return*/, NextResponse.json({ error: 'Title, subject, grade level, and description are required' }, { status: 400 })];
                    }
                    // Validate grade level
                    if (!ALL_GRADES.includes(gradeLevel)) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid grade level' }, { status: 400 })];
                    }
                    allowedSubjects = getSubjectsForGrade(gradeLevel);
                    if (!allowedSubjects.includes(subject)) {
                        return [2 /*return*/, NextResponse.json({ error: "Subject \"".concat(subject, "\" is not available for ").concat(gradeLevel) }, { status: 400 })];
                    }
                    return [4 /*yield*/, Course.findOne({
                            subject: subject,
                            gradeLevel: gradeLevel,
                            teacher: teacher._id
                        })];
                case 4:
                    existingCourse = _b.sent();
                    if (existingCourse) {
                        return [2 /*return*/, NextResponse.json({ error: "You already have a course for ".concat(subject, " in ").concat(gradeLevel) }, { status: 409 })];
                    }
                    finalEnrollmentCode = enrollmentCode ||
                        "".concat(subject.substring(0, 3).toUpperCase()).concat(gradeLevel.replace(/\s/g, '')).concat(Math.random().toString(36).substring(2, 5).toUpperCase());
                    return [4 /*yield*/, Course.findOne({ enrollmentCode: finalEnrollmentCode })];
                case 5:
                    existingCode = _b.sent();
                    if (existingCode) {
                        return [2 /*return*/, NextResponse.json({ error: 'Enrollment code already exists. Please generate a new one.' }, { status: 409 })];
                    }
                    course = new Course({
                        title: title || "".concat(subject, " - ").concat(gradeLevel),
                        description: description,
                        subject: subject,
                        gradeLevel: gradeLevel,
                        teacher: teacher._id,
                        enrollmentCode: finalEnrollmentCode,
                        code: finalEnrollmentCode,
                        maxStudents: maxStudents ? parseInt(maxStudents) : 30,
                        students: [],
                        assignments: [],
                        quizzes: [],
                        resources: [],
                        announcements: [],
                        isActive: true
                    });
                    return [4 /*yield*/, course.save()];
                case 6:
                    _b.sent();
                    return [2 /*return*/, NextResponse.json({
                            message: 'Course created successfully',
                            course: {
                                id: course._id.toString(),
                                title: course.title,
                                subject: course.subject,
                                gradeLevel: course.gradeLevel,
                                code: course.code
                            }
                        }, { status: 201 })];
                case 7:
                    error_1 = _b.sent();
                    console.error('Create course error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, user, courses, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
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
                    courses = [];
                    if (!(user.role === 'teacher')) return [3 /*break*/, 4];
                    return [4 /*yield*/, Course.find({ teacher: user._id })
                            .sort({ createdAt: -1 })
                            .select('title subject gradeLevel enrollmentCode isActive createdAt')
                            .lean()];
                case 3:
                    // Teacher: return simplified courses they teach
                    courses = _a.sent();
                    courses = courses.map(function (c) {
                        var _a, _b;
                        return ({
                            id: ((_b = (_a = c._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || '',
                            title: c.title,
                            subject: c.subject,
                            gradeLevel: c.gradeLevel,
                            enrollmentCode: c.enrollmentCode,
                            isActive: c.isActive,
                            createdAt: c.createdAt,
                            code: c.enrollmentCode
                        });
                    });
                    return [3 /*break*/, 7];
                case 4:
                    if (!(user.role === 'student')) return [3 /*break*/, 6];
                    return [4 /*yield*/, Course.find({ students: user._id })
                            .sort({ createdAt: -1 })
                            .select('title subject gradeLevel enrollmentCode teacher isActive createdAt')
                            .populate({ path: 'teacher', select: 'name email' })
                            .lean()];
                case 5:
                    // Student: return simplified courses they are enrolled in, with teacher's name/email
                    courses = _a.sent();
                    courses = courses.map(function (c) {
                        var _a, _b;
                        return ({
                            id: ((_b = (_a = c._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || '',
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
                    return [3 /*break*/, 7];
                case 6: return [2 /*return*/, NextResponse.json({ error: 'Unauthorized role' }, { status: 403 })];
                case 7: return [2 /*return*/, NextResponse.json({
                        courses: courses
                    })];
                case 8:
                    error_2 = _a.sent();
                    console.error('Get courses error:', error_2);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
