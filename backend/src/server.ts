import { ApolloServer } from '@apollo/server';
import express from 'express';
import { startStandaloneServer } from '@apollo/server/standalone';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs, resolvers } from './graphql/schema';
import dotenv from 'dotenv';
import context from './context/context';
import { IncomingMessage, ServerResponse } from 'http';
import { JwtPayload } from 'jsonwebtoken';
import multer from 'multer';
dotenv.config();
interface User{
     id: Number,
    profile: string | null,
    username:string,
    email: string,
    followers: [Number] | null,
    following: [Number] | null,
    iat: number | undefined,
    exp: number | undefined
  }
const app = express();
app.use(bodyParser.json());
// Set up Apollo Server
const server = new ApolloServer<User>({
  typeDefs,
  resolvers,
});
app.use(express.json());
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
    context: async ({ req, res }: { req: IncomingMessage; res: ServerResponse }): Promise<User> => {
      // console.log((req as express.Request).body);
      const user = await context({ req,res }) as JwtPayload;
      return user as User;
    }
  });
  console.log(`🚀  Server ready at: ${url}`);
  app.use(cors());
};

startServer();
