import React, { useState } from "react";
import { CgVoicemailR } from "react-icons/cg";
import { GiConfirmed, GiCrossMark } from "react-icons/gi";
import { HiOutlinePhoneMissedCall } from "react-icons/hi";
import { MdCancel, MdWatchLater } from "react-icons/md";

export default function ConformationStatusMenu({ id, conformationStatusChangedFunc, currentStatus }) {
  const [showMenu, setShowMenu] = useState(false);
  function toggleShowHide() {
    setShowMenu(false);

    setTimeout(() => {
      setShowMenu(true);
    }, 100);
  }
  function conformationStatusChanged(selectedItem) {
    conformationStatusChangedFunc(id, selectedItem);
  }
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
            conformationStatusChanged("Confirmed");
          }}>
          <div style={{ float: "left" }}>
            <GiConfirmed />
          </div>
          <div className="dottedMenu_itemtext">Confirmed</div>
        </div>

        <div
          className="dottedMenu_item"
          onClick={() => {
            conformationStatusChanged("Postponed");
          }}>
          <div style={{ float: "left" }}>
            <MdWatchLater />
          </div>
          <div className="dottedMenu_itemtext">Postponed</div>
        </div>

        <div
          className="dottedMenu_item"
          onClick={() => {
            conformationStatusChanged("Cancelled");
          }}>
          <div style={{ float: "left" }}>
            <MdCancel />
          </div>
          <div className="dottedMenu_itemtext">Cancelled</div>
        </div>

        <div
          className="dottedMenu_item"
          onClick={() => {
            conformationStatusChanged("No Answer");
          }}>
          <div style={{ float: "left" }}>
            <HiOutlinePhoneMissedCall />
          </div>
          <div className="dottedMenu_itemtext">No Answer</div>
        </div>

        <div
          className="dottedMenu_item"
          onClick={() => {
            conformationStatusChanged("Voicemail");
          }}>
          <div style={{ float: "left" }}>
            <CgVoicemailR />
          </div>
          <div className="dottedMenu_itemtext">Voicemail</div>
        </div>

        <div
          className="dottedMenu_item"
          onClick={() => {
            conformationStatusChanged("Wrong Number");
          }}>
          <div style={{ float: "left" }}>
            <GiCrossMark />
          </div>
          <div className="dottedMenu_itemtext">Wrong Number</div>
        </div>
      </div>
    </div>
  );
}
