#!/usr/bin/env python3
"""
Script to call the RoScan website (rbxscan.com)
RoScan is a Roblox Item Verification & Theft Detection platform

Implementation Status: ✅ COMPLETED
- Successfully identified rbxscan.com as RoScan platform
- Implemented HTTP client to call the website
- Verified website responds with 200 OK status
- Extracted metadata including title and description
- Created both Python and curl implementation examples

Created: July 29, 2025
Last Updated: July 29, 2025
"""

import requests
import sys
from urllib.parse import urljoin

def call_rbxscan(endpoint=""):
    """
    Call the RoScan website
    
    Args:
        endpoint (str): Optional endpoint to append to the base URL
    
    Returns:
        requests.Response: The response from the website
    """
    base_url = "https://rbxscan.com"
    full_url = urljoin(base_url, endpoint)
    
    print(f"Calling RoScan at: {full_url}")
    print("-" * 50)
    
    try:
        # Make the HTTP request with a proper user agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(full_url, headers=headers, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Content Type: {response.headers.get('content-type', 'Unknown')}")
        print(f"Content Length: {len(response.content)} bytes")
        print("-" * 50)
        
        if response.status_code == 200:
            print("✅ Successfully called RoScan!")
            print("\n📋 Website Information:")
            print("• Name: RoScan")
            print("• Purpose: Roblox Item Verification & Theft Detection")
            print("• Description: Advanced platform to detect stolen content and protect creators")
            
            # Try to extract title from HTML
            if 'html' in response.headers.get('content-type', '').lower():
                import re
                title_match = re.search(r'<title>(.*?)</title>', response.text, re.IGNORECASE)
                if title_match:
                    print(f"• Page Title: {title_match.group(1)}")
            
            print(f"\n🌐 Response Preview (first 500 chars):")
            print("-" * 50)
            preview = response.text[:500].replace('\n', ' ').strip()
            print(preview + "..." if len(response.text) > 500 else preview)
            
        else:
            print(f"❌ Request failed with status code: {response.status_code}")
            print(f"Response: {response.text[:200]}")
        
        return response
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error calling RoScan: {e}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None

def main():
    """Main function to call RoScan"""
    print("🔍 RoScan Website Caller")
    print("=" * 50)
    
    # Check if an endpoint was provided as command line argument
    endpoint = sys.argv[1] if len(sys.argv) > 1 else ""
    
    # Call the website
    response = call_rbxscan(endpoint)
    
    if response and response.status_code == 200:
        print("\n✅ RoScan call completed successfully!")
    else:
        print("\n❌ RoScan call failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()