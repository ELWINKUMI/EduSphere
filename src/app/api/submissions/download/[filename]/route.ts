import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import Submission from '@/models/Submission'
import Assignment from '@/models/Assignment'
import Course from '@/models/Course'
import connectDB from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    await connectDB()
    
    const { filename } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.nextUrl.searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    // Allow both students and teachers to download submission files
    // Students can download their own submissions, teachers can download their students' submissions
    if (user.role !== 'student' && user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    // Find the submission that contains this file
    const submission = await Submission.findOne({ files: filename })
      .populate('assignment')
      .populate('student', 'name email')
    
    if (!submission) {
      console.log(`Submission not found for file: ${filename}`)
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    
    console.log(`User ${user.name} (${user.role}) requesting file: ${filename}`)
    console.log(`File belongs to submission by: ${submission.student.name}`)
    
    // Authorization check
    if (user.role === 'student') {
      // Students can only download their own submission files
      if (submission.student._id.toString() !== user._id.toString()) {
        console.log(`Student authorization failed: ${user._id} !== ${submission.student._id}`)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    } else if (user.role === 'teacher') {
      // Teachers can only download submission files from their courses
      const assignment = await Assignment.findById(submission.assignment._id)
      if (!assignment || assignment.teacher.toString() !== user._id.toString()) {
        console.log(`Teacher authorization failed: assignment teacher ${assignment?.teacher} !== ${user._id}`)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
      console.log(`Teacher authorized to download submission file from their assignment`)
    }
    
    // Basic security check
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const filepath = path.join(process.cwd(), 'public/uploads/submissions', filename)
    
    try {
      const fileBuffer = await readFile(filepath)
      
      // Get file extension to set appropriate content type
      const ext = path.extname(filename).toLowerCase()
      let contentType = 'application/octet-stream'
      
      switch (ext) {
        case '.pdf':
          contentType = 'application/pdf'
          break
        case '.doc':
          contentType = 'application/msword'
          break
        case '.docx':
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          break
        case '.txt':
          contentType = 'text/plain'
          break
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg'
          break
        case '.png':
          contentType = 'image/png'
          break
        case '.gif':
          contentType = 'image/gif'
          break
        case '.zip':
          contentType = 'application/zip'
          break
        case '.ppt':
          contentType = 'application/vnd.ms-powerpoint'
          break
        case '.pptx':
          contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          break
        case '.xls':
          contentType = 'application/vnd.ms-excel'
          break
        case '.xlsx':
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          break
      }

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      })
    } catch (fileError) {
      console.error('File not found:', filepath, fileError)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

  } catch (error) {
    console.error('Error downloading submission file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
