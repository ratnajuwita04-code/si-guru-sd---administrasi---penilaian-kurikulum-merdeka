import React from 'react';
import {
  Users,
  CalendarCheck,
  GraduationCap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  FileText,
  Play,
} from 'lucide-react';
import { AppStateData } from '../types';

interface DashboardProps {
  data: AppStateData;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onNavigate }) => {
  const { students, subjects, attendance, journals, school, questions } = data;

  // Calculate statistics
  const totalStudents = students.length;
  const maleCount = students.filter((s) => s.gender === 'L').length;
  const femaleCount = students.filter((s) => s.gender === 'P').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance[todayStr]?.records || {};
  let hadirCount = 0;
  let sakitCount = 0;
  let izinCount = 0;
  let alpaCount = 0;

  students.forEach((s) => {
    const status = todayAttendance[s.id] || 'H';
    if (status === 'H') hadirCount++;
    else if (status === 'S') sakitCount++;
    else if (status === 'I') izinCount++;
    else if (status === 'A') alpaCount++;
  });

  const attendancePercentage = totalStudents > 0 ? Math.round((hadirCount / totalStudents) * 100) : 0;
  const totalObjectives = subjects.reduce((acc, sub) => acc + sub.objectives.length, 0);

  // Jadwal Pelajaran Mingguan SD
  const weeklySchedule = [
    { day: 'Senin', time: '07.30 - 09.30', mapel: 'Pendidikan Pancasila & Upacara', room: 'Ruang Kelas' },
    { day: 'Selasa', time: '07.30 - 09.30', mapel: 'Bahasa Indonesia & Literasi', room: 'Ruang Kelas' },
    { day: 'Rabu', time: '07.30 - 09.30', mapel: 'Matematika (Numerasi)', room: 'Ruang Kelas' },
    { day: 'Kamis', time: '07.30 - 09.30', mapel: 'IPAS (Eksperimen Alam)', room: 'Laboratorium/Taman' },
    { day: 'Jumat', time: '07.00 - 08.45', mapel: 'PAI-BP & Pembiasaan Sholat Dhuha', room: 'Musholla/Kelas' },
    { day: 'Sabtu', time: '07.30 - 09.30', mapel: 'Seni Rupa & Ekstrakurikuler', room: 'Ruang Kelas' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-900/60 text-emerald-200 text-xs font-medium mb-3">
            <span>Kurikulum Merdeka</span>
            <span aria-hidden="true">·</span>
            <span>Tahun Pelajaran {school.academicYear}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
            Selamat Datang, Ibu {school.teacherName}
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            Sistem administrasi guru terpadu untuk {school.gradeName} di {school.schoolName}. Kelola presensi siswa, penilaian formatif & sumatif, modul ajar, dan jurnal harian dengan cepat dan akurat.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-800 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors shadow-xs"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-700" />
              <span>Input Presensi Hari Ini</span>
            </button>
            <button
              onClick={() => onNavigate('assessment')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/60 hover:bg-emerald-900/80 text-white font-medium text-xs rounded-lg transition-colors border border-emerald-600/40"
            >
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>Kelola Nilai & Rapor</span>
            </button>
            <button
              onClick={() => onNavigate('questions')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/60 hover:bg-emerald-900/80 text-white font-medium text-xs rounded-lg transition-colors border border-emerald-600/40"
            >
              <Play className="w-4 h-4 text-emerald-300" />
              <span>Mulai Kuis Interaktif Siswa</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Siswa</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {totalStudents} <span className="text-sm font-normal text-slate-500">Anak</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span>Laki-laki: <strong className="text-slate-700 font-mono tabular-nums">{maleCount}</strong></span>
            <span>·</span>
            <span>Perempuan: <strong className="text-slate-700 font-mono tabular-nums">{femaleCount}</strong></span>
          </div>
        </div>

        {/* Presensi Hari Ini */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Presensi Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {attendancePercentage}% <span className="text-sm font-normal text-slate-500">Kehadiran</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span className="text-emerald-700 font-medium">H: {hadirCount}</span>
            <span>·</span>
            <span className="text-amber-700">S: {sakitCount}</span>
            <span>·</span>
            <span className="text-blue-700">I: {izinCount}</span>
            <span>·</span>
            <span className="text-rose-700">A: {alpaCount}</span>
          </div>
        </div>

        {/* Mata Pelajaran & TP */}
        <div
          onClick={() => onNavigate('assessment')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kurikulum Merdeka</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {subjects.length} <span className="text-sm font-normal text-slate-500">Mata Pelajaran</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Terdata <strong className="text-slate-700 font-mono tabular-nums">{totalObjectives}</strong> Tujuan Pembelajaran (TP)
          </div>
        </div>

        {/* Jurnal & Bank Soal */}
        <div
          onClick={() => onNavigate('journal')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jurnal & Evaluasi</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {journals.length} <span className="text-sm font-normal text-slate-500">Catatan Jurnal</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Koleksi <strong className="text-slate-700 font-mono tabular-nums">{questions.length}</strong> Soal Evaluasi SD
          </div>
        </div>
      </div>

      {/* 2-Column Split: Jadwal & Agenda Mengajar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri (2 span): Agenda Mengajar & Jurnal Terkini */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900">Jurnal & Agenda Mengajar Terkini</h2>
              </div>
              <button
                onClick={() => onNavigate('journal')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Buka Semua Jurnal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {journals.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Belum ada catatan jurnal. Klik tombol "Tulis Jurnal Harian" untuk memulai.
              </div>
            ) : (
              <div className="space-y-3">
                {journals.slice(0, 3).map((jrn) => (
                  <div
                    key={jrn.id}
                    className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-900">{jrn.subjectName}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-mono tabular-nums">{jrn.date}</span>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {jrn.status}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-800 mb-1">{jrn.topic}</div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {jrn.activities}
                    </p>
                    {jrn.reflection && (
                      <div className="mt-2 text-[11px] text-slate-500 italic border-l-2 border-emerald-400 pl-2">
                        Refleksi: {jrn.reflection}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Access to Action Modules */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Aksi Cepat Guru Kelas SD</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigate('lessonPlans')}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Susun Modul Ajar</div>
                <div className="text-[11px] text-slate-500 mt-0.5">RPP lengkap dengan LKPD siap cetak</div>
              </button>

              <button
                onClick={() => onNavigate('questions')}
                className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Play className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Uji Coba Kuis Siswa</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Kuis interaktif ramah anak SD</div>
              </button>

              <button
                onClick={() => onNavigate('assessment')}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Cetak Rapor Siswa</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Format Kurikulum Merdeka resmi</div>
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan (1 span): Jadwal Pelajaran & Profil Kelas */}
        <div className="space-y-6">
          {/* Jadwal Pelajaran */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">Jadwal Pelajaran {school.gradeName}</h2>
            </div>
            <div className="space-y-2.5">
              {weeklySchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 text-xs border border-transparent hover:border-slate-100 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-emerald-800 block">{item.day}</span>
                    <span className="font-medium text-slate-800 truncate block">{item.mapel}</span>
                    <span className="text-[10px] text-slate-400">{item.room}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[11px] text-slate-500 shrink-0">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pedoman Kurikulum Merdeka SD */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Pedoman Asesmen SD</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Asesmen Formatif bertujuan memperbaiki proses pembelajaran, sedangkan Asesmen Sumatif menilai pencapaian hasil belajar peserta didik pada akhir lingkup materi atau semester.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              Skala Kriteria Ketercapaian (KKTP): <span className="text-emerald-300 font-semibold">75</span> (Sangat Baik: 86-100, Baik: 75-85, Cukup: 65-74, Perlu Bimbingan: &lt;65).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
