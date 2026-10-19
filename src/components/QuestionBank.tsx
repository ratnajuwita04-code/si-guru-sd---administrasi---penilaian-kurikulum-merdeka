import React, { useState } from 'react';
import {
  FileQuestion,
  Plus,
  Play,
  Printer,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Edit2,
  Trash2,
  X,
  BookOpen,
  Award,
} from 'lucide-react';
import { QuizQuestion, SchoolProfile, Subject } from '../types';

interface QuestionBankProps {
  questions: QuizQuestion[];
  subjects: Subject[];
  school: SchoolProfile;
  onAddQuestion: (q: Omit<QuizQuestion, 'id'>) => void;
  onUpdateQuestion: (q: QuizQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onPrintExamSheet: () => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questions,
  subjects,
  school,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onPrintExamSheet,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'Mudah' | 'Sedang' | 'HOTS'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Interactive Quiz Mode State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || 'sub-mat',
    grade: 4,
    topic: '',
    type: 'pilihan_ganda' as 'pilihan_ganda' | 'uraian',
    question: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    correctAnswer: 'A',
    explanation: '',
    difficulty: 'Sedang' as 'Mudah' | 'Sedang' | 'HOTS',
  });

  const [formError, setFormError] = useState('');

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchSub = selectedSubjectFilter === 'ALL' || q.subjectId === selectedSubjectFilter;
    const matchDiff = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSub && matchDiff && matchSearch;
  });

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormData({
      subjectId: subjects[0]?.id || 'sub-mat',
      grade: 4,
      topic: '',
      type: 'pilihan_ganda',
      question: '',
      optA: '',
      optB: '',
      optC: '',
      optD: '',
      correctAnswer: 'A',
      explanation: '',
      difficulty: 'Sedang',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setFormData({
      subjectId: q.subjectId,
      grade: q.grade,
      topic: q.topic,
      type: q.type,
      question: q.question,
      optA: q.options?.a || '',
      optB: q.options?.b || '',
      optC: q.options?.c || '',
      optD: q.options?.d || '',
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim()) {
      setFormError('Butir pertanyaan wajib diisi.');
      return;
    }
    if (!formData.topic.trim()) {
      setFormError('Topik materi pembelajaran wajib diisi.');
      return;
    }

    const payload: Omit<QuizQuestion, 'id'> = {
      subjectId: formData.subjectId,
      grade: formData.grade,
      topic: formData.topic,
      type: formData.type,
      question: formData.question,
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
      difficulty: formData.difficulty,
      options:
        formData.type === 'pilihan_ganda'
          ? {
              a: formData.optA,
              b: formData.optB,
              c: formData.optC,
              d: formData.optD,
            }
          : undefined,
    };

    if (editingQuestion) {
      onUpdateQuestion({ ...payload, id: editingQuestion.id });
    } else {
      onAddQuestion(payload);
    }
    setIsModalOpen(false);
  };

  // Start Interactive Quiz
  const startQuiz = () => {
    if (filteredQuestions.length === 0) return;
    setIsQuizActive(true);
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
  };

  const currentQuizItem = filteredQuestions[currentQuizIndex];

  // Calculate quiz results
  const quizResults = React.useMemo(() => {
    let correctCount = 0;
    const pgQuestions = filteredQuestions.filter((q) => q.type === 'pilihan_ganda');
    pgQuestions.forEach((q) => {
      if (selectedAnswers[q.id]?.toUpperCase() === q.correctAnswer.toUpperCase()) {
        correctCount++;
      }
    });
    const score = pgQuestions.length > 0 ? Math.round((correctCount / pgQuestions.length) * 100) : 0;
    return { correctCount, totalPG: pgQuestions.length, score };
  }, [filteredQuestions, selectedAnswers]);

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Bank Soal & Kuis Pembelajaran SD</h2>
          <p className="text-xs text-slate-500">
            Koleksi butir soal evaluasi, format cetak lembar ujian, dan simulasi kuis interaktif kelas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal</span>
          </button>

          <button
            onClick={startQuiz}
            disabled={filteredQuestions.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Mulai Kuis Interaktif</span>
          </button>

          <button
            onClick={onPrintExamSheet}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Lembar Soal</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE QUIZ MODAL / VIEW */}
      {isQuizActive && currentQuizItem && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-xl border-2 border-emerald-300 p-6 shadow-md text-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <span className="font-bold text-sm text-slate-900">
                Mode Kuis Interaktif SD: Soal {currentQuizIndex + 1} dari {filteredQuestions.length}
              </span>
            </div>
            <button
              onClick={() => setIsQuizActive(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 bg-white rounded border border-slate-200"
            >
              Keluar Kuis
            </button>
          </div>

          {!isQuizSubmitted ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <span className="font-semibold text-emerald-800">
                    {subjects.find((s) => s.id === currentQuizItem.subjectId)?.name || 'Mata Pelajaran'}
                  </span>
                  <span>·</span>
                  <span>Topik: {currentQuizItem.topic}</span>
                  <span>·</span>
                  <span className="font-medium text-slate-600">Tingkat: {currentQuizItem.difficulty}</span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                  {currentQuizItem.question}
                </h3>
              </div>

              {/* Options for Multiple Choice */}
              {currentQuizItem.type === 'pilihan_ganda' && currentQuizItem.options && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                    const optText = currentQuizItem.options![optKey.toLowerCase() as 'a' | 'b' | 'c' | 'd'];
                    const isSelected = selectedAnswers[currentQuizItem.id] === optKey;
                    return (
                      <button
                        key={optKey}
                        onClick={() =>
                          setSelectedAnswers({ ...selectedAnswers, [currentQuizItem.id]: optKey })
                        }
                        className={`p-3.5 rounded-xl border text-left font-medium transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected ? 'bg-white text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {optKey}
                        </span>
                        <span className="text-xs pt-0.5 leading-relaxed">{optText}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Essay hint */}
              {currentQuizItem.type === 'uraian' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-slate-500 italic mb-2">
                    Soal ini bertipe Uraian/Esai. Jawablah di lembar catatan Anda, lalu klik "Selesai & Cek Kunci" untuk melihat pembahasan lengkap.
                  </p>
                </div>
              )}

              {/* Quiz Navigation Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentQuizIndex((p) => Math.max(0, p - 1))}
                  disabled={currentQuizIndex === 0}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 disabled:opacity-40"
                >
                  Sebelumnya
                </button>

                <div className="flex items-center gap-2">
                  {currentQuizIndex < filteredQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuizIndex((p) => p + 1)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                    >
                      Selanjutnya
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsQuizSubmitted(true)}
                      className="px-5 py-1.5 rounded-lg bg-teal-700 text-white font-bold hover:bg-teal-800 shadow-sm"
                    >
                      Selesai & Cek Hasil Kuis
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Quiz Results Screen */
            <div className="bg-white rounded-xl p-6 border border-emerald-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hasil Kuis Interaktif Siswa</h3>
                <p className="text-slate-500 text-xs">
                  Kamu menjawab benar {quizResults.correctCount} dari {quizResults.totalPG} soal pilihan ganda!
                </p>
              </div>

              <div className="text-4xl font-extrabold text-emerald-700 font-mono tabular-nums">
                {quizResults.score} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={startQuiz}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Coba Lagi</span>
                </button>
                <button
                  onClick={() => setIsQuizActive(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                >
                  Tutup Hasil Kuis
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan pertanyaan atau topik materi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none"
          >
            <option value="ALL">Semua Mata Pelajaran</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none"
          >
            <option value="ALL">Semua Tingkat</option>
            <option value="Mudah">Mudah</option>
            <option value="Sedang">Sedang</option>
            <option value="HOTS">HOTS</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            Belum ada butir soal. Klik tombol "Tambah Soal" untuk membuat soal baru.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all text-xs space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-mono">#{idx + 1}</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {subjects.find((s) => s.id === q.subjectId)?.name || 'Mata Pelajaran'}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">Kelas {q.grade} SD</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-medium text-slate-700">{q.topic}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.difficulty === 'HOTS'
                        ? 'bg-rose-50 text-rose-700'
                        : q.difficulty === 'Sedang'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {q.difficulty}
                  </span>

                  <button
                    onClick={() => openEditModal(q)}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                    title="Ubah Soal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteQuestion(q.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="font-semibold text-slate-900 text-sm leading-relaxed">
                {q.question}
              </div>

              {q.type === 'pilihan_ganda' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div
                    className={`p-2 rounded border ${
                      q.correctAnswer.toUpperCase() === 'A'
                        ? 'bg-emerald-50 border-emerald-200 font-semibold text-emerald-900'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <strong>A.</strong> {q.options.a}
                  </div>
                  <div
                    className={`p-2 rounded border ${
                      q.correctAnswer.toUpperCase() === 'B'
                        ? 'bg-emerald-50 border-emerald-200 font-semibold text-emerald-900'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <strong>B.</strong> {q.options.b}
                  </div>
                  <div
                    className={`p-2 rounded border ${
                      q.correctAnswer.toUpperCase() === 'C'
                        ? 'bg-emerald-50 border-emerald-200 font-semibold text-emerald-900'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <strong>C.</strong> {q.options.c}
                  </div>
                  <div
                    className={`p-2 rounded border ${
                      q.correctAnswer.toUpperCase() === 'D'
                        ? 'bg-emerald-50 border-emerald-200 font-semibold text-emerald-900'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <strong>D.</strong> {q.options.d}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
                <span className="font-bold text-emerald-800 shrink-0">
                  Kunci: {q.correctAnswer}
                </span>
                <span>·</span>
                <span className="italic">Pembahasan: {q.explanation}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah / Edit Soal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingQuestion ? 'Ubah Butir Soal' : 'Tambah Soal Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat Kesulitan</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="HOTS">HOTS (Higher Order Thinking)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Materi Pokok / Topik <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Contoh: Operasi Hitung Pecahan / Rantai Makanan"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Butir Pertanyaan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Tuliskan narasi pertanyaan soal secara jelas..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilihan A</label>
                  <input
                    type="text"
                    value={formData.optA}
                    onChange={(e) => setFormData({ ...formData, optA: e.target.value })}
                    placeholder="Teks opsi A"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilihan B</label>
                  <input
                    type="text"
                    value={formData.optB}
                    onChange={(e) => setFormData({ ...formData, optB: e.target.value })}
                    placeholder="Teks opsi B"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilihan C</label>
                  <input
                    type="text"
                    value={formData.optC}
                    onChange={(e) => setFormData({ ...formData, optC: e.target.value })}
                    placeholder="Teks opsi C"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilihan D</label>
                  <input
                    type="text"
                    value={formData.optD}
                    onChange={(e) => setFormData({ ...formData, optD: e.target.value })}
                    placeholder="Teks opsi D"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kunci Jawaban</label>
                  <select
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold"
                  >
                    <option value="A">Kunci A</option>
                    <option value="B">Kunci B</option>
                    <option value="C">Kunci C</option>
                    <option value="D">Kunci D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penjelasan Singkat</label>
                  <input
                    type="text"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Alasan jawaban benar..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  {editingQuestion ? 'Simpan Perubahan' : 'Tambahkan Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
