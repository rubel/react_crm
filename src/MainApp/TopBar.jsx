import React from "react";
import { FaBars } from "react-icons/fa";
export default function TopBar({ toggle }) {
  return (
    <div className="top-bar">
      <div className="bars" onClick={toggle}>
        <FaBars style={{ verticalAlign: "top" }} />
      </div>
      <div className="path">{location.pathname}</div>
      <div className="topbar-right">{sessionStorage.getItem("uid")}</div>
    </div>
  );
}
