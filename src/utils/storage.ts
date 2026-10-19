import { AppStateData, DeveloperProfile, SchoolProfile, Student, Subject, QuizQuestion, LessonPlan, TeachingJournalEntry } from '../types';

const STORAGE_KEY = 'si_guru_sd_data_v1';

export const DEFAULT_DEVELOPER: DeveloperProfile = {
  name: 'Ratna Juwita, S.Pd.I',
  phone: '082372700566',
  title: 'Pengembang Aplikasi & Guru Sekolah Dasar',
  note: 'Aplikasi manajemen kelas, administrasi harian, dan asesmen Kurikulum Merdeka yang dirancang praktis, efisien, dan siap pakai untuk guru di seluruh Indonesia.',
};

export const DEFAULT_SCHOOL: SchoolProfile = {
  schoolName: 'SD Negeri 01 Teladan',
  npsn: '10804321',
  address: 'Jl. Pendidikan Merdeka No. 12, Nusantara',
  headmasterName: 'Drs. H. Mulyadi, M.Pd.',
  headmasterNip: '196805121992031004',
  teacherName: 'Ratna Juwita, S.Pd.I',
  teacherNip: '198904152019022003',
  gradeName: 'Kelas IV (Fase B)',
  semester: 'Ganjil',
  academicYear: '2026/2027',
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    nisn: '0123456781',
    nis: '2401',
    name: 'Ahmad Farhan Pratama',
    gender: 'L',
    birthPlace: 'Palembang',
    birthDate: '2015-04-12',
    parentName: 'Bambang Irawan',
    phone: '081234567890',
    address: 'Jl. Kenanga No. 4',
    notes: 'Aktif berdiskusi, berminat tinggi dalam matematika dan sains.',
  },
  {
    id: 'std-2',
    nisn: '0123456782',
    nis: '2402',
    name: 'Aisyah Putri Azzahra',
    gender: 'P',
    birthPlace: 'Jakarta',
    birthDate: '2015-08-25',
    parentName: 'H. Suhendra',
    phone: '081398765432',
    address: 'Komplek Permata Hijau B-3',
    notes: 'Keterampilan membaca dan berbicara di depan kelas sangat baik.',
  },
  {
    id: 'std-3',
    nisn: '0123456783',
    nis: '2403',
    name: 'Bima Satria Wijaya',
    gender: 'L',
    birthPlace: 'Bandung',
    birthDate: '2015-02-17',
    parentName: 'Agus Wijaya',
    phone: '082155566778',
    address: 'Jl. Melati Indah No. 19',
    notes: 'Berbakat dalam seni rupa dan olahraga atletik.',
  },
  {
    id: 'std-4',
    nisn: '0123456784',
    nis: '2404',
    name: 'Dinda Kirana Maheswari',
    gender: 'P',
    birthPlace: 'Surabaya',
    birthDate: '2015-11-03',
    parentName: 'Rudi Hartono',
    phone: '085211223344',
    address: 'Gg. Cempaka Putih No. 8',
    notes: 'Rajin, teliti dalam mengerjakan LKPD kelompok.',
  },
  {
    id: 'std-5',
    nisn: '0123456785',
    nis: '2405',
    name: 'Fikri Haikal Ramadhan',
    gender: 'L',
    birthPlace: 'Medan',
    birthDate: '2015-06-19',
    parentName: 'Syamsul Bahri',
    phone: '087899887766',
    address: 'Jl. Dahlia Blok C No. 2',
    notes: 'Perlu sedikit motivasi tambahan pada numerasi pembagian.',
  },
  {
    id: 'std-6',
    nisn: '0123456786',
    nis: '2406',
    name: 'Hafizah Nur Syifa',
    gender: 'P',
    birthPlace: 'Semarang',
    birthDate: '2015-01-30',
    parentName: 'dr. Hendra Kusuma',
    phone: '081277665544',
    address: 'Perum Gading Asri No. 15',
    notes: 'Pemenang lomba membaca puisi tingkat gugus sekolah.',
  },
  {
    id: 'std-7',
    nisn: '0123456787',
    nis: '2407',
    name: 'Muhammad Rizky Alfatih',
    gender: 'L',
    birthPlace: 'Yogyakarta',
    birthDate: '2015-09-14',
    parentName: 'Nur Muhammad',
    phone: '081344556677',
    address: 'Jl. Anggrek No. 21',
    notes: 'Menunjukkan jiwa kepemimpinan saat kerja kelompok.',
  },
  {
    id: 'std-8',
    nisn: '0123456788',
    nis: '2408',
    name: 'Nabila Zahra Khairunnisa',
    gender: 'P',
    birthPlace: 'Padang',
    birthDate: '2015-05-08',
    parentName: 'Zulkifli Lubis',
    phone: '085322334455',
    address: 'Jl. Flamboyan Timur No. 7',
    notes: 'Sangat rapi dalam mencatat dan gemar membaca buku cerita di pojok baca.',
  },
  {
    id: 'std-9',
    nisn: '0123456789',
    nis: '2409',
    name: 'Rafa Aditya Pratama',
    gender: 'L',
    birthPlace: 'Surakarta',
    birthDate: '2015-10-22',
    parentName: 'Edi Santoso',
    phone: '089612348765',
    address: 'Jl. Bougenville No. 11',
    notes: 'Cepat tanggap dalam eksperimen sains IPAS.',
  },
  {
    id: 'std-10',
    nisn: '0123456790',
    nis: '2410',
    name: 'Siti Zahra Al-Munawwarah',
    gender: 'P',
    birthPlace: 'Lampung',
    birthDate: '2015-07-05',
    parentName: 'Mukhlis Hadi',
    phone: '082299881122',
    address: 'Jl. Mawar Melati No. 30',
    notes: 'Sopan, santun, dan taat beribadah serta hafal surat-surat pendek.',
  },
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-pai',
    code: 'PAI-BP',
    name: 'Pendidikan Agama Islam & Budi Pekerti',
    kkm: 75,
    category: 'Wajib',
    objectives: [
      { id: 'tp-pai-1', code: 'TP 1.1', scope: 'Al-Qur\'an dan Hadis', description: 'Membaca, menghafal, dan memahami pesan pokok Surah Al-Hujurat ayat 13 dengan tartil.' },
      { id: 'tp-pai-2', code: 'TP 1.2', scope: 'Akidah & Asmaul Husna', description: 'Mengenal Asmaul Husna (Al-Malik, Al-Aziz, Al-Quddus, As-Salam, Al-Mu’min) beserta artinya.' },
      { id: 'tp-pai-3', code: 'TP 1.3', scope: 'Akhlak Terpuji', description: 'Menampilkan perilaku menghargai keragaman dan hidup rukun dalam perbedaan.' },
    ],
  },
  {
    id: 'sub-pkn',
    code: 'PPKn',
    name: 'Pendidikan Pancasila',
    kkm: 75,
    category: 'Wajib',
    objectives: [
      { id: 'tp-pkn-1', code: 'TP 2.1', scope: 'Pancasila Dasar Negara', description: 'Mengidentifikasi makna sila-sila Pancasila dan penerapannya dalam kehidupan sehari-hari.' },
      { id: 'tp-pkn-2', code: 'TP 2.2', scope: 'Norma dan Aturan', description: 'Mematuhi norma, hak, dan kewajiban sebagai anggota keluarga dan warga sekolah.' },
      { id: 'tp-pkn-3', code: 'TP 2.3', scope: 'Keragaman Budaya', description: 'Menghargai keberagaman suku, agama, dan budaya di lingkungan tempat tinggal.' },
    ],
  },
  {
    id: 'sub-ind',
    code: 'B.IND',
    name: 'Bahasa Indonesia',
    kkm: 75,
    category: 'Wajib',
    objectives: [
      { id: 'tp-ind-1', code: 'TP 3.1', scope: 'Teks Deskripsi & Cerita', description: 'Menemukan informasi penting dan ide pokok dalam teks bacaan narasi sederhana.' },
      { id: 'tp-ind-2', code: 'TP 3.2', scope: 'Kata Homonim & Kamus', description: 'Memahami makna kata homonim serta menggunakan Kamus Besar Bahasa Indonesia (KBBI).' },
      { id: 'tp-ind-3', code: 'TP 3.3', scope: 'Menulis Paragraf', description: 'Menulis teks narasi dengan struktur kalimat efektif dan tanda baca yang tepat.' },
    ],
  },
  {
    id: 'sub-mat',
    code: 'MAT',
    name: 'Matematika',
    kkm: 70,
    category: 'Wajib',
    objectives: [
      { id: 'tp-mat-1', code: 'TP 4.1', scope: 'Bilangan Cacah Besar', description: 'Membaca, menulis, membandingkan bilangan cacah sampai 10.000 serta nilai tempatnya.' },
      { id: 'tp-mat-2', code: 'TP 4.2', scope: 'Pecahan Senilai', description: 'Memahami konsep pecahan senilai dan membandingkan dua pecahan berpenyebut sama.' },
      { id: 'tp-mat-3', code: 'TP 4.3', scope: 'Pengukuran Luas & Volume', description: 'Menghitung luas dan keliling bangun datar sederhana menggunakan satuan baku.' },
    ],
  },
  {
    id: 'sub-ipas',
    code: 'IPAS',
    name: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    kkm: 75,
    category: 'Wajib',
    objectives: [
      { id: 'tp-ipas-1', code: 'TP 5.1', scope: 'Bagian Tumbuhan & Fotosintesis', description: 'Mengidentifikasi fungsi akar, batang, daun, dan bunga serta proses fotosintesis.' },
      { id: 'tp-ipas-2', code: 'TP 5.2', scope: 'Wujud Zat & Perubahannya', description: 'Mengamati dan mendeskripsikan perubahan wujud zat padat, cair, dan gas.' },
      { id: 'tp-ipas-3', code: 'TP 5.3', scope: 'Gaya di Sekitar Kita', description: 'Membedakan pengaruh gaya otot, gaya gesek, gaya magnet, dan gaya gravitasi.' },
    ],
  },
  {
    id: 'sub-pjok',
    code: 'PJOK',
    name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
    kkm: 75,
    category: 'Wajib',
    objectives: [
      { id: 'tp-pjok-1', code: 'TP 6.1', scope: 'Gerak Dasar Permainan', description: 'Mempraktikkan variasi pola gerak dasar lokomotor, nonlokomotor, dan manipulatif bola besar.' },
      { id: 'tp-pjok-2', code: 'TP 6.2', scope: 'Kebugaran & Pola Hidup Bersih', description: 'Menerapkan pola hidup sehat dan kebersihan diri dalam aktivitas sehari-hari.' },
    ],
  },
  {
    id: 'sub-seni',
    code: 'SENI',
    name: 'Seni Rupa & Budaya',
    kkm: 75,
    category: 'Wajib',
    objectives: [
      { id: 'tp-seni-1', code: 'TP 7.1', scope: 'Eksplorasi Garis & Bentuk', description: 'Mengenal dan menerapkan ritme visual dalam pola garis serta bentuk geometris.' },
      { id: 'tp-seni-2', code: 'TP 7.2', scope: 'Kriya & Tekstur', description: 'Membuat karya dua atau tiga dimensi dengan memanfaatkan bahan alam ramah lingkungan.' },
    ],
  },
  {
    id: 'sub-ing',
    code: 'B.ING',
    name: 'Bahasa Inggris',
    kkm: 70,
    category: 'Muatan Lokal',
    objectives: [
      { id: 'tp-ing-1', code: 'TP 8.1', scope: 'Daily Activities', description: 'Merespons dan menggunakan kosakata sederhana terkait kegiatan sehari-hari di sekolah.' },
    ],
  },
];

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    subjectId: 'sub-mat',
    grade: 4,
    topic: 'Pecahan Senilai',
    type: 'pilihan_ganda',
    question: 'Pecahan berikut yang senilai dengan 2/4 adalah...',
    options: {
      a: '1/2',
      b: '3/5',
      c: '4/6',
      d: '2/8',
    },
    correctAnswer: 'A',
    explanation: 'Pecahan 2/4 disederhanakan dengan membagi pembilang dan penyebut dengan 2, menghasilkan 1/2.',
    difficulty: 'Mudah',
  },
  {
    id: 'q-2',
    subjectId: 'sub-ipas',
    grade: 4,
    topic: 'Bagian Tumbuhan & Fotosintesis',
    type: 'pilihan_ganda',
    question: 'Bagian daun yang berperan menangkap cahaya matahari untuk proses fotosintesis adalah...',
    options: {
      a: 'Kloroplas / Klorofil',
      b: 'Xilem batang',
      c: 'Ujung akar serabut',
      d: 'Kelopak mahkota bunga',
    },
    correctAnswer: 'A',
    explanation: 'Klorofil (zat hijau daun) berada di dalam kloroplas yang berfungsi menyerap energi sinar matahari.',
    difficulty: 'Sedang',
  },
  {
    id: 'q-3',
    subjectId: 'sub-ind',
    grade: 4,
    topic: 'Makna Kata Homonim',
    type: 'pilihan_ganda',
    question: 'Kata "bisa" yang berarti racun pada ular dan kemampuan melakukan sesuatu merupakan contoh dari...',
    options: {
      a: 'Sinonim',
      b: 'Antonim',
      c: 'Homonim',
      d: 'Akronim',
    },
    correctAnswer: 'C',
    explanation: 'Homonim adalah kata yang memiliki ejaan dan pelafalan sama tetapi maknanya berbeda.',
    difficulty: 'Sedang',
  },
  {
    id: 'q-4',
    subjectId: 'sub-pkn',
    grade: 4,
    topic: 'Penerapan Sila Pancasila',
    type: 'pilihan_ganda',
    question: 'Melakukan musyawarah mufakat saat memilih ketua kelas adalah cerminan dari pengamalan Pancasila sila ke...',
    options: {
      a: 'Kedua',
      b: 'Ketiga',
      c: 'Keempat',
      d: 'Kelima',
    },
    correctAnswer: 'C',
    explanation: 'Sila ke-4 berbunyi "Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan".',
    difficulty: 'Mudah',
  },
  {
    id: 'q-5',
    subjectId: 'sub-pai',
    grade: 4,
    topic: 'Asmaul Husna',
    type: 'pilihan_ganda',
    question: 'Asmaul Husna "Al-Quddus" memiliki arti Allah Maha...',
    options: {
      a: 'Merajai / Menguasai',
      b: 'Suci dari segala kekurangan',
      c: 'Pemberi Keselamatan',
      d: 'Pemberi Keamanan',
    },
    correctAnswer: 'B',
    explanation: 'Al-Quddus artinya Allah Maha Suci, bersih dari segala aib dan kekurangan.',
    difficulty: 'Mudah',
  },
  {
    id: 'q-6',
    subjectId: 'sub-ipas',
    grade: 4,
    topic: 'Perubahan Wujud Benda',
    type: 'uraian',
    question: 'Jelaskan mengapa es batu yang dibiarkan di udara terbuka lama-kelamaan mencair menjadi air!',
    correctAnswer: 'Es batu menyerap kalor (panas) dari udara sekitar sehingga suhunya naik dan terjadi perubahan wujud padat menjadi cair (mencair).',
    explanation: 'Peristiwa mencair terjadi karena adanya penyerapan kalor/energi panas dari lingkungan sekitar es.',
    difficulty: 'HOTS',
  },
];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp-1',
    title: 'Modul Ajar IPAS: Proses Fotosintesis & Pentingnya Tumbuhan Hijau',
    subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    grade: 4,
    semester: 1,
    academicYear: '2026/2027',
    timeAllocation: '2 x 35 Menit (1 Pertemuan)',
    learningPhase: 'Fase B (Kelas 3-4)',
    pancasilaDimensions: ['Beriman, bertakwa kepada Tuhan YME', 'Bernalar Kritis', 'Gotong Royong'],
    targetCompetency: 'Peserta didik memahami proses fotosintesis pada tumbuhan serta dampaknya bagi makhluk hidup di bumi.',
    learningObjective: 'Melalui eksperimen sederhana dan tayangan visual, peserta didik dapat menjelaskan bahan fotosintesis (air, CO2, cahaya matahari) dan hasilnya (glukosa, oksigen) dengan tepat.',
    triggerQuestions: 'Dari mana tumbuhan mendapatkan makanan? Apakah tumbuhan memasak seperti manusia?',
    facilities: 'Daun segar yang ditetesi air, senter/sinar matahari, botol kaca transparan, LKPD kelompok.',
    activitiesOpening: '1. Guru menyapa, berdoa bersama, dan mengecek kehadiran.\n2. Apersepsi: Guru menunjukkan pot tanaman segar dan menanyakan apa yang terjadi jika tanaman ditutup kardus tanpa cahaya.\n3. Menyampaikan tujuan pembelajaran dan alur aktivitas hari ini.',
    activitiesCore: '1. Peserta didik dibagi ke dalam kelompok kecil (4-5 siswa).\n2. Melakukan pengamatan gelembung oksigen pada daun dalam air di bawah sinar matahari.\n3. Berdiskusi menjawab pertanyaan pada LKPD Fotosintesis.\n4. Perwakilan kelompok mempresentasikan hasil pengamatan.\n5. Guru memberikan penguatan konsep rumus sederhana fotosintesis.',
    activitiesClosing: '1. Peserta didik dan guru membuat kesimpulan bersama.\n2. Melakukan refleksi pembelajaran: "Bagian mana yang paling kamu sukai hari ini?".\n3. Doa penutup dan salam.',
    assessmentMethods: 'Asesmen Formatif: Observasi keaktifan diskusi dan penilaian LKPD kelompok.',
    studentWorksheet: 'LKPD 1: Tuliskan 3 bahan utama yang diperlukan tumbuhan untuk berfotosintesis dan sebutkan 2 hasil yang dihasilkannya!',
    createdAt: '2026-10-15',
  },
];

