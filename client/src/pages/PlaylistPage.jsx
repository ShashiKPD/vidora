import { VideoListView } from "@/components";
import { PlayCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const PlaylistPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const listId = queryParams.get("list") || "";
  const onLikedVideosPage =
    location.pathname.startsWith("/playlist") && listId === "LL";
  const navigate = useNavigate();
  const [playlistImg, setplaylistImg] = useState("");
  const [totalVideos, setTotalVideos] = useState(0);
  const { likedVideos, userPlaylists } = useSelector((store) => store.playlist);
  const { userData } = useSelector((store) => store.auth);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    if (onLikedVideosPage && likedVideos && likedVideos.length > 0) {
      setplaylistImg(likedVideos[likedVideos.length - 1].thumbnail);
      setTotalVideos(likedVideos.length);
      const totalVideoViews = likedVideos.reduce(
        (prev, curr) => prev + curr.views,
        0
      );
      setTotalViews(totalVideoViews);
    }
  }, [likedVideos]);

  const handlePlayAll = () => {
    if (likedVideos && likedVideos.length > 0) {
      navigate(`/watch/${likedVideos[likedVideos.length - 1]._id}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-2 sm:p-5 gap-1 lg:justify-center min-h-[calc(100vh-92px)]">
      {/* Left box */}
      <div className="w-full xl:w-96 lg:w-80 shrink-0 flex lg:flex-col flex-row p-5 gap-2 sm:gap-3 md:gap-5 rounded-2xl lg:rounded-3xl font-manrope bg-gradient-to-br from-slate-300 via-slate-100 to-slate-200">
        <div className="relative flex items-center justify-center lg:h-48 w-32 xs:w-40 sm:w-56 md:w-72 lg:w-full">
          <img
            src={
              playlistImg ||
              "https://images.pexels.com/photos/17485847/pexels-photo-17485847.png?auto=compress&cs=tinysrgb&h=500&dpr=1"
            }
            alt="Playlist Image"
            className=" absolute aspect-video object-cover rounded-xl"
          />
          {/* Glass Overlay */}
          <div className="absolute w-full aspect-video object-cover rounded-xl  text-white ">
            <div className="w-full h-[65%]"></div>
            <div className="w-full text-[10px] sm:text-base px-3 sm:py-1 h-[35%] flex justify-between rounded-b-xl bg-[rgba(134,134,134,0.5)] backdrop-blur-sm">
              <div className="flex flex-col justify-between pb-1">
                <p>Playlist</p>
                <p className="text-[0.8em] font-thin leading-none">
                  {totalViews} views
                </p>
              </div>
              <p>{totalVideos} videos</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 sm:gap-3 lg:gap-5">
          <div className="font-semibold text-slate-700">
            <p className="text-base sm:text-2xl md:text-3xl">
              {onLikedVideosPage ? "Liked Videos" : "Playlist Name"}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm md:text-base font-semibold">
              {userData?.fullName}
            </p>
            <p className="text-xs sm:text-sm md:text-base ">
              {totalVideos} videos
            </p>
          </div>
          <button
            onClick={handlePlayAll}
            className="max-w-20 sm:max-w-28 mb-2 h-6 sm:h-8 md:h-10 flex items-center bg-[#d5d89b] hover:bg-[#e8ebad] text-black px-3 sm:px-4 py-1 rounded-full text-nowrap shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out"
          >
            <FaPlay />
            <span className="pl-2 text-sm sm:text-base max-sm:text-xs font-semibold">
              Play All
            </span>
          </button>
        </div>
      </div>
      {/* Right Part */}
      <VideoListView liked={listId === "LL"} />
    </div>
  );
};

export default PlaylistPage;
