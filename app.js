// Logic Utama - Sistem Rekam Medis Pondok Pesantren Al-Hidayah Keputran

// State Management
let state = {
  santri: [],
  obat: [],
  rekamMedis: [],
  activeSantriId: null,
  activeRMId: null
};

// LocalStorage Keys
const STORAGE_KEYS = {
  SANTRI: 'alhidayah_santri',
  OBAT: 'alhidayah_obat',
  REKAM_MEDIS: 'alhidayah_rekam_medis',
  THEME: 'alhidayah_theme'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadData();
  setupRouting();
  setupEventListeners();
  setupAuthEvents();
  
  if (isLoggedIn()) {
    checkAuth();
    navigateTo('dashboard'); // Default page
  } else {
    checkAuth();
  }
});

// Authentication Helpers
function isLoggedIn() {
  return localStorage.getItem('alhidayah_admin_logged_in') === 'true';
}

function checkAuth() {
  if (isLoggedIn()) {
    document.body.classList.remove('not-logged-in');
    loadAdminAvatar();
  } else {
    document.body.classList.add('not-logged-in');
  }
}

function loadAdminAvatar() {
  const savedAvatar = localStorage.getItem('alhidayah_admin_avatar');
  const sidebarImg = document.getElementById('sidebar-avatar-img');
  const sidebarIcon = document.getElementById('sidebar-avatar-icon');
  const headerImg = document.getElementById('header-avatar-img');
  const headerIcon = document.getElementById('header-avatar-icon');
  
  if (savedAvatar) {
    if (sidebarImg) {
      sidebarImg.src = savedAvatar;
      sidebarImg.style.display = 'block';
    }
    if (sidebarIcon) sidebarIcon.style.display = 'none';
    
    if (headerImg) {
      headerImg.src = savedAvatar;
      headerImg.style.display = 'block';
    }
    if (headerIcon) headerIcon.style.display = 'none';
  } else {
    if (sidebarImg) {
      sidebarImg.src = '';
      sidebarImg.style.display = 'none';
    }
    if (sidebarIcon) sidebarIcon.style.display = 'flex';
    
    if (headerImg) {
      headerImg.src = '';
      headerImg.style.display = 'none';
    }
    if (headerIcon) headerIcon.style.display = 'flex';
  }
}

function setupAuthEvents() {
  // Login Form Submission
  const loginForm = document.getElementById('form-login');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('login-username');
      const passwordInput = document.getElementById('login-password');
      const errorMsg = document.getElementById('login-error');
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('alhidayah_admin_logged_in', 'true');
        errorMsg.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
        checkAuth();
        navigateTo('dashboard');
        showNotification('Berhasil Masuk', 'Selamat datang kembali, Admin!');
      } else {
        errorMsg.style.display = 'flex';
        // shake effect on card
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
          loginCard.style.animation = 'none';
          void loginCard.offsetWidth; // trigger reflow
          loginCard.style.animation = 'shake 0.3s ease-in-out';
        }
        passwordInput.value = '';
        passwordInput.focus();
      }
    });
  }

  // Logout Button
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
        localStorage.removeItem('alhidayah_admin_logged_in');
        checkAuth();
        showNotification('Keluar Selesai', 'Anda telah berhasil keluar dari sistem.');
      }
    });
  }

  // Password Visibility Toggle
  const togglePasswordBtn = document.getElementById('btn-toggle-password');
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const passwordInput = document.getElementById('login-password');
      const icon = togglePasswordBtn.querySelector('i');
      if (passwordInput && icon) {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          icon.className = 'fas fa-eye-slash';
        } else {
          passwordInput.type = 'password';
          icon.className = 'fas fa-eye';
        }
      }
    });
  }

  // Admin Avatar Upload Handling
  const avatarInput = document.getElementById('admin-avatar-input');
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Silakan pilih file gambar yang valid.');
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          alert('Ukuran file terlalu besar! Maksimal 2MB.');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            localStorage.setItem('alhidayah_admin_avatar', event.target.result);
            loadAdminAvatar();
            showNotification('Foto Diperbarui', 'Foto profil admin berhasil diubah.');
          } catch (err) {
            console.error(err);
            alert('Gagal menyimpan foto. Ukuran file mungkin terlalu besar.');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Obfuscation / Simple Encryption for NIK to secure it in LocalStorage
function encodeNIK(nik) {
  if (!nik) return '';
  return nik.split('').map(c => {
    if (isNaN(c)) return c;
    return String((parseInt(c) + 3) % 10);
  }).join('');
}

function decodeNIK(obfuscatedNik) {
  if (!obfuscatedNik) return '';
  return obfuscatedNik.split('').map(c => {
    if (isNaN(c)) return c;
    return String((parseInt(c) + 10 - 3) % 10);
  }).join('');
}

// Load data from LocalStorage or seed data
function loadData() {
  const localSantri = localStorage.getItem(STORAGE_KEYS.SANTRI);
  const localObat = localStorage.getItem(STORAGE_KEYS.OBAT);
  const localRM = localStorage.getItem(STORAGE_KEYS.REKAM_MEDIS);

  if (localSantri && localObat && localRM) {
    state.santri = JSON.parse(localSantri);
    state.obat = JSON.parse(localObat);
    state.rekamMedis = JSON.parse(localRM);
    
    // Decrypt NIKs loaded from localstorage
    state.santri.forEach(s => {
      if (s.nik) s.nik = decodeNIK(s.nik);
    });
  } else {
    // Load default seed data
    state.santri = window.INITIAL_DATA.santri;
    state.obat = window.INITIAL_DATA.obat;
    state.rekamMedis = window.INITIAL_DATA.rekamMedis;
    saveAllToStorage();
  }
}

// Save helpers
function saveAllToStorage() {
  // Encrypt NIKs when saving to localstorage to secure sensitive data
  const santriToSave = state.santri.map(s => {
    return { ...s, nik: encodeNIK(s.nik) };
  });
  
  localStorage.setItem(STORAGE_KEYS.SANTRI, JSON.stringify(santriToSave));
  localStorage.setItem(STORAGE_KEYS.OBAT, JSON.stringify(state.obat));
  localStorage.setItem(STORAGE_KEYS.REKAM_MEDIS, JSON.stringify(state.rekamMedis));
}

function saveKey(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-toggle-btn i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// SPA Routing
function setupRouting() {
  const navLinks = document.querySelectorAll('.sidebar-nav a, .mobile-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      navigateTo(pageId);
      
      // Close mobile sidebar if open
      document.querySelector('.sidebar').classList.remove('active');
    });
  });

  // Mobile Menu Toggle
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('active');
    });
  }
}

