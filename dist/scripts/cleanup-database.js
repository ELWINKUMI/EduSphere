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
import Course from '@/models/Course';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
/**
 * Database cleanup script to fix enrollment code issues
 * Run this script to clean up duplicate null values and fix indexes
 */
function cleanupDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var userResult, error_1, result, coursesWithoutCodes, _i, coursesWithoutCodes_1, course, enrollmentCode, isUnique, attempts, existing, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 21, , 22]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _a.sent();
                    console.log('Connected to MongoDB');
                    return [4 /*yield*/, User.deleteMany({
                            $or: [
                                { userId: null },
                                { userId: undefined },
                                { userId: '' }
                            ]
                        })];
                case 2:
                    userResult = _a.sent();
                    console.log("Removed ".concat(userResult.deletedCount, " users with invalid userId"));
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, User.collection.dropIndex('userId_1')];
                case 4:
                    _a.sent();
                    console.log('Dropped existing userId index');
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.log('userId index might not exist, continuing...');
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, User.collection.createIndex({ userId: 1 }, {
                        unique: true,
                        sparse: true,
                        background: true
                    })];
                case 7:
                    _a.sent();
                    console.log('Created new userId index (unique, sparse)');
                    return [4 /*yield*/, Course.deleteMany({
                            $or: [
                                { enrollmentCode: null },
                                { enrollmentCode: undefined },
                                { enrollmentCode: '' }
                            ]
                        })];
                case 8:
                    result = _a.sent();
                    console.log("Removed ".concat(result.deletedCount, " courses with invalid enrollment codes"));
                    return [4 /*yield*/, Course.find({
                            $or: [
                                { enrollmentCode: { $exists: false } },
                                { enrollmentCode: null },
                                { enrollmentCode: '' }
                            ]
                        })];
                case 9:
                    coursesWithoutCodes = _a.sent();
                    _i = 0, coursesWithoutCodes_1 = coursesWithoutCodes;
                    _a.label = 10;
                case 10:
                    if (!(_i < coursesWithoutCodes_1.length)) return [3 /*break*/, 16];
                    course = coursesWithoutCodes_1[_i];
                    enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                    isUnique = false;
                    attempts = 0;
                    _a.label = 11;
                case 11:
                    if (!(!isUnique && attempts < 10)) return [3 /*break*/, 13];
                    return [4 /*yield*/, Course.findOne({ enrollmentCode: enrollmentCode })];
                case 12:
                    existing = _a.sent();
                    if (!existing) {
                        isUnique = true;
                    }
                    else {
                        enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                        attempts++;
                    }
                    return [3 /*break*/, 11];
                case 13:
                    if (!isUnique) return [3 /*break*/, 15];
                    return [4 /*yield*/, Course.findByIdAndUpdate(course._id, { enrollmentCode: enrollmentCode })];
                case 14:
                    _a.sent();
                    console.log("Updated course ".concat(course._id, " with enrollment code: ").concat(enrollmentCode));
                    _a.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 10];
                case 16:
                    _a.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, Course.collection.dropIndex('enrollmentCode_1')];
                case 17:
                    _a.sent();
                    console.log('Dropped existing enrollmentCode index');
                    return [3 /*break*/, 19];
                case 18:
                    error_2 = _a.sent();
                    console.log('Index might not exist, continuing...');
                    return [3 /*break*/, 19];
                case 19: 
                // Create a new unique index that allows for proper uniqueness
                return [4 /*yield*/, Course.collection.createIndex({ enrollmentCode: 1 }, {
                        unique: true,
                        sparse: false,
                        background: true
                    })];
                case 20:
                    // Create a new unique index that allows for proper uniqueness
                    _a.sent();
                    console.log('Created new enrollmentCode index');
                    console.log('Database cleanup completed successfully');
                    process.exit(0);
                    return [3 /*break*/, 22];
                case 21:
                    error_3 = _a.sent();
                    console.error('Database cleanup failed:', error_3);
                    process.exit(1);
                    return [3 /*break*/, 22];
                case 22: return [2 /*return*/];
            }
        });
    });
}
// Run the cleanup if this file is executed directly
if (require.main === module) {
    cleanupDatabase();
}
export default cleanupDatabase;
