const Ticket = require('../models/ticketModel') // Assuming you have defined the Ticket model
const nodemailer = require('nodemailer');

// Function to store a new ticket
const storeTicket = async (req, res) => {
  const { userMessage, ticketNumber, userId } = req.body;

  try {
    // Create a new ticket object
    const newTicket = new Ticket({
      userMessage,
      ticketNumber,
      userId
    });

    // Save the ticket to the database
    const savedTicket = await newTicket.save();

    // Respond with the saved ticket object
    res.status(201).json(savedTicket);
  } catch (err) {
    // Handle errors
    console.error('Error storing ticket:', err);
    res.status(500).json({ error: 'Error storing ticket', message: err.message });
  }
};
// Function to send an email
const sendEmail = async (req, res) => {
  const { userEmail, ticketNumber,userMessage } = req.body;

  try {
    // Configure nodemailer (replace with your email service provider configuration)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:'expensetracker.ocr@gmail.com',
        pass: 'ggnh qcxs jknw gdnl', // Replace with your email password or app-specific password
      }
    });

    // Email content
    const mailOptions = {
      from: 'expensetracker.ocr@gmail.com',
      to: userEmail,
      subject: 'Ticket Raised Successfully',
      text: `Your ticket has been successfully raised for the problem mentioned : "${userMessage}" ..
              Ticket number: ${ticketNumber}`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log success message
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    // Handle errors
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Error sending email', message: err.message });
  }
};

module.exports = {
  storeTicket,
  sendEmail
};