function navigateTo(pageId) {
  // Update active navigation item in sidebar
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    const link = item.querySelector('a');
    if (link && link.getAttribute('data-page') === pageId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Toggle Page views
  document.querySelectorAll('.page-view').forEach(view => {
    if (view.id === `${pageId}-page`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Page Specific rendering
  switch(pageId) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'santri':
      renderSantriList();
      break;
    case 'rekam-medis':
      renderRMList();
      populateRMSantriDropdown();
      populateRMObatDropdown();
      break;
    case 'obat':
      renderObatList();
      break;
    case 'analisis':
      renderAnalytics();
      break;
    case 'riwayat-santri':
      renderSantriHistoryPage();
      break;
  }
}

// Global Event Listeners Setup
function setupEventListeners() {
  // Theme Toggle Button
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Modals Close
  document.querySelectorAll('.modal-close-btn, .btn-close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Form Submissions
  document.getElementById('form-santri').addEventListener('submit', handleSantriSubmit);
  document.getElementById('form-obat').addEventListener('submit', handleObatSubmit);
  document.getElementById('form-rekam-medis').addEventListener('submit', handleRMSubmit);

  // Cek NIK Auto-fill Button
  const btnCekNik = document.getElementById('btn-cek-nik');
  if (btnCekNik) {
    btnCekNik.addEventListener('click', handleCekNik);
  }

  // Searches and Filters
  document.getElementById('search-santri').addEventListener('input', renderSantriList);
  document.getElementById('filter-dorm-santri').addEventListener('change', renderSantriList);

  document.getElementById('search-rm').addEventListener('input', renderRMList);
  document.getElementById('filter-status-rm').addEventListener('change', renderRMList);

  document.getElementById('search-obat').addEventListener('input', renderObatList);
  
  // Custom Validation: Obat Stock deduct preview in RM Form
  document.getElementById('rm-obat-qty').addEventListener('input', validateObatQtyInForm);
  document.getElementById('rm-obat-select').addEventListener('change', validateObatQtyInForm);

  // Print History & Detail RM Buttons
  const btnPrintHistory = document.getElementById('btn-print-history');
  if (btnPrintHistory) {
    btnPrintHistory.addEventListener('click', printSantriHistory);
  }

  const btnPrintDetailRM = document.getElementById('btn-print-detail-rm');
  if (btnPrintDetailRM) {
    btnPrintDetailRM.addEventListener('click', () => {
      if (state.activeRMId) {
        printSingleRMDetail(state.activeRMId);
      } else {
        alert('Data rekam medis tidak ditemukan.');
      }
    });
  }
}

// -------------------------------------------------------------
// DASHBOARD VIEW
// -------------------------------------------------------------
function renderDashboard() {
  // 1. Calculate Stats
  const totalSantri = state.santri.length;
  const totalRM = state.rekamMedis.length;
  
  // Sick Students (active status: Istirahat di Kamar, Istirahat di Poskespes, Rujuk RS)
  const activeSick = state.rekamMedis.filter(rm => 
    rm.status === 'Istirahat di Kamar' || 
    rm.status === 'Istirahat di Poskespes' || 
    rm.status === 'Rujuk Rumah Sakit'
  ).length;

  // Low Stock Medicines
  const lowStockObat = state.obat.filter(o => o.stock <= o.minStock).length;

  // Update DOM Stats
  document.getElementById('stat-total-santri').innerText = totalSantri;
  document.getElementById('stat-total-rm').innerText = totalRM;
  document.getElementById('stat-sakit-aktif').innerText = activeSick;
  document.getElementById('stat-obat-kritis').innerText = lowStockObat;

  // 2. Render Recent Check-ups (Top 5)
  const recentLogsList = document.getElementById('recent-logs-list');
  recentLogsList.innerHTML = '';
  
  const sortedRM = [...state.rekamMedis].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  
  if (sortedRM.length === 0) {
    recentLogsList.innerHTML = '<div class="empty-state"><p>Belum ada pemeriksaan medis terbaru.</p></div>';
  } else {
    sortedRM.forEach(rm => {
      const santriObj = state.santri.find(s => s.id === rm.santriId) || { name: 'Santri Terhapus', dorm: '-' };
      const dateFormatted = formatDateTime(rm.date);
      
      const item = document.createElement('div');
      item.className = 'recent-item';
      
      let badgeClass = 'badge-jalan';
      if (rm.status === 'Istirahat di Kamar') badgeClass = 'badge-kamar';
      else if (rm.status === 'Istirahat di Poskespes') badgeClass = 'badge-poskespes';
      else if (rm.status === 'Rujuk Rumah Sakit') badgeClass = 'badge-rujuk';

      item.innerHTML = `
        <div class="recent-avatar">
          <i class="fas fa-user-md"></i>
        </div>
        <div class="recent-body">
          <div class="recent-title">${santriObj.name}</div>
          <div class="recent-desc">
            <strong>Diagnosis:</strong> ${rm.diagnosis} <br/>
            <strong>Gejala:</strong> ${rm.symptoms.substring(0, 45)}${rm.symptoms.length > 45 ? '...' : ''}
          </div>
          <div style="margin-top: 0.35rem">
            <span class="badge ${badgeClass}"><span class="badge-dot"></span>${rm.status}</span>
          </div>
        </div>
        <div class="recent-time">${dateFormatted}</div>
      `;
      recentLogsList.appendChild(item);
    });
  }

  // 3. Render Medicine Alerts
  const medicineAlertsList = document.getElementById('medicine-alerts-list');
  medicineAlertsList.innerHTML = '';
  
  const lowStockItems = state.obat.filter(o => o.stock <= o.minStock);
  
  if (lowStockItems.length === 0) {
    medicineAlertsList.innerHTML = `
      <div class="empty-state" style="padding: 1.5rem 0;">
        <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--success); margin-bottom: 0.5rem"></i>
        <h4>Semua Stok Aman</h4>
        <p>Tidak ada stok obat yang menipis.</p>
      </div>
    `;
  } else {
    lowStockItems.forEach(o => {
      const alertItem = document.createElement('div');
      alertItem.className = 'recent-item';
      
      const isCritical = o.stock === 0;
      const progressPercent = Math.min((o.stock / o.minStock) * 100, 100);
      const colorClass = isCritical ? 'stock-empty' : 'stock-low';

      alertItem.innerHTML = `
        <div class="recent-avatar" style="color: ${isCritical ? 'var(--danger)' : 'var(--warning)'}">
          <i class="fas ${isCritical ? 'fa-exclamation-triangle' : 'fa-box-open'}"></i>
        </div>
        <div class="recent-body">
          <div class="recent-title">${o.name} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted)">(${o.type})</span></div>
          <div class="recent-desc">
            Stok saat ini: <strong>${o.stock}</strong> (Minimal: ${o.minStock})
          </div>
          <div class="stock-level" style="margin-top: 0.35rem">
            <div class="stock-bar-outer">
              <div class="stock-bar-inner" style="width: ${progressPercent}%; background-color: ${isCritical ? 'var(--danger)' : 'var(--warning)'}"></div>
            </div>
            <span class="${colorClass}" style="font-size: 0.75rem; font-weight: 600;">
              ${isCritical ? 'HABIS' : 'MENIPIS'}
            </span>
          </div>
        </div>
      `;
      medicineAlertsList.appendChild(alertItem);
    });
  }
}

// -------------------------------------------------------------
// SANTRI VIEW
// -------------------------------------------------------------
function renderSantriList() {
  const tbody = document.getElementById('table-santri-body');
  tbody.innerHTML = '';
  
  const searchQuery = document.getElementById('search-santri').value.toLowerCase();
  const dormFilter = document.getElementById('filter-dorm-santri').value;

  const filteredSantri = state.santri.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery) || 
                          s.id.toLowerCase().includes(searchQuery) ||
                          s.parentName.toLowerCase().includes(searchQuery);
    const matchesDorm = dormFilter === 'all' || s.dorm === dormFilter;
    return matchesSearch && matchesDorm;
  });

  if (filteredSantri.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem 0;">
          <div class="empty-state">
            <i class="fas fa-users-slash"></i>
            <h4>Santri Tidak Ditemukan</h4>
            <p>Cobalah mengganti filter atau kata kunci pencarian Anda.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  filteredSantri.forEach(s => {
    const tr = document.createElement('tr');
    
    // Initial avatar text
    const initial = s.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const avatarType = s.gender === 'Laki-laki' ? 'L' : 'P';
    const age = calculateAge(s.birthDate);

    // Mask NIK by default: 320102******0001
    const rawNik = s.nik || '-';
    let maskedNik = rawNik;
    if (rawNik.length === 16) {
      maskedNik = rawNik.substring(0, 6) + '******' + rawNik.substring(12);
    }

    tr.innerHTML = `
      <td>
        <div class="user-cell">
          <div class="user-avatar ${avatarType}">${initial}</div>
          <div class="user-info">
            <span class="user-name">${s.name}</span>
            <span class="user-sub" style="display:flex; align-items:center; gap:0.25rem; flex-wrap:wrap;">
              ID: ${s.id} | NIK: 
              <span class="nik-value" data-raw="${rawNik}" data-masked="${maskedNik}">${maskedNik}</span>
              <button class="btn-toggle-nik-visibility" onclick="toggleNikVisibility(this)" title="Tampilkan/Sembunyikan NIK" style="background:none; border:none; padding:0; display:inline-flex; align-items:center; color:var(--text-secondary); cursor:pointer;">
                <i class="fas fa-eye-slash" style="font-size:0.75rem;"></i>
              </button>
            </span>
          </div>
        </div>
      </td>
      <td>${s.dorm}</td>
      <td>${s.room}</td>
      <td>${age} Tahun</td>
      <td>
        <div style="font-weight: 500">${s.parentName}</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary)"><i class="fas fa-phone"></i> ${s.parentPhone}</div>
      </td>
      <td>
        <div class="action-group">
          <button class="btn btn-secondary btn-sm btn-icon" style="color: var(--primary)" onclick="viewSantriHistory('${s.id}')" title="Lihat Riwayat Medis">
            <i class="fas fa-notes-medical"></i>
          </button>
          <button class="btn btn-secondary btn-sm btn-icon" onclick="openEditSantriModal('${s.id}')" title="Edit Profil">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteSantri('${s.id}')" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddSantriModal() {
  document.getElementById('modal-santri-title').innerText = 'Tambah Data Santri';
  document.getElementById('form-santri').reset();
  document.getElementById('santri-action-type').value = 'add';
  document.getElementById('santri-id-edit').value = '';
  
  // Reset NIK feedback
  const feedback = document.getElementById('nik-check-feedback');
  if (feedback) {
    feedback.style.display = 'none';
    feedback.innerText = '';
  }
  
  // Make NIK input editable
  const nikInput = document.getElementById('santri-nik');
  if (nikInput) {
    nikInput.disabled = false;
  }
  
  openModal('modal-santri');
}

function openEditSantriModal(id) {
  const santri = state.santri.find(s => s.id === id);
  if (!santri) return;

  document.getElementById('modal-santri-title').innerText = 'Edit Data Santri';
  document.getElementById('santri-action-type').value = 'edit';
  document.getElementById('santri-id-edit').value = id;

  // Populate fields
  document.getElementById('santri-nik').value = santri.nik || '';
  document.getElementById('santri-name').value = santri.name;
  document.getElementById('santri-gender').value = santri.gender;
  document.getElementById('santri-dorm').value = santri.dorm;
  document.getElementById('santri-room').value = santri.room;
  document.getElementById('santri-birthdate').value = santri.birthDate;
  document.getElementById('santri-parent').value = santri.parentName;
  document.getElementById('santri-phone').value = santri.parentPhone;
  document.getElementById('santri-blood').value = santri.bloodType;
  document.getElementById('santri-allergies').value = santri.allergies;

  // Reset NIK feedback
  const feedback = document.getElementById('nik-check-feedback');
  if (feedback) {
    feedback.style.display = 'none';
    feedback.innerText = '';
  }

  // Keep NIK input editable
  const nikInput = document.getElementById('santri-nik');
  if (nikInput) {
    nikInput.disabled = false;
  }

  openModal('modal-santri');
}

function handleSantriSubmit(e) {
  e.preventDefault();
  
  const action = document.getElementById('santri-action-type').value;
  const idEdit = document.getElementById('santri-id-edit').value;
  const nik = document.getElementById('santri-nik').value.trim();

  // Validate NIK
  if (nik.length !== 16 || isNaN(nik)) {
    alert('NIK harus berupa 16 digit angka!');
    document.getElementById('santri-nik').focus();
    return;
  }

  // Check duplicate NIK (excluding current student being edited)
  const duplicate = state.santri.find(s => s.nik === nik && s.id !== idEdit);
  if (duplicate) {
    alert(`Gagal: NIK ini sudah terdaftar atas nama "${duplicate.name}" (ID: ${duplicate.id})!`);
    document.getElementById('santri-nik').focus();
    return;
  }

  const santriData = {
    nik: nik,
    name: document.getElementById('santri-name').value,
    gender: document.getElementById('santri-gender').value,
    dorm: document.getElementById('santri-dorm').value,
    room: document.getElementById('santri-room').value,
    birthDate: document.getElementById('santri-birthdate').value,
    parentName: document.getElementById('santri-parent').value,
    parentPhone: document.getElementById('santri-phone').value,
    bloodType: document.getElementById('santri-blood').value,
    allergies: document.getElementById('santri-allergies').value || 'Tidak ada'
  };

  if (action === 'add') {
    // Generate new ID
    const nextNum = state.santri.length > 0 
      ? Math.max(...state.santri.map(s => parseInt(s.id.substring(1)))) + 1 
      : 1;
    const newId = `S${String(nextNum).padStart(3, '0')}`;
    
    state.santri.push({ id: newId, ...santriData });
    showNotification('Sukses', `Data santri ${santriData.name} berhasil ditambahkan.`);
  } else if (action === 'edit') {
    const idx = state.santri.findIndex(s => s.id === idEdit);
    if (idx !== -1) {
      state.santri[idx] = { id: idEdit, ...santriData };
      showNotification('Sukses', `Data santri ${santriData.name} berhasil diperbarui.`);
    }
  }

  saveAllToStorage();
  closeAllModals();
  renderSantriList();
}

function deleteSantri(id) {
  const santriObj = state.santri.find(s => s.id === id);
  if (!santriObj) return;

  if (confirm(`Apakah Anda yakin ingin menghapus data santri "${santriObj.name}"? Semua data rekam medis terkait tidak akan dihapus tetapi rincian santri tidak dapat diakses.`)) {
    state.santri = state.santri.filter(s => s.id !== id);
    saveAllToStorage();
    renderSantriList();
    showNotification('Terhapus', 'Data santri berhasil dihapus dari sistem.');
  }
}

// Handler Cek NIK untuk Auto-fill
function handleCekNik() {
  const nikInput = document.getElementById('santri-nik');
  const feedback = document.getElementById('nik-check-feedback');
  
  if (!nikInput || !feedback) return;
  
  const nik = nikInput.value.trim();
  
  // 1. Validation
  if (nik.length === 0) {
    feedback.style.display = 'block';
    feedback.style.color = 'var(--danger)';
    feedback.innerText = 'Silakan masukkan NIK terlebih dahulu!';
    return;
  }
  
  if (nik.length !== 16 || isNaN(nik)) {
    feedback.style.display = 'block';
    feedback.style.color = 'var(--danger)';
    feedback.innerText = 'NIK harus berupa 16 digit angka!';
    return;
  }
  
  // 2. Check duplicate in local state
  const idEdit = document.getElementById('santri-id-edit').value;
  const duplicate = state.santri.find(s => s.nik === nik && s.id !== idEdit);
  if (duplicate) {
    feedback.style.display = 'block';
    feedback.style.color = 'var(--danger)';
    feedback.innerText = `Gagal: NIK ini sudah terdaftar atas nama ${duplicate.name} (ID: ${duplicate.id})`;
    return;
  }
  
  // 3. Search in Mock NIK database
  if (window.MOCK_NIK_DATABASE && window.MOCK_NIK_DATABASE[nik]) {
    const data = window.MOCK_NIK_DATABASE[nik];
    
    // Auto-fill form fields
    document.getElementById('santri-name').value = data.name;
    document.getElementById('santri-gender').value = data.gender;
    document.getElementById('santri-dorm').value = data.dorm;
    document.getElementById('santri-room').value = data.room;
    document.getElementById('santri-birthdate').value = data.birthDate;
    document.getElementById('santri-parent').value = data.parentName;
    document.getElementById('santri-phone').value = data.parentPhone;
    document.getElementById('santri-blood').value = data.bloodType;
    document.getElementById('santri-allergies').value = data.allergies;
    
    feedback.style.display = 'block';
    feedback.style.color = 'var(--success)';
    feedback.innerText = `Sukses: Data ditemukan untuk "${data.name}"! Form telah diisi otomatis.`;
    showNotification('NIK Ditemukan', `Data ${data.name} berhasil di-load otomatis.`);
  } else {
    feedback.style.display = 'block';
    feedback.style.color = 'var(--warning)';
    feedback.innerText = 'NIK tidak terdaftar di database sampel. Silakan isi data secara manual.';
  }
}

// -------------------------------------------------------------
// REKAM MEDIS VIEW
// -------------------------------------------------------------
function renderRMList() {
  const tbody = document.getElementById('table-rm-body');
  tbody.innerHTML = '';

  const searchQuery = document.getElementById('search-rm').value.toLowerCase();
  const statusFilter = document.getElementById('filter-status-rm').value;

  // Filter records
  const filteredRM = state.rekamMedis.filter(rm => {
    const santriObj = state.santri.find(s => s.id === rm.santriId) || { name: '' };
    const matchesSearch = santriObj.name.toLowerCase().includes(searchQuery) ||
                          rm.diagnosis.toLowerCase().includes(searchQuery) ||
                          rm.symptoms.toLowerCase().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || rm.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort by date descending
  filteredRM.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filteredRM.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem 0;">
          <div class="empty-state">
            <i class="fas fa-file-excel"></i>
            <h4>Rekam Medis Tidak Ditemukan</h4>
            <p>Belum ada catatan rekam medis atau kata kunci tidak cocok.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  filteredRM.forEach(rm => {
    const tr = document.createElement('tr');
    const santriObj = state.santri.find(s => s.id === rm.santriId) || { name: 'Santri Terhapus', dorm: '-', room: '-' };
    const dateFormatted = formatDateTime(rm.date);
    const medicineObj = state.obat.find(o => o.id === rm.medicineId) || { name: '-' };

    let badgeClass = 'badge-jalan';
    if (rm.status === 'Istirahat di Kamar') badgeClass = 'badge-kamar';
    else if (rm.status === 'Istirahat di Poskespes') badgeClass = 'badge-poskespes';
    else if (rm.status === 'Rujuk Rumah Sakit') badgeClass = 'badge-rujuk';

    tr.innerHTML = `
      <td style="font-weight: 500">${dateFormatted}</td>
      <td>
        <div style="font-weight: 600">${santriObj.name}</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary)">${santriObj.dorm} (${santriObj.room})</div>
      </td>
      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${rm.symptoms}">
        ${rm.symptoms}
      </td>
      <td><span style="font-weight: 600; color: var(--primary)">${rm.diagnosis}</span></td>
      <td>${medicineObj.name} (${rm.medicineQty})</td>
      <td><span class="badge ${badgeClass}"><span class="badge-dot"></span>${rm.status}</span></td>
      <td>
        <div class="action-group">
          <button class="btn btn-secondary btn-sm btn-icon" onclick="openDetailRMModal('${rm.id}')" title="Detail Rekam Medis">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteRM('${rm.id}')" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function populateRMSantriDropdown() {
  const select = document.getElementById('rm-santri-select');
  select.innerHTML = '<option value="" disabled selected>-- Pilih Santri --</option>';
  
  // Sort santri alphabetically
  const sortedSantri = [...state.santri].sort((a, b) => a.name.localeCompare(b.name));
  
  sortedSantri.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.innerText = `${s.name} (${s.dorm} - ${s.room})`;
    select.appendChild(opt);
  });

  // Initialize custom searchable combobox
  initRMSantriSearch(sortedSantri);
}

function initRMSantriSearch(sortedSantri) {
  const searchInput = document.getElementById('rm-santri-search');
  const resultsDiv = document.getElementById('rm-santri-search-results');
  const hiddenSelect = document.getElementById('rm-santri-select');

  if (!searchInput || !resultsDiv || !hiddenSelect) return;

  let activeIndex = -1;
  let currentOptions = [];

  function renderOptions(filteredList) {
    resultsDiv.innerHTML = '';
    currentOptions = filteredList;
    activeIndex = -1;
    
    if (filteredList.length === 0) {
      resultsDiv.innerHTML = '<div style="padding: 0.75rem 1rem; font-size: 0.85rem; color: var(--text-secondary); text-align: center;">Santri tidak ditemukan</div>';
      resultsDiv.style.display = 'block';
      return;
    }

    filteredList.forEach((s, idx) => {
      const option = document.createElement('div');
      option.className = 'custom-select-option';
      option.setAttribute('data-id', s.id);
      option.setAttribute('data-index', idx);
      
      option.innerHTML = `
        <div class="custom-select-option-title">${s.name}</div>
        <div class="custom-select-option-sub">ID: ${s.id} | NIK: ${s.nik || '-'} | ${s.dorm} - ${s.room}</div>
      `;

      option.addEventListener('click', () => {
        selectStudent(s);
      });

      resultsDiv.appendChild(option);
    });

    resultsDiv.style.display = 'block';
  }

  function selectStudent(student) {
    searchInput.value = `${student.name} (${student.dorm} - ${student.room})`;
    hiddenSelect.value = student.id;
    resultsDiv.style.display = 'none';
    searchInput.setCustomValidity('');
  }

  // Input event to filter options
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query === '') {
      renderOptions(sortedSantri);
      hiddenSelect.value = '';
    } else {
      const filtered = sortedSantri.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.id.toLowerCase().includes(query) || 
        (s.nik && s.nik.includes(query))
      );
      renderOptions(filtered);
      hiddenSelect.value = ''; // Reset select value until an option is chosen
    }
  });

  // Focus event to show all options
  searchInput.addEventListener('focus', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query === '') {
      renderOptions(sortedSantri);
    } else {
      const filtered = sortedSantri.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.id.toLowerCase().includes(query) || 
        (s.nik && s.nik.includes(query))
      );
      renderOptions(filtered);
    }
  });

  // Keyboard navigation support for premium feel
  searchInput.addEventListener('keydown', (e) => {
    const options = resultsDiv.querySelectorAll('.custom-select-option');
    if (resultsDiv.style.display === 'none' || options.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % options.length;
      updateActiveOption(options);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + options.length) % options.length;
      updateActiveOption(options);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < currentOptions.length) {
        selectStudent(currentOptions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      resultsDiv.style.display = 'none';
    }
  });

  function updateActiveOption(options) {
    options.forEach((opt, idx) => {
      if (idx === activeIndex) {
        opt.classList.add('focused');
        opt.scrollIntoView({ block: 'nearest' });
      } else {
        opt.classList.remove('focused');
      }
    });
  }

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
      resultsDiv.style.display = 'none';
      // If user typed something custom but didn't select, reset
      if (!hiddenSelect.value) {
        searchInput.value = '';
      }
    }
  });
}

