import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // or any other email service
  auth: {
    user: "vivekp22it@student.mes.ac.in",
    pass: "Viveksam2113",
  },
});

// Function to send OTP
export const sendOtp = async (
  recipientEmail: string,
  otp: string
): Promise<void> => {
  const mailOptions = {
    from: "vivekp22it@student.mes.ac.in", // Sender email address
    to: recipientEmail, // Recipient email address
    subject: "OTP for Authentication",
    text: `Your OTP for authentication is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully!");
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};
