import { gql } from "graphql-tag";
import { supabase } from "../supabaseClient";
import jwt from "jsonwebtoken";
import { jwtDecode, JwtPayload } from "jwt-decode";

// Define type definitions
export const typeDefs = gql`
  type User {
    id: ID!
    profile: String
    username: String!
    password: String!
    email: String!
    followers: String
    following: String
    token: String
  }

  type UserProfile {
    user: User
    isFollowedByLoggedUser: Boolean
    postData: [Post]
  }

  type BasicUser {
    id: ID!
    username: String!
    profile: String
  }

  type UploadResponse {
    message: String!
    isUploaded: Boolean!
    publicUrl: String
  }

  type CreateResponse {
    message: String
    isCreated: Boolean
  }

  type FollowResponse {
    message: String
    isFollowed: Boolean
  }

  type PostTag {
    tagedUserId: String
    tagedUserName: String
  }

  type Post {
    id: ID
    postImage: String
    caption: String
    createdBy: ID
    tagedUsers: [PostTag]
    postedBy: BasicUser
    created_at: String
    category: String
    postTitle: String
  }

  type Query {
    GetBasicUserDetails: BasicUser
    GetUserProfile(limit: Int, offset: Int): UserProfile
    GetPost(limit: Int, offset: Int): [Post]
    GetUserProfileById(id: ID!, limit: Int, offset: Int): UserProfile
  }

  type Mutation {
    UnFollowUser(userId: ID!): FollowResponse
    FollowUser(userId: ID!): FollowResponse
    createUser(
      username: String!
      email: String!
      password: String!
    ): CreateResponse
    searchUsersByLetters(letter: String!): [BasicUser]
    loginUser(email: String!, password: String!): User
    loginWithGoogle(code: String!): User
    uploadFile(
      file: String
      caption: String
      postTitle: String
      category: String!
      taggedUserIds: [String] # Correct array of strings
    ): UploadResponse
  }
`;

