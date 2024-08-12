import { fetchChannelVideos } from "@/store/channelSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useParams } from "react-router-dom";
import { EmptyScreen, LoadingScreen, VideoCard, ErrorScreen } from "..";

const ChannelVideosCardView = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { videos, status, error } = useSelector((store) => store.channel);
  const { sidebar } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchChannelVideos(username));
  }, [username]);

  if (status === "loading") {
    return <LoadingScreen className={`mt-[100px]`} />;
  }

  if (error) {
    return;
  }

  if (videos && videos.length === 0) {
    return (
      <EmptyScreen
        className="mt-[100px]"
        subtext={
          <div>
            <NavLink
              to={`/channel/${username}/upload`}
              className="font-semibold underline"
            >
              Click here
            </NavLink>{" "}
            to Upload some videos
          </div>
        }
      />
    );
  }

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

export default ChannelVideosCardView;
