import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Quiz from '@/models/Quiz'
import QuizSubmission from '@/models/QuizSubmission'
import User from '@/models/User'
import Course from '@/models/Course'
import jwt from 'jsonwebtoken'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id: quizId } = await params

    // Get the authorization token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Find the quiz and populate necessary fields
    const quiz = await Quiz.findById(quizId)
      .populate('course', 'title subject gradeLevel')
      .populate('teacher', 'name')
      .lean()

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Find the student's submission for this quiz
    const submission = await QuizSubmission.findOne({
      quiz: quizId,
      student: decoded.userId
    }).lean()

    if (!submission) {
      return NextResponse.json(
        { error: 'No submission found for this quiz' },
        { status: 404 }
      )
    }

    // Check if results should be shown based on quiz settings
    const now = new Date()
    const endDate = new Date(Array.isArray(quiz) ? quiz[0]?.endDate : quiz.endDate)
    
    let canShowResults = false
    let message = ''

    const quizObj = Array.isArray(quiz) ? quiz[0] : quiz;

    switch (quizObj.showResults) {
      case 'immediately':
        canShowResults = true
        break
      case 'after-deadline':
        canShowResults = now >= endDate
        if (!canShowResults) {
          message = 'Results will be available after the quiz deadline'
        }
        break
      case 'manual':
        // For manual, we'll check if the submission is graded
        canShowResults = Array.isArray(submission) ? false : submission.isGraded
        if (!canShowResults) {
          message = 'Results are not yet available. Please wait for manual grading.'
        }
        break
      default:
        canShowResults = false
        message = 'Results are not available'
    }

    // If results cannot be shown, return limited information
    if (!canShowResults) {
      return NextResponse.json({
        quiz: {
          _id: quizObj._id,
          title: quizObj.title,
          description: quizObj.description,
          showResults: quizObj.showResults,
          endDate: quizObj.endDate,
          course: quizObj.course,
          teacher: quizObj.teacher
        },
        submission: Array.isArray(submission)
          ? undefined
          : {
              _id: submission._id,
              submittedAt: submission.submittedAt,
              timeSpent: submission.timeSpent
            },
        canShowResults: false,
        message
      })
    }

    // If results can be shown, return full details
    const quizData = {
      _id: quizObj._id,
      title: quizObj.title,
      description: quizObj.description,
      showResults: quizObj.showResults,
      endDate: quizObj.endDate,
      questions: quizObj.questions,
      course: quizObj.course,
      teacher: quizObj.teacher
    }

    const submissionObj = Array.isArray(submission) ? submission[0] : submission;
    const submissionData = submissionObj
      ? {
          _id: submissionObj._id,
          score: submissionObj.score,
          maxScore: submissionObj.maxScore,
          submittedAt: submissionObj.submittedAt,
          timeSpent: submissionObj.timeSpent,
          answers: submissionObj.answers,
          isGraded: submissionObj.isGraded,
          feedback: submissionObj.feedback
        }
      : undefined;

    return NextResponse.json({
      quiz: quizData,
      submission: submissionData,
      canShowResults: true,
      message: 'Results are available'
    })

  } catch (error) {
    console.error('Error fetching quiz results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
