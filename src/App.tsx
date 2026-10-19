/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AppStateData,
  DeveloperProfile,
  LessonPlan,
  QuizQuestion,
  SchoolProfile,
  Student,
  StudentScore,
  TeachingJournalEntry,
  AttendanceStatus,
} from './types';
import {
  loadAppData,
  saveAppData,
  exportDataAsJson,
  getInitialState,
} from './utils/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StudentManager } from './components/StudentManager';
import { AttendanceManager } from './components/AttendanceManager';
import { AssessmentManager } from './components/AssessmentManager';
import { TeachingJournal } from './components/TeachingJournal';
import { QuestionBank } from './components/QuestionBank';
import { LessonPlanGenerator } from './components/LessonPlanGenerator';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { PrintDocumentModal, PrintDocType } from './components/PrintDocumentModal';

export default function App() {
  const [data, setData] = useState<AppStateData>(() => loadAppData());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Print modal state
  const [printModal, setPrintModal] = useState<{
    isOpen: boolean;
    docType: PrintDocType;
    targetStudentId?: string;
    targetLessonPlan?: LessonPlan;
    targetMonth?: string;
  }>({
    isOpen: false,
    docType: 'student_list',
  });

  // Auto-persist whenever data changes
  useEffect(() => {
    saveAppData(data);
  }, [data]);

  // STUDENT HANDLERS
  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
    }));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
    }));
  };

  const handleDeleteStudent = (studentId: string) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== studentId),
      scores: prev.scores.filter((sc) => sc.studentId !== studentId),
    }));
  };

  // ATTENDANCE HANDLERS
  const handleSaveAttendance = (
    date: string,
    records: Record<string, AttendanceStatus>,
    notes: Record<string, string>
  ) => {
    setData((prev) => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        [date]: {
          date,
          records,
          notes,
        },
      },
    }));
  };

  // SCORE HANDLERS
  const handleSaveScores = (updatedScores: StudentScore[]) => {
    setData((prev) => ({
      ...prev,
      scores: updatedScores,
    }));
  };

  // JOURNAL HANDLERS
  const handleAddJournal = (entry: Omit<TeachingJournalEntry, 'id'>) => {
    const newEntry: TeachingJournalEntry = {
      ...entry,
      id: `jrn-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      journals: [newEntry, ...prev.journals],
    }));
  };

  const handleUpdateJournal = (entry: TeachingJournalEntry) => {
    setData((prev) => ({
      ...prev,
      journals: prev.journals.map((j) => (j.id === entry.id ? entry : j)),
    }));
  };

  const handleDeleteJournal = (id: string) => {
    setData((prev) => ({
      ...prev,
      journals: prev.journals.filter((j) => j.id !== id),
    }));
  };

  // QUESTION BANK HANDLERS
  const handleAddQuestion = (q: Omit<QuizQuestion, 'id'>) => {
    const newQ: QuizQuestion = {
      ...q,
      id: `q-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQ],
    }));
  };

  const handleUpdateQuestion = (q: QuizQuestion) => {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.map((item) => (item.id === q.id ? q : item)),
    }));
  };

  const handleDeleteQuestion = (id: string) => {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.filter((item) => item.id !== id),
    }));
  };

  // LESSON PLAN HANDLERS
  const handleAddPlan = (plan: Omit<LessonPlan, 'id' | 'createdAt'>) => {
    const newPlan: LessonPlan = {
      ...plan,
      id: `lp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setData((prev) => ({
      ...prev,
      lessonPlans: [newPlan, ...prev.lessonPlans],
    }));
  };

  const handleUpdatePlan = (plan: LessonPlan) => {
    setData((prev) => ({
      ...prev,
      lessonPlans: prev.lessonPlans.map((p) => (p.id === plan.id ? plan : p)),
    }));
  };

  const handleDeletePlan = (id: string) => {
    setData((prev) => ({
      ...prev,
      lessonPlans: prev.lessonPlans.filter((p) => p.id !== id),
    }));
  };

  // SETTINGS & BACKUP HANDLERS
  const handleSaveSchool = (school: SchoolProfile) => {
    setData((prev) => ({ ...prev, school }));
  };

  const handleSaveDeveloper = (developer: DeveloperProfile) => {
    setData((prev) => ({ ...prev, developer }));
  };

  const handleExportBackup = () => {
    exportDataAsJson(data);
  };

  const handleRestoreBackup = (restoredData: AppStateData) => {
    setData(restoredData);
    saveAppData(restoredData);
  };

  const handleResetDefault = () => {
    const initial = getInitialState();
    setData(initial);
    saveAppData(initial);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        school={data.school}
        developer={data.developer}
        activeTab={activeTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onQuickPrint={() =>
          setPrintModal({
            isOpen: true,
            docType:
              activeTab === 'students'
                ? 'student_list'
                : activeTab === 'attendance'
                ? 'attendance_monthly'
                : activeTab === 'assessment'
                ? 'leger'
                : activeTab === 'journal'
                ? 'teaching_journal'
                : activeTab === 'questions'
                ? 'exam_sheet'
                : activeTab === 'lessonPlans' && data.lessonPlans.length > 0
                ? 'lesson_plan'
                : 'student_list',
            targetLessonPlan: data.lessonPlans[0],
          })
        }
        onExportBackup={handleExportBackup}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 flex flex-row">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          school={data.school}
          developer={data.developer}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard data={data} onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'students' && (
            <StudentManager
              students={data.students}
              school={data.school}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onPrintStudentList={() =>
                setPrintModal({
                  isOpen: true,
                  docType: 'student_list',
                })
              }
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceManager
              students={data.students}
              school={data.school}
              attendanceData={data.attendance}
              onSaveAttendance={handleSaveAttendance}
              onPrintAttendance={(monthStr) =>
                setPrintModal({
                  isOpen: true,
                  docType: 'attendance_monthly',
                  targetMonth: monthStr,
                })
              }
            />
          )}

          {activeTab === 'assessment' && (
            <AssessmentManager
              students={data.students}
              subjects={data.subjects}
              scores={data.scores}
              school={data.school}
              onSaveScores={handleSaveScores}
              onPrintStudentReport={(studentId) =>
                setPrintModal({
                  isOpen: true,
                  docType: 'student_report',
                  targetStudentId: studentId,
                })
              }
              onPrintLeger={() =>
                setPrintModal({
                  isOpen: true,
                  docType: 'leger',
                })
              }
            />
          )}

          {activeTab === 'journal' && (
            <TeachingJournal
              journals={data.journals}
              subjects={data.subjects}
              school={data.school}
              totalStudents={data.students.length}
              onAddJournal={handleAddJournal}
              onUpdateJournal={handleUpdateJournal}
              onDeleteJournal={handleDeleteJournal}
              onPrintJournal={() =>
                setPrintModal({
                  isOpen: true,
                  docType: 'teaching_journal',
                })
              }
            />
          )}

          {activeTab === 'questions' && (
            <QuestionBank
              questions={data.questions}
              subjects={data.subjects}
              school={data.school}
              onAddQuestion={handleAddQuestion}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onPrintExamSheet={() =>
                setPrintModal({
                  isOpen: true,
                  docType: 'exam_sheet',
                })
              }
            />
          )}

          {activeTab === 'lessonPlans' && (
            <LessonPlanGenerator
              lessonPlans={data.lessonPlans}
              subjects={data.subjects}
              school={data.school}
              onAddPlan={handleAddPlan}
              onUpdatePlan={handleUpdatePlan}
              onDeletePlan={handleDeletePlan}
              onPrintPlan={(plan) =>
                setPrintModal({
                  isOpen: true,
                  docType: 'lesson_plan',
                  targetLessonPlan: plan,
                })
              }
            />
          )}

          {/* Bottom Footer with Developer Attribution */}
          <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 pb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                SI-GURU SD · Aplikasi Administrasi & Penilaian Kurikulum Merdeka
              </div>
              <div className="flex items-center gap-2">
                <span>Pengembang: <strong>{data.developer.name}</strong></span>
                <span>·</span>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="text-emerald-700 hover:text-emerald-800 font-medium underline"
                >
                  Informasi Aplikasi
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        school={data.school}
        developer={data.developer}
        fullData={data}
        onSaveSchool={handleSaveSchool}
        onSaveDeveloper={handleSaveDeveloper}
        onExportBackup={handleExportBackup}
        onRestoreBackup={handleRestoreBackup}
        onResetDefault={handleResetDefault}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        developer={data.developer}
        school={data.school}
      />

      {/* Print Document Modal */}
      <PrintDocumentModal
        isOpen={printModal.isOpen}
        onClose={() => setPrintModal({ ...printModal, isOpen: false })}
        docType={printModal.docType}
        data={data}
        targetStudentId={printModal.targetStudentId}
        targetLessonPlan={printModal.targetLessonPlan}
        targetMonth={printModal.targetMonth}
      />
    </div>
  );
}
