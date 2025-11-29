# Gmail App Password Setup - Step by Step Guide

## What is an App Password?

An **App Password** is a 16-character code that Google generates for you to use with applications (like our Smart Attendance System) that need to access your Gmail account. It's more secure than using your regular password.

## Why Do You Need It?

Gmail doesn't allow regular passwords for SMTP email sending. You must use an App Password for security reasons.

---

## Complete Setup Steps

### Step 1: Enable 2-Factor Authentication (2FA)

**If you already have 2FA enabled, skip to Step 2.**

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **"Security"** in the left sidebar
3. Under **"How you sign in to Google"**, find **"2-Step Verification"**
4. Click on it and follow the prompts to enable it
5. You'll need to:
   - Verify your phone number
   - Enter the verification code sent to your phone
   - Complete the setup

**Note:** You MUST enable 2FA before you can create an App Password.

---

### Step 2: Generate App Password

1. **Go to App Passwords page:**
   - Direct link: https://myaccount.google.com/apppasswords
   - OR go to: https://myaccount.google.com/ → Security → 2-Step Verification → App passwords

2. **Sign in** if prompted

3. **Select App:**
   - Click the dropdown that says **"Select app"**
   - Choose **"Mail"**

4. **Select Device:**
   - Click the dropdown that says **"Select device"**
   - Choose **"Other (Custom name)"**
   - Type: **"Smart Attendance System"** (or any name you prefer)
   - Click **"Generate"**

5. **Copy the Password:**
   - Google will show you a **16-character password** like: `abcd efgh ijkl mnop`
   - **IMPORTANT:** Copy this password immediately (you won't see it again!)
   - Remove the spaces when using it: `abcdefghijklmnop`

---

### Step 3: Add to .env File

1. Open your `smart-attendance-backend/.env` file

2. Add or update these lines:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
```

**Replace:**
- `your-email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with the 16-character App Password you copied (no spaces!)

**Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=john.doe@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
```

**Note:** When you paste the App Password, remove the spaces. It should be one continuous string.

---

### Step 4: Restart Backend Server

After saving the .env file:

1. Stop your backend server (Ctrl+C)
2. Start it again: `npm run dev`

You should see: `Email service is ready to send messages` in the console.

---

## Troubleshooting

### "App passwords aren't available for this account"
- **Solution:** You need to enable 2-Step Verification first (Step 1)

### "Invalid login credentials" error
- **Solution:** 
  - Make sure you removed spaces from the App Password
  - Verify you copied the entire 16-character password
  - Make sure you're using the App Password, not your regular Gmail password

### "Less secure app access" error
- **Solution:** This shouldn't happen with App Passwords. If it does, make sure you're using the App Password, not your regular password.

### Can't find App Passwords page
- **Solution:** 
  - Make sure 2-Step Verification is enabled
  - Try direct link: https://myaccount.google.com/apppasswords
  - Make sure you're signed in to the correct Google account

---

## Security Notes

✅ **Safe to use:** App Passwords are secure and can be revoked anytime
✅ **Revoke if needed:** You can delete App Passwords from the same page
✅ **One per app:** You can create multiple App Passwords for different apps
✅ **Not your main password:** Your regular Gmail password stays the same

---

## Example .env File

Here's what your complete .env file should look like:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your-mongodb-connection-string

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

---

## Quick Checklist

- [ ] 2-Step Verification enabled on Google account
- [ ] App Password generated from https://myaccount.google.com/apppasswords
- [ ] 16-character password copied (without spaces)
- [ ] Added to .env file with correct format
- [ ] Backend server restarted
- [ ] See "Email service is ready" message in console

---

## Need Help?

If you're still having issues:
1. Check server console for error messages
2. Verify .env file has correct format (no extra quotes, no spaces in password)
3. Make sure backend server is restarted after .env changes
4. Test by marking attendance for a student with a valid email

