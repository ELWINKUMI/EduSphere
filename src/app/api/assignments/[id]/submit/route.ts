import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Assignment from '@/models/Assignment'
import Submission from '@/models/Submission'
import User from '@/models/User'
import Course from '@/models/Course'
import { writeFile } from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id: assignmentId } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId)
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(assignment.course)
    const studentIdStr = user._id.toString();
    const isEnrolled = Array.isArray(course?.students) &&
      course.students.some((sid: any) => sid.toString() === studentIdStr);
    if (!course || !isEnrolled) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })
    }

    // Check if assignment is still active and not overdue
    if (!assignment.isActive) {
      return NextResponse.json({ error: 'Assignment is no longer active' }, { status: 400 })
    }

    if (new Date() > new Date(assignment.dueDate)) {
      return NextResponse.json({ error: 'Assignment deadline has passed' }, { status: 400 })
    }

    // Attempts logic: fetch existing submission and calculate next attempt count
    const attemptsAllowed = assignment.attempts ?? 1;
    const attemptsUnlimited = attemptsAllowed === 0 || attemptsAllowed === 999;

    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: user._id
    });

    let currentAttemptCount = submission ? (submission.attemptCount || 1) : 0;
    let nextAttemptCount = currentAttemptCount + 1;

    // Check against the NEXT attempt count, not current
    if (!attemptsUnlimited && nextAttemptCount > attemptsAllowed) {
      return NextResponse.json({
        error: 'You have exceeded the maximum number of attempts for this assignment',
        attemptsUsed: currentAttemptCount,
        attemptsAllowed,
        attemptsRemaining: 0
      }, { status: 400 })
    }

    // Parse form data
    const formData = await request.formData()
    const content = formData.get('content') as string || ''
    const files = formData.getAll('files') as File[]

    // Validate based on submission type
    if (assignment.submissionType === 'text' && !content.trim()) {
      return NextResponse.json({ error: 'Text content is required for this assignment' }, { status: 400 })
    }
    if (assignment.submissionType === 'file' && files.length === 0) {
      return NextResponse.json({ error: 'File upload is required for this assignment' }, { status: 400 })
    }
    if (assignment.submissionType === 'both' && !content.trim() && files.length === 0) {
      return NextResponse.json({ error: 'Please provide either text content or upload files' }, { status: 400 })
    }

    // Handle file uploads
    const uploadedFiles: string[] = []
    if (files.length > 0) {
      for (const file of files) {
        if (file && file.size > 0) {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const filename = `${Date.now()}-${user._id}-${file.name}`
          const filepath = path.join(process.cwd(), 'public/uploads/submissions', filename)
          const uploadDir = path.dirname(filepath)
          const fs = await import('fs')
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
          }
          await writeFile(filepath, buffer)
          uploadedFiles.push(filename)
        }
      }
    }

    // --- Updated resubmission logic ---
    if (!submission) {
      // First attempt — create new
      submission = await Submission.create({
        assignment: assignmentId,
        student: user._id,
        content: content.trim(),
        files: uploadedFiles,
        submittedAt: new Date(),
        isLate: new Date() > new Date(assignment.dueDate),
        isGraded: false,
        attemptCount: 1
      });
    } else {
      // Additional attempt — only if allowed
      const currentAttempts = submission.attemptCount || 1;

      if (!attemptsUnlimited && currentAttempts >= attemptsAllowed) {
        return NextResponse.json({
          error: 'You have exceeded the maximum number of attempts for this assignment',
          attemptsUsed: currentAttempts,
          attemptsAllowed,
          attemptsRemaining: 0
        }, { status: 400 });
      }

      // Update attempt
      submission.content = content.trim();
      submission.files = uploadedFiles;
      submission.submittedAt = new Date();
      submission.isLate = new Date() > new Date(assignment.dueDate);
      submission.isGraded = false;
      submission.attemptCount = currentAttempts + 1;

      await submission.save();
    }

    // Add submission to assignment's submissions array if not already present
    if (!assignment.submissions.some((id: any) => id.toString() === submission._id.toString())) {
      assignment.submissions.push(submission._id)
      await assignment.save()
    }

    // latestSubmission is always the upserted one
    const latestSubmission = submission;
    const bestScore = typeof submission.grade === 'number' ? submission.grade : 0;
    const bestSubmission = submission;

    return NextResponse.json({
      success: true,
      message: 'Assignment submitted successfully',
      submission: {
        _id: submission._id,
        content: submission.content,
        files: submission.files,
        submittedAt: submission.submittedAt,
        isLate: submission.isLate,
        isGraded: submission.isGraded,
        grade: submission.grade,
        feedback: submission.feedback,
        gradedAt: submission.gradedAt,
        attemptCount: submission.attemptCount
      },
      attemptsUsed: submission.attemptCount,
      attemptsAllowed: attemptsUnlimited ? 'unlimited' : attemptsAllowed,
      attemptsRemaining: attemptsUnlimited ? 'unlimited' : Math.max(0, attemptsAllowed - submission.attemptCount),
      bestScore,
      bestSubmissionId: bestSubmission._id,
      latestSubmission
    })

  } catch (error: any) {
    console.error('Error submitting assignment:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}