import React from 'react';
import { School, UserCheck, Download, Settings, Info, Menu, Printer } from 'lucide-react';
import { DeveloperProfile, SchoolProfile } from '../types';

interface HeaderProps {
  school: SchoolProfile;
  developer: DeveloperProfile;
  activeTab: string;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onQuickPrint: () => void;
  onExportBackup: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  school,
  developer,
  activeTab,
  onOpenSettings,
  onOpenAbout,
  onQuickPrint,
  onExportBackup,
  onToggleMobileMenu,
}) => {
  // Translate activeTab to readable Indonesian breadcrumb
  const tabTitles: Record<string, string> = {
    dashboard: 'Dasbor Utama',
    students: 'Data Siswa',
    attendance: 'Presensi Harian',
    assessment: 'Penilaian Kurikulum Merdeka',
    journal: 'Jurnal Mengajar Harian',
    questions: 'Bank Soal & Kuis SD',
    lessonPlans: 'Modul Ajar (RPP)',
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 select-none">
      {/* Zone 1: Brand & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Buka Menu Navigasi"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight whitespace-nowrap">
                SI-GURU SD
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">
                {school.gradeName}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {tabTitles[activeTab] || 'Administrasi Guru'} · {school.schoolName}
            </p>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation Status / Quick Indicator */}
      <div className="hidden xl:flex items-center gap-5 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Tahun Ajaran:</span>
          <span className="font-semibold text-slate-800 tabular-nums">{school.academicYear} ({school.semester})</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Guru Kelas:</span>
          <span className="font-semibold text-slate-800">{school.teacherName}</span>
        </div>
      </div>

      {/* Zone 3: Actions (Print, Backup, Settings, About) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onQuickPrint}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Cetak Dokumen Resmi"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Cetak</span>
        </button>

        <button
          onClick={onExportBackup}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Cadangkan Seluruh Data (JSON)"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Cadangkan</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Pengaturan Sekolah & Guru"
          aria-label="Pengaturan"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenAbout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          title="Tentang Pengembang & Aplikasi"
        >
          <Info className="w-3.5 h-3.5 text-emerald-700" />
          <span className="hidden sm:inline">Tentang</span>
        </button>
      </div>
    </header>
  );
};
