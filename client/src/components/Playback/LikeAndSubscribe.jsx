import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchLikedVideos } from "@/store/likesSlice";

import { FaCircleCheck } from "react-icons/fa6";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { CgPlayListAdd, CgPlayListCheck } from "react-icons/cg";
import {
  getSubscriberCount,
  toggleSubscription,
  toggleVideoLike,
} from "@/utils/apis";

const LikeAndSubscribe = () => {
  const { video, status, error } = useSelector((store) => store.playback);
  const { likedVideos } = useSelector((store) => store.likes);
  const { videoId } = useParams();
  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    owner,
    ownerDetails: { fullName, username, avatar },
    isUserSubscribed,
    likeCount,
  } = video;

  const [currLikeCount, setCurrLikeCount] = useState(likeCount);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    setSubscribed(isUserSubscribed);

    if (!likedVideos) {
      dispatch(fetchLikedVideos());
    }
    likedVideos.map((video) => {
      if (video._id === videoId) {
        setLiked(true);
      }
    });

    (async () => {
      const subscribers = await getSubscriberCount(username, accessToken);
      if (subscribers.data) {
        setSubscriberCount(subscribers.data.subscriberCount);
      }
    })();
  }, []);

  const handleLikeButton = async () => {
    setIsLiking(true);
    await toggleVideoLike(videoId, accessToken)
      .then((data) => {
        if (data?.data) setLiked(data.data.isLiked);

        if (data.data.isLiked) setCurrLikeCount((prev) => prev + 1);
        else setCurrLikeCount((prev) => prev - 1);
      })
      .finally(() => {
        setIsLiking(false);
      });
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    await toggleSubscription(username, accessToken)
      .then((data) => {
        if (data?.data) setSubscribed(data.data.isSubscribed);

        if (data?.data.isSubscribed) setSubscriberCount((prev) => prev + 1);
        else setSubscriberCount((prev) => prev - 1);
      })
      .finally(() => {
        setIsSubscribing(false);
      });
  };

  return (
    <div className="flex justify-between py-3 flex-wrap-reverse gap-3">
      <div className="flex gap-2 ">
        <img
          src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=126&h=75&dpr=1"
          // src={avatar}
          alt="Profile img"
          className="size-11 rounded-full"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <h3 className="font-semibold">{fullName}</h3>
            <FaCircleCheck className="text-xs mt-[3px] text-gray-600" />
          </div>
          <p className="leading-none text-sm truncate">
            {subscriberCount} subscribers
          </p>
        </div>
        <button
          onClick={handleSubscribe}
          disabled={isSubscribing}
          className={`${
            subscribed
              ? ""
              : "shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none"
          } rounded-full ml-0 sm:ml-2 my-1 sm:my-0 px-3 sm:px-4 py-1 text-sm sm:text-base bg-//[#ae7aff] bg-[#d5d89b] hover:bg-[#e8ebad] text-black font-semibold text-nowrap  active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out`}
        >
          {isSubscribing
            ? "Loading.."
            : subscribed
            ? "Subscribed"
            : "Subscribe"}
        </button>
      </div>
      {/* Like and save buttons */}
      <div className="flex py-1 sm:py-0">
        {/* Like Button */}
        <button
          onClick={handleLikeButton}
          disabled={isLiking}
          className="group flex items-center bg-//[#ae7aff] bg-[#d5d89b] hover:bg-[#e8ebad] text-black px-3 sm:px-4 py-1 rounded-full text-nowrap shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out"
        >
          <GoHeart
            className={`text-lg sm:text-xl group-hover:hidden ${
              liked ? "hidden" : "inline"
            }`}
          />
          <GoHeartFill
            className={`text-lg sm:text-xl group-hover:inline ${
              liked ? "inline" : "hidden"
            }`}
          />
          <span className="pl-2 text-sm sm:text-base font-semibold">
            {currLikeCount}
          </span>
        </button>
        {/* Dislike Button */}
        {/* <button className="z-10 flex items-center bg-//[#ae7aff] bg-[#afb27a] hover:bg-[#d5d89b] text-black px-3 sm:px-4 py-1 rounded-r-2xl text-nowrap shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out">
                <BiDislike
                  className={`text-lg sm:text-2xl ${
                    disliked ? "hidden" : "inline"
                  }`}
                />
                <BiSolidDislike
                  className={`text-lg sm:text-2xl ${
                    disliked ? "inline" : "hidden"
                  }`}
                />
                <span className="pl-2 text-sm sm:text-base font-semibold">
                  2k
                </span>
              </button> */}
        {/* Save Button */}
        <button className="rounded-full ml-2 px-3 sm:px-4 py-1 text-sm sm:text-base bg-//[#ae7aff] bg-//[#afb27a] bg-violet-200 hover:bg-violet-100 text-black font-semibold text-nowrap shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out">
          <CgPlayListAdd
            className={`text-lg sm:text-2xl ${saved ? "hidden" : "inline"}`}
          />
          <CgPlayListCheck
            className={`text-lg sm:text-2xl ${saved ? "inline" : "hidden"}`}
          />
          <span className="text-sm sm:text-base font-semibold hidden sm:inline">
            {saved ? "saved" : "save"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default LikeAndSubscribe;
