import { fetchVideos, setQuery } from "@/store/videoSlice";
import { cookingToast } from "@/utils/helper";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { IoArrowBack } from "react-icons/io5";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [backButtonVisible, setBackButtonVisible] = useState(false);
  const dispatch = useDispatch();

  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearch = () => {
    setBackButtonVisible(true);
    dispatch(setQuery(searchQuery));
    setSearchQuery("");
    setTimeout(() => {
      dispatch(setQuery(""));
    }, 100);
  };
  const handleBackButton = () => {
    setBackButtonVisible(false);
    dispatch(fetchVideos());
  };
  return (
    <div className="flex max-w-lg flex-grow max-xs:hidden">
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
        className="w-full border border-slate-400  placeholder-gray-400 pl-5 pr-3 outline-none py-1 text-sm sm:text-base rounded-full rounded-r-none bg-transparent "
        placeholder="Search"
      />
      <button
        disabled={!searchQuery.trim()}
        onClick={handleSearch}
        className="bg-slate-400 px-3 sm:px-4 rounded-r-full"
      >
        <CiSearch className="sm:text-2xl" />
      </button>
    </div>
  );
};

export default SearchBar;
