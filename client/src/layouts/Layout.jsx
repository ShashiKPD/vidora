import React from "react";
import PropTypes from "prop-types";
import { Header, Footer } from "@/components";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <Outlet />
      {/* <div className="container flex-1 py-10"></div> */}

      <Footer />
    </div>
  );
}

Layout.propTypes = {};

export default Layout;
