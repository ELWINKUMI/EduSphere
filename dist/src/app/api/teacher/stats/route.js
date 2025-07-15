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
import User from '@/models/User';
import Course from '@/models/Course';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import Quiz from '@/models/Quiz';
import jwt from 'jsonwebtoken';
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, teacher, studentsCount, coursesCount, teacherCourses, courseIds, teacherAssignments, assignmentIds, pendingSubmissions, today, startOfDay, endOfDay, todayQuizzes, error_1;
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
                    teacher = _a.sent();
                    if (!teacher || teacher.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can view stats' }, { status: 403 })];
                    }
                    return [4 /*yield*/, User.countDocuments({
                            role: 'student'
                        })
                        // Get teacher's courses count
                    ];
                case 3:
                    studentsCount = _a.sent();
                    return [4 /*yield*/, Course.countDocuments({
                            teacher: teacher._id
                        })
                        // Get pending assignments (assignments with submissions that need grading)
                        // Count ungraded submissions for teacher's courses
                    ];
                case 4:
                    coursesCount = _a.sent();
                    return [4 /*yield*/, Course.find({ teacher: teacher._id }).select('_id')];
                case 5:
                    teacherCourses = _a.sent();
                    courseIds = teacherCourses.map(function (c) { return c._id; });
                    return [4 /*yield*/, Assignment.find({ course: { $in: courseIds } }).select('_id')];
                case 6:
                    teacherAssignments = _a.sent();
                    assignmentIds = teacherAssignments.map(function (a) { return a._id; });
                    return [4 /*yield*/, Submission.countDocuments({
                            assignment: { $in: assignmentIds },
                            isGraded: false
                        })
                        // Get today's quizzes from teacher's courses
                    ];
                case 7:
                    pendingSubmissions = _a.sent();
                    today = new Date();
                    startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
                    return [4 /*yield*/, Quiz.countDocuments({
                            course: { $in: courseIds },
                            $or: [
                                {
                                    startDate: {
                                        $gte: startOfDay,
                                        $lt: endOfDay
                                    }
                                },
                                {
                                    endDate: {
                                        $gte: startOfDay,
                                        $lt: endOfDay
                                    }
                                }
                            ]
                        })];
                case 8:
                    todayQuizzes = _a.sent();
                    return [2 /*return*/, NextResponse.json({
                            totalStudents: studentsCount,
                            totalCourses: coursesCount,
                            pendingAssignments: pendingSubmissions,
                            todayQuizzes: todayQuizzes
                        })];
                case 9:
                    error_1 = _a.sent();
                    console.error('Get teacher stats error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
