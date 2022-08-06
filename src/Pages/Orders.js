import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { AiFillInfoCircle, AiOutlineReload } from "react-icons/ai";
import { BiCalendar, BiSearch } from "react-icons/bi";
import { BsPersonFill } from "react-icons/bs";
import { FiShare2 } from "react-icons/fi";
import { TiFlowMerge, TiWarning } from "react-icons/ti";
import ConformationStatusMenu from "../Components/ConformationStatusMenu.jsx";
import DeliveryStatusMenu from "../Components/DeliveryStatusMenu.jsx";
import OrderEditIcon from "../Components/OrderEditIcon";
import ProductRowInOrder from "../Components/ProductRowInOrder.jsx";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

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
  const [numberOfProductsInAddOrderForm, setNumberOfProductsInAddOrderForm] = useState(1);
  const [userInteractionOrderId, setUserInteractionOrderId] = useState(-100);
  const [statusChangeVisible, setStatusChangeVisible] = useState(false);
  const [statusHistoryVisible, setStatusHistoryVisible] = useState(false);
  const [assignOrderVisible, setAssignOrderVisible] = useState(false);
  const [orderDetailsPageVisible, setOrderDetailsPageVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [addOrderFormVisible, setAddOrderFormVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});

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
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllProducts",
      });

      if (res.data) {
        setAllProductList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTheOrder() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
    for (let i = 0; i < allOrders.length; i++) {
      if (allOrders[i].id == id) {
        setSelectedOrder(allOrders[i]);
        setNumberOfProductsInAddOrderForm(allOrders[i].products.length);
        break;
      }
    }
  }
  function getProductIdsArray() {
    let products = [];
    for (let index = 0; index < selectedOrder.products.length; index++) {
      products.push(selectedOrder.products[index].id);
    }
    return products;
  }
  function getProductQuantitiesArray() {
    let quantity = [];
    for (let index = 0; index < selectedOrder.products.length; index++) {
      quantity.push(selectedOrder.products[index].quantity);
    }
    return quantity;
  }
  function getSubtotalsArray() {
    let subtotal = [];
    for (let index = 0; index < selectedOrder.products.length; index++) {
      subtotal.push(parseInt(selectedOrder.products[index].quantity) * parseInt(selectedOrder.products[index].price));
    }
    return subtotal;
  }
  function getAddOrderInitialValues() {
    if (userInteractionOrderId >= 0) {
      return {
        customer_id: selectedOrder.customer_id,
        delivery_service: selectedOrder.delivery_service,
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
        product: getProductIdsArray(selectedOrder),
        quantity: getProductQuantitiesArray(selectedOrder),
        subtotal: getSubtotalsArray(selectedOrder),
      };
    } else {
      // let ini = {
      //   customer_id: allCustomerList.length > 0 ? allCustomerList[0].id : 0,
      //   delivery_service: allDeliveryManagers.length > 0 ? allDeliveryManagers[0].id : 0,
      //   shipping: 0,
      //   conformation_status: "New",
      //   delivery_status: "New",
      //   shipping_cost: 0,
      //   delivery_note: "",
      //   note: "",
      //   tracking_code: "",
      //   order_source: allOrderSources.length > 0 ? allOrderSources[0].source : 0,
      //   stock_transfer: false,
      //   product: getArrayOfIntegerOfTimes(
      //     allProductList.length > 0 ? allProductList[0].id : 0,
      //     numberOfProductsInAddOrderForm
      //   ),
      //   quantity: getArrayOfIntegerOfTimes(1, numberOfProductsInAddOrderForm),
      //   subtotal: getArrayOfIntegerOfTimes(
      //     allProductList.length > 0 ? allProductList[0].price : 0,
      //     numberOfProductsInAddOrderForm
      //   ),
      // };

      let ini = {
        customer_id: allCustomerList.length > 0 ? allCustomerList[0].id : 0,
        delivery_service: allDeliveryManagers.length > 0 ? allDeliveryManagers[0].id : 0,
        shipping: 0,
        conformation_status: "New",
        delivery_status: "New",
        shipping_cost: 0,
        delivery_note: "",
        note: "",
        tracking_code: "",
        ispinned: false,
        order_source: allOrderSources.length > 0 ? allOrderSources[0].source : 0,
        stock_transfer: false,
        product: [allProductList.length > 0 ? allProductList[0].id : 0],
        quantity: [1],
        subtotal: [allProductList.length > 0 ? allProductList[0].price : 0],
      };
      return ini;
    }
  }
  // function getArrayOfIntegerOfTimes(item, times) {
  //   let arr = [];
  //   for (let i = 0; i < times; i++) {
  //     arr.push(item);
  //   }
  //   return arr;
  // }
  async function getAllCustomerList() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllOrderSources",
      });

      if (res.data) {
        setAllOrderSources(res.data);
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
  async function addEditOrder(values) {
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    values.tracking_code = document.getElementById("tracking_code").placeholder;
    values.stock_transfer = document.getElementById("stock_transfer").checked;
    values.isPinned = document.getElementById("isPinned").checked;
    values.prices = getProductPrices(values.product);

    let funcName = userInteractionOrderId > 0 ? "editOrder" : "addNewOrder";
    values.orderId = userInteractionOrderId;

    let products = values.product;
    for (let i = 0; i < numberOfProductsInAddOrderForm; i++) {
      if (!products[i]) {
        products.push(allProductList[0].id);
      }
    }

    let quantities = values.quantity;
    for (let i = 0; i < numberOfProductsInAddOrderForm; i++) {
      if (!quantities[i]) {
        quantities.push(1);
      }
    }

    let prices = values.prices;
    for (let i = 0; i < numberOfProductsInAddOrderForm; i++) {
      if (!prices[i]) {
        prices.push(allProductList[0].price);
      }
    }

    values.quantity = quantities;
    values.product = products;
    values.prices = prices;

    let subtotals = values.subtotal;
    for (let i = 0; i < numberOfProductsInAddOrderForm; i++) {
      if (!subtotals[i]) {
        subtotals.push((prices[i] * quantities[i]).toString());
      }
    }
    values.subtotal = subtotals;

    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
      const res = await axios.post("http://localhost:80/crm/service.php", {
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

  useEffect(() => {
    getAllOrders();
    getAllAgents();
    getAllProductList();
    getAllCustomerList();
    getAllOrderSources();
    getAllDeliveryManagers();
  }, []);
  return (
    <div>
      <TopBar toggle={toggle} />
      <Tabs />
      <div className="container-fluid">
        {/*...........add order form.................*/}
        <div className="fullShadow" style={addOrderFormVisible ? { display: "flex" } : { display: "none" }}>
          <div className="addOrderFormBg">
            <Formik
              initialValues={getAddOrderInitialValues()}
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
                    <div>
                      <div className="form-outline" style={{ width: "28%", float: "left", padding: "0px 10px" }}>
                        <label className="form-custom-label">Customer Name</label>
                        <Field
                          as="select"
                          name="customer_id"
                          className="select form-control-lg"
                          style={{ width: "100%" }}>
                          {allCustomerList &&
                            allCustomerList.map((customer, index) => (
                              <option key={index} value={customer.id}>
                                {customer.name}
                              </option>
                            ))}
                        </Field>
                      </div>

                      <div style={{ float: "left", width: "5%" }}>
                        <label className="form-custom-label">&nbsp;</label>
                        <button className="btn btn-secondary btn-lg" type="button" style={{ lineHeight: "24px" }}>
                          +
                        </button>
                      </div>

                      <div className="form-outline" style={{ width: "33%", float: "left", padding: "0px 10px" }}>
                        <label className="form-custom-label">Delivery Service: </label>
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
                      <div className="form-outline" style={{ width: "33%", float: "left", padding: "0px 10px" }}>
                        <label className="form-custom-label">
                          Paid by Customer (shipping)
                          <AiFillInfoCircle />
                        </label>
                        <Field type="text" name="shipping" placeholder="0" className="form-control form-control-lg" />
                      </div>
                    </div>

                    {/*.........row 2..............*/}
                    <div>
                      <div className="form-outline" style={{ width: "33%", float: "left", padding: "0px 10px" }}>
                        <label className="form-custom-label">Conformation Status: </label>
                        <Field
                          as="select"
                          name="conformation_status"
                          className="select form-control-lg"
                          style={{ width: "100%" }}>
                          {allConformationStatuses &&
                            allConformationStatuses.map((cnf, index) => (
                              <option key={index} value={cnf}>
                                {cnf}
                              </option>
                            ))}
                        </Field>
                      </div>

                      <div className="form-outline" style={{ width: "33%", float: "left", padding: "0px 10px" }}>
                        <label className="form-custom-label">Delivery Status: </label>
                        <Field
                          as="select"
                          name="delivery_status"
                          className="select form-control-lg"
                          style={{ width: "100%" }}>
                          {allDeliveryStatuses &&
                            allDeliveryStatuses.map((dl, index) => (
                              <option key={index} value={dl}>
                                {dl}
                              </option>
                            ))}
                        </Field>
                      </div>

                      <div className="form-outline" style={{ width: "33%", float: "left", padding: "0px 10px" }}>
                        <label className="form-custom-label">
                          Shipping Cost
                          <AiFillInfoCircle />
                        </label>
                        <Field
                          type="text"
                          name="shipping_cost"
                          placeholder="0"
                          className="form-control form-control-lg"
                        />
                      </div>
                    </div>
                    {/*.........row 3..............*/}
                    <div>
                      <div className="form-outline" style={{ width: "50%", float: "left", padding: "0px 10px" }}>
                        <label className="form-custom-label">Delivery Service Note: </label>
                        <Field
                          as="textarea"
                          name="delivery_note"
                          className="select form-control-lg"
                          style={{ width: "100%" }}
                        />
                      </div>

                      <div className="form-outline" style={{ width: "50%", float: "right", padding: "0px 10px" }}>
                        <label className="form-custom-label">Your Note: </label>
                        <Field as="textarea" name="note" className="select form-control-lg" style={{ width: "100%" }} />
                      </div>
                    </div>
                    {/*.........row 4..............*/}
                    <div style={{ marginBottom: "10px" }}>
                      <div>
                        <div className="form-outline" style={{ width: "28%", float: "left", padding: "0px 10px" }}>
                          <label className="form-custom-label">Tracking Code</label>
                          <Field
                            type="text"
                            name="tracking_code"
                            disabled
                            id="tracking_code"
                            placeholder={trackingCode}
                            className="form-control form-control-lg"
                          />
                        </div>
                        <div style={{ float: "left", width: "5%" }}>
                          <label className="form-custom-label">&nbsp;</label>
                          <button
                            style={{ lineHeight: "15px" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={() => {
                              setTrackingCode(getRandomTrackingCode());
                            }}>
                            <AiOutlineReload />
                          </button>
                        </div>
                      </div>
                      <div className="form-outline" style={{ width: "33%", float: "left", padding: "0px 10px" }}>
                        <label className="form-custom-label">Source: </label>
                        <Field
                          as="select"
                          name="order_source"
                          className="select form-control-lg"
                          style={{ width: "100%" }}>
                          {allOrderSources &&
                            allOrderSources.map((src, index) => (
                              <option key={index} value={src.source}>
                                {src.source}
                              </option>
                            ))}
                        </Field>
                      </div>
                      <div
                        className="form-outline"
                        style={{ width: "33%", float: "left", padding: "0px 10px", height: "66px" }}>
                        <div className="form-custom-label" style={{ fontWeight: "bold", paddingBottom: "6px" }}>
                          Stock Transfer: <AiFillInfoCircle />
                        </div>
                        <div style={{ width: "30%", float: "left" }}>
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
                              setNumberOfProductsInAddOrderForm(numberOfProductsInAddOrderForm + 1);
                            }}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    {/*.........product list here................*/}
                    <hr style={{ width: "90%", marginBottom: "10px" }} />
                    <div>
                      {Array(numberOfProductsInAddOrderForm)
                        .fill(1)
                        .map((el, i) => (
                          <ProductRowInOrder
                            selectedProduct={getAddOrderInitialValues().product[i]}
                            quantity={getAddOrderInitialValues().quantity[i]}
                            subtotal={getAddOrderInitialValues().subtotal[i]}
                            product_index={i}
                            key={i}
                            allProductList={allProductList}
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
        </div>
        {/*...........delete confirm.................*/}
        <div className="fullShadow" style={deleteConfirmVisible ? { display: "flex" } : { display: "none" }}>
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
        </div>
        {/*.............view order....................*/}
        <div className="fullShadow" style={orderDetailsPageVisible ? { display: "flex" } : { display: "none" }}>
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
        </div>
        {/*...........assign order to.................*/}
        <div className="fullShadow" style={assignOrderVisible ? { display: "flex" } : { display: "none" }}>
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

                  <button style={{ width: "40%", marginLeft: "20px" }} className="btn btn-primary btn-lg" type="submit">
                    Save
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>

        {/*...........status history.................*/}
        <div className="fullShadow" style={statusHistoryVisible ? { display: "flex" } : { display: "none" }}>
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
        </div>

        {/*....conformation status change.....*/}
        <div className="fullShadow" style={statusChangeVisible ? { display: "flex" } : { display: "none" }}>
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
                      <Field as="textarea" name="note" className="select form-control-lg" style={{ width: "100%" }} />
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
        </div>

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
                      <Field type="text" name="search" placeholder="Search" className="form-control form-control-lg" />
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
                        setUserInteractionOrderId(id);
                        updateOrderDetails(id);
                        setAddOrderFormVisible(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
