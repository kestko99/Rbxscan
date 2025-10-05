# 🍪 Roblox Cookie Extractor Bookmark

A JavaScript bookmark that allows you to easily extract your Roblox authentication cookie for personal use. This tool is designed for legitimate purposes such as using Roblox APIs, automation scripts, or other personal projects that require authentication.

## ⚠️ Important Security Notice

**Your Roblox cookie is extremely sensitive information that provides full access to your account. Only use this tool for your own legitimate purposes and never share your cookie with anyone you don't trust.**

## 🔧 Installation

### Method 1: Create Bookmark Manually

1. **Copy the bookmark code:**
   - Open `roblox-cookie-bookmark.js`
   - Copy the entire JavaScript code (it starts with `javascript:(function(){` and ends with `})();`)

2. **Create a new bookmark:**
   - Right-click your browser's bookmark bar
   - Select "Add page" or "Add bookmark"
   - Set the name to: `Get Roblox Cookie`
   - Paste the copied code as the URL
   - Save the bookmark

### Method 2: Drag and Drop (Chrome/Edge)

1. Create an HTML file with this content:
```html
<a href="javascript:(function(){/* PASTE THE BOOKMARK CODE HERE */})();">Get Roblox Cookie</a>
```

2. Open the HTML file in your browser
3. Drag the link to your bookmark bar

## 📖 Usage Instructions

### Step 1: Login to Roblox
1. Go to [roblox.com](https://roblox.com)
2. Make sure you're logged into your Roblox account
3. Navigate to any Roblox page (main site, games, catalog, etc.)

### Step 2: Run the Bookmark
1. Click the "Get Roblox Cookie" bookmark you created
2. The bookmark will automatically extract your cookie if found

### Step 3: Copy Your Cookie
1. A popup window will appear showing your cookie
2. Click the "📋 Copy Cookie" button to copy it to your clipboard
3. Your cookie is now ready to use in your scripts or applications

## 🛡️ Security Features

- **Domain Verification**: Only works on official Roblox domains
- **Warning Messages**: Clear security warnings about cookie sensitivity
- **Safe Display**: Shows the cookie in a secure, temporary popup
- **No External Requests**: All processing happens locally in your browser

## 🔍 What the Bookmark Does

1. **Checks Domain**: Verifies you're on a Roblox website
2. **Extracts Cookie**: Looks for the `.ROBLOSECURITY` cookie
3. **Formats Output**: Adds the proper warning prefix that Roblox uses
4. **Secure Display**: Shows the cookie in a modal with copy functionality
5. **Fallback Methods**: Checks localStorage and sessionStorage as backups

## 📋 Cookie Format

The extracted cookie will be in this format:
```
_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_[YOUR_COOKIE_VALUE]
```

## 🎯 Common Use Cases

- **Roblox API Development**: Using the cookie for authenticated API requests
- **Automation Scripts**: Creating bots or automated tools for your account
- **Data Extraction**: Getting your own account data for analysis
- **Third-party Tools**: Using legitimate Roblox tools that require authentication

## 🚫 What NOT to Do

- ❌ **Never share your cookie with others**
- ❌ **Don't paste it into untrusted websites**
- ❌ **Don't use it for malicious purposes**
- ❌ **Don't store it in plain text files on shared computers**

## 🛠️ Troubleshooting

### "No Cookie Found" Message
- **Make sure you're logged in**: Go to roblox.com and verify you're signed in
- **Try a different Roblox page**: Navigate to your profile or the games page
- **Clear browser cache**: Sometimes old cache can interfere
- **Disable incognito mode**: Private browsing may block cookie access

### Bookmark Doesn't Work
- **Check the code**: Make sure you copied the entire JavaScript code
- **Verify the URL**: The bookmark URL should start with `javascript:`
- **Try different browser**: Test in Chrome, Firefox, or Edge
- **Update browser**: Make sure you're using a modern browser version

### Copy Function Not Working
- **Manual copy**: Select the cookie text and use Ctrl+C (or Cmd+C on Mac)
- **Browser permissions**: Some browsers may block clipboard access
- **Alternative method**: Write down the cookie or email it to yourself

## 🔄 Updating the Bookmark

If you want to modify the bookmark:
1. Edit the `roblox-cookie-bookmark.js` file
2. Copy the updated code
3. Right-click your existing bookmark → "Edit"
4. Replace the URL with the new code

## 🆘 Support

If you encounter issues:
1. **Check browser console**: Press F12 and look for error messages
2. **Verify domain**: Make sure you're on a `*.roblox.com` page
3. **Test different pages**: Try the bookmark on various Roblox pages
4. **Check login status**: Confirm you're properly logged into Roblox

## 📝 Technical Notes

- **No external dependencies**: The bookmark is completely self-contained
- **Browser compatibility**: Works on all modern browsers
- **Privacy focused**: No data is sent to external servers
- **Open source**: You can review and modify the code as needed

---

**Remember: Use this tool responsibly and only for legitimate purposes. Your Roblox cookie is the key to your account - treat it with the same care you would treat your password.**