# EduSphere - Learning Management System

EduSphere is a comprehensive Learning Management System (LMS) built with Next.js, TypeScript, and MongoDB. It provides a modern, intuitive platform for educational institutions to manage courses, assignments, quizzes, and student-teacher interactions.

## 🌟 Features

### For Teachers
- **Course Management**: Create and manage courses with unique enrollment codes
- **Assignment System**: Create assignments with start/due dates and file attachments
- **Timed Quizzes**: Interactive quizzes with countdown timers and auto-submission
- **Grading & Feedback**: Comprehensive grading system with detailed feedback
- **Resource Sharing**: Upload and share files (PDFs, videos, documents, etc.)
- **Announcements**: Create priority-based announcements for students
- **Analytics Dashboard**: Track student progress and performance
- **Real-time Notifications**: Stay updated with student submissions

### For Students
- **Course Enrollment**: Join courses using enrollment codes
- **Assignment Submission**: Submit assignments with file attachments
- **Interactive Quizzes**: Take timed quizzes with automatic submission
- **Resource Access**: Download shared course materials
- **Progress Tracking**: Monitor academic progress and grades
- **Notification System**: Receive important updates and announcements
- **Dashboard Overview**: Centralized view of all academic activities

### Advanced Features
- **Auto-Submit Quizzes**: Quizzes automatically submit when time expires
- **Result Display Control**: Teachers can control when quiz results are shown
- **File Upload System**: Support for various file types with size limits
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live notifications and updates
- **Grade Analytics**: Detailed performance analytics
- **Discussion Forums**: Course-specific discussion areas (planned)
- **Calendar Integration**: Academic calendar with important dates (planned)

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS
- **File Upload**: Cloudinary integration
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EduSphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_SECRET=your-super-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/edusphere
   
   # Cloudinary (for file uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Email Configuration (for notifications)
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_FROM=your-email@gmail.com
   
   # JWT Secret
   JWT_SECRET=your-jwt-secret-key
   
   # File Upload Settings
   MAX_FILE_SIZE=50mb
   ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,mp4,mp3,jpg,jpeg,png,gif
   ```

4. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
EduSphere/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── courses/       # Course management
│   │   │   ├── assignments/   # Assignment handling
│   │   │   └── quizzes/       # Quiz operations
│   │   ├── auth/              # Authentication pages
│   │   ├── teacher/           # Teacher dashboard & features
│   │   ├── student/           # Student dashboard & features
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   │   ├── providers/         # Context providers
│   │   ├── quiz/              # Quiz-related components
│   │   └── ui/                # UI components
│   ├── lib/                   # Utility libraries
│   │   └── mongodb.ts         # Database connection
│   └── models/                # MongoDB schemas
│       ├── User.ts
│       ├── Course.ts
│       ├── Assignment.ts
│       ├── Quiz.ts
│       └── ...
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎯 Usage Guide

### Getting Started

1. **Create an Account**
   - Visit the homepage
   - Choose "I'm a Teacher" or "I'm a Student"
   - Fill in your details and register

2. **For Teachers**
   - Access the teacher dashboard
   - Create your first course
   - Add students using the course enrollment code
   - Start creating assignments and quizzes

3. **For Students**
   - Access the student dashboard
   - Join courses using enrollment codes provided by teachers
   - View assignments and take quizzes
   - Track your progress and grades

### Key Features Guide

#### Creating a Quiz (Teachers)
1. Navigate to "Create Quiz" from the dashboard
2. Set quiz title, description, and time limit
3. Add questions (multiple choice, true/false, short answer)
4. Configure result display settings:
   - **Immediately**: Students see results right after submission
   - **After Deadline**: Results shown after quiz closes
   - **Manual**: Teacher controls when to release results
5. Set start and end dates
6. Publish the quiz

#### Taking a Quiz (Students)
1. Access available quizzes from your dashboard
2. Click "Start Quiz" when ready
3. Answer questions within the time limit
4. Timer shows warnings at 5 minutes and 1 minute remaining
5. Quiz auto-submits when time expires
6. View results based on teacher's settings

#### File Sharing
- Teachers can upload various file types
- Supported formats: PDF, DOC, XLS, PPT, images, videos
- Students can download shared resources
- File size limits apply (configurable)

## 🔧 Configuration

### File Upload Settings
Edit `.env.local` to configure file upload limits:
```env
MAX_FILE_SIZE=50mb
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,mp4,mp3,jpg,jpeg,png,gif
```

### Email Notifications
Configure SMTP settings for automated notifications:
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative platform with good Next.js support
- **Railway**: Great for full-stack applications
- **Digital Ocean**: VPS deployment option

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Course Management
- `GET /api/courses` - List user's courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/[id]` - Update course
- `DELETE /api/courses/[id]` - Delete course

### Quiz System
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes/[id]` - Get quiz details
- `POST /api/quizzes/[id]/submit` - Submit quiz answers

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify MongoDB is running
   - Check connection string in `.env.local`
   - Ensure network connectivity

2. **File Upload Issues**
   - Check Cloudinary configuration
   - Verify file size limits
   - Ensure proper file types

3. **Authentication Problems**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Database powered by [MongoDB](https://mongodb.com/)

## 📞 Support

For support, email support@edusphere.com or join our Slack channel.

---

Made with ❤️ for education
