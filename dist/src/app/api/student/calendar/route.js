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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import Quiz from '@/models/Quiz';
import Course from '@/models/Course';
import jwt from 'jsonwebtoken';
export function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, token, decoded, User, user, courses, courseIds, courseMap_1, assignments, quizzes, events, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    auth = req.headers.get('authorization');
                    if (!auth)
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 401 })];
                    token = auth.replace('Bearer ', '');
                    decoded = void 0;
                    try {
                        decoded = jwt.verify(token, process.env.JWT_SECRET);
                    }
                    catch (error) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid token' }, { status: 401 })];
                    }
                    return [4 /*yield*/, import('@/models/User')];
                case 2:
                    User = (_a.sent()).default;
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 3:
                    user = _a.sent();
                    if (!user || user.role !== 'student')
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 401 })];
                    return [4 /*yield*/, Course.find({ students: user._id })];
                case 4:
                    courses = _a.sent();
                    courseIds = courses.map(function (c) { return c._id; });
                    courseMap_1 = Object.fromEntries(courses.map(function (c) { return [String(c._id), c.title]; }));
                    return [4 /*yield*/, Assignment.find({ course: { $in: courseIds } })];
                case 5:
                    assignments = _a.sent();
                    return [4 /*yield*/, Quiz.find({ course: { $in: courseIds } })];
                case 6:
                    quizzes = _a.sent();
                    events = __spreadArray(__spreadArray([], assignments.map(function (a) { return ({
                        _id: String(a._id),
                        type: 'assignment',
                        title: a.title,
                        dueDate: a.dueDate,
                        courseName: courseMap_1[String(a.course)] || '',
                        link: "/student/assignments/".concat(a._id),
                    }); }), true), quizzes.map(function (q) { return ({
                        _id: String(q._id),
                        type: 'quiz',
                        title: q.title,
                        dueDate: q.dueDate,
                        courseName: courseMap_1[String(q.course)] || '',
                        link: "/student/quizzes/".concat(q._id),
                    }); }), true);
                    return [2 /*return*/, NextResponse.json({ events: events })];
                case 7:
                    e_1 = _a.sent();
                    return [2 /*return*/, NextResponse.json({ events: [] })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
