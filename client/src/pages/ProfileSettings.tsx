import { useMutation, gql } from "@apollo/client";
import {
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { supabase } from "../supabase/supabase.ts";
import Error from "./Error";

const GET_PROFILE = gql`
  mutation getProfile {
    getProfileUpdateData {
      success
      message
      profile
      username
      email
    }
  }
`;
const UPDATE_PROFILE = gql`
  mutation updateProfile($profile: String, $username: String, $email: String) {
    profileUpdate(profile: $profile, username: $username, email: $email) {
      message
      success
    }
  }
`;
interface PROFILE {
  username: string;
  profile: string;
  email: string;
}
const ProfileSettings = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileData, setFileData] = useState<any>();
  const [profileData, setProfileData] = useState<PROFILE>();
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateUsername, setUpdateUsername] = useState("");
  const [updateProfile, setUpdateProfile] = useState("");
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileData(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const [getProfile, { loading, data, error }] = useMutation(GET_PROFILE);
  const [updateFunc, { loading: updateLoading, data: updateData }] =
    useMutation(UPDATE_PROFILE, {
      onCompleted: () => {
        getProfile();
        window.location.reload();
      },
    });
 
  const handleUpdate = async () => {
    if (fileData) {
      const filePath = Date.now() + fileData.name;
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("test-app")
        .upload(filePath, fileData);

      if (uploadError) {
        console.log(`File upload failed: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("test-app")
        .getPublicUrl(filePath);

      if (!publicUrlData) {
        console.log("Failed to retrieve public URL for the uploaded file.");
      }
      updateFunc({
        variables: {
          profile: publicUrlData.publicUrl,
          username: updateUsername,
          email: updateEmail,
        },
      });
    } else {
      updateFunc({
        variables: {
          profile: updateProfile,
          username: updateUsername,
          email: updateEmail,
        },
      });
    }
  };
  useEffect(() => {
    getProfile();
  }, []);
  useEffect(() => {
    if (data) {
      setProfileData(data.getProfileUpdateData);
      setUpdateUsername(data.getProfileUpdateData.username);
      setUpdateProfile(data.getProfileUpdateData.profile);
      setUpdateEmail(data.getProfileUpdateData.email);
    }
  }, [data]);
  useEffect(() => {
    if (updateData) {
      if (updateData.profileUpdate.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Error occured while updating");
      }
    }
  }, [updateData]);

  if (error) {
    toast.error("Error occured while getting data");
    return (<Error/>);
  }
  return (
    <>
      {loading && !profileData ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
          <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
              <Skeleton width={150} height={30} />
            </h2>

            {/* Profile Photo Section */}
            <div className="flex flex-col items-center mb-6">
              <Skeleton variant="circular" width={100} height={100} />
              <Skeleton width={120} height={20} className="mt-3" />
            </div>

            {/* Username Input Skeleton */}
            <div className="mb-4">
              <Skeleton variant="rectangular" width="100%" height={56} />
            </div>

            {/* Email Input Skeleton */}
            <div className="mb-6">
              <Skeleton variant="rectangular" width="100%" height={56} />
            </div>

            {/* Update Button Skeleton */}
            <div className="text-center">
              <Skeleton variant="rectangular" width="100%" height={40} />
            </div>
          </div>
        </div>
      ) : (
        <>
          {profileData && (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
              <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
                <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
                  Profile Settings
                </h2>

                {/* Profile Photo Section */}
                <div className="flex flex-col items-center mb-6">
                  <Avatar
                    src={previewImage ? previewImage : profileData.profile}
                    alt="Profile Photo"
                    sx={{ width: 100, height: 100 }}
                  />
                  <label
                    htmlFor="profile-photo"
                    className="mt-3 text-sm text-blue-500 cursor-pointer hover:underline"
                  >
                    Change Profile Photo
                  </label>
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Username Input */}
                <div className="mb-4">
                  <TextField
                    label="Username"
                    value={updateUsername}
                    onChange={(e) => setUpdateUsername(e.target.value)}
                    variant="outlined"
                    fullWidth
                    className="text-gray-700"
                  />
                </div>

                {/* Email Input */}
                <div className="mb-6">
                  <TextField
                    label="Email"
                    value={updateEmail}
                    variant="outlined"
                    onChange={(e) => setUpdateEmail(e.target.value)}
                    fullWidth
                    className="text-gray-700"
                  />
                </div>

                {/* Update Button */}
                <div className="text-center">
                  <Button
                    onClick={handleUpdate}
                    variant="contained"
                    color="primary"
                    className="w-full"
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {updateLoading ? <CircularProgress /> : "Update"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProfileSettings;
