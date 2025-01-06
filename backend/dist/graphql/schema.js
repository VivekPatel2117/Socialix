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
exports.resolvers = exports.typeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
const supabaseClient_1 = require("../supabaseClient");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_decode_1 = require("jwt-decode");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendOtp_1 = __importDefault(require("../mailer/sendOtp"));
function hashPassword(plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const saltRounds = 10;
            const hashedPassword = yield bcryptjs_1.default.hash(plainPassword, saltRounds);
            return hashedPassword;
        }
        catch (error) {
            console.error("Error hashing password:", error);
        }
    });
}
// Define type definitions
exports.typeDefs = (0, graphql_tag_1.gql) `
  type User {
    id: ID
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
    postLength: Int
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
  type GetPostResponse {
    postLength: Int
    Post: [Post]
  }
  type OTP_Response {
    message: String
    isSent: Boolean
  }
  type ProfileUpdateResponse {
    success: Boolean
    message: String
    username: String
    profile: String
    email: String
  }
  type Query {
    GetAllPost(limit: Int, offset: Int): GetPostResponse
    GetBasicUserDetails: BasicUser
    GetUserProfile(limit: Int, offset: Int): UserProfile
    GetPost(limit: Int, offset: Int): GetPostResponse
    GetUserProfileById(id: ID!, limit: Int, offset: Int): UserProfile
  }

  type Mutation {
    profileUpdate(
      profile: String
      username: String
      email: String
    ): ProfileUpdateResponse
    getProfileUpdateData: ProfileUpdateResponse
    verifyOtp(otp: String!): CreateResponse
    resetPassword(newPassword: String!): CreateResponse
    SendOtp(email: String!): OTP_Response
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
      taggedUserIds: [String]
    ): UploadResponse
  }
`;
// Define resolvers
exports.resolvers = {
    Query: {
        GetBasicUserDetails: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (
        // This resolver is used to fetch the basic user details (id, username, profile)
        // for the logged-in user based on the context's user ID.
        _, { id }, context) {
            try {
                const { data, error } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("id, username, profile")
                    .eq("id", context.id)
                    .single();
                if (error) {
                    console.error(`Error occurred while getting basic user details: ${error}`);
                    return [];
                }
                return { id: data.id, username: data.username, profile: data.profile };
            }
            catch (err) {
                console.error("Error in GetBasicUserDetails query:", err);
                return [];
            }
        }),
        GetUserProfile: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, limit = 10, offset = 0, }, context) {
            try {
                const { data, error } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("id, profile, username, followers, following")
                    .eq("id", context.id)
                    .single();
                if (error) {
                    console.error(`GetUserProfile - Failed to get user data: ${error.message}`);
                    return [];
                }
                const { count } = yield supabaseClient_1.supabase
                    .from("post")
                    .select("id", { count: "exact" })
                    .eq("createdBy", context.id);
                const userData = {
                    id: data.id,
                    profile: data.profile,
                    username: data.username,
                    followers: data.followers,
                    following: data.following,
                };
                const { data: postData, error: postError } = yield supabaseClient_1.supabase
                    .from("post")
                    .select("id, postImage, caption, tagedUserId, createdBy, created_at, category, postTitle")
                    .eq("createdBy", context.id)
                    .order("created_at", { ascending: false })
                    .range(offset, offset + limit - 1);
                if (postError) {
                    console.error(`GetUserProfile - Failed to get posts: ${postError.message}`);
                    return [];
                }
                const enrichedPosts = [];
                for (const post of postData) {
                    const { data: creatorData, error: creatorError } = yield supabaseClient_1.supabase
                        .from("socialix")
                        .select("id, username, profile")
                        .eq("id", post.createdBy)
                        .single();
                    if (creatorError) {
                        console.error(`GetUserProfile - Failed to get creator details: ${creatorError.message}`);
                        continue;
                    }
                    const postedBy = {
                        id: creatorData.id,
                        username: creatorData.username,
                        profile: creatorData.profile,
                    };
                    if (!post.tagedUserId) {
                        enrichedPosts.push(Object.assign(Object.assign({}, post), { postedBy, tagedUsers: [] }));
                        continue;
                    }
                    const tagedUserIds = post.tagedUserId.split(",");
                    const { data: taggedUsersData, error: taggedUserError } = yield supabaseClient_1.supabase
                        .from("socialix")
                        .select("id, username, profile")
                        .in("id", tagedUserIds);
                    if (taggedUserError) {
                        console.error(`GetUserProfile - Error fetching tagged user data: ${taggedUserError.message}`);
                        continue;
                    }
                    const tagedUserDetails = taggedUsersData.map((user) => ({
                        tagedUserId: user.id,
                        tagedUserName: user.username,
                    }));
                    enrichedPosts.push(Object.assign(Object.assign({}, post), { postedBy, tagedUsers: tagedUserDetails }));
                }
                return {
                    user: userData,
                    postLength: count,
                    postData: enrichedPosts,
                };
            }
            catch (err) {
                console.error("GetUserProfile - Error occurred while fetching user profile:", err);
                return { err };
            }
        }),
        GetUserProfileById: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, limit = 10, offset = 0, }, context) {
            try {
                let isFollowedByLoggedUser = false;
                const { data, error } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("id, profile, username, followers, following")
                    .eq("id", id)
                    .single();
                if (data) {
                    const { data: contextUser } = yield supabaseClient_1.supabase
                        .from("socialix")
                        .select("following")
                        .eq("id", context.id)
                        .single();
                    const following = (contextUser === null || contextUser === void 0 ? void 0 : contextUser.following)
                        ? contextUser === null || contextUser === void 0 ? void 0 : contextUser.following.split(",")
                        : [];
                    isFollowedByLoggedUser = following.includes(String(id));
                    const userData = {
                        id: data.id,
                        profile: data.profile,
                        username: data.username,
                        followers: data.followers,
                        following: data.following,
                    };
                    const { count } = yield supabaseClient_1.supabase
                        .from("post")
                        .select("id", { count: "exact" })
                        .eq("createdBy", id);
                    const { data: postData, error: postError } = yield supabaseClient_1.supabase
                        .from("post")
                        .select("id, postImage, caption, tagedUserId, createdBy, created_at, category, postTitle")
                        .eq("createdBy", id)
                        .order("created_at", { ascending: false })
                        .range(offset, offset + limit - 1);
                    if (postError) {
                        console.error("GetUserProfileById - Failed to get posts:", postError.message);
                        return { error: postError.message };
                    }
                    const enrichedPosts = [];
                    for (const post of postData) {
                        const { data: creatorData, error: creatorError } = yield supabaseClient_1.supabase
                            .from("socialix")
                            .select("id, username, profile")
                            .eq("id", post.createdBy)
                            .single();
                        if (creatorError) {
                            console.error("GetUserProfileById - Failed to get creator details:", creatorError.message);
                            continue;
                        }
                        const postedBy = {
                            id: creatorData.id,
                            username: creatorData.username,
                            profile: creatorData.profile,
                        };
                        if (!post.tagedUserId) {
                            enrichedPosts.push(Object.assign(Object.assign({}, post), { postedBy, tagedUsers: [] }));
                            continue;
                        }
                        const tagedUserIds = post.tagedUserId.split(",");
                        const { data: taggedUsersData, error: taggedUserError } = yield supabaseClient_1.supabase
                            .from("socialix")
                            .select("id, username, profile")
                            .in("id", tagedUserIds);
                        if (taggedUserError) {
                            console.error("GetUserProfileById - Error fetching tagged user data:", taggedUserError.message);
                            continue;
                        }
                        const tagedUserDetails = taggedUsersData.map((user) => ({
                            tagedUserId: user.id,
                            tagedUserName: user.username,
                        }));
                        enrichedPosts.push(Object.assign(Object.assign({}, post), { postedBy, tagedUsers: tagedUserDetails }));
                    }
                    if (postData || userData) {
                        return {
                            user: userData,
                            postData: enrichedPosts,
                            postLength: count,
                            isFollowedByLoggedUser: isFollowedByLoggedUser,
                        };
                    }
                }
                else {
                    console.error("GetUserProfileById - No user data found:", error);
                    return { error };
                }
            }
            catch (err) {
                console.error("GetUserProfileById - Error occurred:", err);
            }
        }),
        GetPost: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, limit = 10, offset = 0, }, context) {
            try {
                if (!context) {
                    console.error("GetPost - Unauthenticated user");
                    return { Error: "Unauth user" };
                }
                const { data: userData, error: userError } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("following")
                    .eq("id", context.id)
                    .single();
                if (userError) {
                    console.error("GetPost - Failed to fetch following list:", userError.message);
                    return { Error: userError.message };
                }
                if (!userData.following) {
                    console.log("GetPost - No following list found");
                    return { postData: [] };
                }
                const followingIds = userData.following
                    .split(",")
                    .map((id) => id.trim())
                    .filter((id) => id && id !== "null" && id !== "undefined")
                    .filter((id, index, self) => self.indexOf(id) === index);
                const { data: postData, error: postError } = yield supabaseClient_1.supabase
                    .from("post")
                    .select("id, postImage, caption, tagedUserId, createdBy, created_at, category, postTitle")
                    .in("createdBy", followingIds)
                    .order("created_at", { ascending: false })
                    .range(offset, offset + limit - 1);
                const { count } = yield supabaseClient_1.supabase
                    .from("post")
                    .select("id", { count: "exact" })
                    .in("createdBy", followingIds);
                if (postError) {
                    console.error("GetPost - Failed to fetch posts:", postError.message);
                    return { Error: postError.message };
                }
                if (postData) {
                    const enrichedPosts = [];
                    for (const post of postData) {
                        const { data: creatorData, error: creatorError } = yield supabaseClient_1.supabase
                            .from("socialix")
                            .select("id, username, profile")
                            .eq("id", post.createdBy)
                            .single();
                        if (creatorError) {
                            console.error("GetPost - Failed to get creator details:", creatorError.message);
                            continue;
                        }
                        const postedBy = {
                            id: creatorData.id,
                            username: creatorData.username,
                            profile: creatorData.profile,
                        };
                        if (!post.tagedUserId) {
                            enrichedPosts.push(Object.assign(Object.assign({}, post), { postedBy, tagedUsers: [] }));
                            continue;
                        }
                        const tagedUserIds = post.tagedUserId.split(",");
                        const { data: taggedUsersData, error: taggedUserError } = yield supabaseClient_1.supabase
                            .from("socialix")
                            .select("id, username, profile")
                            .in("id", tagedUserIds);
                        if (taggedUserError) {
                            console.error("GetPost - Error fetching tagged user data:", taggedUserError.message);
                            continue;
                        }
                        const tagedUserDetails = taggedUsersData.map((user) => ({
                            tagedUserId: user.id,
                            tagedUserName: user.username,
                        }));
                        enrichedPosts.push(Object.assign(Object.assign({}, post), { postedBy, postLength: count, tagedUsers: tagedUserDetails }));
                    }
                    return { Post: enrichedPosts, postLength: count };
                }
            }
            catch (err) {
                console.error("GetPost - Error occurred:", err);
            }
        }),
        GetAllPost: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, limit = 10, offset = 0, }, context) {
            try {
                if (!context) {
                    console.error("GetAllPost - Unauthenticated user");
                    return { Error: "Unauth user" };
                }
                const { data: postData, error: postError } = yield supabaseClient_1.supabase
                    .from("post")
                    .select("id, postImage, caption, tagedUserId, createdBy, created_at, category, postTitle")
                    .order("created_at", { ascending: false })
                    .range(offset, offset + limit - 1);
                const { count } = yield supabaseClient_1.supabase
                    .from("post")
                    .select("id", { count: "exact" });
                if (postError) {
                    console.error("GetAllPost - Failed to fetch posts:", postError.message);
                    return { Error: postError.message };
                }
                if (postData) {
                    const enrichedPosts = [];
                    for (const post of postData) {
                        const { data: creatorData, error: creatorError } = yield supabaseClient_1.supabase
                            .from("socialix")
                            .select("id, username, profile")
                            .eq("id", post.createdBy)
                            .single();
                        if (creatorError) {
                            console.error("GetAllPost - Failed to get creator details:", creatorError.message);
                            continue;
                        }
                        const postedBy = {
                            id: creatorData.id,
                            username: creatorData.username,
                            profile: creatorData.profile,
                        };
                        if (!post.tagedUserId) {
                            enrichedPosts.push(Object.assign(Object.assign({}, post), { postedBy, tagedUsers: [] }));
                            continue;
                        }
                        const tagedUserIds = post.tagedUserId.split(",");
                        const { data: taggedUsersData, error: taggedUserError } = yield supabaseClient_1.supabase
                            .from("socialix")
                            .select("id, username, profile")
                            .in("id", tagedUserIds);
                        if (taggedUserError) {
                            console.error("GetAllPost - Error fetching tagged user data:", taggedUserError.message);
                            continue;
                        }
                        const tagedUserDetails = taggedUsersData.map((user) => ({
                            tagedUserId: user.id,
                            tagedUserName: user.username,
                        }));
                        enrichedPosts.push(Object.assign(Object.assign({}, post), { postedBy, tagedUsers: tagedUserDetails }));
                    }
                    return { Post: enrichedPosts, postLength: count };
                }
            }
            catch (error) {
                console.error("GetAllPost - Error occurred:", error);
            }
        }),
    },
    Mutation: {
        getProfileUpdateData: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { data, error } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("profile, email, username")
                    .eq("id", context.id)
                    .single();
                if (error) {
                    console.log(`Error occured while getting profile data - getProfileUpdateData: ${error}`);
                    return {
                        success: false,
                        message: "Error occured while getting profile data",
                    };
                }
                if (data) {
                    return {
                        success: true,
                        message: "Profile updated successfully.",
                        username: data.username,
                        profile: data.profile,
                        email: data.email,
                    };
                }
            }
            catch (error) {
                console.log(`Error occured while getting profile data - getProfileUpdateData: ${error}`);
                return {
                    success: false,
                    message: "Internal Error occured while getting profile data",
                };
            }
        }),
        profileUpdate: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { profile, username, email, }, context) {
            try {
                const { data, error } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .update({
                    profile,
                    username,
                    email,
                })
                    .eq("id", context.id)
                    .select("profile, username, email")
                    .single();
                // Handle response
                if (error) {
                    console.error(`Failed to update profile - profileUpdate: ${error.message}`);
                    return {
                        success: false,
                        message: "Failed to update profile",
                    };
                }
                if (data) {
                    return {
                        success: true,
                        message: "Profile updated successfully.",
                        username: data.username,
                        profile: data.profile,
                        email: data.email,
                    };
                }
            }
            catch (error) {
                console.error(`Error occured while updating profile - profileUpdate: ${error}`);
                return {
                    success: false,
                    message: "Error occured while updating profile",
                };
            }
        }),
        verifyOtp: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { otp }) {
            try {
                const isVlaid = sendOtp_1.default.validateOtp(otp);
                if (isVlaid) {
                    return { message: "OTP verified successfully", isCreated: true };
                }
                else {
                    return { message: "Invalid OTP", isCreated: false };
                }
            }
            catch (error) {
                console.error("Error while verifying OTP:", error);
            }
        }),
        resetPassword: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { newPassword }) {
            try {
                const hashedPassword = yield hashPassword(newPassword);
                const email = sendOtp_1.default.getEmail();
                const { data, error } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .update({ password: hashedPassword })
                    .eq("email", email)
                    .select("email")
                    .single();
                if (error) {
                    console.error("Error while resetting password:", error);
                    return { message: "Failed to reset password", isCreated: false };
                }
                if (data) {
                    return { message: "Password reset successfully", isCreated: true };
                }
            }
            catch (error) {
                console.error(error);
            }
        }),
        SendOtp: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email }) {
            try {
                const { data, error } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("email")
                    .eq("email", email)
                    .single();
                if (error) {
                    console.error("SendOtp - Error fetching user data:", error.message);
                    return { message: "Failed to send OTP", isSent: false };
                }
                if (data) {
                    yield sendOtp_1.default.sendOtpForAuthentication(email);
                    return { message: "Sent OTP Successfully", isSent: true };
                }
            }
            catch (error) {
                console.error("SendOtp - Error sending OTP:", error);
            }
        }),
        loginWithGoogle: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { code }) {
            try {
                const decoded = (0, jwt_decode_1.jwtDecode)(code);
                const email_verified = decoded.email_verified;
                const email = decoded.email;
                if (email_verified) {
                    const { data, error } = yield supabaseClient_1.supabase
                        .from("socialix")
                        .select("id, profile, username, email, followers, following")
                        .eq("email", email)
                        .single();
                    if (error) {
                        console.error("loginWithGoogle - Error fetching user data:", error.message);
                        return { Error: error.message };
                    }
                    if (data) {
                        const userData = {
                            id: data.id,
                            profile: data.profile,
                            username: data.username,
                            email: data.email,
                            followers: data.followers,
                            following: data.following,
                        };
                        const token = jsonwebtoken_1.default.sign(userData, process.env.JWT_SECRET, {
                            expiresIn: "12h",
                        });
                        return Object.assign(Object.assign({}, userData), { token });
                    }
                }
            }
            catch (error) {
                console.error("loginWithGoogle - Error during Google login:", error);
                return { Error: "Failed to login with Google." };
            }
        }),
        createUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { username, email, password, }) {
            try {
                const { data: UserExist } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("username, email")
                    .eq("username", username)
                    .eq("email", email)
                    .single();
                if (UserExist) {
                    return {
                        message: "username or email already in use",
                        isCreated: false,
                    };
                }
                const hashedPassword = yield hashPassword(password);
                const { data, error } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .insert([{ username, email, password: hashedPassword }])
                    .select();
                if (error) {
                    console.error("createUser - Error inserting user data:", error.message);
                    return { error: error.message };
                }
                if (data) {
                    return { message: "Created successfully", isCreated: true };
                }
            }
            catch (err) {
                console.error("createUser - Error during user creation:", err);
                return { error: "Failed to create user" };
            }
        }),
        loginUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email, password }) {
            try {
                const { data, error } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("id, profile, username, password, email, followers, following")
                    .eq("email", email)
                    .single();
                if (error) {
                    console.error("loginUser - Error fetching user data:", error.message);
                    return { error: "User not found" };
                }
                if (data) {
                    const isMatch = yield bcryptjs_1.default.compare(password, data.password);
                    if (!isMatch) {
                        console.error("loginUser - Invalid password");
                        return { error: "Invalid password" };
                    }
                    const userData = {
                        id: data.id,
                        profile: data.profile,
                        username: data.username,
                        email: data.email,
                        followers: data.followers,
                        following: data.following,
                    };
                    const token = jsonwebtoken_1.default.sign(userData, process.env.JWT_SECRET, {
                        expiresIn: "12h",
                    });
                    return Object.assign(Object.assign({}, userData), { token });
                }
            }
            catch (err) {
                console.error("loginUser - Error during user login:", err);
                return { error: "Failed to login" };
            }
        }),
        uploadFile: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { file, caption, postTitle, category, taggedUserIds, }, context) {
            try {
                // Check if caption is provided
                if (!caption || caption.trim() === "") {
                    console.error("uploadFile - Error: Caption is required.");
                    return { error: "Caption is required" };
                }
                // Convert taggedUserIds array to a comma-separated string
                const taggedUsers = taggedUserIds ? taggedUserIds.join(",") : null;
                const { data: postData, error: postError } = yield supabaseClient_1.supabase
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
                    console.error("uploadFile - Error during post insertion:", postError.message);
                    return { error: postError.message };
                }
                // Return a response with the post details
                return {
                    isUploaded: true,
                    message: "Post uploaded successfully",
                };
            }
            catch (error) {
                console.error("uploadFile - Error during file upload:", error);
                return { error: "Failed to upload file." };
            }
        }),
        FollowUser: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { userId }, context) {
            try {
                // Check if the user is logged in
                if (!context.id) {
                    console.error("FollowUser - Error: User is not logged in.");
                    return { error: "User is not logged in." };
                }
                // Check if the user is trying to follow themselves
                if (context.id === userId) {
                    console.error("FollowUser - Error: You cannot follow yourself.");
                    return { error: "You cannot follow yourself." };
                }
                // Query the database to check if the user exists
                const { data: userData, error: userError } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("id, following")
                    .eq("id", context.id)
                    .single();
                if (userError) {
                    console.error("FollowUser - Error during user fetch:", userError.message);
                    return { error: `Failed to get user: ${userError.message}` };
                }
                // Check if the user exists
                if (!userData) {
                    console.error("FollowUser - Error: User does not exist.");
                    return { error: "User does not exist." };
                }
                // Parse the following string to an array
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
                // Add the user ID to the following array
                following.push(userId);
                // Update the following field in the database
                const { error: updateError } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .update({ following: `${following.join(",")},` })
                    .eq("id", context.id);
                if (updateError) {
                    console.error("FollowUser - Error during user follow update:", updateError.message);
                    return { error: `Failed to follow user: ${updateError.message}` };
                }
                // Fetch the follower details of the target user
                const { data: follower, error: followerError } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("id, followers")
                    .eq("id", userId)
                    .single();
                if (!follower) {
                    console.error("FollowUser - Error: Follower data fetch failed:", followerError.message);
                    return { error: `Failed to retrieve user: ${followerError.message}` };
                }
                const followers = follower.followers
                    ? follower.followers.split(",")
                    : [];
                // Add the current user to the target user's followers list if not already a follower
                if (!followers.includes(String(context.id))) {
                    followers.push(context.id);
                    const { error: updateFollowerError } = yield supabaseClient_1.supabase
                        .from("socialix")
                        .update({ followers: `${followers.join(",")},` })
                        .eq("id", userId);
                    if (updateFollowerError) {
                        console.error("FollowUser - Error during follower update:", updateFollowerError.message);
                        return {
                            error: `Error occurred while updating follower - FollowUser Mutation: ${updateFollowerError.message}`,
                        };
                    }
                }
                // Successfully followed the user
                return {
                    isFollowed: true,
                    message: "User followed successfully.",
                };
            }
            catch (error) {
                console.error("FollowUser - Error following user:", error);
                return { error: "Failed to follow user." };
            }
        }),
        UnFollowUser: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { userId }, context) {
            try {
                // Check if the user is logged in
                if (!context.id) {
                    console.error("UnFollowUser - Error: User is not logged in.");
                    return { error: "User is not logged in." };
                }
                // Check if the user is trying to unfollow themselves
                if (context.id === userId) {
                    console.error("UnFollowUser - Error: You cannot unfollow yourself.");
                    return { error: "You cannot unfollow yourself." };
                }
                const { data: userData, error: userError } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("id, following")
                    .eq("id", context.id)
                    .single();
                if (userError) {
                    console.error("UnFollowUser - Error during user fetch:", userError.message);
                    return { error: `Failed to get user: ${userError.message}` };
                }
                // Check if the user exists
                if (!userData) {
                    console.error("UnFollowUser - Error: User does not exist.");
                    return { error: "User does not exist." };
                }
                // Parse the following list and remove the userId
                const following = userData.following
                    ? userData.following.split(",")
                    : [];
                const updatedFollowing = following.filter((followingId) => followingId !== userId);
                // Update the user's following list (make sure to remove trailing comma)
                const { error: updateError } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .update({ following: updatedFollowing.join(",") }) // Removed the extra comma here
                    .eq("id", context.id);
                if (updateError) {
                    console.error("UnFollowUser - Error during following update:", updateError.message);
                    return { error: `Failed to unfollow user: ${updateError.message}` };
                }
                const { data: follower, error: followerError } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("followers")
                    .eq("id", userId)
                    .single();
                if (followerError) {
                    console.error("UnFollowUser - Error while getting follower data:", followerError.message);
                    return {
                        error: `Error while getting follower user data - UnFollowUser Mutation: ${followerError.message}`,
                    };
                }
                if (follower) {
                    // Get the followers list and remove the context.id (current user)
                    const followersList = follower.followers
                        ? follower.followers.split(",")
                        : [];
                    // Remove any empty strings after splitting (e.g., trailing commas)
                    const updatedFollowersList = followersList.filter((id) => id !== String(context.id) && id !== "");
                    // Update the user's followers list (again, no trailing comma)
                    const { error: updateFollowerError } = yield supabaseClient_1.supabase
                        .from("socialix")
                        .update({ followers: updatedFollowersList.join(",") }) // Removed the extra comma here as well
                        .eq("id", userId);
                    if (updateFollowerError) {
                        console.error("UnFollowUser - Error during follower list update:", updateFollowerError.message);
                        return {
                            error: `Error occurred while updating follower list of user - UnFollowUser Mutation: ${updateFollowerError.message}`,
                        };
                    }
                    return {
                        isFollowed: false, // Updated to false because the user is unfollowed
                        message: "User unfollowed successfully.",
                    };
                }
            }
            catch (error) {
                console.error("UnFollowUser - Error while unfollowing user:", error);
                return { error: "Error occurred while unfollowing user" };
            }
        }),
        searchUsersByLetters: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { letter }) {
            try {
                // Query Supabase for users whose username starts with the given letter
                const { data, error } = yield supabaseClient_1.supabase
                    .from("socialix")
                    .select("id, username, profile") // Only select id, username, and profile
                    .ilike("username", `${letter}%`) // ILIKE for case-insensitive matching
                    .limit(10);
                if (error) {
                    console.error("Error searching users:", error);
                }
                return data; // Return the matching users
            }
            catch (err) {
                console.error("Error searching users:", err);
                return [];
            }
        }),
    },
};
