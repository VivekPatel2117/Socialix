import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import CreatePost from './pages/CreatePost';
import SignIn from './components/sign-in/SignIn';
import Profile from './pages/Profile';

const AppContent: React.FC = () => {
  const location = useLocation(); // Access the current route

  // Define routes where the Navbar should not appear
  const hideNavbarRoutes = ['/signin'];

  return (
    <div>
      {/* Conditionally render Navbar */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path='/profile' element={(<Profile/>)} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
