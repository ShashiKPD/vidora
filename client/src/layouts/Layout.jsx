import React from "react";
import PropTypes from "prop-types";
import { Header, Footer, Sidebar } from "@/components";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function Layout() {
  const sidebar = useSelector((state) => state.ui.sidebar);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main
          className={`flex-1 p-4 ml-0 transition-margin duration-300 ease-in-out ${
            sidebar ? "xs:ml-24 md:ml-56" : "xs:ml-24 md:ml-24"
          }`}
        >
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

Layout.propTypes = {};

export default Layout;
