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
function enrollStudentInCourse(studentName, courseSubject, courseGrade) {
    return __awaiter(this, void 0, void 0, function () {
        var student_1, course, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, 8, 10]);
                    return [4 /*yield*/, mongoose.connect(process.env.MONGODB_URI)];
                case 1:
                    _a.sent();
                    console.log('Connected to MongoDB');
                    return [4 /*yield*/, User.findOne({ role: 'student', name: studentName })];
                case 2:
                    student_1 = _a.sent();
                    if (!student_1) {
                        console.log('No student found with name', studentName);
                        return [2 /*return*/];
                    }
                    console.log('Found student:', student_1.name, 'ID:', student_1._id);
                    return [4 /*yield*/, Course.findOne({ subject: courseSubject, gradeLevel: courseGrade })];
                case 3:
                    course = _a.sent();
                    if (!course) {
                        console.log('No course found for', courseSubject, courseGrade);
                        return [2 /*return*/];
                    }
                    console.log('Found course:', course.title, 'ID:', course._id);
                    if (!!course.students.some(function (id) { return id.equals(student_1._id); })) return [3 /*break*/, 5];
                    course.students.push(student_1._id);
                    return [4 /*yield*/, course.save()];
                case 4:
                    _a.sent();
                    console.log('Enrolled student in course.');
                    return [3 /*break*/, 6];
                case 5:
                    console.log('Student already enrolled in course.');
                    _a.label = 6;
                case 6: return [3 /*break*/, 10];
                case 7:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, mongoose.disconnect()];
                case 9:
                    _a.sent();
                    console.log('Disconnected from MongoDB');
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Example usage:
// Replace with actual student name and course details
enrollStudentInCourse('Student Name', 'Mathematics', 'Class 5');
