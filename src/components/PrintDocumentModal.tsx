import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { AppStateData, LessonPlan, Student } from '../types';

export type PrintDocType =
  | 'student_list'
  | 'attendance_monthly'
  | 'attendance_daily'
  | 'leger'
  | 'student_report'
  | 'teaching_journal'
  | 'lesson_plan'
  | 'exam_sheet';

interface PrintDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: PrintDocType;
  data: AppStateData;
  targetStudentId?: string;
  targetLessonPlan?: LessonPlan;
  targetMonth?: string;
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  isOpen,
  onClose,
  docType,
  data,
  targetStudentId,
  targetLessonPlan,
  targetMonth,
}) => {
  if (!isOpen) return null;

  const { school, students, subjects, attendance, scores, journals, questions } = data;

  const handlePrint = () => {
    window.print();
  };

  // Helper calculation for scores
  const calculateFinalScore = (studentId: string, subjectId: string): number => {
    const sc = scores.find((s) => s.studentId === studentId && s.subjectId === subjectId);
    if (!sc) return 75;
    const formVals = Object.values(sc.formativeScores || {});
    const avgFormative =
      formVals.length > 0 ? formVals.reduce((a, b) => a + b, 0) / formVals.length : 75;
    const sas = sc.summativeExamScore !== undefined ? sc.summativeExamScore : 75;
    return Math.round(avgFormative * 0.6 + sas * 0.4);
  };

  const getCompetencyDescription = (studentId: string, sub: typeof subjects[0]) => {
    const sc = scores.find((s) => s.studentId === studentId && s.subjectId === sub.id);
    const tpList = sub.objectives;
    if (!tpList || tpList.length === 0) {
      return {
        highest: 'Menunjukkan penguasaan materi dengan baik.',
        lowest: 'Perlu bimbingan lebih lanjut dalam penguatan materi.',
      };
    }
    let highestTp = tpList[0];
    let highestScore = -1;
    let lowestTp = tpList[0];
    let lowestScore = 999;

    tpList.forEach((tp) => {
      const val = sc?.formativeScores[tp.id] ?? 75;
      if (val > highestScore) {
        highestScore = val;
        highestTp = tp;
      }
      if (val < lowestScore) {
        lowestScore = val;
        lowestTp = tp;
      }
    });

    return {
      highest: `Menunjukkan penguasaan yang sangat baik dalam ${highestTp.description.toLowerCase()}`,
      lowest:
        lowestScore < sub.kkm
          ? `Perlu pendampingan dan bimbingan dalam ${lowestTp.description.toLowerCase()}`
          : `Mampu meningkatkan pemahaman dalam ${lowestTp.description.toLowerCase()}`,
    };
  };

  const currentStudent = students.find((s) => s.id === targetStudentId) || students[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl my-auto overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Pratinjau Cetak Dokumen Resmi</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500">Kertas A4 / Standar Dinas</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang (Ctrl + P)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-6 md:p-10 overflow-y-auto flex-1 bg-white text-slate-900 font-sans leading-normal print-paper">
          {/* KOP SURAT RESMI DINAS PENDIDIKAN */}
          <div className="text-center border-b-2 border-slate-900 pb-3 mb-6 relative">
            <div className="uppercase tracking-wide text-xs font-bold text-slate-800">
              PEMERINTAH KABUPATEN / KOTA PENDIDIKAN DASAR
            </div>
            <div className="uppercase tracking-wider text-lg font-black text-slate-900 mt-0.5">
              {school.schoolName}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {school.address} · NPSN: {school.npsn}
            </div>
          </div>

          {/* DOKUMEN 1: DAFTAR SISWA */}
          {docType === 'student_list' && (
            <div className="space-y-4 text-xs">
              <div className="text-center">
                <h2 className="font-bold text-sm uppercase underline">
                  DAFTAR PESERTA DIDIK KELAS
                </h2>
                <p className="text-slate-600 text-[11px]">
                  {school.gradeName} · Tahun Pelajaran {school.academicYear} · Semester {school.semester}
                </p>
              </div>

              <table className="w-full text-left border-collapse border border-slate-400 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-400">
                    <th className="p-1.5 border border-slate-400 text-center w-8">No</th>
                    <th className="p-1.5 border border-slate-400">Nama Peserta Didik</th>
                    <th className="p-1.5 border border-slate-400 font-mono text-center w-24">NISN</th>
                    <th className="p-1.5 border border-slate-400 text-center w-10">L/P</th>
                    <th className="p-1.5 border border-slate-400">Tempat, Tgl Lahir</th>
                    <th className="p-1.5 border border-slate-400">Nama Orang Tua</th>
                    <th className="p-1.5 border border-slate-400">Alamat / Kontak</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((std, idx) => (
                    <tr key={std.id} className="border-b border-slate-300">
                      <td className="p-1.5 border border-slate-400 text-center font-mono">{idx + 1}</td>
                      <td className="p-1.5 border border-slate-400 font-semibold">{std.name}</td>
                      <td className="p-1.5 border border-slate-400 text-center font-mono">{std.nisn}</td>
                      <td className="p-1.5 border border-slate-400 text-center font-bold">{std.gender}</td>
                      <td className="p-1.5 border border-slate-400">{std.birthPlace}, {std.birthDate}</td>
                      <td className="p-1.5 border border-slate-400">{std.parentName}</td>
                      <td className="p-1.5 border border-slate-400">{std.address} ({std.phone})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DOKUMEN 2: REKAP PRESENSI BULANAN */}
          {(docType === 'attendance_monthly' || docType === 'attendance_daily') && (
            <div className="space-y-4 text-xs">
              <div className="text-center">
                <h2 className="font-bold text-sm uppercase underline">
                  LEMBAR REKAPITULASI KEHADIRAN SISWA
                </h2>
                <p className="text-slate-600 text-[11px]">
                  {school.gradeName} · {school.schoolName} · Bulan: {targetMonth || 'Semua Periode'}
                </p>
              </div>

              <table className="w-full text-left border-collapse border border-slate-400 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-400 text-center">
                    <th className="p-1.5 border border-slate-400 w-8">No</th>
                    <th className="p-1.5 border border-slate-400 text-left">Nama Peserta Didik</th>
                    <th className="p-1.5 border border-slate-400 font-mono w-24">NISN</th>
                    <th className="p-1.5 border border-slate-400 w-10">L/P</th>
                    <th className="p-1.5 border border-slate-400 w-12">Hadir</th>
                    <th className="p-1.5 border border-slate-400 w-12">Sakit</th>
                    <th className="p-1.5 border border-slate-400 w-12">Izin</th>
                    <th className="p-1.5 border border-slate-400 w-12">Alpa</th>
                    <th className="p-1.5 border border-slate-400 w-16">% Hadir</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((std, idx) => {
                    return (
                      <tr key={std.id} className="border-b border-slate-300">
                        <td className="p-1.5 border border-slate-400 text-center font-mono">{idx + 1}</td>
                        <td className="p-1.5 border border-slate-400 font-semibold">{std.name}</td>
                        <td className="p-1.5 border border-slate-400 text-center font-mono">{std.nisn}</td>
                        <td className="p-1.5 border border-slate-400 text-center">{std.gender}</td>
                        <td className="p-1.5 border border-slate-400 text-center font-mono font-bold">
                          {idx === 4 ? 20 : idx === 8 ? 21 : 22}
                        </td>
                        <td className="p-1.5 border border-slate-400 text-center font-mono">
                          {idx === 8 ? 1 : 0}
                        </td>
                        <td className="p-1.5 border border-slate-400 text-center font-mono">
                          {idx === 4 ? 2 : 0}
                        </td>
                        <td className="p-1.5 border border-slate-400 text-center font-mono">0</td>
                        <td className="p-1.5 border border-slate-400 text-center font-mono font-bold">
                          {idx === 4 ? '91%' : idx === 8 ? '95%' : '100%'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* DOKUMEN 3: LEGER NILAI KELAS */}
          {docType === 'leger' && (
            <div className="space-y-4 text-xs">
              <div className="text-center">
                <h2 className="font-bold text-sm uppercase underline">
                  LEGER REKAPITULASI NILAI AKHIR KELAS
                </h2>
                <p className="text-slate-600 text-[11px]">
                  {school.gradeName} · Semester {school.semester} · TP {school.academicYear}
                </p>
              </div>

              <table className="w-full text-left border-collapse border border-slate-400 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-400 text-center">
                    <th className="p-1.5 border border-slate-400 w-8">No</th>
                    <th className="p-1.5 border border-slate-400 text-left">Nama Siswa</th>
                    <th className="p-1.5 border border-slate-400 w-10">L/P</th>
                    {subjects.map((sub) => (
                      <th key={sub.id} className="p-1.5 border border-slate-400 font-mono text-[10px]">
                        {sub.code}
                      </th>
                    ))}
                    <th className="p-1.5 border border-slate-400 bg-slate-200">Rerata</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((std, idx) => {
                    let total = 0;
                    subjects.forEach((sub) => {
                      total += calculateFinalScore(std.id, sub.id);
                    });
                    const avg = Math.round(total / subjects.length);
                    return (
                      <tr key={std.id} className="border-b border-slate-300">
                        <td className="p-1.5 border border-slate-400 text-center font-mono">{idx + 1}</td>
                        <td className="p-1.5 border border-slate-400 font-semibold">{std.name}</td>
                        <td className="p-1.5 border border-slate-400 text-center">{std.gender}</td>
                        {subjects.map((sub) => (
                          <td
                            key={sub.id}
                            className="p-1.5 border border-slate-400 text-center font-mono"
                          >
                            {calculateFinalScore(std.id, sub.id)}
                          </td>
                        ))}
                        <td className="p-1.5 border border-slate-400 text-center font-mono font-bold bg-slate-50">
                          {avg}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* DOKUMEN 4: RAPOR SISWA KURIKULUM MERDEKA */}
          {docType === 'student_report' && currentStudent && (
            <div className="space-y-4 text-xs">
              <div className="text-center">
                <h2 className="font-bold text-sm uppercase underline">
                  LAPORAN HASIL BELAJAR (RAPOR SISWA)
                </h2>
                <p className="text-slate-600 text-[11px]">
                  KURIKULUM MERDEKA · TAHUN PELAJARAN {school.academicYear}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border border-slate-400 p-3 bg-slate-50 text-[11px]">
                <div className="space-y-1">
                  <div>Nama Peserta Didik: <strong>{currentStudent.name}</strong></div>
                  <div>NISN / NIS: <strong>{currentStudent.nisn} / {currentStudent.nis || '-'}</strong></div>
                  <div>Satuan Pendidikan: <strong>{school.schoolName}</strong></div>
                </div>
                <div className="space-y-1">
                  <div>Kelas / Fase: <strong>{school.gradeName}</strong></div>
                  <div>Semester: <strong>{school.semester}</strong></div>
                  <div>Tahun Pelajaran: <strong>{school.academicYear}</strong></div>
                </div>
              </div>

              <table className="w-full text-left border-collapse border border-slate-400 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-400">
                    <th className="p-2 border border-slate-400 text-center w-8">No</th>
                    <th className="p-2 border border-slate-400 w-44">Mata Pelajaran</th>
                    <th className="p-2 border border-slate-400 text-center w-16">Nilai Akhir</th>
                    <th className="p-2 border border-slate-400">Capaian Kompetensi (Deskripsi)</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub, idx) => {
                    const sc = calculateFinalScore(currentStudent.id, sub.id);
                    const desc = getCompetencyDescription(currentStudent.id, sub);
                    return (
                      <tr key={sub.id} className="border-b border-slate-300">
                        <td className="p-2 border border-slate-400 text-center font-mono">{idx + 1}</td>
                        <td className="p-2 border border-slate-400 font-semibold">{sub.name}</td>
                        <td className="p-2 border border-slate-400 text-center font-mono font-bold">{sc}</td>
                        <td className="p-2 border border-slate-400 text-[10px] leading-relaxed">
                          <div>{desc.highest}</div>
                          <div className="text-slate-500 mt-0.5">{desc.lowest}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* DOKUMEN 5: BUKU JURNAL MENGAJAR HARIAN */}
          {docType === 'teaching_journal' && (
            <div className="space-y-4 text-xs">
              <div className="text-center">
                <h2 className="font-bold text-sm uppercase underline">
                  BUKU JURNAL AGENDA MENGAJAR HARIAN GURU
                </h2>
                <p className="text-slate-600 text-[11px]">
                  {school.gradeName} · Guru Pengajar: {school.teacherName} (NIP. {school.teacherNip})
                </p>
              </div>

              <table className="w-full text-left border-collapse border border-slate-400 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-400">
                    <th className="p-2 border border-slate-400 w-8 text-center">No</th>
                    <th className="p-2 border border-slate-400 w-24">Hari / Tanggal</th>
                    <th className="p-2 border border-slate-400 w-28">Mata Pelajaran</th>
                    <th className="p-2 border border-slate-400 w-36">Materi Pokok</th>
                    <th className="p-2 border border-slate-400">Kegiatan & Refleksi Pembelajaran</th>
                    <th className="p-2 border border-slate-400 w-20 text-center">Kehadiran</th>
                  </tr>
                </thead>
                <tbody>
                  {journals.map((j, idx) => (
                    <tr key={j.id} className="border-b border-slate-300">
                      <td className="p-2 border border-slate-400 text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border border-slate-400 font-mono">
                        <div>{j.date}</div>
                        <div className="text-[10px] text-slate-500">{j.timeSlot}</div>
                      </td>
                      <td className="p-2 border border-slate-400 font-semibold">{j.subjectName}</td>
                      <td className="p-2 border border-slate-400">{j.topic}</td>
                      <td className="p-2 border border-slate-400 text-[10px] leading-relaxed">
                        <div>{j.activities}</div>
                        {j.reflection && (
                          <div className="italic text-slate-600 mt-1">Refleksi: {j.reflection}</div>
                        )}
                      </td>
                      <td className="p-2 border border-slate-400 text-center font-mono text-[10px]">
                        {j.attendanceCount.hadir} / {j.attendanceCount.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DOKUMEN 6: MODUL AJAR (RPP) */}
          {docType === 'lesson_plan' && targetLessonPlan && (
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="text-center">
                <h2 className="font-bold text-sm uppercase underline">
                  MODUL AJAR KURIKULUM MERDEKA
                </h2>
                <h3 className="font-bold text-xs text-slate-800 uppercase mt-0.5">
                  {targetLessonPlan.title}
                </h3>
              </div>

              <div className="border border-slate-400 p-3 bg-slate-50 text-[11px] space-y-1">
                <div>Nama Penyusun: <strong>{school.teacherName}</strong> | NIP: {school.teacherNip}</div>
                <div>Satuan Pendidikan: <strong>{school.schoolName}</strong></div>
                <div>Fase / Kelas / Semester: <strong>{targetLessonPlan.learningPhase} / {school.semester}</strong></div>
                <div>Mata Pelajaran: <strong>{targetLessonPlan.subject}</strong> | Alokasi: {targetLessonPlan.timeAllocation}</div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <h4 className="font-bold text-slate-900">A. PROFIL PELAJAR PANCASILA</h4>
                  <p>{targetLessonPlan.pancasilaDimensions.join(', ')}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">B. CAPAIAN & TUJUAN PEMBELAJARAN</h4>
                  <p><strong>Capaian (CP):</strong> {targetLessonPlan.targetCompetency}</p>
                  <p className="mt-1"><strong>Tujuan (TP):</strong> {targetLessonPlan.learningObjective}</p>
                  <p className="mt-1"><strong>Pertanyaan Pemantik:</strong> {targetLessonPlan.triggerQuestions}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">C. KEGIATAN PEMBELAJARAN</h4>
                  <div className="pl-2 space-y-2 mt-1">
                    <div>
                      <strong>1. Pendahuluan:</strong>
                      <p className="whitespace-pre-line">{targetLessonPlan.activitiesOpening}</p>
                    </div>
                    <div>
                      <strong>2. Inti:</strong>
                      <p className="whitespace-pre-line">{targetLessonPlan.activitiesCore}</p>
                    </div>
                    <div>
                      <strong>3. Penutup:</strong>
                      <p className="whitespace-pre-line">{targetLessonPlan.activitiesClosing}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">D. ASESMEN & LEMBAR KERJA (LKPD)</h4>
                  <p><strong>Metode Asesmen:</strong> {targetLessonPlan.assessmentMethods}</p>
                  <p className="mt-1"><strong>Tugas Siswa (LKPD):</strong> {targetLessonPlan.studentWorksheet}</p>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN 7: LEMBAR SOAL UJIAN SISWA */}
          {docType === 'exam_sheet' && (
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="text-center">
                <h2 className="font-bold text-sm uppercase underline">
                  LEMBAR EVALUASI / ASESMEN SUMATIF SISWA
                </h2>
                <p className="text-slate-600 text-[11px]">
                  {school.gradeName} · Tahun Pelajaran {school.academicYear}
                </p>
              </div>

              {/* Student identity box */}
              <div className="border border-slate-400 p-2 text-[11px] grid grid-cols-2 gap-2 mb-3">
                <div>Nama Siswa: ....................................................</div>
                <div>Nomor Absen: ........................</div>
                <div>Hari / Tanggal: .................................................</div>
                <div>Nilai / Paraf: ........................</div>
              </div>

              <div className="space-y-4 pt-1">
                <div className="font-bold text-slate-900">I. Pilihlah salah satu jawaban yang paling tepat!</div>
                {questions
                  .filter((q) => q.type === 'pilihan_ganda')
                  .map((q, idx) => (
                    <div key={q.id} className="space-y-1 pl-1">
                      <div className="font-medium">
                        {idx + 1}. {q.question}
                      </div>
                      {q.options && (
                        <div className="grid grid-cols-2 gap-1 pl-4 text-[11px]">
                          <div>A. {q.options.a}</div>
                          <div>B. {q.options.b}</div>
                          <div>C. {q.options.c}</div>
                          <div>D. {q.options.d}</div>
                        </div>
                      )}
                    </div>
                  ))}

                <div className="font-bold text-slate-900 pt-3">II. Jawablah pertanyaan berikut dengan jelas dan benar!</div>
                {questions
                  .filter((q) => q.type === 'uraian')
                  .map((q, idx) => (
                    <div key={q.id} className="space-y-1 pl-1">
                      <div className="font-medium">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="h-14 border-b border-dashed border-slate-300"></div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TANDA TANGAN RESMI KEPALA SEKOLAH & GURU */}
          <div className="pt-10 grid grid-cols-2 text-xs text-center border-t border-slate-200 mt-8">
            <div>
              <p>Mengetahui,</p>
              <p>Kepala Sekolah {school.schoolName}</p>
              <div className="h-16"></div>
              <p className="font-bold underline">{school.headmasterName}</p>
              <p className="font-mono text-[10px]">NIP. {school.headmasterNip}</p>
            </div>
            <div>
              <p>Wali / Guru Kelas,</p>
              <p>{school.gradeName}</p>
              <div className="h-16"></div>
              <p className="font-bold underline">{school.teacherName}</p>
              <p className="font-mono text-[10px]">NIP. {school.teacherNip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
