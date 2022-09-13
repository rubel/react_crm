import React, { useState } from "react";
import { FaEdit, FaWarehouse } from "react-icons/fa";

export default function TransactionsDottedIcon({ id, editTransactionPressed }) {
  const [showMenu, setShowMenu] = useState(false);
  function toggleShowHide() {
    setShowMenu(false);

    setTimeout(() => {
      setShowMenu(true);
    }, 100);
  }
  function editPressed() {
    editTransactionPressed(id);
  }
  return (
    <div>
      <button
        type="button"
        className="btn btn-secondary btn-circle btn-sm"
        style={{
          borderRadius: "50%",
          padding: "10px",
          lineHeight: "6px",
        }}
        onClick={toggleShowHide}>
        ...
      </button>

      <div
        className="dottedMenuContainer"
        id={"mnu_" + id}
        style={showMenu ? { display: "block", width: "160px" } : { display: "none" }}>
        <div
          style={{ border: "1px solid gray", padding: "4px 0px 4px 4px", height: "34px" }}
          onClick={() => {
            editPressed();
          }}>
          <div style={{ float: "left" }}>
            <FaEdit />
          </div>
          <div style={{ display: "block", float: "left", paddingLeft: "20px" }}>Edit</div>
        </div>

        <div
          style={{ border: "1px solid gray", padding: "4px 0px 4px 4px", height: "34px" }}
          onClick={() => {
            editPressed();
          }}>
          <div style={{ float: "left" }}>
            <FaWarehouse />
          </div>
          <div style={{ display: "block", float: "left", paddingLeft: "20px" }}>Return Stock</div>
        </div>
      </div>
    </div>
  );
}
