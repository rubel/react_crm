import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

function SalesChannels({ toggle }) {
  return (
    <div>
      <TopBar toggle={toggle} />
      <Tabs />
      SalesChannels
    </div>
  );
}

export default SalesChannels;
