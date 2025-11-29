# Email Notification Setup Guide

## Overview
The Smart Attendance System sends automatic email notifications to students when their attendance is marked (Present, Absent, or Late).

## Email Configuration

### Step 1: Add Email Settings to .env

Add the following variables to your `smart-attendance-backend/.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Step 2: Gmail Setup (Recommended)

If using Gmail, you need to:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Smart Attendance System"
   - Copy the generated 16-character password
   - Use this password as `SMTP_PASSWORD` in your .env file

### Step 3: Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
```

#### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
```

## How It Works

1. When attendance is marked (manually or via facial recognition), the system:
   - Saves the attendance record
   - Automatically sends an email to the student's registered email address
   - Email includes: Student name, ID, date, and attendance status

2. Email notifications are sent asynchronously (non-blocking):
   - If email fails, attendance is still saved
   - Errors are logged but don't affect the attendance marking process

## Email Template

The email includes:
- ✅ **Present**: Green-themed email with success message
- ❌ **Absent**: Red-themed email with absence notification
- ⏰ **Late**: Amber-themed email with late arrival notification

Each email contains:
- Student name and ID
- Attendance date
- Attendance status
- Professional HTML formatting

## Testing

1. Make sure your .env file has correct SMTP credentials
2. Restart your backend server
3. Mark attendance for a student (manually or via facial recognition)
4. Check the student's email inbox
5. Check server logs for email sending status

## Troubleshooting

### Email not sending?
- Check SMTP credentials in .env file
- Verify email service is running (check server logs)
- For Gmail: Make sure you're using an App Password, not your regular password
- Check firewall/network settings

### Email going to spam?
- This is normal for automated emails
- Students should check their spam folder
- Consider using a professional email service (SendGrid, Mailgun) for better deliverability

## Disabling Email Notifications

To disable email notifications, simply don't set the SMTP credentials in .env, or comment them out. The system will continue to work but won't send emails.

