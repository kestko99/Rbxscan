# 🚀 Simple Node.js Backend Setup

Clean, simple Node.js backend that keeps your Discord webhook secure - no complex cloud dependencies!

## ✅ **What's Included**

- 🔒 **Secure Node.js backend** (`server.js`) - Webhook stored server-side
- 🌐 **Simple frontend** (`main-simple.js`) - Only talks to backend
- 📄 **Static file serving** - No separate web server needed
- 🛡️ **Maximum security** - Discord webhook never exposed to frontend

## 🚀 **Quick Start (30 seconds)**

### **1. Start the server:**
```bash
npm start
# or
node server.js
```

### **2. Open your website:**
```
http://localhost:8080
```

### **3. Test it:**
- Click "Start Security Scan"
- Click "Scan" 
- Check Discord for the message!

## 🛡️ **How It Works**

```
🌐 Frontend           →    🔒 Node.js Backend    →    💬 Discord
Collects data              Stores webhook              Receives data
Calls /webhook            Forwards to Discord          
NEVER knows Discord       Returns success/error       
```

## 📁 **File Structure**

```
/workspace/
├── server.js              # 🔒 Node.js backend server
├── js/main-simple.js      # 🌐 Frontend JavaScript  
├── index.html             # 📄 Main website
├── package.json           # 📦 Node.js configuration
└── css/                   # 🎨 Stylesheets
```

## 🔧 **Available Endpoints**

- **`/`** - Main website (serves index.html)
- **`/webhook`** - Secure webhook endpoint (POST)
- **`/health`** - Health check (GET)
- **`/test`** - Test endpoint (POST)

## 🧪 **Testing Commands**

```bash
# Test health
curl http://localhost:8080/health

# Test webhook endpoint
curl -X POST http://localhost:8080/webhook \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message"}'

# Test generic endpoint
curl -X POST http://localhost:8080/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## ⚙️ **Configuration**

### **Environment Variables:**
```bash
# Optional: Override webhook URL
DISCORD_WEBHOOK_URL=your-webhook-url

# Optional: Change port
PORT=3000
```

### **Start with custom settings:**
```bash
PORT=3000 node server.js
```

## 🛡️ **Security Features**

### ✅ **What's Protected:**
- Discord webhook URL completely hidden in backend
- No frontend exposure of sensitive data
- CORS properly configured
- Static file serving with security checks

### ✅ **What Attackers Can't Access:**
- ❌ Discord webhook URL (stored server-side only)
- ❌ Backend source code (not served to frontend)
- ❌ Environment variables (server-side only)

## 🚀 **Deployment Options**

### **Option 1: Local Server**
```bash
node server.js
# Runs on http://localhost:8080
```

### **Option 2: VPS/Cloud Server**
```bash
# Install Node.js on your server
npm install
PORT=80 node server.js
# Access via your domain
```

### **Option 3: Docker**
```dockerfile
FROM node:16
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

### **Option 4: Any Node.js Hosting**
- Works on any platform that supports Node.js
- No special requirements or dependencies

## 🔄 **NPM Scripts**

```bash
npm start        # Start the server
npm run dev      # Same as start (development)
npm run backend  # Start backend only
npm test         # Test the backend API
npm run health   # Check server health
```

## 🎯 **Benefits**

- ✅ **Simple** - Just one Node.js file
- ✅ **Secure** - Webhook hidden in backend
- ✅ **Portable** - Works anywhere Node.js runs
- ✅ **No dependencies** - Only uses Node.js built-ins
- ✅ **Self-contained** - Serves static files too
- ✅ **Easy to modify** - Clean, readable code

## 🆘 **Troubleshooting**

**Issue**: `EADDRINUSE: address already in use`
```bash
# Kill existing process
pkill -f "node server.js"
# Or use different port
PORT=3000 node server.js
```

**Issue**: Webhook not working
```bash
# Check server is running
curl http://localhost:8080/health

# Test webhook endpoint
curl -X POST http://localhost:8080/webhook \
  -H "Content-Type: application/json" \
  -d '{"content": "test"}'
```

**Issue**: Website not loading
- Make sure server.js is running
- Check the port (default is 8080)
- Verify no firewall blocking

## 🔧 **Customization**

### **Change Discord webhook:**
Edit `server.js` line 13:
```javascript
const DISCORD_WEBHOOK_URL = 'your-new-webhook-url';
```

### **Change port:**
Edit `server.js` line 11:
```javascript
const PORT = 3000; // Your preferred port
```

### **Add authentication:**
Add to `server.js` webhook handler:
```javascript
if (!req.headers.authorization) {
    res.writeHead(401);
    res.end('Unauthorized');
    return;
}
```

## 🎉 **Success!**

Your RoScan website now runs with:
- ✅ **Secure Node.js backend**
- ✅ **Hidden Discord webhook**
- ✅ **Simple deployment**
- ✅ **No complex dependencies**

**Ready to use and deploy anywhere!** 🚀

---

**Need help?** The setup is designed to be simple - just run `node server.js` and you're ready!