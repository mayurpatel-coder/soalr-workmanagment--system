// ===================================
// Solar Work Management System - JavaScript
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===================================
// Initialize Application
// ===================================
function initializeApp() {
    // Check current page and initialize accordingly
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'login':
            initializeLoginPage();
            break;
        case 'register':
            initializeRegisterPage();
            break;
        case 'dashboard':
            initializeDashboard();
            break;
    }
}

// Get current page type
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('register.html')) return 'register';
    if (path.includes('dashboard.html')) return 'dashboard';
    return 'login';
}

// ===================================
// Login Page Functionality
// ===================================
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Get registered users from storage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    // Find user with matching username and password
    const user = registeredUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store login status
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Show success message
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showNotification('Invalid username or password!', 'error');
    }
}

// ===================================
// Register Page Functionality
// ===================================
function initializeRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const company = document.getElementById('company').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Check if username already exists
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (existingUsers.some(user => user.username === username)) {
        showNotification('Username already exists! Please choose a different username.', 'error');
        return;
    }
    
    // Store user data (in real app, this would be server-side)
    const userData = {
        fullName,
        email,
        phone,
        company,
        username,
        password, // Store password for login validation
        registeredAt: new Date().toISOString()
    };
    
    // Add user to registered users list
    existingUsers.push(userData);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    // Also store as current user data for reference
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Show success message
    showNotification('Registration successful! Redirecting to login...', 'success');
    
    // Redirect to login
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// ===================================
// Dashboard Functionality
// ===================================
function initializeDashboard() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize dashboard components
    initializeSidebar();
    initializeNavigation();
    initializeTabs();
    initializeButtons();
    
    // Set welcome message
    setWelcomeMessage();
}

// Initialize Sidebar
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Initialize Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const page = item.getAttribute('data-page');
            navigateToPage(page);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Close mobile sidebar
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}

// Navigate to different pages
function navigateToPage(page) {
    // Hide all page contents
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.add('fade-in');
    }
    
    // Update page title
    updatePageTitle(page);
}

// Update page title
function updatePageTitle(page) {
    const pageTitle = document.getElementById('pageTitle');
    const titles = {
        'overview': 'Dashboard Overview',
        'business-category': 'Solar Business Categories',
        'inquiry': 'Inquiry Master',
        'customer': 'Customer Master',
        'inventory': 'Inventory Master',
        'employee': 'Employee Master',
        'purchase-sell': 'Purchase & Sell Master',
        'reports': 'Reports'
    };
    
    if (pageTitle && titles[page]) {
        pageTitle.textContent = titles[page];
    }
}

// Initialize Tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Initialize Buttons
function initializeButtons() {
    // Add Category Button
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => {
            showNotification('Add Category feature coming soon!', 'info');
        });
    }
    
    // Add Inquiry Button
    const addInquiryBtn = document.getElementById('addInquiryBtn');
    if (addInquiryBtn) {
        addInquiryBtn.addEventListener('click', () => {
            showNotification('Add Inquiry feature coming soon!', 'info');
        });
    }
    
    // Add Customer Button
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', () => {
            showNotification('Add Customer feature coming soon!', 'info');
        });
    }
    
    // Add Inventory Button
    const addInventoryBtn = document.getElementById('addInventoryBtn');
    if (addInventoryBtn) {
        addInventoryBtn.addEventListener('click', () => {
            showNotification('Add Inventory feature coming soon!', 'info');
        });
    }
    
    // Add Employee Button
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', () => {
            showNotification('Add Employee feature coming soon!', 'info');
        });
    }
    
    // Add Purchase Button
    const addPurchaseBtn = document.getElementById('addPurchaseBtn');
    if (addPurchaseBtn) {
        addPurchaseBtn.addEventListener('click', () => {
            showNotification('Add Purchase feature coming soon!', 'info');
        });
    }
    
    // Add Sale Button
    const addSaleBtn = document.getElementById('addSaleBtn');
    if (addSaleBtn) {
        addSaleBtn.addEventListener('click', () => {
            showNotification('Add Sale feature coming soon!', 'info');
        });
    }
    
    // Table action buttons
    initializeTableActions();
}

// Initialize table action buttons
function initializeTableActions() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-icon[title="Edit"]');
    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Edit feature coming soon!', 'info');
        });
    });
    
    // View buttons
    const viewButtons = document.querySelectorAll('.btn-icon[title="View"]');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('View details feature coming soon!', 'info');
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-icon.danger[title="Delete"]');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this item?')) {
                showNotification('Delete feature coming soon!', 'info');
            }
        });
    });
}

// Set welcome message
function setWelcomeMessage() {
    const username = localStorage.getItem('username') || 'Mayur';
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = `Welcome, ${username}`;
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        showNotification('Logged out successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 400px;
    `;
    
    // Set background color based on type
    const colors = {
        'success': '#4caf50',
        'error': '#f44336',
        'warning': '#ff9800',
        'info': '#2196f3'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Search and Filter Functions
// ===================================

// Search functionality
const searchInputs = document.querySelectorAll('.search-input');
searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const table = e.target.closest('.table-card').querySelector('table tbody');
        
        if (table) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }
    });
});

// Filter functionality
const filterSelects = document.querySelectorAll('.filter-select');
filterSelects.forEach(select => {
    select.addEventListener('change', (e) => {
        // Filter logic can be implemented here
        showNotification('Filters applied!', 'info');
    });
});

// ===================================
// Utility Functions
// ===================================

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function validatePhone(phone) {
    const re = /^[+]?[\d\s-()]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// ===================================
// Sample Data Generation (for demo)
// ===================================

// Generate sample inquiry data
function generateSampleInquiries() {
    return [
        {
            id: 'INQ001',
            customer: 'Raj Kumar',
            contact: '+91 98765 43210',
            category: 'Residential',
            capacity: '5 kW',
            status: 'Pending',
            date: '2024-01-08'
        },
        // Add more sample data as needed
    ];
}

// Generate sample customer data
function generateSampleCustomers() {
    return [
        {
            id: 'CUST001',
            name: 'Ramesh Sharma',
            email: 'ramesh@email.com',
            phone: '+91 98765 43210',
            type: 'Residential',
            location: 'Mumbai',
            projects: 2
        },
        // Add more sample data as needed
    ];
}

// ===================================
// Event Listeners for Responsive Design
// ===================================

// Handle window resize
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768 && sidebar) {
        sidebar.classList.remove('active');
    }
});

// Prevent default behavior for demo links
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%c Solar Work Management System ', 'background: #1e88e5; color: white; font-size: 20px; padding: 10px;');
console.log('%c Developed for Mayur ', 'background: #43a047; color: white; font-size: 14px; padding: 5px;');
console.log('Version: 1.0.0');
console.log('Status: Ready');
