// 2FA Authentication System - Frontend JavaScript

// State management
let currentUser = null;
let isAuthenticated = false;

// API Base URL (change this in production)
const API_BASE = window.location.origin;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔐 2FA Authentication System initializing...');
    
    // Check authentication status
    await checkAuthStatus();
    
    // Set up auto-formatting for token inputs
    setupTokenInputs();
    
    console.log('✅ System ready');
});

// Check current authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE}/status`);
        const data = await response.json();
        
        if (data.authenticated) {
            currentUser = data.username;
            isAuthenticated = true;
            showDashboard();
            updateUserInfo(data.username);
            updateDashboardInfo(data);
        } else if (data.pending2FA) {
            currentUser = data.username;
            if (data.username) {
                // Check if user needs to enable 2FA or verify existing 2FA
                const qrResponse = await fetch(`${API_BASE}/qr-code`);
                if (qrResponse.ok) {
                    const qrData = await qrResponse.json();
                    showSetup2FA(qrData);
                } else {
                    showVerify2FA();
                }
            }
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Failed to check auth status:', error);
        showLogin();
    }
}

// Show/Hide different containers
function showLogin() {
    hideAllContainers();
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
}

function showRegister() {
    hideAllContainers();
    document.getElementById('registerContainer').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
}

function showSetup2FA(qrData) {
    hideAllContainers();
    document.getElementById('setup2faContainer').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
    
    // Update QR code and secret
    document.getElementById('qrCodeImage').src = qrData.qrCode;
    document.getElementById('secretKey').textContent = qrData.secret;
}

function showVerify2FA() {
    hideAllContainers();
    document.getElementById('verify2faContainer').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
}

function showDashboard() {
    hideAllContainers();
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
}

function hideAllContainers() {
    const containers = [
        'loginContainer',
        'registerContainer', 
        'setup2faContainer',
        'verify2faContainer',
        'dashboard'
    ];
    
    containers.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
}

// Update user info in header
function updateUserInfo(username) {
    document.getElementById('welcomeText').textContent = `Welcome, ${username}`;
}

// Update dashboard information
function updateDashboardInfo(data) {
    document.getElementById('dashboardUsername').textContent = data.username;
    document.getElementById('2faStatus').textContent = data.twoFactorEnabled ? 'Enabled' : 'Disabled';
    document.getElementById('2faStatus').className = data.twoFactorEnabled ? 'status-enabled' : 'status-disabled';
    document.getElementById('loginTime').textContent = new Date().toLocaleString();
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const loginBtn = document.getElementById('loginBtn');
    
    // Set loading state
    setButtonLoading(loginBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.get('username'),
                password: formData.get('password')
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = formData.get('username');
            showNotification(data.message, 'success');
            
            if (data.next === 'verify-2fa') {
                showVerify2FA();
            } else {
                // Get QR code for setup
                const qrResponse = await fetch(`${API_BASE}/qr-code`);
                const qrData = await qrResponse.json();
                showSetup2FA(qrData);
            }
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    } finally {
        setButtonLoading(loginBtn, false);
        form.reset();
    }
}

// Handle registration form submission  
async function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const registerBtn = document.getElementById('registerBtn');
    
    // Set loading state
    setButtonLoading(registerBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.get('username'),
                password: formData.get('password')
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = formData.get('username');
            showNotification(data.message, 'success');
            showSetup2FA(data);
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    } finally {
        setButtonLoading(registerBtn, false);
        form.reset();
    }
}

// Handle 2FA setup form submission
async function handleSetup2FA(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const setupBtn = document.getElementById('setup2faBtn');
    
    // Set loading state
    setButtonLoading(setupBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/enable-2fa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: formData.get('token')
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            isAuthenticated = true;
            showNotification(data.message, 'success');
            showDashboard();
            updateUserInfo(currentUser);
            
            // Refresh dashboard info
            const statusResponse = await fetch(`${API_BASE}/status`);
            const statusData = await statusResponse.json();
            updateDashboardInfo(statusData);
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('2FA setup error:', error);
        showNotification('2FA setup failed. Please try again.', 'error');
    } finally {
        setButtonLoading(setupBtn, false);
        form.reset();
    }
}

