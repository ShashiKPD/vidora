import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";
import { cookingToast, formatDateToNow } from "@/utils/helper";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const VideoCard = ({
  video: { createdAt, title, duration, views, _id, ownerDetails, thumbnail },
}) => {
  const formattedDate = formatDateToNow(createdAt);
  const [isAtChannel, setIsAtChannel] = useState(false);

  useEffect(() => {
    // Not rendering Owner details for channel page
    const currentPath = window.location.pathname;
    // Check if the current path starts with '/channel' and ensure it's not followed by more segments
    const isAtChannel =
      currentPath.startsWith("/channel") &&
      (currentPath === "/channel" || currentPath.split("/").length === 3);
    setIsAtChannel(isAtChannel);
  }, []);

  return (
    <>
      <div className="flex flex-col max-w-96">
        <Link to={`/watch/${_id}`}>
          <img
            // src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            src={thumbnail}
            alt=""
            className="w-auto aspect-video object-cover rounded-xl"
          />
        </Link>
        <div className="flex justify-around">
          {/* This doesn't render in channel page */}
          {!isAtChannel && (
            <Link
              to={`/channel/${ownerDetails?.username}`}
              className="pt-3 pr-2 shrink-0"
            >
              <img
                // src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=126&h=75&dpr=1"
                src={ownerDetails?.avatar}
                alt="Profile img"
                className="size-10 rounded-full object-cover"
              />
            </Link>
          )}
          <div className="flex-grow font-quicksand">
            <Link to={`/watch/${_id}`}>
              <p className="pt-2 text-black flex-grow font-semibold text-wrap line-clamp-2 leading-5">
                {title}
              </p>
            </Link>
            {/* This doesn't render in channel page */}
            {!isAtChannel && (
              <div className="flex items-center">
                <Link
                  to={`/channel/${ownerDetails?.username}`}
                  className="flex items-center group hover:font-semibold text-slate-600"
                >
                  <h3 className=" p-0 pr-1">{ownerDetails?.fullName}</h3>
                  <FaCircleCheck className="text-xs group-hover:text-slate-800" />
                </Link>
                <Link to={`/watch/${_id}`} className="flex-grow h-6">
                  <div className="w-full h-full"></div>
                </Link>
              </div>
            )}
            <Link to={`/watch/${_id}`} className="flex-grow h-6">
              <p
                className={`${
                  isAtChannel ? "text-sm" : "leading-none"
                } text-gray-600`}
              >
                {views} Views<span className="seperator-dot"></span>
                {formattedDate}
              </p>
            </Link>
          </div>
          {/* This doesn't render in channel page */}
          {!isAtChannel && (
            <div>
              <button onClick={() => cookingToast()}>
                <BsThreeDotsVertical className="text-xl mt-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoCard;
