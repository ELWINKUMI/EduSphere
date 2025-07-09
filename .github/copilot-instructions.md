<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# EduSphere - Learning Management System

This is a comprehensive Learning Management System built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS.

## Project Overview

EduSphere is designed for educational institutions to manage:
- Course creation and enrollment
- Assignment management with deadlines
- Timed quizzes with auto-submission
- File sharing and resource management
- Student-teacher communication
- Grading and feedback systems
- Real-time notifications and announcements

## Architecture & Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based custom authentication
- **Styling**: Tailwind CSS with custom components
- **File Upload**: Cloudinary integration (planned)
- **State Management**: React Context for authentication
- **UI Components**: Custom components with Lucide icons

## Code Style & Conventions

### TypeScript
- Use strict TypeScript with proper interfaces
- Define clear types for all API responses
- Use proper generics where appropriate
- Avoid `any` type, prefer `unknown` if needed

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for prop types
- Follow the composition pattern over inheritance

### Next.js Patterns
- Use App Router for all new routes
- Implement proper loading and error states
- Use Server Components where possible
- Client Components only when necessary (interactivity, hooks, browser APIs)

### Database Models
- Use Mongoose schemas with proper validation
- Implement proper indexing for performance
- Use proper relationships between models
- Include timestamps and soft delete patterns

### API Design
- RESTful API design principles
- Proper HTTP status codes
- Consistent error handling
- Input validation and sanitization
- JWT authentication middleware

### File Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Auth-related pages
│   ├── teacher/           # Teacher-specific pages
│   ├── student/           # Student-specific pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── providers/        # Context providers
│   └── [feature]/        # Feature-specific components
├── lib/                   # Utility functions
├── models/               # Database models
└── types/                # TypeScript type definitions
```

## Key Features Implementation

### Authentication System
- JWT-based authentication with secure tokens
- Role-based access control (teacher/student)
- Protected routes with middleware
- Token refresh mechanism

### Quiz System
- Real-time countdown timer
- Auto-submission when time expires
- Multiple question types (multiple choice, true/false, short answer)
- Configurable result display (immediate, after deadline, manual)
- Progress tracking and question navigation

### Assignment Management
- File upload support
- Deadline tracking with notifications
- Submission tracking and grading
- Feedback system

### Real-time Features
- Live notifications for new announcements
- Real-time quiz timer updates
- Instant feedback on submissions

## Development Guidelines

### State Management
- Use React Context for global state (authentication, theme)
- Use local state (useState) for component-specific state
- Implement proper loading and error states
- Use optimistic updates where appropriate

### Error Handling
- Implement proper error boundaries
- Use try-catch blocks in async operations
- Provide meaningful error messages to users
- Log errors for debugging

### Performance
- Implement proper code splitting
- Use React.memo for expensive components
- Optimize database queries with proper indexing
- Implement caching strategies

### Security
- Validate all user inputs
- Sanitize data before database operations
- Use environment variables for sensitive data
- Implement proper CORS policies
- Use HTTPS in production

### Testing (Future)
- Write unit tests for utility functions
- Integration tests for API endpoints
- Component testing with React Testing Library
- E2E tests for critical user flows

## Database Schema

### Key Models
- **User**: Teachers and students with role-based permissions
- **Course**: Course management with enrollment codes
- **Assignment**: Assignment creation with deadlines and submissions
- **Quiz**: Timed quizzes with auto-submission
- **Submission**: Student assignment submissions with grading
- **QuizSubmission**: Quiz attempts with scoring
- **Resource**: File sharing and resource management
- **Announcement**: Course and global announcements

### Relationships
- Users can have multiple courses (many-to-many)
- Courses belong to teachers (one-to-many)
- Assignments/Quizzes belong to courses (one-to-many)
- Submissions link students to assignments (many-to-many)

## Environment Variables

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `NEXTAUTH_SECRET`: Next.js auth secret
- `CLOUDINARY_*`: File upload configuration
- `EMAIL_*`: Email notification settings

## Code Quality

- Use ESLint for code linting
- Follow Prettier for code formatting
- Use TypeScript strict mode
- Implement proper component documentation
- Use meaningful variable and function names
- Keep functions small and focused

## Future Enhancements

- Socket.io for real-time features
- Mobile app with React Native
- Advanced analytics and reporting
- Video streaming integration
- AI-powered features (auto-grading, content suggestions)
- Multi-language support
- Advanced accessibility features