// Define resolvers
export const resolvers = {
  Query: {
    GetBasicUserDetails: async (
      _: any,
      { id }: { id: String },
      context: any
    ) => {
      try {
        console.log("COntextttt", context.id);
        const { data, error } = await supabase
          .from("socialix")
          .select("id, username, profile")
          .eq("id", context.id)
          .single();
        console.log("data", data);
        if (error) {
          throw new Error(
            `Error occured while getting basic usee details:${error}`
          );
        }
        return { id: data.id, username: data.username, profile: data.profile };
      } catch (err) {
        console.error("Error searching users:", err);
        return [];
      }
    },
    GetUserProfile: async (_: any, { id, limit = 10, offset = 0}: { id: String, limit: number, offset: number }, context: any) => {
      try {
        // Fetch user data
        const { data, error } = await supabase
          .from("socialix")
          .select("id, profile, username, followers, following")
          .eq("id", context.id)
          .single();

        if (error) {
          throw new Error(`Failed to get user data: ${error.message}`);
        }

        const userData = {
          id: data.id,
          profile: data.profile,
          username: data.username,
          followers: data.followers,
          following: data.following,
        };

        // Fetch user posts
        const { data: postData, error: postError } = await supabase
          .from("post")
          .select(
            "id, postImage, caption, tagedUserId, createdBy, created_at, category, postTitle"
          )
          .eq("createdBy", context.id)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (postError) {
          throw new Error(`Failed to get posts: ${postError.message}`);
        }

        // Enrich post data with tagged users' details and BasicUser details
        const enrichedPosts = [];
        for (const post of postData) {
          // Fetch BasicUser details for the post's creator
          const { data: creatorData, error: creatorError } = await supabase
            .from("socialix")
            .select("id, username, profile")
            .eq("id", post.createdBy)
            .single();

          if (creatorError) {
            throw new Error(
              `Failed to get creator details: ${creatorError.message}`
            );
          }

          const postedBy = {
            id: creatorData.id,
            username: creatorData.username,
            profile: creatorData.profile,
          };

          // Check if tagedUserId exists and is not null
          if (!post.tagedUserId) {
            enrichedPosts.push({
              ...post,
              postedBy,
              tagedUsers: [], // Set an empty array if there are no tagged users
            });
            continue;
          }

          const tagedUserIds = post.tagedUserId.split(",");

          // Fetch tagged user details
          const { data: taggedUsersData, error: taggedUserError } =
            await supabase
              .from("socialix")
              .select("id, username, profile")
              .in("id", tagedUserIds);

          if (taggedUserError) {
            throw new Error(
              `Error fetching tagged user data: ${taggedUserError.message}`
            );
          }

          // Prepare tagged users details
          const tagedUserDetails = taggedUsersData.map((user) => ({
            tagedUserId: user.id,
            tagedUserName: user.username,
          }));

          enrichedPosts.push({
            ...post,
            postedBy,
            tagedUsers: tagedUserDetails, // Add tagged users to post
          });
        }

        console.log("Enriched Posts:", enrichedPosts);

        // Return the response
        return {
          user: userData,
          postData: enrichedPosts,
        };
      } catch (err) {
        console.error("Error occurred while fetching user profile:", err);
        return { err };
      }
    },

    GetUserProfileById: async (
      _: any,
      {
        id,
        limit = 10,
        offset = 0,
      }: { id: String; limit: number; offset: number },
      context: any
    ) => {
      try {
        let isFollowedByLoggedUser = false;
        const { data, error } = await supabase
          .from("socialix")
          .select("id, profile, username, followers, following")
          .eq("id", id)
          .single();
        if (data) {
          const { data: contextUser } = await supabase
            .from("socialix")
            .select("following")
            .eq("id", context.id)
            .single();
          const following = contextUser?.following
            ? contextUser?.following.split(",")
            : [];
          isFollowedByLoggedUser = following.includes(String(id));
          const userData = {
            id: data.id,
            profile: data.profile,
            username: data.username,
            followers: data.followers,
            following: data.following,
          };
          const { data: postData, error } = await supabase
            .from("post")
            .select(
              "id, postImage, caption, tagedUserId, createdBy, created_at, category, postTitle"
            )
            .eq("createdBy", id)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);
          if (error) {
            throw new Error(`Failed to get posts: ${error.message}`);
          }

          // Enrich post data with tagged users' details and BasicUser details
          const enrichedPosts = [];
          for (const post of postData) {
            // Fetch BasicUser details for the post's creator
            const { data: creatorData, error: creatorError } = await supabase
              .from("socialix")
              .select("id, username, profile")
              .eq("id", post.createdBy)
              .single();

            if (creatorError) {
              throw new Error(
                `Failed to get creator details: ${creatorError.message}`
              );
            }

            const postedBy = {
              id: creatorData.id,
              username: creatorData.username,
              profile: creatorData.profile,
            };

            // Check if tagedUserId exists and is not null
            if (!post.tagedUserId) {
              enrichedPosts.push({
                ...post,
                postedBy,
                tagedUsers: [], // Set an empty array if there are no tagged users
              });
              continue;
            }

            const tagedUserIds = post.tagedUserId.split(",");

            // Fetch tagged user details
            const { data: taggedUsersData, error: taggedUserError } =
              await supabase
                .from("socialix")
                .select("id, username, profile")
                .in("id", tagedUserIds);

            if (taggedUserError) {
              throw new Error(
                `Error fetching tagged user data: ${taggedUserError.message}`
              );
            }

            // Prepare tagged users details
            const tagedUserDetails = taggedUsersData.map((user) => ({
              tagedUserId: user.id,
              tagedUserName: user.username,
            }));

            enrichedPosts.push({
              ...post,
              postedBy,
              tagedUsers: tagedUserDetails, // Add tagged users to post
            });
          }
          if (postData || userData) {
            return {
              user: userData,
              postData: enrichedPosts,
              isFollowedByLoggedUser: isFollowedByLoggedUser,
            };
          }
        } else {
          return { error };
        }
      } catch (err) {
        console.log("ERR", err);
      }
    },
    GetPost: async (_: any, { id, limit = 10, offset = 0 }: { id: string, limit: number, offset: number }, context: any) => {
      try {
        if (!context) return { Error: "Unauth user" };
        const { data: userData, error: userError } = await supabase
          .from("socialix")
          .select("following")
          .eq("id", context.id)
          .single();

        if (userError) {
          throw new Error(
            `Failed to fetch following list: ${userError.message}`
          );
        }
        console.log("USERDATA", userData);
        if (!userData.following) {
          // If following list is empty, return an empty postData array
          return {
            postData: [],
          };
        }

        // Convert following list into an array
        // Convert the comma-separated string into an array
        const followingIds: string[] = userData.following
          .split(",") // Split the string by commas
          .map((id: string) => id.trim()) // Explicitly define `id` as a string
          .filter((id: string) => id && id !== "null" && id !== "undefined") // Remove null, undefined, or empty strings
          .filter(
            (id: string, index: number, self: string[]) =>
              self.indexOf(id) === index
          ); // Remove duplicates
        console.log("Following", followingIds);
        const { data: postData, error: postError } = await supabase
          .from("post")
          .select(
            "id, postImage, caption, tagedUserId, createdBy, created_at, category, postTitle"
          )
          .in("createdBy", followingIds)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);
        console.log("POSTDATA", postData);
        if (postData) {
          const enrichedPosts = [];
          for (const post of postData) {
            // Fetch BasicUser details for the post's creator
            const { data: creatorData, error: creatorError } = await supabase
              .from("socialix")
              .select("id, username, profile")
              .eq("id", post.createdBy)
              .single();

            if (creatorError) {
              throw new Error(
                `Failed to get creator details: ${creatorError.message}`
              );
            }

            const postedBy = {
              id: creatorData.id,
              username: creatorData.username,
              profile: creatorData.profile,
            };

            // Check if tagedUserId exists and is not null
            if (!post.tagedUserId) {
              enrichedPosts.push({
                ...post,
                postedBy,
                tagedUsers: [], // Set an empty array if there are no tagged users
              });
              continue;
            }

            const tagedUserIds = post.tagedUserId.split(",");

            // Fetch tagged user details
            const { data: taggedUsersData, error: taggedUserError } =
              await supabase
                .from("socialix")
                .select("id, username, profile")
                .in("id", tagedUserIds);

            if (taggedUserError) {
              throw new Error(
                `Error fetching tagged user data: ${taggedUserError.message}`
              );
            }

            // Prepare tagged users details
            const tagedUserDetails = taggedUsersData.map((user) => ({
              tagedUserId: user.id,
              tagedUserName: user.username,
            }));

            enrichedPosts.push({
              ...post,
              postedBy,
              tagedUsers: tagedUserDetails, // Add tagged users to post
            });
          }
          return enrichedPosts;
        } 
      } catch (err) {
        console.log("ERR", err);
      }
    },
  },
  Mutation: {
    loginWithGoogle: async (_: any, { code }: { code: string }) => {
      try {
        const decoded = jwtDecode<JwtPayload>(code);
        const email_verified = (decoded as any).email_verified;
        const email = (decoded as any).email;
        if (email_verified) {
          const { data, error } = await supabase
            .from("socialix")
            .select("id, profile, username, email, followers, following")
            .eq("email", email)
            .single();
          if (data) {
            const userData = {
              id: data.id,
              profile: data.profile,
              username: data.username,
              email: data.email,
              followers: data.followers,
              following: data.following,
            };
            const token = jwt.sign(userData, process.env.JWT_SECRET!, {
              expiresIn: "12h",
            });
            return {
              ...userData,
              token,
            };
          }
        }
      } catch (error) {
        console.error("Error during Google login:", error);
        throw new Error("Failed to login with Google.");
      }
    },
    createUser: async (
      _: any,
      {
        username,
        email,
        password,
      }: { username: String; email: String; password: String }
    ) => {
      try {
        console.log("HEEEE");
        const { data, error } = await supabase
          .from("socialix")
          .insert([{ username, email, password }])
          .select();
        if (data) {
          return { message: "Created successfully", isCreated: true };
        } else {
          return { error };
        }
      } catch (err) {
        console.log("ERR", err);
      }
    },
    loginUser: async (
      _: any,
      { email, password }: { email: String; password: String }
    ) => {
      try {
        const { data, error } = await supabase
          .from("socialix")
          .select(
            "id, profile, username, password, email, followers, following"
          )
          .eq("email", email)
          .eq("password", password)
          .single();
        if (data) {
          const userData = {
            id: data.id,
            profile: data.profile,
            username: data.username,
            email: data.email,
            followers: data.followers,
            following: data.following,
          };
          const token = jwt.sign(userData, process.env.JWT_SECRET!, {
            expiresIn: "12h",
          });
          return {
            ...userData,
            token, // Include the token in the response
          };
        } else {
          return { error };
        }
      } catch (err) {
        console.log("ERR", err);
      }
    },
    uploadFile: async (
      _: any,
      {
        file,
        caption,
        postTitle,
        category,
        taggedUserIds,
      }: {
        file: any;
        caption: string;
        postTitle: string;
        category: string;
        taggedUserIds: [String];
      },
      context: any
    ) => {
      try {
        // Check if caption is provided
        if (!caption || caption.trim() === "") {
          throw new Error("Caption is required.");
        }
        console.log(taggedUserIds);
        // Convert taggedUserIds array to a comma-separated string
        const taggedUsers = taggedUserIds ? taggedUserIds.join(",") : null;

        const { data: postData, error: postError } = await supabase
          .from("post")
          .insert([
            {
              caption: caption,
              postTitle: postTitle,
              category: category,
              tagedUserId: taggedUsers, // Use consistent naming
              postImage: file, // This will be null if no file is uploaded
              createdBy: context.id, // Replace this with the logged-in user ID
            },
          ]);

        if (postError) {
          throw new Error(`Failed to add post: ${postError.message}`);
        }

        // Return a response with the post details
        return {
          isUploaded: true,
          message: "Post uploaded successfully",
        };
      } catch (error) {
        console.error("Error during file upload:", error);
        throw new Error("Failed to upload file.");
      }
    },
    FollowUser: async (
      _: any,
      { userId }: { userId: string },
      context: any
    ) => {
      try {
        // Check if the user is logged in
        if (!context.id) {
          throw new Error("User is not logged in.");
        }

        // Check if the user is trying to follow themselves
        if (context.id === userId) {
          throw new Error("You cannot follow yourself.");
        }

        // Query the database to check if the user exists
        const { data: userData, error: userError } = await supabase
          .from("socialix")
          .select("id, following")
          .eq("id", context.id)
          .single();

        if (userError) {
          throw new Error(`Failed to get user: ${userError.message}`);
        }

        // Check if the user exists
        if (!userData) {
          throw new Error("User does not exist.");
        }

        // Parse the followers string to an array
        const following = userData.following
          ? userData.following.split(",")
          : [];

        // Check if the user is already following the target user
        if (following.includes(userId)) {
          return {
            isFollowed: true,
            message: "Already Following",
          };
        }

        // Add the user ID to the followers array
        following.push(userId);

        // Update the followers field in the database
        const { error: updateError } = await supabase
          .from("socialix")
          .update({ following: `${following.join(",")},` })
          .eq("id", context.id);

        if (updateError) {
          throw new Error(`Failed to follow user: ${updateError.message}`);
        }
        const { data: follower, error: followerError } = await supabase
          .from("socialix")
          .select("id, followers")
          .eq("id", userId)
          .single();

        if (!follower)
          throw new Error(
            `Failed to retrieve user:FollowUser Mutation: ${followerError.message}`
          );
        const followers = follower.followers
          ? follower.followers.split(",")
          : [];
        if (followers.includes(String(context.id)) === false) {
          followers.push(context.id);
          const { error: updateFollowerError } = await supabase
            .from("socialix")
            .update({ followers: `${followers.join(",")},` })
            .eq("id", userId);
          if (updateFollowerError) {
            throw new Error(
              `Error occured while updating follower - FollowUser Mutation: ${updateFollowerError.message}`
            );
          }
        }
        return {
          isFollowed: true,
          message: "User followed successfully.",
        };
      } catch (error) {
        console.error("Error following user:", error);
        throw new Error("Failed to follow user.");
      }
    },
    UnFollowUser: async (
      _: any,
      { userId }: { userId: string },
      context: any
    ) => {
      try {
        // Check if the user is logged in
        if (!context.id) {
          throw new Error("User is not logged in.");
        }

        // Check if the user is trying to unfollow themselves
        if (context.id === userId) {
          throw new Error("You cannot unfollow yourself.");
        }

        const { data: userData, error: userError } = await supabase
          .from("socialix")
          .select("id, following")
          .eq("id", context.id)
          .single();
        if (userError) {
          throw new Error(`Failed to get user: ${userError.message}`);
        }

        // Check if the user exists
        if (!userData) {
          throw new Error("User does not exist.");
        }

        // Parse the following list and remove the userId
        const following = userData.following
          ? userData.following.split(",")
          : [];
        const updatedFollowing = following.filter(
          (followingId: string) => followingId !== userId
        );

        // Update the user's following list (make sure to remove trailing comma)
        const { error: updateError } = await supabase
          .from("socialix")
          .update({ following: updatedFollowing.join(",") }) // Removed the extra comma here
          .eq("id", context.id);
        if (updateError) {
          throw new Error(`Failed to unfollow user: ${updateError.message}`);
        }

        const { data: follower, error: followerError } = await supabase
          .from("socialix")
          .select("followers")
          .eq("id", userId)
          .single();
        if (followerError) {
          throw new Error(
            `Error while getting follower user data - UnFollowUser Mutation: ${followerError.message}`
          );
        }

        if (follower) {
          // Get the followers list and remove the context.id (current user)
          const followersList = follower.followers
            ? follower.followers.split(",")
            : [];

          // Remove any empty strings after splitting (e.g., trailing commas)
          const updatedFollowersList = followersList.filter(
            (id: string) => id !== String(context.id) && id !== ""
          );

          // Update the user's followers list (again, no trailing comma)
          const { error: updateFollowerError } = await supabase
            .from("socialix")
            .update({ followers: updatedFollowersList.join(",") }) // Removed the extra comma here as well
            .eq("id", userId);

          if (updateFollowerError) {
            throw new Error(
              `Error occurred while updating follower list of user - UnFollow Mutation: ${updateFollowerError.message}`
            );
          }

          return {
            isFollowed: false, // Updated to false because the user is unfollowed
            message: "User unfollowed successfully.",
          };
        }
      } catch (error) {
        console.log("ERROR Occurred while unfollowing user", error);
        throw new Error("Error occurred while unfollowing user");
      }
    },

    searchUsersByLetters: async (_: any, { letter }: { letter: String }) => {
      try {
        // Query Supabase for users whose username starts with the given letter
        const { data, error } = await supabase
          .from("socialix")
          .select("id, username, profile") // Only select id, username, and profile
          .ilike("username", `${letter}%`) // ILIKE for case-insensitive matching
          .limit(10);

        if (error) {
          console.error("Error searching users:", error);
        }

        return data; // Return the matching users
      } catch (err) {
        console.error("Error searching users:", err);
        return [];
      }
    },
  },
};
