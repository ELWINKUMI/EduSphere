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
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var filename, filepath, fileBuffer, ext, contentType, fileError_1, error_1;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, params
                        // Basic security check
                    ];
                case 1:
                    filename = (_c.sent()).filename;
                    // Basic security check
                    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid filename' }, { status: 400 })];
                    }
                    filepath = path.join(process.cwd(), 'public/uploads/assignments', filename);
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, readFile(filepath)
                        // Get file extension to set appropriate content type
                    ];
                case 3:
                    fileBuffer = _c.sent();
                    ext = path.extname(filename).toLowerCase();
                    contentType = 'application/octet-stream';
                    switch (ext) {
                        case '.pdf':
                            contentType = 'application/pdf';
                            break;
                        case '.doc':
                            contentType = 'application/msword';
                            break;
                        case '.docx':
                            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                            break;
                        case '.txt':
                            contentType = 'text/plain';
                            break;
                        case '.jpg':
                        case '.jpeg':
                            contentType = 'image/jpeg';
                            break;
                        case '.png':
                            contentType = 'image/png';
                            break;
                        case '.gif':
                            contentType = 'image/gif';
                            break;
                    }
                    return [2 /*return*/, new NextResponse(fileBuffer, {
                            headers: {
                                'Content-Type': contentType,
                                'Content-Disposition': "attachment; filename=\"".concat(filename, "\""),
                                'Content-Length': fileBuffer.length.toString(),
                            },
                        })];
                case 4:
                    fileError_1 = _c.sent();
                    return [2 /*return*/, NextResponse.json({ error: 'File not found' }, { status: 404 })];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _c.sent();
                    console.error('Error downloading file:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
