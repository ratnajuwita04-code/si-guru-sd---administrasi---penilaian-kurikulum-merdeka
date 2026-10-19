import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  GraduationCap,
  BookOpen,
  FileQuestion,
  FileSpreadsheet,
  Settings,
  Info,
  X,
  User,
} from 'lucide-react';
import { DeveloperProfile, SchoolProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  school: SchoolProfile;
  developer: DeveloperProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAbout: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  school,
  developer,
  isOpenMobile,
  onCloseMobile,
  onOpenAbout,
  onOpenSettings,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dasbor Utama',
      icon: LayoutDashboard,
      description: 'Ringkasan & agenda hari ini',
    },
    {
      id: 'students',
      label: 'Data Siswa',
      icon: Users,
      description: 'Buku induk & biodata murid',
    },
    {
      id: 'attendance',
      label: 'Presensi Harian',
      icon: CalendarCheck,
      description: 'Absensi & rekapitulasi bulanan',
    },
    {
      id: 'assessment',
      label: 'Penilaian Merdeka',
      icon: GraduationCap,
      description: 'Formatif, sumatif & rapor',
    },
    {
      id: 'journal',
      label: 'Jurnal Mengajar',
      icon: BookOpen,
      description: 'Catatan harian & refleksi guru',
    },
    {
      id: 'questions',
      label: 'Bank Soal & Kuis',
      icon: FileQuestion,
      description: 'Koleksi soal SD & kuis interaktif',
    },
    {
      id: 'lessonPlans',
      label: 'Modul Ajar (RPP)',
      icon: FileSpreadsheet,
      description: 'Penyusun modul Kurikulum Merdeka',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">SI-GURU SD</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* School Badge Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="text-xs uppercase tracking-wider font-semibold text-emerald-800 mb-1">
            {school.gradeName}
          </div>
          <div className="font-bold text-slate-900 text-sm truncate" title={school.schoolName}>
            {school.schoolName}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            TP. {school.academicYear} · Semester {school.semester}
          </div>
        </div>

        {/* Nav List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Administrasi
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-tight truncate">
                    {item.label}
                  </div>
                  <div
                    className={`text-[11px] leading-normal truncate ${
                      isActive ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer Teacher & Developer Section */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
          {/* Guru Profile Bar */}
          <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200/80">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate" title={school.teacherName}>
                {school.teacherName}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                Guru Kelas SD
              </div>
            </div>
            <button
              onClick={onOpenSettings}
              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
              title="Ubah Profil Guru"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Developer Attribution (Per Prompt Section 2) */}
          <div className="px-2 pt-1 text-center">
            <button
              onClick={onOpenAbout}
              className="w-full text-left group hover:bg-emerald-50/60 p-1.5 rounded transition-colors"
            >
              <div className="text-[10px] text-slate-400 font-medium">Pengembang Aplikasi:</div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                {developer.name}
              </div>
              <div className="text-[11px] text-emerald-700 font-mono tabular-nums">
                {developer.phone}
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
