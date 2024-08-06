import { formatDistanceToNow } from "date-fns";
import more from "../../public/Icons/more.png";
import tickMark from "../../public/Icons/tick-mark.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";

const VideoCard = ({
  video: { createdAt, title, duration, views, _id, ownerDetails, thumbnail },
}) => {
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <>
      {/* <div className="flex w-full justify-center h-[100vh] bg-slate-300"> */}
      <div className="flex flex-col max-w-96">
        <img
          src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          // src={thumbnail}
          alt=""
          className="w-auto mb-2 aspect-video object-cover rounded-xl"
        />
        <div className="flex justify-around gap-3">
          <img
            src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=126&h=75&dpr=1"
            // src={ownerDetails.avatar}
            alt="Profile img"
            className="size-10 rounded-full"
          />
          <div className="flex-grow">
            <p className="text-black flex-grow font-sans font-semibold text-wrap line-clamp-2 leading-5">
              {title}
            </p>
            <div className="flex items-center gap-1">
              <h3 className="text-gray-600 p-0">{ownerDetails.fullName}</h3>
              <FaCircleCheck className="text-xs mt-[3px] text-gray-600" />
            </div>
            <p className="text-gray-600 leading-none">
              {views} Views<span className="seperator-dot"></span>
              {formattedDate}
            </p>
          </div>
          {/* <BsThreeDotsVertical className="text-4xl mt-[-5px]" /> */}
          <BsThreeDotsVertical className="text-xl " />
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default VideoCard;
