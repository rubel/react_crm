import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { AiFillDashboard, AiOutlineLogout, AiOutlineRadiusSetting } from "react-icons/ai";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaDatabase, FaListAlt, FaShippingFast, FaUserAlt, FaUserTie } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { SiSalesforce } from "react-icons/si";
import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";
import Login from "../Components/Login";
import SidebarMenu from "./SidebarMenu";

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
    subroutes: [
      { path: "/shipping/deliverers", name: "Deliverers", icon: <FaShippingFast /> },
      { path: "/shipping/companies", name: "Companies", icon: <FaShippingFast /> },
    ],
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: <MdInventory />,
    subroutes: [
      { path: "/inventory/products", name: "Products", icon: <FaShippingFast /> },
      { path: "/inventory/warehouses", name: "Warehouses", icon: <FaShippingFast /> },
    ],
  },
  {
    path: "/supply",
    name: "Supply",
    icon: <AiOutlineRadiusSetting />,
    subroutes: [
      { path: "/supply/suppliers", name: "Suppliers", icon: <FaShippingFast /> },
      { path: "/supply/transactions", name: "Transactions", icon: <FaShippingFast /> },
    ],
  },
  {
    path: "/expense",
    name: "Expense",
    icon: <RiMoneyDollarBoxFill />,
    subroutes: [
      { path: "/expense/business_expence", name: "Business Expence", icon: <FaShippingFast /> },
      { path: "/expense/team_expence", name: "Team Expence", icon: <FaShippingFast /> },
    ],
  },
  {
    path: "/additional_data",
    name: "Additional Data",
    icon: <FaDatabase />,
  },
];

const navAnimation = {
  hidden: {
    alpha: 0,
    width: 0,
    transition: {
      duration: 0.5,
    },
  },
  show: {
    alpha: 1,
    width: "auto",
    transition: {
      duration: 0.5,
    },
  },
};
const SideBar = ({ children, sidebarIsOpen, setSidebarIsOpen }) => {
  let history = useNavigate();

  function logoutHandler() {
    console.log("logout");
    sessionStorage.removeItem("uid");
    history("/");
  }
  useEffect(() => {
    console.log("recording...");
    recordNavChanged();
  });

  function recordNavChanged() {
    let allPaths = sessionStorage.getItem("paths");
    if (allPaths == null) {
      allPaths = location.pathname;
    } else {
      allPaths += "," + location.pathname;
    }
    var pathsArray = allPaths.split(",");

    let uniqueArray = [...new Set(pathsArray)];

    if (uniqueArray.length > 8) {
      uniqueArray.shift();
    }
    sessionStorage.setItem("paths", uniqueArray.join(","));
  }

  var loggedIn = sessionStorage.getItem("uid");
  if (!loggedIn) {
    return <Login />;
  }

  return (
    <div className="main-container" style={loggedIn ? { display: "flex" } : { display: "block" }}>
      <motion.div
        animate={{
          width: sidebarIsOpen ? "240px" : "56px",
          transition: { duration: 0.5 },
        }}
        className="sidebar"
        style={loggedIn ? { display: "block" } : { display: "none" }}>
        <div className="top_section">
          <AnimatePresence>
            {sidebarIsOpen && (
              <motion.h1 variants={navAnimation} initial="hidden" animate="show" exit="hidden" className="logo">
                CRM
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        <section className="routes">
          {routes.map((route, index) => {
            if (route.subroutes) {
              return (
                <SidebarMenu
                  route={route}
                  key={route.name}
                  sidebarIsOpen={sidebarIsOpen}
                  setSidebarIsOpen={setSidebarIsOpen}
                  navAnimation={navAnimation}
                />
              );
            }
            return (
              <NavLink to={route.path} key={index} className="link">
                <div className="icon">{route.icon}</div>
                <AnimatePresence>
                  <motion.div
                    variants={navAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="link_text">
                    {route.name}
                  </motion.div>
                </AnimatePresence>
              </NavLink>
            );
          })}

          <NavLink to={""} onClick={logoutHandler} className="link">
            <div className="icon">
              <AiOutlineLogout />
            </div>
            <AnimatePresence>
              <motion.div variants={navAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                Logout
              </motion.div>
            </AnimatePresence>
          </NavLink>
        </section>
      </motion.div>
      <main>{children}</main>
    </div>
  );
};

export default SideBar;
