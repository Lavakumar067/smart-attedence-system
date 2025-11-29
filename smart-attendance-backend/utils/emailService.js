import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service configuration error:', error);
  } else {
    console.log('Email service is ready to send messages');
  }
});

/**
 * Send attendance notification email to student
 * @param {Object} options - Email options
 * @param {String} options.studentEmail - Student's email address
 * @param {String} options.studentName - Student's name
 * @param {String} options.status - Attendance status (present/absent/late)
 * @param {String} options.date - Attendance date
 * @param {String} options.studentId - Student ID
 */
export const sendAttendanceEmail = async ({
  studentEmail,
  studentName,
  status,
  date,
  studentId,
}) => {
  try {
    if (!studentEmail) {
      console.warn('No email address provided for student:', studentName);
      return { success: false, message: 'No email address provided' };
    }

    // Format date
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Status colors and messages
    const statusConfig = {
      present: {
        color: '#10b981', // emerald
        emoji: '✅',
        message: 'You were marked as Present',
        subject: `✅ Attendance Marked - Present (${formattedDate})`,
      },
      absent: {
        color: '#ef4444', // red
        emoji: '❌',
        message: 'You were marked as Absent',
        subject: `❌ Attendance Marked - Absent (${formattedDate})`,
      },
      late: {
        color: '#f59e0b', // amber
        emoji: '⏰',
        message: 'You were marked as Late',
        subject: `⏰ Attendance Marked - Late (${formattedDate})`,
      },
    };

    const config = statusConfig[status] || statusConfig.present;

    // Email HTML template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attendance Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Smart Attendance System</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
    <h2 style="color: ${config.color}; margin-top: 0; font-size: 24px;">
      ${config.emoji} ${config.message}
    </h2>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${config.color};">
      <p style="margin: 10px 0;"><strong>Student Name:</strong> ${studentName}</p>
      <p style="margin: 10px 0;"><strong>Student ID:</strong> ${studentId}</p>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${formattedDate}</p>
      <p style="margin: 10px 0;"><strong>Status:</strong> 
        <span style="color: ${config.color}; font-weight: bold; text-transform: uppercase;">
          ${status}
        </span>
      </p>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      This is an automated notification from the Smart Attendance System.
      If you have any questions or concerns, please contact your administrator.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
      <p>© ${new Date().getFullYear()} Smart Attendance System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Plain text version
    const textContent = `
Smart Attendance System

${config.message}

Student Name: ${studentName}
Student ID: ${studentId}
Date: ${formattedDate}
Status: ${status.toUpperCase()}

This is an automated notification from the Smart Attendance System.
If you have any questions or concerns, please contact your administrator.

© ${new Date().getFullYear()} Smart Attendance System. All rights reserved.
    `;

    // Send email
    const mailOptions = {
      from: `"Smart Attendance System" <${process.env.SMTP_USER}>`,
      to: studentEmail,
      subject: config.subject,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default transporter;

