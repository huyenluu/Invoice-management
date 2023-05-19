import React, { Fragment, useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import logo from "../../assets/logo.svg";
import moonIcon from "../../assets/icon-moon.svg";
import sunIcon from "../../assets/icon-sun.svg";
import logoutIcon from "../../assets/icon-logout.svg";
import avatar from "../../assets/image-avatar.jpg";

const MenuBar = () => {
  const theme = localStorage.getItem("isDarkMode");
  const { isLoggedIn, logout } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState(theme === "true");

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const toggleDarkMode = () => {
    const element = document.body;
    element.classList.toggle("dark-mode");
    localStorage.setItem("isDarkMode", JSON.stringify(!isDarkMode));
    setIsDarkMode(!isDarkMode);
  };
  return (
    <Fragment>
      <div className="menu-bar-container">
        <Link className="menu-bar-logo" to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <div className="menu-bar-icon-container">
          <div className="menu-bar-icon">
            <img
              src={isDarkMode ? sunIcon : moonIcon}
              alt="Dark mode icon"
              onClick={toggleDarkMode}
            />
            <span className="menu-bar-description">
              {isDarkMode ? "Light mode" : "Dark Mode"}
            </span>
          </div>
          {isLoggedIn && (
            <div className="menu-bar-icon">
              <img src={logoutIcon} onClick={handleLogout} alt="Log out icon" />
              <span className="menu-bar-description">Log out</span>
            </div>
          )}
          <div className="menu-bar-line"></div>
          <div className="menu-bar-icon mt-24">
            <img src={avatar} className="profile-pic" alt="Avatar Icon" />
            {/* <span className="menu-bar-description">{currentUser && currentUser.displayName? `hello, ${currentUser.displayName}!` : 'Profile'}</span> */}
          </div>
        </div>
      </div>
      <div className="main-display-container">
        <Outlet />
      </div>
    </Fragment>
  );
};

export default MenuBar;
