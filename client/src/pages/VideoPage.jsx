import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  VideoListView,
  VideoPlayer,
  CommentSection,
  LikeAndSubscribe,
  LoadingScreen,
  ErrorScreen,
} from "@/components";
import { formatDate, formatDateToNow } from "@/utils/helper";
import { fetchVideo } from "@/store/playbackSlice";
import { fetchLikedVideos } from "@/store/likesSlice";

const VideoPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isClamped, setisClamped] = useState(true);
  const { videoId } = useParams();
  const dispatch = useDispatch();

  const { video, status, error } = useSelector((store) => store.playback);

  useEffect(() => {
    if (status !== "loading") {
      dispatch(fetchVideo(videoId));
      dispatch(fetchLikedVideos());
    }
    // Scroll to the top of the page on mount
    window.scrollTo({ top: 0 });
  }, [videoId]);

  useEffect(() => {
    if (video) setIsLoading(false);
  }, [video]);

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (isLoading) {
    return <LoadingScreen className={"mt-[400px]"} />;
  }

  if (!video) {
    // fetch video details from server
    // if (status === "failed")
    return (
      <div className="w-full h-[calc(100vh-96px)] flex flex-col justify-center text-center px-5">
        <p className="text-3xl">404 NOT FOUND :/</p>
        <p>The video you are looking for was not found in our database.</p>
      </div>
    );
  }

  const {
    _id,
    title,
    description,
    videoFile,
    thumbnail,
    duration,
    views,
    createdAt,
  } = video;

  const formattedDateToNow = formatDateToNow(createdAt);
  const formattedDate = formatDate(createdAt);

  return (
    <div className="flex w-full gap-3 p-2 sm:p-4 justify-center flex-col lg:flex-row">
      <div className="flex flex-col lg:max-w-[70%]">
        {/*left side video, description and comment sections */}
        <VideoPlayer
          videoUrl={videoFile}
          thumbnailUrl={thumbnail}
          duration={duration}
          className="grow-0 rounded-2xl"
        />
        {/* channel owner and video details */}
        <div>
          <p className="text-xl font-semibold py-1 line-clamp-2 leading-tight">
            {title}
          </p>
          <LikeAndSubscribe />
        </div>
        <hr className="my-2 border-1 border-slate-600" />
        {/* Video Description */}
        <div className="relative bg-slate-200 p-4 rounded-2xl">
          <div
            className={`line-clamp-2 whitespace-pre-wrap ${
              !isClamped ? "line-clamp-none" : ""
            }`}
          >
            <p className="text-slate-700 text-base truncate font-semibold">
              {views} Views<span className="seperator-dot"></span>
              {formattedDateToNow}
            </p>
            {description}
            <br /> <br />
            This is a demo text to show the website's functionality.
            <br />
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aut ipsam,
            quas rerum obcaecati vero ut sit eaque deserunt accusantium
            consequuntur ullam repudiandae pariatur est mollitia quibusdam
            quisquam qui. A, perferendis!
            <hr className="my-2 border-1 border-slate-600" />
            <div>
              <p className="text-base font-semibold text-slate-700">
                Upload date: {formattedDate}
              </p>
            </div>
          </div>
          <button
            onClick={() => setisClamped((prev) => !prev)}
            className="pl-12 bg-gradient-to-r from-transparent via-slate-200 to-slate-200 absolute bottom-4 right-4 font-semibold text-slate-700"
          >
            {isClamped ? "...more" : "...less"}
          </button>
        </div>
        {/* Comment section */}
        <CommentSection videoId={_id} />
      </div>
      {/* right side recomended videos*/}
      <VideoListView />
    </div>
  );
};

export default VideoPage;
