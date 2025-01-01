import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from '@react-oauth/google';

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("token");
    googleLogout();
    navigate("/");
  }, []);

  return <div></div>;
}