function populateRMObatDropdown() {
  const select = document.getElementById('rm-obat-select');
  select.innerHTML = '<option value="">-- Tanpa Obat / Obat Luar --</option>';
  
  state.obat.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.id;
    opt.innerText = `${o.name} (Stok: ${o.stock} ${o.type})`;
    select.appendChild(opt);
  });
}

function validateObatQtyInForm() {
  const obatId = document.getElementById('rm-obat-select').value;
  const qtyInput = document.getElementById('rm-obat-qty');
  const qtyError = document.getElementById('rm-qty-error');
  
  if (!obatId) {
    qtyInput.value = '0';
    qtyInput.disabled = true;
    qtyError.style.display = 'none';
    return;
  }
  
  qtyInput.disabled = false;
  const obat = state.obat.find(o => o.id === obatId);
  if (!obat) return;

  const qtyValue = parseInt(qtyInput.value) || 0;
  
  if (qtyValue > obat.stock) {
    qtyError.innerText = `Stok tidak mencukupi! Maksimal: ${obat.stock}`;
    qtyError.style.display = 'block';
    document.getElementById('btn-submit-rm').disabled = true;
  } else {
    qtyError.style.display = 'none';
    document.getElementById('btn-submit-rm').disabled = false;
  }
}

function openAddRMModal() {
  document.getElementById('form-rekam-medis').reset();
  
  // Reset searchable select elements
  const searchInput = document.getElementById('rm-santri-search');
  if (searchInput) {
    searchInput.value = '';
  }
  const resultsDiv = document.getElementById('rm-santri-search-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = '';
    resultsDiv.style.display = 'none';
  }
  const select = document.getElementById('rm-santri-select');
  if (select) {
    select.value = '';
  }
  
  // Set date to current local datetime
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
  document.getElementById('rm-date').value = localISOTime;
  
  document.getElementById('rm-obat-qty').value = '0';
  document.getElementById('rm-obat-qty').disabled = true;
  document.getElementById('rm-qty-error').style.display = 'none';
  document.getElementById('btn-submit-rm').disabled = false;

  openModal('modal-rekam-medis');
}

