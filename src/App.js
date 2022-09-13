import axios from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import SideBar from "./MainApp/SideBar";
import AddUser from "./Pages/AddUser";
import Customers from "./Pages/Customers";
import Dashboard from "./Pages/Dashboard";
import Deliverers from "./Pages/Deliverers";
import Expense from "./Pages/Expense";
import Inventory from "./Pages/Inventory";
import OrderDetails from "./Pages/OrderDetails";
import Orders from "./Pages/Orders";
import Products from "./Pages/Products";
import ProductsSheet from "./Pages/ProductsSheet";
import SalesChannels from "./Pages/SalesChannels";
import Shipping from "./Pages/Shipping";
import Suppliers from "./Pages/Suppliers";
import Transactions from "./Pages/Transactions";
import UserDetails from "./Pages/UserDetails";
import Users from "./Pages/Users";
import Warehouses from "./Pages/Warehouses";

function App() {
  let isLoggedIn = sessionStorage.getItem("uid") && sessionStorage.getItem("uid").length > 0 ? true : false;
  const [sidebarIsOpen, setIsSidebarOpen] = useState(isLoggedIn);

  const toggle = () => {
    setIsSidebarOpen(!sidebarIsOpen);
  };

  const setSidebarIsOpen = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const collapseAll = () => {
    const listItems = document.querySelectorAll(".dottedMenuContainer");
    const listItems4 = document.querySelectorAll(".dottedMenuContainer_wide");
    const listItems2 = document.querySelectorAll(".dottedMenuContainerOrder");
    const listItems3 = document.querySelectorAll(".dottedMenuContainerOrderConformation");

    for (let i = 0; i < listItems.length; i++) {
      listItems[i].style.display = "none";
    }

    for (let i = 0; i < listItems2.length; i++) {
      listItems2[i].style.display = "none";
    }

    for (let i = 0; i < listItems3.length; i++) {
      listItems3[i].style.display = "none";
    }
    for (let i = 0; i < listItems4.length; i++) {
      listItems4[i].style.display = "none";
    }
  };
  useEffect(() => {
    const getAllPermissions = async () => {
      try {
        const res = await axios.post("http://localhost:80/crm/service.php", {
          func: "getAllPermissions",
        });

        if (res.data) {
          let resData = JSON.stringify(res.data);
          sessionStorage.setItem("ALL_PERMISSIONS", resData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!sessionStorage.getItem("ALL_PERMISSIONS")) {
      getAllPermissions().catch(console.error);
    }
  }, []);

  var loggedIn = sessionStorage.getItem("uid");

  return (
    <div onClick={collapseAll}>
      <Router>
        <SideBar sidebarIsOpen={sidebarIsOpen} setSidebarIsOpen={setSidebarIsOpen}>
          <Routes>
            <Route
              exact
              path="/"
              element={
                loggedIn ? <Dashboard toggle={toggle} /> : <Login toggle={toggle} setSidebarIsOpen={setSidebarIsOpen} />
              }
            />
            <Route path="/dashboard" element={<Dashboard toggle={toggle} />} />
            <Route path="/users" element={<Users type="all" toggle={toggle} />} />
            <Route path="/agents" element={<Users type="agent" toggle={toggle} />} />
            <Route path="/orders" element={<Orders toggle={toggle} />} />
            <Route path="/order/:id" element={<OrderDetails toggle={toggle} />} />
            <Route path="/customers" element={<Customers toggle={toggle} />} />
            <Route path="/sales-channels" element={<SalesChannels toggle={toggle} />} />
            <Route path="/shipping" element={<Shipping toggle={toggle} />} />
            <Route path="/shipping/deliverers" element={<Deliverers type="individual" toggle={toggle} />} />
            <Route path="/shipping/companies" element={<Deliverers type="company" toggle={toggle} />} />
            <Route path="/inventory" element={<Inventory toggle={toggle} />} />
            <Route path="/supply/transactions" element={<Transactions toggle={toggle} />} />
            <Route path="/supply/suppliers" element={<Suppliers toggle={toggle} />} />
            <Route path="/expense/business_expence" element={<Expense type="business" toggle={toggle} />} />
            <Route path="/expense/team_expence" element={<Expense type="team" toggle={toggle} />} />
            <Route path="/add-user" element={<AddUser toggle={toggle} />} />
            <Route path="/products_sheet" element={<ProductsSheet toggle={toggle} />} />
            <Route path="/user/:id" element={<UserDetails toggle={toggle} />} />
            <Route path="/inventory/products" element={<Products toggle={toggle} />} />
            <Route path="/inventory/warehouses" element={<Warehouses toggle={toggle} />} />
          </Routes>
        </SideBar>
      </Router>
    </div>
  );
}

export default App;
