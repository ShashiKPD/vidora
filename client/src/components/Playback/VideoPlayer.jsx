import { setVolume } from "@/store/videoSettingsSlice";
import { incrementVideoViews } from "@/utils/apis";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const VideoPlayer = (props) => {
  const { videoUrl, thumbnailUrl, duration, width, height, className } = props;
  const { videoId } = useParams();
  const { accessToken } = useSelector((state) => state.auth);
  const volume = useSelector((state) => state.videoSettings.volume);

  const dispatch = useDispatch();
  const cloudinaryRef = useRef();
  const videoRef = useRef(null);

  let hasSentIncrement = false;
  const PROGRESS_THRESHOLD = duration > 300 ? (duration > 600 ? 10 : 20) : 30;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // Set the video volume from Redux store
      videoElement.volume = volume;

      const handleVolumeChange = () => {
        dispatch(setVolume(videoElement.volume));
      };

      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("volumechange", handleVolumeChange);

      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener("volumechange", handleVolumeChange);
      };
    }
  }, [videoId]);

  const handleTimeUpdate = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const progress = (videoElement.currentTime / videoElement.duration) * 100;
      if (progress > PROGRESS_THRESHOLD && !hasSentIncrement) {
        // console.log("trying to increment views");
        hasSentIncrement = true;
        incrementVideoViews(videoId, accessToken);
      }
    }
  };

  // useEffect(() => {
  //   if (cloudinaryRef.current) return;

  //   cloudinaryRef.current = window.cloudinary;
  //   cloudinaryRef.current.videoPlayer(videoRef.current, {
  //     cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  //   });
  // }, []);

  return (
    <video
      ref={videoRef}
      src={
        "" ||
        // "https://ia601509.us.archive.org/10/items/Rick_Astley_Never_Gonna_Give_You_Up/Rick_Astley_Never_Gonna_Give_You_Up.mp4" ||
        videoUrl
      }
      controls
      poster={
        "" ||
        // "https://cdn.vox-cdn.com/thumbor/Si2spWe-6jYnWh8roDPVRV7izC4=/0x0:1192x795/1400x788/filters:focal(596x398:597x399)/cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg" ||
        thumbnailUrl
      }
      className={`aspect-video object-cover bg-black ${className}`}
    >
      Your browser does not support the video tag.
    </video>

    // <div className={`relative overflow-hidden ${className}`}>
    //   <div className="aspect-video">
    // <video
    //   ref={videoRef}
    //   data-cld-public-id="db7mrz3xqemoxvqika2n"
    //   className={`absolute inset-0 w-full h-auto object-cover`}
    //   // width={960}
    //   // height={540}
    //   controls
    //   {...props}
    // />

    // </div>
    // </div>
  );
};

export default VideoPlayer;
