var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { generateAllSubjectsReportPdf } from '@/lib/reportPdf';
import StudentReport from '@/models/StudentReport';
import Course from '@/models/Course';
import User from '@/models/User';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
// GET: Download all subjects/grades for the student as a single PDF (always includes all enrolled subjects)
export function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        var session, user, enrolledCourses, reports, _i, enrolledCourses_1, course, report, pdfBytes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getServerSession(req)];
                case 2:
                    session = _a.sent();
                    if (!session || session.user.role !== 'student') {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    return [4 /*yield*/, User.findById(session.user._id)];
                case 3:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, NextResponse.json({ message: 'User not found.' }, { status: 404 })];
                    }
                    return [4 /*yield*/, Course.find({ students: user._id })
                            .select('_id title subject gradeLevel students')
                            .lean()];
                case 4:
                    enrolledCourses = _a.sent();
                    if (!enrolledCourses || enrolledCourses.length === 0) {
                        return [2 /*return*/, NextResponse.json({ message: 'No enrolled courses found.' }, { status: 404 })];
                    }
                    reports = [];
                    _i = 0, enrolledCourses_1 = enrolledCourses;
                    _a.label = 5;
                case 5:
                    if (!(_i < enrolledCourses_1.length)) return [3 /*break*/, 8];
                    course = enrolledCourses_1[_i];
                    return [4 /*yield*/, StudentReport.findOne({ course: course._id, student: user._id })];
                case 6:
                    report = _a.sent();
                    if (report) {
                        // Attach course info for PDF
                        reports.push(__assign(__assign({}, report.toObject()), { course: course }));
                    }
                    else {
                        // No report yet, create a placeholder
                        reports.push({
                            student: user,
                            course: course,
                            finalScore: null,
                            grade: null,
                            position: null,
                            released: false,
                            manualAdjustments: {},
                            dateReleased: null,
                            dateDownloaded: null,
                            createdAt: null,
                            updatedAt: null,
                        });
                    }
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, generateAllSubjectsReportPdf(reports)];
                case 9:
                    pdfBytes = _a.sent();
                    return [2 /*return*/, new NextResponse(Buffer.from(pdfBytes), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/pdf',
                                'Content-Disposition': "attachment; filename=all-subjects-report.pdf"
                            }
                        })];
            }
        });
    });
}
