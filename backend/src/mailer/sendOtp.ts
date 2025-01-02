import { sendOtp } from "./mailer";
import NodeCache from "node-cache";
// Function to generate OTP
const generateOtp = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

const otpCache = new NodeCache({ stdTTL: 1800, checkperiod: 120 }); 
// Example usage in an authentication route
const sendOtpForAuthentication = async (recipientEmail: string) => {
  const otp = generateOtp();
  const response = await sendOtp(recipientEmail, otp);
  otpCache.set("OTP", otp); // Store OTP in cache
  otpCache.set("EMAIL", recipientEmail); // Store email in cache
  console.log("OTP sent to", recipientEmail);
  console.log("Response",response)
  return response
};

const validateOtp = (otpInput: string): boolean => {
  const storedOtp = otpCache.get("OTP");
  if (storedOtp === otpInput) {
    console.log("OTP validated successfully!");
    return true;
  } else {
    console.log("Invalid OTP!");
    return false;
  }
};
const getOtp = () => {
  return otpCache.get("OTP");
}
const getEmail = () => {  
  return otpCache.get("EMAIL");
}
export default { sendOtpForAuthentication, validateOtp, getOtp, getEmail };
