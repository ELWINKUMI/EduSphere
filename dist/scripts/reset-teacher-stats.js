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
import connectDB from '../src/lib/mongodb';
import User from '../src/models/User';
import Course from '../src/models/Course';
import Assignment from '../src/models/Assignment';
import Quiz from '../src/models/Quiz';
import Announcement from '../src/models/Announcement';
function resetTeacherStats() {
    return __awaiter(this, void 0, void 0, function () {
        var teachers, updated, _i, teachers_1, teacher, courses, _a, courses_1, course;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, connectDB()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, User.find({ role: 'teacher' })];
                case 2:
                    teachers = _b.sent();
                    updated = 0;
                    _i = 0, teachers_1 = teachers;
                    _b.label = 3;
                case 3:
                    if (!(_i < teachers_1.length)) return [3 /*break*/, 13];
                    teacher = teachers_1[_i];
                    return [4 /*yield*/, Course.find({ teacher: teacher._id })];
                case 4:
                    courses = _b.sent();
                    _a = 0, courses_1 = courses;
                    _b.label = 5;
                case 5:
                    if (!(_a < courses_1.length)) return [3 /*break*/, 11];
                    course = courses_1[_a];
                    // Remove assignments, quizzes, announcements for this course
                    return [4 /*yield*/, Assignment.deleteMany({ _id: { $in: course.assignments } })];
                case 6:
                    // Remove assignments, quizzes, announcements for this course
                    _b.sent();
                    return [4 /*yield*/, Quiz.deleteMany({ _id: { $in: course.quizzes } })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, Announcement.deleteMany({ _id: { $in: course.announcements } })];
                case 8:
                    _b.sent();
                    // Remove the course itself
                    return [4 /*yield*/, course.deleteOne()];
                case 9:
                    // Remove the course itself
                    _b.sent();
                    _b.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 5];
                case 11:
                    // Optionally, reset teacher's subjects/grades if needed
                    // teacher.subjects = [];
                    // teacher.grades = [];
                    // await teacher.save();
                    updated++;
                    console.log("Reset records for teacher: ".concat(teacher.name));
                    _b.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 3];
                case 13:
                    console.log("Reset stats for ".concat(updated, " teachers."));
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
resetTeacherStats().catch(function (err) {
    console.error('Error resetting teacher stats:', err);
    process.exit(1);
});
