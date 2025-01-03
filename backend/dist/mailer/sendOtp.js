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
const mailer_1 = require("./mailer");
const node_cache_1 = __importDefault(require("node-cache"));
// Function to generate OTP
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
};
const otpCache = new node_cache_1.default({ stdTTL: 1800, checkperiod: 120 });
// Example usage in an authentication route
const sendOtpForAuthentication = (recipientEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = generateOtp();
    const response = yield (0, mailer_1.sendOtp)(recipientEmail, otp);
    otpCache.set("OTP", otp); // Store OTP in cache
    otpCache.set("EMAIL", recipientEmail); // Store email in cache
    console.log("OTP sent to", recipientEmail);
    console.log("Response", response);
    return response;
});
const validateOtp = (otpInput) => {
    const storedOtp = otpCache.get("OTP");
    if (storedOtp === otpInput) {
        console.log("OTP validated successfully!");
        return true;
    }
    else {
        console.log("Invalid OTP!");
        return false;
    }
};
const getOtp = () => {
    return otpCache.get("OTP");
};
const getEmail = () => {
    return otpCache.get("EMAIL");
};
exports.default = { sendOtpForAuthentication, validateOtp, getOtp, getEmail };
