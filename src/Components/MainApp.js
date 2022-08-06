import React from "react";

export default function MainApp() {
  return (
    <div>
      Dashboard
      <p>{console.log(sessionStorage.getItem("uid"))}</p>
    </div>
  );
}
