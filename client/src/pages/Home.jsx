import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import { fetchVideos } from "@/store/videoSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videos, page, error } = useSelector((state) => state.videos);
  const authStatus = useSelector((state) => state.auth.authStatus);

  useEffect(() => {
    if (!authStatus) {
      navigate("/login");
    }
    dispatch(fetchVideos());
  }, [authStatus]);

  return (
    <>
      {!authStatus ? (
        <div className="text-3xl m-8">User not authorized</div>
      ) : (
        <div className="flex justify-between">
          <Sidebar />
          <div className="flex mt-10 mx-auto px-6">
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-3 gap-y-8">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
