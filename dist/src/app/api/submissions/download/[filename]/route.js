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
import { readFile } from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Submission from '@/models/Submission';
import Assignment from '@/models/Assignment';
import connectDB from '@/lib/mongodb';
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var filename, token, decoded, user, submission, assignment, filepath, fileBuffer, ext, contentType, fileError_1, error_1;
        var _c;
        var params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 12, , 13]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, params];
                case 2:
                    filename = (_d.sent()).filename;
                    token = ((_c = request.headers.get('authorization')) === null || _c === void 0 ? void 0 : _c.replace('Bearer ', '')) ||
                        request.nextUrl.searchParams.get('token');
                    if (!token) {
                        return [2 /*return*/, NextResponse.json({ error: 'No token provided' }, { status: 401 })];
                    }
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 3:
                    user = _d.sent();
                    if (!user) {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 403 })];
                    }
                    // Allow both students and teachers to download submission files
                    // Students can download their own submissions, teachers can download their students' submissions
                    if (user.role !== 'student' && user.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Submission.findOne({ files: filename })
                            .populate('assignment')
                            .populate('student', 'name email')];
                case 4:
                    submission = _d.sent();
                    if (!submission) {
                        console.log("Submission not found for file: ".concat(filename));
                        return [2 /*return*/, NextResponse.json({ error: 'Submission not found' }, { status: 404 })];
                    }
                    console.log("User ".concat(user.name, " (").concat(user.role, ") requesting file: ").concat(filename));
                    console.log("File belongs to submission by: ".concat(submission.student.name));
                    if (!(user.role === 'student')) return [3 /*break*/, 5];
                    // Students can only download their own submission files
                    if (submission.student._id.toString() !== user._id.toString()) {
                        console.log("Student authorization failed: ".concat(user._id, " !== ").concat(submission.student._id));
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 403 })];
                    }
                    return [3 /*break*/, 7];
                case 5:
                    if (!(user.role === 'teacher')) return [3 /*break*/, 7];
                    return [4 /*yield*/, Assignment.findById(submission.assignment._id)];
                case 6:
                    assignment = _d.sent();
                    if (!assignment || assignment.teacher.toString() !== user._id.toString()) {
                        console.log("Teacher authorization failed: assignment teacher ".concat(assignment === null || assignment === void 0 ? void 0 : assignment.teacher, " !== ").concat(user._id));
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 403 })];
                    }
                    console.log("Teacher authorized to download submission file from their assignment");
                    _d.label = 7;
                case 7:
                    // Basic security check
                    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid filename' }, { status: 400 })];
                    }
                    filepath = path.join(process.cwd(), 'public/uploads/submissions', filename);
                    _d.label = 8;
                case 8:
                    _d.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, readFile(filepath)
                        // Get file extension to set appropriate content type
                    ];
                case 9:
                    fileBuffer = _d.sent();
                    ext = path.extname(filename).toLowerCase();
                    contentType = 'application/octet-stream';
                    switch (ext) {
                        case '.pdf':
                            contentType = 'application/pdf';
                            break;
                        case '.doc':
                            contentType = 'application/msword';
                            break;
                        case '.docx':
                            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                            break;
                        case '.txt':
                            contentType = 'text/plain';
                            break;
                        case '.jpg':
                        case '.jpeg':
                            contentType = 'image/jpeg';
                            break;
                        case '.png':
                            contentType = 'image/png';
                            break;
                        case '.gif':
                            contentType = 'image/gif';
                            break;
                        case '.zip':
                            contentType = 'application/zip';
                            break;
                        case '.ppt':
                            contentType = 'application/vnd.ms-powerpoint';
                            break;
                        case '.pptx':
                            contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                            break;
                        case '.xls':
                            contentType = 'application/vnd.ms-excel';
                            break;
                        case '.xlsx':
                            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                            break;
                    }
                    return [2 /*return*/, new NextResponse(fileBuffer, {
                            headers: {
                                'Content-Type': contentType,
                                'Content-Disposition': "attachment; filename=\"".concat(filename, "\""),
                                'Content-Length': fileBuffer.length.toString(),
                            },
                        })];
                case 10:
                    fileError_1 = _d.sent();
                    console.error('File not found:', filepath, fileError_1);
                    return [2 /*return*/, NextResponse.json({ error: 'File not found' }, { status: 404 })];
                case 11: return [3 /*break*/, 13];
                case 12:
                    error_1 = _d.sent();
                    console.error('Error downloading submission file:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 13: return [2 /*return*/];
            }
        });
    });
}
