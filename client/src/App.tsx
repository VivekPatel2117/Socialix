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
const AppContent: React.FC = () => {
  const location = useLocation(); // Access the current route

  // Define routes where the Navbar should not appear
  const hideNavbarRoutes = ['/signup', "/"];

  return (
    <div>
      {/* Conditionally render Navbar */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      <Routes>
        <Route path="/home" element={(<Home />)} />
        <Route path="/create" element={(<CreatePost />)} />
        <Route path="*" element={(<NotFound />)} />
        <Route index path="/" element={(<Signin />)} />
        <Route index path="/signup" element={(<SignUp />)} />
        <Route path='/profile' element={(<Profile/>)} />
        <Route path='/userProfile/:id' element={(<Profile/>)} />
        <Route path='/logout' element={(<Logout/>)} />
      </Routes>
      <ToastContainer />
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

