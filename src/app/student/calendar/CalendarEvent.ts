export interface CalendarEvent {
  _id: string;
  type: 'assignment' | 'quiz';
  title: string;
  dueDate: string; // ISO string
  courseName: string;
  link: string;
}
