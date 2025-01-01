import { GraphQLClient } from 'graphql-request';
import { supabase } from './supabaseClient';
// GraphQL client setup
const graphQLClient = new GraphQLClient(`${process.env.SUPABASE_URL}`, {
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


// Define the types for user data from the query
interface User {
  id: string;
  email: string;
  password: string;
}

// Define the response type for the GraphQL request
interface GraphQLResponse {
  users: User[];
}

async function loginUser(email: string, password: string) {
  try {
    const variables = { email, password };
    const data: GraphQLResponse = await graphQLClient.request(query, variables);

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
  } catch (error) {
    throw new Error(`Login failed: ${error}`);
  }
}

export { loginUser };
