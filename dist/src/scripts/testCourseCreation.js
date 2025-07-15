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
import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';
import User from '../models/User';
import Course from '../models/Course';
// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
function testCourseCreation() {
    return __awaiter(this, void 0, void 0, function () {
        var teacher, existingCourses, testCourse, existingCourse, finalCount, allCourses, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, 11, 13]);
                    // Connect to MongoDB
                    return [4 /*yield*/, mongoose.connect(process.env.MONGODB_URI)];
                case 1:
                    // Connect to MongoDB
                    _a.sent();
                    console.log('Connected to MongoDB');
                    return [4 /*yield*/, User.findOne({ role: 'teacher', name: 'John Smith' })];
                case 2:
                    teacher = _a.sent();
                    if (!teacher) {
                        console.log('No teacher found');
                        return [2 /*return*/];
                    }
                    console.log('Found teacher:', teacher.name, 'ID:', teacher._id);
                    return [4 /*yield*/, Course.find({ teacher: teacher._id })];
                case 3:
                    existingCourses = _a.sent();
                    console.log('Existing courses for teacher:', existingCourses.length);
                    existingCourses.forEach(function (course) {
                        console.log("  - ".concat(course.title, " (").concat(course.subject, " - ").concat(course.gradeLevel, ")"));
                    });
                    testCourse = new Course({
                        title: 'Mathematics - Class 5',
                        description: 'Basic mathematics for Class 5 students',
                        subject: 'Mathematics',
                        gradeLevel: 'Class 5',
                        teacher: teacher._id,
                        enrollmentCode: 'MAT5TEST',
                        maxStudents: 30,
                        students: [],
                        assignments: [],
                        quizzes: [],
                        resources: [],
                        announcements: [],
                        isActive: true
                    });
                    return [4 /*yield*/, Course.findOne({
                            subject: 'Mathematics',
                            gradeLevel: 'Class 5',
                            teacher: teacher._id
                        })];
                case 4:
                    existingCourse = _a.sent();
                    if (!existingCourse) return [3 /*break*/, 5];
                    console.log('Course already exists:', existingCourse.title);
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, testCourse.save()];
                case 6:
                    _a.sent();
                    console.log('Created new course:', testCourse.title);
                    _a.label = 7;
                case 7: return [4 /*yield*/, Course.countDocuments({ teacher: teacher._id })];
                case 8:
                    finalCount = _a.sent();
                    console.log('Final course count for teacher:', finalCount);
                    return [4 /*yield*/, Course.find({ teacher: teacher._id })];
                case 9:
                    allCourses = _a.sent();
                    console.log('All courses for teacher:');
                    allCourses.forEach(function (course) {
                        console.log("  - ".concat(course.title, " (").concat(course.subject, " - ").concat(course.gradeLevel, ") - Code: ").concat(course.enrollmentCode));
                    });
                    return [3 /*break*/, 13];
                case 10:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, mongoose.disconnect()];
                case 12:
                    _a.sent();
                    console.log('Disconnected from MongoDB');
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
testCourseCreation();
