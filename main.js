document.addEventListener('DOMContentLoaded', () => {

  const path = window.location.pathname;

  if (path.includes('register.html')) initRegister();
  else if (path.includes('dashboard.html')) initDashboard();
  else initLogin();

});

/* ================= LOGIN ================= */

function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    const user = JSON.parse(localStorage.getItem('userData'));

    if (!user) return notify('No user found. Please register.', 'error');

    if (username === user.username && password === user.password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      notify('Login successful', 'success');
      setTimeout(() => location.href = 'dashboard.html', 800);
    } else {
      notify('Invalid credentials', 'error');
    }
  });
}

/* ================= REGISTER ================= */

function initRegister() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (regPassword.value !== confirmPassword.value) {
      return notify('Passwords do not match', 'error');
    }

    const userData = {
      username: regUsername.value,
      password: regPassword.value
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    notify('Registration successful', 'success');
    setTimeout(() => location.href = 'index.html', 1000);
  });
}

/* ================= DASHBOARD ================= */

function initDashboard() {

  if (!localStorage.getItem('isLoggedIn')) {
    location.href = 'index.html';
    return;
  }

  /* User Name */
  document.querySelector('.user-name').textContent =
    `Welcome, ${localStorage.getItem('username')}`;

  /* LOGOUT */
  document.getElementById('logoutBtn').onclick = () => {
    localStorage.clear();
    location.href = 'index.html';
  };

  /* SIDEBAR PAGE SWITCH */
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const pages = document.querySelectorAll('.page-content');
  const pageTitle = document.getElementById('pageTitle');

  navItems.forEach(item => {
    item.addEventListener('click', () => {

      navItems.forEach(n => n.classList.remove('active'));
      pages.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const page = item.dataset.page;

      document.getElementById(`${page}-page`).classList.add('active');
      pageTitle.textContent = item.innerText.trim();

      closeSidebar();
    });
  });

  /* MOBILE SIDEBAR */
  document.getElementById('mobileToggle').onclick = toggleSidebar;
  document.getElementById('sidebarToggle').onclick = toggleSidebar;

  /* FIRST MODULE MODAL */
  if (!localStorage.getItem('firstModuleDone')) {
    openModal('firstModuleModal');
    document.getElementById('firstModuleBtn').onclick = () => {
      const mod = firstModuleSelect.value;
      if (!mod) return alert('Select a module');
      localStorage.setItem('firstModuleDone', 'true');
      closeModal('firstModuleModal');
      document.querySelector(`[data-page="${mod}"]`).click();
    };
  }

  /* INQUIRY CRUD */
  document.getElementById('addInquiryBtn').onclick = () =>
    openModal('inquiryModal');

  document.getElementById('saveInquiry').onclick = saveInquiry;

  renderInquiries();
}

/* ================= MODAL ================= */

function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

/* ================= SIDEBAR ================= */

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('active');
}

/* ================= INQUIRY ================= */

function saveInquiry() {
  const inquiry = {
    id: Date.now(),
    name: inqName.value,
    phone: inqPhone.value,
    category: inqCategory.value,
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  };

  const list = JSON.parse(localStorage.getItem('inquiries')) || [];
  list.push(inquiry);
  localStorage.setItem('inquiries', JSON.stringify(list));

  closeModal('inquiryModal');
  renderInquiries();
}

function renderInquiries() {
  const table = document.querySelector('#inquiry-page tbody');
  if (!table) return;

  const list = JSON.parse(localStorage.getItem('inquiries')) || [];
  table.innerHTML = '';

  list.forEach((i, idx) => {
    table.innerHTML += `
      <tr>
        <td>#INQ${idx + 1}</td>
        <td>${i.name}</td>
        <td>${i.phone}</td>
        <td>${i.category}</td>
        <td>--</td>
        <td><span class="badge badge-warning">${i.status}</span></td>
        <td>${i.date}</td>
        <td>
          <button class="btn-icon danger" onclick="deleteInquiry(${i.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>`;
  });
}

function deleteInquiry(id) {
  let list = JSON.parse(localStorage.getItem('inquiries')) || [];
  list = list.filter(i => i.id !== id);
  localStorage.setItem('inquiries', JSON.stringify(list));
  renderInquiries();
}

/* ================= NOTIFICATION ================= */

function notify(msg, type) {
  const n = document.createElement('div');
  n.textContent = msg;
  n.style.cssText = `
    position:fixed;top:20px;right:20px;
    padding:14px 20px;border-radius:8px;
    background:${type === 'error' ? '#f44336' : '#4caf50'};
    color:#fff;z-index:9999`;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}
