import React, { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";
// import "./styles.css"; // Import TailwindCSS

// Apollo Client Setup
const client = new ApolloClient({
  uri: "https://your-supabase-project-url.supabase.co/graphql/v1", // Replace with your Supabase GraphQL endpoint
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer your-supabase-anon-key`, // Replace with your Supabase anonymous key
  },
});

// GraphQL Query
const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: String!) {
    user(id: $userId) {
      username
      followers
      following
      posts {
        id
        image
        caption
      }
    }
  }
`;

// TypeScript Interfaces
interface Post {
  id: number;
  image: string;
  caption: string;
}

interface ProfileData {
  user: {
    username: string;
    followers: number;
    following: number;
    posts: Post[];
  };
}

const ProfileContent: React.FC = () => {
  const userId = "user-id-here"; // Replace with a dynamic user ID as needed
  const { loading, error, data } = useQuery<ProfileData>(GET_USER_PROFILE, {
    variables: { userId },
  });

  // Mock Data (Fallback in case of error)
  const mockData: ProfileData = {
    user: {
      username: "john_doe",
      followers: 120,
      following: 200,
      posts: [
        { id: 1, image: "https://via.placeholder.com/150", caption: "Beautiful Sunset 🌅" },
        { id: 2, image: "https://via.placeholder.com/150", caption: "Delicious Food 🍔" },
        { id: 3, image: "https://via.placeholder.com/150", caption: "Vacation Vibes 🏝️" },
      ],
    },
  };

  const profileData = data?.user || mockData.user;

  if (loading) return <div className="text-center text-gray-700 font-semibold">Loading...</div>;
  if (error) {
    console.error("GraphQL Error:", error);
    return <div className="text-center text-red-500">Failed to load data.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-300"></div>
          <div>
            <h2 className="text-2xl font-semibold">{profileData.username}</h2>
            <div className="flex gap-6 mt-2">
              <div>
                <span className="text-lg font-semibold">{profileData.posts.length}</span> Posts
              </div>
              <div>
                <span className="text-lg font-semibold">{profileData.followers}</span> Followers
              </div>
              <div>
                <span className="text-lg font-semibold">{profileData.following}</span> Following
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <div className="max-w-4xl mx-auto mt-6">
        <h3 className="text-xl font-semibold mb-4">Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profileData.posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-gray-700">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <ProfileContent />
    </ApolloProvider>
  );
};

export default Profile;
