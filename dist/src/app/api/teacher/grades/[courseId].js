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
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import StudentReport from '@/models/StudentReport';
import { getServerSession } from '@/lib/auth';
// GET: Get all student reports for a course
export function GET(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var session, courseId, course, reports;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, dbConnect()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, getServerSession(req)];
                case 2:
                    session = _c.sent();
                    if (!session || session.user.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    courseId = params.courseId;
                    return [4 /*yield*/, Course.findById(courseId)];
                case 3:
                    course = _c.sent();
                    if (!course)
                        return [2 /*return*/, NextResponse.json({ message: 'Course not found' }, { status: 404 })];
                    // Only the teacher can view
                    if (course.teacher.toString() !== session.user._id) {
                        return [2 /*return*/, NextResponse.json({ message: 'Forbidden' }, { status: 403 })];
                    }
                    return [4 /*yield*/, StudentReport.find({ course: courseId }).populate('student')];
                case 4:
                    reports = _c.sent();
                    return [2 /*return*/, NextResponse.json({ reports: reports })];
            }
        });
    });
}
// PATCH: Edit a student's report (manual adjustment)
export function PATCH(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var session, courseId, _c, studentId, manualAdjustments, report;
        var params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, dbConnect()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, getServerSession(req)];
                case 2:
                    session = _d.sent();
                    if (!session || session.user.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    courseId = params.courseId;
                    return [4 /*yield*/, req.json()];
                case 3:
                    _c = _d.sent(), studentId = _c.studentId, manualAdjustments = _c.manualAdjustments;
                    return [4 /*yield*/, StudentReport.findOne({ course: courseId, student: studentId })];
                case 4:
                    report = _d.sent();
                    if (!report)
                        return [2 /*return*/, NextResponse.json({ message: 'Report not found' }, { status: 404 })];
                    report.manualAdjustments = manualAdjustments;
                    if (manualAdjustments.score !== undefined)
                        report.finalScore = manualAdjustments.score;
                    if (manualAdjustments.grade)
                        report.grade = manualAdjustments.grade;
                    return [4 /*yield*/, report.save()];
                case 5:
                    _d.sent();
                    return [2 /*return*/, NextResponse.json({ report: report })];
            }
        });
    });
}
// POST: Release reports for students
export function POST(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var session, courseId, studentIds, result;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, dbConnect()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, getServerSession(req)];
                case 2:
                    session = _c.sent();
                    if (!session || session.user.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    courseId = params.courseId;
                    return [4 /*yield*/, req.json()];
                case 3:
                    studentIds = (_c.sent()).studentIds;
                    return [4 /*yield*/, StudentReport.updateMany({ course: courseId, student: { $in: studentIds } }, { $set: { released: true, dateReleased: new Date() } })];
                case 4:
                    result = _c.sent();
                    return [2 /*return*/, NextResponse.json({ updated: result.modifiedCount })];
            }
        });
    });
}
