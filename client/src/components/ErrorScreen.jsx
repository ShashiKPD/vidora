import { NavLink } from "react-router-dom";

const ErrorScreen = ({ error = "", subtext = "", className }) => {
  return (
    <div
      className={` ${
        className ? className : "mt-[200px]"
      } w-full text-2xl text-center font-quicksand`}
    >
      <div className="text-red-500 ">Error: {error}</div>
      <div className="text-base">
        <NavLink to="/" className=" text-slate-500 underline">
          Click here
        </NavLink>{" "}
        to go to the homepage
      </div>
    </div>
  );
};

export default ErrorScreen;