function handleRMSubmit(e) {
  e.preventDefault();
  
  const santriId = document.getElementById('rm-santri-select').value;
  const date = document.getElementById('rm-date').value;
  const symptoms = document.getElementById('rm-symptoms').value;
  const diagnosis = document.getElementById('rm-diagnosis').value;
  const treatment = document.getElementById('rm-treatment').value;
  const status = document.getElementById('rm-status').value;
  const medicineId = document.getElementById('rm-obat-select').value;
  const medicineQty = parseInt(document.getElementById('rm-obat-qty').value) || 0;
  const officer = document.getElementById('rm-officer').value;

  if (!santriId) {
    alert('Silakan pilih santri terlebih dahulu.');
    return;
  }

  // Deduct stock if medicine chosen
  if (medicineId) {
    const obatObj = state.obat.find(o => o.id === medicineId);
    if (obatObj) {
      if (medicineQty > obatObj.stock) {
        alert('Stok obat sudah berubah dan tidak mencukupi!');
        return;
      }
      // Deduct stock
      obatObj.stock -= medicineQty;
    }
  }

  // Generate RM ID
  const nextNum = state.rekamMedis.length > 0 
    ? Math.max(...state.rekamMedis.map(rm => parseInt(rm.id.substring(2)))) + 1 
    : 1;
  const newId = `RM${String(nextNum).padStart(3, '0')}`;

  const newRM = {
    id: newId,
    date,
    santriId,
    symptoms,
    diagnosis,
    treatment,
    status,
    medicineId: medicineId || null,
    medicineQty,
    officer
  };

  state.rekamMedis.push(newRM);
  saveAllToStorage();
  closeAllModals();
  renderRMList();
  showNotification('Berhasil', 'Catatan rekam medis santri berhasil ditambahkan.');
}

