import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

function SalesChannels({ toggle }) {
  var loggedIn = sessionStorage.getItem("uid");

  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <Tabs />
          SalesChannels
        </div>
      )}
      {!loggedIn && <AccessDenied />}
    </div>
  );
}

export default SalesChannels;
