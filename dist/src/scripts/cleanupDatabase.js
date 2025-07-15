// Database cleanup script to remove old indexes and collections
// Run this before seeding teachers
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
// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
export function cleanupDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var db, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 9]);
                    // Connect to MongoDB
                    if (!process.env.MONGODB_URI) {
                        throw new Error('MONGODB_URI is not defined');
                    }
                    return [4 /*yield*/, mongoose.connect(process.env.MONGODB_URI)];
                case 1:
                    _a.sent();
                    console.log('Connected to MongoDB');
                    db = mongoose.connection.db;
                    if (!db) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, db.collection('users').drop()];
                case 3:
                    _a.sent();
                    console.log('✅ Dropped old users collection');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    if (error_1.codeName === 'NamespaceNotFound') {
                        console.log('ℹ️  Users collection does not exist, nothing to drop');
                    }
                    else {
                        throw error_1;
                    }
                    return [3 /*break*/, 5];
                case 5:
                    console.log('✅ Database cleanup completed');
                    return [4 /*yield*/, mongoose.disconnect()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7:
                    error_2 = _a.sent();
                    console.error('❌ Error cleaning database:', error_2);
                    return [4 /*yield*/, mongoose.disconnect()];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Run if this file is executed directly
if (require.main === module) {
    cleanupDatabase();
}
