import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const handleNaviagtion = (route : string):void =>{
        navigate(route)
    }
  return (
    <div className="shadow h-24 w-full p-2 items-center flex gap-24 ">
      <div onClick={()=>handleNaviagtion("/")} className="branding hover:cursor-pointer flex items-center gap-2">
        <div className="rounded-box h-16 w-16 ">
          <img
            className="rounded-full"
            src="https://placehold.co/400"
            alt="brand logo"
          />
        </div>
        <h1 className="text-2xl">Socialix</h1>
      </div>
      <div className="search-bar w-1/2 flex justify-center ml-4 mr-4">
        <input
          className="w-full h-12 rounded bg-slate-300 border-none outline-none p-4"
          placeholder="Search..."
          type="search"
          name="search"
          id="search"
        />
      </div>
      <div className="flex justify-end items-center">
        <div className="navigationLinks">
          <ul className="flex justify-evenly gap-6 w-4/12">
            <li>
              <FavoriteBorderIcon />
            </li>
            <li>
              <Link to={"/create"}>
                <AddCircleOutlineIcon />
              </Link>
            </li>
            <li><LogoutIcon/></li>
          </ul>
        </div>
        <div  className="rounded-box w-40 flex justify-end ">
          <img
            onClick={()=>handleNaviagtion("/profile")}
            className="rounded-full h-16 w-16"
            src="https://placehold.co/400"
            alt="brand logo"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
