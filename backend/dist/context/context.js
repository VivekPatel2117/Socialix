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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (token) {
            const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            return user;
        }
        return null;
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        return null;
    }
});
const context = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, res }) {
    try {
        const reqBody = req.body;
        console.log("Request Body:", reqBody);
        if (reqBody && reqBody.operationName === "login" || reqBody.operationName === "sendOtpForUserAuth" || reqBody.operationName === "verifyOtp" || reqBody.operationName === "resetPassword" || reqBody.operationName === "Singup" || reqBody.operationName === "googleLogin") {
            return {};
        }
        // Get the authorization token from headers
        const authHeader = req.headers.authorization || '';
        if (!authHeader.startsWith("Bearer ")) {
            console.error("Invalid Authorization Header");
            return { user: null };
        }
        const token = authHeader.split(" ")[1];
        // Verify and retrieve the user
        const user = yield authUser(token);
        if (!user) {
            console.warn("User not authenticated");
            return { user: null };
        }
        return user;
    }
    catch (error) {
        console.error("Context Error:", error.message);
        return { user: null, error: error.message };
    }
});
exports.default = context;
