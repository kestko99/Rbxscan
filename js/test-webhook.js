// Simple webhook test - v1.0.0
console.log('🔥 TEST FILE LOADED - testing localhost:7777');

// Test the webhook immediately when loaded
async function testWebhookConnection() {
    try {
        console.log('🚀 Testing webhook connection...');
        const response = await fetch('http://localhost:7777/webhook', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content: 'Test from test-webhook.js'})
        });
        
        console.log('✅ Response status:', response.status);
        const data = await response.json().catch(() => 'No JSON');
        console.log('📄 Response data:', data);
        
        if (response.status === 403) {
            console.log('🎉 CONNECTION WORKING! 403 means proxy is working, just need valid Discord webhook URL');
        }
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

// Auto-test when loaded
setTimeout(testWebhookConnection, 1000);

// Make it available globally
window.testWebhookConnection = testWebhookConnection;