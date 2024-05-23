const nodemailer = require('nodemailer');
const config = require('../config');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
      },
    });
  }

  async sendActivationMail(to, link) {
    try {
      await this.transporter.sendMail({
        from: config.smtp.user,
        to,
        subject: `Activate your account on ${config.apiUrl}`,
        text: '',
        html: this.generateActivationEmail(link),
      });
      console.log(`Activation email sent successfully to ${to}`);
    } catch (error) {
      console.error(`Error sending activation email to ${to}:`, error);
      throw new Error('Failed to send activation email');
    }
  }

  generateActivationEmail(link) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Account Activation</title>
        <style type="text/css">
          /* Add your email styles here */
        </style>
      </head>
      <body>
        <h1>Activate your account</h1>
        <p>Thank you for registering! Please click the link below to activate your account:</p>
        <a href="${link}">Activate Account</a>
      </body>
      </html>
    `;
  }
}

module.exports = new MailService();
