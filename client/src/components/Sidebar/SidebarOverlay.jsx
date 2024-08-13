import { toggleSidebar } from "@/store/uiSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SidebarOverlay = () => {
  const dispatch = useDispatch();
  const { sidebar } = useSelector((store) => store.ui);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 576);
  };
  useEffect(() => {
    // Add event listener for resize
    window.addEventListener("resize", handleResize);
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (sidebar && window.innerWidth <= 576) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up the class when component unmounts or sidebarOpen changes
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.addEventListener;
    };
  }, [sidebar, isMobile]);

  return (
    <>
      {sidebar && (
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="max-xs:block hidden fixed opacity-35 top-0 bottom-0 left-0 right-0 h-full w-full bg-black"
        >
          sdfkjbdfksdfs
        </button>
      )}
    </>
  );
};

export default SidebarOverlay;
