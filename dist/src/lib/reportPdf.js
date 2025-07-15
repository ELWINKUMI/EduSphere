// Generate a PDF for all subjects/grades for a student
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
export function generateAllSubjectsReportPdf(reports) {
    return __awaiter(this, void 0, void 0, function () {
        var student, pdfDoc, font, cover, y, drawText, page, tableY, leftMargin, colWidths, headers, x, i, _i, reports_1, report, course, totalStudents, _a, row, i, newPage, i, pdfBytes;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!reports || reports.length === 0)
                        throw new Error('No reports provided');
                    student = reports[0].student;
                    return [4 /*yield*/, PDFDocument.create()];
                case 1:
                    pdfDoc = _d.sent();
                    return [4 /*yield*/, pdfDoc.embedFont(StandardFonts.Helvetica)];
                case 2:
                    font = _d.sent();
                    cover = pdfDoc.addPage([595, 842]);
                    y = 800;
                    drawText = function (page, text, size, color, x) {
                        if (size === void 0) { size = 18; }
                        if (color === void 0) { color = rgb(0, 0, 0); }
                        if (x === void 0) { x = 50; }
                        page.drawText(text, { x: x, y: y, size: size, font: font, color: color });
                        y -= size + 10;
                    };
                    drawText(cover, 'EduSphere Academic Report', 28, rgb(0.4, 0.2, 0.7), 50);
                    y -= 10;
                    drawText(cover, "Student: ".concat(student.name));
                    drawText(cover, "Email: ".concat(student.email));
                    drawText(cover, "Date: ".concat(new Date().toLocaleDateString()));
                    drawText(cover, "Total Subjects: ".concat(reports.length));
                    y -= 10;
                    drawText(cover, '--- Subject Reports ---', 16, rgb(0.2, 0.2, 0.2));
                    page = pdfDoc.addPage([595, 842]);
                    tableY = 780;
                    leftMargin = 40;
                    colWidths = [90, 60, 60, 60, 60, 60, 80, 80];
                    headers = [
                        'Subject',
                        'Class',
                        'Title',
                        'Score',
                        'Grade',
                        'Position',
                        'No. on Roll',
                        'Date',
                    ];
                    x = leftMargin;
                    for (i = 0; i < headers.length; i++) {
                        page.drawText(headers[i], { x: x, y: tableY, size: 12, font: font, color: rgb(0.2, 0.2, 0.5) });
                        x += colWidths[i];
                    }
                    tableY -= 22;
                    _i = 0, reports_1 = reports;
                    _d.label = 3;
                case 3:
                    if (!(_i < reports_1.length)) return [3 /*break*/, 9];
                    report = reports_1[_i];
                    course = report.course;
                    // Defensive: If course is missing, skip row
                    if (!course)
                        return [3 /*break*/, 8];
                    totalStudents = 'N/A';
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, StudentReport.countDocuments({ course: course._id })];
                case 5:
                    totalStudents = (_c = (_b = (_d.sent())) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : 'N/A';
                    return [3 /*break*/, 7];
                case 6:
                    _a = _d.sent();
                    return [3 /*break*/, 7];
                case 7:
                    row = [
                        course.subject || 'N/A',
                        course.gradeLevel || 'N/A',
                        course.title || 'N/A',
                        typeof report.finalScore === 'number' ? report.finalScore.toFixed(2) : 'N/A',
                        report.grade || 'N/A',
                        report.position !== undefined && report.position !== null ? report.position.toString() : 'N/A',
                        totalStudents,
                        report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A',
                    ];
                    x = leftMargin;
                    for (i = 0; i < row.length; i++) {
                        page.drawText(row[i], { x: x, y: tableY, size: 11, font: font, color: rgb(0, 0, 0) });
                        x += colWidths[i];
                    }
                    tableY -= 18;
                    // If tableY is too low, add a new page and reset tableY
                    if (tableY < 60) {
                        tableY = 780;
                        x = leftMargin;
                        newPage = pdfDoc.addPage([595, 842]);
                        // Redraw headers on new page
                        for (i = 0; i < headers.length; i++) {
                            newPage.drawText(headers[i], { x: x, y: tableY, size: 12, font: font, color: rgb(0.2, 0.2, 0.5) });
                            x += colWidths[i];
                        }
                        tableY -= 22;
                        page = newPage;
                    }
                    _d.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 3];
                case 9:
                    // Footer
                    page.drawText('Generated by EduSphere', { x: leftMargin, y: 40, size: 10, font: font, color: rgb(0.5, 0.5, 0.5) });
                    return [4 /*yield*/, pdfDoc.save()];
                case 10:
                    pdfBytes = _d.sent();
                    return [2 /*return*/, pdfBytes];
            }
        });
    });
}
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import StudentReport from '@/models/StudentReport';
export function generateStudentReportPdf(reportId) {
    return __awaiter(this, void 0, void 0, function () {
        var report, student, course, totalStudents, pdfDoc, page, font, y, drawText, pdfBytes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, StudentReport.findById(reportId).populate('student course')];
                case 1:
                    report = _a.sent();
                    if (!report)
                        throw new Error('Report not found');
                    student = report.student;
                    course = report.course;
                    return [4 /*yield*/, StudentReport.countDocuments({ course: course._id })];
                case 2:
                    totalStudents = _a.sent();
                    return [4 /*yield*/, PDFDocument.create()];
                case 3:
                    pdfDoc = _a.sent();
                    page = pdfDoc.addPage([595, 842]);
                    return [4 /*yield*/, pdfDoc.embedFont(StandardFonts.Helvetica)];
                case 4:
                    font = _a.sent();
                    y = 800;
                    drawText = function (text, size, color, x) {
                        if (size === void 0) { size = 14; }
                        if (color === void 0) { color = rgb(0, 0, 0); }
                        if (x === void 0) { x = 50; }
                        page.drawText(text, { x: x, y: y, size: size, font: font, color: color });
                        y -= size + 8;
                    };
                    // Header
                    drawText('EduSphere Academic Report', 20, rgb(0.4, 0.2, 0.7));
                    y -= 10;
                    drawText("Student: ".concat(student.name));
                    drawText("Class: ".concat(course.gradeLevel));
                    drawText("Subject: ".concat(course.subject));
                    drawText("Date: ".concat(new Date().toLocaleDateString()));
                    drawText("Total Students: ".concat(totalStudents));
                    drawText("Class Position: ".concat(report.position));
                    drawText("Final Score: ".concat(report.finalScore.toFixed(2)));
                    drawText("Grade: ".concat(report.grade), 18, rgb(0.2, 0.5, 0.2));
                    y -= 10;
                    drawText('--- Breakdown ---', 14, rgb(0.2, 0.2, 0.2));
                    // Optionally add more breakdown details here
                    if (report.manualAdjustments && (report.manualAdjustments.score || report.manualAdjustments.grade)) {
                        drawText('Manual Adjustments:', 12, rgb(0.7, 0.2, 0.2));
                        if (report.manualAdjustments.score)
                            drawText("Adjusted Score: ".concat(report.manualAdjustments.score));
                        if (report.manualAdjustments.grade)
                            drawText("Adjusted Grade: ".concat(report.manualAdjustments.grade));
                    }
                    // Footer
                    y = 60;
                    drawText('Generated by EduSphere', 10, rgb(0.5, 0.5, 0.5));
                    return [4 /*yield*/, pdfDoc.save()];
                case 5:
                    pdfBytes = _a.sent();
                    return [2 /*return*/, pdfBytes];
            }
        });
    });
}
