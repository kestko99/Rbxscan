# 🌐 HTTPS Webhook Setup Guide

This guide shows you how to use external HTTPS domains instead of localhost for webhook delivery.

## 🚀 Quick Start

1. **Open the test page**: `http://localhost:3000/test-external-https.html`
2. **Choose a service** from the options below
3. **Follow the setup steps** for your chosen service
4. **Update the URL** in `js/webhook-external.js`
5. **Test the webhook!**

## 📊 Available Services

### 🔧 Option 1: Beeceptor (Recommended - Free)
- **Website**: https://beeceptor.com/
- **Setup Time**: 2 minutes
- **Cost**: Free
- **Features**: Custom endpoints, request logging, HTTPS

**Setup Steps:**
1. Go to https://beeceptor.com/
2. Click "Create HTTP endpoint"
3. Choose a name (e.g., "roscan-webhook")
4. Your endpoint: `https://roscan-webhook.free.beeceptor.com/webhook`
5. Update `webhook-external.js` line 7 with your URL

### 🔧 Option 2: Webhook.site (Instant - Free)
- **Website**: https://webhook.site/
- **Setup Time**: 30 seconds
- **Cost**: Free
- **Features**: Instant URLs, request inspection, temporary

**Setup Steps:**
1. Go to https://webhook.site/
2. Copy the unique URL you get (e.g., `https://webhook.site/abc123-def456`)
3. Update `webhook-external.js` line 13 with your URL
4. Ready to test!

### 🔧 Option 3: Hookdeck (Professional)
- **Website**: https://hookdeck.com/
- **Setup Time**: 5 minutes
- **Cost**: Free tier + paid plans
- **Features**: Professional webhook management, retry logic, monitoring

**Setup Steps:**
1. Sign up at https://hookdeck.com/
2. Create a new connection
3. Set up your webhook endpoint
4. Copy the provided webhook URL
5. Update `webhook-external.js` line 19 with your URL

### 🔧 Option 4: LocalTunnel (Advanced)
- **Website**: https://localtunnel.github.io/www/
- **Setup Time**: 5 minutes
- **Cost**: Free
- **Features**: Expose localhost via HTTPS tunnel

**Setup Steps:**
1. Install: `npm install -g localtunnel`
2. Start your proxy server: `python3 proxy_server.py`
3. In another terminal: `lt --port 7777 --subdomain mywebhook`
4. Use URL: `https://mywebhook.loca.lt/webhook`
5. Update `webhook-external.js` line 25 with your URL

## 🔄 How to Update the Webhook URL

Edit `js/webhook-external.js` and update the appropriate URL:

```javascript
const WEBHOOK_SERVICES = {
    beeceptor: {
        url: 'https://YOUR-ENDPOINT.free.beeceptor.com/webhook', // ← Update this
        name: 'Beeceptor (Free)',
        setup: 'Create endpoint at beeceptor.com'
    },
    // ... other services
};
```

## 🧪 Testing

1. **Open test page**: `http://localhost:3000/test-external-https.html`
2. **Select your service** from the dropdown
3. **Click "Test HTTPS Webhook"**
4. **Check the browser console** for results
5. **Check your webhook service** dashboard for received requests

## ✅ Benefits of External HTTPS

- **✅ Real HTTPS** - No certificate issues
- **✅ No CORS problems** - External services handle CORS properly
- **✅ Easy sharing** - Send webhook URL to others
- **✅ Request logging** - Most services provide request inspection
- **✅ Professional** - More realistic than localhost

## 🔄 Integration with Main App

To use external webhooks in your main application, update `js/main-v2.js`:

```javascript
// Replace the localhost webhook with external service
const webhookUrl = 'https://your-service.domain.com/webhook';
```

Or import the external webhook module:

```javascript
// Import external webhook functionality
import { sendExternalWebhook } from './webhook-external.js';

// Use in your main application
await sendExternalWebhook(payload);
```

## 🎯 Recommended Setup

**For Development/Testing**: Use **Webhook.site** (instant setup)
**For Production**: Use **Hookdeck** (professional features)
**For Local Development**: Use **Beeceptor** (good balance)

## 🔍 Troubleshooting

**Issue**: Webhook not receiving data
- Check the URL is correct in `webhook-external.js`
- Verify the service is working by visiting the dashboard
- Check browser console for error messages

**Issue**: CORS errors
- External services handle CORS automatically
- Make sure you're using the external webhook, not localhost

**Issue**: Service not responding
- Try a different service from the list
- Check if the service is experiencing downtime

## 🎊 Success!

Once set up, you'll have a professional HTTPS webhook endpoint that:
- ✅ Works from anywhere
- ✅ Has no certificate issues
- ✅ Provides request logging
- ✅ Can be shared with others

Happy webhook testing! 🚀