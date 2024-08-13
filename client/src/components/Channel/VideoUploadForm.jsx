import { useForm } from "react-hook-form";
import { IoCloseOutline, IoCloudUpload } from "react-icons/io5";
import { ThumbnailPreview, ToggleSwitch, VideoPreview } from "..";
import { FaPhotoVideo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { publishVideo } from "@/utils/apis";
import { useNavigate, useParams } from "react-router-dom";

const VideoUploadForm = () => {
  const { username } = useParams();
  const MAX_VIDEO_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const MAX_THUMBNAIL_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
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
    await publishVideo(formData, accessToken)
      .then((data) => {
        if (!data.success) {
          console.log(data);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="bg-black bg-opacity-50 flex justify-center items-center absolute z-30 top-0 left-0 right-0 bottom-0  w-full h-full">
      <div className="bg-white min-h-[90%] max-h-[98%] overflow-y-auto lg:w-[1000px] md:w-[700px] sm:w-[550px] w-96 mx-2 rounded-3xl">
        <div className="flex py-3 pl-5 pr-3 bg-violet-50 rounded-t-3xl">
          <p className="text-3xl w-full">Video Details</p>
          <button onClick={() => navigate(`/channel/${username}`)}>
            <IoCloseOutline className="text-4xl" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-4 flex flex-col w-full font-manrope gap-3 justify-between"
        >
          <div className="flex flex-col md:flex-row gap-5 font-manrope">
            <div className="w-full h-full">
              <label htmlFor="title-input" className="block text-gray-700">
                Title:
              </label>
              <textarea
                id="title-input"
                // value={description}
                // onChange={handleChange}
                rows="2" // Adjust the number of visible rows
                {...register("title", { required: "Title is required" })}
                className="w-full border bg-slate-100 border-gray-300 p-2 rounded"
                placeholder="Enter your title here"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
              <label
                htmlFor="description-input"
                className="block text-gray-700"
              >
                Description:
              </label>

              <textarea
                id="description-input"
                // value={description}
                // onChange={handleChange}
                rows="5" // Adjust the number of visible rows
                {...register("description", {})}
                className="w-full border border-gray-300 p-2 bg-slate-100 rounded-xl"
                placeholder="Enter your description here"
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
