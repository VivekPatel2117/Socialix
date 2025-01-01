import { IncomingMessage, ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import express from 'express';

const authUser = async (token: string) => {
  try {
    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET!);
      return user;
    }
    return null;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
};

const context = async ({ req, res }: { req: IncomingMessage; res: ServerResponse }) => {
  try {
    const reqBody = (req as express.Request).body;

    // Skip auth for specific operations (like login)
    if (reqBody && reqBody.operationName === "login" || reqBody.operationName === "Singup" || reqBody.operationName === "googleLogin") {
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
    const user = await authUser(token);

    if (!user) {
      console.warn("User not authenticated");
      return { user: null };
    }
    return user ;
  } catch (error: any) {
    console.error("Context Error:", error.message);
    return { user: null, error: error.message };
  }
};

export default context;
