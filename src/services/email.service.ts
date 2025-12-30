import nodemailer from "nodemailer";
import AppLogger from "../library/logger";
import { env } from "../config/env.config";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    try {
      // Using proper environment variables from your .env file
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT),
        secure: env.SMTP_SECURE === "true",
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      AppLogger.info("📧 Email service initialized successfully");
    } catch (error) {
      AppLogger.error("❌ Email service initialization failed:", error as Error);
      this.transporter = null;
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        AppLogger.error("Email transporter not initialized");
        return false;
      }

      if (!env.SMTP_USER || !env.SMTP_PASS) {
        AppLogger.error("Email credentials not configured");
        return false;
      }

      const mailOptions = {
        from: {
          name: env.SMTP_FROM_NAME,
          address: env.SMTP_FROM_EMAIL,
        },
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      const result = await this.transporter.sendMail(mailOptions);

      AppLogger.info(`📧 Email sent successfully to ${options.to}`, {
        messageId: result.messageId,
        subject: options.subject,
      });

      return true;
    } catch (error) {
      AppLogger.error(`❌ Failed to send email to ${options.to}:`, error as Error);
      return false;
    }
  }

  // Simple OTP email template
  async sendOTPEmail(email: string, otp: string, username?: string): Promise<boolean> {
    const subject = "Password Reset Code";
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .otp-box { background: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; border: 2px dashed #007bff; }
            .otp-code { font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 4px; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🔐 Password Reset</h2>
            </div>
            
            <div class="content">
                <p><strong>Hello${username ? ` ${username}` : ""},</strong></p>
                
                <p>You requested a password reset. Use the verification code below:</p>
                
                <div class="otp-box">
                    <p><strong>Verification Code:</strong></p>
                    <div class="otp-code">${otp}</div>
                    <p><small>Expires in 10 minutes</small></p>
                </div>
                
                <p><strong>Security Notice:</strong></p>
                <ul>
                    <li>Never share this code with anyone</li>
                    <li>If you didn't request this, please ignore this email</li>
                </ul>
                
                <p>Best regards,<br>Support Team</p>
            </div>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>`;

    return await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  // Simple password reset confirmation email
  async sendPasswordResetConfirmation(email: string, username?: string): Promise<boolean> {
    const subject = "Password Reset Successful";
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d4edda; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .success-box { background: #d4edda; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>✅ Password Reset Successful</h2>
            </div>
            
            <div class="content">
                <p><strong>Hello${username ? ` ${username}` : ""},</strong></p>
                
                <div class="success-box">
                    <h3>🎉 Your password has been successfully reset!</h3>
                </div>
                
                <p>You can now log in with your new password.</p>
                
                <p><strong>If you didn't make this change:</strong><br>
                Please contact support immediately.</p>
                
                <p>Best regards,<br>Support Team</p>
            </div>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>`;

    return await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  // Utility to strip HTML for text version
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;