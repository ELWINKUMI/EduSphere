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
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { ALL_GRADES } from '@/lib/schoolConfig';
// Generate a unique userId (8-digit string)
function generateUserId() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, teacher, _a, name_1, pin, gradeLevel, existingStudent, userId, exists, attempts, student, savedStudent, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
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
                    teacher = _b.sent();
                    if (!teacher || teacher.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can create students' }, { status: 403 })];
                    }
                    return [4 /*yield*/, request.json()
                        // Validate input
                    ];
                case 3:
                    _a = _b.sent(), name_1 = _a.name, pin = _a.pin, gradeLevel = _a.gradeLevel;
                    // Validate input
                    if (!name_1 || !pin || !gradeLevel) {
                        return [2 /*return*/, NextResponse.json({ error: 'Name, PIN, and grade level are required' }, { status: 400 })];
                    }
                    // Validate PIN format
                    if (!/^[0-9]{5}$/.test(pin)) {
                        return [2 /*return*/, NextResponse.json({ error: 'PIN must be exactly 5 digits' }, { status: 400 })];
                    }
                    // Validate grade level
                    if (!ALL_GRADES.includes(gradeLevel)) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid grade level' }, { status: 400 })];
                    }
                    return [4 /*yield*/, User.findOne({ name: name_1.trim(), pin: pin })];
                case 4:
                    existingStudent = _b.sent();
                    if (existingStudent) {
                        return [2 /*return*/, NextResponse.json({ error: 'A student with this name and PIN already exists' }, { status: 409 })];
                    }
                    userId = void 0;
                    exists = true;
                    attempts = 0;
                    _b.label = 5;
                case 5:
                    if (!(exists && attempts < 10)) return [3 /*break*/, 7];
                    userId = generateUserId();
                    return [4 /*yield*/, User.exists({ userId: userId })];
                case 6:
                    exists = (_b.sent()) !== null;
                    attempts++;
                    return [3 /*break*/, 5];
                case 7:
                    if (exists) {
                        return [2 /*return*/, NextResponse.json({ error: 'Could not generate unique userId for student' }, { status: 500 })];
                    }
                    student = new User({
                        name: name_1.trim(),
                        pin: pin,
                        role: 'student',
                        gradeLevel: gradeLevel,
                        userId: userId
                    });
                    return [4 /*yield*/, student.save()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, User.findById(student._id)];
                case 9:
                    savedStudent = _b.sent();
                    console.log('Saved student:', savedStudent);
                    return [2 /*return*/, NextResponse.json({
                            message: 'Student created successfully',
                            student: {
                                id: savedStudent._id,
                                name: savedStudent.name,
                                gradeLevel: savedStudent.gradeLevel,
                                role: savedStudent.role,
                                userId: savedStudent.userId
                                // Do NOT return pin here
                            }
                        })];
                case 10:
                    error_1 = _b.sent();
                    console.error('Create student error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 11: return [2 /*return*/];
            }
        });
    });
}
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, teacher, students, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
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
                    teacher = _a.sent();
                    if (!teacher || teacher.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Only teachers can view students' }, { status: 403 })];
                    }
                    return [4 /*yield*/, User.find({ role: 'student' }).sort({ createdAt: -1 })];
                case 3:
                    students = _a.sent();
                    return [2 /*return*/, NextResponse.json({
                            students: students
                        })];
                case 4:
                    error_2 = _a.sent();
                    console.error('Get students error:', error_2);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
