"use client";
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
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
export default function RegisterPage() {
    var _this = this;
    var _a = useState(""), name = _a[0], setName = _a[1];
    var _b = useState(""), pin = _b[0], setPin = _b[1];
    var _c = useState("student"), role = _c[0], setRole = _c[1];
    var _d = useState(""), gradeLevel = _d[0], setGradeLevel = _d[1];
    var _e = useState(""), subjects = _e[0], setSubjects = _e[1];
    var _f = useState(""), grades = _f[0], setGrades = _f[1];
    var _g = useState(""), email = _g[0], setEmail = _g[1];
    var _h = useState(false), loading = _h[0], setLoading = _h[1];
    var _j = useState(""), userId = _j[0], setUserId = _j[1];
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    setUserId("");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/auth/register", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                name: name,
                                pin: pin,
                                role: role,
                                gradeLevel: role === "student" ? gradeLevel : undefined,
                                subjects: role === "teacher" ? subjects.split(",").map(function (s) { return s.trim(); }) : undefined,
                                grades: role === "teacher" ? grades.split(",").map(function (g) { return g.trim(); }) : undefined,
                                email: email,
                            }),
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    if (res.ok) {
                        setUserId(data.userId);
                        toast.success("Registration successful! Your ID: " + data.userId);
                    }
                    else {
                        toast.error(data.error || "Registration failed");
                    }
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    toast.error("Registration failed");
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="max-w-md mx-auto mt-12 p-8 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full Name" value={name} onChange={function (e) { return setName(e.target.value); }} required/>
        <Input label="5-Digit PIN" value={pin} onChange={function (e) { return setPin(e.target.value); }} maxLength={5} pattern="[0-9]{5}" type="password" required/>
        <Input label="Email (optional)" value={email} onChange={function (e) { return setEmail(e.target.value); }} type="email"/>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Role</label>
          <select value={role} onChange={function (e) { return setRole(e.target.value); }} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        {role === "student" && (<Input label="Grade Level" value={gradeLevel} onChange={function (e) { return setGradeLevel(e.target.value); }} required/>)}
        {role === "teacher" && (<>
            <Input label="Subjects (comma separated)" value={subjects} onChange={function (e) { return setSubjects(e.target.value); }} required/>
            <Input label="Grades (comma separated)" value={grades} onChange={function (e) { return setGrades(e.target.value); }} required/>
          </>)}
        <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {userId && (<div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-800 dark:text-green-300 text-center">
          <div className="font-bold">Registration Successful!</div>
          <div>Your Login ID: <span className="font-mono text-lg">{userId}</span></div>
          <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">Please save this ID. You will use it to log in.</div>
        </div>)}
    </div>);
}
