import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

function Shipping({ toggle }) {
  return (
    <div>
      <TopBar toggle={toggle} />
      <Tabs />
      Shipping
    </div>
  );
}

export default Shipping;
