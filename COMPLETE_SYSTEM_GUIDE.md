# Aureva Beauty - Complete System Guide

## 🔐 Password Reset System (OTP-Based)

### Customer Flow:

**Step 1: Request OTP**
- Go to `/forgot-password`
- Enter email address
- Click "Send OTP"
- Backend generates 6-digit OTP
- OTP valid for 10 minutes
- Email sent with OTP code

**Step 2: Verify OTP**
- Enter 6-digit OTP received in email
- Timer shows remaining time (10:00 countdown)
- Can resend OTP after expiry
- Click "Verify OTP"
- Backend validates OTP and generates reset token

**Step 3: Create New Passw