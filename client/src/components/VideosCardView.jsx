import { useEffect } from "react";
import { fetchVideos } from "@/store/videoSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EmptyScreen, LoadingScreen, VideoCard } from "@/components";

const VIDEO_REFRESH_INTERVAL = 1 * 30 * 1000; // 30 seconds in milliseconds

const VideosCardView = () => {
  const dispatch = useDispatch();
  const { videos, status, lastFetched } = useSelector((state) => state.videos);
  const sidebar = useSelector((state) => state.ui.sidebar);

  useEffect(() => {
    const now = Date.now();

    if (
      videos.length === 0 ||
      !lastFetched ||
      now - lastFetched > VIDEO_REFRESH_INTERVAL
    ) {
      dispatch(fetchVideos());
    }
  }, []);

  if (status === "loading") return <LoadingScreen className={"mt-[300px]"} />;

  if (videos && videos.length === 0)
    return <EmptyScreen subtext="No videos found" className={"mt-[300px]"} />;

  return (
    <div className="flex justify-center">
      <div
        className={`grid ${
          sidebar ? "xl:grid-cols-3" : "xl:grid-cols-4"
        } lg:grid-cols-3 sm:grid-cols-2 gap-3 gap-y-8`}
      >
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideosCardView;
