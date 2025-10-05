/*!
=========================================================
* MSE35 Student Management - Now UI Dashboard Integration
=========================================================
* Based on Now UI Dashboard React - v1.5.2
* Adapted for MSE35 Student Management System
=========================================================
*/
import React from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Outlet, useLocation } from "react-router-dom";

// Now UI components
import DemoNavbar from "../components/now-ui/Navbars/DemoNavbar.jsx";
import Footer from "../components/now-ui/Footer/Footer.jsx";
import Sidebar from "../components/now-ui/Sidebar/Sidebar.jsx";

// MSE35 routes configuration
import { mse35Routes } from "../routes/mse35-routes.jsx";

var ps;

function AdminLayout(props) {
  const location = useLocation();
  const mainPanel = React.useRef();
  
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  });

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
  }, [location]);

  return (
    <div className="wrapper">
      <Sidebar {...props} routes={mse35Routes} backgroundColor="blue" />
      <div className="main-panel" ref={mainPanel}>
        <DemoNavbar {...props} />
        <div className="panel-header panel-header-sm">
        </div>
        <div className="content">
          <Outlet />
        </div>
        <Footer fluid />
      </div>
    </div>
  );
}

export default AdminLayout;