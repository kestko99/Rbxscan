# 🔍 RoScan - Advanced PowerShell Scanner

A modern, responsive website for PowerShell script security analysis with Discord webhook integration.

## ✨ Features

- **🎨 Modern UI/UX**: Clean, responsive design with blue and white theme
- **🌙 Dark/Light Mode**: Toggle between bright and dark themes
- **⚡ PowerShell Scanner**: Submit PowerShell scripts for analysis
- **🔗 Discord Integration**: Secure webhook integration for private notifications
- **📱 Mobile Responsive**: Works perfectly on all devices
- **🔒 Security Focused**: Client-side processing with secure transmission

## 🚀 Quick Start

### Prerequisites
- Python 3.x (for local development server)
- Modern web browser

### Installation

1. **Clone or download the project:**
   ```bash
   git clone <repository-url>
   cd roscan-website
   ```

2. **Start the development server:**
   ```bash
   # Option 1: Using npm script
   npm start

   # Option 2: Using Python directly
   python3 -m http.server 3000
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
roscan-website/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All CSS styles
├── js/
│   └── main.js         # JavaScript functionality
├── package.json        # Project configuration
└── README.md          # This file
```

## 🔧 Configuration

### Discord Webhook Setup

The website now uses a secure backend proxy to hide webhook URLs. To configure your webhook:

1. Create a Discord webhook in your server
2. Copy the `.env.example` file to `.env`
3. Replace the webhook URL in `.env`:
   ```
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
   ```

**Important:** Never commit the `.env` file to version control!

## 🚀 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Discord webhook URL
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

The application will run on `http://localhost:3000`

## 🎯 Usage

1. **Visit the website** at `http://localhost:3000`
2. **Click the blue "Scan" button** in the main section
3. **Paste your PowerShell script** in the modal popup
4. **Click "Scanning PowerShell"** to submit
5. **Check your Discord** for the analysis results

## 🔑 Key Components

### HTML Structure
- **Header**: Navigation with theme toggle
- **Hero Section**: Main branding and call-to-action
- **Features**: Three key selling points
- **Scan Section**: Main functionality area
- **Modal**: PowerShell input popup
- **Footer**: Copyright and branding

### CSS Features
- **CSS Variables**: Easy theme customization
- **Responsive Grid**: Mobile-first design
- **Smooth Animations**: Professional transitions
- **Dark/Light Themes**: User preference support

### JavaScript Functionality
- **Theme Toggle**: Persistent user preference
- **Modal Management**: Smooth popup interactions
- **Webhook Integration**: Secure Discord posting
- **Form Validation**: Input sanitization
- **Keyboard Shortcuts**: ESC to close, Ctrl+Enter to submit

## 🎨 Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary-blue: #2563eb;
    --light-blue: #3b82f6;
    /* ... other colors */
}
```

### Content
- Edit text in `index.html`
- Modify features in the features section
- Update branding and logos

### Functionality
- Add new JavaScript functions in `js/main.js`
- Extend webhook payload in `submitPowerShell()`
- Add new validation rules

## 🌐 Deployment

### Static Hosting (Recommended)
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Push to `gh-pages` branch
- **Firebase Hosting**: Use Firebase CLI

### Traditional Hosting
- Upload all files to your web server
- Ensure `index.html` is in the root directory
- No server-side requirements needed

## 🔒 Security

- **Client-side Processing**: No server-side code execution
- **HTTPS Recommended**: Use secure hosting
- **Webhook Security**: Discord webhooks are rate-limited
- **Input Validation**: PowerShell scripts are sanitized

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:
1. Check the browser console for errors
2. Verify Discord webhook URL is correct
3. Ensure JavaScript is enabled
4. Test in an incognito/private window

---

**Made with ❤️ for PowerShell security analysis**