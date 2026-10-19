import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Printer,
  Sparkles,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle,
  Copy,
  X,
  Eye,
} from 'lucide-react';
import { LessonPlan, SchoolProfile, Subject } from '../types';

interface LessonPlanGeneratorProps {
  lessonPlans: LessonPlan[];
  subjects: Subject[];
  school: SchoolProfile;
  onAddPlan: (plan: Omit<LessonPlan, 'id' | 'createdAt'>) => void;
  onUpdatePlan: (plan: LessonPlan) => void;
  onDeletePlan: (id: string) => void;
  onPrintPlan: (plan: LessonPlan) => void;
}

export const LessonPlanGenerator: React.FC<LessonPlanGeneratorProps> = ({
  lessonPlans,
  subjects,
  school,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan,
  onPrintPlan,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [viewingPlan, setViewingPlan] = useState<LessonPlan | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subject: subjects[0]?.name || 'Matematika',
    grade: 4,
    semester: 1 as 1 | 2,
    academicYear: school.academicYear,
    timeAllocation: '2 x 35 Menit (1 Pertemuan)',
    learningPhase: 'Fase B (Kelas 3-4)' as 'Fase A (Kelas 1-2)' | 'Fase B (Kelas 3-4)' | 'Fase C (Kelas 5-6)',
    pancasilaDimensions: ['Beriman, bertakwa kepada Tuhan YME', 'Bernalar Kritis', 'Gotong Royong'],
    targetCompetency: '',
    learningObjective: '',
    triggerQuestions: '',
    facilities: 'Buku Guru, Buku Siswa, LCD proyektor/kartu peraga, LKPD kelompok.',
    activitiesOpening: '1. Guru mengucapkan salam dan menyapa peserta didik.\n2. Berdoa bersama dipimpin oleh ketua kelas.\n3. Apersepsi mengaitkan materi dengan pengalaman sehari-hari.\n4. Menyampaikan tujuan pembelajaran hari ini.',
    activitiesCore: '1. Peserta didik mengamati demonstrasi atau bahan tayang.\n2. Guru membagi peserta didik dalam kelompok kooperatif.\n3. Siswa berdiskusi menyelesaikan lembar kerja (LKPD).\n4. Perwakilan kelompok mempresentasikan hasil diskusi.\n5. Guru memberikan konfirmasi dan umpan balik positif.',
    activitiesClosing: '1. Peserta didik bersama guru menyimpulkan materi pelajaran.\n2. Refleksi pembelajaran dan pesan moral.\n3. Doa penutup dan salam.',
    assessmentMethods: 'Asesmen Formatif: Observasi keaktifan diskusi & penilaian hasil LKPD kelompok.',
    studentWorksheet: 'LKPD Mandiri/Kelompok: Jawablah pertanyaan pemahaman materi berikut secara teliti!',
  });

  const [formError, setFormError] = useState('');

  const allDimensions = [
    'Beriman, bertakwa kepada Tuhan YME',
    'Berkebinekaan Global',
    'Gotong Royong',
    'Mandiri',
    'Bernalar Kritis',
    'Kreatif',
  ];

  const toggleDimension = (dim: string) => {
    setFormData((prev) => {
      const exists = prev.pancasilaDimensions.includes(dim);
      return {
        ...prev,
        pancasilaDimensions: exists
          ? prev.pancasilaDimensions.filter((d) => d !== dim)
          : [...prev.pancasilaDimensions, dim],
      };
    });
  };

  const openAddModal = () => {
    setEditingPlan(null);
    setFormData({
      title: 'Modul Ajar Matematika: Pecahan Senilai & Peragaan Konkret',
      subject: 'Matematika',
      grade: 4,
      semester: 1,
      academicYear: school.academicYear,
      timeAllocation: '2 x 35 Menit (1 Pertemuan)',
      learningPhase: 'Fase B (Kelas 3-4)',
      pancasilaDimensions: ['Beriman, bertakwa kepada Tuhan YME', 'Bernalar Kritis', 'Gotong Royong'],
      targetCompetency: 'Peserta didik dapat memahami konsep pecahan senilai menggunakan peraga konkret kertas lipat.',
      learningObjective: 'Melalui eksplorasi melipat kertas origami, peserta didik mampu membuktikan pecahan 1/2 senilai dengan 2/4 dan 4/8 secara akurat.',
      triggerQuestions: 'Bagaimana membagi satu kue donat sama rata untuk dua atau empat anak?',
      facilities: 'Kertas origami aneka warna, gunting aman anak, lembar kerja peserta didik (LKPD).',
      activitiesOpening: '1. Salam, doa pembuka, dan presensi.\n2. Apersepsi kue donat atau pizza yang dibagi sama rata.\n3. Menyampaikan tujuan pembelajaran pecahan senilai.',
      activitiesCore: '1. Siswa dibagi ke dalam kelompok (4 orang).\n2. Setiap anak memegang kertas origami dan melipatnya menjadi 2 bagian, lalu 4 bagian.\n3. Mengarsir bagian pecahan dan membandingkan luas arsirannya.\n4. Mengisi LKPD Kelompok Pecahan Senilai.\n5. Presentasi hasil temuan tiap kelompok di depan kelas.',
      activitiesClosing: '1. Menyimpulkan bersama bahwa luas arsiran sama meskipun penyebutnya berbeda.\n2. Refleksi perasaan belajar hari ini.\n3. Doa dan salam.',
      assessmentMethods: 'Asesmen Formatif: Kinerja diskusi kelompok dan unjuk kerja peragaan kertas lipat.',
      studentWorksheet: 'LKPD 1: Warnai 1/2 dari lingkaran pertama dan 2/4 dari lingkaran kedua. Bandingkan apakah ukurannya sama besar!',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (plan: LessonPlan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      subject: plan.subject,
      grade: plan.grade,
      semester: plan.semester,
      academicYear: plan.academicYear,
      timeAllocation: plan.timeAllocation,
      learningPhase: plan.learningPhase,
      pancasilaDimensions: plan.pancasilaDimensions,
      targetCompetency: plan.targetCompetency,
      learningObjective: plan.learningObjective,
      triggerQuestions: plan.triggerQuestions,
      facilities: plan.facilities,
      activitiesOpening: plan.activitiesOpening,
      activitiesCore: plan.activitiesCore,
      activitiesClosing: plan.activitiesClosing,
      assessmentMethods: plan.assessmentMethods,
      studentWorksheet: plan.studentWorksheet,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Judul Modul Ajar wajib diisi.');
      return;
    }
    if (!formData.learningObjective.trim()) {
      setFormError('Tujuan Pembelajaran wajib diisi.');
      return;
    }

    if (editingPlan) {
      onUpdatePlan({
        ...editingPlan,
        ...formData,
      });
    } else {
      onAddPlan(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Penyusun Modul Ajar Kurikulum Merdeka (RPP)
          </h2>
          <p className="text-xs text-slate-500">
            Perangkat ajar standar resmi lengkap dengan Profil Pelajar Pancasila, langkah kegiatan, asesmen, dan LKPD
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Modul Ajar Baru</span>
          </button>
        </div>
      </div>

      {/* Lesson Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lessonPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all text-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  {plan.subject}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">{plan.timeAllocation}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">{plan.title}</h3>

              <div className="text-slate-500 line-clamp-2 leading-relaxed">
                <strong className="text-slate-700">Tujuan:</strong> {plan.learningObjective}
              </div>

              {/* Profil Pancasila Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {plan.pancasilaDimensions.map((dim, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                  >
                    {dim}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Penyusun: {school.teacherName}</span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewingPlan(plan)}
                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded transition-colors"
                  title="Lihat Detail Lengkap"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(plan)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                  title="Ubah Modul"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onPrintPlan(plan)}
                  className="flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded border border-slate-200 transition-colors font-medium text-[11px]"
                  title="Cetak format supervisi dinas"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cetak</span>
                </button>
                <button
                  onClick={() => onDeletePlan(plan.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  title="Hapus Modul"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail / Preview Modul Ajar */}
      {viewingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Pratinjau Modul Ajar (RPP)</h3>
              <button
                onClick={() => setViewingPlan(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="border-b pb-3">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  {viewingPlan.subject} · {viewingPlan.learningPhase}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{viewingPlan.title}</h2>
                <p className="text-slate-500 font-mono mt-1">
                  Alokasi Waktu: {viewingPlan.timeAllocation} | Guru: {school.teacherName}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800">1. Profil Pelajar Pancasila:</h4>
                <p className="text-slate-600 mt-1">{viewingPlan.pancasilaDimensions.join(', ')}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800">2. Capaian Pembelajaran (CP):</h4>
                <p className="text-slate-600 mt-1">{viewingPlan.targetCompetency}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800">3. Tujuan Pembelajaran (TP):</h4>
                <p className="text-slate-600 mt-1">{viewingPlan.learningObjective}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800">4. Pertanyaan Pemantik:</h4>
                <p className="text-slate-600 mt-1 italic">"{viewingPlan.triggerQuestions}"</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800">5. Sarana & Prasarana:</h4>
                <p className="text-slate-600 mt-1">{viewingPlan.facilities}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800">6. Langkah Kegiatan Pembelajaran:</h4>
                <div className="mt-1 space-y-2">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <strong className="text-slate-700 block mb-0.5">A. Kegiatan Pendahuluan:</strong>
                    <p className="whitespace-pre-line text-slate-600">{viewingPlan.activitiesOpening}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <strong className="text-slate-700 block mb-0.5">B. Kegiatan Inti:</strong>
                    <p className="whitespace-pre-line text-slate-600">{viewingPlan.activitiesCore}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <strong className="text-slate-700 block mb-0.5">C. Kegiatan Penutup:</strong>
                    <p className="whitespace-pre-line text-slate-600">{viewingPlan.activitiesClosing}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800">7. Asesmen & Penilaian:</h4>
                <p className="text-slate-600 mt-1">{viewingPlan.assessmentMethods}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800">8. Lembar Kerja Peserta Didik (LKPD):</h4>
                <p className="text-slate-600 mt-1 bg-emerald-50/50 p-2.5 rounded border border-emerald-100 whitespace-pre-line">
                  {viewingPlan.studentWorksheet}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  onPrintPlan(viewingPlan);
                  setViewingPlan(null);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Dokumen Modul</span>
              </button>
              <button
                onClick={() => setViewingPlan(null)}
                className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Modul */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPlan ? 'Ubah Modul Ajar' : 'Penyusun Modul Ajar Baru (Kurikulum Merdeka)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Modul Ajar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Modul Ajar IPAS: Siklus Air dan Pelestariannya"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fase / Tingkat</label>
                  <select
                    value={formData.learningPhase}
                    onChange={(e) => setFormData({ ...formData, learningPhase: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1-2 SD)</option>
                    <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3-4 SD)</option>
                    <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5-6 SD)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alokasi Waktu</label>
                  <input
                    type="text"
                    value={formData.timeAllocation}
                    onChange={(e) => setFormData({ ...formData, timeAllocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Dimensi Profil Pelajar Pancasila */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Dimensi Profil Pelajar Pancasila:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allDimensions.map((dim) => {
                    const isChecked = formData.pancasilaDimensions.includes(dim);
                    return (
                      <label
                        key={dim}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleDimension(dim)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-[11px] leading-tight">{dim}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Capaian Pembelajaran (CP)
                </label>
                <textarea
                  rows={2}
                  value={formData.targetCompetency}
                  onChange={(e) => setFormData({ ...formData, targetCompetency: e.target.value })}
                  placeholder="Kemampuan akhir yang diharapkan dicapai siswa..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.learningObjective}
                  onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
                  placeholder="Tujuan spesifik yang diukur pada pertemuan ini..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pertanyaan Pemantik</label>
                <input
                  type="text"
                  value={formData.triggerQuestions}
                  onChange={(e) => setFormData({ ...formData, triggerQuestions: e.target.value })}
                  placeholder="Contoh: Mengapa es batu mencair jika terkena sinar matahari?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sarana & Prasarana</label>
                <input
                  type="text"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              {/* 3 Tahap Aktivitas Pembelajaran */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 block">Skenario Kegiatan Pembelajaran:</span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    1. Kegiatan Pendahuluan (Apersepsi & Doa):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.activitiesOpening}
                    onChange={(e) => setFormData({ ...formData, activitiesOpening: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    2. Kegiatan Inti (Eksplorasi, Kolaborasi & Presentasi):
                  </label>
                  <textarea
                    rows={3}
                    value={formData.activitiesCore}
                    onChange={(e) => setFormData({ ...formData, activitiesCore: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    3. Kegiatan Penutup (Refleksi & Simpulan):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.activitiesClosing}
                    onChange={(e) => setFormData({ ...formData, activitiesClosing: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rancangan Asesmen (Formatif / Sumatif)
                </label>
                <input
                  type="text"
                  value={formData.assessmentMethods}
                  onChange={(e) => setFormData({ ...formData, assessmentMethods: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lembar Kerja Peserta Didik (LKPD) / Tugas Ringkas
                </label>
                <textarea
                  rows={2}
                  value={formData.studentWorksheet}
                  onChange={(e) => setFormData({ ...formData, studentWorksheet: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
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
                  {editingPlan ? 'Simpan Perubahan' : 'Terbitkan Modul Ajar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
