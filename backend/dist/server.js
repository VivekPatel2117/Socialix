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
const server_1 = require("@apollo/server");
const express_1 = __importDefault(require("express"));
const standalone_1 = require("@apollo/server/standalone");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const schema_1 = require("./graphql/schema");
const dotenv_1 = __importDefault(require("dotenv"));
const context_1 = __importDefault(require("./context/context"));
// Load environment variables from the .env file
dotenv_1.default.config();
// Initialize the Express application
const app = (0, express_1.default)();
// Middleware to parse incoming request body as JSON
app.use(body_parser_1.default.json());
// Set up Apollo Server with type definitions and resolvers
const server = new server_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers: schema_1.resolvers,
});
// Middleware to parse JSON in incoming requests
app.use(express_1.default.json());
// Function to start the server and listen on port 5000
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // Start the Apollo Server and get the server URL
    const { url } = yield (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: 5000 },
        // Context function to authenticate and attach user data to each request
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, res }) {
            // Get user data from the context function based on JWT token in the request
            const user = yield (0, context_1.default)({ req, res });
            return user;
        }),
    });
    // Log the URL where the Apollo Server is running
    console.log(`🚀  Server ready at: ${url}`);
    // Enable CORS to allow cross-origin requests
    app.use((0, cors_1.default)());
});
// Start the server
startServer();
