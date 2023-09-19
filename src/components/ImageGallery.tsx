import React, { useState } from "react";
import useFirestore from "../hooks/useFirestore";
import useStorage from "../hooks/useStorage";

const ImageGallery = () => {
  const { docs: images, isLoading } = useFirestore("images");
  const { startUpload, progress, error } = useStorage();
  console.log(images);

  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      // Assuming only one file is dropped at a time
      const file = files[0];
      startUpload(file);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        <progress className="progress w-56"> </progress>
      </div>
    );
  }

  return (
    <div
      className={`grid duration-300 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-4 sm:gap-5 md:gap-7 lg:gap-10 mt-10 

      }`}
    >
      {images.map((image) => (
        <div
          key={image.imageUrl}
          className="card max-w-[20rem]  card-compact w-full bg-base-100 shadow-xl p-1"
        >
          <figure className="max-h-[10rem] ">
            <img src={image.imageUrl} alt="Shoes" />
          </figure>
          <div className="card-body">
            <p>Uploaded by: {image.userEmail}</p>
            <span>Created on: {image.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
