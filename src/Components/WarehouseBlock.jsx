import React from "react";
import { BiMoney } from "react-icons/bi";
import { MdLocationPin } from "react-icons/md";
import WarehouseDottedIcon from "./WarehouseDottedIcon";

function WarehouseBlock({ title, city, balance, id, deletePressedFunc, editPressedFunc }) {
  function getIconFromName() {
    const firstLetters = title
      .split(" ")
      .map((word) => word[0])
      .join("");

    return firstLetters.toUpperCase();
  }
  function getRandomColorStyle() {
    let colors = [
      { backgroundColor: "red" },
      { backgroundColor: "darkpink" },
      { backgroundColor: "purple" },
      { backgroundColor: "lightblue" },
      { backgroundColor: "green" },
      { backgroundColor: "blue" },
      { backgroundColor: "lightgreen" },
      { backgroundColor: "blueviolet" },
      { backgroundColor: "brown" },
      { backgroundColor: "darkblue" },
      { backgroundColor: "darkcyan" },
      { backgroundColor: "darkmagenta" },
      { backgroundColor: "darkgreen" },
      { backgroundColor: "darkred" },
    ];

    var new_color = colors[Math.floor(Math.random() * colors.length)];
    return new_color;
  }

  return (
    <div className="warehouseBlock">
      <div className="warehouse_name_icon" style={getRandomColorStyle()}>
        {getIconFromName()}
      </div>
      <div>{title}</div>
      <div style={{ float: "left" }}>
        <MdLocationPin />
        {city}
      </div>
      <div style={{ float: "left", marginLeft: "10px" }}>
        <BiMoney />
        {balance}
      </div>
      <div style={{ float: "right" }}>
        <WarehouseDottedIcon id={id} deletePressedFunc={deletePressedFunc} editPressedFunc={editPressedFunc} />
      </div>
    </div>
  );
}

export default WarehouseBlock;
