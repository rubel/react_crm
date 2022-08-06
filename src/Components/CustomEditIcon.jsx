import React, { useState } from "react";
import { BiMoney } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaCity, FaEdit, FaTrash } from "react-icons/fa";
import { RiStockLine } from "react-icons/ri";

export default function CustomEditIcon({
  id,
  deletePressedFunc,
  editPressedFunc,
  showProfileFunc,
  citiesPressedFunc,
  stockPressedFunc,
  commissionsPressedFunc,
  userType,
}) {
  const [showMenu, setShowMenu] = useState(false);
  function toggleShowHide() {
    setShowMenu(false);

    setTimeout(() => {
      setShowMenu(true);
    }, 100);
  }
  function editProduct() {
    editPressedFunc(id);
  }
  function deleteProduct() {
    deletePressedFunc(id);
  }
  function showProfile() {
    showProfileFunc(id);
  }
  function citiesPressed() {
    citiesPressedFunc(id);
  }
  function stockPressed() {
    stockPressedFunc(id);
  }
  function commissionsPressed() {
    commissionsPressedFunc(id);
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
        className={userType == "agent" || userType == "deliverer" ? "dottedMenuContainer_wide" : "dottedMenuContainer"}
        id={"mnu_" + id}
        style={showMenu ? { display: "block" } : { display: "none" }}>
        <div
          style={{ border: "1px solid gray", padding: "4px 0px 4px 4px", height: "34px" }}
          onClick={() => {
            editProduct();
          }}>
          <div style={{ float: "left" }}>
            <FaEdit />
          </div>
          <div style={{ display: "block", float: "left", paddingLeft: "13px" }}>Edit</div>
        </div>
        <div
          style={{ border: "1px solid gray", padding: "4px 0px 4px 4px", height: "34px" }}
          onClick={() => {
            deleteProduct();
          }}>
          <div style={{ float: "left" }}>
            <FaTrash />
          </div>
          <div style={{ display: "block", float: "left", paddingLeft: "13px" }}>Delete</div>
        </div>

        {userType == "agent" && (
          <div
            style={{ border: "1px solid gray", padding: "4px 0px 4px 4px", height: "34px" }}
            onClick={() => {
              showProfile();
            }}>
            <div style={{ float: "left" }}>
              <CgProfile />
            </div>
            <div style={{ display: "block", float: "left", paddingLeft: "13px" }}>Profile</div>
          </div>
        )}

        {userType == "deliverer" && (
          <div
            style={{ border: "1px solid gray", padding: "4px 0px 4px 4px", height: "34px" }}
            onClick={() => {
              citiesPressed();
            }}>
            <div style={{ float: "left" }}>
              <FaCity />
            </div>
            <div style={{ display: "block", float: "left", paddingLeft: "13px" }}>Cities</div>
          </div>
        )}

        {userType == "deliverer" && (
          <div
            style={{ border: "1px solid gray", padding: "4px 0px 4px 4px", height: "34px" }}
            onClick={() => {
              stockPressed();
            }}>
            <div style={{ float: "left" }}>
              <RiStockLine />
            </div>
            <div style={{ display: "block", float: "left", paddingLeft: "13px" }}>Stock</div>
          </div>
        )}

        {userType == "deliverer" && (
          <div
            style={{ border: "1px solid gray", padding: "4px 0px 4px 4px", height: "34px" }}
            onClick={() => {
              commissionsPressed();
            }}>
            <div style={{ float: "left" }}>
              <BiMoney />
            </div>
            <div style={{ display: "block", float: "left", paddingLeft: "13px" }}>Commissions</div>
          </div>
        )}
      </div>
    </div>
  );
}