function openDetailRMModal(id) {
  const rm = state.rekamMedis.find(r => r.id === id);
  if (!rm) return;

  state.activeRMId = id;

  const santriObj = state.santri.find(s => s.id === rm.santriId) || { name: 'Santri Terhapus', dorm: '-', room: '-', parentName: '-', parentPhone: '-', allergies: '-', bloodType: '-' };
  const medicineObj = state.obat.find(o => o.id === rm.medicineId) || { name: 'Tidak ada obat / Obat luar' };

  document.getElementById('det-name').innerText = santriObj.name;
  document.getElementById('det-room').innerText = `${santriObj.dorm} - ${santriObj.room}`;
  document.getElementById('det-allergies').innerText = santriObj.allergies;
  document.getElementById('det-blood').innerText = santriObj.bloodType || '-';
  
  document.getElementById('det-date').innerText = formatDateTime(rm.date);
  document.getElementById('det-symptoms').innerText = rm.symptoms;
  document.getElementById('det-diagnosis').innerText = rm.diagnosis;
  document.getElementById('det-treatment').innerText = rm.treatment || '-';
  document.getElementById('det-officer').innerText = rm.officer || '-';
  document.getElementById('det-status').innerText = rm.status;
  
  let medicineText = medicineObj.name;
  if (rm.medicineQty > 0) {
    medicineText += ` (${rm.medicineQty} ${medicineObj.type || ''})`;
  }
  document.getElementById('det-medicine').innerText = medicineText;

  openModal('modal-detail-rm');
}

function deleteRM(id) {
  const rm = state.rekamMedis.find(r => r.id === id);
  if (!rm) return;

  if (confirm('Apakah Anda yakin ingin menghapus catatan rekam medis ini?')) {
    // Optional: Return medicine stock
    if (rm.medicineId && rm.medicineQty > 0) {
      const obatObj = state.obat.find(o => o.id === rm.medicineId);
      if (obatObj) {
        obatObj.stock += rm.medicineQty;
      }
    }
    
    state.rekamMedis = state.rekamMedis.filter(r => r.id !== id);
    saveAllToStorage();
    renderRMList();
    showNotification('Terhapus', 'Catatan rekam medis berhasil dihapus.');
  }
}

