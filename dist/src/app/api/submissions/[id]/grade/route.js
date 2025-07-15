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
import User from '@/models/User';
import jwt from 'jsonwebtoken';
export function PATCH(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var authHeader, token, decoded, teacher, _c, grade, feedback, numericGrade, submission, error_1;
        var params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, connectDB()
                        // Get token from authorization header
                    ];
                case 1:
                    _d.sent();
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
                    teacher = _d.sent();
                    if (!teacher || teacher.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can grade submissions' }, { status: 403 })];
                    }
                    return [4 /*yield*/, request.json()
                        // Validate input
                    ];
                case 3:
                    _c = _d.sent(), grade = _c.grade, feedback = _c.feedback;
                    // Validate input
                    if (grade === undefined || grade === null) {
                        return [2 /*return*/, NextResponse.json({ error: 'Grade is required' }, { status: 400 })];
                    }
                    numericGrade = parseInt(grade);
                    if (isNaN(numericGrade) || numericGrade < 0) {
                        return [2 /*return*/, NextResponse.json({ error: 'Grade must be a non-negative number' }, { status: 400 })];
                    }
                    return [4 /*yield*/, Submission.findById(params.id)
                            .populate('assignment', 'teacher maxPoints')];
                case 4:
                    submission = _d.sent();
                    if (!submission) {
                        return [2 /*return*/, NextResponse.json({ error: 'Submission not found' }, { status: 404 })];
                    }
                    // Verify teacher owns the assignment
                    if (submission.assignment.teacher.toString() !== teacher._id.toString()) {
                        return [2 /*return*/, NextResponse.json({ error: 'You can only grade submissions for your own assignments' }, { status: 403 })];
                    }
                    // Check if grade is within valid range
                    if (numericGrade > submission.assignment.maxPoints) {
                        return [2 /*return*/, NextResponse.json({ error: "Grade cannot exceed maximum points (".concat(submission.assignment.maxPoints, ")") }, { status: 400 })];
                    }
                    // Update submission with grade and feedback
                    submission.grade = numericGrade;
                    submission.feedback = feedback || '';
                    submission.gradedAt = new Date();
                    submission.gradedBy = teacher._id;
                    submission.isGraded = true;
                    return [4 /*yield*/, submission.save()];
                case 5:
                    _d.sent();
                    return [2 /*return*/, NextResponse.json({
                            message: 'Grade submitted successfully',
                            submission: {
                                id: submission._id,
                                grade: submission.grade,
                                feedback: submission.feedback,
                                gradedAt: submission.gradedAt
                            }
                        })];
                case 6:
                    error_1 = _d.sent();
                    console.error('Grade submission error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
