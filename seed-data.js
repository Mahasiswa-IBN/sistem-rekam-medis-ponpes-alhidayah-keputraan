// Seed data untuk Sistem Rekam Medis Pondok Pesantren Al-Hidayah Keputran
// Didesain untuk langsung dimuat ke LocalStorage jika data masih kosong.

window.INITIAL_DATA = {
  santri: [
    {
      id: "S001",
      name: "Muhammad Fatih Al-Fatih",
      gender: "Laki-laki",
      room: "Kamar 03 (Sunan Ampel)",
      dorm: "Putra",
      birthDate: "2009-04-12",
      parentName: "H. Sukron Amin",
      parentPhone: "081234567890",
      bloodType: "O",
      allergies: "Udang, Debu"
    },
    {
      id: "S002",
      name: "Ahmad Zaki Yamani",
      gender: "Laki-laki",
      room: "Kamar 05 (Sunan Giri)",
      dorm: "Putra",
      birthDate: "2010-08-22",
      parentName: "Bambang Pamungkas",
      parentPhone: "082345678901",
      bloodType: "B",
      allergies: "Tidak ada"
    },
    {
      id: "S003",
      name: "Fatimah Az-Zahra",
      gender: "Perempuan",
      room: "Kamar Khadijah 1",
      dorm: "Putri",
      birthDate: "2011-01-15",
      parentName: "Siti Aminah",
      parentPhone: "083456789012",
      bloodType: "A",
      allergies: "Dingin, Parasetamol"
    },
    {
      id: "S004",
      name: "Siti Aminah Lubis",
      gender: "Perempuan",
      room: "Kamar Aisyah 3",
      dorm: "Putri",
      birthDate: "2008-11-30",
      parentName: "Harun Lubis",
      parentPhone: "085678901234",
      bloodType: "AB",
      allergies: "Tidak ada"
    },
    {
      id: "S005",
      name: "Rizky Ramadhan",
      gender: "Laki-laki",
      room: "Kamar 01 (Sunan Kalijaga)",
      dorm: "Putra",
      birthDate: "2009-09-09",
      parentName: "M. Yunus",
      parentPhone: "087890123456",
      bloodType: "O",
      allergies: "Kacang-kacangan"
    },
    {
      id: "S006",
      name: "Naila Husna",
      gender: "Perempuan",
      room: "Kamar Fatimah 2",
      dorm: "Putri",
      birthDate: "2010-05-18",
      parentName: "Supriyanto",
      parentPhone: "089012345678",
      bloodType: "B",
      allergies: "Susu Sapi"
    },
    {
      id: "S007",
      name: "M. Dzakwan Al-Ghifari",
      gender: "Laki-laki",
      room: "Kamar 03 (Sunan Ampel)",
      dorm: "Putra",
      birthDate: "2008-02-25",
      parentName: "Achmad Shodiq",
      parentPhone: "081122334455",
      bloodType: "A",
      allergies: "Tidak ada"
    },
    {
      id: "S008",
      name: "Aisyah Humaira",
      gender: "Perempuan",
      room: "Kamar Khadijah 2",
      dorm: "Putri",
      birthDate: "2012-07-07",
      parentName: "H. Abdurrahman",
      parentPhone: "082233445566",
      bloodType: "O",
      allergies: "Ayam Sayur"
    },
    {
      id: "S009",
      name: "Yusuf Al-Baqir",
      gender: "Laki-laki",
      room: "Kamar 02 (Sunan Kalijaga)",
      dorm: "Putra",
      birthDate: "2007-12-11",
      parentName: "Faisal Tanjung",
      parentPhone: "083344556677",
      bloodType: "AB",
      allergies: "Udang"
    },
    {
      id: "S010",
      name: "Zahra Nur Latifah",
      gender: "Perempuan",
      room: "Kamar Aisyah 1",
      dorm: "Putri",
      birthDate: "2009-03-03",
      parentName: "Joko Susilo",
      parentPhone: "084455667788",
      bloodType: "A",
      allergies: "Tidak ada"
    },
    {
      id: "S011",
      name: "Luqman Hakim",
      gender: "Laki-laki",
      room: "Kamar 06 (Sunan Giri)",
      dorm: "Putra",
      birthDate: "2011-10-05",
      parentName: "Hasan Basri",
      parentPhone: "085566778899",
      bloodType: "B",
      allergies: "Cuaca Dingin"
    },
    {
      id: "S012",
      name: "Hafsah Binti Umar",
      gender: "Perempuan",
      room: "Kamar Fatimah 1",
      dorm: "Putri",
      birthDate: "2010-06-20",
      parentName: "Umar Hamzah",
      parentPhone: "086677889900",
      bloodType: "O",
      allergies: "Tidak ada"
    }
  ],
  obat: [
    {
      id: "O001",
      name: "Paracetamol 500mg",
      type: "Tablet",
      stock: 120,
      minStock: 20,
      expiryDate: "2027-12-15",
      description: "Pereda demam dan sakit kepala enteng."
    },
    {
      id: "O002",
      name: "Permethrin 5% (Scabimite)",
      type: "Salep",
      stock: 8,
      minStock: 10,
      expiryDate: "2027-08-30",
      description: "Obat khusus gatal-gatal akibat kutu scabies (kudis)."
    },
    {
      id: "O003",
      name: "Cetirizine 10mg",
      type: "Tablet",
      stock: 85,
      minStock: 15,
      expiryDate: "2027-05-10",
      description: "Antihistamin untuk alergi, gatal, dan pilek."
    },
    {
      id: "O004",
      name: "Antasida DOEN",
      type: "Tablet Kunyah",
      stock: 150,
      minStock: 25,
      expiryDate: "2028-02-18",
      description: "Obat sakit maag, nyeri lambung, dan kembung."
    },
    {
      id: "O005",
      name: "OBH (Obat Batuk Hitam) Sirup",
      type: "Sirup",
      stock: 12,
      minStock: 5,
      expiryDate: "2027-10-22",
      description: "Ekspektoran untuk meredakan batuk berdahak."
    },
    {
      id: "O006",
      name: "Diapet",
      type: "Kapsul",
      stock: 45,
      minStock: 10,
      expiryDate: "2027-09-05",
      description: "Membantu mengurangi frekuensi buang air besar (diare)."
    },
    {
      id: "O007",
      name: "Ibuprofen 400mg",
      type: "Tablet",
      stock: 60,
      minStock: 15,
      expiryDate: "2027-11-20",
      description: "Pereda nyeri sedang dan anti-inflamasi."
    },
    {
      id: "O008",
      name: "Amoxicillin 500mg",
      type: "Tablet",
      stock: 110,
      minStock: 30,
      expiryDate: "2027-07-15",
      description: "Antibiotik spektrum luas (harus dengan pengawasan)."
    },
    {
      id: "O009",
      name: "Betadine Antiseptic",
      type: "Cairan",
      stock: 5,
      minStock: 5,
      expiryDate: "2028-04-01",
      description: "Obat luar untuk sterilisasi dan mengobati luka bakar/gores."
    },
    {
      id: "O010",
      name: "Oralit",
      type: "Sachet",
      stock: 200,
      minStock: 30,
      expiryDate: "2028-06-30",
      description: "Mencegah dehidrasi akibat diare atau muntah-muntah."
    }
  ],
  rekamMedis: [
    {
      id: "RM001",
      date: "2026-05-15T09:30",
      santriId: "S001",
      symptoms: "Gatal-gatal di sela jari tangan dan selangkangan terutama di malam hari.",
      diagnosis: "Scabies (Kudis)",
      treatment: "Pembersihan luka ringan, edukasi jemur kasur dan cuci sprei dengan air panas.",
      medicineId: "O002", // Scabimite
      medicineQty: 1,
      status: "Rawat Jalan", // Istirahat di Kamar / Poskespes / Rujuk RS / Rawat Jalan (Aktif Sekolah)
      officer: "Ustadz Hanafi"
    },
    {
      id: "RM002",
      date: "2026-05-16T14:15",
      santriId: "S003",
      symptoms: "Demam tinggi sejak kemarin sore, pusing, dan badan pegal-pegal.",
      diagnosis: "Febris (Demam)",
      treatment: "Kompres air hangat, pemantauan suhu tubuh berkala (Suhu: 38.7 C).",
      medicineId: "O001", // Paracetamol
      medicineQty: 3, // Dosis 3x sehari
      status: "Istirahat di Poskespes",
      officer: "Ustadzah Fatimah"
    },
    {
      id: "RM003",
      date: "2026-05-18T08:00",
      santriId: "S002",
      symptoms: "Nyeri ulu hati, mual, kembung, mengaku telat sarapan karena piket.",
      diagnosis: "Gastritis (Maag)",
      treatment: "Diberikan makan bubur hangat, dianjurkan makan teratur.",
      medicineId: "O004", // Antasida
      medicineQty: 4,
      status: "Rawat Jalan",
      officer: "Ustadz Hanafi"
    },
    {
      id: "RM004",
      date: "2026-05-20T19:45",
      santriId: "S005",
      symptoms: "Batuk berdahak, pilek, hidung tersumbat, tenggorokan gatal.",
      diagnosis: "Influenza (Flu)",
      treatment: "Uap air hangat sederhana, dianjurkan perbanyak minum air hangat.",
      medicineId: "O005", // OBH Sirup
      medicineQty: 1,
      status: "Istirahat di Kamar",
      officer: "Ustadz Hanafi"
    },
    {
      id: "RM005",
      date: "2026-05-21T10:00",
      santriId: "S006",
      symptoms: "Buang air besar cair lebih dari 5 kali sejak pagi, lemas.",
      diagnosis: "Diare Akut",
      treatment: "Rehidrasi cepat dengan oralit cair.",
      medicineId: "O010", // Oralit
      medicineQty: 5,
      status: "Istirahat di Poskespes",
      officer: "Ustadzah Fatimah"
    },
    {
      id: "RM006",
      date: "2026-05-22T15:20",
      santriId: "S004",
      symptoms: "Sakit kepala berdenyut di bagian depan sejak siang.",
      diagnosis: "Cephalgia (Sakit Kepala)",
      treatment: "Dianjurkan tidur siang 1-2 jam.",
      medicineId: "O001", // Paracetamol
      medicineQty: 2,
      status: "Rawat Jalan",
      officer: "Ustadzah Fatimah"
    },
    {
      id: "RM007",
      date: "2026-05-24T09:00",
      santriId: "S007",
      symptoms: "Gatal-gatal kemerahan di punggung dan leher.",
      diagnosis: "Prurigo (Dermatitis Alergi)",
      treatment: "Identifikasi pemicu alergi.",
      medicineId: "O003", // Cetirizine
      medicineQty: 3,
      status: "Rawat Jalan",
      officer: "Ustadz Hanafi"
    },
    {
      id: "RM008",
      date: "2026-05-25T11:30",
      santriId: "S008",
      symptoms: "Luka lecet di lutut kanan karena terjatuh saat lari pagi.",
      diagnosis: "Vulnus Excoriatum (Luka Lecet)",
      treatment: "Dibersihkan dengan NaCl 0.9%, dioleskan antiseptik, dibalut kasa steril.",
      medicineId: "O009", // Betadine
      medicineQty: 1,
      status: "Rawat Jalan",
      officer: "Ustadzah Fatimah"
    },
    {
      id: "RM009",
      date: "2026-05-26T20:00",
      santriId: "S009",
      symptoms: "Sesak napas ringan setelah berolahraga malam.",
      diagnosis: "Asma Ringan (Kekambuhan)",
      treatment: "Edukasi untuk istirahat dan menghindari udara dingin berlebihan.",
      medicineId: "O003", // Cetirizine
      medicineQty: 2,
      status: "Istirahat di Kamar",
      officer: "Ustadz Hanafi"
    },
    {
      id: "RM010",
      date: "2026-05-27T08:15",
      santriId: "S010",
      symptoms: "Nyeri gigi kanan bawah, gusi sedikit bengkak.",
      diagnosis: "Pulpitis (Sakit Gigi)",
      treatment: "Kumur air garam hangat. Edukasi sikat gigi teratur.",
      medicineId: "O007", // Ibuprofen
      medicineQty: 3,
      status: "Rawat Jalan",
      officer: "Ustadzah Fatimah"
    },
    {
      id: "RM011",
      date: "2026-05-28T09:00",
      santriId: "S011",
      symptoms: "Demam, flu, dan menggigil sejak malam hari.",
      diagnosis: "Influenza (Flu)",
      treatment: "Dianjurkan istirahat total dan minum air hangat.",
      medicineId: "O001", // Paracetamol
      medicineQty: 3,
      status: "Istirahat di Kamar",
      officer: "Ustadz Hanafi"
    },
    {
      id: "RM012",
      date: "2026-05-29T14:00",
      santriId: "S012",
      symptoms: "Gatal-gatal di tangan, kaki, dan badan. Muncul bintil kemerahan berair.",
      diagnosis: "Scabies (Kudis)",
      treatment: "Diolesi salep scabimite tipis merata setelah mandi sore di seluruh tubuh kecuali wajah.",
      medicineId: "O002", // Scabimite
      medicineQty: 1,
      status: "Istirahat di Poskespes",
      officer: "Ustadzah Fatimah"
    },
    {
      id: "RM013",
      date: "2026-06-01T10:00",
      santriId: "S001",
      symptoms: "Batuk tidak berdahak, tenggorokan kering dan sakit saat menelan.",
      diagnosis: "Faringitis (Radang Tenggorokan)",
      treatment: "Kumur air garam hangat. Hindari gorengan dan es.",
      medicineId: "O008", // Amoxicillin (dengan pengawasan/resep)
      medicineQty: 10,
      status: "Rawat Jalan",
      officer: "Ustadz Hanafi"
    },
    {
      id: "RM014",
      date: "2026-06-02T16:00",
      santriId: "S003",
      symptoms: "Mual, muntah 2 kali, pusing, perut kembung.",
      diagnosis: "Gastritis (Maag)",
      treatment: "Diberikan teh manis hangat dan dikompres hangat bagian perut.",
      medicineId: "O004", // Antasida
      medicineQty: 6,
      status: "Rawat Jalan",
      officer: "Ustadzah Fatimah"
    },
    {
      id: "RM015",
      date: "2026-06-03T09:30",
      santriId: "S005",
      symptoms: "Suhu tubuh 39 C, menggigil, nyeri sendi hebat.",
      diagnosis: "Febris (Demam Tinggi)",
      treatment: "Kompres dingin, pantau suhu tiap 2 jam. Jika tidak turun dalam 24 jam rujuk klinik terdekat.",
      medicineId: "O001", // Paracetamol
      medicineQty: 6,
      status: "Rujuk Rumah Sakit",
      officer: "Ustadz Hanafi"
    }
  ]
};
