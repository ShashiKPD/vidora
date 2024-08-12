import { useEffect, useState } from "react";

const ThumbnailPreview = ({ thumbnailFile, maxSize }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  useEffect(() => {
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailUrl(reader.result);
      };
      reader.readAsDataURL(thumbnailFile);
    } else {
      setThumbnailUrl(null);
    }
  }, [thumbnailFile]);

  return (
    <div className="w-full h-full">
      <img
        src={thumbnailUrl}
        alt="thumbnail url"
        className="aspect-video w-full object-cover"
      />
      <div className="py-3">
        <p className="">{thumbnailFile.name}</p>
        <p className="text-xs text-slate-400">
          Thumbnail will be cropped to fit 16:9 aspect ratio
        </p>
        <p className="font-semibold text-sm text-slate-400">
          {thumbnailFile?.size && (thumbnailFile.size / 1024).toFixed(0)} KB
        </p>
        {thumbnailFile?.size && thumbnailFile.size > maxSize ? (
          <p className="font-semibold text-xs text-red-500">
            MAX FILE SIZE LIMIT EXCEEDED!!!
            <span className="text-[1em] block font-normal text-red-400 px-2">
              If you need to upload larger thumbnail, please contact admin to
              grant you authorization
            </span>
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ThumbnailPreview;
