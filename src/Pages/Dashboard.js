import React from "react";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

function Dashboard({ toggle }) {
  return (
    <div>
      <TopBar toggle={toggle} />
      <Tabs />
    </div>
  );
}

export default Dashboard;
