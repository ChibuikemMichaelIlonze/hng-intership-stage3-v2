import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const SortableList: React.FC = () => {
  const imageFilenames = [
    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
    "7.jpeg",
    "8.jpg",
    "9.jpeg",
    "10.jpeg",
    "11.jpeg",
    "12.jpeg",
  ];

  const tags = [
    "river",
    "person",
    "bicycle",
    "food",
    "car",
    "river",
    "airplane",
    "skyscraper",
    "phone",
    "ball",
    "house",
    "school",
  ];

  const [imageOrder, setImageOrder] = useState<number[]>(
    Array.from({ length: imageFilenames.length }, (_, index) => index)
  );

  const [dragItemIndex, setDragItemIndex] = useState<number | undefined>();
  const [dragOverItemIndex, setDragOverItemIndex] = useState<
    number | undefined
  >();

  const [searchInput, setSearchInput] = useState(""); // State for search input
  const [loading, setLoading] = useState(true); // Loading state

  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Simulate an API call to load images
    const loadImages = async () => {
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false); // Set loading to false when images are loaded
      } catch (error) {
        console.error("Error loading images:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    loadImages();
  }, []);

  const handleDragStart = (index: number) => {
    setDragItemIndex(index);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (_index: number) => {
    if (dragItemIndex !== undefined && dragOverItemIndex !== undefined) {
      const newOrder = [...imageOrder];
      const [draggedImage] = newOrder.splice(dragItemIndex, 1);
      newOrder.splice(dragOverItemIndex, 0, draggedImage);
      setImageOrder(newOrder);
    }
  };

  const handleDragEnter = (index: number) => {
    setDragOverItemIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverItemIndex(undefined);
  };

  const handleDragEnd = () => {
    setDragItemIndex(undefined);
    setDragOverItemIndex(undefined);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/signup");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const filteredImageOrder = imageOrder.filter((index) =>
    tags[index].toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div>
      <div className="navbar bg-base-100 px-10 py-4">
        <div className="flex-1">
          <a className="btn pl-0 sm:pl-[auto] btn-ghost normal-case text-xl">
            Image Gallery
          </a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div
            className="w-fit p-2 border-2 border-gray-400 rounded-md cursor-pointer"
            onClick={handleLogout}
          >
            <p>Logout</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-between gap-5 mt-10 px-6">
          {filteredImageOrder.map((index) => (
            <div
              key={index}
              className="relative flex justify-center items-center"
            >
              <div className="absolute top-2 left-5 lg:left-10 bg-gray-800 text-white px-2 py-1 rounded ">
                {tags[index]}
              </div>
              <img
                src={`/images/${imageFilenames[index]}`}
                alt={`Image ${index + 1}`}
                className="h-80 w-56 object-cover "
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onLoad={() => setLoading(false)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortableList;
