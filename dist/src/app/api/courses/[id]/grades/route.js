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
import Submission from '@/models/Submission';
import QuizSubmission from '@/models/QuizSubmission';
import Assignment from '@/models/Assignment';
import Quiz from '@/models/Quiz';
import jwt from 'jsonwebtoken';
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var courseId, authorization, token, decoded, course, assignments, quizzes, assignmentSubmissions, quizSubmissions, grades, _i, assignmentSubmissions_1, submission, assignment, maxPoints, _c, quizSubmissions_1, submission, quiz, error_1;
        var params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, params
                        // Get and verify token
                    ];
                case 2:
                    courseId = (_d.sent()).id;
                    authorization = request.headers.get('authorization');
                    if (!authorization || !authorization.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    token = authorization.split(' ')[1];
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    return [4 /*yield*/, Course.findById(courseId)];
                case 3:
                    course = _d.sent();
                    if (!course) {
                        return [2 /*return*/, NextResponse.json({ message: 'Course not found' }, { status: 404 })];
                    }
                    // Verify access based on role
                    if (decoded.role === 'student') {
                        if (!course.students.includes(decoded.userId)) {
                            return [2 /*return*/, NextResponse.json({ message: 'You are not enrolled in this course' }, { status: 403 })];
                        }
                    }
                    else if (decoded.role === 'teacher') {
                        if (course.teacher.toString() !== decoded.userId) {
                            return [2 /*return*/, NextResponse.json({ message: 'You do not have access to this course' }, { status: 403 })];
                        }
                    }
                    else {
                        return [2 /*return*/, NextResponse.json({ message: 'Access denied' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Assignment.find({ course: courseId })];
                case 4:
                    assignments = _d.sent();
                    return [4 /*yield*/, Quiz.find({ course: courseId })
                        // Get student's submissions
                    ];
                case 5:
                    quizzes = _d.sent();
                    return [4 /*yield*/, Submission.find({
                            student: decoded.userId,
                            assignment: { $in: assignments.map(function (a) { return a._id; }) }
                        }).populate('assignment', 'title maxPoints')];
                case 6:
                    assignmentSubmissions = _d.sent();
                    return [4 /*yield*/, QuizSubmission.find({
                            student: decoded.userId,
                            quiz: { $in: quizzes.map(function (q) { return q._id; }) }
                        }).populate('quiz', 'title')
                        // Combine and format grades
                    ];
                case 7:
                    quizSubmissions = _d.sent();
                    grades = [];
                    // Add assignment grades
                    for (_i = 0, assignmentSubmissions_1 = assignmentSubmissions; _i < assignmentSubmissions_1.length; _i++) {
                        submission = assignmentSubmissions_1[_i];
                        if (submission.grade !== undefined && submission.grade !== null) {
                            assignment = submission.assignment;
                            maxPoints = assignment.maxPoints || 100;
                            grades.push({
                                _id: submission._id,
                                type: 'assignment',
                                title: assignment.title,
                                score: submission.grade,
                                maxScore: maxPoints,
                                percentage: Math.round((submission.grade / maxPoints) * 100),
                                submittedAt: submission.submittedAt,
                                gradedAt: submission.updatedAt,
                                itemId: assignment._id.toString()
                            });
                        }
                    }
                    // Add quiz grades
                    for (_c = 0, quizSubmissions_1 = quizSubmissions; _c < quizSubmissions_1.length; _c++) {
                        submission = quizSubmissions_1[_c];
                        if (submission.isGraded && submission.score !== undefined) {
                            quiz = submission.quiz;
                            grades.push({
                                _id: submission._id,
                                type: 'quiz',
                                title: quiz.title,
                                score: submission.score,
                                maxScore: submission.maxScore,
                                percentage: submission.maxScore > 0 ? Math.round((submission.score / submission.maxScore) * 100) : 0,
                                submittedAt: submission.submittedAt,
                                gradedAt: submission.submittedAt, // Quizzes are auto-graded
                                itemId: quiz._id.toString()
                            });
                        }
                    }
                    // Sort by submission date (newest first)
                    grades.sort(function (a, b) { return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(); });
                    return [2 /*return*/, NextResponse.json({
                            grades: grades,
                            summary: {
                                totalGraded: grades.length,
                                averagePercentage: grades.length > 0 ? Math.round(grades.reduce(function (sum, g) { return sum + g.percentage; }, 0) / grades.length) : 0,
                                highGrades: grades.filter(function (g) { return g.percentage >= 80; }).length
                            }
                        }, { status: 200 })];
                case 8:
                    error_1 = _d.sent();
                    console.error('Error fetching course grades:', error_1);
                    return [2 /*return*/, NextResponse.json({ message: 'Internal server error' }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
