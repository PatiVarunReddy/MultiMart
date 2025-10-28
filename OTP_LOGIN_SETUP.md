# OTP Email Login Setup Guide

## Overview
The application now uses a two-factor authentication system where users must verify their identity with an OTP (One-Time Password) sent to their email after providing correct login credentials.

## Login Flow
1. User enters email and password
2. Credentials are validated
3. If valid, user is redirected to OTP verification page
4. OTP is automatically sent to the registered email
5. User enters the 6-digit OTP code
6. OTP is verified and user is logged in
7. User is redirected to their dashboard (based on role)

## Email Configuration

### Gmail App Password Setup

To enable email OTP delivery using Gmail:

1. **Enable 2-Factor Authentication on your Gmail account**
   - Go to https://myaccount.google.com/security
   - Click on "2-Step Verification"
   - Follow the setup process

2. **Generate an App Password**
   - Visit https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device type)
   - Google will generate a 16-character password with spaces
   - Copy this password

3. **Update .env file**
   - Open `backend/.env`
   - Set: `SMTP_USER=your-email@gmail.com`
   - Set: `SMTP_PASS=` (paste the 16-character password from step 2)
   - Example: `SMTP_PASS=ddhj ywxe hbzy mscu`
   - The system automatically handles spaces in the password

4. **Verify Configuration**
   - Ensure `DEV_OTP=false` (we removed dev mode)
   - Ensure `NODE_ENV=development` or `production`
   - Current settings in `.env`:
     ```
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=varunreddy.pati2@gmail.com
     SMTP_PASS=ddhj ywxe hbzy mscu
     SMTP_FROM=MultiMart <varunreddy.pati2@gmail.com>
     ```

## Security Features Implemented

1. **OTP Expiration**: OTP codes expire after 10 minutes
2. **Rate Limiting**: Maximum 5 OTP requests per 15 minutes per identifier
3. **Failed Attempts Blocking**: After 5 failed OTP verification attempts, account is blocked for 30 minutes
4. **One-Time Use**: OTP can only be used once
5. **Email Verification**: Only registered emails can receive OTP

## Files Modified

### Backend
- `routes/authRoutes.js` - Removed dev OTP endpoint
- `controllers/authController.js` - Removed dev OTP function
- `.env` - Set DEV_OTP=false

### Frontend
- `src/app/services/auth.service.ts` - Removed fetchLastOtp method
- `src/app/pages/auth/login/login.component.ts` - Modified to redirect to OTP page
- `src/app/pages/auth/verify-otp/verify-otp.component.ts` - Removed dev OTP helper
- `src/app/app-routing.module.ts` - Added verify-otp route

## Testing the OTP Flow

1. Register a new account or use an existing account
2. Go to login page
3. Enter email and password
4. Check your email inbox for the OTP code
5. Enter the OTP code on the verification page
6. You should be successfully logged in

## Troubleshooting

### Email Not Arriving
- Verify SMTP credentials are correct in `.env`
- Check server logs for error messages
- Ensure Gmail app password was generated correctly (16 characters with spaces)
- Check spam/junk folder in email
- Verify the email is registered in the system

### Authentication Failed
- Ensure DEV_OTP=false in `.env`
- Check that NODE_ENV is set correctly
- Verify mailer is initialized properly in server logs

### Rate Limiting
- If too many requests, wait 15 minutes before trying again
- If too many failed attempts, wait 30 minutes before trying again

## Environment Variables Reference

```
MONGODB_URI=mongodb://localhost:27017/mvmp_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
PORT=5000

# Development flags
DEV_OTP=false
NODE_ENV=development

# SMTP (email) - for OTP email delivery
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=MultiMart <your-email@gmail.com>
```

## Support for Other Email Providers

To use a different email provider (Outlook, Yahoo, SendGrid, etc.):

1. Update `SMTP_HOST` and `SMTP_PORT` for your provider
2. Generate an app-specific password if required
3. Update `SMTP_USER` and `SMTP_PASS`
4. Update `SMTP_FROM` with your email and display name
