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
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, student, enrollmentCode, course, currentEnrollment, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
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
                    student = _a.sent();
                    if (!student || student.role !== 'student') {
                        return [2 /*return*/, NextResponse.json({ error: 'Only students can enroll in courses' }, { status: 403 })];
                    }
                    return [4 /*yield*/, request.json()];
                case 3:
                    enrollmentCode = (_a.sent()).enrollmentCode;
                    if (!enrollmentCode) {
                        return [2 /*return*/, NextResponse.json({ error: 'Enrollment code is required' }, { status: 400 })];
                    }
                    return [4 /*yield*/, Course.findOne({
                            enrollmentCode: enrollmentCode.trim().toUpperCase()
                        }).populate('teacher', 'name')];
                case 4:
                    course = _a.sent();
                    if (!course) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid enrollment code' }, { status: 404 })];
                    }
                    // Check if student's grade level matches course grade level
                    if (student.gradeLevel !== course.gradeLevel) {
                        return [2 /*return*/, NextResponse.json({ error: "This course is for ".concat(course.gradeLevel, " students only") }, { status: 400 })];
                    }
                    // Check if student is already enrolled
                    if (course.students && course.students.includes(student._id)) {
                        return [2 /*return*/, NextResponse.json({ error: 'You are already enrolled in this course' }, { status: 409 })];
                    }
                    currentEnrollment = course.students ? course.students.length : 0;
                    if (currentEnrollment >= course.maxStudents) {
                        return [2 /*return*/, NextResponse.json({ error: 'Course is full' }, { status: 400 })];
                    }
                    // Enroll student in course
                    return [4 /*yield*/, Course.findByIdAndUpdate(course._id, {
                            $addToSet: { students: student._id }
                        })];
                case 5:
                    // Enroll student in course
                    _a.sent();
                    return [2 /*return*/, NextResponse.json({
                            message: 'Successfully enrolled in course',
                            course: {
                                id: course._id,
                                title: course.title,
                                subject: course.subject,
                                gradeLevel: course.gradeLevel,
                                teacher: course.teacher.name
                            }
                        })];
                case 6:
                    error_1 = _a.sent();
                    console.error('Course enrollment error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
