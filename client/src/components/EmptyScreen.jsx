import React from "react";

const EmptyScreen = ({ subtext = "", className }) => {
  return (
    <div
      className={` ${
        className ? className : "mt-[200px]"
      } w-full text-2xl text-center font-quicksand`}
    >
      WOW! So Empty...
      <div className="text-base text-slate-500">{subtext}</div>
    </div>
  );
};

export default EmptyScreen;
