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
import Quiz from '@/models/Quiz';
import Submission from '@/models/Submission';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, student, enrolledCoursesDocs, enrolledCourseIds, enrolledCourses, courseAssignments, assignmentIds, submittedAssignments, submittedAssignmentIds, pendingAssignments, now, courseQuizzes, quizIds, QuizSubmission, submittedQuizzes, submittedQuizIds_1, upcomingQuizzes, gradedSubmissions, overallGrade, totalPercentage, validSubmissions, _i, gradedSubmissions_1, submission, assignment, percentage, averagePercentage, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
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
                        return [2 /*return*/, NextResponse.json({ error: 'Only students can view these stats' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Course.find({ students: student._id }).select('_id')];
                case 3:
                    enrolledCoursesDocs = _a.sent();
                    enrolledCourseIds = enrolledCoursesDocs.map(function (c) { return c._id; });
                    enrolledCourses = enrolledCourseIds.length;
                    return [4 /*yield*/, Assignment.find({
                            course: { $in: enrolledCourseIds },
                            isActive: true
                        }).select('_id')];
                case 4:
                    courseAssignments = _a.sent();
                    assignmentIds = courseAssignments.map(function (a) { return a._id; });
                    return [4 /*yield*/, Submission.find({
                            student: new mongoose.Types.ObjectId(student._id),
                            assignment: { $in: assignmentIds }
                        }).select('assignment')];
                case 5:
                    submittedAssignments = _a.sent();
                    submittedAssignmentIds = submittedAssignments.map(function (s) { return s.assignment.toString(); });
                    pendingAssignments = assignmentIds.length - submittedAssignmentIds.length;
                    now = new Date();
                    return [4 /*yield*/, Quiz.find({
                            course: { $in: enrolledCourseIds },
                            endDate: { $gt: now },
                            isActive: true
                        }).select('_id')];
                case 6:
                    courseQuizzes = _a.sent();
                    quizIds = courseQuizzes.map(function (q) { return q._id; });
                    return [4 /*yield*/, import('@/models/QuizSubmission')];
                case 7:
                    QuizSubmission = (_a.sent()).default;
                    return [4 /*yield*/, QuizSubmission.find({
                            student: new mongoose.Types.ObjectId(student._id),
                            quiz: { $in: quizIds }
                        }).select('quiz')];
                case 8:
                    submittedQuizzes = _a.sent();
                    submittedQuizIds_1 = submittedQuizzes.map(function (s) { return s.quiz.toString(); });
                    upcomingQuizzes = quizIds.filter(function (qid) { return !submittedQuizIds_1.includes(qid.toString()); }).length;
                    return [4 /*yield*/, Submission.find({
                            student: new mongoose.Types.ObjectId(student._id),
                            isGraded: true,
                            grade: { $exists: true }
                        }).populate('assignment', 'maxPoints').select('grade assignment')];
                case 9:
                    gradedSubmissions = _a.sent();
                    overallGrade = 'N/A';
                    if (gradedSubmissions.length > 0) {
                        totalPercentage = 0;
                        validSubmissions = 0;
                        for (_i = 0, gradedSubmissions_1 = gradedSubmissions; _i < gradedSubmissions_1.length; _i++) {
                            submission = gradedSubmissions_1[_i];
                            assignment = submission.assignment;
                            if (assignment && assignment.maxPoints > 0) {
                                percentage = (submission.grade / assignment.maxPoints) * 100;
                                totalPercentage += percentage;
                                validSubmissions++;
                            }
                        }
                        if (validSubmissions > 0) {
                            averagePercentage = totalPercentage / validSubmissions;
                            if (averagePercentage >= 97)
                                overallGrade = 'A+';
                            else if (averagePercentage >= 93)
                                overallGrade = 'A';
                            else if (averagePercentage >= 90)
                                overallGrade = 'A-';
                            else if (averagePercentage >= 87)
                                overallGrade = 'B+';
                            else if (averagePercentage >= 83)
                                overallGrade = 'B';
                            else if (averagePercentage >= 80)
                                overallGrade = 'B-';
                            else if (averagePercentage >= 77)
                                overallGrade = 'C+';
                            else if (averagePercentage >= 73)
                                overallGrade = 'C';
                            else if (averagePercentage >= 70)
                                overallGrade = 'C-';
                            else if (averagePercentage >= 67)
                                overallGrade = 'D+';
                            else if (averagePercentage >= 63)
                                overallGrade = 'D';
                            else if (averagePercentage >= 60)
                                overallGrade = 'D-';
                            else
                                overallGrade = 'F';
                            console.log('Grade calculation:', {
                                validSubmissions: validSubmissions,
                                totalPercentage: totalPercentage,
                                averagePercentage: averagePercentage,
                                overallGrade: overallGrade
                            });
                        }
                    }
                    return [2 /*return*/, NextResponse.json({
                            enrolledCourses: enrolledCourses,
                            pendingAssignments: pendingAssignments,
                            upcomingQuizzes: upcomingQuizzes,
                            overallGrade: overallGrade
                        })];
                case 10:
                    error_1 = _a.sent();
                    console.error('Get student stats error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 11: return [2 /*return*/];
            }
        });
    });
}
