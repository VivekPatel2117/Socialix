export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Query: {
        GetBasicUserDetails: (_: any, { id }: {
            id: String;
        }, context: any) => Promise<never[] | {
            id: any;
            username: any;
            profile: any;
        }>;
        GetUserProfile: (_: any, { id, limit, offset, }: {
            id: String;
            limit: number;
            offset: number;
        }, context: any) => Promise<never[] | {
            user: {
                id: any;
                profile: any;
                username: any;
                followers: any;
                following: any;
            };
            postData: {
                postedBy: {
                    id: any;
                    username: any;
                    profile: any;
                };
                tagedUsers: {
                    tagedUserId: any;
                    tagedUserName: any;
                }[];
                id: any;
                postImage: any;
                caption: any;
                tagedUserId: any;
                createdBy: any;
                created_at: any;
                category: any;
                postTitle: any;
            }[];
            err?: undefined;
        } | {
            err: unknown;
            user?: undefined;
            postData?: undefined;
        }>;
        GetUserProfileById: (_: any, { id, limit, offset, }: {
            id: String;
            limit: number;
            offset: number;
        }, context: any) => Promise<{
            error: string;
            user?: undefined;
            postData?: undefined;
            isFollowedByLoggedUser?: undefined;
        } | {
            user: {
                id: any;
                profile: any;
                username: any;
                followers: any;
                following: any;
            };
            postData: {
                postedBy: {
                    id: any;
                    username: any;
                    profile: any;
                };
                tagedUsers: {
                    tagedUserId: any;
                    tagedUserName: any;
                }[];
                id: any;
                postImage: any;
                caption: any;
                tagedUserId: any;
                createdBy: any;
                created_at: any;
                category: any;
                postTitle: any;
            }[];
            isFollowedByLoggedUser: boolean;
            error?: undefined;
        } | {
            error: import("@supabase/postgrest-js").PostgrestError;
            user?: undefined;
            postData?: undefined;
            isFollowedByLoggedUser?: undefined;
        } | undefined>;
        GetPost: (_: any, { id, limit, offset, }: {
            id: string;
            limit: number;
            offset: number;
        }, context: any) => Promise<{
            Error: string;
            postData?: undefined;
        } | {
            postData: never[];
            Error?: undefined;
        } | {
            postedBy: {
                id: any;
                username: any;
                profile: any;
            };
            tagedUsers: {
                tagedUserId: any;
                tagedUserName: any;
            }[];
            id: any;
            postImage: any;
            caption: any;
            tagedUserId: any;
            createdBy: any;
            created_at: any;
            category: any;
            postTitle: any;
        }[] | undefined>;
        GetAllPost: (_: any, { id, limit, offset, }: {
            id: string;
            limit: number;
            offset: number;
        }, context: any) => Promise<{
            Error: string;
        } | {
            postedBy: {
                id: any;
                username: any;
                profile: any;
            };
            tagedUsers: {
                tagedUserId: any;
                tagedUserName: any;
            }[];
            id: any;
            postImage: any;
            caption: any;
            tagedUserId: any;
            createdBy: any;
            created_at: any;
            category: any;
            postTitle: any;
        }[] | undefined>;
    };
    Mutation: {
        getProfileUpdateData: (_: any, __: any, context: any) => Promise<{
            success: boolean;
            message: string;
            username?: undefined;
            profile?: undefined;
            email?: undefined;
        } | {
            success: boolean;
            message: string;
            username: any;
            profile: any;
            email: any;
        } | undefined>;
        profileUpdate: (_: any, { profile, username, email, }: {
            profile: string;
            username: string;
            email: string;
        }, context: any) => Promise<{
            success: boolean;
            message: string;
            username?: undefined;
            profile?: undefined;
            email?: undefined;
        } | {
            success: boolean;
            message: string;
            username: any;
            profile: any;
            email: any;
        } | undefined>;
        verifyOtp: (_: any, { otp }: {
            otp: string;
        }) => Promise<{
            message: string;
            isCreated: boolean;
        } | undefined>;
        resetPassword: (_: any, { newPassword }: {
            newPassword: string;
        }) => Promise<{
            message: string;
            isCreated: boolean;
        } | undefined>;
        SendOtp: (_: any, { email }: {
            email: string;
        }) => Promise<{
            message: string;
            isSent: boolean;
        } | undefined>;
        loginWithGoogle: (_: any, { code }: {
            code: string;
        }) => Promise<{
            Error: string;
        } | {
            token: string;
            id: any;
            profile: any;
            username: any;
            email: any;
            followers: any;
            following: any;
            Error?: undefined;
        } | undefined>;
        createUser: (_: any, { username, email, password, }: {
            username: String;
            email: string;
            password: string;
        }) => Promise<{
            message: string;
            isCreated: boolean;
            error?: undefined;
        } | {
            error: string;
            message?: undefined;
            isCreated?: undefined;
        } | undefined>;
        loginUser: (_: any, { email, password }: {
            email: string;
            password: string;
        }) => Promise<{
            error: string;
        } | {
            token: string;
            id: any;
            profile: any;
            username: any;
            email: any;
            followers: any;
            following: any;
            error?: undefined;
        } | undefined>;
        uploadFile: (_: any, { file, caption, postTitle, category, taggedUserIds, }: {
            file: any;
            caption: string;
            postTitle: string;
            category: string;
            taggedUserIds: [String];
        }, context: any) => Promise<{
            error: string;
            isUploaded?: undefined;
            message?: undefined;
        } | {
            isUploaded: boolean;
            message: string;
            error?: undefined;
        }>;
        FollowUser: (_: any, { userId }: {
            userId: string;
        }, context: any) => Promise<{
            error: string;
            isFollowed?: undefined;
            message?: undefined;
        } | {
            isFollowed: boolean;
            message: string;
            error?: undefined;
        }>;
        UnFollowUser: (_: any, { userId }: {
            userId: string;
        }, context: any) => Promise<{
            error: string;
            isFollowed?: undefined;
            message?: undefined;
        } | {
            isFollowed: boolean;
            message: string;
            error?: undefined;
        } | undefined>;
        searchUsersByLetters: (_: any, { letter }: {
            letter: String;
        }) => Promise<{
            id: any;
            username: any;
            profile: any;
        }[] | null>;
    };
};
