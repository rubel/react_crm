import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

function Inventory({ toggle }) {
  var loggedIn = sessionStorage.getItem("uid");

  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <Tabs />
          Inventory
        </div>
      )}

      {!loggedIn && <AccessDenied />}
    </div>
  );
}

export default Inventory;
