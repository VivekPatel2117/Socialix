import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
  const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height:'fit-content',
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  }));

  const StyledCardContent = styled(CardContent)(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
  }));

  const StyledTypography = styled(Typography)(() => ({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }));
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);

    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long", // Full month name (e.g., "December")
      day: "numeric", // Day of the month (e.g., "29")
      year: "numeric", // Full year (e.g., "2024")
    });
    return formattedDate;
  };
  function Author({ tagedUsers,postDate }: { tagedUsers: { tagedUserName: string }[], postDate:string}) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
          <AvatarGroup max={3}>
            {tagedUsers?.map((user, index) => (
              <Avatar key={index} alt={user.tagedUserName} sx={{ width: 24, height: 24 }}>
                {user.tagedUserName.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
          <Typography variant="caption">
            {tagedUsers?.map((user) => user.tagedUserName).join(', ') || 'No tags'}
          </Typography>
        </Box>
        <Typography variant="caption">{formatDate(postDate)}</Typography>
      </Box>
    );
  }

const fallbackImage = 'https://via.placeholder.com/800x450?text=No+Image+Available';
interface PostListProps {
  posts: any[];
  loading: boolean;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
}
const MainContent: React.FC<PostListProps> = ({ posts, loading, setOffset, hasMore }) => {
  const [isMobile, setMobile] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleScroll = () => {
    const div = document.getElementById("scroll");
    if (!div || hasMore == false) return;
    if (div.scrollTop + div.clientHeight >= div.scrollHeight - 300) {
      setOffset((prevOffset) => prevOffset + 10);
    }
  };
  useEffect(() => {
    const div = document.getElementById("scroll");
      if (div) {
        div.addEventListener("scroll", handleScroll);
      }
    return () => {
      if (div) {
        console.log("removing")
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, loading, setOffset]);

  return (
    <Box id="scroll" sx={{ display: 'grid',width:isMobile ? '90vw':'60vw', gap: 3, height:"70vh",overflowY:"scroll" }}>
      {posts.map((post, index) => {
      return (
        <div key={post.id || index}>
        <StyledCard key={post.id || index} variant="outlined">
          {post.postImage && (
          <CardMedia
            component="img"
            alt={post.postTitle || 'Untitled Post'}
            image={post.postImage || fallbackImage}
            sx={{
              height: 'auto',
              maxHeight: '50vh',
              objectFit: 'contain',
            }}
          />
          )}
          <StyledCardContent>
            <Typography gutterBottom variant="caption" component="div">
              {post.category || 'Uncategorized'}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              {post.postTitle || 'No Title'}
            </Typography>
            <StyledTypography variant="body2" color="text.secondary" gutterBottom>
              {post.caption || 'No description available.'}
            </StyledTypography>
          </StyledCardContent>
          <Author tagedUsers={post.tagedUsers || []} postDate={post.created_at} />
          {post.postedBy.username && (
          <Typography sx={{display:'flex', alignItems:"center", gap:"1vh",padding:"1vw"}} variant="caption">
            Posted By: <Link to={`/userProfile/${post.createdBy}`} > <Avatar sx={{height:isMobile ? '3vh':'4vh',width:isMobile ? '3vh':'4vh'}} alt={post.postedBy.username} src={post.postedBy.profile} /></Link> {post.postedBy.username}
          </Typography>
          )}
        </StyledCard>
        </div>
      )})}
    </Box>
  );
}

export default MainContent;
