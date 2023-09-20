import React, { useState, useEffect } from "react";
import useStorage from "../hooks/useStorage";
import { useDropzone } from "react-dropzone";
import { FileWithPath } from "react-dropzone";
import useFirestore from "../hooks/useFirestore";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Navbar from "./Navbar";

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Define the Image type here
type Image = {
  createdAt: Date;
  userEmail: string;
  imageUrl: string;
};

const DraggableImage = ({
  image,
  index,
  moveImage,
}: {
  image: Image;
  index: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
}) => {
  const [, ref] = useDrag({
    type: "IMAGE",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "IMAGE",
    hover: (draggedImage: { index: number }) => {
      if (draggedImage.index !== index) {
        moveImage(draggedImage.index, index);
      }
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  // Handle the image loading completion
  

  return (
    <div ref={(node) => ref(drop(node))}>
      <div
        key={image.imageUrl}
        className="card h-96 card-compact w-full bg-base-100 shadow-xl p-1"
      >
        
        {isLoading ? (
          <div className="w-full h-[80%] flex justify-center items-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : (
          <img
            src={image.imageUrl}
            alt={image.imageUrl}
            className="object-cover w-[100%] h-[80%] rounded-2xl"
            onLoad={() => setIsLoading(false)} // Set the onLoad event handler
          />
        )}

        <div className="card-body ">
          <span className="font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">
            {" "}
            {image.userEmail}
          </span>
          <span>
            {new Date(image.createdAt).toLocaleDateString()}{" "}
            <span className="font-bold">
              {" "}
              {formatTime(image.createdAt.getTime())}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

const ImageGallery = () => {
  const { docs: images } = useFirestore("images");
  const { startUpload } = useStorage();
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Reset uploading state when component mounts
    setUploading(false);
  }, []);

  useEffect(() => {
    // Use a timeout to reset uploading after 10 seconds
    let timeout: NodeJS.Timeout; // Specify the type explicitly

    if (uploading) {
      timeout = setTimeout(() => {
        setUploading(false);
      }, 3000); // 10 seconds
    }

    // Clean up the timeout if uploading changes before the timeout completes
    return () => {
      clearTimeout(timeout);
    };
  }, [uploading]);

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      setUploading(true);
      startUpload(acceptedFiles[0]);
    }
  };

  const { getInputProps } = useDropzone({ onDrop });

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploading(false); // Reset uploading state
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      setUploading(true); // Set to true when uploading starts
      startUpload(files[0]);
    }
  };

  // Add a function to move images
  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    // No need to update 'images' state here, it's handled internally
  };

  // Function to filter images based on search query
  const filterImages = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    return images.filter(
      (image) =>
        image.userEmail.toLowerCase().includes(lowerCaseQuery) ||
        image.createdAt.toLocaleDateString().includes(lowerCaseQuery) ||
        formatTime(image.createdAt.getTime()).includes(lowerCaseQuery)
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="min-h-screen "
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="fixed z-50 w-full  h-20">
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <div className="py-5 px-3 sm:px-7 md:px-10 lg:px-15 pb-24 pt-20">
          {uploading ? (
            <div className="h-24 flex justify-center items-center">
              {/* Use getInputProps to render the file input */}
              <input {...getInputProps()} />
              <span className="loading loading-bars loading-xs"></span>
              <span className="loading loading-bars loading-sm"></span>
              <span className="loading loading-bars loading-md"></span>
              <span className="loading loading-bars loading-lg"></span>
            </div>
          ) : (
            <div className="h-24 flex justify-center items-center">
              <p className="font-extrabold text-2xl text-center">
                Drag and Drop anywhere to upload
              </p>
            </div>
          )}

          <div
            className={`grid duration-300 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-4 sm:gap-5 md:gap-7 lg:gap-10 mt-4`}
          >
            {filterImages(searchQuery).map((image, index) => (
              <DraggableImage
                key={image.imageUrl}
                image={image}
                index={index}
                moveImage={moveImage}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default ImageGallery;
