import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { GoHome, GoHomeFill } from "react-icons/go";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const sidebar = useSelector((state) => state.ui.sidebar);
  const location = useLocation().pathname;

  // const [sidebar, setsidebar] = useState(null);

  // useEffect(() => {
  //   if (sidebar === null) {
  //     setsidebar(false);
  //   } else {
  //     setsidebar(sidebarState);
  //   }
  // }, [sidebarState]);

  return (
    <div
      className={`fixed left-0 top-16 min-h-[calc(100vh-66px)] xs:block xs:min-w-20 sm:min-w-20 min-w-56 shrink-0  ${
        sidebar ? "block  md:min-w-56" : "hidden "
      }  bg-slate-100`}
    >
      <ul className="p-2 flex flex-col gap-1">
        <li>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `flex p-2 rounded-lg ${
                isActive
                  ? "bg-slate-300 hover:bg-slate-400"
                  : "hover:bg-slate-300"
              }    ${sidebar ? "xs:flex-col md:flex-row" : "flex-col"} `
            }
          >
            <span
              className={`inline-block text-center  ${
                sidebar && " sm:mr-0 md:mr-2"
              }`}
            >
              <GoHome
                className={`text-3xl ${location === "/" ? "hidden" : "inline"}`}
              />
              <GoHomeFill
                className={`text-3xl  ${
                  location === "/" ? "inline" : "hidden"
                }`}
              />
            </span>
            <span
              className={`block text-center ${
                sidebar ? "xs:text-xs md:text-base" : "xs:text-xs md:text-xs"
              }`}
            >
              Home
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/liked-videos"}
            className={({ isActive }) =>
              `flex p-2 rounded-lg ${
                isActive
                  ? "bg-slate-300 hover:bg-slate-400"
                  : "hover:bg-slate-300"
              }    ${sidebar ? "xs:flex-col md:flex-row" : "flex-col"}`
            }
          >
            <span
              className={`inline-block text-center ${sidebar && "md:mr-2"}`}
            >
              <AiOutlineLike
                className={`text-3xl ${
                  location === "/liked-videos" ? "hidden" : "inline"
                }`}
              />
              <AiFillLike
                className={`text-3xl  ${
                  location === "/liked-videos" ? "inline" : "hidden"
                }`}
              />
            </span>
            <span
              className={`block text-center ${
                sidebar ? "xs:text-xs md:text-base" : "xs:text-xs md:text-xs"
              }`}
            >
              Liked Videos
            </span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
