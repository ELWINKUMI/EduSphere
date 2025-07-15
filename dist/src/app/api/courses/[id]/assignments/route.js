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
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import Course from '@/models/Course';
import User from '@/models/User';
import Submission from '@/models/Submission';
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var authHeader, token, decoded, user_1, id, course, isEnrolled, assignments, assignmentsWithStatus, error_1;
        var _this = this;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _c.sent();
                    authHeader = request.headers.get('authorization');
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 401 })];
                    }
                    token = authHeader.substring(7);
                    decoded = jwt.verify(token, JWT_SECRET);
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 2:
                    user_1 = _c.sent();
                    if (!user_1) {
                        return [2 /*return*/, NextResponse.json({ error: 'User not found' }, { status: 404 })];
                    }
                    return [4 /*yield*/, params];
                case 3:
                    id = (_c.sent()).id;
                    return [4 /*yield*/, Course.findById(id)];
                case 4:
                    course = _c.sent();
                    if (!course) {
                        return [2 /*return*/, NextResponse.json({ error: 'Course not found' }, { status: 404 })];
                    }
                    // Check if student is enrolled in this course (for students)
                    if (user_1.role === 'student') {
                        isEnrolled = course.students.some(function (studentId) { return studentId.toString() === user_1._id.toString(); });
                        if (!isEnrolled) {
                            return [2 /*return*/, NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })];
                        }
                    }
                    return [4 /*yield*/, Assignment.find({
                            course: id,
                            isActive: true
                        })
                            .select('title description dueDate maxPoints attachments submissionType')
                            .sort({ dueDate: 1 })
                            .lean()
                        // Get submission status for each assignment (for students)
                    ];
                case 5:
                    assignments = _c.sent();
                    if (!(user_1.role === 'student')) return [3 /*break*/, 7];
                    return [4 /*yield*/, Promise.all(assignments.map(function (assignment) { return __awaiter(_this, void 0, void 0, function () {
                            var submission, status, grade, feedback;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Submission.findOne({
                                            assignment: assignment._id,
                                            student: user_1._id
                                        }).lean()];
                                    case 1:
                                        submission = _a.sent();
                                        status = 'pending';
                                        grade = undefined;
                                        feedback = undefined;
                                        if (submission) {
                                            if (submission.isGraded) {
                                                status = 'graded';
                                                grade = submission.grade;
                                                feedback = submission.feedback;
                                            }
                                            else {
                                                status = 'submitted';
                                            }
                                        }
                                        else if (new Date() > new Date(assignment.dueDate)) {
                                            status = 'overdue';
                                        }
                                        return [2 /*return*/, __assign(__assign({}, assignment), { status: status, grade: grade, feedback: feedback })];
                                }
                            });
                        }); }))];
                case 6:
                    assignmentsWithStatus = _c.sent();
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            assignments: assignmentsWithStatus
                        })];
                case 7: 
                // For teachers, just return the assignments without status
                return [2 /*return*/, NextResponse.json({
                        success: true,
                        assignments: assignments
                    })];
                case 8:
                    error_1 = _c.sent();
                    console.error('Error fetching assignments:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
