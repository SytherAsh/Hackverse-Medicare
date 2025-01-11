const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

const sendWeeklyReportEmail = async ({ user, reportData }) => {
  try {
    if (!user.email) {
      throw new Error('Recipient email is not defined');
    }

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject:` Weekly Report for ${user.name}`,
      html: `
        <h2>Weekly Report Summary</h2>
        <p>Dear ${user.name},</p>
        <p>Here’s a summary of your activities and updates for the past week:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tbody>
            ${reportData}
          </tbody>
        </table>
        
        <p>We hope you find this report helpful. If you have any questions, feel free to reach out.</p>
        
        <p>Best regards,<br/>The Reporting Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Weekly report email sent to ${user.email}`);
  } catch (error) {
    logger.error('Error sending weekly report email:', error);
  }
};

module.exports = { sendWeeklyReportEmail };