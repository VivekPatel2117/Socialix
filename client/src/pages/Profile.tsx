import React, { useEffect, useState } from "react";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { Skeleton, Box, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import StringAvatar from "../components/StringAvatar";
import MainContent from "../components/MainContent";
import { toast } from "react-toastify";
import Error from "./Error";
import EditIcon from "@mui/icons-material/Edit";
// GraphQL Query
const GET_USER_PROFILE = gql`
  query GetUserProfile($limit: Int, $offset: Int) {
    GetUserProfile(limit: $limit, offset: $offset) {
      user {
        id
        username
        profile
        followers
        following
      }
      postLength
      postData {
        id
        postImage
        caption
        createdBy
        created_at
        category
        postedBy {
          id
          username
          profile
        }
        tagedUsers {
          tagedUserId
          tagedUserName
        }
        postTitle
      }
    }
  }
`;
const USER_PROFILE_BY_ID = gql`
  query GetUserProfileById($id: ID!, $limit: Int, $offset: Int) {
    GetUserProfileById(id: $id, limit: $limit, offset: $offset) {
      user {
        id
        username
        profile
        followers
        following
      }
      postLength
      isFollowedByLoggedUser
      postData {
        id
        postImage
        caption
        createdBy
        created_at
        category
        postedBy {
          id
          username
          profile
        }
        tagedUsers {
          tagedUserId
          tagedUserName
        }
        postTitle
      }
    }
  }
`;
const FOLLOW_USER = gql`
  mutation FollowUserById($userId: ID!) {
    FollowUser(userId: $userId) {
      message
      isFollowed
    }
  }
`;
const UNFOLLOW_USER_MUTATION = gql`
  mutation UnFollowUserById($userId: ID!) {
    UnFollowUser(userId: $userId) {
      message
      isFollowed
    }
  }
`;
interface tagedUsers {
  tagedUserId: Number;
  tagedUserName: string;
}
interface BasicUser {
  id: Number;
  username: string;
  profile: string | null;
}
interface ProfileData {
  GetUserProfile?: {
    user: {
      id: Number;
      username: string;
      followers: string;
      following: string;
      profile: string;
    };
    postLength: number;
    postData: Array<{
      id: number;
      postImage: string;
      caption: string;
      createdBy: number;
      created_at: string;
      postedBy: BasicUser;
      tagedUsers: tagedUsers;
    }> | null;
  };
  GetUserProfileById?: {
    user: {
      id: Number;
      username: string;
      followers: string;
      following: string;
      profile: string;
    };
    postLength: number;
    isFollowedByLoggedUser: boolean;
    postData: Array<{
      id: number;
      postImage: string;
      caption: string;
      createdBy: number;
      created_at: string;
      postedBy: BasicUser;
      tagedUsers: tagedUsers;
    }> | null;
  };
}
const Profile: React.FC = () => {
  const { id } = useParams();
  const limit = 10;
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [isDyanmicProfile, setIsDyanmicProfile] = useState<Boolean>();
  const [hasMore, setHasMore] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [profileData, setProfileData] = useState<
    ProfileData["GetUserProfile"] | ProfileData["GetUserProfileById"] | null
  >(null);

  const [fetchPosts, { loading, error, data }] = useLazyQuery<ProfileData>(
    id ? USER_PROFILE_BY_ID : GET_USER_PROFILE,
    { ...(id && { variables: { id, limit, offset } }) }
  );
  const [followUser, { data: FollowData }] = useMutation(FOLLOW_USER, {
    onCompleted: () => fetchPosts(),
  });
  const [UnfollowUser, { data: UnFollowData }] = useMutation(
    UNFOLLOW_USER_MUTATION,
    {
      onCompleted: () => fetchPosts(),
    }
  );
  const handleFollow = () => {
    followUser({ variables: { userId: id } });
  };
  const handleUnfollow = () => {
    UnfollowUser({ variables: { userId: id } });
  };
  const displayFollowers = (followers: string) => {
    const num = followers
      .split(",")
      .filter((id: string) => id.trim() !== "").length;
    return num;
  };
  useEffect(() => {
    if (id && id !== localStorage.getItem("userId")) {
      setIsDyanmicProfile(true);
      fetchPosts();
    } else {
      setIsDyanmicProfile(false);
    }
  }, [id]);
  useEffect(() => {
    if (FollowData) {
      setIsFollowed(FollowData.FollowUser.isFollowed);
    }
  }, [FollowData]);
  useEffect(() => {
    if (UnFollowData) {
      setIsFollowed(UnFollowData.UnFollowUser.isFollowed);
    }
  }, [UnFollowData]);
  //Pagination logic
  useEffect(() => {
    if (hasMore && profileData?.postLength && offset < profileData.postLength) {
      fetchPosts({ variables: { id, limit, offset } });
    }
  }, [offset, fetchPosts]);
  useEffect(() => {
    if (data) {
      if (data.GetUserProfileById) {
        setIsFollowed(data.GetUserProfileById?.isFollowedByLoggedUser);
      }
      setProfileData((prev) => {
        if (data.GetUserProfile) {
          setHasMore(data.GetUserProfile.postLength > offset ? true : false);
          return {
            ...prev,
            ...data.GetUserProfile, // Merge the user profile details
            postData: [
              ...((prev && prev.postData) || []),
              ...(data.GetUserProfile.postData || []),
            ], // Append posts
          };
        }
        if (data.GetUserProfileById) {
          setHasMore(
            data?.GetUserProfileById.postLength > offset ? true : false
          );
          return {
            ...prev,
            ...data.GetUserProfileById, // Merge the user profile details
            postData: [
              ...(prev?.postData ?? []),
              ...(data.GetUserProfileById.postData || []),
            ], // Append posts
          };
        }
        return prev;
      });
    }
  }, [data]);
  useEffect(() => {
    fetchPosts();
  }, []);
  if (loading && offset < 10)
    return (
      <Box sx={{ backgroundColor: "gray.100", minHeight: "100vh", p: 4 }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
            p: 6,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Skeleton variant="circular" width={96} height={96} />
            </Grid>

            <Grid item xs>
              <Skeleton variant="text" width={200} height={30} />

              <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                <Skeleton variant="text" width={80} height={25} />
                <Skeleton variant="text" width={80} height={25} />
                <Skeleton variant="text" width={80} height={25} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            <Skeleton variant="text" width={150} height={30} />
          </Typography>

          <Grid container spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 2,
                    boxShadow: 1,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: 64,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                    }}
                  >
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="text" width={120} height={20} />
                  </Box>

                  <Skeleton variant="rectangular" width="100%" height={200} />

                  <Box sx={{ p: 2 }}>
                    <Skeleton variant="text" width="100%" height={30} />
                    <Skeleton variant="text" width={120} height={20} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );

  if (error) {
    toast.error("Error fetching user details");
    return <Error />;
  }

  if (profileData) {
    return (
      <div className="p-4">
        {/* Profile Header */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
              {profileData.user.profile ? (
                <img src={profileData.user.profile} alt="profile" />
              ) : (
                <StringAvatar
                  full_name=""
                  username={profileData.user.username}
                />
              )}
            </div>
            <div>
              {isDyanmicProfile ? (
                <div className="flex gap-8">
                  <h2 className="text-2xl font-semibold">
                    {profileData.user.username}
                  </h2>
                  {isFollowed ? (
                    <button
                      onClick={handleUnfollow}
                      className="px-2 py-1 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    >
                      Follow
                    </button>
                  )}
                </div>
              ) : (
                <h2 className="text-2xl font-semibold flex items-center gap-4 cursor-pointer">
                  {profileData.user.username}{" "}
                  <EditIcon onClick={() => navigate("/profileSettings")} />
                </h2>
              )}
              <div className="flex gap-6 mt-2">
                <div>
                  <span className="text-lg font-semibold">
                    {profileData.postData ? profileData.postLength : 0}
                  </span>{" "}
                  Posts
                </div>
                <div>
                  <span className="text-lg font-semibold">
                    {profileData.user.followers
                      ? displayFollowers(profileData.user.followers as string)
                      : 0}
                  </span>{" "}
                  Followers
                </div>
                <div>
                  <span className="text-lg font-semibold">
                    {profileData.user.following
                      ? displayFollowers(profileData.user.following as string)
                      : 0}
                  </span>{" "}
                  Following
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts Section */}
        <div className="max-w-4xl mx-auto mt-6">
          <h3 className="text-xl font-semibold mb-4">Posts</h3>
          <div className="grid justify-center">
            {profileData.postData && (
              <>
                <MainContent
                  loading={loading}
                  setOffset={setOffset}
                  hasMore={hasMore}
                  posts={profileData.postData}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Profile;
