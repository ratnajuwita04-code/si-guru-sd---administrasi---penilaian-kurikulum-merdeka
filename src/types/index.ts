export type Gender = 'L' | 'P';

export type AttendanceStatus = 'H' | 'S' | 'I' | 'A'; // Hadir, Sakit, Izin, Alpa

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  name: string;
  gender: Gender;
  birthPlace: string;
  birthDate: string;
  parentName: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface DailyAttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface DayAttendance {
  date: string; // YYYY-MM-DD
  records: Record<string, AttendanceStatus>; // studentId -> status
  notes?: Record<string, string>; // studentId -> note
}

export interface LearningObjective {
  id: string;
  code: string; // e.g. "TP 1.1"
  description: string;
  scope: string; // Lingkup Materi
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  kkm: number; // Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) e.g. 75
  category: 'Wajib' | 'Muatan Lokal';
  objectives: LearningObjective[];
}

export interface StudentScore {
  studentId: string;
  subjectId: string;
  formativeScores: Record<string, number>; // objectiveId -> score (0-100)
  summativeMaterialScores: Record<string, number>; // scope -> score (0-100)
  summativeExamScore?: number; // Nilai SAS / Sumatif Akhir Semester
}

export interface TeachingJournalEntry {
  id: string;
  date: string;
  timeSlot: string; // e.g. "07.30 - 09.15 (Jam ke 1-2)"
  subjectId: string;
  subjectName: string;
  topic: string;
  activities: string;
  reflection: string;
  attendanceCount: {
    hadir: number;
    total: number;
  };
  status: 'Terlaksana' | 'Tertunda' | 'Pengganti';
}

export interface QuizQuestion {
  id: string;
  subjectId: string;
  grade: number; // 1-6
  topic: string;
  type: 'pilihan_ganda' | 'uraian';
  question: string;
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D' or sample answer for essay
  explanation: string;
  difficulty: 'Mudah' | 'Sedang' | 'HOTS';
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: number;
  semester: 1 | 2;
  academicYear: string;
  timeAllocation: string; // e.g. "2 x 35 Menit (1 Pertemuan)"
  learningPhase: 'Fase A (Kelas 1-2)' | 'Fase B (Kelas 3-4)' | 'Fase C (Kelas 5-6)';
  pancasilaDimensions: string[]; // Profil Pelajar Pancasila
  targetCompetency: string; // Capaian Pembelajaran (CP)
  learningObjective: string; // Tujuan Pembelajaran (TP)
  triggerQuestions: string; // Pertanyaan Pemantik
  facilities: string; // Sarana & Prasarana
  activitiesOpening: string;
  activitiesCore: string;
  activitiesClosing: string;
  assessmentMethods: string;
  studentWorksheet: string; // LKPD Ringkas
  createdAt: string;
}

export interface SchoolProfile {
  schoolName: string;
  npsn: string;
  address: string;
  headmasterName: string;
  headmasterNip: string;
  teacherName: string;
  teacherNip: string;
  gradeName: string; // e.g. "Kelas IV (Empat) - A"
  semester: 'Ganjil' | 'Genap';
  academicYear: string; // e.g. "2026/2027"
}

export interface DeveloperProfile {
  name: string;
  phone: string;
  title: string;
  note: string;
}

export interface AppStateData {
  version: number;
  school: SchoolProfile;
  developer: DeveloperProfile;
  students: Student[];
  subjects: Subject[];
  attendance: Record<string, DayAttendance>; // date string -> DayAttendance
  scores: StudentScore[];
  journals: TeachingJournalEntry[];
  questions: QuizQuestion[];
  lessonPlans: LessonPlan[];
}
