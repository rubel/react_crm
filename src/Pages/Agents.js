import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

function Agents({ toggle }) {
  var loggedIn = sessionStorage.getItem("uid");

  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <Tabs />
          Agents
        </div>
      )}
      {!loggedIn && <AccessDenied />}
    </div>
  );
}

export default Agents;
