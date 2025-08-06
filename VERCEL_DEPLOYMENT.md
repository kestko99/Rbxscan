# 🚀 Vercel Deployment Guide - RoScan

This guide will help you deploy your RoScan website to Vercel with HTTPS webhook functionality.

## ✅ **What's Already Set Up**

Your project is **100% ready for Vercel deployment** with:

- ✅ **Vercel serverless API** (`/api/webhook.js`)
- ✅ **Automatic HTTPS** (Vercel provides this)
- ✅ **CORS handling** (configured in `vercel.json`)
- ✅ **Discord webhook integration**
- ✅ **Production-ready frontend** (`main-vercel.js`)
- ✅ **No build steps required** (static files + serverless functions)

## 🚀 **Deploy to Vercel (5 minutes)**

### Step 1: Create Vercel Account
1. Go to **https://vercel.com/**
2. **Sign up** with GitHub, GitLab, or Bitbucket
3. **Verify your account**

### Step 2: Deploy Your Project

#### Option A: GitHub Integration (Recommended)
1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to **https://vercel.com/new**
   - **Connect your GitHub account**
   - **Select your repository**
   - **Click "Deploy"**

#### Option B: Direct Upload
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy from your project folder**:
   ```bash
   cd /workspace
   vercel
   ```

3. **Follow the prompts**:
   - Set up new project: **Yes**
   - Project name: **roscan**
   - Deploy: **Yes**

### Step 3: Configure Environment Variables (Optional)
1. **Go to your Vercel dashboard**
2. **Click on your project**
3. **Go to Settings > Environment Variables**
4. **Add** (optional, Discord webhook is already in code):
   - **Name**: `DISCORD_WEBHOOK_URL`
   - **Value**: Your Discord webhook URL

## 🌐 **Your Website URLs**

After deployment, you'll get:

- **Website**: `https://your-project-name.vercel.app`
- **API Endpoint**: `https://your-project-name.vercel.app/api/webhook`

## 🧪 **Testing Your Deployment**

### 1. Test Website
1. **Visit your Vercel URL**
2. **Click "Start Security Scan"**
3. **Click "Scan"** in the modal
4. **Check for success message**

### 2. Test API Endpoint
```bash
curl -X POST https://your-project-name.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"content": "Test from deployment"}'
```

### 3. Check Discord
- **Look for the message** in your Discord channel
- **Should show rich embeds** with data

## 📁 **Project Structure (What Gets Deployed)**

```
/workspace/
├── index.html              # Main website
├── js/main-vercel.js       # Frontend JavaScript
├── api/webhook.js          # Serverless function
├── vercel.json             # Vercel configuration
├── css/                    # Stylesheets
└── assets/                 # Images, etc.
```

## 🔧 **How It Works**

1. **User visits** `https://your-site.vercel.app`
2. **Clicks scan** → Frontend sends POST to `/api/webhook`
3. **Vercel API** receives request → Forwards to Discord
4. **Discord webhook** receives data → Shows in channel
5. **User sees** success message

## 🎯 **Benefits of Vercel**

- ✅ **Automatic HTTPS** - No SSL certificates needed
- ✅ **Global CDN** - Fast worldwide access
- ✅ **Serverless functions** - No server management
- ✅ **Free tier** - Perfect for this project
- ✅ **Custom domains** - Use your own domain
- ✅ **Automatic deployments** - Push to deploy

## 🔄 **Updating Your Site**

### GitHub Integration (Auto-deploy)
1. **Make changes** to your code
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update website"
   git push origin main
   ```
3. **Vercel automatically deploys** the changes

### Manual Deploy
```bash
vercel --prod
```

## 🌍 **Custom Domain (Optional)**

### 1. Add Domain in Vercel
1. **Go to Project Settings**
2. **Click "Domains"**
3. **Add your domain** (e.g., `roscan.com`)

### 2. Update DNS
1. **Add CNAME record**:
   - **Type**: CNAME
   - **Name**: @ (or www)
   - **Value**: `your-project.vercel.app`

## 📊 **Monitoring & Analytics**

### Vercel Dashboard
- **View deployment logs**
- **Monitor function performance**
- **Check error rates**

### Function Logs
1. **Go to Functions tab**
2. **Click on `/api/webhook`**
3. **View real-time logs**

## 🔒 **Security Features**

- ✅ **HTTPS everywhere** (automatic)
- ✅ **CORS protection** (configured)
- ✅ **Environment variables** (secure secrets)
- ✅ **DDoS protection** (Vercel edge network)

## 🎉 **Success Checklist**

After deployment, verify:

- [ ] Website loads at Vercel URL
- [ ] Scan button works
- [ ] No console errors
- [ ] Discord receives webhooks
- [ ] Rich embeds display correctly
- [ ] Mobile responsive
- [ ] HTTPS certificate valid

## 🆘 **Troubleshooting**

### Common Issues

**Issue**: "API not found (404)"
- **Solution**: Check `vercel.json` is in root directory
- **Check**: API file is at `/api/webhook.js`

**Issue**: "CORS error"
- **Solution**: Ensure `vercel.json` has CORS headers
- **Check**: Frontend uses relative URL `/api/webhook`

**Issue**: "Discord webhook failed"
- **Solution**: Check Discord webhook URL is correct
- **Check**: Function logs in Vercel dashboard

**Issue**: "Function timeout"
- **Solution**: Vercel functions have 10s timeout (should be enough)
- **Check**: Remove unnecessary delays

### Debug Steps
1. **Check Vercel function logs**
2. **Test API endpoint directly** with curl
3. **Check browser developer console**
4. **Verify Discord webhook URL**

## 💡 **Pro Tips**

1. **Use Git branches** for development
2. **Test locally** before deploying
3. **Monitor function usage** (free tier limits)
4. **Use environment variables** for secrets
5. **Enable Vercel Analytics** for insights

## 🎊 **You're Done!**

Your RoScan website is now live with:
- ✅ **Professional HTTPS domain**
- ✅ **Working Discord webhooks**
- ✅ **Serverless backend**
- ✅ **Global availability**
- ✅ **Automatic scaling**

**Your website is ready to share with the world!** 🌍

---

**Need help?** Check the troubleshooting section or Vercel's documentation at https://vercel.com/docs