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
import User from '@/models/User';
import jwt from 'jsonwebtoken';
export function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var authHeader, token, decoded, teacher, _c, title, description, maxStudents, isActive, subject, error_1;
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
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can update subjects' }, { status: 403 })];
                    }
                    return [4 /*yield*/, request.json()
                        // Find the subject and verify ownership
                    ];
                case 3:
                    _c = _d.sent(), title = _c.title, description = _c.description, maxStudents = _c.maxStudents, isActive = _c.isActive;
                    return [4 /*yield*/, Course.findOne({
                            _id: params.id,
                            teacher: teacher._id
                        })];
                case 4:
                    subject = _d.sent();
                    if (!subject) {
                        return [2 /*return*/, NextResponse.json({ error: 'Subject not found or you do not have permission to edit it' }, { status: 404 })];
                    }
                    // Update the subject
                    subject.title = title || subject.title;
                    subject.description = description || subject.description;
                    subject.maxStudents = maxStudents ? parseInt(maxStudents) : subject.maxStudents;
                    subject.isActive = isActive !== undefined ? isActive : subject.isActive;
                    subject.updatedAt = new Date();
                    return [4 /*yield*/, subject.save()];
                case 5:
                    _d.sent();
                    return [2 /*return*/, NextResponse.json({
                            message: 'Subject updated successfully',
                            subject: {
                                _id: subject._id,
                                title: subject.title,
                                subject: subject.subject,
                                gradeLevel: subject.gradeLevel,
                                description: subject.description,
                                enrollmentCode: subject.enrollmentCode,
                                maxStudents: subject.maxStudents,
                                isActive: subject.isActive,
                                updatedAt: subject.updatedAt
                            }
                        })];
                case 6:
                    error_1 = _d.sent();
                    console.error('Update subject error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
export function DELETE(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var authHeader, token, decoded, teacher, subject, error_2;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, connectDB()
                        // Get token from authorization header
                    ];
                case 1:
                    _c.sent();
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
                    teacher = _c.sent();
                    if (!teacher || teacher.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can delete subjects' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Course.findOne({
                            _id: params.id,
                            teacher: teacher._id
                        })];
                case 3:
                    subject = _c.sent();
                    if (!subject) {
                        return [2 /*return*/, NextResponse.json({ error: 'Subject not found or you do not have permission to delete it' }, { status: 404 })];
                    }
                    // Check if subject has students enrolled
                    if (subject.students.length > 0) {
                        return [2 /*return*/, NextResponse.json({ error: 'Cannot delete subject with enrolled students. Please remove all students first.' }, { status: 400 })];
                    }
                    // Delete the subject
                    return [4 /*yield*/, Course.findByIdAndDelete(params.id)];
                case 4:
                    // Delete the subject
                    _c.sent();
                    return [2 /*return*/, NextResponse.json({
                            message: 'Subject deleted successfully'
                        })];
                case 5:
                    error_2 = _c.sent();
                    console.error('Delete subject error:', error_2);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
