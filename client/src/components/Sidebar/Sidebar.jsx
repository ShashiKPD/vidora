import { toggleSidebar } from "@/store/uiSlice";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { PiDevToLogoFill, PiDevToLogoLight } from "react-icons/pi";
import { LuHistory } from "react-icons/lu";

import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { BiVideo, BiSolidVideo } from "react-icons/bi";

const Sidebar = () => {
  const sidebar = useSelector((state) => state.ui.sidebar);
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const locationPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const listId = queryParams.get("list") || "";
  const onLikedVideosPage =
    locationPath.startsWith("/playlist") && listId === "LL";

  const handleSidebarLinkClick = () => {
    if (window.innerWidth < 475) {
      dispatch(toggleSidebar());
    }
  };
  return (
    <div
      className={`fixed left-0 transition-all duration-300 ease z-30 top-16 font-manrope min-h-[calc(100vh-66px)] md:block xs:min-w-20 sm:min-w-20 min-w-56 shrink-0  ${
        sidebar
          ? "block  md:min-w-56  md:translate-x-0"
          : "-translate-x-full md:translate-x-0"
      }  bg-slate-100`}
    >
      <div className="flex flex-col justify-between h-[calc(100vh-66px)] ">
        <ul className="p-2 flex flex-col gap-1">
          <li>
            <NavLink
              to={"/"}
              onClick={handleSidebarLinkClick}
              className={({ isActive }) =>
                `flex p-2 rounded-lg ${
                  isActive
                    ? "bg-slate-300 hover:bg-slate-400"
                    : "hover:bg-slate-300"
                }    ${sidebar ? "xs:flex-col md:flex-row" : "xs:flex-col"} `
              }
            >
              <span
                className={`inline-block text-center  ${
                  sidebar && " sm:mr-0 md:mr-2"
                }`}
              >
                <GoHome
                  className={`text-3xl ${
                    locationPath === "/" ? "hidden" : "inline"
                  }`}
                />
                <GoHomeFill
                  className={`text-3xl  ${
                    locationPath === "/" ? "inline" : "hidden"
                  }`}
                />
              </span>
              <span
                className={` justify-center flex items-center max-xs:ml-2 ${
                  sidebar ? "xs:text-xs md:text-base" : "xs:text-xs md:text-xs"
                }`}
              >
                Home
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/playlist?list=LL"}
              onClick={handleSidebarLinkClick}
              className={({ isActive }) =>
                `flex p-2 rounded-lg ${
                  isActive
                    ? "bg-slate-300 hover:bg-slate-400"
                    : "hover:bg-slate-300"
                }    ${sidebar ? "xs:flex-col md:flex-row" : "xs:flex-col"} `
              }
            >
              <span
                className={`inline-block text-center ${sidebar && "md:mr-2"}`}
              >
                <AiOutlineLike
                  className={`text-3xl ${
                    onLikedVideosPage ? "hidden" : "inline"
                  }`}
                />
                <AiFillLike
                  className={`text-3xl  ${
                    onLikedVideosPage ? "inline" : "hidden"
                  }`}
                />
              </span>
              <span
                className={`flex items-center justify-center max-xs:ml-2 ${
                  sidebar ? "xs:text-xs md:text-base" : "xs:text-xs md:text-xs"
                }`}
              >
                Liked Videos
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/history"}
              onClick={handleSidebarLinkClick}
              className={({ isActive }) =>
                `flex p-2 rounded-lg ${
                  isActive
                    ? "bg-slate-300 hover:bg-slate-400"
                    : "hover:bg-slate-300"
                }    ${sidebar ? "xs:flex-col md:flex-row" : "xs:flex-col"}`
              }
            >
              <span
                className={`inline-block text-center ${sidebar && "md:mr-2"}`}
              >
                <LuHistory className="text-3xl inline" />
              </span>
              <span
                className={`flex items-center justify-center max-xs:ml-2 ${
                  sidebar ? "xs:text-xs md:text-base" : "xs:text-xs md:text-xs"
                }`}
              >
                History
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/channel/${userData?.username}`}
              onClick={handleSidebarLinkClick}
              className={({ isActive }) =>
                `flex p-2 rounded-lg ${
                  isActive
                    ? "bg-slate-300 hover:bg-slate-400"
                    : "hover:bg-slate-300"
                }    ${sidebar ? "xs:flex-col md:flex-row" : "xs:flex-col"} `
              }
            >
              <span
                className={`inline-block text-center ${sidebar && "md:mr-2"}`}
              >
                <BiVideo
                  className={`text-3xl ${
                    locationPath.startsWith(`/channel/${userData?.username}`)
                      ? "hidden"
                      : "inline"
                  }`}
                />
                <BiSolidVideo
                  className={`text-3xl  ${
                    locationPath.startsWith(`/channel/${userData?.username}`)
                      ? "inline"
                      : "hidden"
                  }`}
                />
              </span>
              <span
                className={`flex items-center justify-center max-xs:ml-2 ${
                  sidebar ? "xs:text-xs md:text-base" : "xs:text-xs md:text-xs"
                }`}
              >
                My Content
              </span>
            </NavLink>
          </li>
        </ul>
        <ul className="p-2 flex flex-col gap-1">
          <li>
            <NavLink
              to={"/developer"}
              onClick={handleSidebarLinkClick}
              className={({ isActive }) =>
                `flex p-2 rounded-lg ${
                  isActive
                    ? "bg-slate-300 hover:bg-slate-400"
                    : "hover:bg-slate-300"
                }    ${sidebar ? "xs:flex-col md:flex-row" : "xs:flex-col"} `
              }
            >
              <span
                className={`inline-block text-center  ${
                  sidebar && " sm:mr-0 md:mr-2"
                }`}
              >
                <PiDevToLogoLight
                  className={`text-3xl ${
                    locationPath === "/developer" ? "hidden" : "inline"
                  }`}
                />
                <PiDevToLogoFill
                  className={`text-3xl  ${
                    locationPath === "/developer" ? "inline" : "hidden"
                  }`}
                />
              </span>
              <span
                className={` justify-center flex items-center max-xs:ml-2 ${
                  sidebar ? "xs:text-xs md:text-base" : "xs:text-xs md:text-xs"
                }`}
              >
                Developer
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/settings"}
              onClick={handleSidebarLinkClick}
              className={({ isActive }) =>
                `flex p-2 rounded-lg ${
                  isActive
                    ? "bg-slate-300 hover:bg-slate-400"
                    : "hover:bg-slate-300"
                }    ${sidebar ? "xs:flex-col md:flex-row" : "xs:flex-col"} `
              }
            >
              <span
                className={`inline-block text-center  ${
                  sidebar && " sm:mr-0 md:mr-2"
                }`}
              >
                <IoSettingsOutline
                  className={`text-3xl ${
                    locationPath === "/settings" ? "hidden" : "inline"
                  }`}
                />
                <IoSettingsSharp
                  className={`text-3xl  ${
                    locationPath === "/settings" ? "inline" : "hidden"
                  }`}
                />
              </span>
              <span
                className={` justify-center flex items-center max-xs:ml-2 ${
                  sidebar ? "xs:text-xs md:text-base" : "xs:text-xs md:text-xs"
                }`}
              >
                Settings
              </span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
