import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingScreen = ({ subtext = "", className }) => {
  return (
    <div
      className={`${
        className ? className : "mt-[200px]"
      } w-full text-2xl flex flex-col justify-center items-center font-quicksand`}
    >
      <div className="flex gap-3">
        <p>Loading Content</p>
        <div className="flex items-center">
          <AiOutlineLoading3Quarters className="animate-spin" />
        </div>
      </div>
      <div className="text-base text-slate-500">{subtext}</div>
    </div>
  );
};

export default LoadingScreen;
