import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Printer,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Filter,
} from 'lucide-react';
import { SchoolProfile, Subject, TeachingJournalEntry } from '../types';

interface TeachingJournalProps {
  journals: TeachingJournalEntry[];
  subjects: Subject[];
  school: SchoolProfile;
  totalStudents: number;
  onAddJournal: (entry: Omit<TeachingJournalEntry, 'id'>) => void;
  onUpdateJournal: (entry: TeachingJournalEntry) => void;
  onDeleteJournal: (id: string) => void;
  onPrintJournal: () => void;
}

export const TeachingJournal: React.FC<TeachingJournalProps> = ({
  journals,
  subjects,
  school,
  totalStudents,
  onAddJournal,
  onUpdateJournal,
  onDeleteJournal,
  onPrintJournal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TeachingJournalEntry | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Terlaksana' | 'Tertunda'>('ALL');

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: todayStr,
    timeSlot: '07.30 - 09.15 (Jam ke 1-2)',
    subjectId: subjects[0]?.id || 'sub-mat',
    topic: '',
    activities: '',
    reflection: '',
    hadirCount: totalStudents,
    status: 'Terlaksana' as 'Terlaksana' | 'Tertunda' | 'Pengganti',
  });

  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingEntry(null);
    setFormData({
      date: todayStr,
      timeSlot: '07.30 - 09.15 (Jam ke 1-2)',
      subjectId: subjects[0]?.id || 'sub-mat',
      topic: '',
      activities: '',
      reflection: '',
      hadirCount: totalStudents,
      status: 'Terlaksana',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (entry: TeachingJournalEntry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      timeSlot: entry.timeSlot,
      subjectId: entry.subjectId,
      topic: entry.topic,
      activities: entry.activities,
      reflection: entry.reflection,
      hadirCount: entry.attendanceCount.hadir,
      status: entry.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      setFormError('Lingkup materi / topik wajib diisi.');
      return;
    }
    if (!formData.activities.trim()) {
      setFormError('Deskripsi kegiatan pembelajaran wajib diisi.');
      return;
    }

    const sub = subjects.find((s) => s.id === formData.subjectId);
    const subjectName = sub ? sub.name : 'Mata Pelajaran';

    if (editingEntry) {
      onUpdateJournal({
        ...editingEntry,
        date: formData.date,
        timeSlot: formData.timeSlot,
        subjectId: formData.subjectId,
        subjectName,
        topic: formData.topic,
        activities: formData.activities,
        reflection: formData.reflection,
        attendanceCount: { hadir: formData.hadirCount, total: totalStudents },
        status: formData.status,
      });
    } else {
      onAddJournal({
        date: formData.date,
        timeSlot: formData.timeSlot,
        subjectId: formData.subjectId,
        subjectName,
        topic: formData.topic,
        activities: formData.activities,
        reflection: formData.reflection,
        attendanceCount: { hadir: formData.hadirCount, total: totalStudents },
        status: formData.status,
      });
    }
    setIsModalOpen(false);
  };

  const filteredJournals = journals.filter((j) => {
    if (statusFilter === 'ALL') return true;
    return j.status === statusFilter;
  });

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Jurnal Mengajar Harian Guru</h2>
          <p className="text-xs text-slate-500">
            Agenda harian, pelaksanaan materi, dan catatan refleksi proses pembelajaran {school.gradeName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Jurnal Baru</span>
          </button>

          <button
            onClick={onPrintJournal}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Buku Jurnal</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
        <span className="text-slate-500 font-medium pl-2">Filter Pelaksanaan:</span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({journals.length})
          </button>
          <button
            onClick={() => setStatusFilter('Terlaksana')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              statusFilter === 'Terlaksana' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terlaksana ({journals.filter((j) => j.status === 'Terlaksana').length})
          </button>
          <button
            onClick={() => setStatusFilter('Tertunda')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              statusFilter === 'Tertunda' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tertunda ({journals.filter((j) => j.status === 'Tertunda').length})
          </button>
        </div>
      </div>

      {/* Journal Cards List */}
      <div className="space-y-3">
        {filteredJournals.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            Belum ada data jurnal mengajar. Klik tombol "Tulis Jurnal Baru" untuk menambahkan.
          </div>
        ) : (
          filteredJournals.map((jrn) => (
            <div
              key={jrn.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all text-xs space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-mono tabular-nums">{jrn.date}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{jrn.timeSlot}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {jrn.subjectName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      jrn.status === 'Terlaksana'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {jrn.status}
                  </span>

                  <button
                    onClick={() => openEditModal(jrn)}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                    title="Ubah Jurnal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteJournal(jrn.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Hapus Jurnal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800">Materi / Topik Pembelajaran:</span>{' '}
                <span className="text-slate-700">{jrn.topic}</span>
              </div>

              <div>
                <span className="font-bold text-slate-800">Ringkasan Kegiatan:</span>
                <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {jrn.activities}
                </p>
              </div>

              {jrn.reflection && (
                <div>
                  <span className="font-bold text-slate-800">Refleksi / Catatan Guru:</span>
                  <p className="text-slate-600 mt-1 leading-relaxed italic bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                    {jrn.reflection}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>
                  Kehadiran Siswa: <strong className="text-slate-800 font-mono tabular-nums">{jrn.attendanceCount.hadir}</strong> dari {jrn.attendanceCount.total} anak hadir
                </span>
                <span>Guru Pengajar: {school.teacherName}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah / Edit Jurnal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingEntry ? 'Ubah Catatan Jurnal Mengajar' : 'Tulis Jurnal Mengajar Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alokasi Waktu / Jam ke-</label>
                  <input
                    type="text"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    placeholder="Contoh: 07.30 - 09.15 (Jam ke 1-2)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Pembelajaran</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'Terlaksana' | 'Tertunda' | 'Pengganti',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Terlaksana">Terlaksana</option>
                    <option value="Tertunda">Tertunda</option>
                    <option value="Pengganti">Jam Pengganti</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Materi Pokok / Topik Pembelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Contoh: Pecahan Senilai dan Operasi Hitung Campuran"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kegiatan Pembelajaran (Apersepsi, Inti, Penutup) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.activities}
                  onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                  placeholder="Deskripsikan aktivitas guru dan peserta didik..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Refleksi Pembelajaran / Kendala & Solusi (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formData.reflection}
                  onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                  placeholder="Contoh: Siswa antusias mempraktikkan peraga konkret, perlu remedial bagi 2 siswa..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jumlah Siswa Hadir</label>
                <input
                  type="number"
                  min="0"
                  max={totalStudents}
                  value={formData.hadirCount}
                  onChange={(e) => setFormData({ ...formData, hadirCount: parseInt(e.target.value, 10) || 0 })}
                  className="w-32 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                />
                <span className="text-slate-400 ml-2">dari {totalStudents} anak</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  {editingEntry ? 'Simpan Perubahan' : 'Tambahkan Jurnal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
