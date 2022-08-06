import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

function Inventory({ toggle }) {
  return (
    <div>
      <TopBar toggle={toggle} />
      <Tabs />
      Inventory
    </div>
  );
}

export default Inventory;
