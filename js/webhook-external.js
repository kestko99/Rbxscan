// External HTTPS Webhook Implementation v3.0.0
console.log('🌐 External HTTPS Webhook v3.0.0 loaded - Using secure external domains');

// Configuration for external webhook services
const WEBHOOK_SERVICES = {
    // Beeceptor - Free HTTPS webhook testing
    beeceptor: {
        url: 'https://your-webhook.free.beeceptor.com/webhook',
        name: 'Beeceptor (Free)',
        setup: 'Create endpoint at beeceptor.com'
    },
    
    // Webhook.site - Free temporary webhooks
    webhookSite: {
        url: 'https://webhook.site/your-unique-token',
        name: 'Webhook.site (Free)',
        setup: 'Get URL from webhook.site'
    },
    
    // Hookdeck - Professional webhook service
    hookdeck: {
        url: 'https://api.hookdeck.com/webhooks/your-endpoint',
        name: 'Hookdeck (Professional)',
        setup: 'Setup at hookdeck.com'
    },
    
    // Local tunnel option (ngrok alternative)
    localTunnel: {
        url: 'https://your-subdomain.loca.lt/webhook',
        name: 'LocalTunnel (Free)',
        setup: 'npm install -g localtunnel && lt --port 7777'
    }
};

// Current active service
const ACTIVE_SERVICE = 'beeceptor'; // Change this to switch services

// Get current webhook URL
function getWebhookUrl() {
    const service = WEBHOOK_SERVICES[ACTIVE_SERVICE];
    if (!service) {
        console.error('❌ Invalid webhook service:', ACTIVE_SERVICE);
        return 'https://webhook.site/demo'; // Fallback
    }
    return service.url;
}

// Enhanced webhook sending with external HTTPS
async function sendExternalWebhook(payload) {
    const webhookUrl = getWebhookUrl();
    const service = WEBHOOK_SERVICES[ACTIVE_SERVICE];
    
    console.log(`🚀 Sending webhook via ${service.name}`);
    console.log(`📡 URL: ${webhookUrl}`);
    console.log('📦 Payload:', payload);
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': window.location.origin,
                'Referer': window.location.href
            },
            body: JSON.stringify(payload),
            mode: 'cors' // CORS is properly handled by external services
        });
        
        console.log(`✅ Response status: ${response.status}`);
        
        if (response.ok) {
            console.log('🎉 Webhook delivered successfully via HTTPS!');
            return { success: true, status: response.status, service: service.name };
        } else {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
    } catch (error) {
        console.error('❌ External webhook failed:', error);
        throw error;
    }
}

// Test function for external webhooks
window.testExternalWebhook = async function() {
    try {
        console.log('🧪 Testing external HTTPS webhook...');
        
        const testPayload = {
            content: '@everyone\nTest from external HTTPS webhook\nTimestamp: ' + new Date().toISOString(),
            source: 'RoScan External Test',
            service: WEBHOOK_SERVICES[ACTIVE_SERVICE].name
        };
        
        const result = await sendExternalWebhook(testPayload);
        console.log('🎊 External webhook test successful!', result);
        
        return result;
        
    } catch (error) {
        console.error('💥 External webhook test failed:', error);
        throw error;
    }
};

// Service setup instructions
function showSetupInstructions() {
    const service = WEBHOOK_SERVICES[ACTIVE_SERVICE];
    console.log(`📋 Setup instructions for ${service.name}:`);
    console.log(`🔧 ${service.setup}`);
    console.log(`🌐 Current URL: ${service.url}`);
    console.log('💡 Update the URL in this file after setup');
}

// Auto-run setup instructions
showSetupInstructions();

// Export for use in main application
window.EXTERNAL_WEBHOOK = {
    send: sendExternalWebhook,
    test: window.testExternalWebhook,
    getUrl: getWebhookUrl,
    getService: () => WEBHOOK_SERVICES[ACTIVE_SERVICE],
    switchService: (serviceName) => {
        if (WEBHOOK_SERVICES[serviceName]) {
            ACTIVE_SERVICE = serviceName;
            showSetupInstructions();
            return true;
        }
        return false;
    }
};