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

    // Count attempts by storing a counter in the Quiz model's submissions array for this student/quiz
    // Since we now delete all but the best submission, we need a persistent way to track attempts
    // We'll use a separate Attempts collection or a field in User, but for now, let's use a hidden field in QuizSubmission
    // We'll keep a 'attemptsUsed' field in the best submission, incremented on each attempt
    // Count attempts by counting all previous submissions for this quiz/student
    const previousSubmissions = await QuizSubmission.find({ quiz: quizId, student: decoded.userId });
    const attemptsUsed = previousSubmissions.length;
    const attemptsAllowed = quiz.attempts;
    const attemptsRemaining = attemptsAllowed === 999 ? Infinity : attemptsAllowed - attemptsUsed;

    if (attemptsAllowed !== 999 && attemptsUsed >= attemptsAllowed) {
      return NextResponse.json({ 
        message: 'You have exceeded the maximum number of attempts for this quiz',
        attemptsUsed,
        attemptsAllowed,
        attemptsRemaining: 0
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

      if (studentAnswer !== undefined && studentAnswer !== null) {
        // For multiple choice and true/false, exact match
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
          if (studentAnswer === correctAnswer) {
            isCorrect = true
            pointsEarned = question.points
            score += question.points
          }
        } 
        // For short answer, compare trimmed, case-insensitive
        else if (question.type === 'short-answer') {
          if (
            typeof studentAnswer === 'string' &&
            typeof correctAnswer === 'string' &&
            studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
          ) {
            isCorrect = true
            pointsEarned = question.points
            score += question.points
          }
        }
      }

      submissionAnswers.push({
        questionIndex: index,
        answer: studentAnswer || ''
      })
    })


    // Create the submission, incrementing attemptNumber
    const submission = new QuizSubmission({
      quiz: quizId,
      student: decoded.userId,
      answers: submissionAnswers,
      score,
      maxScore,
      timeSpent: quiz.timeLimit, // TODO: Calculate actual time spent
      submittedAt: submittedAt || new Date(),
      isGraded: true, // Auto-graded for MC and T/F
      attemptNumber: attemptsUsed + 1
    });
    await submission.save();

    // Add submission to quiz's submissions array
    quiz.submissions.push(submission._id)
    await quiz.save()


    // Find the best score among all attempts (including this one)
    const allSubmissions = await QuizSubmission.find({ quiz: quizId, student: decoded.userId });
    let bestScore = 0;
    let best = submission;
    for (const sub of allSubmissions) {
      if (sub.score > bestScore) {
        bestScore = sub.score;
        best = sub;
      }
    }

    // No deletion: keep all submissions for attempt tracking
    // Optionally, update the quiz.submissions array to include all submissions
    if (!quiz.submissions.includes(submission._id)) {
      quiz.submissions.push(submission._id);
      await quiz.save();
    }

    return NextResponse.json({
      message: 'Quiz submitted successfully',
      submission: {
        _id: best._id,
        score: best.score,
        totalPoints: best.maxScore,
        submittedAt: best.submittedAt,
        isGraded: best.isGraded,
        answers: best.answers,
        attemptNumber: best.attemptNumber
      },
      attemptsUsed: allSubmissions.length,
      attemptsAllowed,
      attemptsRemaining: attemptsAllowed === 999 ? Infinity : attemptsAllowed - allSubmissions.length,
      bestScore,
      bestSubmissionId: best._id
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
