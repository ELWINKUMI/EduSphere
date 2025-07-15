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
import Course from '@/models/Course';
import User from '@/models/User';
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var authHeader, token, decoded, user_1, id, course, isEnrolled, courseData, error_1;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _c.sent();
                    authHeader = request.headers.get('authorization');
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 401 })];
                    }
                    token = authHeader.substring(7);
                    decoded = void 0;
                    try {
                        decoded = jwt.verify(token, JWT_SECRET);
                    }
                    catch (err) {
                        if (err && typeof err === 'object' && 'name' in err && err.name === 'TokenExpiredError') {
                            return [2 /*return*/, NextResponse.json({ error: 'Token expired' }, { status: 401 })];
                        }
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid token' }, { status: 401 })];
                    }
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 2:
                    user_1 = _c.sent();
                    if (!user_1) {
                        return [2 /*return*/, NextResponse.json({ error: 'User not found' }, { status: 404 })];
                    }
                    return [4 /*yield*/, params
                        // Validate ObjectId
                    ];
                case 3:
                    id = (_c.sent()).id;
                    // Validate ObjectId
                    if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid course id' }, { status: 400 })];
                    }
                    return [4 /*yield*/, Course.findById(id)
                            .populate('teacher', 'name email')
                            .populate('students', 'name email gradeLevel')];
                case 4:
                    course = _c.sent();
                    if (!course) {
                        return [2 /*return*/, NextResponse.json({ error: 'Course not found' }, { status: 404 })];
                    }
                    // Check if student is enrolled in this course (for students)
                    if (user_1.role === 'student') {
                        isEnrolled = course.students.some(function (student) { return student._id.toString() === user_1._id.toString(); });
                        if (!isEnrolled) {
                            return [2 /*return*/, NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })];
                        }
                    }
                    // Check if teacher owns this course (for teachers)
                    if (user_1.role === 'teacher') {
                        if (course.teacher._id.toString() !== user_1._id.toString()) {
                            return [2 /*return*/, NextResponse.json({ error: 'Access denied' }, { status: 403 })];
                        }
                    }
                    courseData = {
                        id: course._id.toString(),
                        title: course.title,
                        subject: course.subject,
                        gradeLevel: course.gradeLevel,
                        description: course.description,
                        teacher: {
                            id: course.teacher._id.toString(),
                            name: course.teacher.name,
                            email: course.teacher.email,
                        },
                        maxStudents: course.maxStudents,
                        enrollmentCode: course.enrollmentCode,
                        enrolledStudents: course.students.map(function (student) { return ({
                            id: student._id.toString(),
                            name: student.name,
                            email: student.email,
                            gradeLevel: student.gradeLevel,
                        }); }),
                        createdAt: course.createdAt,
                    };
                    return [2 /*return*/, NextResponse.json({
                            course: courseData,
                        })];
                case 5:
                    error_1 = _c.sent();
                    console.error('Error fetching course:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
