"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTeachers = seedTeachers;
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var mongoose_1 = require("mongoose");
var UserModule = require("../models/User");
var User = UserModule.default || UserModule;
// Load environment variables
(0, dotenv_1.config)({ path: (0, path_1.resolve)(process.cwd(), '.env.local') });
function generateUserId() {
    // Generates a random 8-digit string
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
var teachers = [
    {
        name: 'John Smith',
        pin: '12345',
        role: 'teacher',
        subjects: ['Mathematics'],
        grades: ['Class 5', 'Class 6']
    },
    {
        name: 'Sarah Johnson',
        pin: '23456',
        role: 'teacher',
        subjects: ['English Language'],
        grades: ['JHS 1', 'JHS 2', 'JHS 3']
    },
    {
        name: 'Michael Brown',
        pin: '34567',
        role: 'teacher',
        subjects: ['Integrated Science'],
        grades: ['JHS 1', 'JHS 2']
    },
    {
        name: 'Emily Davis',
        pin: '45678',
        role: 'teacher',
        subjects: ['Social Studies'],
        grades: ['Class 4', 'Class 5', 'Class 6']
    },
    {
        name: 'David Wilson',
        pin: '56789',
        role: 'teacher',
        subjects: ['Core Mathematics', 'Elective Mathematics'],
        grades: ['SHS 1', 'SHS 2', 'SHS 3']
    }
];
function seedTeachers() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, teachers_1, teacherData, existingTeacher, userId, exists, attempts, teacher, userId, exists, attempts, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 17, , 19]);
                    // Connect to MongoDB
                    if (!process.env.MONGODB_URI) {
                        throw new Error('MONGODB_URI is not defined');
                    }
                    return [4 /*yield*/, mongoose_1.default.connect(process.env.MONGODB_URI)];
                case 1:
                    _a.sent();
                    console.log('Connected to MongoDB');
                    _i = 0, teachers_1 = teachers;
                    _a.label = 2;
                case 2:
                    if (!(_i < teachers_1.length)) return [3 /*break*/, 15];
                    teacherData = teachers_1[_i];
                    return [4 /*yield*/, User.findOne({ name: teacherData.name, pin: teacherData.pin })];
                case 3:
                    existingTeacher = _a.sent();
                    if (!!existingTeacher) return [3 /*break*/, 8];
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
                    if (exists) {
                        throw new Error('Could not generate unique userId for teacher');
                    }
                    teacher = new User(__assign(__assign({}, teacherData), { userId: userId }));
                    return [4 /*yield*/, teacher.save()];
                case 7:
                    _a.sent();
                    console.log("Added teacher: ".concat(teacherData.name, " (ID: ").concat(userId, ", PIN: ").concat(teacherData.pin, ")"));
                    return [3 /*break*/, 14];
                case 8:
                    if (!!existingTeacher.userId) return [3 /*break*/, 13];
                    userId = void 0;
                    exists = true;
                    attempts = 0;
                    _a.label = 9;
                case 9:
                    if (!(exists && attempts < 10)) return [3 /*break*/, 11];
                    userId = generateUserId();
                    return [4 /*yield*/, User.exists({ userId: userId })];
                case 10:
                    exists = (_a.sent()) !== null;
                    attempts++;
                    return [3 /*break*/, 9];
                case 11:
                    if (exists) {
                        throw new Error('Could not generate unique userId for teacher');
                    }
                    existingTeacher.userId = userId;
                    return [4 /*yield*/, existingTeacher.save()];
                case 12:
                    _a.sent();
                    console.log("Updated teacher ".concat(existingTeacher.name, " with userId: ").concat(userId));
                    return [3 /*break*/, 14];
                case 13:
                    console.log("Teacher ".concat(teacherData.name, " already exists (ID: ").concat(existingTeacher.userId, ")"));
                    _a.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 2];
                case 15:
                    console.log('✅ Teacher seeding completed');
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 16:
                    _a.sent();
                    return [3 /*break*/, 19];
                case 17:
                    error_1 = _a.sent();
                    console.error('❌ Error seeding teachers:', error_1);
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 18:
                    _a.sent();
                    return [3 /*break*/, 19];
                case 19: return [2 /*return*/];
            }
        });
    });
}
// Run if this file is executed directly
if (require.main === module) {
    seedTeachers();
}
