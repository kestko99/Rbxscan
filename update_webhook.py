#!/usr/bin/env python3
import base64
import sys

def update_webhook_url(new_url):
    """Update the webhook URL in proxy_server.py"""
    
    # Encode the new URL
    encoded_url = base64.b64encode(new_url.encode('utf-8')).decode('utf-8')
    
    # Read the proxy server file
    with open('proxy_server.py', 'r') as f:
        content = f.read()
    
    # Find and replace the webhook URL line
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.startswith('WEBHOOK_URL = base64.b64decode('):
            lines[i] = f"WEBHOOK_URL = base64.b64decode('{encoded_url}').decode('utf-8')"
            break
    
    # Write back to file
    with open('proxy_server.py', 'w') as f:
        f.write('\n'.join(lines))
    
    print(f"✅ Updated webhook URL to: {new_url}")
    print(f"📝 Base64 encoded: {encoded_url}")
    print("🔄 Restart the proxy server for changes to take effect")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 update_webhook.py <webhook_url>")
        print("Example: python3 update_webhook.py https://discord.com/api/webhooks/123/abc")
        sys.exit(1)
    
    webhook_url = sys.argv[1]
    
    if not webhook_url.startswith('https://discord.com/api/webhooks/'):
        print("❌ Invalid webhook URL. Must start with 'https://discord.com/api/webhooks/'")
        sys.exit(1)
    
    update_webhook_url(webhook_url)