import {
  ChannelDetails,
  ChannelVideosCardView,
  VideoUploadForm,
} from "@/components";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

const ChannelPage = () => {
  const sidebar = useSelector((store) => store.ui.sidebar);
  const { username } = useParams();
  const { userData } = useSelector((store) => store.auth);
  const location = useLocation();
  const locationPath = location.pathname;
  const uploadVideo = locationPath.endsWith("/upload");

  useEffect(() => {
    // Scroll to the top of the page on mount
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="w-full px-2 sm:px-3 flex justify-center">
      {/* {Upload video} */}
      {uploadVideo && username === userData.username && <VideoUploadForm />}
      <div
        className={`${
          sidebar
            ? "lg:max-w-[768px] xl:max-w-[1100px]"
            : "lg:max-w-[1000px] xl:max-w-[1200px]"
        }  flex flex-col gap-3 items-center`}
      >
        <ChannelDetails />
        <ChannelVideosCardView />
      </div>
    </div>
  );
};

export default ChannelPage;
