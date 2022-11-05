import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { AiFillDashboard, AiOutlineRadiusSetting } from "react-icons/ai";
import { BsPersonLinesFill } from "react-icons/bs";
import {
  FaDatabase,
  FaListAlt,
  FaProductHunt,
  FaShippingFast,
  FaUserAlt,
  FaUserTie,
  // eslint-disable-next-line prettier/prettier
  FaWarehouse
} from "react-icons/fa";
import { GiPayMoney, GiTakeMyMoney } from "react-icons/gi";
import { MdInventory } from "react-icons/md";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { SiSalesforce } from "react-icons/si";
import { VscPerson } from "react-icons/vsc";
import { NavLink } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
const routes = [
  {
    path: "/dashboard",
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
    subRoutes: [
      { path: "/shipping/deliverers", name: "Deliverers", icon: <FaShippingFast /> },
      { path: "/shipping/companies", name: "Companies", icon: <FaShippingFast /> },
    ],
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: <MdInventory />,
    subRoutes: [
      { path: "/inventory/products", name: "Products", icon: <FaProductHunt /> },
      { path: "/inventory/warehouses", name: "Warehouses", icon: <FaWarehouse /> },
    ],
  },
  {
    path: "/supply",
    name: "Supply",
    icon: <AiOutlineRadiusSetting />,
    subRoutes: [
      { path: "/supply/suppliers", name: "Suppliers", icon: <VscPerson /> },
      { path: "/supply/transactions", name: "Transactions", icon: <FaShippingFast /> },
    ],
  },
  {
    path: "/expense",
    name: "Expense",
    icon: <RiMoneyDollarBoxFill />,
    subRoutes: [
      { path: "/expense/business_expence", name: "Business Expence", icon: <GiTakeMyMoney /> },
      { path: "/expense/team_expence", name: "Team Expence", icon: <GiPayMoney /> },
    ],
  },
  {
    path: "/products_sheet",
    name: "Products Sheet",
    icon: <FaDatabase />,
  },
  {
    path: "/affiliate",
    name: "Affiliate",
    icon: <FaDatabase />,
  },
  // {
  //   path: "/messaging",
  //   name: "Messaging",
  //   icon: <FaFacebookMessenger />,
  // },

  // {
  //   path: "/support",
  //   name: "Support",
  //   icon: <BiSupport />,
  // },
  // {
  //   path: "/settings",
  //   name: "Settings",
  //   icon: <FiSettings />,
  // },
];

const SideBar = ({ children, sidebarIsOpen, setSidebarIsOpen }) => {
  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    console.log("sidebar render..");
  }, [sidebarIsOpen]);

  var loggedIn = sessionStorage.getItem("uid");

  return (
    <>
      <div className="main-container">
        <motion.div
          style={loggedIn ? {} : { display: "none" }}
          animate={{
            width: sidebarIsOpen ? "240px" : "60px",
            transition: {
              duration: 0.3,
              type: "none",
              damping: 11,
            },
          }}
          className={`sidebar`}>
          <div className="top_section">
            <AnimatePresence>
              {sidebarIsOpen && (
                <motion.h1 variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="logo">
                  CRM
                </motion.h1>
              )}
            </AnimatePresence>
          </div>

          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setSidebarIsOpen}
                    key={index}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={sidebarIsOpen}
                  />
                );
              }

              return (
                <NavLink to={route.path} key={index} className={(navData) => (navData.isActive ? "active" : "link")}>
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {sidebarIsOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text">
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>

        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBar;
