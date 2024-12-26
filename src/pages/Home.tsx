import React from 'react';
import Container from '@mui/material/Container';
import MainContent from '../components/MainContent';
const Home: React.FC = () => {
    return <div className='grid w-full justify-center'>
    <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <MainContent />
      </Container>
    </div>
}

export default Home