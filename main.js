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

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = JSON.parse(localStorage.getItem('userData'));

        if (!user) {
            showNotification('No user found. Please register first.', 'error');
            return;
        }

        if (username === user.username && password === user.password) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            showNotification('Login successful!', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } else {
            showNotification('Invalid username or password', 'error');
        }
    });
}

/* ================= REGISTER ================= */

function initRegister() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const userData = {
            fullName: fullName.value,
            email: email.value,
            phone: phone.value,
            company: company.value,
            username: regUsername.value,
            password: regPassword.value
        };

        if (regPassword.value !== confirmPassword.value) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        localStorage.setItem('userData', JSON.stringify(userData));
        showNotification('Registration successful!', 'success');

        setTimeout(() => window.location.href = 'index.html', 1500);
    });
}

/* ================= DASHBOARD ================= */

function initDashboard() {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    const name = localStorage.getItem('username');
    const userNameEl = document.querySelector('.user-name');
    if (userNameEl) userNameEl.textContent = `Welcome, ${name}`;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }
}

/* ================= NOTIFICATION ================= */

function showNotification(msg, type) {
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = msg;
    n.style.cssText = `
        position:fixed;top:20px;right:20px;
        padding:14px 20px;border-radius:8px;
        background:${type === 'error' ? '#f44336' : '#4caf50'};
        color:#fff;z-index:9999`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}
/* ===== First Time Module Popup ===== */
if (!localStorage.getItem('firstModuleDone')) {
    const modal = document.getElementById('firstModuleModal');
    modal.classList.remove('hidden');

    document.getElementById('firstModuleBtn').onclick = () => {
        const module = document.getElementById('firstModuleSelect').value;
        if (!module) return alert("Select a module");

        localStorage.setItem('firstModuleDone', 'true');
        modal.classList.add('hidden');

        document.querySelector(`[data-page="${module}"]`).click();
    };
}
/* ===== Inquiry CRUD ===== */
const inquiryBtn = document.getElementById('addInquiryBtn');
const inquiryModal = document.getElementById('inquiryModal');
const inquiryTable = document.querySelector('#inquiry-page tbody');

if (inquiryBtn) {
    inquiryBtn.onclick = () => inquiryModal.classList.remove('hidden');
}

document.getElementById('saveInquiry').onclick = () => {
    const data = {
        id: Date.now(),
        name: inqName.value,
        phone: inqPhone.value,
        category: inqCategory.value,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
    };

    const list = JSON.parse(localStorage.getItem('inquiries')) || [];
    list.push(data);
    localStorage.setItem('inquiries', JSON.stringify(list));

    inquiryModal.classList.add('hidden');
    renderInquiries();
};

function renderInquiries() {
    const list = JSON.parse(localStorage.getItem('inquiries')) || [];
    inquiryTable.innerHTML = '';

    list.forEach((i, index) => {
        inquiryTable.innerHTML += `
        <tr>
          <td>#INQ${index+1}</td>
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
    let list = JSON.parse(localStorage.getItem('inquiries'));
    list = list.filter(i => i.id !== id);
    localStorage.setItem('inquiries', JSON.stringify(list));
    renderInquiries();
}

renderInquiries();


