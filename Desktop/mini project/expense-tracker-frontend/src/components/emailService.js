// emailService.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // For example, 'gmail', 'hotmail', etc.
  auth: {
    user: 'expensetracker.ocr@gmail.com',
    pass: 'nyse fsew kyti qwfz'
  }
});

const sendEmail = async (pdfBuffer) => {
  try {
    const userEmail = localStorage.getItem('userEmail')
    // Email details
    const mailOptions = {
      from: 'expensetracker.ocr@gmail.com',
      to: userEmail,
      subject: 'Expense Tracker Weekly Report',
      text: 'Please find the attached weekly report.',
      attachments: [
        {
          filename: 'table.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
