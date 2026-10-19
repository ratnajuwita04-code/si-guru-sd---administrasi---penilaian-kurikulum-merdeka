import React, { useState } from 'react';
import {
  GraduationCap,
  Save,
  Printer,
  ChevronDown,
  CheckCircle,
  FileSpreadsheet,
  Award,
  BookOpen,
  User,
} from 'lucide-react';
import { SchoolProfile, Student, StudentScore, Subject } from '../types';

interface AssessmentManagerProps {
  students: Student[];
  subjects: Subject[];
  scores: StudentScore[];
  school: SchoolProfile;
  onSaveScores: (updatedScores: StudentScore[]) => void;
  onPrintStudentReport: (studentId: string) => void;
  onPrintLeger: () => void;
}

export const AssessmentManager: React.FC<AssessmentManagerProps> = ({
  students,
  subjects,
  scores,
  school,
  onSaveScores,
  onPrintStudentReport,
  onPrintLeger,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'input' | 'leger' | 'reportCard'>('input');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-mat');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<string>(students[0]?.id || 'std-1');

  // Local state for score editing
  const [localScores, setLocalScores] = useState<StudentScore[]>(scores);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Helper to get score record
  const getStudentScore = (studentId: string, subjectId: string): StudentScore => {
    const found = localScores.find((s) => s.studentId === studentId && s.subjectId === subjectId);
    if (found) return found;
    return {
      studentId,
      subjectId,
      formativeScores: {},
      summativeMaterialScores: {},
      summativeExamScore: 75,
    };
  };

  // Update formative score
  const handleFormativeChange = (studentId: string, objectiveId: string, value: number) => {
    const validVal = isNaN(value) ? 0 : Math.min(100, Math.max(0, value));
    setLocalScores((prev) => {
      const existingIdx = prev.findIndex(
        (s) => s.studentId === studentId && s.subjectId === selectedSubjectId
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          formativeScores: {
            ...updated[existingIdx].formativeScores,
            [objectiveId]: validVal,
          },
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            studentId,
            subjectId: selectedSubjectId,
            formativeScores: { [objectiveId]: validVal },
            summativeMaterialScores: {},
            summativeExamScore: 75,
          },
        ];
      }
    });
    setHasUnsavedChanges(true);
  };

  // Update summative exam score (SAS)
  const handleSasChange = (studentId: string, value: number) => {
    const validVal = isNaN(value) ? 0 : Math.min(100, Math.max(0, value));
    setLocalScores((prev) => {
      const existingIdx = prev.findIndex(
        (s) => s.studentId === studentId && s.subjectId === selectedSubjectId
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          summativeExamScore: validVal,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            studentId,
            subjectId: selectedSubjectId,
            formativeScores: {},
            summativeMaterialScores: {},
            summativeExamScore: validVal,
          },
        ];
      }
    });
    setHasUnsavedChanges(true);
  };

  // Calculate final score (Nilai Akhir / NA) for a student in a subject
  const calculateFinalScore = (studentId: string, subjectId: string): number => {
    const sc = getStudentScore(studentId, subjectId);
    const formVals = Object.values(sc.formativeScores || {});
    const avgFormative =
      formVals.length > 0 ? formVals.reduce((a, b) => a + b, 0) / formVals.length : 75;
    const sas = sc.summativeExamScore !== undefined ? sc.summativeExamScore : 75;

    // Standard formula: 60% Formatif + 40% Sumatif Akhir Semester
    return Math.round(avgFormative * 0.6 + sas * 0.4);
  };

  // Generate Kurikulum Merdeka competency descriptor
  const getCompetencyDescription = (studentId: string, sub: Subject): { highest: string; lowest: string } => {
    const sc = getStudentScore(studentId, sub.id);
    const tpList = sub.objectives;
    if (tpList.length === 0) {
      return {
        highest: 'Menunjukkan penguasaan materi dengan baik.',
        lowest: 'Perlu bimbingan lebih lanjut dalam penguatan konsep.',
      };
    }

    let highestTp = tpList[0];
    let highestScore = -1;
    let lowestTp = tpList[0];
    let lowestScore = 999;

    tpList.forEach((tp) => {
      const val = sc.formativeScores[tp.id] ?? 75;
      if (val > highestScore) {
        highestScore = val;
        highestTp = tp;
      }
      if (val < lowestScore) {
        lowestScore = val;
        lowestTp = tp;
      }
    });

    const highestText = `Menunjukkan penguasaan yang sangat baik dalam ${highestTp.description.toLowerCase()}`;
    const lowestText =
      lowestScore < sub.kkm
        ? `Perlu pendampingan dan bimbingan dalam ${lowestTp.description.toLowerCase()}`
        : `Mampu meningkatkan pemahaman dalam ${lowestTp.description.toLowerCase()}`;

    return { highest: highestText, lowest: lowestText };
  };

  const handleSave = () => {
    onSaveScores(localScores);
    setHasUnsavedChanges(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Top Bar Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Penilaian Asesmen Kurikulum Merdeka</h2>
          <p className="text-xs text-slate-500">
            Pengelolaan nilai formatif per TP, nilai sumatif, rekap leger, dan rapor peserta didik
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveSubTab('input')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'input'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Input Nilai Mapel
            </button>
            <button
              onClick={() => setActiveSubTab('leger')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'leger'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Leger Kelas
            </button>
            <button
              onClick={() => setActiveSubTab('reportCard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'reportCard'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rapor Siswa
            </button>
          </div>

          {activeSubTab === 'leger' && (
            <button
              onClick={onPrintLeger}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak Leger</span>
            </button>
          )}

          {activeSubTab === 'reportCard' && (
            <button
              onClick={() => onPrintStudentReport(selectedStudentForReport)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rapor Siswa</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: INPUT NILAI MAPEL */}
      {activeSubTab === 'input' && (
        <div className="space-y-4">
          {/* Mapel Selector & Save Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700">Mata Pelajaran:</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} (KKTP: {sub.kkm})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs ${
                  hasUnsavedChanges
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Nilai</span>
              </button>
            </div>
          </div>

          {/* Toast */}
          {saveToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Nilai mata pelajaran {currentSubject.name} berhasil disimpan ke memori lokal.</span>
            </div>
          )}

          {/* TP Information Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tujuan Pembelajaran (TP) yang Dinilai pada {currentSubject.name}:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {currentSubject.objectives.map((tp) => (
                <div key={tp.id} className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-emerald-800">{tp.code}:</span> {tp.description}
                </div>
              ))}
            </div>
          </div>

          {/* Input Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">No</th>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-3 font-mono text-center">NISN</th>
                    {currentSubject.objectives.map((tp) => (
                      <th key={tp.id} className="py-3 px-3 text-center">
                        <div>Formatif</div>
                        <div className="text-[10px] text-emerald-700 font-bold">{tp.code}</div>
                      </th>
                    ))}
                    <th className="py-3 px-3 text-center text-indigo-700">
                      <div>Sumatif</div>
                      <div className="text-[10px] font-bold">SAS</div>
                    </th>
                    <th className="py-3 px-3 text-center font-bold text-slate-900 bg-slate-100/60">
                      <div>Nilai Akhir</div>
                      <div className="text-[10px] text-slate-500">(Rapor)</div>
                    </th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((std, idx) => {
                    const sc = getStudentScore(std.id, currentSubject.id);
                    const finalVal = calculateFinalScore(std.id, currentSubject.id);
                    const isTuntas = finalVal >= currentSubject.kkm;

                    return (
                      <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {std.name}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-500">
                          {std.nisn}
                        </td>

                        {/* TP Formative Inputs */}
                        {currentSubject.objectives.map((tp) => (
                          <td key={tp.id} className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sc.formativeScores[tp.id] ?? ''}
                              placeholder="75"
                              onChange={(e) =>
                                handleFormativeChange(
                                  std.id,
                                  tp.id,
                                  parseInt(e.target.value, 10)
                                )
                              }
                              className="w-14 px-1.5 py-1 text-center font-mono tabular-nums border border-slate-200 rounded text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                            />
                          </td>
                        ))}

                        {/* SAS Input */}
                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={sc.summativeExamScore ?? ''}
                            placeholder="75"
                            onChange={(e) =>
                              handleSasChange(std.id, parseInt(e.target.value, 10))
                            }
                            className="w-14 px-1.5 py-1 text-center font-mono tabular-nums border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none font-semibold text-indigo-900"
                          />
                        </td>

                        {/* Calculated Final Score */}
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-sm bg-slate-50/60 text-slate-900">
                          {finalVal}
                        </td>

                        {/* Tuntas Status */}
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              isTuntas
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {isTuntas ? 'Tercapai' : 'Perlu Bimbingan'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LEGER NILAI KELAS */}
      {activeSubTab === 'leger' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Leger Rekapitulasi Nilai Akhir Peserta Didik
                </h3>
                <p className="text-xs text-slate-500">
                  {school.gradeName} · Semester {school.semester} · TP {school.academicYear}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">No</th>
                    <th className="py-3 px-4 min-w-[180px]">Nama Siswa</th>
                    <th className="py-3 px-3 text-center">L/P</th>
                    {subjects.map((sub) => (
                      <th
                        key={sub.id}
                        className="py-3 px-2 text-center min-w-[65px]"
                        title={sub.name}
                      >
                        <span className="truncate block">{sub.code}</span>
                      </th>
                    ))}
                    <th className="py-3 px-3 text-center font-bold text-slate-900 bg-slate-100">
                      Rata-Rata
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((std, idx) => {
                    let totalScore = 0;
                    subjects.forEach((sub) => {
                      totalScore += calculateFinalScore(std.id, sub.id);
                    });
                    const classAvg = Math.round(totalScore / subjects.length);

                    return (
                      <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">{std.name}</td>
                        <td className="py-2.5 px-3 text-center text-slate-500">{std.gender}</td>
                        {subjects.map((sub) => {
                          const val = calculateFinalScore(std.id, sub.id);
                          return (
                            <td
                              key={sub.id}
                              className={`py-2.5 px-2 text-center font-mono tabular-nums font-medium ${
                                val < sub.kkm ? 'text-rose-600 font-bold' : 'text-slate-800'
                              }`}
                            >
                              {val}
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-emerald-800 bg-slate-50">
                          {classAvg}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PREVIEW RAPOR SISWA KURIKULUM MERDEKA */}
      {activeSubTab === 'reportCard' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" />
              <label className="text-xs font-semibold text-slate-700">Pilih Siswa:</label>
              <select
                value={selectedStudentForReport}
                onChange={(e) => setSelectedStudentForReport(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              >
                {students.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} (NISN: {std.nisn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rapor Sheet Preview */}
          {(() => {
            const student = students.find((s) => s.id === selectedStudentForReport);
            if (!student) return null;

            return (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6 max-w-4xl mx-auto">
                {/* Official School Header */}
                <div className="text-center border-b-2 border-slate-800 pb-4">
                  <h3 className="font-bold text-base text-slate-900 tracking-wide uppercase">
                    PEMERINTAH KABUPATEN / KOTA PENDIDIKAN DASAR
                  </h3>
                  <h4 className="font-extrabold text-lg text-slate-900 uppercase">
                    {school.schoolName}
                  </h4>
                  <p className="text-xs text-slate-600">{school.address} · NPSN: {school.npsn}</p>
                  <div className="text-xs font-bold text-slate-900 uppercase mt-2 underline">
                    LAPORAN HASIL BELAJAR PESERTA DIDIK (RAPOR KURIKULUM MERDEKA)
                  </div>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex">
                      <span className="w-32 text-slate-500">Nama Peserta Didik</span>
                      <span className="font-bold text-slate-900">: {student.name}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500">NISN / NIS</span>
                      <span className="font-mono text-slate-900">: {student.nisn} / {student.nis || '-'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500">Sekolah</span>
                      <span className="text-slate-900">: {school.schoolName}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex">
                      <span className="w-32 text-slate-500">Kelas / Fase</span>
                      <span className="font-semibold text-slate-900">: {school.gradeName}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500">Semester</span>
                      <span className="text-slate-900">: {school.semester}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500">Tahun Pelajaran</span>
                      <span className="font-mono text-slate-900">: {school.academicYear}</span>
                    </div>
                  </div>
                </div>

                {/* Subject Grades & Descriptors Table */}
                <div className="border border-slate-300 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-800">
                      <tr>
                        <th className="py-2 px-3 w-8 text-center border-r border-slate-300">No</th>
                        <th className="py-2 px-3 w-48 border-r border-slate-300">Mata Pelajaran</th>
                        <th className="py-2 px-3 w-16 text-center border-r border-slate-300">Nilai Akhir</th>
                        <th className="py-2 px-3">Capaian Kompetensi (Deskripsi Kurikulum Merdeka)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {subjects.map((sub, idx) => {
                        const score = calculateFinalScore(student.id, sub.id);
                        const desc = getCompetencyDescription(student.id, sub);

                        return (
                          <tr key={sub.id}>
                            <td className="py-2 px-3 text-center border-r border-slate-200 font-mono">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-900 border-r border-slate-200">
                              {sub.name}
                            </td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                              {score}
                            </td>
                            <td className="py-2 px-3 text-[11px] leading-relaxed text-slate-700 space-y-1">
                              <div>{desc.highest}</div>
                              <div className="text-slate-500">{desc.lowest}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Signatures */}
                <div className="pt-6 grid grid-cols-2 text-xs text-center">
                  <div>
                    <p className="text-slate-500">Mengetahui,</p>
                    <p className="text-slate-500">Kepala Sekolah</p>
                    <div className="h-16"></div>
                    <p className="font-bold text-slate-900 underline">{school.headmasterName}</p>
                    <p className="text-[11px] font-mono text-slate-600">NIP. {school.headmasterNip}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Wali / Guru Kelas,</p>
                    <div className="h-20"></div>
                    <p className="font-bold text-slate-900 underline">{school.teacherName}</p>
                    <p className="text-[11px] font-mono text-slate-600">NIP. {school.teacherNip}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
