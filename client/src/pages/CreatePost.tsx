import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import DrawerComponent from "../components/DrawerComponent";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HideImageIcon from "@mui/icons-material/HideImage";
import { gql, useQuery, useMutation } from "@apollo/client";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { supabase } from "../supabase/supabase.ts";
import StringAvatar from "../components/StringAvatar.tsx";
import Spinner from "../components/Spinner.tsx";
import Error from "./Error.tsx";
const GET_USER_PROFILE = gql`
  query GetUser {
    GetBasicUserDetails{
      id
      username
      profile
    }
  }
`;
const UPLOAD_FILE = gql`
mutation UploadFile(
  $file: String
  $caption: String!
  $postTitle: String
  $category: String!
  $taggedUserIds: [String]
) {
  uploadFile(
    file: $file
    caption: $caption
    postTitle: $postTitle
    category: $category
    taggedUserIds: $taggedUserIds
  ) {
    message
    isUploaded
    publicUrl
  }
}
`;
type User = {
  id: string;
  username: string;
  profile: string;
  __typename: string;
};
const CreatePost: React.FC = () => {
  const navigate = useNavigate();

  const [userIds, setUserIds] = useState<User[]>([]);
  const addUser = (user: User) => {
    // Check if the user already exists in the array by their id
    setUserIds(prevUserIds => {
      const userExists = prevUserIds.some(existingUser => existingUser.id === user.id);
      if (userExists) {
        return prevUserIds; // Return the same array if the user exists
      }
      return [...prevUserIds, user]; // Otherwise, add the new user
    });
  };
  
  // Removing a user by ID
  const removeUser = (userId: string) => {
    setUserIds(prevUserIds => prevUserIds.filter(user => user.id !== userId)); // Remove user by their ID
  };
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDrawer, setIsDrawer] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [isImage, setIsImage] = useState(false);
  const [uploadFile, { data:uploadedData, loading:uploadLoading, error: uploadError }] = useMutation(UPLOAD_FILE);
  const { loading, data } = useQuery(GET_USER_PROFILE);
  const [fileData, setFileData] = useState<any>();
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileData(file);
    if (file) {
      const reader = new FileReader();
      console.log(reader)
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const [postTitle, setPostTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };
  const handleTagPeople = () => setIsDrawer(!isDrawer);
  const handleIsImage = () => setIsImage(!isImage);
  const [isSpinner, setIsSpinner] = useState<boolean>(false);
  useEffect(() => {console.log(userIds)}, [userIds]);
  const handlePost = async () => {
    if(previewImage && text){
      setIsSpinner(true);
      const filePath = Date.now() + fileData.name;
          // Upload to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('test-app')
            .upload(filePath, fileData);
    
          if (uploadError) {
            console.log(`File upload failed: ${uploadError.message}`);
          }
    
          // Get the public URL for the uploaded file
          const { data: publicUrlData } = supabase.storage
            .from('test-app')
            .getPublicUrl(filePath);
    
          if (!publicUrlData) {
            console.log("Failed to retrieve public URL for the uploaded file.");
          }
          uploadFile({variables:{file:publicUrlData.publicUrl,caption:text,postTitle:postTitle,category:category,taggedUserIds:userIds.map(user => user.id)}})
    }else if(text && category){
      setIsSpinner(true);
      uploadFile({variables:{file:previewImage,caption:text,postTitle:postTitle,category:category,taggedUserIds:userIds.map(user => user.id)}})
    }else{
      alert("Please select an image or write a with category")
    }
  };
  if(uploadLoading){
    console.log("Uploading...")
  }
  if(uploadError){
    console.error(uploadError);
    setIsSpinner(false);
    return (
      <Error/>
    )
  }
  if(uploadedData){
    if(uploadedData.uploadFile.isUploaded){
      setIsSpinner(false);
    navigate("/home")  
    }
}
  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
      <Paper elevation={3} className="w-50vw p-4">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={120} height={30} />
        </div>
        <Skeleton variant="text" width="80%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={150} className="mt-4" />
        <div className="flex justify-between mt-4">
          <Skeleton variant="rectangular" width={120} height={40} />
          <Skeleton variant="rectangular" width={80} height={40} />
        </div>
      </Paper>
    </div>
    )
  }

  const userData = data?.GetBasicUserDetails;

  return (
    <div className="flex justify-center items-center mt-10">
      <Paper elevation={3}>
        <div className="w-screen lg:w-50vw h-full mx-auto p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full overflow-hidden">
              {userData.profile ? (
                 <img
                 src={userData?.profile || ""}
                 alt="Profile"
                 
               />
              ):(
                <StringAvatar full_name="" username={userData.username}/>
              )}
             </div>
              <p className="text-lg font-semibold">{userData?.username || "User"}</p>
            </div>
            <h1 className="text-lg font-semibold">Create New Post</h1>
          </div>
        
          <div className="flex-1 ml-2">
          <Box sx={{ minWidth: 120 }}>
      <TextField sx={{width:"20vw"}} id="outlined-basic" label="Post Title" variant="outlined" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setPostTitle(event.target.value);
        }} /> 
      <FormControl sx={{width: "25vw",marginLeft:"2vw"}}>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          label="Category"
          onChange={handleChange}
        >
          <MenuItem value={"Inspirational/Motivational"}>Inspirational/Motivational</MenuItem>
          <MenuItem value={"Educational/Informative"}>Educational/Informative</MenuItem>
          <MenuItem value={"Entertainment"}>Entertainment</MenuItem>
          <MenuItem value={"Lifestyle"}>Lifestyle</MenuItem>
          <MenuItem value={"Community Engagement"}>Community Engagement</MenuItem>
        </Select>
      </FormControl>
    </Box>
    {isImage && (
            <>
              <div className="flex justify-center mt-4 items-center bg-white h-64 rounded-md border border-gray-300">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-full w-auto object-contain rounded-md"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h18M3 21h18M4 8l6 6m0 0l4-4m-4 4V3m4 5h6"
                    />
                  </svg>
                )}
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-500 cursor-pointer file:mr-2 file:py-1 file:px-4 file:border file:rounded-md file:text-blue-600 file:border-gray-300"
                />
                <span className="text-sm text-gray-500">
                  {previewImage ? "File selected" : ""}
                </span>
              </div>
            </>
          )}
            <textarea
              rows={isImage ? 3 : 10}
              placeholder={
                isImage
                  ? "Write a caption...."
                  : "What would you like to post today ?"
              }
              className="w-full mt-2 p-2 text-sm outline-none border border-gray-300 rounded-md"
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleTagPeople}
                className="text-blue-600 border-cyan-700 font-medium px-4 py-2 border rounded-md hover:bg-cyan-100 transition"
              >
                Tag / Mention
              </button>
              {!isImage ? (
                <p onClick={handleIsImage}>
                  <AddPhotoAlternateIcon sx={{ fontSize: "6vh" }} />
                </p>
              ) : (
                <p onClick={handleIsImage}>
                  <HideImageIcon sx={{ fontSize: "6vh" }} />
                </p>
              )}
            </div>
            <button
              onClick={handlePost}
              className="
                px-4 py-2 
                text-white 
                font-medium 
                bg-blue-600 
                rounded-md 
                shadow-md 
                hover:bg-blue-700 
                hover:shadow-lg 
                transition 
                duration-300 
                ease-in-out
              "
            >
              Post
            </button>
          </div>
        </div>
      </Paper>
      {isDrawer && (
        <DrawerComponent open={isDrawer} toggleDrawer={handleTagPeople} removeUser={removeUser} addUser={addUser} userIds={userIds}/>
      )}
      {isSpinner && (
        <Spinner isSpinner={isSpinner} handleSpinner={()=>{}} />
      )}
    </div>
  );
};

export default CreatePost;
