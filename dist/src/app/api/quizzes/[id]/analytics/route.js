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
import Quiz from '@/models/Quiz';
import QuizSubmission from '@/models/QuizSubmission';
import jwt from 'jsonwebtoken';
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var quizId, authorization, token, decoded_1, quiz, course, submissions, totalSubmissions_1, totalStudents, completionRate, scoreRanges_1, scores, averageScore, detailedSubmissions, analytics, error_1;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, params
                        // Get and verify token
                    ];
                case 2:
                    quizId = (_c.sent()).id;
                    authorization = request.headers.get('authorization');
                    if (!authorization || !authorization.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    token = authorization.split(' ')[1];
                    decoded_1 = jwt.verify(token, process.env.JWT_SECRET);
                    return [4 /*yield*/, Quiz.findById(quizId)
                            .populate('course', 'title subject gradeLevel students')
                            .populate('teacher', 'name')];
                case 3:
                    quiz = _c.sent();
                    if (!quiz) {
                        return [2 /*return*/, NextResponse.json({ message: 'Quiz not found' }, { status: 404 })];
                    }
                    // Verify access
                    if (decoded_1.role === 'teacher') {
                        // Teachers can only view analytics for their own quizzes
                        if (quiz.teacher._id.toString() !== decoded_1.userId) {
                            return [2 /*return*/, NextResponse.json({ message: 'Access denied' }, { status: 403 })];
                        }
                    }
                    else if (decoded_1.role === 'student') {
                        course = quiz.course;
                        if (!course.students.includes(decoded_1.userId)) {
                            return [2 /*return*/, NextResponse.json({ message: 'Access denied' }, { status: 403 })];
                        }
                    }
                    else {
                        return [2 /*return*/, NextResponse.json({ message: 'Access denied' }, { status: 403 })];
                    }
                    return [4 /*yield*/, QuizSubmission.find({ quiz: quizId })
                            .populate('student', 'name')
                            .sort({ submittedAt: -1 })
                        // Calculate analytics
                    ];
                case 4:
                    submissions = _c.sent();
                    totalSubmissions_1 = submissions.length;
                    totalStudents = quiz.course.students.length;
                    completionRate = totalStudents > 0 ? (totalSubmissions_1 / totalStudents) * 100 : 0;
                    scoreRanges_1 = {
                        '0-50': 0,
                        '50-60': 0,
                        '60-70': 0,
                        '70-80': 0,
                        '80-90': 0,
                        '90-100': 0
                    };
                    scores = submissions.map(function (sub) {
                        var percentage = sub.maxScore > 0 ? (sub.score / sub.maxScore) * 100 : 0;
                        return percentage;
                    });
                    scores.forEach(function (score) {
                        if (score < 50)
                            scoreRanges_1['0-50']++;
                        else if (score < 60)
                            scoreRanges_1['50-60']++;
                        else if (score < 70)
                            scoreRanges_1['60-70']++;
                        else if (score < 80)
                            scoreRanges_1['70-80']++;
                        else if (score < 90)
                            scoreRanges_1['80-90']++;
                        else
                            scoreRanges_1['90-100']++;
                    });
                    averageScore = scores.length > 0 ? scores.reduce(function (a, b) { return a + b; }, 0) / scores.length : 0;
                    detailedSubmissions = submissions.map(function (sub) { return ({
                        _id: sub._id,
                        student: {
                            _id: sub.student._id,
                            name: decoded_1.role === 'teacher' ? sub.student.name : 'Student' // Hide names from students
                        },
                        score: sub.score,
                        maxScore: sub.maxScore,
                        percentage: sub.maxScore > 0 ? Math.round((sub.score / sub.maxScore) * 100) : 0,
                        timeSpent: sub.timeSpent,
                        submittedAt: sub.submittedAt,
                        isGraded: sub.isGraded
                    }); });
                    analytics = {
                        quiz: {
                            _id: quiz._id,
                            title: quiz.title,
                            description: quiz.description,
                            course: quiz.course,
                            teacher: quiz.teacher,
                            totalQuestions: quiz.questions.length,
                            timeLimit: quiz.timeLimit,
                            maxScore: quiz.questions.reduce(function (sum, q) { return sum + q.points; }, 0),
                            startDate: quiz.startDate,
                            endDate: quiz.endDate,
                            showResults: quiz.showResults
                        },
                        statistics: {
                            totalStudents: totalStudents,
                            totalSubmissions: totalSubmissions_1,
                            completionRate: Math.round(completionRate),
                            averageScore: Math.round(averageScore),
                            scoreDistribution: scoreRanges_1,
                            scoreData: Object.entries(scoreRanges_1).map(function (_a) {
                                var range = _a[0], count = _a[1];
                                return ({
                                    range: range,
                                    count: count,
                                    percentage: totalSubmissions_1 > 0 ? Math.round((count / totalSubmissions_1) * 100) : 0
                                });
                            })
                        },
                        submissions: detailedSubmissions
                    };
                    return [2 /*return*/, NextResponse.json(analytics, { status: 200 })];
                case 5:
                    error_1 = _c.sent();
                    console.error('Error fetching quiz analytics:', error_1);
                    return [2 /*return*/, NextResponse.json({ message: 'Internal server error' }, { status: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
