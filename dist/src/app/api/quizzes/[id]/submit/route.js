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
import Course from '@/models/Course';
import jwt from 'jsonwebtoken';
export function POST(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var quizId, authorization, token, decoded, body, answers_1, submittedAt, quiz, course, now, startDate, endDate, existingSubmissions, score_1, maxScore_1, submissionAnswers_1, submission, error_1;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 9, , 10]);
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
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    if (decoded.role !== 'student') {
                        return [2 /*return*/, NextResponse.json({ message: 'Only students can submit quizzes' }, { status: 403 })];
                    }
                    return [4 /*yield*/, request.json()];
                case 3:
                    body = _c.sent();
                    answers_1 = body.answers, submittedAt = body.submittedAt;
                    return [4 /*yield*/, Quiz.findById(quizId).populate('course')];
                case 4:
                    quiz = _c.sent();
                    if (!quiz) {
                        return [2 /*return*/, NextResponse.json({ message: 'Quiz not found' }, { status: 404 })];
                    }
                    return [4 /*yield*/, Course.findOne({
                            _id: quiz.course._id,
                            students: decoded.userId
                        })];
                case 5:
                    course = _c.sent();
                    if (!course) {
                        return [2 /*return*/, NextResponse.json({
                                message: 'You are not enrolled in the course for this quiz'
                            }, { status: 403 })];
                    }
                    now = new Date();
                    startDate = new Date(quiz.startDate);
                    endDate = new Date(quiz.endDate);
                    if (now < startDate || now > endDate) {
                        return [2 /*return*/, NextResponse.json({
                                message: 'Quiz is not currently available'
                            }, { status: 400 })];
                    }
                    return [4 /*yield*/, QuizSubmission.find({
                            quiz: quizId,
                            student: decoded.userId
                        }).sort({ submittedAt: -1 })];
                case 6:
                    existingSubmissions = _c.sent();
                    if (existingSubmissions.length >= quiz.attempts && quiz.attempts !== 999) {
                        return [2 /*return*/, NextResponse.json({
                                message: 'You have exceeded the maximum number of attempts for this quiz'
                            }, { status: 400 })];
                    }
                    score_1 = 0;
                    maxScore_1 = 0;
                    submissionAnswers_1 = [];
                    quiz.questions.forEach(function (question, index) {
                        maxScore_1 += question.points;
                        var studentAnswer = answers_1[question._id];
                        var correctAnswer = question.correctAnswer;
                        var isCorrect = false;
                        var pointsEarned = 0;
                        if (studentAnswer) {
                            // For multiple choice and true/false, exact match
                            if (question.type === 'multiple-choice' || question.type === 'true-false') {
                                if (studentAnswer === correctAnswer) {
                                    isCorrect = true;
                                    pointsEarned = question.points;
                                    score_1 += question.points;
                                }
                            }
                            // For short answer, give full points (manual grading can be implemented later)
                            else if (question.type === 'short-answer') {
                                isCorrect = true; // Assume correct for now, manual grading needed
                                pointsEarned = question.points;
                                score_1 += question.points;
                            }
                        }
                        submissionAnswers_1.push({
                            questionIndex: index,
                            answer: studentAnswer || ''
                        });
                    });
                    submission = new QuizSubmission({
                        quiz: quizId,
                        student: decoded.userId,
                        answers: submissionAnswers_1,
                        score: score_1,
                        maxScore: maxScore_1,
                        timeSpent: quiz.timeLimit, // TODO: Calculate actual time spent
                        submittedAt: submittedAt || new Date(),
                        isGraded: true // Auto-graded for MC and T/F
                    });
                    return [4 /*yield*/, submission.save()
                        // Add submission to quiz's submissions array
                    ];
                case 7:
                    _c.sent();
                    // Add submission to quiz's submissions array
                    quiz.submissions.push(submission._id);
                    return [4 /*yield*/, quiz.save()];
                case 8:
                    _c.sent();
                    return [2 /*return*/, NextResponse.json({
                            message: 'Quiz submitted successfully',
                            submission: {
                                _id: submission._id,
                                score: score_1,
                                totalPoints: maxScore_1,
                                submittedAt: submission.submittedAt,
                                isGraded: submission.isGraded,
                                answers: submission.answers
                            }
                        }, { status: 201 })];
                case 9:
                    error_1 = _c.sent();
                    console.error('Error submitting quiz:', error_1);
                    return [2 /*return*/, NextResponse.json({ message: 'Internal server error' }, { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
