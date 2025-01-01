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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
const graphql_request_1 = require("graphql-request");
// GraphQL client setup
const graphQLClient = new graphql_request_1.GraphQLClient(`${process.env.SUPABASE_URL}`, {
    headers: {
        Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
    },
});
// GraphQL query to get user by email
const query = `
  query GetUserByEmailAndPassword($email: String!, $password: String!) {
    users(where: { email: { _eq: $email }, password: { _eq: $password } }) {
      id
      email
    }
  }
`;
function loginUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const variables = { email, password };
            const data = yield graphQLClient.request(query, variables);
            const user = data.users[0];
            if (!user) {
                throw new Error('Invalid credentials');
            }
            // Compare the entered password with the stored password hash
            // Return success if credentials are valid
            return {
                id: user.id,
                email: user.email,
                message: 'Login successful',
            };
        }
        catch (error) {
            throw new Error(`Login failed: ${error}`);
        }
    });
}
