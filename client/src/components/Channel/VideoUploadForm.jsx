import { useForm } from "react-hook-form";
import { IoCloseOutline, IoCloudUpload } from "react-icons/io5";
import {
  ThumbnailPreview,
  ToggleSwitch,
  VideoPreview,
  VideoUploadingModalPopup,
} from "..";
import { FaPhotoVideo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { publishVideo } from "@/utils/apis";
import { useNavigate, useParams } from "react-router-dom";

const VideoUploadForm = () => {
  const { username } = useParams();
  const MAX_VIDEO_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const MAX_THUMBNAIL_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const [dialogueBoxVisible, setDialogueBoxVisible] = useState(false);
  const [uploadingPopup, setUploadingPopup] = useState(false);
  const [formerror, setFormerror] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoFile = watch("video");
  const thumbnailFile = watch("thumbnail");
  const titleLength = watch("title")?.trim().length || 0;
  const descriptionLength = watch("description")?.trim().length || 0;

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    if (data?.title.trim()) {
      formData.append("title", data.title.trim());
    } else {
      return setFormerror("Title cannot be empty");
    }
    if (data?.description.trim()) {
      formData.append("description", data.description.trim());
    }
    if (data.video && data.video[0]) {
      if (data.video[0].size > MAX_VIDEO_FILE_SIZE) {
        return setFormerror(
          "For now, only the Admin is allowed to upload videos of more than 50 MB size. If you need to upload larger videos, please contact admin to grant you authorization"
        );
      }
      formData.append("videoFile", data.video[0]);
    }
    if (data.thumbnail && data.thumbnail[0]) {
      if (data.thumbnail[0].size > MAX_THUMBNAIL_FILE_SIZE) {
        return setFormerror(
          "Thumbnail file size is limited to 5 MB. If you want to upload larger thumbnail images, please contact admin to grant you authorizatioon"
        );
      }
      formData.append("thumbnail", data.thumbnail[0]);
    }
    // submit form
    setIsSubmitting(true);
    toggleUploadingPopup();
    // setTimeout(() => {
    //   console.log("video Uploaded");
    //   // navigate(`/channel/${username}`)
    //   setIsSubmitting(false);
    //   setDialogueBoxVisible(false);
    // }, 5000);
    await publishVideo(formData, accessToken)
      .then((data) => {
        if (!data.success) {
          console.log(data);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setDialogueBoxVisible(false);
      });
  };
  const toggleUploadingPopup = () => {
    setUploadingPopup((prev) => !prev);
  };
  const toggleDialogueBox = () => {
    setDialogueBoxVisible((prev) => !prev);
  };
  const handleClose = () => {
    setDialogueBoxVisible(false);
    navigate(`/channel/${username}`);
  };

  return (
    <div className="bg-black bg-opacity-50 flex justify-center items-center absolute z-30 top-0 left-0 right-0 bottom-0  w-full h-full">
      <div className="bg-white min-h-[90%] max-h-[98%] overflow-y-auto lg:w-[1000px] md:w-[700px] sm:w-[550px] w-96 mx-2 rounded-3xl">
        <div className="flex py-3 pl-5 pr-3 bg-violet-50 rounded-t-3xl">
          <p className="text-3xl w-full">Video Details</p>
          {/* Close Button */}
          <button onClick={toggleDialogueBox}>
            <IoCloseOutline className="text-4xl" />
          </button>
          {/* Close Dialogue Box */}
          {dialogueBoxVisible && (
            <div className="absolute z-20 top-0 left-0 right-0 bottom-0 font-manrope">
              <div className="bg-black h-full bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg max-w-[80%]">
                  <p>Are you sure you want to exit before uploading?</p>
                  <div className="flex gap-2 mt-4 text-sm">
                    <button
                      onClick={toggleDialogueBox}
                      className="py-1 w-20 rounded-md bg-slate-700 hover:bg-slate-900 text-white"
                    >
                      Continue
                    </button>
                    <button
                      onClick={handleClose}
                      className="py-1 w-20 rounded-md bg-slate-200 hover:bg-slate-300"
                    >
                      Exit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Uploading modal popup */}
        {uploadingPopup && (
          <VideoUploadingModalPopup
            videoFile={videoFile[0]}
            handleClose={handleClose}
            toggleDialogueBox={toggleDialogueBox}
            isSubmitting={isSubmitting}
          />
        )}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-4 flex flex-col w-full font-manrope gap-3 justify-between"
        >
          <div className="flex flex-col md:flex-row gap-5 font-manrope">
            <div className="w-full h-full">
              <label
                htmlFor="title-input"
                className="text-gray-700 flex justify-between"
              >
                Title:{" "}
                <span
                  className={`${titleLength > 100 && "text-red-500"} text-sm`}
                >{`${titleLength}/100 `}</span>
              </label>
              <textarea
                id="title-input"
                placeholder="Enter your title here"
                rows="2" // Adjust the number of visible rows
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 100, // Max characters
                    message: "Maximum length is 100 characters",
                  },
                })}
                className={` ${
                  titleLength > 100
                    ? "focus:outline-red-500 outline-red-500 border-none outline-2"
                    : "border-gray-300 border"
                }  w-full resize-none overflow-auto bg-slate-100 p-2 rounded-xl`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
              <label
                htmlFor="description-input"
                className="text-gray-700 flex justify-between"
              >
                Description:{" "}
                <span
                  className={`${
                    descriptionLength > 5000 && "text-red-500"
                  } text-sm`}
                >{`${descriptionLength}/5000 `}</span>
              </label>

              <textarea
                id="description-input"
                rows="6" // Adjust the number of visible rows
                placeholder="Enter your description here"
                {...register("description", {
                  maxLength: {
                    value: 5000, // Max characters
                    message: "Maximum length is 5000 characters",
                  },
                })}
                className={` ${
                  descriptionLength > 5000
                    ? "focus:outline-red-500 outline-red-500 border-none outline-2"
                    : "border-gray-300 border"
                }  w-full resize-none overflow-auto bg-slate-100 p-2 rounded-xl`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="w-full md:w-[40%] md:min-w-56 sm:min-w-40 flex max-xs:flex-col md:flex-col gap-5">
              <div className="min-h-64 max-md:w-[50%] max-xs:w-full max-xs:min-h-full">
                <label
                  htmlFor="video-file"
                  className="flex flex-col cursor-pointer items-center justify-center border-2 pt-2 mt-1 text-center w-full h-full bg-slate-100 border-slate-300 rounded-xl"
                >
                  {videoFile && videoFile.length > 0 ? (
                    <VideoPreview
                      videoFile={videoFile[0]}
                      maxSize={MAX_VIDEO_FILE_SIZE}
                    />
                  ) : (
                    <>
                      <IoCloudUpload className="text-5xl text-slate-600" />
                      <span className="underline underline-offset-1 text-slate-700 text-sm xs:text-base">
                        Select Video to upload
                      </span>{" "}
                      <span className="block text-slate-400 pb-2 text-sm xs:text-base">
                        MP4, OGG, WEBM
                      </span>
                    </>
                  )}
                </label>
                <input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  {...register("video", {
                    required: "Video is required",
                  })}
                  className="hidden"
                />
                {errors.video && (
                  <p className="text-red-500 text-sm">{errors.video.message}</p>
                )}
              </div>
              <div className="min-h-64 max-md:w-[50%] max-xs:w-full max-xs:min-h-full">
                <label
                  htmlFor="thumbnail-image"
                  className="flex flex-col items-center justify-center border-2 pt-2 mt-1 text-center w-full h-full bg-slate-100 border-slate-300 rounded-xl"
                >
                  {thumbnailFile && thumbnailFile.length > 0 ? (
                    <ThumbnailPreview
                      thumbnailFile={thumbnailFile[0]}
                      maxSize={MAX_THUMBNAIL_FILE_SIZE}
                    />
                  ) : (
                    <>
                      <FaPhotoVideo className="text-5xl text-slate-600" />
                      <span className="underline underline-offset-1 text-slate-700 text-sm xs:text-base">
                        Click to upload thumbnail
                      </span>{" "}
                      <p className="text-slate-400 pb-2 text-sm xs:text-base">
                        Preferred aspect ratio 16:9
                        <span className="block">PNG, JPG, JPEG</span>
                      </p>
                    </>
                  )}
                </label>
                {/* The below file input element is hidden using css */}
                <input
                  id="thumbnail-image"
                  type="file"
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  {...register("thumbnail", {
                    required: "Thumbnail image is required",
                  })}
                  className={`${errors.image ? "border-red-500 mb-1" : "mb-4"}
                py-2 mt-3 hidden bg-slate-200 w-full rounded-xl`}
                />
                {errors.thumbnail && (
                  <p className="text-red-500 text-sm">
                    {errors.thumbnail.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-4 py-2 w-full bg-slate-800 rounded-xl text-white self-baseline"
          >
            Submit
          </button>
        </form>
        <div className="w-full flex justify-center text-center">
          {formerror && (
            <div className="w-96 bg-red-100 text-wrap rounded-md">
              <p className="text-red-500 text-base font-semibold">
                {formerror}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUploadForm;
