import { VideoListView } from "@/components";
import React from "react";

const HistoryPage = () => {
  return (
    <div className="flex justify-center">
      <div className="w-[95%] sm:w-[80%]">
        <p className="font-quicksand text-2xl font-semibold md:text-4xl py-6 sm:py-10 text-slate-600">
          Watch History
        </p>
        <div className=" ">
          <VideoListView history={true} />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