export const INITIAL_JOURNALS: TeachingJournalEntry[] = [
  {
    id: 'jrn-1',
    date: '2026-10-16',
    timeSlot: '07.30 - 09.15 (Jam ke 1-2)',
    subjectId: 'sub-mat',
    subjectName: 'Matematika',
    topic: 'Pecahan Senilai dengan Benda Konkret',
    activities: 'Memotong kertas origami menjadi beberapa bagian sama besar untuk menemukan konsep pecahan senilai.',
    reflection: 'Siswa sangat antusias dengan peraga kertas. Namun beberapa siswa masih ragu saat membandingkan 1/2 dengan 2/4.',
    attendanceCount: { hadir: 10, total: 10 },
    status: 'Terlaksana',
  },
  {
    id: 'jrn-2',
    date: '2026-10-17',
    timeSlot: '09.30 - 11.00 (Jam ke 3-4)',
    subjectId: 'sub-ipas',
    subjectName: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    topic: 'Pengamatan Fotosintesis dan Bagian Daun',
    activities: 'Pengamatan daun tanaman air di halaman sekolah untuk membuktikan pelepasan oksigen.',
    reflection: 'Pembelajaran kontekstual berjalan baik, siswa aktif bertanya mengenai stomata dan klorofil.',
    attendanceCount: { hadir: 9, total: 10 },
    status: 'Terlaksana',
  },
];

