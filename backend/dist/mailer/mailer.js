"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create a transporter object using SMTP transport
const transporter = nodemailer_1.default.createTransport({
    service: "gmail", // or any other email service
    auth: {
        user: "vivekp22it@student.mes.ac.in",
        pass: process.env.EMAIL_PASSWORD,
    },
});
// Function to send OTP
const sendOtp = (recipientEmail, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: "vivekp22it@student.mes.ac.in", // Sender email address
        to: recipientEmail, // Recipient email address
        subject: "OTP for Authentication",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Email</title>
  <style>
    /* General Reset */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .email-header {
      background-color: #4caf50;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      text-align: center;
      color: #333333;
    }
    .email-body p {
      font-size: 16px;
      line-height: 1.5;
      margin: 0 0 20px;
    }
    .otp-code {
      display: inline-block;
      background-color: #f1f1f1;
      padding: 15px 25px;
      border-radius: 8px;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 3px;
      color: #333333;
    }
    .email-footer {
      background-color: #f9f9f9;
      text-align: center;
      padding: 10px;
      font-size: 14px;
      color: #777777;
    }
    .email-footer a {
      color: #4caf50;
      text-decoration: none;
    }
    /* Responsive Design */
    @media (max-width: 600px) {
      .email-container {
        width: 90%;
      }
      .otp-code {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Verify Your Email</h1>
    </div>
    <div class="email-body">
      <p>Hi User,</p>
      <p>We received a request to verify your email address. Please use the OTP below to complete the verification process:</p>
      <div class="otp-code">${otp}</div>
      <p>If you did not request this, please ignore this email or contact support.</p>
    </div>
    <div class="email-footer">
      <p>If you have any questions, contact us at <a href="mailto:vivekpatel1374@gmail.com">vivekpatel1374@gmail.com</a></p>
      <p>&copy; 2025 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log("OTP sent successfully!");
    }
    catch (error) {
        console.error("Error sending OTP:", error);
    }
});
exports.sendOtp = sendOtp;
