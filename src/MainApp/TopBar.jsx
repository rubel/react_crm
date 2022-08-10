import React, { useEffect } from "react";
import { FaBars } from "react-icons/fa";
export default function TopBar({ toggle }) {
  function recordNavChanged() {
    let allPaths = sessionStorage.getItem("paths");
    if (allPaths == null) {
      allPaths = location.pathname;
    } else {
      allPaths += "," + location.pathname;
    }
    var pathsArray = allPaths.split(",");

    let uniqueArray = [...new Set(pathsArray)];

    if (uniqueArray.length > 8) {
      uniqueArray.shift();
    }
    sessionStorage.setItem("paths", uniqueArray.join(","));
  }
  useEffect(() => {
    return () => {
      recordNavChanged();
    };
  }, [location.pathname]);

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
