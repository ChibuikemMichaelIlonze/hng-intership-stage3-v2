import React, { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import Sortable from "sortablejs";

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
    "mountain",
    "airplane",
    "skyscraper",
    "phone",
    "ball",
    "house",
    "school",
  ];

  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
      } catch (error) {
        console.error("Error loading images:", error);
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      new Sortable(containerRef.current, {
        animation: 150,
        onEnd: (event: any) => {
          const { oldIndex, newIndex } = event;

          if (oldIndex !== newIndex) {
            const reorderedTags = [...tags];
            const reorderedFilenames = [...imageFilenames];

            const movedTag = reorderedTags.splice(oldIndex, 1)[0];
            const movedFilename = reorderedFilenames.splice(oldIndex, 1)[0];

            reorderedTags.splice(newIndex, 0, movedTag);
            reorderedFilenames.splice(newIndex, 0, movedFilename);
          }
        },
      });
    }
  }, [tags, imageFilenames]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signup");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const filteredImageOrder = Array.from(
    { length: imageFilenames.length },
    (_, index) => index
  ).filter((index) =>
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
        <div>
          <div
            ref={containerRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-between gap-5 mt-10 px-6"
          >
            {filteredImageOrder.map((index) => (
              <div
                key={index}
                className="relative flex justify-center items-center "
              >
                <div className="absolute top-2 left-5 lg:left-10 bg-gray-800 text-white px-2 py-1 rounded ">
                  {tags[index]}
                </div>
                <img
                  src={`/images/${imageFilenames[index]}`}
                  alt={`Image ${index + 1}`}
                  className="h-80 w-56 object-cover "
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortableList;
