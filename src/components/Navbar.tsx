import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import React from "react";

type NavbarProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const Navbar = ({ searchQuery, setSearchQuery }: NavbarProps) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <div className="navbar bg-base-100 justify-between  px-4 sm:px-7 md:px-10 lg:px-15">
        <div>
          <a className="btn btn-ghost normal-case text-2xl"> Gallery</a>
        </div>
        <div className=" gap-2">
          <div className="form-control w-[8rem]  sm:w-[15rem] md:w-[25rem] text-end">
            <input
              type="text"
              placeholder="Search by email or date"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered  "
            />
          </div>
          <div className="pl-4">
            <label tabIndex={0}>
              <div>
                <button
                  onClick={handleLogout}
                  className="border-2 border-zinc-600 p-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
