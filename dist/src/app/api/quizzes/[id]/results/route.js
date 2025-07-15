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
        var quizId, token, decoded, quiz, submission, now, endDate, canShowResults, message, quizObj, quizData, submissionObj, submissionData, error_1;
        var _c, _d;
        var params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, params
                        // Get the authorization token
                    ];
                case 2:
                    quizId = (_e.sent()).id;
                    token = (_c = request.headers.get('authorization')) === null || _c === void 0 ? void 0 : _c.replace('Bearer ', '');
                    if (!token) {
                        return [2 /*return*/, NextResponse.json({ error: 'Authorization token required' }, { status: 401 })];
                    }
                    decoded = void 0;
                    try {
                        decoded = jwt.verify(token, process.env.JWT_SECRET);
                    }
                    catch (error) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid token' }, { status: 401 })];
                    }
                    return [4 /*yield*/, Quiz.findById(quizId)
                            .populate('course', 'title subject gradeLevel')
                            .populate('teacher', 'name')
                            .lean()];
                case 3:
                    quiz = _e.sent();
                    if (!quiz) {
                        return [2 /*return*/, NextResponse.json({ error: 'Quiz not found' }, { status: 404 })];
                    }
                    return [4 /*yield*/, QuizSubmission.findOne({
                            quiz: quizId,
                            student: decoded.userId
                        }).lean()];
                case 4:
                    submission = _e.sent();
                    if (!submission) {
                        return [2 /*return*/, NextResponse.json({ error: 'No submission found for this quiz' }, { status: 404 })];
                    }
                    now = new Date();
                    endDate = new Date(Array.isArray(quiz) ? (_d = quiz[0]) === null || _d === void 0 ? void 0 : _d.endDate : quiz.endDate);
                    canShowResults = false;
                    message = '';
                    quizObj = Array.isArray(quiz) ? quiz[0] : quiz;
                    switch (quizObj.showResults) {
                        case 'immediately':
                            canShowResults = true;
                            break;
                        case 'after-deadline':
                            canShowResults = now >= endDate;
                            if (!canShowResults) {
                                message = 'Results will be available after the quiz deadline';
                            }
                            break;
                        case 'manual':
                            // For manual, we'll check if the submission is graded
                            canShowResults = Array.isArray(submission) ? false : submission.isGraded;
                            if (!canShowResults) {
                                message = 'Results are not yet available. Please wait for manual grading.';
                            }
                            break;
                        default:
                            canShowResults = false;
                            message = 'Results are not available';
                    }
                    // If results cannot be shown, return limited information
                    if (!canShowResults) {
                        return [2 /*return*/, NextResponse.json({
                                quiz: {
                                    _id: quizObj._id,
                                    title: quizObj.title,
                                    description: quizObj.description,
                                    showResults: quizObj.showResults,
                                    endDate: quizObj.endDate,
                                    course: quizObj.course,
                                    teacher: quizObj.teacher
                                },
                                submission: Array.isArray(submission)
                                    ? undefined
                                    : {
                                        _id: submission._id,
                                        submittedAt: submission.submittedAt,
                                        timeSpent: submission.timeSpent
                                    },
                                canShowResults: false,
                                message: message
                            })];
                    }
                    quizData = {
                        _id: quizObj._id,
                        title: quizObj.title,
                        description: quizObj.description,
                        showResults: quizObj.showResults,
                        endDate: quizObj.endDate,
                        questions: quizObj.questions,
                        course: quizObj.course,
                        teacher: quizObj.teacher
                    };
                    submissionObj = Array.isArray(submission) ? submission[0] : submission;
                    submissionData = submissionObj
                        ? {
                            _id: submissionObj._id,
                            score: submissionObj.score,
                            maxScore: submissionObj.maxScore,
                            submittedAt: submissionObj.submittedAt,
                            timeSpent: submissionObj.timeSpent,
                            answers: submissionObj.answers,
                            isGraded: submissionObj.isGraded,
                            feedback: submissionObj.feedback
                        }
                        : undefined;
                    return [2 /*return*/, NextResponse.json({
                            quiz: quizData,
                            submission: submissionData,
                            canShowResults: true,
                            message: 'Results are available'
                        })];
                case 5:
                    error_1 = _e.sent();
                    console.error('Error fetching quiz results:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
