import React from "react";
import "./AppHeader.css";
import headerLogo from "../images/zen-icon.jpg";

function AppHeader() {
  return (
    <div className="header">
      <img src={headerLogo} className="header__logo" alt="zen-logo" />
      <h1 className="header__header">Calorie-Zen</h1>
    </div>
  );
}

export default AppHeader;
