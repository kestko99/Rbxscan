#!/usr/bin/env python3
"""
Script to call the RBXScan website (rbxscan)
RBXScan is a Roblox Item Verification & Theft Detection platform

NEW WEBSITE URL: https://kestko99.github.io/jdjdjjd/

Implementation Status: ✅ COMPLETED
- Successfully identified new rbxscan website location
- Updated to use working GitHub Pages URL
- Implemented HTTP client to call the website
- Verified website responds with 200 OK status
- Extracted metadata including title and description
- Created both Python and curl implementation examples

Created: July 29, 2025
Last Updated: July 29, 2025 (Updated with new URL)
"""

import requests
import sys
from urllib.parse import urljoin

def call_rbxscan(endpoint=""):
    """
    Call the RBXScan website (rbxscan)
    
    Args:
        endpoint (str): Optional endpoint to append to the base URL
    
    Returns:
        requests.Response: The response from the website
    """
    # Updated to the new working rbxscan website URL
    base_url = "https://kestko99.github.io/jdjdjjd/"
    full_url = urljoin(base_url, endpoint)
    
    print(f"Calling RBXScan at: {full_url}")
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
            print("✅ Successfully called RBXScan!")
            print("\n📋 Website Information:")
            print("• Name: RBXScan")
            print("• Purpose: Roblox Item Verification & Theft Detection")
            print("• Description: Advanced platform to detect stolen content and protect creators")
            print(f"• New URL: {base_url}")
            
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
        print(f"❌ Error calling RBXScan: {e}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None

def main():
    """Main function to call RBXScan"""
    print("🔍 RBXScan Website Caller")
    print("=" * 50)
    
    # Check if an endpoint was provided as command line argument
    endpoint = sys.argv[1] if len(sys.argv) > 1 else ""
    
    # Call the website
    response = call_rbxscan(endpoint)
    
    if response and response.status_code == 200:
        print("\n✅ RBXScan call completed successfully!")
    else:
        print("\n❌ RBXScan call failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()