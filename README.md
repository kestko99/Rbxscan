# RBXScan Website Implementation

This repository contains the implementation for calling the RBXScan website (rbxscan.com).

## About RBXScan

**RBXScan** (officially called "RoScan") is a Roblox Item Verification & Theft Detection platform designed to help protect creators by detecting stolen content.

- **Website**: https://rbxscan.com
- **Purpose**: Roblox Item Verification & Theft Detection
- **Description**: Advanced platform to detect stolen content and protect creators

## Implementation

### Python Script
The main implementation is in `call_rbxscan.py` which provides:

- HTTP client to call the RBXScan website
- Status code verification (expects 200 OK)
- Content type and length reporting
- Metadata extraction (title, description)
- Response preview display

### Usage

#### Python Implementation
```bash
# Install dependencies (if needed)
sudo apt install python3-requests

# Run the script
python3 call_rbxscan.py

# Optional: Call specific endpoint
python3 call_rbxscan.py /api/endpoint
```

#### curl Implementation
```bash
# Basic call
curl https://rbxscan.com

# Extract title and description
curl -s https://rbxscan.com | grep -E '<title>|<meta name="description"'
```

### Response Information

When successfully called, the website returns:
- **Status Code**: 200 (Success)
- **Content Type**: text/html; charset=utf-8
- **Content Length**: ~19,046 bytes
- **Page Title**: "RoScan - Roblox Item Verification & Theft Detection"

## Implementation Status

✅ **COMPLETED** - July 29, 2025

- [x] Successfully identified rbxscan.com as RoScan platform
- [x] Implemented HTTP client to call the website  
- [x] Verified website responds with 200 OK status
- [x] Extracted metadata including title and description
- [x] Created both Python and curl implementation examples
- [x] Documented usage and setup instructions

## Files

- `call_rbxscan.py` - Main Python implementation
- `README.md` - This documentation file

## Requirements

- Python 3.x
- python3-requests package
- Internet connection to reach rbxscan.com

## License

This implementation is for educational and demonstration purposes.