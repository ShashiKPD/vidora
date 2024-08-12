import { fetchChannelStats } from "@/store/channelSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Navigate,
  NavLink,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toggleSubscription } from "@/utils/apis";
import { Loader } from "lucide-react";
import { ErrorScreen, LoadingScreen } from "..";

const ChannelDetails = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, userData } = useSelector((state) => state.auth);
  const { channelStats, videos, error } = useSelector((store) => store.channel);
  const [onMyContentPage, setOnMyContentPage] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    dispatch(fetchChannelStats(username));
    if (username === userData.username) {
      setOnMyContentPage(true);
    }
  }, [username]);

  useEffect(() => {
    if (channelStats) {
      setSubscribed(channelStats.isUserSubscribed);
      setSubscriberCount(subscriptions);
    }
  }, [channelStats]);

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

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (!channelStats) {
    return (
      <LoadingScreen subtext="please be patient" className={`mt-[100px]`} />
    );
  }

  const {
    channelName,
    isUserSubscribed: userSubscribed,
    videoCount,
    totalVideoViews,
    subscriberCount: subscriptions,
    totalLikes,
  } = channelStats;

  return (
    <div className="w-full flex flex-col gap-1 sm:gap-2 lg:gap-3">
      <img
        src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Channel banner"
        className="w-full object-cover rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl aspect-[13/2]"
      />
      <div className="flex gap-2 sm:gap-3">
        <img
          src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Channel banner"
          className="size-16 sm:size-24 md:size-32 lg:size-36 xl:size-40 rounded-full"
        />
        <div className="flex flex-col gap-2 justify-center font-manrope w-full">
          <div className="mb-1 sm:mb-3">
            <p className="sm:text-2xl lg:text-4xl font-bold ">{channelName}</p>
            <p className="text-xs sm:text-sm md:text-base">
              @{username}
              <span className="seperator-dot">
                {subscriberCount} Subscribers
              </span>
              <span className="seperator-dot">{videos?.length} videos</span>
            </p>
          </div>
          <div className="flex justify-between mr-2">
            <button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className={`${
                subscribed
                  ? ""
                  : "shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none"
              } max-w-28 sm:max-w-32 rounded-full my-1 sm:my-0 px-3 sm:px-4 py-2 text-sm sm:text-base bg-//[#ae7aff] bg-[#d5d89b] hover:bg-[#e8ebad] text-black font-semibold text-nowrap  active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out`}
            >
              {isSubscribing
                ? "Loading.."
                : subscribed
                ? "Subscribed"
                : "Subscribe"}
            </button>
            <button
              onClick={() => navigate(`/channel/${username}/upload`)}
              className={`${
                !onMyContentPage && "hidden"
              } max-w-28 sm:max-w-32 rounded-full my-1 sm:my-0 px-3 sm:px-4 py-2 text-sm sm:text-base bg-//[#ae7aff] bg-violet-200 hover:bg-violet-100 text-black font-semibold text-nowrap shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none  active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out`}
            >
              Upload Video
            </button>
          </div>
        </div>
      </div>
      <div className="flex font-quicksand font-semibold">
        <NavLink
          to={`/channel/${username}`}
          className={({ isActive }) =>
            `${
              isActive && "bg-violet-200"
            }  px-2 py-1 text-sm sm:text-base rounded-md hover:bg-violet-200 active:hover:bg-violet-300`
          }
        >
          <button className="h-full w-full">Videos</button>
        </NavLink>

        <button className="px-2 py-1 text-sm sm:text-base rounded-md hover:bg-violet-200 active:hover:bg-violet-300">
          Playlists
        </button>
        <button className="px-2 py-1 text-sm sm:text-base rounded-md hover:bg-violet-200 active:hover:bg-violet-300">
          Community Posts
        </button>
        <button className="px-2 py-1 text-sm sm:text-base rounded-md hover:bg-violet-200 active:hover:bg-violet-300">
          Subscribed
        </button>
      </div>
      <hr className="border-slate-600" />
    </div>
  );
};

export default ChannelDetails;
