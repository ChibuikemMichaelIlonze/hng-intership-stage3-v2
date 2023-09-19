import React, { useState } from "react";
import useStorage from "../hooks/useStorage";

const UploadForm = () => {
  const { startUpload } = useStorage();

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      setUploading(true); // Set to true when uploading starts
      startUpload(files[0]);

      // Remove the callback for handling completion
      // You can handle completion in the useStorage hook if needed
    }
  };

  return (
    <div
      className={`text-center mt-10 ${
        dragging ? "h-20  border-4 border-gray-400" : ""
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-bars loading-xs"></span>
          <span className="loading loading-bars loading-sm"></span>
          <span className="loading loading-bars loading-md"></span>
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : dragging ? (
        <p className="h-20">Drop the file here to upload</p>
      ) : (
        <p className="h-20">Drag and drop a file here to upload</p>
      )}
    </div>
  );
};

export default UploadForm;
