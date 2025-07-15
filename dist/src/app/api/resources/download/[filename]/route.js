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
import Resource from '@/models/Resource';
import Course from '@/models/Course';
import connectDB from '@/lib/mongodb';
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var filename, token, decoded, user_1, resource, hasAccess, course, filePath, fileBuffer, fileError_1, error_1;
        var _c;
        var params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 13, , 14]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, params
                        // Get the authorization token
                    ];
                case 2:
                    filename = (_d.sent()).filename;
                    token = (_c = request.headers.get('authorization')) === null || _c === void 0 ? void 0 : _c.replace('Bearer ', '');
                    if (!token) {
                        return [2 /*return*/, NextResponse.json({ error: 'Authorization required' }, { status: 401 })];
                    }
                    decoded = void 0;
                    try {
                        decoded = jwt.verify(token, process.env.JWT_SECRET);
                    }
                    catch (error) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid token' }, { status: 401 })];
                    }
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 3:
                    user_1 = _d.sent();
                    if (!user_1) {
                        return [2 /*return*/, NextResponse.json({ error: 'User not found' }, { status: 404 })];
                    }
                    return [4 /*yield*/, Resource.findOne({ filename: filename }).populate('course')];
                case 4:
                    resource = _d.sent();
                    if (!resource) {
                        return [2 /*return*/, NextResponse.json({ error: 'Resource not found' }, { status: 404 })];
                    }
                    hasAccess = false;
                    if (!(user_1.role === 'teacher')) return [3 /*break*/, 5];
                    // Teachers can access resources from their own courses
                    hasAccess = resource.teacher.toString() === user_1._id.toString();
                    return [3 /*break*/, 7];
                case 5:
                    if (!(user_1.role === 'student')) return [3 /*break*/, 7];
                    return [4 /*yield*/, Course.findById(resource.course._id)];
                case 6:
                    course = _d.sent();
                    hasAccess = course && course.students.some(function (studentId) {
                        return studentId.toString() === user_1._id.toString();
                    });
                    _d.label = 7;
                case 7:
                    if (!hasAccess) {
                        return [2 /*return*/, NextResponse.json({ error: 'Access denied' }, { status: 403 })];
                    }
                    filePath = path.join(process.cwd(), 'public', 'uploads', 'resources', filename);
                    _d.label = 8;
                case 8:
                    _d.trys.push([8, 11, , 12]);
                    return [4 /*yield*/, readFile(filePath)
                        // Update download count
                    ];
                case 9:
                    fileBuffer = _d.sent();
                    // Update download count
                    return [4 /*yield*/, Resource.findByIdAndUpdate(resource._id, {
                            $inc: { downloadCount: 1 }
                        })
                        // Return the file with proper headers
                    ];
                case 10:
                    // Update download count
                    _d.sent();
                    // Return the file with proper headers
                    return [2 /*return*/, new NextResponse(fileBuffer, {
                            headers: {
                                'Content-Type': resource.mimeType,
                                'Content-Disposition': "attachment; filename=\"".concat(resource.originalName, "\""),
                                'Content-Length': resource.fileSize.toString(),
                            },
                        })];
                case 11:
                    fileError_1 = _d.sent();
                    return [2 /*return*/, NextResponse.json({ error: 'File not found' }, { status: 404 })];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_1 = _d.sent();
                    console.error('Error downloading resource:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 14: return [2 /*return*/];
            }
        });
    });
}
