import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Quiz from '@/models/Quiz'
import QuizSubmission from '@/models/QuizSubmission'
import Course from '@/models/Course'
import jwt from 'jsonwebtoken'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id: quizId } = await params
    
    // Get and verify token
    const authorization = request.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    if (decoded.role !== 'student') {
      return NextResponse.json({ message: 'Only students can submit quizzes' }, { status: 403 })
    }

    const body = await request.json()
    const { answers, submittedAt } = body

    // Find the quiz and verify it exists
    const quiz = await Quiz.findById(quizId).populate('course')
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 })
    }

    // Check if student is enrolled in the course
    const course = await Course.findOne({
      _id: quiz.course._id,
      students: decoded.userId
    })

    if (!course) {
      return NextResponse.json({ 
        message: 'You are not enrolled in the course for this quiz' 
      }, { status: 403 })
    }

    // Check if quiz is available
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    const endDate = new Date(quiz.endDate)
    
    if (now < startDate || now > endDate) {
      return NextResponse.json({ 
        message: 'Quiz is not currently available' 
      }, { status: 400 })
    }

    // Check if student has already submitted (and if multiple attempts are allowed)
    const existingSubmissions = await QuizSubmission.find({
      quiz: quizId,
      student: decoded.userId
    }).sort({ submittedAt: -1 })

    if (existingSubmissions.length >= quiz.attempts && quiz.attempts !== 999) {
      return NextResponse.json({ 
        message: 'You have exceeded the maximum number of attempts for this quiz' 
      }, { status: 400 })
    }

    // Calculate score
    let score = 0
    let maxScore = 0
    const submissionAnswers: any[] = []

    quiz.questions.forEach((question: any, index: number) => {
      maxScore += question.points
      const studentAnswer = answers[question._id]
      const correctAnswer = question.correctAnswer

      let isCorrect = false
      let pointsEarned = 0

      if (studentAnswer) {
        // For multiple choice and true/false, exact match
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
          if (studentAnswer === correctAnswer) {
            isCorrect = true
            pointsEarned = question.points
            score += question.points
          }
        } 
        // For short answer, give full points (manual grading can be implemented later)
        else if (question.type === 'short-answer') {
          isCorrect = true // Assume correct for now, manual grading needed
          pointsEarned = question.points
          score += question.points
        }
      }

      submissionAnswers.push({
        questionIndex: index,
        answer: studentAnswer || ''
      })
    })

    // Create the submission
    const submission = new QuizSubmission({
      quiz: quizId,
      student: decoded.userId,
      answers: submissionAnswers,
      score,
      maxScore,
      timeSpent: quiz.timeLimit, // TODO: Calculate actual time spent
      submittedAt: submittedAt || new Date(),
      isGraded: true // Auto-graded for MC and T/F
    })

    await submission.save()

    // Add submission to quiz's submissions array
    quiz.submissions.push(submission._id)
    await quiz.save()

    return NextResponse.json({
      message: 'Quiz submitted successfully',
      submission: {
        _id: submission._id,
        score,
        totalPoints: maxScore,
        submittedAt: submission.submittedAt,
        isGraded: submission.isGraded,
        answers: submission.answers
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
