import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

function Shipping({ toggle }) {
  var loggedIn = sessionStorage.getItem("uid");
  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <Tabs />
          Shipping
        </div>
      )}
      {!loggedIn && <AccessDenied />}
    </div>
  );
}

export default Shipping;
