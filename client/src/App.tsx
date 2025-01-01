import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar';
import Signin from './components/sign-in/SignIn';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import SignUp from './components/sign-in/SignUp';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import MoblieNav from './components/MoblieNav';
import './App.css';
const AppContent: React.FC = () => {
  const location = useLocation(); // Access the current route

  // Define routes where the Navbar should not appear
  const hideNavbarRoutes = ["/signup","/"];
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
  return (
    <div className='grid h-screen w-screen overflow-hidden'>
      {/* Conditionally render Navbar */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className='app-scroll-div grid h-full w-screen overflow-y-scroll'>
      <Routes>
        <Route path='/home' element={(<Home />)} />
        <Route path="/create" element={(<CreatePost />)} />
        <Route path='*' element={(<NotFound />)} />
        <Route index path='/' element={(<Signin />)} />
        <Route path='/signup' element={(<SignUp />)} />
        <Route path='/profile' element={(<Profile/>)} />
        <Route path='/userProfile/:id' element={(<Profile/>)} />
        <Route path='/logout' element={(<Logout/>)} />
      </Routes>
      <ToastContainer />
      </div>
      {isMobile && !hideNavbarRoutes.includes(location.pathname)  && <MoblieNav />}
    </div>
  );
};

const App: React.FC = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
  return (
    <GoogleOAuthProvider clientId={clientId}>
    <Router>
      <AppContent />
    </Router>
    </GoogleOAuthProvider>
  );
};

export default App;

