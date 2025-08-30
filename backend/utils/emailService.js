const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // This should be an App Password from Gmail
  }
});

// Email templates
const emailTemplates = {
  otp: (otp, phone) => ({
    subject: 'Vahan Sewak - Your OTP for Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Vahan Sewak</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Vehicle Assistance Service</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Verification Code</h2>
          
          <div style="background: white; border: 2px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            This OTP is for verifying your mobile number <strong>+91 ${phone}</strong> on Vahan Sewak.
          </p>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #1976d2; font-size: 14px;">
              <strong>Security Note:</strong> This OTP is valid for 15 minutes. Never share this code with anyone.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you didn't request this OTP, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 Vahan Sewak. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

// Send OTP email
const sendOTPEmail = async (email, otp, phone) => {
  try {
    const template = emailTemplates.otp(otp, phone);
    
    const mailOptions = {
      from: `"Vahan Sewak" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  verifyEmailConfig
};
