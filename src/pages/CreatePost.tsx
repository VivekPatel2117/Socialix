import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import DrawerComponent from "../components/DrawerComponent";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HideImageIcon from "@mui/icons-material/HideImage";
const CreatePost: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const [isDrawer, setIsDrawer] = useState<boolean | null>(false);
  const handleTagPeople = () => {
    setIsDrawer(!isDrawer);
  };
  const [isImage, setIsImage] = useState(false);
  const handleIsImage = () => {
    setIsImage(!isImage);
  };
  return (
    <div className="flex justify-center items-center mt-10">
      <Paper elevation={3}>
        <div className="w-50vw h-full mx-auto p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold">Create New Post</h1>
          </div>
          {isImage && (
            <>
              <div className="flex justify-center items-center bg-white h-64 rounded-md border border-gray-300">
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

          <div className="flex  mt-2">
            <img
              src="https://via.placeholder.com/32"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 ml-2">
              <textarea
                rows={isImage ? 3 : 10}
                placeholder={
                  isImage
                    ? "Write a caption...."
                    : "What would you like to post today ?"
                }
                className="w-full mt-2 p-2 text-sm outline-none border border-gray-300 rounded-md"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  handleTagPeople();
                }}
                className="text-blue-600 border-cyan-700 font-medium px-4 py-2 border rounded-md hover:bg-cyan-100 transition"
              >
                Tag / Mention
              </button>
              {!isImage ? (
                <p onClick={() => handleIsImage()}>
                  <AddPhotoAlternateIcon sx={{ fontSize: "6vh" }} />
                </p>
              ) : (
                <p onClick={() => handleIsImage()}>
                  <HideImageIcon sx={{ fontSize: "6vh" }} />
                </p>
              )}
            </div>

            <button
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
        <DrawerComponent open={isDrawer} toggleDrawer={handleTagPeople} />
      )}
    </div>
  );
};

export default CreatePost;
