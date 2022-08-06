import React from "react";
import { AiFillDashboard, AiOutlineRadiusSetting } from "react-icons/ai";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaDatabase, FaListAlt, FaShippingFast, FaUserAlt, FaUserTie } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { SiSalesforce } from "react-icons/si";
import { NavLink } from "react-router-dom";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <AiFillDashboard />,
  },
  {
    path: "/users",
    name: "Users",
    icon: <FaUserAlt />,
  },
  {
    path: "/agents",
    name: "Agents",
    icon: <FaUserTie />,
  },
  {
    path: "/orders",
    name: "Orders",
    icon: <FaListAlt />,
  },
  {
    path: "/customers",
    name: "Customers",
    icon: <BsPersonLinesFill />,
  },
  {
    path: "/sales-channels",
    name: "Sales Channels",
    icon: <SiSalesforce />,
  },
  {
    path: "/shipping",
    name: "Shipping",
    icon: <FaShippingFast />,
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: <MdInventory />,
  },
  {
    path: "/supply",
    name: "Supply",
    icon: <AiOutlineRadiusSetting />,
  },
  {
    path: "/expence",
    name: "Expence",
    icon: <RiMoneyDollarBoxFill />,
  },
  {
    path: "/additional_data",
    name: "Additional Data",
    icon: <FaDatabase />,
  },
];

export default function Tabs() {
  let paths = sessionStorage.getItem("paths") == null ? "" : sessionStorage.getItem("paths");
  let tabPaths = paths.split(",");
  let allPathObjects = [];

  routes.forEach((route) => {
    if (tabPaths.indexOf(route.path) >= 0) {
      allPathObjects.push(route);
    }
  });
  return (
    <div className="tabs">
      {allPathObjects.map((tab) => (
        <NavLink to={tab.path} key={tab.path} className="tab">
          <div className="tab-icon">{tab.icon}</div>
          <span className="tab_text">{tab.name}</span>
        </NavLink>
      ))}
    </div>
  );
}
