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
import Resource from '@/models/Resource';
import Course from '@/models/Course';
import User from '@/models/User';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, teacher, formData, title, description, courseId, type, file, course, uploadDir, error_1, timestamp, filename, filePath, bytes, buffer, resource, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 14, , 15]);
                    return [4 /*yield*/, connectDB()];
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
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can upload resources' }, { status: 403 })];
                    }
                    return [4 /*yield*/, request.formData()];
                case 3:
                    formData = _a.sent();
                    title = formData.get('title');
                    description = formData.get('description');
                    courseId = formData.get('courseId');
                    type = formData.get('type');
                    file = formData.get('file');
                    // Validate input
                    if (!title || !courseId || !file) {
                        return [2 /*return*/, NextResponse.json({ error: 'Title, course, and file are required' }, { status: 400 })];
                    }
                    return [4 /*yield*/, Course.findById(courseId)];
                case 4:
                    course = _a.sent();
                    if (!course || course.teacher.toString() !== teacher._id.toString()) {
                        return [2 /*return*/, NextResponse.json({ error: 'You can only upload resources to your own courses' }, { status: 403 })];
                    }
                    uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resources');
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, mkdir(uploadDir, { recursive: true })];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    return [3 /*break*/, 8];
                case 8:
                    timestamp = Date.now();
                    filename = "".concat(timestamp, "-").concat(file.name);
                    filePath = path.join(uploadDir, filename);
                    return [4 /*yield*/, file.arrayBuffer()];
                case 9:
                    bytes = _a.sent();
                    buffer = Buffer.from(bytes);
                    return [4 /*yield*/, writeFile(filePath, buffer)
                        // Create resource record
                    ];
                case 10:
                    _a.sent();
                    resource = new Resource({
                        title: title,
                        description: description || '',
                        course: courseId,
                        teacher: teacher._id,
                        type: type || 'document',
                        filename: filename,
                        originalName: file.name,
                        fileSize: file.size,
                        mimeType: file.type,
                        url: "/uploads/resources/".concat(filename)
                    });
                    return [4 /*yield*/, resource.save()
                        // Populate course and teacher info
                    ];
                case 11:
                    _a.sent();
                    // Populate course and teacher info
                    return [4 /*yield*/, resource.populate('course', 'title subject gradeLevel')];
                case 12:
                    // Populate course and teacher info
                    _a.sent();
                    return [4 /*yield*/, resource.populate('teacher', 'name')];
                case 13:
                    _a.sent();
                    return [2 /*return*/, NextResponse.json({
                            message: 'Resource uploaded successfully',
                            resource: resource
                        }, { status: 201 })];
                case 14:
                    error_2 = _a.sent();
                    console.error('Error uploading resource:', error_2);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 15: return [2 /*return*/];
            }
        });
    });
}
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, user, resources, teacherCourses, courseIds, studentCourses, courseIds, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, connectDB()];
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
                    resources = void 0;
                    if (!(user.role === 'teacher')) return [3 /*break*/, 5];
                    return [4 /*yield*/, Course.find({ teacher: user._id })];
                case 3:
                    teacherCourses = _a.sent();
                    courseIds = teacherCourses.map(function (course) { return course._id; });
                    return [4 /*yield*/, Resource.find({
                            course: { $in: courseIds }
                        })
                            .populate('course', 'title subject gradeLevel')
                            .populate('teacher', 'name')
                            .sort({ createdAt: -1 })];
                case 4:
                    resources = _a.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, Course.find({ students: user._id })];
                case 6:
                    studentCourses = _a.sent();
                    courseIds = studentCourses.map(function (course) { return course._id; });
                    return [4 /*yield*/, Resource.find({
                            course: { $in: courseIds }
                        })
                            .populate('course', 'title subject gradeLevel')
                            .populate('teacher', 'name')
                            .sort({ createdAt: -1 })];
                case 7:
                    resources = _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, NextResponse.json({ resources: resources })];
                case 9:
                    error_3 = _a.sent();
                    console.error('Error fetching resources:', error_3);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
