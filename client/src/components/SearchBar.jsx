import { fetchVideos, setQuery } from "@/store/videoSlice";
import { cookingToast } from "@/utils/helper";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [backButtonVisible, setBackButtonVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearch = () => {
    navigate("/");
    setBackButtonVisible(true);
    dispatch(setQuery(searchQuery.trim()));
    setTimeout(() => {
      dispatch(setQuery(""));
    }, 100);
  };

  const handleBackButton = () => {
    setBackButtonVisible(false);
    setSearchQuery("");
    dispatch(fetchVideos());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) handleSearch();
    }
  };
  return (
    <div className="flex max-w-lg flex-grow ">
      {backButtonVisible && (
        <button
          disabled={!backButtonVisible}
          onClick={handleBackButton}
          className="flex items-center px-2"
        >
          <IoArrowBack className="text-2xl" />
        </button>
      )}

      <input
        onChange={handleQueryChange}
        value={searchQuery}
        onKeyDown={handleKeyDown}
        className="w-full border border-slate-400  placeholder-gray-400 pl-5 pr-3 outline-none py-1 text-sm sm:text-base rounded-full rounded-r-none bg-transparent "
        placeholder="Search"
      />
      <button
        disabled={!searchQuery.trim()}
        onClick={handleSearch}
        className={`${
          searchQuery.trim() === "" ? "" : "hover:bg-slate-500 hover:text-white"
        }   bg-slate-400   px-3 sm:px-4 rounded-r-full`}
      >
        <CiSearch className="sm:text-2xl" />
      </button>
    </div>
  );
};

export default SearchBar;
