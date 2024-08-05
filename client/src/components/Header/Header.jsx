import { logout } from "@/store/authSlice";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex w-full bg-gray-900 text-white py-5 px-10 justify-between items-center gap-5">
      <Link to="/" className="">
        Vidora
      </Link>
      {authStatus ? (
        <div className="flex max-w-96 flex-grow">
          <input
            className="w-full border border-gray-600  placeholder-gray-400 pl-5 pr-3 outline-none py-1 rounded-full rounded-r-none bg-transparent "
            placeholder="Search"
          />
          <button className="bg-gray-600 px-4 rounded-r-full">
            <CiSearch className="text-2xl" />
          </button>
        </div>
      ) : (
        <></>
      )}
      <div className="flex gap-4">
        {authStatus ? (
          <>
            <img
              src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=126&h=75&dpr=1"
              // src={ownerDetails.avatar}
              alt="Profile img"
              className="size-8 rounded-full"
            />
            <button
              className="text-sm bg-[#ae7aff] text-black px-2 py-1 font-bold text-nowrap shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out"
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
    </div>
  );
};

export default Header;
