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
import Submission from '@/models/Submission';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, user, now, overdueAssignments, processedCount, createdSubmissions, _loop_1, _i, overdueAssignments_1, assignment, error_1;
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
                    if (!user || user.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can process overdue assignments' }, { status: 403 })];
                    }
                    now = new Date();
                    return [4 /*yield*/, Assignment.find({
                            dueDate: { $lt: now },
                            isActive: true
                        }).populate('course')];
                case 3:
                    overdueAssignments = _a.sent();
                    processedCount = 0;
                    createdSubmissions = 0;
                    _loop_1 = function (assignment) {
                        var course, existingSubmissions, submittedStudentIds, studentsWhoDidntSubmit, _b, studentsWhoDidntSubmit_1, studentId, zeroSubmission;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    course = assignment.course;
                                    if (!course || !course.students)
                                        return [2 /*return*/, "continue"];
                                    return [4 /*yield*/, Submission.find({
                                            assignment: assignment._id
                                        }).select('student')];
                                case 1:
                                    existingSubmissions = _c.sent();
                                    submittedStudentIds = existingSubmissions.map(function (sub) { return sub.student.toString(); });
                                    studentsWhoDidntSubmit = course.students.filter(function (studentId) { return !submittedStudentIds.includes(studentId.toString()); });
                                    _b = 0, studentsWhoDidntSubmit_1 = studentsWhoDidntSubmit;
                                    _c.label = 2;
                                case 2:
                                    if (!(_b < studentsWhoDidntSubmit_1.length)) return [3 /*break*/, 5];
                                    studentId = studentsWhoDidntSubmit_1[_b];
                                    zeroSubmission = new Submission({
                                        assignment: assignment._id,
                                        student: studentId,
                                        content: 'No submission - automatically graded as 0 due to missed deadline',
                                        files: [],
                                        submittedAt: assignment.dueDate, // Use due date as submission date
                                        grade: 0,
                                        feedback: 'Assignment not submitted by deadline. Automatic grade: 0/' + assignment.maxPoints,
                                        gradedAt: now,
                                        gradedBy: user._id, // The teacher who triggered the process
                                        isGraded: true,
                                        isLate: true
                                    });
                                    return [4 /*yield*/, zeroSubmission.save()];
                                case 3:
                                    _c.sent();
                                    createdSubmissions++;
                                    _c.label = 4;
                                case 4:
                                    _b++;
                                    return [3 /*break*/, 2];
                                case 5:
                                    processedCount++;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, overdueAssignments_1 = overdueAssignments;
                    _a.label = 4;
                case 4:
                    if (!(_i < overdueAssignments_1.length)) return [3 /*break*/, 7];
                    assignment = overdueAssignments_1[_i];
                    return [5 /*yield**/, _loop_1(assignment)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    console.log("Processed ".concat(processedCount, " overdue assignments, created ").concat(createdSubmissions, " zero-grade submissions"));
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            message: "Processed ".concat(processedCount, " overdue assignments"),
                            processedAssignments: processedCount,
                            createdSubmissions: createdSubmissions
                        })];
                case 8:
                    error_1 = _a.sent();
                    console.error('Process overdue assignments error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
