# 🚂 Railway Backend Deployment Guide

## ✅ Step 1: Backend Branch Created
The `backend-deploy` branch has been successfully created and pushed to your repository.

**Branch URL:** https://github.com/NazirHussain1/aureva-ecommerce-platform/tree/backend-deploy

---

## 🚀 Step 2: Deploy to Railway

### 2.1 Create New Project
1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: `NazirHussain1/aureva-ecommerce-platform`
5. **Important:** Select branch `backend-deploy`

### 2.2 Add MySQL Database
1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"MySQL"**
4. Railway will automatically create the database

### 2.3 Get Database Credentials
Click on the MySQL service and go to **"Variables"** tab. You'll see:
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`

---

## ⚙️ Step 3: Configure Environment Variables

Click on your backend service → **"Variables"** tab → Add these variables:

### Required Variables:

```env
NODE_ENV=production
PORT=5000

# Database (copy from Railway MySQL service)
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASS=${{MySQL.MYSQL_PASSWORD}}
DB_HOST=${{MySQL.MYSQL_HOST}}

# JWT Configuration
JWT_SECRET=your_super_secret_production_jwt_key_min_32_characters_change_this
JWT_EXPIRES_IN=7d

# Cloudinary (from your account)
CLOUDINARY_CLOUD_NAME=dhvurrrgz
CLOUDINARY_API_KEY=351329627238456
CLOUDINARY_API_SECRET=iJPQoD0ft2uMFHQzKmMHa4489go

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=nh534392@gmail.com
EMAIL_PASS=your_gmail_app_password_here
EMAIL_FROM=Aureva Beauty <nh534392@gmail.com>
ADMIN_EMAIL=nh534392@gmail.com

# Frontend URL (will update after Vercel deployment)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12
```

### 💡 Railway Variable Reference Syntax:
For database variables, use Railway's reference syntax:
- `DB_HOST=${{MySQL.MYSQL_HOST}}`
- `DB_USER=${{MySQL.MYSQL_USER}}`
- `DB_PASS=${{MySQL.MYSQL_PASSWORD}}`
- `DB_NAME=${{MySQL.MYSQL_DATABASE}}`

This automatically links to your MySQL service.

---

## 🔐 Step 4: Generate Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **"Mail"** and **"Other (Custom name)"**
5. Name it: "Aureva Railway Backend"
6. Click **"Generate"**
7. Copy the 16-character password
8. Use this as `EMAIL_PASS` in Railway

---

## 🔑 Step 5: Generate Strong JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as `JWT_SECRET` in Railway.

---

## 📦 Step 6: Deploy

1. After adding all environment variables, Railway will automatically deploy
2. Wait for deployment to complete (usually 2-3 minutes)
3. Check the **"Deployments"** tab for status

---

## ✅ Step 7: Verify Deployment

### 7.1 Get Your Backend URL
1. Go to your backend service in Railway
2. Click **"Settings"** tab
3. Scroll to **"Domains"**
4. Click **"Generate Domain"**
5. Copy the generated URL (e.g., `https://your-app.up.railway.app`)

### 7.2 Test Health Endpoint
Open in browser or use curl:
```bash
curl https://your-app.up.railway.app/health
```

Expected response:
```json
{
  "uptime": 123.456,
  "message": "OK",
  "timestamp": 1234567890,
  "environment": "production",
  "database": "connected"
}
```

### 7.3 Test Other Endpoints
```bash
# Test API root
curl https://your-app.up.railway.app/api/products

# Test categories
curl https://your-app.up.railway.app/api/categories
```

---

## 🔧 Step 8: Post-Deployment Setup

### 8.1 Create Admin User
Railway doesn't have direct terminal access, but you can:

**Option 1: Use Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run command
railway run npm run create-admin
```

**Option 2: Create via API**
Use Postman or curl to register an admin user, then manually update the database role to 'admin'.

### 8.2 Setup Categories
```bash
railway run npm run setup:categories
```

---

## 🌐 Step 9: Update CORS Settings

After deploying frontend to Vercel:
1. Go back to Railway
2. Update `FRONTEND_URL` variable with your Vercel URL
3. Railway will automatically redeploy

---

## 📊 Monitoring

### View Logs
1. Go to your backend service in Railway
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. View real-time logs

### Check Metrics
1. Go to **"Metrics"** tab
2. Monitor CPU, Memory, and Network usage

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL service is running
- Check database variable references: `${{MySQL.MYSQL_HOST}}`
- Ensure both services are in the same project

### Email Not Working
- Verify Gmail App Password is correct
- Check if 2FA is enabled on Gmail account
- Test with: `railway run node backend/scripts/testEmail.js`

### CORS Errors
- Update `FRONTEND_URL` with correct Vercel domain
- Ensure no trailing slash in URL
- Check Railway logs for CORS errors

### Port Issues
- Railway automatically assigns PORT
- Your app should use `process.env.PORT || 5000`
- Don't hardcode port 5000

---

## 📝 Important Notes

1. **Database Persistence**: Railway MySQL data persists across deployments
2. **Environment Variables**: Changes trigger automatic redeployment
3. **Logs**: Available for 7 days on free plan
4. **Custom Domain**: Can be added in Settings → Domains
5. **SSL**: Automatically provided by Railway

---

## 🎯 Next Steps

1. ✅ Backend deployed to Railway
2. ⏭️ Deploy frontend to Vercel
3. ⏭️ Update `FRONTEND_URL` in Railway
4. ⏭️ Test complete application
5. ⏭️ Create admin user
6. ⏭️ Setup categories
7. ⏭️ Add products

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: https://github.com/NazirHussain1/aureva-ecommerce-platform/issues

---

**Your Backend URL will be:** `https://[your-project-name].up.railway.app`

Save this URL - you'll need it for frontend deployment!
