# 🔐 2FA Authentication System

A complete **Two-Factor Authentication (2FA)** system built with **Node.js**, **Express**, and **TOTP** (Time-based One-Time Password). This system provides secure user registration, login, and 2FA setup with QR code generation.

## ✨ Features

### 🔑 **Core Authentication**
- **User Registration** with automatic 2FA setup
- **Secure Login** with password hashing (bcrypt)
- **Session Management** with express-session
- **Two-Factor Authentication** using TOTP (Google Authenticator compatible)

### 📱 **2FA Implementation**
- **QR Code Generation** for easy authenticator app setup
- **Manual Secret Entry** for apps that don't support QR scanning
- **6-digit TOTP codes** with 30-second validity window
- **Compatible** with Google Authenticator, Authy, Microsoft Authenticator

### 🎨 **Modern Frontend**
- **Responsive Design** that works on all devices
- **Real-time Form Validation** and user feedback
- **Smooth Animations** and loading states
- **Toast Notifications** for user actions
- **Dashboard** with 2FA management

### 🔒 **Security Features**
- **Password Hashing** with bcrypt (10 rounds)
- **Session Security** with secure cookies
- **Input Validation** and sanitization
- **CSRF Protection** ready
- **Rate Limiting** ready for production

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16.0.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone or download the project:**
   ```bash
   git clone <repository-url>
   cd 2fa-authentication-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
2fa-authentication-system/
├── server.js              # Main server file with all API endpoints
├── package.json           # Dependencies and scripts
├── public/                # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styles and responsive design
│   └── script.js          # Frontend JavaScript logic
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file for production configuration:

```env
PORT=3000
SESSION_SECRET=your-super-secret-session-key
NODE_ENV=production
```

### Session Secret
⚠️ **Important**: Change the session secret in `server.js` for production:

```javascript
app.use(session({
    secret: 'your-super-secret-session-key-change-this',
    // ... other options
}));
```

## 📱 How to Use

### 1. **User Registration**
1. Click **"Create Account"** on the homepage
2. Enter a **username** and **strong password**
3. Click **"Create Account"**
4. You'll be redirected to **2FA setup**

### 2. **2FA Setup**
1. **Install an authenticator app** on your phone:
   - 📱 **Google Authenticator** (iOS/Android)
   - 🔒 **Authy** (iOS/Android/Desktop)
   - 🛡️ **Microsoft Authenticator** (iOS/Android)

2. **Scan the QR code** with your authenticator app
   - OR manually enter the secret key shown

3. **Enter the 6-digit code** from your app
4. Click **"Verify & Enable 2FA"**
5. You're now logged in with 2FA enabled! 🎉

### 3. **Login Process**
1. Enter your **username** and **password**
2. Click **"Sign In"**
3. Enter the **6-digit code** from your authenticator app
4. Click **"Verify Code"**
5. Access your secure dashboard

### 4. **Dashboard Features**
- View your **profile information**
- Check **2FA status** (Enabled/Disabled)
- **Disable 2FA** (requires password + current 2FA code)
- **Refresh session status**
- **Logout** securely

## 🌐 API Endpoints

### Authentication
- `POST /register` - Register new user with 2FA setup
- `POST /login` - Authenticate user (password only)
- `POST /logout` - End user session

### 2FA Management
- `POST /enable-2fa` - Enable 2FA with token verification
- `POST /verify-2fa` - Verify 2FA token for login
- `POST /disable-2fa` - Disable 2FA (requires password + token)
- `GET /qr-code` - Get QR code for 2FA setup

### Status & Info
- `GET /status` - Get current authentication status
- `GET /dashboard` - Protected dashboard endpoint
- `GET /` - Serve main application

## 🔒 Security Best Practices

### ✅ **Implemented**
- Password hashing with bcrypt (10 rounds)
- Session-based authentication
- Input validation and sanitization
- Secure session configuration
- TOTP with time-based windows
- QR code generation for easy setup

### 🚀 **Production Recommendations**
1. **HTTPS Only**: Use SSL/TLS certificates
2. **Environment Variables**: Store secrets in environment variables
3. **Database**: Replace in-memory storage with a real database
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **CSRF Protection**: Enable CSRF protection for forms
6. **Helmet.js**: Already included for security headers
7. **Input Validation**: Add comprehensive input validation
8. **Audit Logging**: Log authentication events

## 💾 Database Integration

Currently uses **in-memory storage** for demo purposes. For production, integrate with:

### **MongoDB** (Recommended)
```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    twoFactorSecret: { type: String, required: true },
    twoFactorEnabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
```

### **PostgreSQL**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    two_factor_secret VARCHAR(255) NOT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **MySQL**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    two_factor_secret VARCHAR(255) NOT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📱 Mobile Authenticator Apps

### **Google Authenticator**
- **iOS**: [App Store](https://apps.apple.com/app/google-authenticator/id388497605)
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)

### **Authy**
- **iOS**: [App Store](https://apps.apple.com/app/authy/id494168017)
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=com.authy.authy)
- **Desktop**: Available for Windows, macOS, Linux

### **Microsoft Authenticator**
- **iOS**: [App Store](https://apps.apple.com/app/microsoft-authenticator/id983156458)
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=com.azure.authenticator)

## 🛠️ Development

### **Development Mode**
```bash
npm run dev
```

### **Available Scripts**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)
- `npm run setup` - Install dependencies

### **Development Features**
- **Auto-restart** with nodemon
- **Debug logging** in development
- **Browser console helpers** for debugging

## 🔍 Troubleshooting

### **Common Issues**

#### ❌ "Invalid token" errors
- Check your device's **time synchronization**
- Ensure authenticator app is **up to date**
- Try the **previous or next code** (30-second window)

#### ❌ QR code not working
- Use **manual entry** with the secret key
- Check if your camera app can scan QR codes
- Try a different authenticator app

#### ❌ Session issues
- Clear browser **cookies and cache**
- Restart the server
- Check if session secret is consistent

#### ❌ "User already exists"
- Try a different username
- Or check if you need to login instead

## 📊 Browser Support

- ✅ **Chrome** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+
- ✅ **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Help

### **Need Help?**
1. Check the **console** for error messages
2. Verify **time synchronization** on your device
3. Test with different **authenticator apps**
4. Clear **browser cache** and try again

### **Production Deployment**
- Use **environment variables** for secrets
- Enable **HTTPS** with valid SSL certificates
- Set up **database** connection
- Configure **reverse proxy** (nginx/Apache)
- Enable **rate limiting** and **monitoring**

---

## 🎯 Features Demonstration

### **Complete Authentication Flow**
1. 👤 **Registration** → 📱 **2FA Setup** → 🔐 **Login** → 📊 **Dashboard**

### **Security Features**
- 🔒 **Encrypted passwords** (bcrypt)
- 🕐 **Time-based codes** (30-second validity)
- 🔑 **Session management** (secure cookies)
- 🛡️ **Input validation** (sanitized inputs)

### **User Experience**
- 📱 **Mobile responsive** (works on all devices)
- ⚡ **Fast loading** (optimized assets)
- 🎨 **Modern UI** (clean and intuitive)
- 🔔 **Real-time feedback** (notifications and loading states)

**Made with ❤️ for secure authentication**

---

## 🚀 Quick Demo

Want to test it quickly? Here's a 30-second demo:

1. **Start**: `npm start`
2. **Visit**: `http://localhost:3000`
3. **Register**: Create account with username/password
4. **Setup 2FA**: Scan QR code with Google Authenticator
5. **Login**: Use your credentials + 6-digit code
6. **Success**: Access your secure dashboard! 🎉