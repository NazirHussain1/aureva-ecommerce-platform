# Security Quick Reference Guide

**Quick access guide for developers working on Aureva Beauty**

---

## 🔐 Authentication & Tokens

### Current Implementation
```javascript
// Token stored in localStorage (XSS vulnerable)
localStorage.setItem('token', token);

// Auto-logout on 401
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

### ⚠️ Security Notes
- localStorage is vulnerable to XSS attacks
- For production: Consider httpOnly cookies
- Implement token refresh for better security

---

## 🌐 Environment Variables

### Setup
```bash
# Copy example file
cp .env.example .env

# Edit with your values
VITE_API_URL=http://localhost:5000
```

### Usage in Code
```javascript
// ✅ CORRECT - Use environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ❌ WRONG - Never hardcode
const API_URL = 'http://localhost:5000';
```

### Production
```bash
# Production .env (NEVER commit this file)
VITE_API_URL=https://api.aureva.com
```

---

## 🛡️ API Security

### All API Calls Use Axios Instance
```javascript
// ✅ CORRECT
import axios from '../../api/axios';
const response = await axios.get('/api/products');

// ❌ WRONG - Don't use fetch or create new axios instances
const response = await fetch('http://localhost:5000/api/products');
```

### Automatic Token Injection
```javascript
// Token automatically added to all requests
// No need to manually add Authorization header
```

### Error Handling
```javascript
try {
  const response = await axios.get('/api/products');
  return response.data;
} catch (error) {
  // Don't expose internal errors to users
  console.error('API Error:', error);
  toast.error('Failed to load products');
}
```

---

## 🔒 Input Validation

### Email Validation
```javascript
// ✅ CORRECT
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  toast.error('Invalid email address');
  return;
}
```

### URL Validation
```javascript
// ✅ CORRECT
<input
  type="url"
  pattern="https?://.+"
  placeholder="https://example.com"
/>
```

### Sanitize User Input
```javascript
// For displaying user-generated HTML
import DOMPurify from 'dompurify';
const cleanHTML = DOMPurify.sanitize(userInput);
```

---

## 🚫 What NOT to Do

### ❌ Never Log Sensitive Data
```javascript
// ❌ BAD
console.log('Token:', token);
console.log('Password:', password);
console.log('User data:', user);

// ✅ GOOD
console.log('User logged in successfully');
```

### ❌ Never Hardcode URLs
```javascript
// ❌ BAD
const API_URL = 'http://localhost:5000';
const SOCKET_URL = 'ws://localhost:5000';

// ✅ GOOD
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### ❌ Never Commit Secrets
```bash
# ❌ BAD - Never commit these files
.env
.env.local
.env.production

# ✅ GOOD - Only commit example file
.env.example
```

### ❌ Never Expose Error Details
```javascript
// ❌ BAD - Exposes internal details
catch (error) {
  toast.error(error.message);
}

// ✅ GOOD - Generic message
catch (error) {
  console.error('Error:', error);
  toast.error('Something went wrong. Please try again.');
}
```

---

## ✅ Security Checklist

### Before Committing Code
- [ ] No hardcoded URLs or credentials
- [ ] No console.log with sensitive data
- [ ] All API calls use axios instance
- [ ] Proper error handling
- [ ] Input validation on forms
- [ ] No `.env` files in commit

### Before Deploying
- [ ] Environment variables configured
- [ ] HTTPS enabled for production
- [ ] Error monitoring set up
- [ ] Security headers configured
- [ ] Dependencies updated
- [ ] `npm audit` passed

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `src/api/axios.js` | Axios instance with interceptors |
| `src/features/auth/authSlice.js` | Authentication state management |
| `.env.example` | Environment variable template |
| `SECURITY_IMPROVEMENTS.md` | Full security documentation |

---

## 🆘 Common Issues

### Issue: API calls failing with CORS error
**Solution:** Check backend CORS configuration and API URL

### Issue: Token not being sent with requests
**Solution:** Ensure using axios instance from `src/api/axios.js`

### Issue: Auto-logout not working
**Solution:** Backend must return 401 status for unauthorized requests

### Issue: Environment variables not loading
**Solution:** Restart dev server after changing `.env` file

---

## 📞 Need Help?

- Read full documentation: `SECURITY_IMPROVEMENTS.md`
- Check architecture guide: `ARCHITECTURE_STANDARDIZATION.md`
- Review API standards: `API_STANDARDIZATION_COMPLETE.md`

---

**Last Updated:** May 11, 2026  
**Version:** 1.0
