import React,{ useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import MainContent from '../components/MainContent';
import { gql, useLazyQuery } from '@apollo/client';
import SkeletonLoader from '../components/SkeletonLoader';
import Error from './Error';
const Home: React.FC = () => {
   const [offset, setOffset] = useState(0);
    const limit = 10;
  const GET_POST_QUERY = gql`
    query GET_POST($limit: Int, $offset: Int) {
      GetPost(limit: $limit, offset: $offset) {
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
    GetPost: Array<{
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

  const [fetchPosts, { loading, error, data }] = useLazyQuery<PostData>(GET_POST_QUERY,{
    variables:{limit,offset}
  });
  const [posts, setPosts] = useState<any[]>([]); 
  useEffect(() => {
      fetchPosts();
    }, [offset, fetchPosts]);
    useEffect(() => {
      if (data && data.GetPost) {
        setPosts((prev) => [...prev, ...data.GetPost]);
      }
    }, [data]);
  if (loading) {
    return (
      <div className='grid justify-center items-center'>
        <SkeletonLoader/>
      </div>
    )
  }

  if (error) {
    return (
      <Error/>
    )
  }

  if (data) {
    console.log(data);
    return (
      <div className="grid w-full justify-center">
        <Container
          maxWidth="lg"
          component="main"
          sx={{ display: 'flex', flexDirection: 'column', my: 5, gap: 4 }}
        >
          <MainContent posts={posts} loading={loading}
                  setOffset={setOffset} hasMore={posts.length === limit} />
        </Container>
      </div>
    );
  }

  // Fallback in case nothing is returned
  return null;
};

export default Home;
