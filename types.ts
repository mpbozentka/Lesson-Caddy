
export interface Student {
  id: string;
  fullName: string;
  createdAt: Date;
}

export interface Recording {
  id: string;
  blob: Blob;
  duration: number;
  timestamp: Date;
  base64?: string;
}

export interface Lesson {
  id: string;
  studentId: string;
  title: string;
  date: Date;
  recordings: Recording[];
  summary?: string;
  notes?: string;
  status: 'active' | 'completed' | 'summarizing';
}

export interface SummaryResponse {
  summary: string;
  drills: string[];
  keyTakeaways: string[];
}
