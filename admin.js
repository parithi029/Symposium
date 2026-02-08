// Authentication Logic
const loginOverlay = document.getElementById('loginOverlay');
const dashboardContent = document.getElementById('dashboardContent');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Check if already logged in (sessionStorage)
if (sessionStorage.getItem('admin_auth') === 'true') {
    showDashboard();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value;

    // Hardcoded password for demonstration
    if (password === 'admin123') {
        sessionStorage.setItem('admin_auth', 'true');
        showDashboard();
    } else {
        loginError.classList.remove('hidden');
        passwordInput.classList.add('border-red-500');
    }
});

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_auth');
    location.reload();
});

function showDashboard() {
    loginOverlay.classList.add('hidden');
    dashboardContent.classList.remove('hidden');
    loadData();
}

// Data Handling
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');

refreshBtn.addEventListener('click', loadData);
searchInput.addEventListener('input', filterData);

function loadData() {
    const tableBody = document.getElementById('registrationsTable');
    const emptyState = document.getElementById('emptyState');
    const totalCount = document.getElementById('totalCount');

    // Fetch from localStorage
    const registrations = JSON.parse(localStorage.getItem('symposium_registrations') || '[]');

    totalCount.textContent = registrations.length;

    if (registrations.length === 0) {
        tableBody.innerHTML = '';
        emptyState.classList.remove('hidden');
        tableBody.parentElement.classList.add('hidden'); // Hide table container
        return;
    }

    emptyState.classList.add('hidden');
    tableBody.parentElement.classList.remove('hidden');

    // Sort by newest first
    registrations.sort((a, b) => b.id - a.id);

    renderRows(registrations);
}

function renderRows(data) {
    const tableBody = document.getElementById('registrationsTable');
    tableBody.innerHTML = '';

    data.forEach(reg => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-white/5 transition-colors';

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-slateGray text-xs">
                ${reg.timestamp || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-bold text-white">${escapeHtml(reg.teamLeader)}</div>
                <div class="text-xs text-slateGray">${escapeHtml(reg.college)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                <div>${escapeHtml(reg.department)}</div>
                <div class="text-xs text-slateGray">Year: ${escapeHtml(reg.year)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                <div>${escapeHtml(reg.email)}</div>
                <div class="text-xs text-slateGray">${escapeHtml(reg.mobile)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-block px-2 py-1 rounded-md bg-neonGreen/10 text-neonGreen text-xs font-bold uppercase tracking-wide border border-neonGreen/20">
                    ${escapeHtml(reg.event)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="deleteRecord(${reg.id})" class="text-slate-500 hover:text-red-400 transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function filterData() {
    const query = searchInput.value.toLowerCase();
    const registrations = JSON.parse(localStorage.getItem('symposium_registrations') || '[]');

    const filtered = registrations.filter(reg =>
        reg.teamLeader.toLowerCase().includes(query) ||
        reg.college.toLowerCase().includes(query) ||
        reg.email.toLowerCase().includes(query) ||
        reg.mobile.includes(query)
    );

    renderRows(filtered);
}

// Global scope for onclick
window.deleteRecord = function (id) {
    if (confirm('Are you sure you want to delete this record?')) {
        let registrations = JSON.parse(localStorage.getItem('symposium_registrations') || '[]');
        registrations = registrations.filter(r => r.id !== id);
        localStorage.setItem('symposium_registrations', JSON.stringify(registrations));
        loadData();
    }
}

// XSS Prevention helper
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
