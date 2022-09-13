import { Backdrop } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { Autocomplete, TextField } from "formik-mui";
import React, { useEffect, useState } from "react";
import { AiFillInfoCircle, AiOutlineReload } from "react-icons/ai";
import { BiCalendar, BiPlus, BiSearch } from "react-icons/bi";
import { BsPersonFill } from "react-icons/bs";
import { FiShare2 } from "react-icons/fi";
import { TiFlowMerge, TiWarning } from "react-icons/ti";
import * as Yup from "yup";
import ConformationStatusMenu from "../Components/ConformationStatusMenu.jsx";
import DeliveryStatusMenu from "../Components/DeliveryStatusMenu.jsx";
import OrderEditIcon from "../Components/OrderEditIcon";
import ProductRowInOrder from "../Components/ProductRowInOrder";
import { SERVER_URL } from "../Constants/AppConstants.js";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied.jsx";

function Orders({ toggle }) {
  const [allCustomerList, setAllCustomerList] = useState([]);
  const [allDeliveryManagers, setAllDeliveryManagers] = useState([]);
  const [allOrderSources, setAllOrderSources] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [allProductList, setAllProductList] = useState([]);
  const [selectedStatusForConformationStatusChange, setSelectedStatusForConformationStatusChange] = useState("");
  const [selectedStatusForDeliveryStatusChange, setSelectedStatusForDeliveryStatusChange] = useState("");
  const [trackingCode, setTrackingCode] = useState(getRandomTrackingCode);
  const [userInteractionOrderId, setUserInteractionOrderId] = useState(-100);
  const [statusChangeVisible, setStatusChangeVisible] = useState(false);
  const [statusHistoryVisible, setStatusHistoryVisible] = useState(false);
  const [assignOrderVisible, setAssignOrderVisible] = useState(false);
  const [orderDetailsPageVisible, setOrderDetailsPageVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [addOrderFormVisible, setAddOrderFormVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [productsForSelectedOrder, setProductsForSelectedOrder] = useState({
    product_ids: [],
    quantities: [],
    subtotals: [],
  });

  const allConformationStatuses = [
    "New",
    "Confirmed",
    "Postpone",
    "Cancelled",
    "No Answer",
    "Voicemail",
    "Wrong Number",
  ];
  const allDeliveryStatuses = [
    "New",
    "Cancelled",
    "No Answer",
    "Pending",
    "Postponed",
    "Unready",
    "Returned",
    "Processed",
  ];

  async function getAllOrders(searchTerm = "") {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllOrders",
        searchTerm: searchTerm,
      });
      if (res.data) {
        setAllOrders(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllProductList() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllProducts",
      });

      if (res.data) {
        setAllProductList(res.data);
        setProductsForSelectedOrder({ product_ids: [res.data[0].id], quantities: [0], subtotals: [0] });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getProductById(id) {
    for (let i = 0; i < allProductList.length; i++) {
      if (allProductList[i].id == id) {
        return allProductList[i];
      }
    }
  }
  function updateProductListForOrder(index) {
    let product = document.getElementById("product[" + index + "]").value;
    let quantity = document.getElementById("quantity[" + index + "]").value;
    let price = getProductById(product).price;

    let subtotal = quantity * price;
    let products = productsForSelectedOrder.product_ids;
    let quantities = productsForSelectedOrder.quantities;
    let subtotals = productsForSelectedOrder.subtotals;

    products[index] = product;
    quantities[index] = quantity ? quantity : 0;
    subtotals[index] = subtotal ? subtotal : 0;

    setProductsForSelectedOrder({
      product_ids: products,
      quantities: quantities,
      subtotals: subtotals,
    });
  }

  let removeAddedProductFromOrderedProductList = (id) => {
    let allProducts = productsForSelectedOrder.product_ids;
    let allQuantities = productsForSelectedOrder.quantities;
    let allSubtotals = productsForSelectedOrder.subtotals;

    allProducts.splice(id, 1);
    allQuantities.splice(id, 1);
    allSubtotals.splice(id, 1);

    setProductsForSelectedOrder({
      product_ids: allProducts,
      quantities: allQuantities,
      subtotals: allSubtotals,
    });
  };

  async function deleteTheOrder() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "deleteTheOrder",

        id: userInteractionOrderId,
        uid: JSON.parse(sessionStorage.getItem("fullUserDetails")).id,
      });
      if (res.data.includes("success")) {
        setUserInteractionOrderId(-100);
        getAllOrders();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllAgents() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllAgents",
      });
      if (res.data) {
        setAllAgents(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getRandomTrackingCode() {
    let length = 12;
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  function conformationStatusChangedFunc(id, newStatus) {
    let oldDeliveryStatus = "";
    let oldConformationStatus = "";
    for (let i = 0; i < allOrders.length; i++) {
      if (allOrders[i].id == id) {
        oldDeliveryStatus = allOrders[i].statuses[allOrders[i].statuses.length - 1].delivery_status;
        oldConformationStatus = allOrders[i].statuses[allOrders[i].statuses.length - 1].conformation_status;
        break;
      }
    }
    setSelectedStatusForConformationStatusChange(oldConformationStatus);
    setSelectedStatusForDeliveryStatusChange(oldDeliveryStatus);

    setSelectedStatusForConformationStatusChange(newStatus);
    setUserInteractionOrderId(id);
    updateOrderDetails(id);
    setStatusChangeVisible(true);
  }
  function deliveryStatusChangedFunc(id, newStatus) {
    let oldDeliveryStatus = "";
    let oldConformationStatus = "";
    for (let i = 0; i < allOrders.length; i++) {
      if (allOrders[i].id == id) {
        oldDeliveryStatus = allOrders[i].statuses[allOrders[i].statuses.length - 1].delivery_status;
        oldConformationStatus = allOrders[i].statuses[allOrders[i].statuses.length - 1].conformation_status;
        break;
      }
    }
    setSelectedStatusForConformationStatusChange(oldConformationStatus);
    setSelectedStatusForDeliveryStatusChange(oldDeliveryStatus);

    if (newStatus) {
      setSelectedStatusForDeliveryStatusChange(newStatus);
    }

    setUserInteractionOrderId(id);
    updateOrderDetails(id);
    setStatusChangeVisible(true);
  }

  function showStatusHistoryForOrder(id) {
    setUserInteractionOrderId(id);
    updateOrderDetails(id);
    setStatusHistoryVisible(true);
  }
  function assignOrderTo(id) {
    setAssignOrderVisible(true);
    setUserInteractionOrderId(id);
    updateOrderDetails(id);
  }
  function updateOrderDetails(id) {
    setSelectedOrder(getOrderDetailsForId(id));
  }

  function getOrderDetailsForId(id) {
    for (let i = 0; i < allOrders.length; i++) {
      if (allOrders[i].id == id) {
        return allOrders[i];
      }
    }
  }
  function getProductIdsArray(id) {
    let theOrderDetails = getOrderDetailsForId(id);

    let products = [];
    for (let index = 0; index < theOrderDetails.products.length; index++) {
      products.push(theOrderDetails.products[index].id);
    }
    return products;
  }
  function getProductQuantitiesArray(id) {
    let theOrderDetails = getOrderDetailsForId(id);
    let quantity = [];
    for (let index = 0; index < theOrderDetails.products.length; index++) {
      quantity.push(theOrderDetails.products[index].quantity);
    }
    return quantity;
  }
  function getSubtotalsArray(id) {
    let theOrderDetails = getOrderDetailsForId(id);
    let subtotal = [];
    for (let index = 0; index < theOrderDetails.products.length; index++) {
      subtotal.push(
        parseInt(theOrderDetails.products[index].quantity) * parseInt(theOrderDetails.products[index].price)
      );
    }
    return subtotal;
  }
  function getCustomerById(cid) {
    for (let i = 0; i < allCustomerList.length; i++) {
      if (allCustomerList[i].id == cid) {
        return allCustomerList[i];
      }
    }
  }
  function getDeliveryServiceById(did) {
    for (let i = 0; i < allDeliveryManagers.length; i++) {
      if (allDeliveryManagers[i].id == did) {
        return allDeliveryManagers[i];
      }
    }
  }

  function getAddOrderInitialValues() {
    if (userInteractionOrderId >= 0) {
      return {
        customer_id: getCustomerById(selectedOrder.customer_id),
        delivery_service: getDeliveryServiceById(selectedOrder.delivery_service),
        shipping: selectedOrder.shipping_paid,
        conformation_status: selectedOrder.statuses[selectedOrder.statuses.length - 1].conformation_status,
        delivery_status: selectedOrder.statuses[selectedOrder.statuses.length - 1].delivery_status,
        shipping_cost: selectedOrder.shipping_cost,
        delivery_note: selectedOrder.statuses[selectedOrder.statuses.length - 1].note,
        note: selectedOrder.note,
        tracking_code: selectedOrder.tracking_code,
        order_source: selectedOrder.source,
        stock_transfer: selectedOrder.stock_transfer == "1",
        ispinned: selectedOrder.ispinned == "1",
        product: getProductIdsArray(userInteractionOrderId),
        quantity: getProductQuantitiesArray(userInteractionOrderId),
        subtotal: getSubtotalsArray(userInteractionOrderId),
      };
    } else {
      let ini = {
        customer_id: allCustomerList.length > 0 ? allCustomerList[0] : "",
        delivery_service: allDeliveryManagers.length > 0 ? allDeliveryManagers[0] : "",
        shipping: 0,
        conformation_status: "New",
        delivery_status: "New",
        shipping_cost: 0,
        delivery_note: "",
        note: "",
        tracking_code: "",
        ispinned: false,
        order_source: allOrderSources.length > 0 ? allOrderSources[0] : "",
        stock_transfer: false,
        product: [allProductList.length > 0 ? allProductList[0].id : 0],
        quantity: [1],
        subtotal: [allProductList.length > 0 ? allProductList[0].price : 0],
      };
      return ini;
    }
  }
  async function getAllCustomerList() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllCustomers",
      });

      if (res.data) {
        setAllCustomerList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllDeliveryManagers() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllDeliveryManagers",
      });

      if (res.data) {
        setAllDeliveryManagers(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllOrderSources() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllOrderSources",
      });

      if (res.data) {
        let sourcesArray = res.data.map((val) => {
          return val.source;
        });
        setAllOrderSources(sourcesArray);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function getProductPrices(products) {
    let prices = [];

    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < allProductList.length; j++) {
        if (allProductList[j].id == products[i]) {
          prices.push(allProductList[j].price);
          continue;
        }
      }
    }
    return prices;
  }
  function editOrderButtonPressed(id) {
    setUserInteractionOrderId(id);
    updateOrderDetails(id);
    setAddOrderFormVisible(true);

    setProductsForSelectedOrder({
      product_ids: getProductIdsArray(id),
      quantities: getProductQuantitiesArray(id),
      subtotals: getSubtotalsArray(id),
    });
  }
  async function addEditOrder(values) {
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    values.tracking_code = document.getElementById("tracking_code").placeholder;
    values.stock_transfer = document.getElementById("stock_transfer").checked;
    values.isPinned = document.getElementById("isPinned").checked;
    values.prices = getProductPrices(values.product);
    values.customer_id = values.customer_id.id;
    values.delivery_service = values.delivery_service.id;

    let funcName = userInteractionOrderId > 0 ? "editOrder" : "addNewOrder";
    values.orderId = userInteractionOrderId;

    values.quantity = productsForSelectedOrder.quantities;
    values.product = productsForSelectedOrder.product_ids;
    values.subtotal = productsForSelectedOrder.subtotals;

    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });
      console.log(res);
      if (res.data.includes("success")) {
        getAllOrders();
        setAddOrderFormVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function assignAgentForOrder(values) {
    values.order_id = userInteractionOrderId;
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "assignAgentForOrder",
        formData: JSON.stringify(values),
      });

      if (res.data.includes("success")) {
        setUserInteractionOrderId(-100);
        getAllOrders();
        setAssignOrderVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function saveNewStatus(values) {
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    values.order_id = userInteractionOrderId;

    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "addStatusForDelivery",
        formData: JSON.stringify(values),
      });
      console.log(res);
      if (res.data.includes("success")) {
        setUserInteractionOrderId(-100);
        getAllOrders();
        setStatusChangeVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const newOrderValidationSchema = Yup.object().shape({
    shipping: Yup.number().required("Required"),
    shipping_cost: Yup.number().required("Required"),
    delivery_note: Yup.string().min(2, "Too Short!").max(500, "Too Long!").required("Required"),
    note: Yup.string().min(2, "Too Short!").max(500, "Too Long!").required("Required"),
  });

  useEffect(() => {
    getAllOrders();
    getAllAgents();
    getAllProductList();
    getAllCustomerList();
    getAllOrderSources();
    getAllDeliveryManagers();
  }, []);

  var loggedIn = sessionStorage.getItem("uid");

  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <Tabs />
          <div className="container-fluid">
            {/*...........add order form.................*/}
            <Backdrop
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                overflowY: "scroll",
              }}
              open={addOrderFormVisible}>
              <div className="addOrderFormBg">
                <Formik
                  initialValues={getAddOrderInitialValues()}
                  validationSchema={newOrderValidationSchema}
                  enableReinitialize
                  onSubmit={(values) => {
                    addEditOrder(values);
                  }}>
                  <Form>
                    <div style={{ height: "60px" }}>
                      <div style={{ width: "50%", float: "left", paddingLeft: "12px" }}>
                        <h4>Create Order</h4>
                      </div>

                      <div style={{ width: "50%", float: "right" }}>
                        <div style={{ width: "12%", float: "right" }}>
                          <button className="btn btn-primary btn-lg">
                            <FiShare2 />
                          </button>
                        </div>
                        <div style={{ width: "12%", float: "right" }}>
                          <button className="btn btn-primary btn-lg">
                            <TiFlowMerge />
                          </button>
                        </div>
                        <div style={{ width: "20%", float: "right", paddingTop: "8px" }}>
                          <label className="switch">
                            <input type="checkbox" id="isPinned" name="ispinned" />
                            <span className="slider round"></span>
                          </label>
                          <div style={{ paddingTop: "5px", float: "right", paddingRight: "15px" }}>Pin</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="newOrderForm">
                        {/*.........row 1..............*/}
                        <div style={{ height: "100px" }}>
                          <div style={{ width: "33%", padding: "10px 10px", float: "left" }}>
                            <div className="form-outline" style={{ width: "79%", float: "left" }}>
                              <Field
                                name="customer_id"
                                component={Autocomplete}
                                options={allCustomerList}
                                style={{ width: "100%" }}
                                isOptionEqualToValue={(option, value) => {
                                  return option.id === value;
                                }}
                                getOptionLabel={(option) => option.name || ""}
                                renderInput={(params) => {
                                  const inputProps = params.inputProps;
                                  inputProps.autoComplete = "disabled";
                                  return (
                                    <MuiTextField
                                      {...params}
                                      inputProps={inputProps}
                                      name="customer_id"
                                      required
                                      label="Customer Name"
                                      variant="outlined"
                                      fullWidth
                                    />
                                  );
                                }}
                              />
                            </div>

                            <div
                              style={{
                                lineHeight: "27px",
                                width: "50px",
                                height: "55px",
                                verticalAlign: "middle",
                                float: "right",
                              }}>
                              <button
                                className="btn btn-secondary btn-lg"
                                type="button"
                                style={{ width: "56px", height: "56px" }}>
                                <BiPlus />
                              </button>
                            </div>
                          </div>

                          <div className="form-outline" style={{ width: "33%", float: "left", padding: "10px 10px" }}>
                            <Field
                              name="delivery_service"
                              component={Autocomplete}
                              options={allDeliveryManagers}
                              style={{ width: "100%" }}
                              getOptionLabel={(option) => {
                                if (option && option.title) {
                                  return option.title + " " + option.firstname + " " + option.lastname;
                                }
                                return "";
                              }}
                              renderInput={(params) => {
                                const inputProps = params.inputProps;
                                inputProps.autoComplete = "disabled";
                                return (
                                  <MuiTextField
                                    {...params}
                                    inputProps={inputProps}
                                    name="delivery_service"
                                    label="Delivery Service"
                                    required
                                    variant="outlined"
                                    fullWidth
                                  />
                                );
                              }}
                            />
                          </div>
                          <div className="form-outline" style={{ width: "33%", float: "right", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="shipping"
                              autoComplete="disabled"
                              label="Paid by Customer (shipping)"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>

                        {/*.........row 2..............*/}
                        <div style={{ height: "100px" }}>
                          <div className="form-outline" style={{ width: "33%", float: "left", padding: "10px 10px" }}>
                            <Field
                              name="conformation_status"
                              component={Autocomplete}
                              options={allConformationStatuses}
                              style={{ width: "100%" }}
                              renderInput={(params) => {
                                const inputProps = params.inputProps;
                                inputProps.autoComplete = "disabled";
                                return (
                                  <MuiTextField
                                    {...params}
                                    inputProps={inputProps}
                                    required
                                    name="conformation_status"
                                    label="Conformation Status"
                                    variant="outlined"
                                    fullWidth
                                  />
                                );
                              }}
                            />
                          </div>

                          <div className="form-outline" style={{ width: "33%", float: "left", padding: "10px 10px" }}>
                            <Field
                              name="delivery_status"
                              component={Autocomplete}
                              options={allDeliveryStatuses}
                              style={{ width: "100%" }}
                              renderInput={(params) => {
                                const inputProps = params.inputProps;
                                inputProps.autoComplete = "disabled";
                                return (
                                  <MuiTextField
                                    {...params}
                                    inputProps={inputProps}
                                    required
                                    name="delivery_status"
                                    label="Delivery Status"
                                    variant="outlined"
                                    fullWidth
                                  />
                                );
                              }}
                            />
                          </div>

                          <div className="form-outline" style={{ width: "33%", float: "right", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="shipping_cost"
                              autoComplete="disabled"
                              label="Shipping Cost"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>

                        {/*.........row 3..............*/}
                        <div style={{ height: "145px" }}>
                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              multiline
                              rows={3}
                              name="delivery_note"
                              autoComplete="disabled"
                              label="Delivery Service Note"
                              className="form-control form-control-lg"
                            />
                          </div>

                          <div className="form-outline" style={{ width: "50%", float: "right", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="note"
                              autoComplete="disabled"
                              multiline
                              rows={3}
                              label="Your Note"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>

                        {/*.........row 4..............*/}
                        <div style={{ marginBottom: "10px" }}>
                          <div>
                            <div style={{ width: "33%", padding: "10px 10px", float: "left" }}>
                              <div className="form-outline" style={{ width: "79%", float: "left" }}>
                                <Field
                                  type="text"
                                  component={TextField}
                                  name="tracking_code"
                                  id="tracking_code"
                                  autoComplete="disabled"
                                  value={trackingCode}
                                  disabled
                                  label="Tracking Code"
                                  className="form-control form-control-lg"
                                />
                              </div>
                              <div
                                style={{
                                  lineHeight: "27px",
                                  width: "50px",
                                  height: "55px",
                                  verticalAlign: "middle",
                                  float: "right",
                                }}>
                                <button
                                  className="btn btn-secondary btn-lg"
                                  type="button"
                                  style={{ width: "56px", height: "56px" }}
                                  onClick={() => {
                                    setTrackingCode(getRandomTrackingCode());
                                  }}>
                                  <AiOutlineReload />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="form-outline" style={{ width: "33%", float: "left", padding: "10px 10px" }}>
                            <Field
                              name="order_source"
                              component={Autocomplete}
                              options={allOrderSources}
                              style={{ width: "100%" }}
                              getOptionLabel={(option) => option || ""}
                              renderInput={(params) => {
                                const inputProps = params.inputProps;
                                inputProps.autoComplete = "disabled";
                                return (
                                  <MuiTextField
                                    {...params}
                                    inputProps={inputProps}
                                    name="order_source"
                                    label="Source"
                                    required
                                    variant="outlined"
                                    fullWidth
                                  />
                                );
                              }}
                            />
                          </div>
                          <div
                            className="form-outline"
                            style={{ width: "33%", float: "left", padding: "0px 10px", height: "76px" }}>
                            <div
                              className="form-custom-label"
                              style={{
                                fontWeight: "bold",
                                paddingBottom: "6px",
                                paddingTop: "24px",
                                width: "48%",
                                float: "right",
                                textAlign: "right",
                              }}>
                              Stock Transfer: <AiFillInfoCircle />
                            </div>
                            <div style={{ width: "30%", float: "right", paddingTop: "18px", textAlign: "right" }}>
                              <label className="switch">
                                <div style={{ paddingTop: "12px" }}>
                                  <input type="checkbox" name="stock_transfer" id="stock_transfer" />
                                  <span className="slider round"></span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                        {/*.........row 5..............*/}
                        <div>
                          <div className="form-outline" style={{ width: "33%", float: "left" }}>
                            <label className="form-custom-label" style={{ padding: "10px 10px 0px 10px" }}>
                              Product:{" "}
                            </label>
                          </div>
                          <div className="form-outline" style={{ width: "33%", float: "left" }}>
                            <label className="form-custom-label" style={{ padding: "10px 10px 0px 10px" }}>
                              Quantity:{" "}
                            </label>
                          </div>
                          <div className="form-outline" style={{ width: "33%", float: "left" }}>
                            <label className="form-custom-label" style={{ padding: "10px 10px 0px 10px" }}>
                              Subtotal:{" "}
                            </label>
                            <div style={{ float: "right" }}>
                              <button
                                className="btn btn-secondary btn-lg"
                                type="button"
                                style={{ lineHeight: "16px" }}
                                onClick={() => {
                                  let product_ids = productsForSelectedOrder.product_ids;
                                  let quantities = productsForSelectedOrder.quantities;
                                  let subtotals = productsForSelectedOrder.subtotals;

                                  product_ids.push(0);
                                  quantities.push(0);
                                  subtotals.push(0);
                                  setProductsForSelectedOrder({
                                    product_ids: product_ids,
                                    quantities: quantities,
                                    subtotals: subtotals,
                                  });
                                }}>
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        {/*.........product list here................*/}
                        <hr style={{ width: "90%", marginBottom: "10px" }} />

                        <div>
                          {productsForSelectedOrder.product_ids &&
                            productsForSelectedOrder.product_ids.map((p, index) => (
                              <ProductRowInOrder
                                removeAddedProductForTheOrder={removeAddedProductFromOrderedProductList}
                                productUpdatedForOrder={updateProductListForOrder}
                                product={p}
                                index={index}
                                selectedProduct={productsForSelectedOrder.product_ids[index]}
                                key={index}
                                allProducts={allProductList}
                                quantity={productsForSelectedOrder.quantities[index]}
                                subtotal={productsForSelectedOrder.subtotals[index]}
                              />
                            ))}
                        </div>
                        <div style={{ width: "40%", margin: "80px auto 0px" }}>
                          <button
                            style={{ width: "40%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={() => {
                              setAddOrderFormVisible(false);
                            }}>
                            Cancel
                          </button>

                          <button
                            style={{ width: "40%", marginLeft: "20px" }}
                            className="btn btn-primary btn-lg"
                            type="submit">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            </Backdrop>
            {/*...........delete confirm.................*/}
            <Backdrop
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                overflowY: "scroll",
              }}
              open={deleteConfirmVisible}>
              <div className="deleteOrderConfirmBg">
                <div>
                  <h4>Warning</h4>
                </div>
                <div style={{ float: "left" }}>
                  <TiWarning />
                </div>
                <div style={{ paddingLeft: "15px", float: "left" }}>Are you sure you want to delete the order?</div>
                <div style={{ float: "right", width: "100%", padding: "15px 0px" }}>
                  <button
                    style={{ width: "40%" }}
                    className="btn btn-secondary btn-lg"
                    type="button"
                    onClick={() => {
                      setDeleteConfirmVisible(false);
                    }}>
                    Cancel
                  </button>

                  <button
                    style={{ width: "40%", marginLeft: "20px" }}
                    className="btn btn-primary btn-lg"
                    type="submit"
                    onClick={() => {
                      setDeleteConfirmVisible(false);
                      deleteTheOrder();
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            </Backdrop>
            {/*.............view order....................*/}
            <Backdrop
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                overflowY: "scroll",
              }}
              open={orderDetailsPageVisible}>
              <div className="orderDetailsBg">
                <div>
                  <div style={{ width: "90%", float: "left" }}>{userInteractionOrderId > 0 && selectedOrder.id}</div>
                  <div
                    className="xButton"
                    onClick={() => {
                      setOrderDetailsPageVisible(false);
                    }}>
                    x
                  </div>
                </div>
                <div className="customerDetails">
                  <div>
                    <b>Customer Details</b>
                  </div>
                  <div style={{ display: "block", width: "80%", paddingLeft: "10px" }}>
                    <div style={{ width: "10%", float: "left" }}>
                      <BsPersonFill />
                    </div>

                    <div style={{ float: "right", textAlign: "left", width: "90%" }}>
                      {userInteractionOrderId > 0 && selectedOrder.customerDetails.name} {"From "}
                      {userInteractionOrderId > 0 && selectedOrder.customerDetails.country}
                    </div>
                  </div>
                  <div>
                    <div>
                      <b>Contact:</b>{" "}
                    </div>
                    <div style={{ display: "block", width: "80%", paddingLeft: "10px" }}>
                      {userInteractionOrderId > 0 && selectedOrder.customerDetails.phone}
                    </div>
                  </div>
                </div>
                <div className="agentDetails">
                  <div>
                    <b>Agent Details</b>
                  </div>
                  <div style={{ display: "block", width: "80%", paddingLeft: "10px" }}>
                    <div style={{ width: "10%", float: "left" }}>
                      <BsPersonFill />
                    </div>
                    <div style={{ float: "right", textAlign: "left", width: "90%" }}>
                      {userInteractionOrderId > 0 && selectedOrder.agentDetails.title}{" "}
                      {userInteractionOrderId > 0 && selectedOrder.agentDetails.firstname}{" "}
                      {userInteractionOrderId > 0 && selectedOrder.agentDetails.lastname}
                    </div>
                  </div>
                  <div>
                    <div>
                      <b>Contact:</b>
                    </div>
                    <div style={{ display: "block", width: "80%", paddingLeft: "10px" }}>
                      {userInteractionOrderId > 0 && selectedOrder.agentDetails.phone}
                    </div>
                  </div>
                </div>
                <div className="otherDetails">
                  <div>
                    <b>Other Details:</b>
                  </div>
                  <div style={{ display: "block", width: "80%", paddingLeft: "10px" }}>
                    <div>
                      <BiCalendar />
                      {userInteractionOrderId > 0 && selectedOrder.createdat}
                    </div>
                    <div>
                      <b>Tracking: {selectedOrder.tracking_code} </b>
                    </div>
                    <div>
                      <b>Source: {selectedOrder.source} </b>
                    </div>
                  </div>
                </div>

                <div>
                  <div>
                    <b>Products</b>
                  </div>
                  <div>
                    <table className="table table-striped">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">Product</th>
                          <th scope="col">Price</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userInteractionOrderId > 0 &&
                          selectedOrder.products.map((product, index) => (
                            <tr key={index}>
                              <td>{product.name}</td>
                              <td>{product.price}</td>
                              <td>{product.quantity}</td>
                              <td>{product.total_cost}</td>
                            </tr>
                          ))}

                        <tr>
                          <td></td>
                          <td></td>
                          <td>
                            <b>Subtotal</b>
                          </td>
                          <td>{userInteractionOrderId > 0 && selectedOrder.total}</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td>
                            <b>Shipping</b>
                          </td>
                          <td>{userInteractionOrderId > 0 && selectedOrder.shipping}</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td>
                            <b>Total</b>
                          </td>
                          <td>
                            {userInteractionOrderId > 0 &&
                              parseInt(selectedOrder.total) + parseFloat(selectedOrder.shipping_cost)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div style={{ width: "100%" }}>
                  <div
                    style={{ float: "left", width: "50%" }}
                    onClick={() => {
                      setOrderDetailsPageVisible(false);
                      updateOrderDetails(userInteractionOrderId);
                      setAddOrderFormVisible(true);
                    }}>
                    <button className="btn btn-secondary btn-circle btn-sm">Edit</button>
                  </div>

                  <div style={{ width: "25%", float: "left" }}>
                    <ConformationStatusMenu
                      currentStatus={
                        userInteractionOrderId > 0 &&
                        selectedOrder.statuses[selectedOrder.statuses.length - 1].conformation_status
                      }
                      id={userInteractionOrderId > 0 && selectedOrder.id}
                      conformationStatusChangedFunc={conformationStatusChangedFunc}
                    />
                  </div>

                  <div style={{ width: "25%", float: "right" }}>
                    <DeliveryStatusMenu
                      id={userInteractionOrderId > 0 && selectedOrder.id}
                      currentStatus={
                        userInteractionOrderId > 0 &&
                        selectedOrder.statuses[selectedOrder.statuses.length - 1].delivery_status
                      }
                      deliveryStatusChangedFunc={deliveryStatusChangedFunc}
                    />
                  </div>
                </div>
              </div>
            </Backdrop>
            {/*...........assign order to.................*/}
            <Backdrop
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                overflowY: "scroll",
              }}
              open={assignOrderVisible}>
              <div className="assignOrderBg">
                <Formik
                  initialValues={{
                    delivery_service: selectedOrder.delivery_service,
                    agent: selectedOrder.agentid,
                  }}
                  enableReinitialize
                  onSubmit={(values) => {
                    assignAgentForOrder(values);
                  }}>
                  <Form>
                    <div style={{ marginBottom: "0px", float: "left", width: "100%" }}>
                      <h3>Assign To</h3>
                      <div style={{ float: "left", width: "50%", padding: "0px 10px 0px 0px" }}>
                        <h5>Delivery Service</h5>
                        <Field
                          as="select"
                          name="delivery_service"
                          className="select form-control-lg"
                          style={{ width: "100%" }}>
                          {allDeliveryManagers &&
                            allDeliveryManagers.map((dl, index) => (
                              <option key={index} value={dl.id}>
                                {dl.title + " " + dl.firstname + " " + dl.lastname}
                              </option>
                            ))}
                        </Field>
                      </div>
                      <div style={{ float: "right", width: "50%", padding: "0px 10px 0px 0px" }}>
                        <h5>Agent</h5>
                        <Field as="select" name="agent" className="select form-control-lg" style={{ width: "100%" }}>
                          {allAgents &&
                            allAgents.map((agent, index) => (
                              <option key={index} value={agent.id}>
                                {agent.title + " " + agent.firstname + " " + agent.lastname}
                              </option>
                            ))}
                        </Field>
                      </div>
                    </div>
                    <div style={{ float: "right", width: "100%", padding: "52px 0px" }}>
                      <button
                        style={{ width: "40%" }}
                        className="btn btn-secondary btn-lg"
                        type="button"
                        onClick={() => {
                          setAssignOrderVisible(false);
                        }}>
                        Cancel
                      </button>

                      <button
                        style={{ width: "40%", marginLeft: "20px" }}
                        className="btn btn-primary btn-lg"
                        type="submit">
                        Save
                      </button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </Backdrop>

            {/*...........status history.................*/}
            <Backdrop
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                overflowY: "scroll",
              }}
              open={statusHistoryVisible}>
              <div className="changeStatusFormBg">
                <div style={{ padding: "0px 10px" }}>
                  <div style={{ marginBottom: "18px", float: "left", width: "90%" }}>
                    <h3>Status History</h3>
                  </div>
                  <div
                    className="xButton"
                    onClick={() => {
                      setStatusHistoryVisible(false);
                    }}>
                    x
                  </div>
                  <div className="conformationStatusInOrderStatus">
                    <div>
                      <h4>Conformation Status</h4>
                    </div>
                    <div>
                      {selectedOrder &&
                        selectedOrder.statuses &&
                        selectedOrder.statuses.map((st, index) => (
                          <div key={index} className="historyBox">
                            {index < selectedOrder.statuses.length - 1 ? <div className="bar"></div> : ""}

                            <div style={{ fontSize: "16px" }}>{st.conformation_status}</div>
                            <div style={{ fontSize: "13px" }}>{st.createdat}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="deliveryStatusInOrderStatus">
                    <div>
                      <h4>Delivery Status</h4>
                    </div>
                    <div>
                      {selectedOrder &&
                        selectedOrder.statuses &&
                        selectedOrder.statuses.map((st, index) => (
                          <div key={index} className="historyBox">
                            {index < selectedOrder.statuses.length - 1 ? <div className="bar"></div> : ""}
                            <div style={{ fontSize: "16px" }}>{st.delivery_status}</div>
                            <div style={{ fontSize: "13px" }}>{st.createdat}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </Backdrop>

            {/*....conformation status change.....*/}
            <Backdrop
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                overflowY: "scroll",
              }}
              open={statusChangeVisible}>
              <div className="changeStatusFormBg">
                <div style={{ padding: "0px 10px" }}>
                  <div style={{ marginBottom: "18px" }}>
                    <h2>Change the confirmation status</h2>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={{
                      conformationStatus: selectedStatusForConformationStatusChange,
                      deliveryStatus: selectedStatusForDeliveryStatusChange,
                      note: "",
                    }}
                    enableReinitialize
                    onSubmit={(values) => {
                      saveNewStatus(values);
                    }}>
                    <Form>
                      <div className="changeStatusForm">
                        <div className="form-outline" style={{ padding: "0px 10px", width: "50%", float: "left" }}>
                          <label className="form-custom-label">Conformation Status</label>
                          <Field
                            as="select"
                            name="conformationStatus"
                            className="select form-control-lg"
                            style={{ width: "100%" }}>
                            {allConformationStatuses.map((cfs, index) => (
                              <option key={index} value={cfs}>
                                {cfs}
                              </option>
                            ))}
                          </Field>
                        </div>

                        <div className="form-outline" style={{ padding: "0px 10px", width: "50%", float: "right" }}>
                          <label className="form-custom-label">Delivery Status</label>
                          <Field
                            as="select"
                            name="deliveryStatus"
                            className="select form-control-lg"
                            style={{ width: "100%" }}>
                            {allDeliveryStatuses.map((ds, index) => (
                              <option key={index} value={ds}>
                                {ds}
                              </option>
                            ))}
                          </Field>
                        </div>

                        <div className="form-outline" style={{ width: "100%", float: "left", padding: "0px 10px" }}>
                          <label className="form-custom-label">Note: </label>
                          <Field
                            as="textarea"
                            name="note"
                            className="select form-control-lg"
                            style={{ width: "100%" }}
                          />
                        </div>

                        <div style={{ float: "right", width: "100%", padding: "12px 10px 3px 10px" }}>
                          <button
                            style={{ width: "40%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={() => {
                              setStatusChangeVisible(false);
                            }}>
                            Cancel
                          </button>

                          <button
                            style={{ width: "40%", marginLeft: "30px" }}
                            className="btn btn-primary btn-lg"
                            type="submit">
                            Save
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>

            {/*.......list orders here..........*/}

            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col" colSpan={2}>
                    <Formik
                      enableReinitialize
                      initialValues={{ search: "" }}
                      onSubmit={(values) => {
                        getAllOrders(values.search);
                      }}>
                      <Form>
                        <div className="form-outline" style={{ float: "left", marginRight: "10px" }}>
                          <Field
                            type="text"
                            name="search"
                            placeholder="Search"
                            className="form-control form-control-lg"
                          />
                        </div>
                        <div style={{ float: "left" }}>
                          <button type="submit" className="btn btn-secondary" style={{ padding: "7px 9px" }}>
                            <BiSearch />
                          </button>
                        </div>
                      </Form>
                    </Formik>
                  </th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>

                  <th scope="col" style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: "7px 10px" }}
                      onClick={() => {
                        setUserInteractionOrderId(-100);
                        setSelectedOrder({});
                        setAddOrderFormVisible(true);
                      }}>
                      + Add Order
                    </button>
                  </th>
                </tr>
                <tr>
                  <th scope="col">Ref</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Products</th>
                  <th scope="col">Total</th>
                  <th scope="col">Confirmation Status</th>
                  <th scope="col">Delivery Status</th>

                  <th scope="col" style={{ textAlign: "left" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody style={{ whiteSpace: "pre-line" }}>
                {allOrders &&
                  allOrders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.id}</td>
                      <td>{order.customerDetails.name}</td>
                      <td>{order.allProductsString}</td>
                      <td>{order.total}</td>
                      <td>
                        <ConformationStatusMenu
                          currentStatus={order.statuses[order.statuses.length - 1].conformation_status}
                          id={order.id}
                          conformationStatusChangedFunc={conformationStatusChangedFunc}
                        />
                      </td>
                      <td>
                        <DeliveryStatusMenu
                          id={order.id}
                          currentStatus={order.statuses[order.statuses.length - 1].delivery_status}
                          deliveryStatusChangedFunc={deliveryStatusChangedFunc}
                        />
                      </td>
                      <td style={{ width: "20%" }}>
                        <OrderEditIcon
                          id={order.id}
                          changeOrderStatusFunc={deliveryStatusChangedFunc}
                          showStatusHistoriesFunc={(id) => {
                            showStatusHistoryForOrder(id);
                          }}
                          assignOrderToFunc={(id) => {
                            assignOrderTo(id);
                          }}
                          showOrderInfoFunc={(id) => {
                            setUserInteractionOrderId(id);
                            updateOrderDetails(id);
                            setOrderDetailsPageVisible(true);
                          }}
                          deletePressedFunc={(id) => {
                            setUserInteractionOrderId(id);
                            updateOrderDetails(id);
                            setDeleteConfirmVisible(true);
                          }}
                          editPressedFunc={(id) => {
                            editOrderButtonPressed(id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!loggedIn && <AccessDenied />}
    </div>
  );
}

export default Orders;
