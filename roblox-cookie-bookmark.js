// Roblox Cookie Extractor Bookmark
// This bookmark allows you to extract your own Roblox cookie for personal use

javascript:(function(){
    // Function to extract Roblox cookie
    function getRobloxCookie() {
        // Check if we're on a Roblox domain
        if (!window.location.hostname.includes('roblox.com')) {
            alert('Please use this bookmark while on a Roblox website page (roblox.com)');
            return;
        }
        
        // Try to get the .ROBLOSECURITY cookie
        let robloxCookie = null;
        
        // Method 1: Check document.cookie
        try {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const trimmed = cookie.trim();
                if (trimmed.startsWith('.ROBLOSECURITY=')) {
                    robloxCookie = trimmed.substring('.ROBLOSECURITY='.length);
                    break;
                }
            }
        } catch (e) {
            console.error('Error reading cookies:', e);
        }
        
        // Method 2: Try localStorage for any Roblox auth data
        if (!robloxCookie) {
            try {
                // Check for common Roblox localStorage keys
                const authKeys = ['RBXAuthenticationNegotiation', 'RBXEventTrackerV2', 'RobloxAuth'];
                for (const key of authKeys) {
                    const value = localStorage.getItem(key);
                    if (value) {
                        console.log(`Found ${key}:`, value);
                    }
                }
            } catch (e) {
                console.error('Error reading localStorage:', e);
            }
        }
        
        // Method 3: Try sessionStorage
        if (!robloxCookie) {
            try {
                const sessionKeys = Object.keys(sessionStorage);
                for (const key of sessionKeys) {
                    if (key.toLowerCase().includes('roblox') || key.toLowerCase().includes('auth')) {
                        console.log(`Session key ${key}:`, sessionStorage.getItem(key));
                    }
                }
            } catch (e) {
                console.error('Error reading sessionStorage:', e);
            }
        }
        
        // Display results
        if (robloxCookie) {
            // Create a modal to display the cookie
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
            `;
            
            const content = document.createElement('div');
            content.style.cssText = `
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                max-width: 600px;
                max-height: 80%;
                overflow-y: auto;
                position: relative;
            `;
            
            content.innerHTML = `
                <h2 style="color: #333; margin-top: 0;">🍪 Roblox Cookie Found!</h2>
                <p style="color: #666;">Your Roblox authentication cookie:</p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 12px;">
                    _|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_${robloxCookie}
                </div>
                <div style="margin: 15px 0;">
                    <button id="copyBtn" style="background: #00b2ff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                        📋 Copy Cookie
                    </button>
                    <button id="closeBtn" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        ❌ Close
                    </button>
                </div>
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 10px; margin-top: 15px;">
                    <strong>⚠️ Security Warning:</strong><br>
                    • This cookie gives full access to your Roblox account<br>
                    • Never share it with anyone you don't trust<br>
                    • Only use it for your own legitimate purposes<br>
                    • Consider changing your password if you think it's compromised
                </div>
            `;
            
            modal.appendChild(content);
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('copyBtn').onclick = function() {
                const fullCookie = `_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_${robloxCookie}`;
                navigator.clipboard.writeText(fullCookie).then(() => {
                    this.textContent = '✅ Copied!';
                    this.style.background = '#28a745';
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = fullCookie;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    this.textContent = '✅ Copied!';
                    this.style.background = '#28a745';
                });
            };
            
            document.getElementById('closeBtn').onclick = function() {
                document.body.removeChild(modal);
            };
            
            // Close on background click
            modal.onclick = function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            };
            
        } else {
            // No cookie found
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
            `;
            
            const content = document.createElement('div');
            content.style.cssText = `
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                max-width: 500px;
                text-align: center;
            `;
            
            content.innerHTML = `
                <h2 style="color: #e74c3c; margin-top: 0;">❌ No Cookie Found</h2>
                <p style="color: #666;">No Roblox authentication cookie was found.</p>
                <p style="color: #666; font-size: 14px;">
                    Make sure you're logged into Roblox and try again.<br>
                    If you're using incognito mode, cookies might not be accessible.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                    Close
                </button>
            `;
            
            modal.appendChild(content);
            document.body.appendChild(modal);
            
            // Close on background click
            modal.onclick = function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            };
        }
    }
    
    // Execute the function
    getRobloxCookie();
})();