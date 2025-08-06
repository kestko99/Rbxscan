#!/usr/bin/env python3
import http.server
import socketserver
import json
import urllib.request
import urllib.parse
from urllib.error import HTTPError
import base64
import ssl
import tempfile
import os

# Discord webhook URL (base64 encoded for security)
WEBHOOK_URL = base64.b64decode('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM5NjE2MDQyMDIyOTgwODIzOC9uSmdYcDdqVXBzcldCWUE4YTQxcDlKNnRCemphNDA1YUcyWGhTOGhUcGw4cEsyMGl2Zm1vamR1LXZwT2FOOUFBZE1FSQ==').decode('utf-8')

class WebhookProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle POST requests to webhook proxy"""
        if self.path == '/webhook':
            try:
                # Read the request body
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                
                # Parse JSON data
                payload = json.loads(post_data.decode('utf-8'))
                
                # Forward to Discord webhook
                req = urllib.request.Request(
                    WEBHOOK_URL,
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                
                with urllib.request.urlopen(req) as response:
                    # Send success response
                    self.send_response(200)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'success'}).encode('utf-8'))
                    print(f"✅ Webhook delivered successfully")
                    
            except HTTPError as e:
                print(f"❌ Discord webhook error: {e.code} - {e.reason}")
                self.send_response(e.code)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': f'Discord webhook error: {e.code}',
                    'message': str(e.reason)
                }).encode('utf-8'))
                
            except Exception as e:
                print(f"❌ Proxy error: {str(e)}")
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'Proxy server error',
                    'message': str(e)
                }).encode('utf-8'))
        else:
            # Only handle webhook requests, return 404 for everything else
            self.send_response(404)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'Not found',
                'message': 'This server only handles /webhook POST requests'
            }).encode('utf-8'))

    def do_GET(self):
        """Handle GET requests - return 404 for non-webhook paths"""
        self.send_response(404)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            'error': 'Not found',
            'message': 'This server only handles /webhook POST requests'
        }).encode('utf-8'))

def create_adhoc_ssl_context():
    """Create an ad-hoc SSL context for testing"""
    try:
        # Try to create an ad-hoc SSL context (requires pyOpenSSL)
        context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        # Generate temporary certificate
        import tempfile
        with tempfile.NamedTemporaryFile(mode='w', suffix='.pem', delete=False) as cert_file:
            # Simple self-signed cert content (this is just for local testing)
            cert_content = """-----BEGIN CERTIFICATE-----
MIIBkTCB+wIJAMlyFqk69v+9MA0GCSqGSIb3DQEBCwUAMBQxEjAQBgNVBAMMCWxv
Y2FsaG9zdDAeFw0yNDAxMDEwMDAwMDBaFw0yNTAxMDEwMDAwMDBaMBQxEjAQBgNV
BAMMCWxvY2FsaG9zdDBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQC8Q7HgL8RFvVku
8v0u6HqQCQmrMtCpWKTKw9u8XPGj8qKm2/Z9QnRjQjrKxFGFV6X7KjQl6zSx8bP
m1mC8sV7bAgMBAAEwDQYJKoZIhvcNAQELBQADQQBJ8D4QkJn+pG7cV5xP8q6F9Q
L8s9F5j1K0Q7s8x2vB4t5V6jQ8Y9mK3sN0Q4xP5w7L1jQ4z8v3K0x1F2z9P6Q
-----END CERTIFICATE-----"""
            cert_file.write(cert_content)
            cert_path = cert_file.name
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.key', delete=False) as key_file:
            key_content = """-----BEGIN PRIVATE KEY-----
MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAvEOx4C/ERb1ZLvL9
Luh6kAkJqzLQqVikysP7vFzxo/KiptvmfUJ0Y0I6ysRRhVel+yo0Jes0sfGz5tZ
gvLFe2wIDAQABAkEAqN8V7jgV8LlC4j5F1Q8JQ6fKqZQ2QhJyV4Q9Z8F5h2L3Y8
QlJmK5Q7J9hF8L2x6C0vZ8j7Q8K5Y1X9B6Q2vKwQIhANZ8Q7z1L2Y3V9K8hF6j
Q5QlJr6K4L1F8Y7Q9Z3C2x5BAiEA2L3K0v9Z6Q8Y7hF1j2Q5XlJr4K6F8C9Z1L
3Y8QlJmK5Q7QICIQC5Y1X9B6Q2vKwIhANZ8Q7z1L2Y3V9K8hF6jQ5QlJr6K4L1
F8Y7Q9Z3C2x5BAiEA2L3K0v9Z6Q8Y7hF1j2Q5XlJr4K6F8C9Z1L3Y8QlJmK5Q7
-----END PRIVATE KEY-----"""
            key_file.write(key_content)
            key_path = key_file.name
        
        context.load_cert_chain(cert_path, key_path)
        return context
    except Exception as e:
        print(f"⚠️  Could not create SSL context: {e}")
        return None

if __name__ == "__main__":
    PORT = 7777
    
    # For now, let's use HTTP since HTTPS with self-signed certs can be tricky
    print("🚀 Starting webhook proxy server...")
    print("⚠️  Using HTTP for simplicity (browsers may block HTTPS with self-signed certs)")
    
    try:
        with socketserver.TCPServer(("", PORT), WebhookProxyHandler) as httpd:
            print(f"🚀 Webhook proxy server running on http://localhost:{PORT}")
            print(f"📡 Webhook endpoint: http://localhost:{PORT}/webhook")
            print("Press Ctrl+C to stop the server")
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n🛑 Server stopped")
    except Exception as e:
        print(f"❌ Server startup failed: {e}")