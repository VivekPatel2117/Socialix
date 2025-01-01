import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

const SkeletonLoader = ({ count = 5 }) => {
  const skeletons = Array.from({ length: count });

  return (
    <Box sx={{ display: 'grid', width: '60vw', gap: 3 }}>
      {skeletons.map((_, index) => (
        <Card
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            height: 'fit-content',
            marginBottom: 2,
            backgroundColor: 'background.paper',
          }}
        >
          {/* Image Skeleton */}
          <Skeleton variant="rectangular" height={200} width="100%" />

          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              padding: 2,
              flexGrow: 1,
            }}
          >
            {/* Category Skeleton */}
            <Skeleton variant="text" width="30%" height={20} />

            {/* Title Skeleton */}
            <Skeleton variant="text" width="70%" height={28} />

            {/* Caption Skeleton */}
            <Skeleton variant="text" width="100%" height={18} />
            <Skeleton variant="text" width="95%" height={18} />
          </CardContent>

          {/* Author Section Skeleton */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 2,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <AvatarGroup max={3}>
                {[...Array(3)].map((_, i) => (
                  <Avatar key={i}>
                    <Skeleton variant="circular" width={24} height={24} />
                  </Avatar>
                ))}
              </AvatarGroup>
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
            <Skeleton variant="text" width="20%" height={20} />
          </Box>

          {/* Posted By Skeleton */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: '1vh', padding: '1vw' }}
          >
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width="30%" height={20} />
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default SkeletonLoader;
