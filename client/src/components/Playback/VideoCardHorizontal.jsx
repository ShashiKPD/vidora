import { formatDistanceToNow } from "date-fns";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCircleCheck, FaLessThan } from "react-icons/fa6";
import { formatDateToNow } from "@/utils/helper";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const VideoCardHorizontal = ({
  video: { createdAt, title, duration, views, _id, ownerDetails, thumbnail },
  index = 0,
}) => {
  const formatedDateToNow = formatDateToNow(createdAt);
  const location = useLocation();
  const [isOnPlaylist, setIsOnPlaylist] = useState(false);
  const [notOnWatchPage, setNotOnWatchPage] = useState(false);
  // console.log(ownerDetails);

  useEffect(() => {
    const path = location.pathname;
    if (!path.startsWith("/watch")) setNotOnWatchPage(true);
  }, []);

  return (
    <>
      <div className="flex w-full justify-between rounded-xl hover:bg-slate-100 font-quicksand">
        {notOnWatchPage && (
          <Link
            to={`/watch/${_id}`}
            className="shrink-0 flex items-center w-6 pr-1 py-1 justify-center"
          >
            {index + 1}
          </Link>
        )}
        <div className="flex flex-grow">
          <Link to={`/watch/${_id}`} className="pr-2 py-1">
            <img
              // src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              src={thumbnail}
              alt=""
              className="max-w-32 sm:max-w-40 aspect-video object-cover rounded-xl"
            />
          </Link>

          <div
            className={`${
              notOnWatchPage ? "" : "lg:max-w-56"
            } w-full flex-grow lg:min-w-36 xl:min-w-40`}
          >
            <Link to={`/watch/${_id}`}>
              <p className="text-black text-sm sm:text-base line-clamp-2 font-semibold">
                {title}
              </p>
            </Link>
            <div className="flex items-center">
              <Link
                to={`/channel/${ownerDetails?.username}`}
                className="flex items-center group hover:font-semibold text-slate-600"
              >
                <h3 className="text-gray-600 p-0 text-xs sm:text-sm leading-none pr-1">
                  {ownerDetails?.fullName}
                </h3>
                <FaCircleCheck className="text-[9px] sm:text-xs mt-[0.px] text-gray-600" />
              </Link>
              <Link to={`/watch/${_id}`} className="flex-grow">
                <div className="h-3 sm:h-[18px]"></div>
              </Link>
            </div>
            <Link to={`/watch/${_id}`} className="flex-grow h-30">
              <p className="text-gray-600 truncate text-sm ">
                {views} Views<span className="seperator-dot"></span>
                {formatedDateToNow}
              </p>
              <div className="h-full"></div>
            </Link>
          </div>
        </div>
        <div>
          <BsThreeDotsVertical className="text-xl mt-1" />
        </div>
      </div>
    </>
  );
};

export default VideoCardHorizontal;