export function getInitialState(): AppStateData {
  // Pre-populate some scores
  const sampleScores = INITIAL_STUDENTS.map((std, idx) => ({
    studentId: std.id,
    subjectId: 'sub-mat',
    formativeScores: {
      'tp-mat-1': 78 + (idx % 4) * 5,
      'tp-mat-2': 75 + ((idx + 2) % 5) * 4,
      'tp-mat-3': 80 + (idx % 3) * 6,
    },
    summativeMaterialScores: {
      'Bilangan Cacah Besar': 82 + (idx % 4) * 4,
      'Pecahan Senilai': 76 + (idx % 3) * 6,
    },
    summativeExamScore: 80 + (idx % 5) * 4,
  }));

  // Initial attendance for today
  const today = new Date().toISOString().split('T')[0];
  const todayRecords: Record<string, 'H' | 'S' | 'I' | 'A'> = {};
  INITIAL_STUDENTS.forEach((s, idx) => {
    todayRecords[s.id] = idx === 4 ? 'I' : idx === 8 ? 'S' : 'H';
  });

  return {
    version: 1,
    school: DEFAULT_SCHOOL,
    developer: DEFAULT_DEVELOPER,
    students: INITIAL_STUDENTS,
    subjects: INITIAL_SUBJECTS,
    attendance: {
      [today]: {
        date: today,
        records: todayRecords,
        notes: {
          'std-5': 'Izin urusan keluarga',
          'std-9': 'Sakit demam',
        },
      },
    },
    scores: sampleScores,
    journals: INITIAL_JOURNALS,
    questions: INITIAL_QUESTIONS,
    lessonPlans: INITIAL_LESSON_PLANS,
  };
}

