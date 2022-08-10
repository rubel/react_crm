import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

function Supply({ toggle }) {
  var loggedIn = sessionStorage.getItem("uid");

  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <Tabs />
          Supply
        </div>
      )}

      {!loggedIn && <AccessDenied />}
    </div>
  );
}
<TopBar />;

export default Supply;
<TopBar />;
