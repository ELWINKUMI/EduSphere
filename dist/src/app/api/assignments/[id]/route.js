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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import User from '@/models/User';
import Course from '@/models/Course';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var id, token, decoded, user_1, assignment, courseId, course, submission, error_1;
        var _c, _d, _e, _f, _g;
        var params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _h.sent();
                    return [4 /*yield*/, params];
                case 2:
                    id = (_h.sent()).id;
                    token = (_c = request.headers.get('authorization')) === null || _c === void 0 ? void 0 : _c.replace('Bearer ', '');
                    if (!token) {
                        return [2 /*return*/, NextResponse.json({ error: 'No token provided' }, { status: 401 })];
                    }
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 3:
                    user_1 = _h.sent();
                    if (!user_1 || user_1.role !== 'student') {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Assignment.findById(id)
                            .populate('course', 'title subject gradeLevel')
                            .populate('teacher', 'name')
                            .lean()];
                case 4:
                    assignment = _h.sent();
                    if (!assignment) {
                        return [2 /*return*/, NextResponse.json({ error: 'Assignment not found' }, { status: 404 })];
                    }
                    courseId = ((_d = assignment.course) === null || _d === void 0 ? void 0 : _d._id) || assignment.course;
                    console.log('Assignment API - Course check:', {
                        assignmentId: id,
                        courseId: courseId,
                        userId: user_1._id,
                        userIdType: typeof user_1._id,
                        assignmentCourse: assignment.course
                    });
                    return [4 /*yield*/, Course.findById(courseId)];
                case 5:
                    course = _h.sent();
                    console.log('Assignment API - Course found:', {
                        courseFound: !!course,
                        courseStudents: ((_e = course === null || course === void 0 ? void 0 : course.students) === null || _e === void 0 ? void 0 : _e.length) || 0,
                        courseStudentsIds: (_f = course === null || course === void 0 ? void 0 : course.students) === null || _f === void 0 ? void 0 : _f.map(function (s) { return s === null || s === void 0 ? void 0 : s.toString(); }),
                        userIdString: user_1._id.toString(),
                        isEnrolled: (_g = course === null || course === void 0 ? void 0 : course.students) === null || _g === void 0 ? void 0 : _g.some(function (studentId) { return studentId.toString() === user_1._id.toString(); })
                    });
                    if (!course ||
                        !course.students.some(function (studentId) { return studentId.toString() === user_1._id.toString(); })) {
                        console.log('Assignment API - Access denied:', {
                            noCourse: !course,
                            notEnrolled: course && !course.students.some(function (studentId) { return studentId.toString() === user_1._id.toString(); }),
                            courseId: courseId,
                            userId: user_1._id
                        });
                        return [2 /*return*/, NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Submission.findOne({
                            assignment: id,
                            student: user_1._id
                        }).lean()];
                case 6:
                    submission = _h.sent();
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            assignment: assignment,
                            submission: submission
                        })];
                case 7:
                    error_1 = _h.sent();
                    console.error('Error fetching assignment:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
export function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var id, token, decoded, teacher, assignment, formData, title, description, dueDate, maxPoints, submissionType, existingAttachmentsStr, existingAttachments_1, newFiles, attachmentFiles, _loop_1, _i, attachmentFiles_1, file, deletedFiles, _c, deletedFiles_1, filename, filepath, error_2, updatedAssignment, error_3;
        var _d;
        var params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 17, , 18]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, params];
                case 2:
                    id = (_e.sent()).id;
                    token = (_d = request.headers.get('authorization')) === null || _d === void 0 ? void 0 : _d.replace('Bearer ', '');
                    if (!token) {
                        return [2 /*return*/, NextResponse.json({ error: 'No token provided' }, { status: 401 })];
                    }
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 3:
                    teacher = _e.sent();
                    if (!teacher || teacher.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Assignment.findById(id)];
                case 4:
                    assignment = _e.sent();
                    if (!assignment || assignment.teacher.toString() !== teacher._id.toString()) {
                        return [2 /*return*/, NextResponse.json({ error: 'Assignment not found or unauthorized' }, { status: 404 })];
                    }
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _e.sent();
                    title = formData.get('title');
                    description = formData.get('description');
                    dueDate = formData.get('dueDate');
                    maxPoints = parseInt(formData.get('maxPoints'));
                    submissionType = formData.get('submissionType');
                    existingAttachmentsStr = formData.get('existingAttachments');
                    existingAttachments_1 = [];
                    try {
                        existingAttachments_1 = JSON.parse(existingAttachmentsStr || '[]');
                    }
                    catch (e) {
                        existingAttachments_1 = [];
                    }
                    newFiles = [];
                    attachmentFiles = formData.getAll('attachments');
                    _loop_1 = function (file) {
                        var bytes, buffer, filename, filepath, uploadDir_1;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    if (!(file && file.size > 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, file.arrayBuffer()];
                                case 1:
                                    bytes = _f.sent();
                                    buffer = Buffer.from(bytes);
                                    filename = "".concat(Date.now(), "-").concat(file.name);
                                    filepath = path.join(process.cwd(), 'public/uploads/assignments', filename);
                                    uploadDir_1 = path.dirname(filepath);
                                    return [4 /*yield*/, import('fs').then(function (fs) {
                                            if (!fs.existsSync(uploadDir_1)) {
                                                fs.mkdirSync(uploadDir_1, { recursive: true });
                                            }
                                        })];
                                case 2:
                                    _f.sent();
                                    return [4 /*yield*/, writeFile(filepath, buffer)];
                                case 3:
                                    _f.sent();
                                    newFiles.push(filename);
                                    _f.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, attachmentFiles_1 = attachmentFiles;
                    _e.label = 6;
                case 6:
                    if (!(_i < attachmentFiles_1.length)) return [3 /*break*/, 9];
                    file = attachmentFiles_1[_i];
                    return [5 /*yield**/, _loop_1(file)];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    deletedFiles = assignment.attachments.filter(function (filename) { return !existingAttachments_1.includes(filename); });
                    _c = 0, deletedFiles_1 = deletedFiles;
                    _e.label = 10;
                case 10:
                    if (!(_c < deletedFiles_1.length)) return [3 /*break*/, 15];
                    filename = deletedFiles_1[_c];
                    _e.label = 11;
                case 11:
                    _e.trys.push([11, 13, , 14]);
                    filepath = path.join(process.cwd(), 'public/uploads/assignments', filename);
                    return [4 /*yield*/, unlink(filepath)];
                case 12:
                    _e.sent();
                    return [3 /*break*/, 14];
                case 13:
                    error_2 = _e.sent();
                    console.error('Error deleting file:', filename, error_2);
                    return [3 /*break*/, 14];
                case 14:
                    _c++;
                    return [3 /*break*/, 10];
                case 15: return [4 /*yield*/, Assignment.findByIdAndUpdate(id, {
                        title: title,
                        description: description,
                        dueDate: new Date(dueDate),
                        maxPoints: maxPoints,
                        submissionType: submissionType,
                        attachments: __spreadArray(__spreadArray([], existingAttachments_1, true), newFiles, true)
                    }, { new: true }).populate('course', 'title subject gradeLevel')];
                case 16:
                    updatedAssignment = _e.sent();
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            assignment: updatedAssignment
                        })];
                case 17:
                    error_3 = _e.sent();
                    console.error('Error updating assignment:', error_3);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 18: return [2 /*return*/];
            }
        });
    });
}
export function DELETE(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var id, token, decoded, teacher, assignment, _i, _c, filename, filepath, error_4, error_5;
        var _d;
        var params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 12, , 13]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, params];
                case 2:
                    id = (_e.sent()).id;
                    token = (_d = request.headers.get('authorization')) === null || _d === void 0 ? void 0 : _d.replace('Bearer ', '');
                    if (!token) {
                        return [2 /*return*/, NextResponse.json({ error: 'No token provided' }, { status: 401 })];
                    }
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 3:
                    teacher = _e.sent();
                    if (!teacher || teacher.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Assignment.findById(id)];
                case 4:
                    assignment = _e.sent();
                    if (!assignment || assignment.teacher.toString() !== teacher._id.toString()) {
                        return [2 /*return*/, NextResponse.json({ error: 'Assignment not found or unauthorized' }, { status: 404 })];
                    }
                    _i = 0, _c = assignment.attachments;
                    _e.label = 5;
                case 5:
                    if (!(_i < _c.length)) return [3 /*break*/, 10];
                    filename = _c[_i];
                    _e.label = 6;
                case 6:
                    _e.trys.push([6, 8, , 9]);
                    filepath = path.join(process.cwd(), 'public/uploads/assignments', filename);
                    return [4 /*yield*/, unlink(filepath)];
                case 7:
                    _e.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_4 = _e.sent();
                    console.error('Error deleting file:', filename, error_4);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10: 
                // Delete the assignment
                return [4 /*yield*/, Assignment.findByIdAndDelete(id)];
                case 11:
                    // Delete the assignment
                    _e.sent();
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            message: 'Assignment deleted successfully'
                        })];
                case 12:
                    error_5 = _e.sent();
                    console.error('Error deleting assignment:', error_5);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 13: return [2 /*return*/];
            }
        });
    });
}
