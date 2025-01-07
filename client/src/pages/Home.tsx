import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import MainContent from "../components/MainContent";
import { gql, useLazyQuery } from "@apollo/client";
import SkeletonLoader from "../components/SkeletonLoader";
import { Link } from "react-router-dom";
const GET_POST_QUERY = gql`
  query GET_POST($limit: Int, $offset: Int) {
    GetPost(limit: $limit, offset: $offset) {
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
  GetPost: {
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
  }
}
const Home: React.FC = () => {
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [postLength, setPostLength] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [fetchPosts, { loading, data }] = useLazyQuery<PostData>(
    GET_POST_QUERY,
    {
      variables: { limit, offset },
    }
  );
  useEffect(() => {
    if (hasMore && postLength && offset < postLength) {
      fetchPosts({ variables: { limit, offset } });
    }
  }, [offset, fetchPosts]);
  useEffect(() => {
    if (data && data.GetPost.Post) {
      setHasMore(data.GetPost.postLength > offset ? true : false);
      setPostLength(data.GetPost.postLength);
      setPosts((prev) => [...prev, ...data.GetPost.Post]);
    }
  }, [data]);
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <div className="grid justify-center items-center">
        <SkeletonLoader />
      </div>
    );
  }

  if (posts && posts.length > 0) {
    return (
      <div className="grid w-full justify-center">
        <Container
          maxWidth="lg"
          component="main"
          sx={{ display: "flex", flexDirection: "column", my: 5, gap: 4 }}
        >
          {posts.length > 0 && (
            <MainContent
              posts={posts}
              loading={loading}
              setOffset={setOffset}
              hasMore={hasMore}
            />
          )}
        </Container>
      </div>
    );
  }

  // Fallback in case nothing is returned
  return (
    <p className="text-center">
      No Post by your following User <br />
      <Link className="text-blue-300" to={"/explore"}>
        Click Here!
      </Link>{" "}
      and explore all post by users
    </p>
  );
};

export default Home;
