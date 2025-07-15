'use client';
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
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';
export default function AnnouncementManagement() {
    var _this = this;
    var user = useAuth().user;
    var _a = useState([]), announcements = _a[0], setAnnouncements = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), editing = _c[0], setEditing = _c[1];
    var _d = useState({
        title: '',
        content: '',
        isPublished: true,
        priority: 'normal'
    }), editForm = _d[0], setEditForm = _d[1];
    var _e = useState(false), saving = _e[0], setSaving = _e[1];
    var _f = useState(null), deletingId = _f[0], setDeletingId = _f[1];
    useEffect(function () {
        fetchAnnouncements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var fetchAnnouncements = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/teacher/announcements', {
                            headers: { 'Authorization': "Bearer ".concat(token) }
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    setAnnouncements(data.announcements || []);
                    return [3 /*break*/, 5];
                case 4:
                    toast.error('Failed to fetch announcements');
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    toast.error('Failed to fetch announcements');
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleEdit = function (a) {
        setEditing(a);
        setEditForm({
            title: a.title,
            content: a.content,
            isPublished: a.isPublished,
            priority: a.priority || 'normal'
        });
    };
    var handleEditChange = function (e) {
        var _a;
        setEditForm(__assign(__assign({}, editForm), (_a = {}, _a[e.target.name] = e.target.value, _a)));
    };
    var handleEditCheckbox = function (e) {
        var _a;
        setEditForm(__assign(__assign({}, editForm), (_a = {}, _a[e.target.name] = e.target.checked, _a)));
    };
    var handleEditSave = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var token, res, err, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    if (!editing)
                        return [2 /*return*/];
                    setSaving(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/announcements/".concat(editing._id), {
                            method: 'PATCH',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(editForm)
                        })];
                case 2:
                    res = _b.sent();
                    if (!res.ok) return [3 /*break*/, 3];
                    toast.success('Announcement updated');
                    setEditing(null);
                    fetchAnnouncements();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    err = _b.sent();
                    toast.error(err.message || 'Failed to update');
                    _b.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    _a = _b.sent();
                    toast.error('Failed to update');
                    return [3 /*break*/, 8];
                case 7:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var token, res, err, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!window.confirm('Are you sure you want to delete this announcement?'))
                        return [2 /*return*/];
                    setDeletingId(id);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/announcements/".concat(id), {
                            method: 'DELETE',
                            headers: { 'Authorization': "Bearer ".concat(token) }
                        })];
                case 2:
                    res = _b.sent();
                    if (!res.ok) return [3 /*break*/, 3];
                    toast.success('Announcement deleted');
                    setAnnouncements(function (prev) { return prev.filter(function (a) { return a._id !== id; }); });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    err = _b.sent();
                    toast.error(err.message || 'Failed to delete');
                    _b.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    _a = _b.sent();
                    toast.error('Failed to delete');
                    return [3 /*break*/, 8];
                case 7:
                    setDeletingId(null);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading announcements...</div>;
    }
    return (<div className="mb-12">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Announcements</h2>
      <div className="space-y-4">
        {announcements.length === 0 && <div className="text-gray-500 dark:text-gray-400">No announcements yet.</div>}
        {announcements.map(function (a) { return (<div key={a._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between transition-colors duration-200">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{a.content}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Published: {a.isPublished ? 'Yes' : 'No'} | {new Date(a.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center space-x-2 mt-3 md:mt-0">
              <button onClick={function () { return handleEdit(a); }} className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                Edit
              </button>
              <button onClick={function () { return handleDelete(a._id); }} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600" disabled={deletingId === a._id}>
                {deletingId === a._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>); })}
      </div>
      {/* Edit Modal */}
      {editing && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={handleEditSave} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded w-full max-w-md p-6 relative transition-colors duration-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Edit Announcement</h3>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Title</label>
            <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 mb-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" required/>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Content</label>
            <textarea name="content" value={editForm.content} onChange={handleEditChange} className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 mb-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" rows={4} required/>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Priority</label>
            <select name="priority" value={editForm.priority} onChange={handleEditChange} className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 mb-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <label className="flex items-center mb-3 text-gray-700 dark:text-gray-200">
              <input type="checkbox" name="isPublished" checked={!!editForm.isPublished} onChange={handleEditCheckbox} className="mr-2"/>
              Published
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={function () { return setEditing(null); }} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>)}
    </div>);
}
