import { logout } from "@/store/authSlice";
import { logoutAll } from "@/store/actions/authActions";
import { toggleSidebar } from "@/store/uiSlice";
import logo from "/assets/logo-color.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoArrowBack } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [searchPageState, setSearchPageState] = useState(false);

  const handleHamburger = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    dispatch(logoutAll());
    dispatch(logout());
  };

  const toggleSearchPage = () => {
    setSearchPageState((prev) => !prev);
  };

  if (searchPageState) {
    return (
      <div className="fixed z-40 top-0 w-full h-full flex justify-center bg-white">
        <div className="h-14 py-3 px-2 sm:px-5 w-full flex justify-center gap-2 sm:gap-5 bg-slate-100">
          <button onClick={toggleSearchPage} className="flex items-center px-2">
            <IoArrowBack className="text-2xl" />
          </button>
          <div className="flex flex-grow justify-center">
            <div className="flex max-w-96 flex-grow">
              <input
                className="w-full border border-slate-400  placeholder-gray-400 pl-3 sm:pl-5 pr-3 outline-none py-1 text-sm sm:text-base rounded-full rounded-r-none bg-transparent "
                placeholder="Search"
              />
              <button className="bg-slate-400 px-3 sm:px-4 rounded-r-full">
                <CiSearch className="sm:text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="sticky z-30 top-0 flex w-full h-16 bg-slate-100 text-black py-5 px-5  sm:px-10 justify-between items-center gap-3 sm:gap-5">
      <div className="flex gap-3 sm:gap-5">
        <button onClick={handleHamburger}>
          <RxHamburgerMenu className="text-2xl" />
        </button>
        <Link to="/" className="w-20 sm:w-32 flex items-center justify-center">
          <img className="w-full h-auto" src={logo} alt="" />
        </Link>
      </div>
      {authStatus ? (
        // Hidden on screen smaller than "xs"
        <div className="flex max-w-lg flex-grow max-xs:hidden">
          <input
            className="w-full border border-slate-400  placeholder-gray-400 pl-5 pr-3 outline-none py-1 text-sm sm:text-base rounded-full rounded-r-none bg-transparent "
            placeholder="Search"
          />
          <button className="bg-slate-400 px-3 sm:px-4 rounded-r-full">
            <CiSearch className="sm:text-2xl" />
          </button>
        </div>
      ) : (
        <></>
      )}
      <div className="flex gap-3 sm:gap-5">
        {authStatus ? (
          <>
            {/* hidden in larger devices (bigger than "sm" */}
            <button
              onClick={toggleSearchPage}
              className="hidden max-xs:block px-3 sm:px-4"
            >
              <CiSearch className="text-2xl" />
            </button>
            <img
              src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=126&h=75&dpr=1"
              // src={ownerDetails.avatar}
              alt="Profile img"
              className="size-7 sm:size-8 rounded-full"
            />
            <button
              className="text-xs sm:text-sm bg-//[#ae7aff] bg-[#d5d89b] hover:bg-[#e8ebad] text-black px-2 py-1 font-bold text-nowrap shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="px-2 py-1 hover:bg-slate-600">Login</button>
            </Link>
            <Link to="/register">
              <button className="text-sm bg-[#ae7aff] text-black px-2 py-1 font-bold shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out">
                Sign up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
