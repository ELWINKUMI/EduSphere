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
import Course from '@/models/Course';
import Submission from '@/models/Submission';
import Assignment from '@/models/Assignment';
import QuizSubmission from '@/models/QuizSubmission';
import StudentReport from '@/models/StudentReport';
/**
 * Calculate and update all student reports for a course.
 * - Weighted average: assignments/quizzes
 * - Map to grade using gradeRanges
 * - Rank students for class position
 */
export function calculateAndUpdateReports(courseId) {
    return __awaiter(this, void 0, void 0, function () {
        var course, students, assignments, quizzes, assignmentSubmissions, quizSubs, studentScores, _loop_1, _i, students_1, studentId, reports, _a, students_2, studentId, scores, assignmentPercent, quizPercent, weighted, grade, _b, _c, range, _d, reports_1, r;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Course.findById(courseId)];
                case 1:
                    course = _e.sent();
                    if (!course)
                        throw new Error('Course not found');
                    students = course.students;
                    return [4 /*yield*/, Assignment.find({ course: courseId })];
                case 2:
                    assignments = _e.sent();
                    quizzes = course.quizzes;
                    return [4 /*yield*/, Submission.find({ assignment: { $in: assignments.map(function (a) { return a._id; }) } })];
                case 3:
                    assignmentSubmissions = _e.sent();
                    return [4 /*yield*/, QuizSubmission.find({ quiz: { $in: quizzes } })];
                case 4:
                    quizSubs = _e.sent();
                    studentScores = {};
                    _loop_1 = function (studentId) {
                        // Assignment scores
                        var studentAssignSubs = assignmentSubmissions.filter(function (s) { return s.student.toString() === studentId.toString() && s.grade !== undefined; });
                        var assignScore = studentAssignSubs.reduce(function (sum, s) { return sum + (s.grade || 0); }, 0);
                        var assignMax = assignments.reduce(function (sum, a) { return sum + (a.maxPoints || 0); }, 0);
                        // Quiz scores
                        var studentQuizSubs = quizSubs.filter(function (qs) { return qs.student.toString() === studentId.toString(); });
                        var quizScore = studentQuizSubs.reduce(function (sum, q) { return sum + (q.score || 0); }, 0);
                        var quizMax = quizSubs.filter(function (qs) { return qs.student.toString() === studentId.toString(); }).reduce(function (sum, q) { return sum + (q.maxScore || 0); }, 0);
                        studentScores[studentId.toString()] = {
                            assignmentScore: assignScore,
                            assignmentMax: assignMax,
                            quizScore: quizScore,
                            quizMax: quizMax
                        };
                    };
                    for (_i = 0, students_1 = students; _i < students_1.length; _i++) {
                        studentId = students_1[_i];
                        _loop_1(studentId);
                    }
                    reports = [];
                    for (_a = 0, students_2 = students; _a < students_2.length; _a++) {
                        studentId = students_2[_a];
                        scores = studentScores[studentId.toString()];
                        assignmentPercent = scores.assignmentMax > 0 ? (scores.assignmentScore / scores.assignmentMax) * 100 : 0;
                        quizPercent = scores.quizMax > 0 ? (scores.quizScore / scores.quizMax) * 100 : 0;
                        weighted = ((assignmentPercent * (course.assignmentWeight || 70)) + (quizPercent * (course.quizWeight || 30))) / 100;
                        grade = 'F';
                        for (_b = 0, _c = course.gradeRanges || []; _b < _c.length; _b++) {
                            range = _c[_b];
                            if (weighted >= range.min && weighted <= range.max) {
                                grade = range.grade;
                                break;
                            }
                        }
                        reports.push({ student: studentId, finalScore: weighted, grade: grade });
                    }
                    // Sort for position
                    reports.sort(function (a, b) { return b.finalScore - a.finalScore; });
                    reports.forEach(function (r, i) { return r.position = i + 1; });
                    _d = 0, reports_1 = reports;
                    _e.label = 5;
                case 5:
                    if (!(_d < reports_1.length)) return [3 /*break*/, 8];
                    r = reports_1[_d];
                    return [4 /*yield*/, StudentReport.findOneAndUpdate({ student: r.student, course: courseId }, { $set: { finalScore: r.finalScore, grade: r.grade, position: r.position } }, { upsert: true })];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7:
                    _d++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, reports];
            }
        });
    });
}
export function recalculateReportsForCourse(courseId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, calculateAndUpdateReports(courseId)];
        });
    });
}
