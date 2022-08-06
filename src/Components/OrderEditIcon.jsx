import React, { useState } from "react";
import { AiOutlineEye, AiOutlineFlag } from "react-icons/ai";
import { FaEdit, FaLink, FaMoneyCheckAlt, FaTrash } from "react-icons/fa";
import { MdHistoryEdu } from "react-icons/md";

export default function OrderEditIcon({
  id,
  deletePressedFunc,
  editPressedFunc,
  changeOrderStatusFunc,
  showStatusHistoriesFunc,
  assignOrderToFunc,
  showOrderInfoFunc,
  showCommessionsFunc,
}) {
  const [showMenu, setShowMenu] = useState(false);
  function toggleShowHide() {
    setShowMenu(false);

    setTimeout(() => {
      setShowMenu(true);
    }, 100);
  }
  function editPressed() {
    editPressedFunc(id);
  }
  function deletePressed() {
    deletePressedFunc(id);
  }
  function changeOrderStatus() {
    changeOrderStatusFunc(id);
  }
  function showStatusHistories() {
    showStatusHistoriesFunc(id);
  }
  function assignOrderTo() {
    assignOrderToFunc(id);
  }
  function showOrderInfo() {
    showOrderInfoFunc(id);
  }
  function showCommessions() {
    showCommessionsFunc(id);
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
        className="dottedMenuContainerOrder"
        id={"mnu_" + id}
        style={showMenu ? { display: "block" } : { display: "none" }}>
        <div className="dottedMenu_item" onClick={changeOrderStatus}>
          <div style={{ float: "left" }}>
            <AiOutlineFlag />
          </div>
          <div className="dottedMenu_itemtext">Change Status</div>
        </div>

        <div className="dottedMenu_item" onClick={showStatusHistories}>
          <div style={{ float: "left" }}>
            <MdHistoryEdu />
          </div>
          <div className="dottedMenu_itemtext">Status Histories</div>
        </div>

        <div className="dottedMenu_item" onClick={assignOrderTo}>
          <div style={{ float: "left" }}>
            <FaLink />
          </div>
          <div className="dottedMenu_itemtext">Assign To</div>
        </div>

        <div className="dottedMenu_item" onClick={editPressed}>
          <div style={{ float: "left" }}>
            <FaEdit />
          </div>
          <div className="dottedMenu_itemtext">Edit</div>
        </div>
        <div className="dottedMenu_item" onClick={showOrderInfo}>
          <div style={{ float: "left" }}>
            <AiOutlineEye />
          </div>
          <div className="dottedMenu_itemtext">View</div>
        </div>
        <div className="dottedMenu_item" onClick={deletePressed}>
          <div style={{ float: "left" }}>
            <FaTrash />
          </div>
          <div className="dottedMenu_itemtext">Delete</div>
        </div>
        <div className="dottedMenu_item" onClick={showCommessions}>
          <div style={{ float: "left" }}>
            <FaMoneyCheckAlt />
          </div>
          <div className="dottedMenu_itemtext">Commissions</div>
        </div>
      </div>
    </div>
  );
}
