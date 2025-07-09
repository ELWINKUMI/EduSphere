# Login Test Instructions

## Test the New Authentication System

### 1. Access Login Page
Navigate to: http://localhost:3000/auth/login

### 2. Test Teacher Login
Use any of these pre-seeded teacher credentials:

**John Smith**
- Name: `John Smith`
- PIN: `12345`

**Sarah Johnson**
- Name: `Sarah Johnson`
- PIN: `23456`

**Michael Brown**
- Name: `Michael Brown`
- PIN: `34567`

**Emily Davis**
- Name: `Emily Davis`
- PIN: `45678`

**David Wilson**
- Name: `David Wilson`
- PIN: `56789`

### 3. Expected Flow
1. Enter teacher name and PIN
2. Click "Sign In"
3. Should redirect to `/teacher/dashboard`
4. Should see the teacher dashboard with student management section

### 4. Test Student Creation
1. In the teacher dashboard, find "Manage Students" section
2. Click "Add Student"
3. Enter student name (e.g., "Alice Johnson")
4. Click "Generate Random PIN" or enter custom 5-digit PIN
5. Click "Create Student"
6. Student should appear in the list

### 5. Test Student Login
1. Open new browser tab/incognito window
2. Go to login page
3. Use the student credentials created by teacher
4. Should redirect to `/student/dashboard`

### 6. Troubleshooting
- If login fails, check browser console for errors
- Ensure MongoDB is running
- Verify the database contains the seeded teachers
- Check that JWT_SECRET is set in .env.local
