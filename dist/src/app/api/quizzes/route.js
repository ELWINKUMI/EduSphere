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
import Course from '@/models/Course';
import jwt from 'jsonwebtoken';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authorization, token, decoded, body, title, description, courseId, timeLimit, maxAttempts, showResults, startDate, endDate, questions, course_1, _i, questions_1, question, now, defaultStartDate, defaultEndDate, quiz_1, User, Notification_1, courseWithStudents, notifications, notifyErr_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 13, , 14]);
                    return [4 /*yield*/, connectDB()
                        // Get and verify token
                    ];
                case 1:
                    _a.sent();
                    authorization = request.headers.get('authorization');
                    if (!authorization || !authorization.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    token = authorization.split(' ')[1];
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    if (decoded.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ message: 'Only teachers can create quizzes' }, { status: 403 })];
                    }
                    return [4 /*yield*/, request.json()];
                case 2:
                    body = _a.sent();
                    title = body.title, description = body.description, courseId = body.courseId, timeLimit = body.timeLimit, maxAttempts = body.maxAttempts, showResults = body.showResults, startDate = body.startDate, endDate = body.endDate, questions = body.questions;
                    // Validate required fields
                    if (!title || !courseId || !questions || questions.length === 0) {
                        return [2 /*return*/, NextResponse.json({
                                message: 'Title, course, and at least one question are required'
                            }, { status: 400 })];
                    }
                    return [4 /*yield*/, Course.findOne({
                            _id: courseId,
                            teacher: decoded.userId
                        })];
                case 3:
                    course_1 = _a.sent();
                    if (!course_1) {
                        return [2 /*return*/, NextResponse.json({
                                message: 'Course not found or you do not have permission to create quizzes for this course'
                            }, { status: 404 })];
                    }
                    // Validate questions
                    for (_i = 0, questions_1 = questions; _i < questions_1.length; _i++) {
                        question = questions_1[_i];
                        if (!question.question || !question.correctAnswer) {
                            return [2 /*return*/, NextResponse.json({
                                    message: 'All questions must have content and correct answers'
                                }, { status: 400 })];
                        }
                        if (question.type === 'multiple-choice' && (!question.options || question.options.length < 2)) {
                            return [2 /*return*/, NextResponse.json({
                                    message: 'Multiple choice questions must have at least 2 options'
                                }, { status: 400 })];
                        }
                    }
                    now = new Date();
                    defaultStartDate = startDate ? new Date(startDate) : now;
                    defaultEndDate = endDate ? new Date(endDate) : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
                    ;
                    quiz_1 = new Quiz({
                        title: title,
                        description: description || '',
                        course: courseId,
                        teacher: decoded.userId,
                        questions: questions.map(function (q) { return ({
                            question: q.question,
                            type: q.type,
                            options: q.options || [],
                            correctAnswer: q.correctAnswer,
                            points: q.points || 1
                        }); }),
                        timeLimit: timeLimit || 30, // Default 30 minutes
                        attempts: maxAttempts === -1 ? 999 : (maxAttempts || 1),
                        showResults: showResults || 'after-deadline',
                        startDate: defaultStartDate,
                        endDate: defaultEndDate,
                        isActive: true
                    });
                    return [4 /*yield*/, quiz_1.save()
                        // Notify all students in the course about the new quiz
                    ];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 11, , 12]);
                    return [4 /*yield*/, import('@/models/User')];
                case 6:
                    User = (_a.sent()).default;
                    return [4 /*yield*/, import('@/models/Notification')];
                case 7:
                    Notification_1 = (_a.sent()).default;
                    return [4 /*yield*/, Course.findById(courseId).populate('students', 'name')];
                case 8:
                    courseWithStudents = _a.sent();
                    if (!(courseWithStudents && courseWithStudents.students && courseWithStudents.students.length > 0)) return [3 /*break*/, 10];
                    notifications = courseWithStudents.students.map(function (student) { return ({
                        type: 'quiz_created',
                        student: student._id,
                        studentName: student.name,
                        content: "A new quiz \"".concat(quiz_1.title, "\" has been posted for your course: ").concat(course_1.title),
                        read: false,
                        createdAt: new Date(),
                        quiz: quiz_1._id,
                    }); });
                    return [4 /*yield*/, Notification_1.insertMany(notifications)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    notifyErr_1 = _a.sent();
                    console.error('Failed to create student notifications for quiz:', notifyErr_1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/, NextResponse.json({
                        message: 'Quiz created successfully',
                        quiz: {
                            _id: quiz_1._id,
                            title: quiz_1.title,
                            description: quiz_1.description,
                            course: quiz_1.course,
                            timeLimit: quiz_1.timeLimit,
                            attempts: quiz_1.attempts,
                            startDate: quiz_1.startDate,
                            endDate: quiz_1.endDate,
                            questionCount: quiz_1.questions.length
                        }
                    }, { status: 201 })];
                case 13:
                    error_1 = _a.sent();
                    console.error('Error creating quiz:', error_1);
                    return [2 /*return*/, NextResponse.json({ message: 'Internal server error' }, { status: 500 })];
                case 14: return [2 /*return*/];
            }
        });
    });
}
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authorization, token, decoded, quizzes, studentCourses, courseIds, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, connectDB()
                        // Get and verify token
                    ];
                case 1:
                    _a.sent();
                    authorization = request.headers.get('authorization');
                    if (!authorization || !authorization.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    token = authorization.split(' ')[1];
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    quizzes = void 0;
                    if (!(decoded.role === 'teacher')) return [3 /*break*/, 3];
                    return [4 /*yield*/, Quiz.find({ teacher: decoded.userId })
                            .populate('course', 'title subject gradeLevel')
                            .sort({ createdAt: -1 })];
                case 2:
                    // Teachers see their own quizzes
                    quizzes = _a.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, Course.find({
                        students: decoded.userId
                    }).select('_id')];
                case 4:
                    studentCourses = _a.sent();
                    courseIds = studentCourses.map(function (course) { return course._id; });
                    return [4 /*yield*/, Quiz.find({
                            course: { $in: courseIds },
                            isActive: true
                        })
                            .populate('course', 'title subject gradeLevel')
                            .sort({ startDate: 1 })];
                case 5:
                    quizzes = _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, NextResponse.json({ quizzes: quizzes }, { status: 200 })];
                case 7:
                    error_2 = _a.sent();
                    console.error('Error fetching quizzes:', error_2);
                    return [2 /*return*/, NextResponse.json({ message: 'Internal server error' }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
