import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation hook
import HomeIcon from '@mui/icons-material/Home';
import { ExploreRounded } from "@mui/icons-material";
export default function MoblieNav() {
  const [value, setValue] = React.useState<number | null>();
  const location = useLocation(); // Get current location
  const navigate = useNavigate();
  const handleNavigation = (route: string): void => {
    navigate(route);
  };
  React.useEffect(() => {
    // Match the userProfile path with any user ID
    if (location.pathname.startsWith('/userProfile/')) {
      setValue(1); // Set to Profile tab for any userProfile path
    } else {
        switch (location.pathname) {
            case "/home":
            setValue(0);
            break;
          case "/profile":
            setValue(1);
            break;
          case "/create":
            setValue(2);
            break;
          case "/logout":
            setValue(4);
            break;
            case "/explore":
              setValue(3);
              break;
          default:
            setValue(null);
        }
    }
  }, [location.pathname]);

  return (
    <div className="w-screen">
      <Box>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
             <BottomNavigationAction
            onClick={() => handleNavigation("/home")}
            label="Home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            onClick={() => handleNavigation("/profile")}
            label="Profile"
            icon={<PersonOutlineIcon />}
          />
          <BottomNavigationAction
            onClick={() => handleNavigation("/create")}
            label="Create"
            icon={<AddCircleOutlineIcon />}
          />
           <BottomNavigationAction
            onClick={() => handleNavigation("/explore")}
            label="Explore"
            icon={<ExploreRounded />}
          />
          <BottomNavigationAction
            onClick={() => handleNavigation("/logout")}
            label="Logout"
            icon={<LogoutIcon />}
          />
        </BottomNavigation>
      </Box>
    </div>
  );
}
