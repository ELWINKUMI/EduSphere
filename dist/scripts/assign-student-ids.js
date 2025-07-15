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
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
function generateUserId() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
function assignStudentIds() {
    return __awaiter(this, void 0, void 0, function () {
        var students, updated, _i, students_1, student, userId, exists, attempts, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 12, , 14]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _a.sent();
                    console.log('Connected to MongoDB');
                    return [4 /*yield*/, User.find({ role: 'student', $or: [{ userId: { $exists: false } }, { userId: null }, { userId: '' }] })];
                case 2:
                    students = _a.sent();
                    console.log("Found ".concat(students.length, " students without userId"));
                    updated = 0;
                    _i = 0, students_1 = students;
                    _a.label = 3;
                case 3:
                    if (!(_i < students_1.length)) return [3 /*break*/, 10];
                    student = students_1[_i];
                    userId = void 0;
                    exists = true;
                    attempts = 0;
                    _a.label = 4;
                case 4:
                    if (!(exists && attempts < 10)) return [3 /*break*/, 6];
                    userId = generateUserId();
                    return [4 /*yield*/, User.exists({ userId: userId })];
                case 5:
                    exists = (_a.sent()) !== null;
                    attempts++;
                    return [3 /*break*/, 4];
                case 6:
                    if (!!exists) return [3 /*break*/, 8];
                    student.userId = userId;
                    return [4 /*yield*/, student.save()];
                case 7:
                    _a.sent();
                    updated++;
                    console.log("Assigned userId ".concat(userId, " to student ").concat(student.name));
                    return [3 /*break*/, 9];
                case 8:
                    console.log("Could not generate unique userId for student ".concat(student.name));
                    _a.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    console.log("Updated ".concat(updated, " students."));
                    return [4 /*yield*/, mongoose.disconnect()];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 12:
                    error_1 = _a.sent();
                    console.error('Error assigning student IDs:', error_1);
                    return [4 /*yield*/, mongoose.disconnect()];
                case 13:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    assignStudentIds();
}
