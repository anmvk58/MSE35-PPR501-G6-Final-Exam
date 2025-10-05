import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Nav } from "reactstrap";
import PerfectScrollbar from "perfect-scrollbar";

import logo from "../../../assets/now-ui/img/logo.png";

var ps;

function Sidebar(props) {
  const sidebar = React.useRef();
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  return (
    <div className="sidebar" data-color={props.backgroundColor}>
      <div className="logo">
        <a
          href="#"
          className="simple-text logo-mini"
          target="_blank"
        >
          <div className="logo-img">
            <img src={logo} alt="mse35-logo" />
          </div>
        </a>
        <a
          href="#"
          className="simple-text logo-normal"
          target="_blank"
        >
          MSE35 Student Management
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {props.routes.map((prop, key) => {
            if (prop.redirect || prop.invisible) return null;
            return (
              <li
                className={
                  activeRoute(prop.path) +
                  (prop.pro ? " active active-pro" : "")
                }
                key={key}
              >
                <NavLink to={prop.path} className="nav-link">
                  <i className={"now-ui-icons " + prop.icon} />
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
