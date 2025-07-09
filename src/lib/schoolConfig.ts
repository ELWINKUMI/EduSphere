// Grade levels and their corresponding subjects
export const GRADE_LEVELS = {
  PRIMARY: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'],
  JHS: ['JHS 1', 'JHS 2', 'JHS 3'],
  SHS: ['SHS 1', 'SHS 2', 'SHS 3']
}

export const ALL_GRADES = [
  ...GRADE_LEVELS.PRIMARY,
  ...GRADE_LEVELS.JHS,
  ...GRADE_LEVELS.SHS
]

// Subjects for each school level
export const SUBJECTS_BY_LEVEL = {
  PRIMARY: [
    'Mathematics',
    'English Language',
    'Science',
    'Social Studies', 
    'Religious & Moral Education',
    'Creative Arts',
    'Physical Education',
    'Information & Communication Technology (ICT)',
    'French',
    'Ghanaian Language'
  ],
  
  JHS: [
    'Mathematics',
    'English Language',
    'Integrated Science',
    'Social Studies',
    'Religious & Moral Education',
    'Creative Arts & Design',
    'Physical Education',
    'Information & Communication Technology (ICT)',
    'French',
    'Ghanaian Language',
    'Pre-Technical Skills',
    'Career Technology'
  ],
  
  SHS: [
    // Core Subjects (All students)
    'Core Mathematics',
    'English Language',
    'Integrated Science',
    'Social Studies',
    
    // Elective Subjects (Based on program)
    // Science Programme
    'Elective Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    
    // Business Programme  
    'Business Management',
    'Financial Accounting',
    'Cost Accounting',
    'Economics',
    
    // General Arts Programme
    'Literature in English',
    'History',
    'Geography',
    'Government',
    'French',
    
    // Visual Arts Programme
    'Graphic Design',
    'Sculpture',
    'Painting',
    'Ceramics',
    
    // Home Economics Programme
    'Food & Nutrition',
    'Clothing & Textiles',
    'Management in Living',
    
    // Agricultural Programme
    'General Agriculture',
    'Animal Husbandry',
    'Crop Husbandry',
    
    // Technical Programme
    'Technical Drawing',
    'Metalwork',
    'Woodwork',
    'Building Construction',
    'Electronics',
    'Auto Mechanics'
  ]
}

// Helper function to get subjects for a specific grade
export function getSubjectsForGrade(gradeLevel: string): string[] {
  if (GRADE_LEVELS.PRIMARY.includes(gradeLevel)) {
    return SUBJECTS_BY_LEVEL.PRIMARY
  } else if (GRADE_LEVELS.JHS.includes(gradeLevel)) {
    return SUBJECTS_BY_LEVEL.JHS
  } else if (GRADE_LEVELS.SHS.includes(gradeLevel)) {
    return SUBJECTS_BY_LEVEL.SHS
  }
  return []
}

// Helper function to get school level from grade
export function getSchoolLevel(gradeLevel: string): 'PRIMARY' | 'JHS' | 'SHS' | null {
  if (GRADE_LEVELS.PRIMARY.includes(gradeLevel)) return 'PRIMARY'
  if (GRADE_LEVELS.JHS.includes(gradeLevel)) return 'JHS'
  if (GRADE_LEVELS.SHS.includes(gradeLevel)) return 'SHS'
  return null
}

// Helper function to check if a teacher can teach a subject to a grade
export function canTeachSubjectToGrade(subject: string, gradeLevel: string): boolean {
  const allowedSubjects = getSubjectsForGrade(gradeLevel)
  return allowedSubjects.includes(subject)
}
