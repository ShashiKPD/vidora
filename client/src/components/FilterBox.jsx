import { toggleFilterBox } from "@/store/uiSlice";
import { fetchVideos } from "@/store/videoSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const FilterBox = () => {
  const location = useLocation();
  const { filterBox } = useSelector((store) => store.ui);
  const [sortBy, setSortBy] = useState("views");
  const [sortType, setSortType] = useState("desc");
  const [limit, setLimit] = useState(1);
  const dispatch = useDispatch();
  const searchParams = {
    sortBy: "views", // "duration" | "views" | "uploadDate"
    sortType: "desc",
    page: 1,
    limit: 50,
  };

  console.log(location.pathname !== "/");
  if (location.pathname !== "/") {
    return <></>;
  }

  const onClear = () => {
    setSortBy("views");
    setSortType("desc");
    searchParams.sortBy = "views";
    searchParams.sortType = "desc";
    searchParams.limit = 10;
    dispatch(toggleFilterBox());
    dispatch(fetchVideos());
  };

  const onSubmit = () => {
    searchParams.sortBy = sortBy;
    searchParams.sortType = sortType;
    searchParams.limit = limit;
    dispatch(fetchVideos(searchParams));
  };

  const handleLimitInput = (e) => {
    setLimit(e.target.value);
  };

  return (
    <div
      className={`${
        filterBox ? "" : "translate-y-[-110%] absolute"
      } transition-transform duration-200 ease pt-3 flex font-manrope text-xs sm:text-sm lg:text-base bg-white`}
    >
      <div className="flex px-3 gap-2 flex-wrap">
        <div className="bg-slate-200  flex justify-center gap-2 py-1 pl-3 pr-1 rounded-full">
          <span className="text-nowrap flex items-center text-slate-500">
            Sort By
          </span>
          <div className="flex gap-2 bg-slate-300 rounded-full">
            <button
              onClick={() => setSortBy("views")}
              className={`${
                sortBy === "views" ? "bg-slate-500 text-white" : ""
              } bg-slate-300 py-1 px-2 rounded-full`}
            >
              views
            </button>
            <button
              onClick={() => setSortBy("uploadDate")}
              className={`${
                sortBy === "uploadDate" ? "bg-slate-500 text-white" : ""
              } bg-slate-300 py-1 px-2 rounded-full`}
            >
              date
            </button>
            <button
              onClick={() => setSortBy("duration")}
              className={`${
                sortBy === "duration" ? "bg-slate-500 text-white" : ""
              } bg-slate-300 py-1 px-2 rounded-full`}
            >
              duration
            </button>
          </div>
        </div>
        <div className="bg-slate-200  flex justify-center gap-2 py-1 pl-3 pr-1 rounded-full">
          <span className="text-nowrap flex items-center text-slate-500">
            Sort Type
          </span>
          <div className="flex gap-2 bg-slate-300 rounded-full">
            <button
              onClick={() => setSortType("asc")}
              className={`${
                sortType === "asc" ? "bg-slate-500 text-white" : ""
              } bg-slate-300 py-1 px-2 rounded-full`}
            >
              asc
            </button>
            <button
              onClick={() => setSortType("desc")}
              className={`${
                sortType === "desc" ? "bg-slate-500 text-white" : ""
              } bg-slate-300 py-1 px-2 rounded-full`}
            >
              desc
            </button>
          </div>
        </div>
        <div className="bg-slate-200  flex justify-center items-center gap-2 py-1 px-3  rounded-full">
          <span className="text-nowrap flex items-center text-slate-500">
            limit
          </span>
          <input
            className="accent-slate-400 w-24"
            onChange={handleLimitInput}
            type="range"
            min={1}
            max={50}
            value={limit}
            id=""
          />
          {limit}
        </div>
      </div>
      <div className="flex gap-2 max-h-8 sm:max-h-10">
        <button
          onClick={onSubmit}
          className={`h-full bg-[#d5d89b] hover:bg-[#e8ebad] py-1 px-3 rounded-full`}
        >
          Submit
        </button>
        <button
          onClick={onClear}
          className={`h-full bg-violet-200 hover:bg-violet-100 py-1 px-3 rounded-full`}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterBox;
