import React, { useState } from "react";
import { HiOutlinePhoneMissedCall } from "react-icons/hi";
import { MdCancel, MdPending, MdWatchLater } from "react-icons/md";
import { SiProcesswire } from "react-icons/si";
import { TbNoteOff, TbTruckReturn } from "react-icons/tb";

export default function DeliveryStatusMenu({ id, deliveryStatusChangedFunc, currentStatus }) {
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
    if (currentStatus == "New") {
      style.backgroundColor = "royalblue";
    } else if (currentStatus == "Voicemail") {
      style.backgroundColor = "dodgerblue";
    } else if (currentStatus == "Confirmed") {
      style.backgroundColor = "forestgreen";
    } else if (currentStatus == "Postponed") {
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
        style={showMenu ? { display: "block" } : { display: "none" }}>
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
            deliveryStatusChanged("No Answer");
          }}>
          <div style={{ float: "left" }}>
            <HiOutlinePhoneMissedCall />
          </div>
          <div className="dottedMenu_itemtext">No Answer</div>
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
            deliveryStatusChanged("Postponed");
          }}>
          <div style={{ float: "left" }}>
            <MdWatchLater />
          </div>
          <div className="dottedMenu_itemtext">Postponed</div>
        </div>

        <div
          className="dottedMenu_item"
          onClick={() => {
            deliveryStatusChanged("Unready");
          }}>
          <div style={{ float: "left" }}>
            <TbNoteOff />
          </div>
          <div className="dottedMenu_itemtext">Unready</div>
        </div>
        <div
          className="dottedMenu_item"
          onClick={() => {
            deliveryStatusChanged("Returned");
          }}>
          <div style={{ float: "left" }}>
            <TbTruckReturn />
          </div>
          <div className="dottedMenu_itemtext">Returned</div>
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
    </div>
  );
}
