import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

function Agents({ toggle }) {
  return (
    <div>
      <TopBar toggle={toggle} />
      <Tabs />
      Agents
    </div>
  );
}

export default Agents;
