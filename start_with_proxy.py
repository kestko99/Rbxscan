#!/usr/bin/env python3
import subprocess
import sys
import time
import signal
import os

def signal_handler(sig, frame):
    print('\n🛑 Shutting down servers...')
    sys.exit(0)

def main():
    print("🚀 Starting RoScan with Webhook Proxy...")
    
    # Change to workspace directory
    os.chdir('/workspace')
    
    processes = []
    
    try:
        # Start webhook proxy on port 9000
        print("📡 Starting webhook proxy server on port 9000...")
        proxy_process = subprocess.Popen([
            sys.executable, 'proxy_server.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        processes.append(proxy_process)
        
        # Wait a moment for proxy to start
        time.sleep(2)
        
        # Start main web server on port 3000
        print("🌐 Starting main web server on port 3000...")
        web_process = subprocess.Popen([
            sys.executable, '-m', 'http.server', '3000'
        ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        processes.append(web_process)
        
        print("\n✅ Both servers are running!")
        print("📡 Webhook Proxy: http://localhost:9000/webhook")
        print("🌐 Main Website: http://localhost:3000")
        print("\n💡 Open http://localhost:3000 in your browser")
        print("⚠️  Make sure to update the webhook URL in proxy_server.py if needed")
        print("\nPress Ctrl+C to stop both servers")
        
        # Register signal handler
        signal.signal(signal.SIGINT, signal_handler)
        
        # Keep running and monitor processes
        while True:
            time.sleep(1)
            
            # Check if any process died
            for i, proc in enumerate(processes):
                if proc.poll() is not None:
                    print(f"❌ Process {i} died unexpectedly")
                    return
                    
    except KeyboardInterrupt:
        print('\n🛑 Shutting down servers...')
    finally:
        # Clean up processes
        for proc in processes:
            try:
                proc.terminate()
                proc.wait(timeout=5)
            except:
                proc.kill()

if __name__ == "__main__":
    main()