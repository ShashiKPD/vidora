import { useEffect, useState } from "react";

const VideoPreview = ({ videoFile, maxSize = 0 }) => {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    // Create a URL for the video file and set it as the video source
    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);
    // Cleanup function to revoke the object URL
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  return (
    <>
      <video controls src={videoUrl} className="aspect-video bg-black"></video>
      <div className="py-3 text-sm">
        <p className="line-clamp-2 ">{videoFile?.name}</p>
        <p className="font-semibold text-slate-400">
          {videoFile?.size && (videoFile.size / (1024 * 1024)).toFixed(1)} MB
        </p>

        {videoFile?.size && videoFile.size > maxSize ? (
          <p className="font-semibold text-xs text-red-500">
            MAX FILE SIZE LIMIT EXCEEDED!!!
            <span className="text-[1em] block font-normal text-red-400 px-2">
              If you need to upload larger videos, please contact admin to grant
              you authorization
            </span>
          </p>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default VideoPreview;
