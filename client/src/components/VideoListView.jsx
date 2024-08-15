import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EmptyScreen,
  ErrorScreen,
  LoadingScreen,
  VideoCardHorizontal,
} from "./index";
import { fetchVideos } from "@/store/videoSlice";
import { fetchLikedVideos } from "@/store/playlistSlice";
import { getUserWatchHistory } from "@/utils/apis";

const VideoListView = ({ liked = false, history = false, playlistId }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [videos, setVideos] = useState(null);
  const { videos: fetchedVideos, lastFetched } = useSelector(
    (state) => state.videos
  );
  const { likedVideos, error } = useSelector((state) => state.playlist);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (history) return;
    if (liked && likedVideos) {
      setVideos(likedVideos);
    } else if (!liked && fetchedVideos) {
      setVideos(fetchedVideos);
    }
  }, [liked, likedVideos, fetchedVideos]);

  useEffect(() => {
    if (isFetched) return;

    if (history) {
      setIsLoading(true);
      (async () => {
        await getUserWatchHistory(accessToken)
          .then((data) => {
            if (!data) {
              return;
            }
            setVideos(data.data);
          })
          .finally(() => {
            setIsFetched(true);
            setIsLoading(false);
          });
      })();
    }

    if (liked) {
      dispatch(fetchLikedVideos());
    } else {
      dispatch(fetchVideos());
    }
    setIsFetched(true);
  }, []);

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (isLoading) return <LoadingScreen />;

  if (!videos) return <EmptyScreen subtext="No videos found" />;

  if (videos.length === 0 && history) {
    return <EmptyScreen subtext="Go watch some videos" />;
  }

  return (
    <div className="flex-col gap-0 flex flex-grow">
      {videos
        .slice()
        .reverse()
        .map(
          (video, index) => (
            // video.isPublished && (
            <VideoCardHorizontal key={video._id} video={video} index={index} />
          )
          // )
        )}
    </div>
  );
};

export default VideoListView;
