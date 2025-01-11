const nodemailer = require('nodemailer');
const qrcode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const { logger } = require('../utils/logger');

const sendEventConfirmationEmail = async ({user,email}) => {
  try {
    // Generate the QR code with proper error correction level for higher quality
    if (!user.email) {
      throw new Error('Recipient email is not defined');
    }
    const qrData = JSON.stringify({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      eventId: event.eventId,
    });

    const qrCodeBuffer = await qrcode.toBuffer(qrData, { 
      errorCorrectionLevel: 'H',  
      width: 300,                 
    });

    const eTicketBuffer = await generateETicket(user, event, qrCodeBuffer);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Email with table and elaborative content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Event Registration Confirmation: ${event.eventDescription}`,
      html: `
        <h2>Event Registration Confirmation</h2>
        <p>Dear ${user.name},</p>
        <p>We are excited to confirm your registration for the upcoming event. Below are the event details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Event Description</th>
            <td style="border: 1px solid #ddd; padding: 8px;">${event.eventDescription}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
            <td style="border: 1px solid #ddd; padding: 8px;">2024-11-20T09:00:00Z</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Time</th>
            <td style="border: 1px solid #ddd; padding: 8px;">${event.startTime} - ${event.endTime}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Location</th>
            <td style="border: 1px solid #ddd; padding: 8px;">${event.location}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Format</th>
            <td style="border: 1px solid #ddd; padding: 8px;">${event.eventFormat}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Registration Fee</th>
            <td style="border: 1px solid #ddd; padding: 8px;">${event.registrationFee}</td>
          </tr>
        </table>
        
        <p>Please find attached your e-ticket. It includes a QR code that you will need to present upon entry to the event. Make sure to save this e-ticket for easy access on the day of the event.</p>

        <p><strong>Important Instructions:</strong></p>
        <ul>
          <li>Arrive at the venue at least 15 minutes before the event start time.</li>
          <li>Have your e-ticket ready on your phone or in printed form for quick check-in.</li>
          <li>Follow any health and safety protocols as outlined by the event organizers.</li>
        </ul>

        <p>We are looking forward to your presence and hope you enjoy the event. If you have any questions, feel free to reply to this email.</p>

        <p>Best regards,<br/>The Event Team</p>
      `,
      attachments: [
        {
          filename: 'e-ticket.png',
          content: eTicketBuffer,
          contentType: 'image/png',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${user.email}`);
  } catch (error) {
    logger.error('Error sending email:', error);
  }
};

const generateETicket = async (user, event, qrCodeBuffer) => {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px Arial';
  ctx.fillText(event.eventDescription, 20, 50);

  ctx.font = '20px Arial';
  ctx.fillText(`Name: ${user.fullName}`, 20, 100);
  ctx.fillText(`Email: ${user.email}`, 20, 140);
  ctx.fillText(`Phone: ${user.phoneNumber}`, 20, 180);
  // ctx.fillText(`Date: ${event.eventDate.toDateString()}`, 20, 220);
  ctx.fillText(`Time: ${event.startTime} - ${event.endTime}`, 20, 260);
  ctx.fillText(`Location: ${event.location}`, 20, 300);
  ctx.fillText(`Format: ${event.eventFormat}`, 20, 340);

  const qrImage = await loadImage(qrCodeBuffer);
  ctx.drawImage(qrImage, 600, 100, 180, 180);

  return canvas.toBuffer('image/png');
};

module.exports = {sendEventConfirmationEmail};