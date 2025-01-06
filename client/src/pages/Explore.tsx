import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import MainContent from "../components/MainContent";
import { gql, useLazyQuery } from "@apollo/client";
import SkeletonLoader from "../components/SkeletonLoader";
import Error from "./Error";

const GET_POST_QUERY = gql`
  query GET_POST($limit: Int, $offset: Int) {
    GetAllPost(limit: $limit, offset: $offset) {
      postLength
      Post {
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

interface TagedUsers {
  tagedUserId: number;
  tagedUserName: string;
}

interface BasicUser {
  id: number;
  username: string;
  profile: string | null;
}

interface PostData {
  GetAllPost: {
    postLength: number;
    Post: Array<{
      id: number;
      postImage: string;
      caption: string;
      createdBy: number;
      created_at: string;
      category: string;
      postedBy: BasicUser;
      tagedUsers: TagedUsers[];
    }>;
  };
}

const Explore: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [posts, setPosts] = useState<PostData | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [fetchPosts, { loading, error, data }] = useLazyQuery<PostData>(
    GET_POST_QUERY,
    {
      variables: { limit, offset },
    }
  );

  useEffect(() => {
    if (data && data.GetAllPost) {
      setPosts((prev) => {
        const postLength = data.GetAllPost.postLength;
        setHasMore(postLength > offset + limit); // Update hasMore based on the postLength and offset
        return {
          GetAllPost: {
            postLength,
            Post: [
              ...(prev?.GetAllPost.Post || []),
              ...data.GetAllPost.Post,
            ],
          },
        };
      });
    }
  }, [data, offset]);

  useEffect(() => {
    // Only fetch if there are more posts to load and we're not currently loading
    if (hasMore && !loading && offset < (posts?.GetAllPost?.postLength || 0)) {
      fetchPosts();
    }
  }, [offset, hasMore, fetchPosts, posts?.GetAllPost?.postLength]);

  useEffect(() => {
    fetchPosts(); // Fetch posts initially
  }, [fetchPosts]);

  if (error) {
    return <Error />;
  }

  if (loading) {
    return (
      <div className="grid justify-center items-center">
        <SkeletonLoader />
      </div>
    );
  }

  if (posts) {
    return (
      <div className="grid w-full justify-center">
        <Container
          maxWidth="lg"
          component="main"
          sx={{ display: "flex", flexDirection: "column", my: 5, gap: 4 }}
        >
          {posts.GetAllPost && (
            <MainContent
              posts={posts.GetAllPost.Post}
              loading={loading}
              setOffset={setOffset}
              hasMore={hasMore}
            />
          )}
        </Container>
      </div>
    );
  }

  return <p className="text-center">No Post Available</p>;
};

export default Explore;
