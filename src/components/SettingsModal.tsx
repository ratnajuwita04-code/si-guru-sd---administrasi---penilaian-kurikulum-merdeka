import React, { useState } from 'react';
import {
  Settings,
  School,
  User,
  Shield,
  Download,
  Upload,
  RotateCcw,
  X,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { DeveloperProfile, SchoolProfile, AppStateData } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolProfile;
  developer: DeveloperProfile;
  fullData: AppStateData;
  onSaveSchool: (school: SchoolProfile) => void;
  onSaveDeveloper: (developer: DeveloperProfile) => void;
  onExportBackup: () => void;
  onRestoreBackup: (restoredData: AppStateData) => void;
  onResetDefault: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  school,
  developer,
  fullData,
  onSaveSchool,
  onSaveDeveloper,
  onExportBackup,
  onRestoreBackup,
  onResetDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'school' | 'developer' | 'data'>('school');

  // School Form State
  const [schoolForm, setSchoolForm] = useState<SchoolProfile>({ ...school });
  // Developer Form State
  const [devForm, setDevForm] = useState<DeveloperProfile>({ ...developer });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchool(schoolForm);
    showToast('Profil sekolah dan guru kelas berhasil diperbarui!');
  };

  const handleSaveDeveloper = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDeveloper(devForm);
    showToast('Konfigurasi identitas pengembang berhasil diperbarui!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as AppStateData;
        if (!parsed.students || !parsed.school) {
          throw new Error('Format file cadangan tidak valid.');
        }
        onRestoreBackup(parsed);
        showToast('Data aplikasi berhasil dipulihkan dari cadangan JSON!');
        onClose();
      } catch (err: any) {
        alert('Gagal memulihkan data: Format file JSON tidak cocok atau rusak.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Pengaturan Sistem SI-GURU SD</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('school')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'school'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Profil Sekolah & Guru
          </button>
          <button
            onClick={() => setActiveTab('developer')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'developer'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Identitas Pengembang
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'data'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cadangan & Reset
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="m-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Tabs */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
          {/* TAB 1: PROFIL SEKOLAH & GURU */}
          {activeTab === 'school' && (
            <form onSubmit={handleSaveSchool} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan / SD</label>
                <input
                  type="text"
                  required
                  value={schoolForm.schoolName}
                  onChange={(e) => setSchoolForm({ ...schoolForm, schoolName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
                  <input
                    type="text"
                    value={schoolForm.npsn}
                    onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rombel / Kelas Binaan</label>
                  <input
                    type="text"
                    value={schoolForm.gradeName}
                    onChange={(e) => setSchoolForm({ ...schoolForm, gradeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Sekolah</label>
                <input
                  type="text"
                  value={schoolForm.address}
                  onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
                  <input
                    type="text"
                    value={schoolForm.academicYear}
                    onChange={(e) => setSchoolForm({ ...schoolForm, academicYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={schoolForm.semester}
                    onChange={(e) =>
                      setSchoolForm({ ...schoolForm, semester: e.target.value as 'Ganjil' | 'Genap' })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 block mb-2">Penandatangan Dokumen Resmi:</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nama Guru Kelas</label>
                    <input
                      type="text"
                      value={schoolForm.teacherName}
                      onChange={(e) => setSchoolForm({ ...schoolForm, teacherName: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">NIP Guru Kelas</label>
                    <input
                      type="text"
                      value={schoolForm.teacherNip}
                      onChange={(e) => setSchoolForm({ ...schoolForm, teacherNip: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nama Kepala Sekolah</label>
                    <input
                      type="text"
                      value={schoolForm.headmasterName}
                      onChange={(e) => setSchoolForm({ ...schoolForm, headmasterName: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">NIP Kepala Sekolah</label>
                    <input
                      type="text"
                      value={schoolForm.headmasterNip}
                      onChange={(e) => setSchoolForm({ ...schoolForm, headmasterNip: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Simpan Perubahan Profil
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: IDENTITAS PENGEMBANG (Sesuai Butir 2 Master Prompt) */}
          {activeTab === 'developer' && (
            <form onSubmit={handleSaveDeveloper} className="space-y-3.5">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-800 text-[11px] leading-relaxed">
                Bagian ini mengatur informasi identitas pengembang aplikasi yang ditampilkan secara proporsional pada sistem, sesuai ketentuan master prompt.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Pengembang <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={devForm.name}
                  onChange={(e) => setDevForm({ ...devForm, name: e.target.value })}
                  placeholder="Ratna Juwita, S.Pd.I"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Kontak Pengembang <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={devForm.phone}
                  onChange={(e) => setDevForm({ ...devForm, phone: e.target.value })}
                  placeholder="082372700566"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gelar / Peran Pengembang</label>
                <input
                  type="text"
                  value={devForm.title}
                  onChange={(e) => setDevForm({ ...devForm, title: e.target.value })}
                  placeholder="Pengembang Aplikasi & Guru Sekolah Dasar"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan / Dedikasi Pengembang</label>
                <textarea
                  rows={3}
                  value={devForm.note}
                  onChange={(e) => setDevForm({ ...devForm, note: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Simpan Konfigurasi Pengembang
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CADANGAN & PEMULIHAN DATA */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>Cadangkan Seluruh Data (Backup JSON)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Unduh seluruh database aplikasi (data siswa, presensi, nilai rapor, jurnal, dan modul ajar) dalam satu berkas file JSON yang aman untuk disimpan di komputer atau flashdisk.
                </p>
                <button
                  onClick={onExportBackup}
                  className="mt-1 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold shadow-xs flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File Cadangan JSON</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-700" />
                  <span>Pulihkan Data dari Berkas JSON (Restore)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Unggah berkas JSON cadangan yang telah diunduh sebelumnya untuk mengembalikan seluruh catatan administrasi kelas ke browser ini.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih Berkas JSON</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-2">
                <div className="font-bold text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Reset ke Data Awal Bawaan</span>
                </div>
                <p className="text-rose-700 text-[11px] leading-relaxed">
                  Tindakan ini akan mengembalikan data ke kondisi awal contoh sekolah. Seluruh data siswa yang baru diinput akan terhapus.
                </p>
                <button
                  onClick={() => setResetConfirmOpen(true)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Reset Semua Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Konfirmasi Reset */}
        {resetConfirmOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 text-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Yakin Mengembalikan ke Data Awal?</h4>
              <p className="text-slate-600 leading-relaxed">
                Tindakan ini akan menghapus data yang telah Anda ubah dan memuat kembali data siswa contoh.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onResetDefault();
                    setResetConfirmOpen(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg"
                >
                  Ya, Reset Sekarang
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Tutup Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};
