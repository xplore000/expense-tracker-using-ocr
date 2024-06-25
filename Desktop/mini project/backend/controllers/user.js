const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const userModel = require("../models/userModel");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("output = ", req.body);
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("no user");
      return res.status(404).send("User not found");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(400).send("Invalid email or password");
    }

    res.status(200).json({ success: true, user });
    console.log("test");
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'expensetracker.ocr@gmail.com',
    pass: 'ggnh qcxs jknw gdnl',
  },
});

// Register callback with OTP generation and sending
const registerController = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP

    const newUser = new userModel({ name, email, password, phoneNumber, otp });
    await newUser.save();

    const mailOptions = {
      from: 'xploreabel@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Error sending email', error });
      }
      res.status(201).json({ success: true, message: 'OTP sent to email', newUser });
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error registering user', error });
  }
};

// Verify OTP callback
const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (user && user.otp === otp) {
      user.otp = null; // Clear OTP
      await user.save();
      res.status(200).json({ success: true, message: 'OTP verified, user registered successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying OTP', error });
  }
};

// Resend OTP callback
const resendOtpController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const otp = crypto.randomInt(100000, 999999).toString(); // Generate a new 6-digit OTP
      user.otp = otp;
      await user.save();

      const mailOptions = {
        from: 'xploreabel@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ success: false, message: 'Error sending email', error });
        }
        res.status(200).json({ success: true, message: 'OTP resent to email' });
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resending OTP', error });
  }
};

module.exports = { loginController, registerController, verifyOtpController, resendOtpController };
