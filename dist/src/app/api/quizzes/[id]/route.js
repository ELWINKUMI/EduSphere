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
        var authorization, token, decoded, id, quiz, course, submission, studentQuiz, submissions, error_1;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, connectDB()
                        // Get and verify token
                    ];
                case 1:
                    _c.sent();
                    authorization = request.headers.get('authorization');
                    if (!authorization || !authorization.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    token = authorization.split(' ')[1];
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    return [4 /*yield*/, params
                        // Find the quiz
                    ];
                case 2:
                    id = (_c.sent()).id;
                    return [4 /*yield*/, Quiz.findById(id)
                            .populate('course', 'title subject gradeLevel students')
                            .populate('teacher', 'name')];
                case 3:
                    quiz = _c.sent();
                    if (!quiz) {
                        return [2 /*return*/, NextResponse.json({ message: 'Quiz not found' }, { status: 404 })];
                    }
                    if (!(decoded.role === 'student')) return [3 /*break*/, 5];
                    course = quiz.course;
                    if (!course.students.includes(decoded.userId)) {
                        return [2 /*return*/, NextResponse.json({ message: 'Access denied' }, { status: 403 })];
                    }
                    return [4 /*yield*/, QuizSubmission.findOne({
                            quiz: id,
                            student: decoded.userId
                        })
                        // Return quiz without detailed question answers for students
                    ];
                case 4:
                    submission = _c.sent();
                    studentQuiz = {
                        _id: quiz._id,
                        title: quiz.title,
                        description: quiz.description,
                        timeLimit: quiz.timeLimit,
                        attempts: quiz.attempts,
                        showResults: quiz.showResults,
                        startDate: quiz.startDate,
                        endDate: quiz.endDate,
                        course: quiz.course,
                        teacher: quiz.teacher,
                        isActive: quiz.isActive,
                        questions: quiz.questions.map(function (q) { return ({
                            _id: q._id,
                            question: q.question,
                            type: q.type,
                            options: q.options,
                            points: q.points
                            // Don't include correctAnswer for students
                        }); })
                    };
                    return [2 /*return*/, NextResponse.json({
                            quiz: studentQuiz,
                            submission: submission ? {
                                _id: submission._id,
                                score: submission.score,
                                totalPoints: submission.maxScore,
                                submittedAt: submission.submittedAt,
                                timeSpent: submission.timeSpent,
                                isGraded: submission.isGraded,
                                answers: submission.answers
                            } : null
                        }, { status: 200 })];
                case 5:
                    if (!(decoded.role === 'teacher')) return [3 /*break*/, 7];
                    // Teachers can see their own quizzes with full details
                    if (quiz.teacher._id.toString() !== decoded.userId) {
                        return [2 /*return*/, NextResponse.json({ message: 'Access denied' }, { status: 403 })];
                    }
                    return [4 /*yield*/, QuizSubmission.find({ quiz: id })
                            .populate('student', 'name')
                            .sort({ submittedAt: -1 })];
                case 6:
                    submissions = _c.sent();
                    return [2 /*return*/, NextResponse.json({
                            quiz: quiz,
                            submissions: submissions
                        }, { status: 200 })];
                case 7: return [2 /*return*/, NextResponse.json({ message: 'Access denied' }, { status: 403 })];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_1 = _c.sent();
                    console.error('Error fetching quiz:', error_1);
                    return [2 /*return*/, NextResponse.json({ message: 'Internal server error' }, { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
