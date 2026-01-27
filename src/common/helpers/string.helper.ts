export class StringHelper {
  static sanitize(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = local.slice(0, 2) + '***' + local.slice(-1);
    return `${maskedLocal}@${domain}`;
  }

  static maskPhone(phone: string): string {
    // HIPAA Compliance: Mask sensitive data
    return phone.replace(/\d(?=\d{4})/g, '*');
  }

  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
