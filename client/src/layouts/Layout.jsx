import React, { useEffect } from "react";
import { Header, Footer, Sidebar } from "@/components";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Layout() {
  const sidebar = useSelector((state) => state.ui.sidebar);
  const authStatus = useSelector((state) => state.auth.authStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStatus) {
      navigate("/login");
    }
  }, [authStatus]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* <div className="flex flex-1"> */}
      <Sidebar />
      <main
        className={`flex-1 p-1 ml-0 transition-margin duration-300 ease-in-out ${
          sidebar ? "xs:ml-24 md:ml-56" : "md:ml-24"
        }`}
      >
        <Outlet />
      </main>
      {/* </div> */}
      <Footer />
    </div>
  );
}

Layout.propTypes = {};

export default Layout;
