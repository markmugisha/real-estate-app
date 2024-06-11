import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signOutUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import logo from '../assets/logo.png'

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart()); // Dispatching a start action indicating the sign-out process has started
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message)); // Dispatching a failure action if sign-out was not successful
        return;
      }
      dispatch(signOutUserSuccess()); // Dispatching a success action if sign-out was successful
      navigate("/"); // Redirecting to the sign-in page after sign-out
    } catch (error) {
      dispatch(signOutUserFailure(error.message)); // Dispatching a failure action if there was an error during sign-out
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

    document.addEventListener("click", closeDropdown);

    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, [location.search]);

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <header className="bg-slate-200 shadow-md h-24">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="" className="h-[100px] w-[200px]" />   
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 mt-4 font-semibold">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline mt-5">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/create-listing">
            <li className="hidden sm:inline text-red-900 hover:underline">
              List
            </li>
          </Link>
          {currentUser ? (
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <div>
                <img
                  className="h-10 w-10 rounded-full cursor-pointer"
                  src={currentUser.avatar}
                  alt="Profile"
                  onClick={toggleDropdown}
                />
              </div>
              {isOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  style={{ zIndex: 999 }}
                >
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <Link to="/create-listing">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:font-bold"
                        role="menuitem"
                      >
                        Create Listing
                      </button>
                    </Link>

                    <Link to="/show-listings">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:font-bold"
                        role="menuitem"
                      >
                        My Listings
                      </button>
                    </Link>

                    <Link to="/profile">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:font-bold"
                        role="menuitem"
                      >
                        Update Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleSignout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:font-bold"
                      role="menuitem"
                    >
                      Sign Out
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-700 hover:font-bold hover:hover:bg-red-950"
                      role="menuitem"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/sign-in">
              <li className="text-slate-700 hover:underline">Sign in</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
