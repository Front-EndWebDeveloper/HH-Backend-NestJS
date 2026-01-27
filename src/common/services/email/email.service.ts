import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailConfigService } from '../../../config/email/config.service';
import { VerificationEmailTemplate } from './templates/verification-email.template';
import { PasswordResetEmailTemplate } from './templates/password-reset-email.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private emailConfigService: EmailConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.emailConfigService.host,
      port: this.emailConfigService.port,
      secure: this.emailConfigService.secure,
      auth: this.emailConfigService.auth,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      const template = VerificationEmailTemplate.generate(
        this.emailConfigService.verificationUrl,
        token,
      );

      await this.transporter.sendMail({
        from: `"${this.emailConfigService.fromName}" <${this.emailConfigService.from}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      this.logger.log(`Verification email sent to: ${this.maskEmail(email)}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to: ${this.maskEmail(email)}`, error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      const template = PasswordResetEmailTemplate.generate(
        this.emailConfigService.passwordResetUrl,
        token,
      );

      await this.transporter.sendMail({
        from: `"${this.emailConfigService.fromName}" <${this.emailConfigService.from}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      this.logger.log(`Password reset email sent to: ${this.maskEmail(email)}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to: ${this.maskEmail(email)}`, error);
      throw error;
    }
  }

  private maskEmail(email: string): string {
    // HIPAA Compliance: Mask email in logs
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal =
      localPart.length > 2
        ? `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`
        : '**';
    return `${maskedLocal}@${domain}`;
  }
}