// -------------------------------------------------------------
// MEDICINE INVENTORY VIEW
// -------------------------------------------------------------
function renderObatList() {
  const tbody = document.getElementById('table-obat-body');
  tbody.innerHTML = '';

  const searchQuery = document.getElementById('search-obat').value.toLowerCase();

  const filteredObat = state.obat.filter(o => 
    o.name.toLowerCase().includes(searchQuery) ||
    o.type.toLowerCase().includes(searchQuery) ||
    o.id.toLowerCase().includes(searchQuery)
  );

  if (filteredObat.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem 0;">
          <div class="empty-state">
            <i class="fas fa-pills" style="font-size:3rem; margin-bottom:1rem;"></i>
            <h4>Obat Tidak Ditemukan</h4>
            <p>Data obat tidak cocok dengan pencarian.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  filteredObat.forEach(o => {
    const tr = document.createElement('tr');
    
    // Check Stock Level CSS styling
    const isCritical = o.stock === 0;
    const isLow = o.stock <= o.minStock && o.stock > 0;
    
    let stockClass = 'stock-ok';
    let labelStock = 'Aman';
    if (isCritical) {
      stockClass = 'stock-empty';
      labelStock = 'Habis';
    } else if (isLow) {
      stockClass = 'stock-low';
      labelStock = 'Menipis';
    }

    const progressPercent = Math.min((o.stock / (o.minStock * 2 || 50)) * 100, 100);

    // Check expiry
    const today = new Date();
    const expiry = new Date(o.expiryDate);
    const isExpired = expiry <= today;
    const expTextClass = isExpired ? 'text-danger-custom' : '';

    tr.innerHTML = `
      <td style="font-weight: 500">${o.id}</td>
      <td>
        <span style="font-weight: 600">${o.name}</span>
      </td>
      <td>${o.type}</td>
      <td>
        <div class="stock-level ${stockClass}">
          <div class="stock-bar-outer">
            <div class="stock-bar-inner" style="width: ${progressPercent}%"></div>
          </div>
          <span style="font-weight: 600">${o.stock}</span>
          <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-secondary)">(${labelStock})</span>
        </div>
      </td>
      <td class="${expTextClass}">${formatDate(o.expiryDate)} ${isExpired ? '<br/><span style="font-size:0.7rem; color:var(--danger); font-weight:bold;">EXPIRED</span>' : ''}</td>
      <td>
        <div class="action-group">
          <button class="btn btn-secondary btn-sm btn-icon" onclick="openEditObatModal('${o.id}')" title="Edit Stok/Detail">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteObat('${o.id}')" title="Hapus Obat">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddObatModal() {
  document.getElementById('modal-obat-title').innerText = 'Tambah Stok Obat';
  document.getElementById('form-obat').reset();
  document.getElementById('obat-action-type').value = 'add';
  document.getElementById('obat-id-edit').value = '';
  
  openModal('modal-obat');
}

function openEditObatModal(id) {
  const o = state.obat.find(item => item.id === id);
  if (!o) return;

  document.getElementById('modal-obat-title').innerText = 'Edit Detail Obat';
  document.getElementById('obat-action-type').value = 'edit';
  document.getElementById('obat-id-edit').value = id;

  document.getElementById('obat-name').value = o.name;
  document.getElementById('obat-type').value = o.type;
  document.getElementById('obat-stock').value = o.stock;
  document.getElementById('obat-min').value = o.minStock;
  document.getElementById('obat-expiry').value = o.expiryDate;
  document.getElementById('obat-desc').value = o.description || '';

  openModal('modal-obat');
}

function handleObatSubmit(e) {
  e.preventDefault();

  const action = document.getElementById('obat-action-type').value;
  const idEdit = document.getElementById('obat-id-edit').value;

  const obatData = {
    name: document.getElementById('obat-name').value,
    type: document.getElementById('obat-type').value,
    stock: parseInt(document.getElementById('obat-stock').value) || 0,
    minStock: parseInt(document.getElementById('obat-min').value) || 5,
    expiryDate: document.getElementById('obat-expiry').value,
    description: document.getElementById('obat-desc').value
  };

  if (action === 'add') {
    const nextNum = state.obat.length > 0 
      ? Math.max(...state.obat.map(o => parseInt(o.id.substring(1)))) + 1 
      : 1;
    const newId = `O${String(nextNum).padStart(3, '0')}`;

    state.obat.push({ id: newId, ...obatData });
    showNotification('Sukses', `Obat ${obatData.name} berhasil ditambahkan.`);
  } else if (action === 'edit') {
    const idx = state.obat.findIndex(o => o.id === idEdit);
    if (idx !== -1) {
      state.obat[idx] = { id: idEdit, ...obatData };
      showNotification('Sukses', `Obat ${obatData.name} berhasil diperbarui.`);
    }
  }

  saveAllToStorage();
  closeAllModals();
  renderObatList();
}

function deleteObat(id) {
  const o = state.obat.find(item => item.id === id);
  if (!o) return;

  if (confirm(`Apakah Anda yakin ingin menghapus "${o.name}" dari inventaris?`)) {
    state.obat = state.obat.filter(item => item.id !== id);
    saveAllToStorage();
    renderObatList();
    showNotification('Hapus', 'Obat berhasil dihapus dari sistem.');
  }
}

// -------------------------------------------------------------
// HEALTH ANALYTICS VIEW (Charts)
// -------------------------------------------------------------
let charts = {}; // Store chart instances to destroy them before rendering new ones

function renderAnalytics() {
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    document.getElementById('analytics-container').innerHTML = `
      <div class="empty-state" style="grid-column: span 2;">
        <i class="fas fa-exclamation-triangle" style="color:var(--danger)"></i>
        <h4>Chart.js Gagal Dimuat</h4>
        <p>Hubungkan komputer Anda ke internet untuk memuat library visualisasi statistik.</p>
      </div>
    `;
    return;
  }

  // 1. Chart Data 1: Diagnosis Distribution
  const diagCounts = {};
  state.rekamMedis.forEach(rm => {
    diagCounts[rm.diagnosis] = (diagCounts[rm.diagnosis] || 0) + 1;
  });

  // Sort and take top 7
  const sortedDiags = Object.entries(diagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  const diagLabels = sortedDiags.map(d => d[0]);
  const diagData = sortedDiags.map(d => d[1]);

  // Render Diagnosis Chart
  const ctxDiag = document.getElementById('chart-diagnosis').getContext('2d');
  if (charts.diagnosis) charts.diagnosis.destroy();
  
  charts.diagnosis = new Chart(ctxDiag, {
    type: 'doughnut',
    data: {
      labels: diagLabels,
      datasets: [{
        data: diagData,
        backgroundColor: [
          '#10b981', // emerald
          '#06b6d4', // cyan
          '#3b82f6', // blue
          '#f59e0b', // amber
          '#ef4444', // red
          '#8b5cf6', // purple
          '#ec4899'  // pink
        ],
        borderWidth: 2,
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-surface')
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
            font: { family: 'Inter', size: 11 }
          }
        }
      }
    }
  });

  // 2. Chart Data 2: Sickness distribution by Dormitories
  const dormCounts = { 'Putra': 0, 'Putri': 0 };
  state.rekamMedis.forEach(rm => {
    const s = state.santri.find(item => item.id === rm.santriId);
    if (s && s.dorm) {
      dormCounts[s.dorm] = (dormCounts[s.dorm] || 0) + 1;
    }
  });

  const ctxDorm = document.getElementById('chart-dormitory').getContext('2d');
  if (charts.dorm) charts.dorm.destroy();

  charts.dorm = new Chart(ctxDorm, {
    type: 'bar',
    data: {
      labels: Object.keys(dormCounts),
      datasets: [{
        label: 'Jumlah Kasus Sakit',
        data: Object.values(dormCounts),
        backgroundColor: ['#06b6d4', '#ec4899'],
        borderRadius: 8,
        barThickness: 50
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'), stepSize: 1 },
          grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border') }
        },
        x: {
          ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
          grid: { display: false }
        }
      }
    }
  });

  // 3. Chart Data 3: Sick Trend over Date (Last 7 Days with data)
  const dateCounts = {};
  state.rekamMedis.forEach(rm => {
    const dateStr = rm.date.split('T')[0];
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });

  const sortedDates = Object.keys(dateCounts).sort();
  const lastDates = sortedDates.slice(-7);
  const trendData = lastDates.map(d => dateCounts[d]);
  const formattedLabels = lastDates.map(d => formatDate(d));

  const ctxTrend = document.getElementById('chart-trend').getContext('2d');
  if (charts.trend) charts.trend.destroy();

  charts.trend = new Chart(ctxTrend, {
    type: 'line',
    data: {
      labels: formattedLabels,
      datasets: [{
        label: 'Kunjungan Poskespes',
        data: trendData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.3,
        borderWidth: 3,
        pointBackgroundColor: '#10b981',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'), stepSize: 1 },
          grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border') }
        },
        x: {
          ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
          grid: { display: false }
        }
      }
    }
  });
}

// -------------------------------------------------------------
// UTILITY FUNCTIONS
// -------------------------------------------------------------
function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
}

function formatDateTime(dateISOStr) {
  if (!dateISOStr) return '-';
  const dateObj = new Date(dateISOStr);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const dStr = dateObj.toLocaleDateString('id-ID', options);
  
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const min = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${dStr} - ${hour}:${min}`;
}

// Custom simple toast notification system
function showNotification(title, message) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '2rem';
  toast.style.right = '2rem';
  toast.style.backgroundColor = 'var(--bg-surface)';
  toast.style.borderLeft = '4px solid var(--primary)';
  toast.style.borderRight = '1px solid var(--border)';
  toast.style.borderTop = '1px solid var(--border)';
  toast.style.borderBottom = '1px solid var(--border)';
  toast.style.padding = '1rem 1.5rem';
  toast.style.borderRadius = 'var(--radius-md)';
  toast.style.boxShadow = 'var(--shadow-lg)';
  toast.style.zIndex = '9999';
  toast.style.animation = 'slideInToast 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  toast.style.display = 'flex';
  toast.style.flexDirection = 'column';
  toast.style.gap = '0.25rem';
  toast.style.minWidth = '280px';
  toast.style.maxWidth = '380px';

  toast.innerHTML = `
    <div style="font-weight: 700; color: var(--text-primary); font-family: 'Outfit'; display: flex; align-items:center; gap:0.5rem">
      <i class="fas fa-check-circle" style="color:var(--primary)"></i> ${title}
    </div>
    <div style="font-size: 0.8rem; color: var(--text-secondary)">${message}</div>
  `;

  // Animation style in document head if not exists
  if (!document.getElementById('toast-anim')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'toast-anim';
    styleEl.innerText = `
      @keyframes slideInToast {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(styleEl);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}

// Global Toggle for NIK UI Visibility Masking
window.toggleNikVisibility = function(button) {
  const container = button.parentNode;
  const valSpan = container.querySelector('.nik-value');
  const icon = button.querySelector('i');
  
  if (valSpan && icon) {
    const isMasked = valSpan.innerText.includes('*');
    if (isMasked) {
      valSpan.innerText = valSpan.getAttribute('data-raw');
      icon.className = 'fas fa-eye';
      icon.style.color = 'var(--primary)';
    } else {
      valSpan.innerText = valSpan.getAttribute('data-masked');
      icon.className = 'fas fa-eye-slash';
      icon.style.color = 'var(--text-secondary)';
    }
  }
};

// =============================================================
// LOGIKA DETAIL RIWAYAT MEDIS SANTRI (DEDICATED VIEW & PRINT)
// =============================================================

function viewSantriHistory(santriId) {
  state.activeSantriId = santriId;
  navigateTo('riwayat-santri');
}

function renderSantriHistoryPage() {
  const santriId = state.activeSantriId;
  if (!santriId) {
    navigateTo('santri');
    return;
  }

  const santri = state.santri.find(s => s.id === santriId);
  if (!santri) {
    navigateTo('santri');
    return;
  }

  // 1. Render Profil Santri
  const initial = santri.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const avatarType = santri.gender === 'Laki-laki' ? 'L' : 'P';
  
  const avatarEl = document.getElementById('hist-avatar');
  if (avatarEl) {
    avatarEl.innerText = initial;
    avatarEl.className = `user-avatar ${avatarType}`;
  }

  document.getElementById('hist-name').innerText = santri.name;
  document.getElementById('hist-id').innerText = `ID: ${santri.id}`;
  document.getElementById('hist-nik').innerText = santri.nik || '-';
  document.getElementById('hist-gender').innerText = santri.gender;
  document.getElementById('hist-dorm-room').innerText = `${santri.dorm} - ${santri.room}`;
  document.getElementById('hist-age').innerText = `${calculateAge(santri.birthDate)} Tahun (${formatDate(santri.birthDate)})`;
  document.getElementById('hist-blood').innerText = santri.bloodType || '-';
  document.getElementById('hist-allergies').innerText = santri.allergies || 'Tidak ada';
  document.getElementById('hist-parent-name').innerText = santri.parentName;
  document.getElementById('hist-parent-phone').innerText = santri.parentPhone;

  // 2. Ambil catatan medis khusus santri ini
  const studentRM = state.rekamMedis.filter(rm => rm.santriId === santriId);
  // Urutkan tanggal terbaru di atas
  studentRM.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 3. Hitung Statistik Medis Santri
  const totalVisits = studentRM.length;
  document.getElementById('hist-stat-visits').innerText = totalVisits;

  let totalMedicineQty = 0;
  studentRM.forEach(rm => {
    if (rm.medicineQty) totalMedicineQty += rm.medicineQty;
  });
  document.getElementById('hist-stat-medicine').innerText = totalMedicineQty;

  let lastStatus = '-';
  if (studentRM.length > 0) {
    lastStatus = studentRM[0].status;
  }
  document.getElementById('hist-stat-last-status').innerText = lastStatus;

  let topDisease = '-';
  const diagCounts = {};
  studentRM.forEach(rm => {
    diagCounts[rm.diagnosis] = (diagCounts[rm.diagnosis] || 0) + 1;
  });
  const sortedDiags = Object.entries(diagCounts).sort((a, b) => b[1] - a[1]);
  if (sortedDiags.length > 0) {
    topDisease = sortedDiags[0][0];
  }
  document.getElementById('hist-stat-top-disease').innerText = topDisease;
  document.getElementById('hist-stat-top-disease').title = topDisease;

  // 4. Render Distribusi Diagnosis Penyakit (Progress Bar CSS)
  const distContainer = document.getElementById('hist-disease-distribution');
  distContainer.innerHTML = '';

  if (sortedDiags.length === 0) {
    distContainer.innerHTML = '<div style="font-size:0.85rem; color:var(--text-secondary); text-align:center; padding:1.5rem 0;">Belum ada diagnosis penyakit.</div>';
  } else {
    const top5Diags = sortedDiags.slice(0, 5);
    top5Diags.forEach(([diagName, count]) => {
      const percentage = totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0;
      
      const item = document.createElement('div');
      item.className = 'disease-dist-item';
      item.innerHTML = `
        <div class="disease-dist-info">
          <span class="disease-dist-name">${diagName}</span>
          <span class="disease-dist-count">${count} Kunjungan (${percentage}%)</span>
        </div>
        <div class="disease-dist-bar-outer">
          <div class="disease-dist-bar-inner" style="width: ${percentage}%;"></div>
        </div>
      `;
      distContainer.appendChild(item);
    });
  }

  // 5. Render Tabel Kronologi Kunjungan
  const tbody = document.getElementById('table-history-body');
  tbody.innerHTML = '';

  if (studentRM.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem 0;">
          <div class="empty-state">
            <i class="fas fa-file-medical-alt" style="font-size: 2rem;"></i>
            <h4>Belum Ada Catatan Medis</h4>
            <p>Santri ini belum memiliki riwayat kunjungan ke Poskespes.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  studentRM.forEach(rm => {
    const tr = document.createElement('tr');
    const medicineObj = state.obat.find(o => o.id === rm.medicineId) || { name: 'Tidak ada' };
    const dateFormatted = formatDateTime(rm.date);

    let badgeClass = 'badge-jalan';
    if (rm.status === 'Istirahat di Kamar') badgeClass = 'badge-kamar';
    else if (rm.status === 'Istirahat di Poskespes') badgeClass = 'badge-poskespes';
    else if (rm.status === 'Rujuk Rumah Sakit') badgeClass = 'badge-rujuk';

    let medicineText = medicineObj.name;
    if (rm.medicineQty > 0) {
      medicineText += ` (${rm.medicineQty})`;
    }

    tr.innerHTML = `
      <td style="font-weight: 500">${dateFormatted}</td>
      <td style="max-width: 220px; word-break: break-word;">${rm.symptoms}</td>
      <td><span style="font-weight: 600; color: var(--primary)">${rm.diagnosis}</span></td>
      <td style="max-width: 220px; word-break: break-word;">${rm.treatment || '-'}</td>
      <td>${medicineText}</td>
      <td><span class="badge ${badgeClass}"><span class="badge-dot"></span>${rm.status}</span></td>
      <td style="font-weight: 500">${rm.officer || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function printSantriHistory() {
  const santriId = state.activeSantriId;
  if (!santriId) return;

  const santri = state.santri.find(s => s.id === santriId);
  if (!santri) return;

  const studentRM = state.rekamMedis.filter(rm => rm.santriId === santriId);
  studentRM.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Render baris kunjungan untuk print
  let visitsRows = '';
  if (studentRM.length === 0) {
    visitsRows = `
      <tr>
        <td colspan="6" style="text-align: center; font-style: italic; padding: 1rem;">Belum ada riwayat kunjungan medis.</td>
      </tr>
    `;
  } else {
    studentRM.forEach(rm => {
      const medicineObj = state.obat.find(o => o.id === rm.medicineId) || { name: 'Tidak ada' };
      const dateFormatted = formatDateTime(rm.date);
      let medicineText = medicineObj.name;
      if (rm.medicineQty > 0) {
        medicineText += ` (${rm.medicineQty})`;
      }
      visitsRows += `
        <tr>
          <td>${dateFormatted}</td>
          <td>${rm.symptoms}</td>
          <td style="font-weight: bold;">${rm.diagnosis}</td>
          <td>${rm.treatment || '-'}</td>
          <td>${medicineText}</td>
          <td>${rm.status}</td>
        </tr>
      `;
    });
  }

  // Hitung statistik rekapitulasi cetak
  const totalVisits = studentRM.length;
  let totalMedicineQty = 0;
  studentRM.forEach(rm => {
    if (rm.medicineQty) totalMedicineQty += rm.medicineQty;
  });
  let topDisease = '-';
  const diagCounts = {};
  studentRM.forEach(rm => {
    diagCounts[rm.diagnosis] = (diagCounts[rm.diagnosis] || 0) + 1;
  });
  const sortedDiags = Object.entries(diagCounts).sort((a, b) => b[1] - a[1]);
  if (sortedDiags.length > 0) {
    topDisease = sortedDiags[0][0];
  }
  let lastStatus = studentRM.length > 0 ? studentRM[0].status : '-';

  const today = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const formattedToday = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const printSection = document.getElementById('print-section');
  printSection.innerHTML = `
    <!-- Kop Surat Resmi -->
    <div class="print-kop-surat">
      <div class="print-logo"><i class="fas fa-heartbeat" style="color: #000; font-size: 2.5rem;"></i></div>
      <div class="print-kop-text">
        <h1 style="margin: 0; font-size: 1.4rem;">POS KESEHATAN PESANTREN (POSKESPES)</h1>
        <h1 style="margin: 0; font-size: 1.4rem;">PONDOK PESANTREN AL-HIDAYAH KEPUTRAAN</h1>
        <p style="margin: 2px 0 0 0; font-size: 0.8rem;">Jl. KH. Hasyim Asy'ari No. 12, Keputraan, Kec. Kedungwuni, Kabupaten Pekalongan, Jawa Tengah 51181</p>
        <p style="margin: 2px 0 0 0; font-size: 0.8rem;">Email: poskespes@alhidayah-keputraan.sch.id | Telp: (0285) 441234</p>
      </div>
    </div>

    <!-- Judul Dokumen -->
    <div class="print-doc-title" style="margin-top: 1rem;">LAPORAN RIWAYAT KESEHATAN SANTRI</div>

    <!-- Sub-section: Identitas -->
    <div class="print-section-title">Identitas Lengkap Santri</div>
    <div class="print-profile-grid">
      <div class="print-grid-item"><span class="print-grid-label">Nama Lengkap</span><span>: ${santri.name}</span></div>
      <div class="print-grid-item"><span class="print-grid-label">ID / NIK</span><span>: ${santri.id} / ${santri.nik || '-'}</span></div>
      <div class="print-grid-item"><span class="print-grid-label">Jenis Kelamin</span><span>: ${santri.gender}</span></div>
      <div class="print-grid-item"><span class="print-grid-label">Asrama &amp; Kamar</span><span>: ${santri.dorm} - ${santri.room}</span></div>
      <div class="print-grid-item"><span class="print-grid-label">Golongan Darah</span><span>: ${santri.bloodType || '-'}</span></div>
      <div class="print-grid-item"><span class="print-grid-label">Riwayat Alergi</span><span>: ${santri.allergies || 'Tidak ada'}</span></div>
      <div class="print-grid-item" style="grid-column: span 2;"><span class="print-grid-label">Orang Tua / HP</span><span>: ${santri.parentName} (${santri.parentPhone})</span></div>
    </div>

    <!-- Sub-section: Ringkasan Medis -->
    <div class="print-section-title">Ringkasan Statistik Medis</div>
    <div class="print-profile-grid" style="margin-bottom: 1.5rem;">
      <div class="print-grid-item"><span class="print-grid-label">Total Kunjungan</span><span>: ${totalVisits} kali</span></div>
      <div class="print-grid-item"><span class="print-grid-label">Diagnosis Terbanyak</span><span>: ${topDisease}</span></div>
      <div class="print-grid-item"><span class="print-grid-label">Obat Terpakai</span><span>: ${totalMedicineQty} unit</span></div>
      <div class="print-grid-item"><span class="print-grid-label">Status Terakhir</span><span>: ${lastStatus}</span></div>
    </div>

    <!-- Sub-section: Tabel Riwayat -->
    <div class="print-section-title">Daftar Kronologis Kunjungan Medis</div>
    <table class="print-table">
      <thead>
        <tr>
          <th style="width: 18%;">Tanggal</th>
          <th style="width: 25%;">Keluhan / Gejala</th>
          <th style="width: 18%;">Diagnosis</th>
          <th style="width: 20%;">Tindakan / Perawatan</th>
          <th style="width: 12%;">Obat</th>
          <th style="width: 12%;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${visitsRows}
      </tbody>
    </table>

    <!-- Tanda Tangan Penutup -->
    <div class="print-signature-section">
      <div class="print-sig-col">
        <p>Mengetahui,</p>
        <p>Pimpinan Pondok Pesantren</p>
        <div class="print-sig-space"></div>
        <p class="print-sig-name">KH. Ahmad Rofi'i, M.Pd.</p>
      </div>
      <div class="print-sig-col">
        <p>Pekalongan, ${formattedToday}</p>
        <p>Petugas Poskespes,</p>
        <div class="print-sig-space"></div>
        <p class="print-sig-name">Pengelola Poskespes</p>
      </div>
    </div>
  `;

  window.print();
  printSection.innerHTML = '';
}

function printSingleRMDetail(rmId) {
  const rm = state.rekamMedis.find(r => r.id === rmId);
  if (!rm) return;

  const santri = state.santri.find(s => s.id === rm.santriId) || { name: 'Santri Terhapus', dorm: '-', room: '-', parentName: '-', parentPhone: '-', allergies: '-', bloodType: '-', nik: '-' };
  const medicineObj = state.obat.find(o => o.id === rm.medicineId) || { name: 'Tidak ada obat / Obat luar' };
  
  let medicineText = medicineObj.name;
  if (rm.medicineQty > 0) {
    medicineText += ` (${rm.medicineQty} ${medicineObj.type || ''})`;
  }

  const today = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const formattedToday = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const printSection = document.getElementById('print-section');
  printSection.innerHTML = `
    <!-- Kop Surat Resmi -->
    <div class="print-kop-surat">
      <div class="print-logo"><i class="fas fa-heartbeat" style="color: #000; font-size: 2.5rem;"></i></div>
      <div class="print-kop-text">
        <h1 style="margin: 0; font-size: 1.4rem;">POS KESEHATAN PESANTREN (POSKESPES)</h1>
        <h1 style="margin: 0; font-size: 1.4rem;">PONDOK PESANTREN AL-HIDAYAH KEPUTRAAN</h1>
        <p style="margin: 2px 0 0 0; font-size: 0.8rem;">Jl. KH. Hasyim Asy'ari No. 12, Keputraan, Kec. Kedungwuni, Kabupaten Pekalongan, Jawa Tengah 51181</p>
        <p style="margin: 2px 0 0 0; font-size: 0.8rem;">Email: poskespes@alhidayah-keputraan.sch.id | Telp: (0285) 441234</p>
      </div>
    </div>

    <!-- Judul Dokumen -->
    <div class="print-doc-title" style="margin-top: 1rem;">SURAT KETERANGAN REKAM MEDIS SANTRI</div>

    <!-- Sub-section: Identitas -->
    <div class="print-section-title">Identitas Santri</div>
    <div class="print-profile-grid">
      <div class="print-grid-item"><span class="print-grid-label">Nama Lengkap</span><span>: ${santri.name}</span></div>
      <div class="print-grid-item"><span class="print-grid-label">ID / NIK</span><span>: ${santri.id} / ${santri.nik || '-'}</span></div>
      <div class="print-grid-item"><span class="print-grid-label">Asrama &amp; Kamar</span><span>: ${santri.dorm} - ${santri.room}</span></div>
      <div class="print-grid-item"><span class="print-grid-label">Golongan Darah</span><span>: ${santri.bloodType || '-'}</span></div>
      <div class="print-grid-item" style="grid-column: span 2;"><span class="print-grid-label">Riwayat Alergi</span><span>: ${santri.allergies || 'Tidak ada'}</span></div>
    </div>

    <!-- Sub-section: Rincian Pemeriksaan -->
    <div class="print-section-title">Rincian Hasil Kunjungan Medis</div>
    <div class="print-profile-grid" style="grid-template-columns: 1fr; gap: 0.75rem; margin-bottom: 2rem;">
      <div class="print-grid-item"><span class="print-grid-label" style="width: 180px;">Waktu Pemeriksaan</span><span>: ${formatDateTime(rm.date)}</span></div>
      <div class="print-grid-item"><span class="print-grid-label" style="width: 180px;">Gejala / Keluhan</span><span>: ${rm.symptoms}</span></div>
      <div class="print-grid-item"><span class="print-grid-label" style="width: 180px;">Diagnosis Medis</span><span style="font-weight: bold;">: ${rm.diagnosis}</span></div>
      <div class="print-grid-item"><span class="print-grid-label" style="width: 180px;">Tindakan Medis</span><span>: ${rm.treatment || '-'}</span></div>
      <div class="print-grid-item"><span class="print-grid-label" style="width: 180px;">Pemberian Obat</span><span>: ${medicineText}</span></div>
      <div class="print-grid-item"><span class="print-grid-label" style="width: 180px;">Rekomendasi Istirahat</span><span style="font-weight: bold; text-transform: uppercase;">: ${rm.status}</span></div>
    </div>

    <!-- Tanda Tangan Penutup -->
    <div class="print-signature-section">
      <div class="print-sig-col">
        <div class="print-sig-space"></div>
      </div>
      <div class="print-sig-col">
        <p>Pekalongan, ${formattedToday}</p>
        <p>Petugas Pemeriksa,</p>
        <div class="print-sig-space"></div>
        <p class="print-sig-name" style="font-weight: bold;">${rm.officer || 'Pengelola Poskespes'}</p>
      </div>
    </div>
  `;

  window.print();
  printSection.innerHTML = '';
}
