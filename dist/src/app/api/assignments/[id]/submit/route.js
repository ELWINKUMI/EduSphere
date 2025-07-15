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
import Submission from '@/models/Submission';
import User from '@/models/User';
import Course from '@/models/Course';
import { writeFile } from 'fs/promises';
import path from 'path';
export function POST(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var assignmentId, token, decoded, user, assignment, course, existingSubmission, formData, content, files, uploadedFiles, _i, files_1, file, bytes, buffer, filename, filepath, uploadDir, fs, submission, error_1;
        var _c;
        var params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 16, , 17]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, params];
                case 2:
                    assignmentId = (_d.sent()).id;
                    token = (_c = request.headers.get('authorization')) === null || _c === void 0 ? void 0 : _c.replace('Bearer ', '');
                    if (!token) {
                        return [2 /*return*/, NextResponse.json({ error: 'No token provided' }, { status: 401 })];
                    }
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 3:
                    user = _d.sent();
                    if (!user || user.role !== 'student') {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Assignment.findById(assignmentId)];
                case 4:
                    assignment = _d.sent();
                    if (!assignment) {
                        return [2 /*return*/, NextResponse.json({ error: 'Assignment not found' }, { status: 404 })];
                    }
                    return [4 /*yield*/, Course.findById(assignment.course)];
                case 5:
                    course = _d.sent();
                    if (!course || !course.students.includes(user._id)) {
                        return [2 /*return*/, NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })];
                    }
                    // Check if assignment is still active and not overdue
                    if (!assignment.isActive) {
                        return [2 /*return*/, NextResponse.json({ error: 'Assignment is no longer active' }, { status: 400 })];
                    }
                    if (new Date() > new Date(assignment.dueDate)) {
                        return [2 /*return*/, NextResponse.json({ error: 'Assignment deadline has passed' }, { status: 400 })];
                    }
                    return [4 /*yield*/, Submission.findOne({
                            assignment: assignmentId,
                            student: user._id
                        })];
                case 6:
                    existingSubmission = _d.sent();
                    if (existingSubmission) {
                        return [2 /*return*/, NextResponse.json({ error: 'Assignment already submitted' }, { status: 400 })];
                    }
                    return [4 /*yield*/, request.formData()];
                case 7:
                    formData = _d.sent();
                    content = formData.get('content') || '';
                    files = formData.getAll('files');
                    console.log('Submission data:', {
                        assignmentId: assignmentId,
                        userId: user._id,
                        content: content.substring(0, 50) + '...',
                        filesCount: files.length,
                        submissionType: assignment.submissionType
                    });
                    // Validate based on submission type
                    if (assignment.submissionType === 'text' && !content.trim()) {
                        return [2 /*return*/, NextResponse.json({ error: 'Text content is required for this assignment' }, { status: 400 })];
                    }
                    if (assignment.submissionType === 'file' && files.length === 0) {
                        return [2 /*return*/, NextResponse.json({ error: 'File upload is required for this assignment' }, { status: 400 })];
                    }
                    if (assignment.submissionType === 'both' && !content.trim() && files.length === 0) {
                        return [2 /*return*/, NextResponse.json({ error: 'Please provide either text content or upload files' }, { status: 400 })];
                    }
                    uploadedFiles = [];
                    if (!(files.length > 0)) return [3 /*break*/, 13];
                    _i = 0, files_1 = files;
                    _d.label = 8;
                case 8:
                    if (!(_i < files_1.length)) return [3 /*break*/, 13];
                    file = files_1[_i];
                    if (!(file && file.size > 0)) return [3 /*break*/, 12];
                    return [4 /*yield*/, file.arrayBuffer()];
                case 9:
                    bytes = _d.sent();
                    buffer = Buffer.from(bytes);
                    filename = "".concat(Date.now(), "-").concat(user._id, "-").concat(file.name);
                    filepath = path.join(process.cwd(), 'public/uploads/submissions', filename);
                    uploadDir = path.dirname(filepath);
                    return [4 /*yield*/, import('fs')];
                case 10:
                    fs = _d.sent();
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    return [4 /*yield*/, writeFile(filepath, buffer)];
                case 11:
                    _d.sent();
                    uploadedFiles.push(filename);
                    _d.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 8];
                case 13:
                    submission = new Submission({
                        assignment: assignmentId,
                        student: user._id,
                        content: content.trim(),
                        files: uploadedFiles,
                        submittedAt: new Date(),
                        isLate: new Date() > new Date(assignment.dueDate),
                        isGraded: false
                    });
                    return [4 /*yield*/, submission.save()
                        // Add submission to assignment's submissions array
                    ];
                case 14:
                    _d.sent();
                    // Add submission to assignment's submissions array
                    assignment.submissions.push(submission._id);
                    return [4 /*yield*/, assignment.save()];
                case 15:
                    _d.sent();
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            message: 'Assignment submitted successfully',
                            submission: {
                                _id: submission._id,
                                content: submission.content,
                                files: submission.files,
                                submittedAt: submission.submittedAt,
                                isLate: submission.isLate,
                                isGraded: submission.isGraded
                            }
                        })];
                case 16:
                    error_1 = _d.sent();
                    console.error('Error submitting assignment:', error_1);
                    console.error('Error stack:', error_1.stack);
                    console.error('Error message:', error_1.message);
                    return [2 /*return*/, NextResponse.json({
                            error: 'Internal server error',
                            details: process.env.NODE_ENV === 'development' ? error_1.message : undefined
                        }, { status: 500 })];
                case 17: return [2 /*return*/];
            }
        });
    });
}