// Handle 2FA verification form submission
async function handleVerify2FA(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const verifyBtn = document.getElementById('verify2faBtn');
    
    // Set loading state
    setButtonLoading(verifyBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/verify-2fa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: formData.get('token')
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            isAuthenticated = true;
            showNotification(data.message, 'success');
            showDashboard();
            updateUserInfo(currentUser);
            
            // Refresh dashboard info
            const statusResponse = await fetch(`${API_BASE}/status`);
            const statusData = await statusResponse.json();
            updateDashboardInfo(statusData);
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('2FA verification error:', error);
        showNotification('2FA verification failed. Please try again.', 'error');
    } finally {
        setButtonLoading(verifyBtn, false);
        form.reset();
    }
}

// Handle disable 2FA form submission
async function handleDisable2FA(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const disableBtn = document.getElementById('disable2faBtn');
    
    // Set loading state
    setButtonLoading(disableBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/disable-2fa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: formData.get('password'),
                token: formData.get('token')
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification(data.message, 'success');
            hideDisable2FA();
            
            // Refresh dashboard info
            const statusResponse = await fetch(`${API_BASE}/status`);
            const statusData = await statusResponse.json();
            updateDashboardInfo(statusData);
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Disable 2FA error:', error);
        showNotification('Failed to disable 2FA. Please try again.', 'error');
    } finally {
        setButtonLoading(disableBtn, false);
        form.reset();
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch(`${API_BASE}/logout`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = null;
            isAuthenticated = false;
            showNotification(data.message, 'success');
            showLogin();
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Logout failed. Please try again.', 'error');
    }
}

// Refresh status function
async function refreshStatus() {
    try {
        const response = await fetch(`${API_BASE}/status`);
        const data = await response.json();
        
        if (data.authenticated) {
            updateDashboardInfo(data);
            showNotification('Status refreshed', 'success');
        } else {
            showNotification('Session expired. Please login again.', 'warning');
            showLogin();
        }
    } catch (error) {
        console.error('Refresh status error:', error);
        showNotification('Failed to refresh status', 'error');
    }
}

// Show/hide disable 2FA modal
function showDisable2FA() {
    document.getElementById('disable2faModal').style.display = 'flex';
}

function hideDisable2FA() {
    document.getElementById('disable2faModal').style.display = 'none';
    document.getElementById('disable2faForm').reset();
}

// Copy secret key to clipboard
async function copySecret() {
    const secretKey = document.getElementById('secretKey').textContent;
    
    try {
        await navigator.clipboard.writeText(secretKey);
        showNotification('Secret key copied to clipboard', 'success');
    } catch (error) {
        console.error('Copy failed:', error);
        showNotification('Failed to copy secret key', 'error');
    }
}

// Set up token input formatting
function setupTokenInputs() {
    const tokenInputs = document.querySelectorAll('.token-input');
    
    tokenInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            // Only allow numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            // Limit to 6 digits
            if (e.target.value.length > 6) {
                e.target.value = e.target.value.substring(0, 6);
            }
        });
        
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const numbersOnly = paste.replace(/[^0-9]/g, '').substring(0, 6);
            e.target.value = numbersOnly;
        });
    });
}

// Button loading state helper
function setButtonLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.classList.add('loading');
        button.setAttribute('data-original-text', button.textContent);
        button.innerHTML = '<span class="btn-icon">⏳</span> Loading...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.innerHTML = originalText;
        }
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notificationsContainer = document.getElementById('notifications');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type} fade-in`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type]}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="closeNotification(this)">×</button>
    `;
    
    notificationsContainer.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification.querySelector('.notification-close'));
        }
    }, 5000);
}

// Close notification
function closeNotification(button) {
    const notification = button.parentNode;
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('disable2faModal');
        if (modal && modal.style.display === 'flex') {
            hideDisable2FA();
        }
    }
    
    // Enter to submit forms (if only one submit button is visible)
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const visibleForms = Array.from(document.querySelectorAll('form')).filter(form => {
            return form.offsetParent !== null; // Is visible
        });
        
        if (visibleForms.length === 1) {
            const submitButton = visibleForms[0].querySelector('button[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
            }
        }
    }
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('disable2faModal');
    if (e.target === modal) {
        hideDisable2FA();
    }
});

// Add slideOut animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Development helpers (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Development mode enabled');
    
    // Add debug info to window object
    window.auth2FA = {
        currentUser,
        isAuthenticated,
        checkAuthStatus,
        showLogin,
        showRegister,
        showSetup2FA,
        showVerify2FA,
        showDashboard
    };
}

console.log('🔐 2FA Authentication System loaded successfully');