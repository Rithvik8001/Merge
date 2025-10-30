import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (payload: EmailPayload): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Merge App" <${process.env.EMAIL_USER}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email sent to:", payload.to);
    }
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// Non-blocking version that sends in the background
export const sendEmailAsync = (payload: EmailPayload): void => {
  // Fire and forget - don't await or throw
  transporter.sendMail({
    from: `"Merge App" <${process.env.EMAIL_USER}>`,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  }).then(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email sent to:", payload.to);
    }
  }).catch((error) => {
    console.error("❌ Error sending email to", payload.to, ":", error);
    // Don't throw - email failure shouldn't block the main operation
  });
};

export const sendOTPEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #000; }
          .title { font-size: 20px; font-weight: bold; margin: 20px 0; color: #333; }
          .otp-box { background: #f0f0f0; border: 2px solid #ddd; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; font-family: 'Courier New', monospace; }
          .otp-expiry { color: #666; font-size: 14px; margin-top: 10px; }
          .message { color: #555; line-height: 1.6; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .warning-text { color: #856404; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Merge</div>
          </div>

          <div class="title">Verify Your Email Address</div>

          <div class="message">
            Thank you for signing up! Please verify your email address using the OTP below.
          </div>

          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="otp-expiry">This OTP expires in 10 minutes</div>
          </div>

          <div class="message">
            Enter this OTP in the verification screen to confirm your email address.
          </div>

          <div class="warning">
            <div class="warning-text">
              ⚠️ If you didn't sign up for Merge, please ignore this email. Never share your OTP with anyone.
            </div>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} Merge. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: "Verify Your Email - Merge App",
    html: htmlContent,
  });
};

// Non-blocking version for OTP emails - sends in background
export const sendOTPEmailAsync = (email: string, otp: string): void => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #000; }
          .title { font-size: 20px; font-weight: bold; margin: 20px 0; color: #333; }
          .otp-box { background: #f0f0f0; border: 2px solid #ddd; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; font-family: 'Courier New', monospace; }
          .otp-expiry { color: #666; font-size: 14px; margin-top: 10px; }
          .message { color: #555; line-height: 1.6; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .warning-text { color: #856404; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Merge</div>
          </div>

          <div class="title">Verify Your Email Address</div>

          <div class="message">
            Thank you for signing up! Please verify your email address using the OTP below.
          </div>

          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="otp-expiry">This OTP expires in 10 minutes</div>
          </div>

          <div class="message">
            Enter this OTP in the verification screen to confirm your email address.
          </div>

          <div class="warning">
            <div class="warning-text">
              ⚠️ If you didn't sign up for Merge, please ignore this email. Never share your OTP with anyone.
            </div>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} Merge. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  sendEmailAsync({
    to: email,
    subject: "Verify Your Email - Merge App",
    html: htmlContent,
  });
};
