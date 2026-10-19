import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  Printer,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { DayAttendance, SchoolProfile, Student, AttendanceStatus } from '../types';

interface AttendanceManagerProps {
  students: Student[];
  school: SchoolProfile;
  attendanceData: Record<string, DayAttendance>;
  onSaveAttendance: (date: string, records: Record<string, AttendanceStatus>, notes: Record<string, string>) => void;
  onPrintAttendance: (monthStr: string) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  students,
  school,
  attendanceData,
  onSaveAttendance,
  onPrintAttendance,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'monthly'>('daily');

  // Selected date for daily attendance (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Selected month for monthly recap (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(todayStr.substring(0, 7));

  // Current day records
  const currentDayData = attendanceData[selectedDate] || {
    date: selectedDate,
    records: {},
    notes: {},
  };

  const [records, setRecords] = useState<Record<string, AttendanceStatus>>(() => {
    const recs: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      recs[s.id] = currentDayData.records[s.id] || 'H';
    });
    return recs;
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    return currentDayData.notes || {};
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Change date handler
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const dayData = attendanceData[newDate] || { date: newDate, records: {}, notes: {} };
    const newRecs: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      newRecs[s.id] = dayData.records[s.id] || 'H';
    });
    setRecords(newRecs);
    setNotes(dayData.notes || {});
    setHasUnsavedChanges(false);
  };

  // Change individual student status
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
    setHasUnsavedChanges(true);
  };

  // Change note
  const handleNoteChange = (studentId: string, noteText: string) => {
    setNotes((prev) => ({ ...prev, [studentId]: noteText }));
    setHasUnsavedChanges(true);
  };

  // Set all students to Hadir
  const handleSetAllHadir = () => {
    const newRecs: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      newRecs[s.id] = 'H';
    });
    setRecords(newRecs);
    setHasUnsavedChanges(true);
  };

  // Save changes
  const handleSave = () => {
    onSaveAttendance(selectedDate, records, notes);
    setHasUnsavedChanges(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Daily statistics
  let hadirCount = 0;
  let sakitCount = 0;
  let izinCount = 0;
  let alpaCount = 0;

  students.forEach((s) => {
    const st = records[s.id] || 'H';
    if (st === 'H') hadirCount++;
    else if (st === 'S') sakitCount++;
    else if (st === 'I') izinCount++;
    else if (st === 'A') alpaCount++;
  });

  const totalStudents = students.length;
  const hadirPercent = totalStudents > 0 ? Math.round((hadirCount / totalStudents) * 100) : 0;

  // Monthly summary calculations
  const monthlyStats = React.useMemo(() => {
    // Dates matching selectedMonth (e.g. "2026-10")
    const datesInMonth = Object.keys(attendanceData).filter((d) => d.startsWith(selectedMonth));

    const studentSummary: Record<
      string,
      { H: number; S: number; I: number; A: number; totalDays: number }
    > = {};

    students.forEach((s) => {
      studentSummary[s.id] = { H: 0, S: 0, I: 0, A: 0, totalDays: 0 };
    });

    datesInMonth.forEach((dateKey) => {
      const dayRec = attendanceData[dateKey];
      if (dayRec && dayRec.records) {
        students.forEach((s) => {
          const status = dayRec.records[s.id] || 'H';
          studentSummary[s.id][status] = (studentSummary[s.id][status] || 0) + 1;
          studentSummary[s.id].totalDays += 1;
        });
      }
    });

    return {
      recordedDaysCount: datesInMonth.length,
      studentSummary,
    };
  }, [attendanceData, selectedMonth, students]);

  return (
    <div className="space-y-5">
      {/* Tab Switcher & Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Presensi Siswa {school.gradeName}</h2>
          <p className="text-xs text-slate-500">
            Pencatatan kehadiran harian dan rekapitulasi presensi bulanan otomatis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveSubTab('daily')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'daily'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Presensi Harian
            </button>
            <button
              onClick={() => setActiveSubTab('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'monthly'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rekap Bulanan
            </button>
          </div>

          <button
            onClick={() => onPrintAttendance(activeSubTab === 'daily' ? selectedDate : selectedMonth)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            title="Cetak lembar presensi format dinas"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PRESENSI HARIAN */}
      {activeSubTab === 'daily' && (
        <div className="space-y-4">
          {/* Daily Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <label className="text-xs font-semibold text-slate-700">Tanggal:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSetAllHadir}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors"
              >
                1-Klik: Set Semua Hadir
              </button>

              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs ${
                  hasUnsavedChanges
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Simpan Presensi</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {saveToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Data presensi tanggal {selectedDate} berhasil disimpan ke memori lokal.</span>
            </div>
          )}

          {/* Daily Stat Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Hadir (H)</div>
              <div className="text-xl font-bold text-emerald-700 tabular-nums">{hadirCount} Siswa</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Sakit (S)</div>
              <div className="text-xl font-bold text-amber-600 tabular-nums">{sakitCount} Siswa</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Izin (I)</div>
              <div className="text-xl font-bold text-blue-600 tabular-nums">{izinCount} Siswa</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Alpa (A)</div>
              <div className="text-xl font-bold text-rose-600 tabular-nums">{alpaCount} Siswa</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">% Kehadiran</div>
              <div className="text-xl font-bold text-slate-900 tabular-nums">{hadirPercent}%</div>
            </div>
          </div>

          {/* Table of Daily Attendance */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">No</th>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-3 font-mono text-center">NISN</th>
                    <th className="py-3 px-3 text-center">Status Kehadiran</th>
                    <th className="py-3 px-4">Catatan / Alasan (Opsional)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((std, idx) => {
                    const currentStatus = records[std.id] || 'H';
                    return (
                      <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {std.name}
                          <span className="ml-2 text-[10px] text-slate-400 font-normal">
                            ({std.gender === 'L' ? 'L' : 'P'})
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-500">
                          {std.nisn}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(std.id, 'H')}
                              className={`w-7 h-7 text-xs font-bold rounded-md transition-all ${
                                currentStatus === 'H'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-emerald-700'
                              }`}
                              title="Hadir"
                            >
                              H
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(std.id, 'S')}
                              className={`w-7 h-7 text-xs font-bold rounded-md transition-all ${
                                currentStatus === 'S'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-amber-700'
                              }`}
                              title="Sakit"
                            >
                              S
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(std.id, 'I')}
                              className={`w-7 h-7 text-xs font-bold rounded-md transition-all ${
                                currentStatus === 'I'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-blue-700'
                              }`}
                              title="Izin"
                            >
                              I
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(std.id, 'A')}
                              className={`w-7 h-7 text-xs font-bold rounded-md transition-all ${
                                currentStatus === 'A'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-rose-700'
                              }`}
                              title="Alpa / Tanpa Keterangan"
                            >
                              A
                            </button>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="text"
                            placeholder="Keterangan sakit / urusan izin..."
                            value={notes[std.id] || ''}
                            onChange={(e) => handleNoteChange(std.id, e.target.value)}
                            className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                          />
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

      {/* SUB-TAB 2: REKAP BULANAN */}
      {activeSubTab === 'monthly' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <label className="text-xs font-semibold text-slate-700">Pilih Bulan & Tahun:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>
            <div className="text-xs text-slate-500">
              Total Hari Efektif Terdata: <strong className="text-slate-800 font-mono">{monthlyStats.recordedDaysCount} Hari</strong>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">No</th>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-3 font-mono text-center">NISN</th>
                    <th className="py-3 px-3 text-center">L/P</th>
                    <th className="py-3 px-3 text-center text-emerald-700">Hadir</th>
                    <th className="py-3 px-3 text-center text-amber-700">Sakit</th>
                    <th className="py-3 px-3 text-center text-blue-700">Izin</th>
                    <th className="py-3 px-3 text-center text-rose-700">Alpa</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">% Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((std, idx) => {
                    const st = monthlyStats.studentSummary[std.id] || { H: 0, S: 0, I: 0, A: 0, totalDays: 0 };
                    const totalD = st.totalDays || 1;
                    const percent = Math.round((st.H / totalD) * 100);
                    return (
                      <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">{std.name}</td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-500">
                          {std.nisn}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600 font-medium">{std.gender}</td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-emerald-700">
                          {st.H}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-amber-700">
                          {st.S}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-blue-700">
                          {st.I}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-rose-700">
                          {st.A}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-slate-800">
                          {percent}%
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
    </div>
  );
};
