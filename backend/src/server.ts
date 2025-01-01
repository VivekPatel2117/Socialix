import { ApolloServer } from '@apollo/server';
import express from 'express';
import { startStandaloneServer } from '@apollo/server/standalone';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs, resolvers } from './graphql/schema';
import dotenv from 'dotenv';
import context from './context/context';
import { IncomingMessage, ServerResponse } from 'http';
import { JwtPayload } from 'jsonwebtoken';

// Load environment variables from the .env file
dotenv.config();

// Define the User interface to type the user data
interface User {
  id: Number;
  profile: string | null;
  username: string;
  email: string;
  followers: [Number] | null;
  following: [Number] | null;
  iat: number | undefined;
  exp: number | undefined;
}

// Initialize the Express application
const app = express();

// Middleware to parse incoming request body as JSON
app.use(bodyParser.json());

// Set up Apollo Server with type definitions and resolvers
const server = new ApolloServer<User>({
  typeDefs,
  resolvers,
});

// Middleware to parse JSON in incoming requests
app.use(express.json());

// Function to start the server and listen on port 5000
const startServer = async () => {
  // Start the Apollo Server and get the server URL
  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },

    // Context function to authenticate and attach user data to each request
    context: async ({ req, res }: { req: IncomingMessage; res: ServerResponse }): Promise<User> => {
      // Get user data from the context function based on JWT token in the request
      const user = await context({ req, res }) as JwtPayload;
      return user as User;
    },
  });

  // Log the URL where the Apollo Server is running
  console.log(`🚀  Server ready at: ${url}`);

  // Enable CORS to allow cross-origin requests
  app.use(cors());
};

// Start the server
startServer();
