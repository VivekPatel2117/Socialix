import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Signin from "./components/sign-in/SignIn";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import SignUp from "./components/sign-in/SignUp";
import MoblieNav from "./components/MoblieNav";
import ResetPassword from "./components/ResetPassword";
import Landing from "./pages/Landing";
import Explore from "./pages/Explore";
import ProfileSettings from "./pages/ProfileSettings";

// Route constants for better maintainability
const ROUTES = {
  HOME: "/home",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  USER_PROFILE: "/userProfile/:id",
  CREATE: "/create",
  LOGOUT: "/logout",
  SIGNIN: "/signin",
  RESET: "/reset",
  NOT_FOUND: "*",
  LANDING: "/",
  EXPLORE: "/explore",
  SETTINGS: "/profileSettings",
};

const AppContent: React.FC = () => {
  const location = useLocation();

  // Define routes where the Navbar should not appear
  const hideNavbarRoutes = [
    ROUTES.SIGNUP,
    ROUTES.SIGNIN,
    ROUTES.RESET,
    ROUTES.LANDING,
  ];

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="grid h-dvh w-screen overflow-hidden">
      {/* Conditionally render Navbar */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className="app-scroll-div grid h-80dvh w-screen overflow-y-scroll">
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.CREATE} element={<CreatePost />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          <Route index path={ROUTES.LANDING} element={<Landing />} />
          <Route path={ROUTES.SIGNIN} element={<Signin />} />
          <Route path={ROUTES.SIGNUP} element={<SignUp />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.USER_PROFILE} element={<Profile />} />
          <Route path={ROUTES.LOGOUT} element={<Logout />} />
          <Route path={ROUTES.SETTINGS} element={<ProfileSettings />} />
          <Route path={ROUTES.RESET} element={<ResetPassword />} />
          <Route path={ROUTES.EXPLORE} element={<Explore />} />
        </Routes>
        <ToastContainer />
      </div>
      {isMobile && !hideNavbarRoutes.includes(location.pathname) && (
        <MoblieNav />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppContent />
    </GoogleOAuthProvider>
  );
};

export default App;
