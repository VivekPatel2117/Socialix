import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { gql, useMutation } from "@apollo/client";
import { debounce } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StringAvatar from "./StringAvatar";

type User = {
  id: string;
  username: string;
  profile: string;
  __typename: string;
};
interface DrawerProps {
  open: boolean;
  toggleDrawer: (newOpen: boolean) => void;
  addUser: (user: User) => void;
  userIds:User[];
  removeUser: (userId: string) => void;
}

const DrawerComponent: React.FC<DrawerProps> = ({ open, toggleDrawer, addUser, userIds, removeUser }) => {
  const query = gql`
    mutation GetUsersByLetter($letter: String!) {
      searchUsersByLetters(letter: $letter) {
        id
        username
        profile
      }
    }
  `;
  const [searchUsers, { loading, error, data }] = useMutation(query);
  const [letters, setLetters] = useState<string>("");

  const handleSearch = debounce((value: string) => {
    searchUsers({ variables: { letter: value } });
  }, 500);
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <input
          onChange={(e) => {
            const value = e.target.value;
            setLetters(value);
            handleSearch(value);
          }}
          className="outline-none p-4"
          placeholder="Enter username"
          type="search"
          name="search-user"
          id="search-user"
        />
      </List>
      <Divider />
      <List sx={{ maxHeight:"50vh", overflowY: "auto" }}>
        {loading && (
          <Typography variant="body2" sx={{ padding: 2 }}>
            Loading users...
          </Typography>
        )}
        {error && (
          <Typography variant="body2" sx={{ color: "red", padding: 2 }}>
            Error: {error.message}
          </Typography>
        )}
        {data?.searchUsersByLetters?.map((user: any) => (
          <ListItem onClick={()=>addUser(user as User)} key={user.id}>
            <ListItemAvatar sx={{height:"2.5rem", width:"2.5rem"}}>
              {user.profile ? (
                <Avatar alt={user.username} src={user.profile} />
              ) : (
                <StringAvatar username={user.username} full_name=""/>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary="User profile"
            />
          </ListItem>
        ))}
      </List>
      <Divider/>
      <Typography variant="body2" sx={{ padding: 2 }}>
            Tagged users
          </Typography>
      {userIds.length > 0 && (
      <List sx={{ maxHeight:"50vh", overflowY: "auto" }}>
           {userIds.map((user: any) => (
          <ListItem sx={{backgroundColor:"#80808042"}} onClick={()=>removeUser(user.id)} key={user.id}>
            <ListItemAvatar sx={{height:"2.5rem", width:"2.5rem"}}>
              {user.profile ? (
                <Avatar alt={user.username} src={user.profile} />
              ) : (
                <StringAvatar username={user.username} full_name=""/>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary="User profile"
            />
          </ListItem>
        ))}
      </List>
      )}
    </Box>
  );

  return (
    <div>
      <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default DrawerComponent;
