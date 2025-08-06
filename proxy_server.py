#!/usr/bin/env python3
import http.server
import socketserver
import json
import urllib.request
import urllib.parse
from urllib.error import HTTPError
import base64

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
            # Serve static files
            super().do_GET()

    def do_GET(self):
        """Handle GET requests - serve static files"""
        super().do_GET()

if __name__ == "__main__":
    PORT = 9000
    
    with socketserver.TCPServer(("", PORT), WebhookProxyHandler) as httpd:
        print(f"🚀 Webhook proxy server running on http://localhost:{PORT}")
        print(f"📡 Webhook endpoint: http://localhost:{PORT}/webhook")
        print(f"🌐 Serving static files from current directory")
        print("Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")