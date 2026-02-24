# ✅ Deployment Checklist

## Backend Deployment (Railway)

### Pre-Deployment
- [x] Backend branch created: `backend-deploy`
- [x] Branch pushed to GitHub
- [x] Code is production-ready
- [x] All console.logs removed
- [x] Environment variables documented

### Railway Setup
- [ ] Create Railway account
- [ ] Create new project
- [ ] Connect GitHub repo: `NazirHussain1/aureva-ecommerce-platform`
- [ ] Select branch: `backend-deploy`
- [ ] Add MySQL database service

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `DB_NAME=${{MySQL.MYSQL_DATABASE}}`
- [ ] `DB_USER=${{MySQL.MYSQL_USER}}`
- [ ] `DB_PASS=${{MySQL.MYSQL_PASSWORD}}`
- [ ] `DB_HOST=${{MySQL.MYSQL_HOST}}`
- [ ] `JWT_SECRET` (generate new 32+ char secret)
- [ ] `JWT_EXPIRES_IN=7d`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASS` (Gmail App Password)
- [ ] `EMAIL_FROM`
- [ ] `ADMIN_EMAIL`
- [ ] `FRONTEND_URL` (temporary, update after Vercel)
- [ ] `RATE_LIMIT_WINDOW_MS=900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS=100`
- [ ] `BCRYPT_SALT_ROUNDS=12`

### Deployment
- [ ] Wait for automatic deployment
- [ ] Check deployment logs
- [ ] Generate Railway domain
- [ ] Save backend URL

### Verification
- [ ] Test `/health` endpoint
- [ ] Test `/api/products` endpoint
- [ ] Test `/api/categories` endpoint
- [ ] Check database connection
- [ ] Verify logs show no errors

### Post-Deployment
- [ ] Create admin user (via Railway CLI or API)
- [ ] Setup categories (via Railway CLI)
- [ ] Test email system
- [ ] Test image upload (Cloudinary)

---

## Frontend Deployment (Vercel)

### Pre-Deployment
- [ ] Update `VITE_API_URL` to Railway backend URL
- [ ] Test production build locally: `npm run build`
- [ ] Verify no console.logs in production

### Vercel Setup
- [ ] Create Vercel account
- [ ] Import GitHub repo
- [ ] Select `aureva-frontend` as root directory
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`

### Environment Variables
- [ ] `VITE_API_URL` (Railway backend URL)

### Deployment
- [ ] Deploy to Vercel
- [ ] Wait for deployment
- [ ] Save frontend URL

### Verification
- [ ] Open frontend URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Test admin panel access

### Post-Deployment
- [ ] Update `FRONTEND_URL` in Railway
- [ ] Test CORS (frontend → backend)
- [ ] Test all API calls
- [ ] Test image uploads
- [ ] Test email notifications

---

## Final Checks

### Security
- [ ] HTTPS enabled (automatic on Railway/Vercel)
- [ ] CORS configured correctly
- [ ] Rate limiting working
- [ ] JWT authentication working
- [ ] No secrets exposed in frontend

### Functionality
- [ ] User registration works
- [ ] User login works
- [ ] Password reset works
- [ ] Product listing works
- [ ] Product search works
- [ ] Cart operations work
- [ ] Checkout works
- [ ] Order tracking works
- [ ] Admin panel accessible
- [ ] Product management works
- [ ] Order management works

### Performance
- [ ] Page load times acceptable
- [ ] API response times good
- [ ] Images loading properly
- [ ] No console errors in browser

### Monitoring
- [ ] Railway logs accessible
- [ ] Vercel logs accessible
- [ ] Error tracking setup (optional)
- [ ] Uptime monitoring (optional)

---

## 🎉 Deployment Complete!

**Backend URL:** `https://[your-project].up.railway.app`  
**Frontend URL:** `https://[your-project].vercel.app`

### Share with Users:
- [ ] Update README with live URLs
- [ ] Share demo credentials
- [ ] Create user documentation
- [ ] Announce launch! 🚀

---

## 📝 Notes

**Backend Branch:** `backend-deploy`  
**GitHub Repo:** https://github.com/NazirHussain1/aureva-ecommerce-platform

**Important:**
- Railway MySQL data persists across deployments
- Environment variable changes trigger redeployment
- Keep your `.env` files secure and never commit them
- Use strong passwords for production JWT_SECRET
- Enable 2FA on Gmail for app passwords

---

**Last Updated:** February 24, 2026
