import React from 'react';
import {
  Info,
  School,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  X,
  FileCheck,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import { DeveloperProfile, SchoolProfile } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  developer: DeveloperProfile;
  school: SchoolProfile;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  developer,
  school,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-emerald-50/60">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Tentang Aplikasi & Pengembang</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Main App Overview */}
          <div className="text-center space-y-1.5 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <School className="w-6 h-6" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">
              SI-GURU SD (Sistem Informasi Administrasi Guru SD)
            </h2>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              Platform administrasi pembelajaran, presensi harian, penilaian Kurikulum Merdeka, modul ajar, dan bank soal terpadu untuk pendidik Sekolah Dasar.
            </p>
          </div>

          {/* Developer Card (Section 2 Prompt) */}
          <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-xl p-4 border border-emerald-200/90 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>Identitas Pengembang Aplikasi</span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Nama Pengembang:</div>
                  <div className="text-sm font-bold text-slate-900">{developer.name}</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Pendidik & Developer
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-slate-500">Nomor Kontak:</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">{developer.phone}</span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                {developer.note}
              </p>
            </div>
          </div>

          {/* Key Capabilities */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Keunggulan & Fitur Utama:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Buku Induk & Manajemen Data Siswa Lengkap</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Presensi Harian 1-Klik & Rekapitulasi Bulanan</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Otomatisasi Deskripsi Capaian Rapor Kurikulum Merdeka</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Penyusun Modul Ajar (RPP) Lengkap dengan LKPD</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Bank Soal SD & Simulasi Kuis Interaktif Ramah Anak</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ekspor CSV, Cadangan JSON & Format Cetak Dinas A4</span>
              </div>
            </div>
          </div>

          {/* Keamanan & Privasi */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-slate-800">Privasi & Keamanan Data Lokal</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Aplikasi ini beroperasi 100% di browser Anda menggunakan teknologi Web Storage lokal. Seluruh biodata siswa dan nilai rapor tersimpan aman di perangkat guru tanpa dikirim ke server pihak ketiga. Gunakan fitur Cadangkan Data (JSON) secara berkala.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-slate-500 text-[11px]">
          <span>© 2026 {developer.name}. Hak Cipta Dilindungi.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
