import { useEffect } from "react";
import { fetchVideos } from "@/store/videoSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VideoCard } from "@/components";

const VideosCardView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videos, page, error } = useSelector((state) => state.videos);
  const authStatus = useSelector((state) => state.auth.authStatus);
  const sidebar = useSelector((state) => state.ui.sidebar);

  useEffect(() => {
    dispatch(fetchVideos());
  }, []);

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
