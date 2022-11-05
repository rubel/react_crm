import { Button } from "@mui/material";
import React, { useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
import { MdCancel, MdPending } from "react-icons/md";
import { SiProcesswire } from "react-icons/si";

export default function LeadvartexStatusMenu({ id, deliveryStatusChangedFunc, currentStatus }) {
  const [showMenu, setShowMenu] = useState(false);
  function toggleShowHide() {
    setShowMenu(false);

    setTimeout(() => {
      setShowMenu(true);
    }, 100);
  }
  function deliveryStatusChanged(selectedItem) {
    deliveryStatusChangedFunc(id, selectedItem);
  }
  getStyleBasedOnStatus();
  function getStyleBasedOnStatus() {
    let style = {
      float: "left",
      backgroundColor: "gray",
      borderRadious: "6px",
    };
    if (currentStatus === "processing") {
      style.backgroundColor = "royalblue";
    } else if (currentStatus === "accepted") {
      style.backgroundColor = "dodgerblue";
    } else if (currentStatus == "shipped") {
      style.backgroundColor = "forestgreen";
    } else if (currentStatus == "canceled") {
      style.backgroundColor = "lightslategray";
    } else if (currentStatus == "Cancelled") {
      style.backgroundColor = "red";
    } else if (currentStatus == "No Answer") {
      style.backgroundColor = "blueviolet";
    } else if (currentStatus == "Wrong Number") {
      style.backgroundColor = "crimson";
    } else if (currentStatus == "Processed") {
      style.backgroundColor = "forestgreen";
    } else if (currentStatus == "Pending") {
      style.backgroundColor = "blue";
    } else if (currentStatus == "Unready") {
      style.backgroundColor = "cornflowerblue";
    } else if (currentStatus == "Returned") {
      style.backgroundColor = "crimson";
    }
    return style;
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-secondary btn-circle btn-sm"
        style={getStyleBasedOnStatus()}
        onClick={toggleShowHide}>
        {currentStatus}
      </button>

      <div
        className="dottedMenuContainerOrderConformation"
        id={"mnu_" + id}
        style={showMenu ? { display: "block", zIndex: 100 } : { display: "none" }}>
        <div
          className="dottedMenu_item"
          onClick={() => {
            deliveryStatusChanged("Pending");
          }}>
          <div style={{ float: "left" }}>
            <FaArrowCircleUp />
          </div>
          <div className="dottedMenu_itemtext">Accepted</div>
        </div>
        <div
          className="dottedMenu_item"
          onClick={() => {
            deliveryStatusChanged("Cancelled");
          }}>
          <div style={{ float: "left" }}>
            <MdCancel />
          </div>
          <div className="dottedMenu_itemtext">Cancelled</div>
        </div>

        <div
          className="dottedMenu_item"
          onClick={() => {
            deliveryStatusChanged("Pending");
          }}>
          <div style={{ float: "left" }}>
            <MdPending />
          </div>
          <div className="dottedMenu_itemtext">Pending</div>
        </div>

        <div
          className="dottedMenu_item"
          onClick={() => {
            deliveryStatusChanged("Processed");
          }}>
          <div style={{ float: "left" }}>
            <SiProcesswire />
          </div>
          <div className="dottedMenu_itemtext">Processed</div>
        </div>
      </div>

      <Button type="button" variant="contained" style={{ marginLeft: "10px", height: "30px" }}>
        Save
      </Button>
    </div>
  );
}
