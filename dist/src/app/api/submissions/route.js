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
import Submission from '@/models/Submission';
import Notification from '@/models/Notification';
import Assignment from '@/models/Assignment';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, student, _a, assignmentId, content, files, assignment, now, isLate, existingSubmission, submission, assignmentPop, notifyErr_1, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 14, , 15]);
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
                    student = _b.sent();
                    if (!student || student.role !== 'student') {
                        return [2 /*return*/, NextResponse.json({ error: 'Only students can submit assignments' }, { status: 403 })];
                    }
                    return [4 /*yield*/, request.json()
                        // Validate input
                    ];
                case 3:
                    _a = _b.sent(), assignmentId = _a.assignmentId, content = _a.content, files = _a.files;
                    // Validate input
                    if (!assignmentId) {
                        return [2 /*return*/, NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 })];
                    }
                    return [4 /*yield*/, Assignment.findById(assignmentId)];
                case 4:
                    assignment = _b.sent();
                    if (!assignment || !assignment.isActive) {
                        return [2 /*return*/, NextResponse.json({ error: 'Assignment not found or no longer active' }, { status: 404 })];
                    }
                    now = new Date();
                    isLate = now > assignment.dueDate;
                    return [4 /*yield*/, Submission.findOne({
                            assignment: assignmentId,
                            student: student._id
                        })];
                case 5:
                    existingSubmission = _b.sent();
                    if (existingSubmission) {
                        return [2 /*return*/, NextResponse.json({ error: 'You have already submitted this assignment' }, { status: 409 })];
                    }
                    submission = new Submission({
                        assignment: assignmentId,
                        student: student._id,
                        content: content || '',
                        files: files || [],
                        submittedAt: now,
                        isLate: isLate,
                        isGraded: false
                    });
                    return [4 /*yield*/, submission.save()
                        // Notify teacher of new submission
                    ];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 11, , 12]);
                    return [4 /*yield*/, Assignment.findById(assignmentId).populate('teacher')];
                case 8:
                    assignmentPop = _b.sent();
                    if (!(assignmentPop && assignmentPop.teacher)) return [3 /*break*/, 10];
                    return [4 /*yield*/, Notification.create({
                            teacher: assignmentPop.teacher._id,
                            type: 'assignment_submission',
                            studentName: student.name,
                            content: "".concat(student.name, " submitted assignment: ").concat(assignment.title),
                        })];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    notifyErr_1 = _b.sent();
                    // Log but don't block submission
                    console.error('Notification error:', notifyErr_1);
                    return [3 /*break*/, 12];
                case 12: 
                // Add submission to assignment
                return [4 /*yield*/, Assignment.findByIdAndUpdate(assignmentId, {
                        $push: { submissions: submission._id }
                    })];
                case 13:
                    // Add submission to assignment
                    _b.sent();
                    return [2 /*return*/, NextResponse.json({
                            message: 'Assignment submitted successfully',
                            submission: {
                                id: submission._id,
                                submittedAt: submission.submittedAt,
                                isLate: submission.isLate
                            }
                        }, { status: 201 })];
                case 14:
                    error_1 = _b.sent();
                    console.error('Submit assignment error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 15: return [2 /*return*/];
            }
        });
    });
}
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, user, url, assignmentId, submissions, query, teacherAssignments, assignmentIds, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
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
                    url = new URL(request.url);
                    assignmentId = url.searchParams.get('assignmentId');
                    submissions = [];
                    if (!(user.role === 'student')) return [3 /*break*/, 4];
                    query = { student: user._id };
                    if (assignmentId) {
                        query.assignment = assignmentId;
                    }
                    return [4 /*yield*/, Submission.find(query)
                            .populate('assignment', 'title dueDate maxPoints course')
                            .populate({
                            path: 'assignment',
                            populate: {
                                path: 'course',
                                select: 'title subject gradeLevel'
                            }
                        })
                            .sort({ submittedAt: -1 })
                            .lean()];
                case 3:
                    submissions = _a.sent();
                    return [3 /*break*/, 10];
                case 4:
                    if (!(user.role === 'teacher')) return [3 /*break*/, 10];
                    teacherAssignments = void 0;
                    if (!assignmentId) return [3 /*break*/, 6];
                    return [4 /*yield*/, Assignment.find({
                            _id: assignmentId,
                            teacher: user._id
                        })];
                case 5:
                    // Verify teacher owns this assignment
                    teacherAssignments = _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, Assignment.find({ teacher: user._id })];
                case 7:
                    teacherAssignments = _a.sent();
                    _a.label = 8;
                case 8:
                    assignmentIds = teacherAssignments.map(function (a) { return a._id; });
                    return [4 /*yield*/, Submission.find({
                            assignment: { $in: assignmentIds }
                        })
                            .populate('assignment', 'title dueDate maxPoints teacher')
                            .populate('student', 'name gradeLevel')
                            .sort({ submittedAt: -1 })
                            .lean()];
                case 9:
                    submissions = _a.sent();
                    _a.label = 10;
                case 10: return [2 /*return*/, NextResponse.json({
                        submissions: submissions
                    })];
                case 11:
                    error_2 = _a.sent();
                    console.error('Get submissions error:', error_2);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 12: return [2 /*return*/];
            }
        });
    });
}