export function loadAppData(): AppStateData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      saveAppData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppStateData;
    // Schema sanity check
    if (!parsed.students || !Array.isArray(parsed.students) || !parsed.school) {
      throw new Error('Data tidak sesuai format skema.');
    }
    // Ensure developer config matches requested default if missing
    if (!parsed.developer) {
      parsed.developer = DEFAULT_DEVELOPER;
    }
    return parsed;
  } catch (error) {
    console.warn('Gagal membaca localStorage, memuat data default:', error);
    const initial = getInitialState();
    saveAppData(initial);
    return initial;
  }
}

export function saveAppData(data: AppStateData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Gagal menyimpan ke localStorage:', error);
    return false;
  }
}

export function exportDataAsJson(data: AppStateData) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `backup_siguru_sd_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportStudentsToCsv(students: Student[], school: SchoolProfile) {
  const headers = ['No', 'NISN', 'NIS', 'Nama Lengkap', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Nama Orang Tua/Wali', 'No HP', 'Alamat', 'Catatan'];
  const rows = students.map((s, idx) => [
    idx + 1,
    `"${s.nisn}"`,
    `"${s.nis}"`,
    `"${s.name}"`,
    s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
    `"${s.birthPlace}"`,
    s.birthDate,
    `"${s.parentName}"`,
    `"${s.phone}"`,
    `"${s.address}"`,
    `"${s.notes || ''}"`,
  ]);

  const csvContent = '\uFEFF' + [
    `"DATA SISWA ${school.gradeName.toUpperCase()} - ${school.schoolName.toUpperCase()}"`,
    `"Tahun Pelajaran: ${school.academicYear} | Semester: ${school.semester}"`,
    '',
    headers.join(','),
    ...rows.map(r => r.join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `daftar_siswa_${school.gradeName.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
