import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

function Dashboard({ toggle }) {
  var loggedIn = sessionStorage.getItem("uid");

  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <Tabs />
          <div>Dashboard here</div>
        </div>
      )}

      {!loggedIn && <AccessDenied />}
    </div>
  );
}

export default Dashboard;
