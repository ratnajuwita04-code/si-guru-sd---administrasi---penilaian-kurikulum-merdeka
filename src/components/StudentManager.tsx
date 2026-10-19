import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Download,
  Upload,
  Printer,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  Filter,
} from 'lucide-react';
import { SchoolProfile, Student } from '../types';
import { exportStudentsToCsv } from '../utils/storage';

interface StudentManagerProps {
  students: Student[];
  school: SchoolProfile;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onPrintStudentList: () => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  school,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onPrintStudentList,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'L' | 'P'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nisn: '',
    nis: '',
    name: '',
    gender: 'L' as 'L' | 'P',
    birthPlace: '',
    birthDate: '',
    parentName: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [formError, setFormError] = useState('');

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nisn.includes(searchTerm) ||
        s.nis.includes(searchTerm);
      const matchGender = genderFilter === 'ALL' || s.gender === genderFilter;
      return matchSearch && matchGender;
    });
  }, [students, searchTerm, genderFilter]);

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({
      nisn: '',
      nis: '',
      name: '',
      gender: 'L',
      birthPlace: '',
      birthDate: '2015-01-01',
      parentName: '',
      phone: '',
      address: '',
      notes: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nisn: student.nisn,
      nis: student.nis,
      name: student.name,
      gender: student.gender,
      birthPlace: student.birthPlace,
      birthDate: student.birthDate,
      parentName: student.parentName,
      phone: student.phone,
      address: student.address,
      notes: student.notes || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Nama lengkap siswa wajib diisi.');
      return;
    }
    if (!formData.nisn.trim()) {
      setFormError('NISN siswa wajib diisi.');
      return;
    }

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...formData,
      });
    } else {
      onAddStudent(formData);
    }
    setIsModalOpen(false);
  };

  const handleExportCsv = () => {
    exportStudentsToCsv(filteredStudents, school);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Data Siswa {school.gradeName}</h2>
          <p className="text-xs text-slate-500">
            Total {students.length} peserta didik ({students.filter((s) => s.gender === 'L').length} Laki-laki,{' '}
            {students.filter((s) => s.gender === 'P').length} Perempuan)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            title="Unduh format spreadsheet CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onPrintStudentList}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            title="Cetak Buku Induk / Daftar Siswa"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Daftar</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NISN, atau NIS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Jenis Kelamin:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setGenderFilter('ALL')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                genderFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setGenderFilter('L')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                genderFilter === 'L' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Laki-laki
            </button>
            <button
              onClick={() => setGenderFilter('P')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                genderFilter === 'P' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Perempuan
            </button>
          </div>
        </div>
      </div>

      {/* Table of Students */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-3 font-mono">NISN / NIS</th>
                <th className="py-3 px-3 text-center">L/P</th>
                <th className="py-3 px-3">TTL</th>
                <th className="py-3 px-3">Nama Orang Tua</th>
                <th className="py-3 px-3 font-mono">Kontak</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data siswa yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, idx) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      <button
                        onClick={() => setViewingStudent(std)}
                        className="hover:text-emerald-700 hover:underline text-left"
                      >
                        {std.name}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">
                      <div>{std.nisn}</div>
                      <div className="text-[10px] text-slate-400">NIS: {std.nis || '-'}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                          std.gender === 'L' ? 'bg-sky-50 text-sky-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {std.gender}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                      {std.birthPlace}, <span className="font-mono tabular-nums">{std.birthDate}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[130px]">
                      {std.parentName}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">
                      {std.phone}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingStudent(std)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded transition-colors"
                          title="Lihat Detail Profil"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(std)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                          title="Ubah Data Siswa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(std.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Siswa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingStudent ? 'Ubah Biodata Siswa' : 'Tambah Siswa Baru'}
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
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Muhammad Ihsan Pratama"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NISN <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="10 digit nomor NISN"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIS Sekolah</label>
                  <input
                    type="text"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="Nomor Induk Siswa"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  placeholder="Kota / Kabupaten Kelahiran"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Nama Ayah/Ibu/Wali"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. HP / WhatsApp Orang Tua</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Tempat Tinggal</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Alamat rumah lengkap"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Khusus Perkembangan / Minat</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan kepribadian, gaya belajar, atau prestasi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                />
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
                  {editingStudent ? 'Simpan Perubahan' : 'Tambahkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Biodata Siswa */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Profil Peserta Didik</h3>
              <button
                onClick={() => setViewingStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                  {viewingStudent.gender}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{viewingStudent.name}</h4>
                  <p className="text-slate-500 font-mono">
                    NISN: {viewingStudent.nisn} · NIS: {viewingStudent.nis || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600">
                <div>
                  <span className="text-[11px] text-slate-400 block">Tempat, Tanggal Lahir</span>
                  <span className="font-medium text-slate-800">
                    {viewingStudent.birthPlace}, {viewingStudent.birthDate}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Jenis Kelamin</span>
                  <span className="font-medium text-slate-800">
                    {viewingStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Orang Tua / Wali</span>
                  <span className="font-medium text-slate-800">{viewingStudent.parentName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Nomor Kontak</span>
                  <span className="font-medium text-slate-800 font-mono">{viewingStudent.phone}</span>
                </div>
              </div>

              <div className="text-slate-600 pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 block">Alamat</span>
                <span className="text-slate-800">{viewingStudent.address}</span>
              </div>

              {viewingStudent.notes && (
                <div className="text-slate-600 pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 block">Catatan Perkembangan</span>
                  <p className="text-slate-800 italic bg-slate-50 p-2 rounded border border-slate-100">
                    {viewingStudent.notes}
                  </p>
                </div>
              )}
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Hapus */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 text-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Konfirmasi Hapus Siswa</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Apakah Anda yakin ingin menghapus data siswa ini? Seluruh riwayat presensi dan nilai siswa bersangkutan akan ikut terhapus.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 text-white bg-rose-600 hover:bg-rose-700 rounded-lg font-semibold transition-colors"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
