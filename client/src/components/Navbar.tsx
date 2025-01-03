import React,{useEffect, useState} from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { gql, useMutation, useQuery} from "@apollo/client";
import { debounce } from "lodash";
import SearchIcon from '@mui/icons-material/Search';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import StringAvatar from "./StringAvatar";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { toast } from "react-toastify";
import { ExploreRounded } from "@mui/icons-material";
import SocialixLogo from '../assets/socialx-bg.jpeg'
const Navbar: React.FC = () => {
  const handleSearchedUser = (id: string) => {
    const searchInput = document.getElementById("search") as HTMLInputElement | null;
    if (searchInput) {
      searchInput.value = "";
    }
    setIsSearched(false);
    navigate(`/userProfile/${id}`);
  }
  const query = gql`
      mutation GetUsersByLetter($letter: String!) {
        searchUsersByLetters(letter: $letter) {
          id
          username
          profile
        }
      }
    `;
    const getUser = gql `
    query GetUserBasics {
      GetBasicUserDetails{
        profile  
        username
      }
    }
    `
    const [searchUsers, { loading, error, data }] = useMutation(query);
    const handleSearch = debounce((value: string) => {
       searchUsers({ variables: { letter: value } });
     }, 500);
     const [isSearched, setIsSearched] = useState<Boolean>(false);
     useEffect(() => {
       refetch()
     }, [])
     
    const navigate = useNavigate();
    const handleNaviagtion = (route : string):void =>{
        navigate(route)
    }
    const {data:UserData,refetch } = useQuery(getUser);
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
    <>
  {isMobile ? (
    <div className="shadow h-24 w-screen p-2 items-center flex  ">
        <SearchIcon sx={{fontSize:"32px"}}/>
      <div className="search-bar w-full flex justify-center ml-4 mr-4">
        <input
          className="w-full h-12 rounded bg-slate-300 border-none outline-none p-4"
          placeholder="Search users..."
          type="search"
          name="search"
          id="search"
          onChange={(e) => {
            setIsSearched(false);
            const value = e.target.value;
            if (value.trim() !== "") {
              handleSearch(value);
              setIsSearched(true);
            }
          }}
        />
        {isSearched && (
        <div className="cursor-pointer absolute bg-slate-300 w-11/12 rounded-md top-16">
        <List>
        {loading && (
          <Typography variant="body2" sx={{ padding: 2 }}>
            Loading users...
          </Typography>
        )}
        {error && (
          toast.error("Error fetching user details")
        )}
        {data?.searchUsersByLetters?.map((user: any) => (
          <ListItem onClick={()=>handleSearchedUser(user.id)} key={user.id}>
            <ListItemAvatar>
              {user.profile ? (
                <Avatar alt={user.username} src={user.profile} />
              ) : (
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <StringAvatar username={user.username} full_name=""/>
                </div>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary="User profile"
            />
          </ListItem>
        ))}
      </List>
        </div>
        )}
      </div>  
    </div>
  ): (
    <div className="shadow h-24 w-full p-2  justify-center items-center flex gap-24 ">
      <div onClick={()=>handleNaviagtion("/home")} className="branding hover:cursor-pointer flex items-center gap-2">
        <div className="rounded-box h-16 w-16 overflow-hidden">
         <div className="rounded-full object-cover"><Avatar sx={{height:"64px",width:"64px"}} src={SocialixLogo} /></div>
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
          onChange={(e) => {
            setIsSearched(false);
            const value = e.target.value;
            if (value.trim() !== "") {
              handleSearch(value);
              setIsSearched(true);
            }
          }}
        />
        {isSearched && (
        <div className="cursor-pointer absolute bg-slate-300 w-1/2 rounded-md top-16">
        <List>
        {loading && (
          <Typography variant="body2" sx={{ padding: 2 }}>
            Loading users...
          </Typography>
        )}
        {error && (
          toast.error("Error fetching user details")
        )}
        {data?.searchUsersByLetters?.map((user: any) => (
          <ListItem onClick={()=>handleSearchedUser(user.id)} key={user.id}>
            <ListItemAvatar>
              {user.profile ? (
                <Avatar alt={user.username} src={user.profile} />
              ) : (
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <StringAvatar username={user.username} full_name=""/>
                </div>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary="User profile"
            />
          </ListItem>
        ))}
      </List>
        </div>
        )}
      </div>
      <div className="flex justify-end items-center">
        <div className="navigationLinks">
          <ul className="flex justify-evenly gap-6 w-4/12">
            <li>
              <Link to={"/create"}>
              <Tooltip title="Create Post">
                  <IconButton>
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
              <li onClick={()=>handleNaviagtion("/explore")}>
            <Tooltip title="Explore">
                <IconButton>
                    <ExploreRounded/>
                </IconButton>
              </Tooltip>
              </li>
            <li onClick={()=>handleNaviagtion("/logout")}>
            <Tooltip title="Logout">
                <IconButton>
                    <LogoutIcon/>
                </IconButton>
              </Tooltip>
              </li>
          </ul>
        </div>
        <div  className="rounded-box w-40 flex justify-end ">
          <div className="rounded-full h-16 w-16 overflow-hidden" onClick={()=>handleNaviagtion("/profile")}>
          {UserData ? (
            <>
            {UserData.GetBasicUserDetails.profile ? (
              <img src={UserData.GetBasicUserDetails.profile} alt="profile" />
            ):(
              <StringAvatar username={UserData.GetBasicUserDetails.username} full_name="" />
            )}
            </>
          ) : (
            <img
            src="https://placehold.co/400"
            alt="brand logo"
          />
          )}
          </div>
        </div>
      </div>
    </div>
  )}
    </>
  );
};

export default Navbar;
