import React, { useState, useEffect } from "react";
import useStorage from "../hooks/useStorage";
import { useDropzone } from "react-dropzone";
import { FileWithPath } from "react-dropzone";
import useFirestore from "../hooks/useFirestore";
import Navbar from "./Navbar";

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

type Image = {
  createdAt: Date;
  userEmail: string;
  imageUrl: string;
};

const ImageGallery = () => {
  const { docs: images } = useFirestore("images");
  const { startUpload } = useStorage();
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [draggedImage, setDraggedImage] = useState<Image | null>(null);

  useEffect(() => {
    setUploading(false);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (uploading) {
      timeout = setTimeout(() => {
        setUploading(false);
      }, 3000);
    }

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
    setUploading(false);
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
      setUploading(true);
      startUpload(files[0]);
    }
  };

  const handleDragStart = (image: Image) => {
    setDraggedImage(image);
  };

  const handleDragEnd = () => {
    setDraggedImage(null);
  };

  const handleDropImage = (targetImage: Image) => {
    if (draggedImage && draggedImage !== targetImage) {
      // Rearrange the images
      const updatedImages = [...images];
      const draggedIndex = updatedImages.findIndex(
        (image) => image === draggedImage
      );
      const targetIndex = updatedImages.findIndex(
        (image) => image === targetImage
      );

      if (draggedIndex !== -1 && targetIndex !== -1) {
        updatedImages.splice(draggedIndex, 1);
        updatedImages.splice(targetIndex, 0, draggedImage);
        // Update the state or send this rearrangement to your backend
        // setImages(updatedImages);
      }

      setDraggedImage(null);
    }
  };

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
            <div
              key={image.imageUrl}
              className="card h-[23rem] card-compact w-full bg-base-100 shadow-xl p-1"
              draggable
              onDragStart={() => handleDragStart(image)}
              onDragEnd={handleDragEnd}
              onDrop={() => handleDropImage(image)}
              onDragOver={(e) => e.preventDefault()}
            >
              <img
                src={image.imageUrl}
                alt={image.imageUrl}
                className="object-cover w-[100%] h-full rounded-2xl"
              />
              <div className="card-body absolute bottom-0 text-zinc-600 font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">
                <span className="font-bold w-40 whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {image.userEmail}
                </span>
                <span>
                  {new Date(image.createdAt).toLocaleDateString()}{" "}
                  <span className="font-bold">
                    {formatTime(image.createdAt.getTime())}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
