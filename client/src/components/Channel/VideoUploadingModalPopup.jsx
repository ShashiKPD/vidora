import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VideoUploadingModalPopup = ({
  videoFile,
  handleClose,
  toggleDialogueBox,
  isSubmitting,
}) => {
  // const navigate = useNavigate()
  return (
    <div className="absolute z-10 top-0 left-0 right-0 bottom-0 font-manrope">
      <div className="bg-black h-full bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded-lg max-w-[80%] md:min-w-96 sm:min-w-52 min-w-40">
          <p className="text-2xl">
            {isSubmitting ? "Uploading Video..." : "Video uploaded"}
          </p>
          <p className="text-sm leading-none">
            Track your video uploading process
          </p>

          <div className="bg-slate-200 p-3 rounded-lg mt-2 ">
            <p className="line-clamp-2 text-slate-600">{videoFile?.name}</p>
            <p className="font-semibold text-slate-500">
              {videoFile?.size && (videoFile.size / (1024 * 1024)).toFixed(1)}{" "}
              MB
            </p>
            <div className="py-2">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div>
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                  </div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div>
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <span>Uploaded Successfully</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4 text-sm">
            {isSubmitting && (
              <button
                onClick={toggleDialogueBox}
                className="py-1 w-20 rounded-md bg-slate-200 hover:bg-slate-300"
              >
                Cancel
              </button>
            )}

            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className={`${
                !isSubmitting ? "hover:bg-slate-900" : "cursor-wait"
              }  py-1 w-20 rounded-md bg-slate-700  text-white`}
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadingModalPopup;
