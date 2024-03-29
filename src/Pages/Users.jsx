import { Backdrop, Card } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { Autocomplete, TextField } from "formik-mui";
import React, { useEffect, useState } from "react";
import { BiPhone, BiRefresh, BiSearch, BiUser } from "react-icons/bi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { TiWarning } from "react-icons/ti";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import * as Yup from "yup";
import "../App.css";
import CustomEditIcon from "../Components/CustomEditIcon";
import { SERVER_URL } from "../Constants/AppConstants";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

export default function Users({ toggle, type }) {
  const [allUsers, setAllUsers] = useState([]);
  const [allOrdersOfTheAgent, setAllOrdersOfTheAgent] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [addUserFormVisible, setAddUserFormVisible] = useState(false);
  const [showAgentProfileVisible, setShowAgentProfileVisible] = useState(false);
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(-100);
  const [deleteConformationVisible, setDeleteConformationVisible] = useState(false);

  const ALL_USER_TYPES = ["Admin", "Agent", "Deliverer", "Delivery Manager"];

  useEffect(() => {
    getAllUsers();
    getAllCountryList();
    let permData = JSON.parse(sessionStorage.getItem("ALL_PERMISSIONS"));
    setAllPermissions(permData);
  }, [type]);

  function deleteNavPressed(id) {
    console.log("going to delete user with id " + id);
    setSelectedUserId(id);
    setSelectedUser(getUserDetailsForId(id));
    setDeleteConformationVisible(true);
  }
  function editNavPressed(id) {
    console.log("going to edit user with id " + id);
    let userDetails = getUserDetailsForId(id);
    setSelectedUserId(id);
    setSelectedUser(userDetails);
    setAddUserFormVisible(true);
  }
  function showProfilePressed(id) {
    console.log("showing profile for agent " + id);
    let userDetails = getUserDetailsForId(id);
    setSelectedUserId(id);
    getAllOrdersFromAgent(id);
    setSelectedUser(userDetails);
    setShowAgentProfileVisible(true);
  }

  async function getAllOrdersFromAgent(id) {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllOrders",
        agentId: id,
        searchTerm: "",
      });
      console.log(res);

      let statusCounts = [];
      let foundStatuses = [];
      if (res.data) {
        let resData = JSON.parse(JSON.stringify(res.data));

        for (let i = 0; i < resData.length; i++) {
          if (foundStatuses.indexOf(resData[i].finalSearchedStatus) >= 0) {
            let pos = foundStatuses.indexOf(resData[i].finalSearchedStatus);
            statusCounts[pos].orders++;
          } else {
            let newStatus = {};
            newStatus.name = resData[i].finalSearchedStatus;
            newStatus.orders = 1;
            statusCounts.push(newStatus);
            foundStatuses.push(newStatus.name);
          }
        }
        setAllOrdersOfTheAgent(resData);
        setStatusCounts(statusCounts);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function getSatusCountFor(status) {
    for (let i = 0; i < statusCounts.length; i++) {
      if (statusCounts[i].name == status) {
        console.log(statusCounts[i]);
        return statusCounts[i].orders;
      }
    }
    return 0;
  }
  function getUserDetailsForId(id) {
    for (let index = 0; index < allUsers.length; index++) {
      if (allUsers[index].id == id) {
        return allUsers[index];
      }
    }
    return {};
  }
  async function getAllUsers(searchTerm = "") {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllUsers",
        searchTerm: searchTerm,
        type: type,
      });
      console.log(res);
      if (res.data) {
        let resData = JSON.parse(JSON.stringify(res.data));
        setAllUsers(resData);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteTheUser() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "deleteTheUser",

        id: selectedUserId,
        uid: JSON.parse(sessionStorage.getItem("fullUserDetails")).id,
      });
      if (res.data.includes("success")) {
        setSelectedUserId(-100);
        setSelectedUser({});
        getAllUsers();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getInitialValuesForUser() {
    let details;

    if (selectedUserId >= 0) {
      details = {
        title: selectedUser.title,
        firstName: selectedUser.firstname,
        lastName: selectedUser.lastname,
        userid: selectedUser.userid,
        email: selectedUser.email,
        phone: selectedUser.phone,
        permitted_country: selectedUser.permitted_country.split(","),
        password: "",
        confirmPassword: "",
        userTypeField: selectedUser.type,
        perms: selectedUser.perms,
      };
    } else {
      details = {
        title: "Mr.",
        firstName: "",
        lastName: "",
        userid: "",
        email: "",
        phone: "",
        permitted_country: [],
        password: "",
        confirmPassword: "",
        userTypeField: "",
        perms: [],
      };
    }
    return details;
  }
  async function getAllCountryList() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllCountries",
      });

      if (res.data) {
        let countries = res.data.map((val) => {
          return val.country;
        });
        setAllCountries(countries);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function getStyleBasedOnStatus(orderStatus) {
    let style = {
      float: "left",
      backgroundColor: "gray",
      borderRadious: "6px",
      color: "white",
    };
    if (orderStatus == "New") {
      style.backgroundColor = "royalblue";
    } else if (orderStatus == "Voicemail") {
      style.backgroundColor = "dodgerblue";
    } else if (orderStatus == "Confirmed") {
      style.backgroundColor = "forestgreen";
    } else if (orderStatus == "Postponed") {
      style.backgroundColor = "lightslategray";
    } else if (orderStatus == "Cancelled") {
      style.backgroundColor = "red";
    } else if (orderStatus == "No Answer") {
      style.backgroundColor = "blueviolet";
    } else if (orderStatus == "Wrong Number") {
      style.backgroundColor = "crimson";
    } else if (orderStatus == "Processed") {
      style.backgroundColor = "forestgreen";
    } else if (orderStatus == "Pending") {
      style.backgroundColor = "#c09";
    } else if (orderStatus == "Unready") {
      style.backgroundColor = "cornflowerblue";
    } else if (orderStatus == "Returned") {
      style.backgroundColor = "crimson";
    }
    return style;
  }
  async function searchOrdersForAgents(values) {
    console.log("searchOrdersForAgents");
    console.log(values);
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllOrders",
        start_date: values.start_date,
        end_date: values.end_date,
        which_status: values.which_status,
        agentId: selectedUserId,
        searchTerm: "",
      });

      console.log(res);
      if (res.data) {
        let resData = JSON.parse(JSON.stringify(res.data));
        setAllOrdersOfTheAgent(resData);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function submitForm(formData, resetFormFunc) {
    formData.uid = selectedUserId;
    console.log(formData);

    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: selectedUserId >= 0 ? "editUserDetails" : "registerUser",
        formData: JSON.stringify(formData),
      });

      if (res.data.includes("success")) {
        setAddUserFormVisible(false);
        setSelectedUserId(-100);
        resetFormFunc(getInitialValuesForUser());
        getAllUsers();
      }
    } catch (error) {
      console.log(error);
    }
  }
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const SignupSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    firstName: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
    phone: Yup.string().required("Enter Phone Number").matches(phoneRegExp, "Phone number is not valid"),
    userTypeField: Yup.string().required("Required"),
    lastName: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
    userid: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too Short!").max(12, "Too Long!").required("Enter password"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  var loggedIn = sessionStorage.getItem("uid");

  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <Tabs />
          <div className="container-fluid">
            {/*........................agent profile..............................*/}
            <Backdrop
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                overflowY: "scroll",
              }}
              open={showAgentProfileVisible}>
              <div className="agentProfilePage">
                <div style={{ height: "50px" }}>
                  <h5 style={{ float: "left" }}>
                    Agent Profile: {selectedUser.title + " " + selectedUser.firstname + " " + selectedUser.lastname}
                  </h5>
                  <div
                    className="xButton"
                    style={{
                      float: "right",
                      width: "40px",
                      height: "40px",
                      borderRadius: "20px",
                      border: "1px solid black",
                    }}
                    onClick={() => {
                      setShowAgentProfileVisible(false);
                    }}>
                    <h3>x</h3>
                  </div>
                </div>

                <div style={{ float: "right", width: "60%", height: "180px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart width={500} height={40} data={statusCounts}>
                      <Bar dataKey="orders">
                        {statusCounts &&
                          statusCounts.map((entry, index) => (
                            <Cell cursor="pointer" fill={"#82ca9d"} key={`cell-${index}`} />
                          ))}
                      </Bar>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <strong>email: </strong>
                  {selectedUser.email}
                </div>
                <div>
                  <strong>Allowed Countries: </strong>
                  {selectedUser.permitted_country}
                </div>

                <div style={{ minHeight: "70px", width: "40%" }}>
                  <Formik
                    enableReinitialize
                    initialValues={{ start_date: "", end_date: "", which_status: "" }}
                    onSubmit={(values) => {
                      searchOrdersForAgents(values);
                    }}>
                    <Form>
                      <div>
                        <div className="form-outline" style={{ float: "left", marginRight: "6px", width: "27%" }}>
                          <label className="form-custom-label">Start Date: </label>
                          <Field
                            type="date"
                            name="start_date"
                            placeholder="Date"
                            className="form-control form-control-lg"
                          />
                        </div>
                        <div className="form-outline" style={{ float: "left", marginRight: "6px", width: "27%" }}>
                          <label className="form-custom-label">End Date: </label>
                          <Field
                            type="date"
                            name="end_date"
                            placeholder="Date"
                            className="form-control form-control-lg"
                          />
                        </div>
                        <div className="form-outline" style={{ float: "left", marginRight: "6px", width: "28%" }}>
                          <label className="form-custom-label">Type: </label>
                          <Field
                            as="select"
                            name="which_status"
                            className="select form-control-lg"
                            style={{ width: "100%" }}>
                            <option value="delivery_status">Delivery Status</option>
                            <option value="conformation_status">Conformation Status</option>
                          </Field>
                        </div>
                        <div style={{ float: "left", width: "13%" }}>
                          <button
                            type="submit"
                            className="btn btn-secondary"
                            style={{ padding: "7px 9px", marginTop: "24px" }}>
                            <BiSearch />
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
                <div style={{ marginTop: "70px" }}>
                  {getSatusCountFor("Processed") > 0 && (
                    <div className="agentOrderSummery" style={getStyleBasedOnStatus("Processed")}>
                      Processed: {selectedUserId >= 0 && getSatusCountFor("Processed")}
                    </div>
                  )}

                  {getSatusCountFor("Cancelled") > 0 && (
                    <div className="agentOrderSummery" style={getStyleBasedOnStatus("Cancelled")}>
                      Cancelled: {selectedUserId >= 0 && getSatusCountFor("Cancelled")}
                    </div>
                  )}
                  {getSatusCountFor("No Answer") > 0 && (
                    <div className="agentOrderSummery" style={getStyleBasedOnStatus("No Answer")}>
                      No answer: {selectedUserId >= 0 && getSatusCountFor("No Answer")}
                    </div>
                  )}
                  {getSatusCountFor("Pending") > 0 && (
                    <div className="agentOrderSummery" style={getStyleBasedOnStatus("Pending")}>
                      Pending: {selectedUserId >= 0 && getSatusCountFor("Pending")}
                    </div>
                  )}
                  {getSatusCountFor("Postponed") > 0 && (
                    <div className="agentOrderSummery" style={getStyleBasedOnStatus("Postponed")}>
                      Postponed: {selectedUserId >= 0 && getSatusCountFor("Postponed")}
                    </div>
                  )}
                  {getSatusCountFor("Unready") > 0 && (
                    <div className="agentOrderSummery" style={getStyleBasedOnStatus("Unready")}>
                      Unready: {selectedUserId >= 0 && getSatusCountFor("Unready")}
                    </div>
                  )}
                  {getSatusCountFor("Returned") > 0 && (
                    <div className="agentOrderSummery" style={getStyleBasedOnStatus("Returned")}>
                      Returned: {selectedUserId >= 0 && getSatusCountFor("Returned")}
                    </div>
                  )}

                  {getSatusCountFor("Voicemail") > 0 && (
                    <div className="agentOrderSummery" style={getStyleBasedOnStatus("Voicemail")}>
                      Voicemail: {selectedUserId >= 0 && getSatusCountFor("Voicemail")}
                    </div>
                  )}
                  {getSatusCountFor("Wrong Number") > 0 && (
                    <div className="agentOrderSummery" style={getStyleBasedOnStatus("Wrong Number")}>
                      Wrong Number: {selectedUserId >= 0 && getSatusCountFor("Wrong Number")}
                    </div>
                  )}
                  {getSatusCountFor("Confirmed") > 0 && (
                    <div className="agentOrderSummery" style={getStyleBasedOnStatus("Confirmed")}>
                      Confirmed: {selectedUserId >= 0 && getSatusCountFor("Confirmed")}
                    </div>
                  )}
                </div>

                <div style={{ height: "270px", overflowY: "scroll", float: "left", width: "100%" }}>
                  <table className="table table-striped">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Ref</th>
                        <th scope="col">Date</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Products</th>
                        <th scope="col">Total</th>
                        <th scope="col">Confirmation Status</th>
                        <th scope="col">Delivery Status</th>
                      </tr>
                    </thead>

                    <tbody style={{ whiteSpace: "pre-line" }}>
                      {allOrdersOfTheAgent &&
                        allOrdersOfTheAgent.map((order, index) => (
                          <tr key={index}>
                            <td>{order.id}</td>
                            <td>{order.createdat}</td>
                            <td>{order.customerDetails.name}</td>
                            <td>{order.allProductsString}</td>
                            <td>{order.total}</td>
                            <td>{order.statuses[order.statuses.length - 1].conformation_status}</td>
                            <td>{order.statuses[order.statuses.length - 1].delivery_status}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Backdrop>

            {/*........................delete user..............................*/}
            <Backdrop
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                overflowY: "scroll",
              }}
              open={deleteConformationVisible}>
              <div className="deleteOrderConfirmBg">
                <div>
                  <h4>Warning</h4>
                </div>
                <div style={{ float: "left" }}>
                  <TiWarning />
                </div>
                <div style={{ paddingLeft: "15px", float: "left" }}>Are you sure you want to delete the User?</div>
                <div style={{ float: "right", width: "100%", padding: "15px 0px" }}>
                  <button
                    style={{ width: "40%" }}
                    className="btn btn-secondary btn-lg"
                    type="button"
                    onClick={() => {
                      setDeleteConformationVisible(false);
                    }}>
                    Cancel
                  </button>

                  <button
                    style={{ width: "40%", marginLeft: "20px" }}
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      setDeleteConformationVisible(false);
                      deleteTheUser();
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            </Backdrop>
            {/*..........................add user................................*/}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={addUserFormVisible}>
              <Card className="addUserFormBg">
                <Formik
                  enableReinitialize
                  validationSchema={SignupSchema}
                  initialValues={getInitialValuesForUser()}
                  onSubmit={(values, { resetForm }) => {
                    console.log("should submit the form..");
                    submitForm(values, resetForm);
                  }}>
                  <Form>
                    <div style={{ width: "100%", height: "570px" }}>
                      <div className="add-user-form">
                        <div className="details-legend2">
                          <p style={{ padding: "5px 12px 0px 0px" }}>
                            {type == "all" ? "User Details" : "Agent Details"}
                          </p>
                        </div>
                        {/*................title......................*/}
                        <div style={{ margin: "10px 0px" }}>
                          <div className="form-outline" style={{ width: "20%", float: "left", paddingRight: "1%" }}>
                            <Field
                              name="title"
                              component={Autocomplete}
                              options={["Mr.", "Mrs."]}
                              style={{ width: "100%" }}
                              renderInput={(params) => {
                                const inputProps = params.inputProps;
                                inputProps.autoComplete = "disabled";
                                return (
                                  <MuiTextField
                                    {...params}
                                    inputProps={inputProps}
                                    name="title"
                                    label="Title"
                                    variant="outlined"
                                    fullWidth
                                    required
                                  />
                                );
                              }}
                            />
                          </div>

                          <div
                            className="form-outline"
                            style={{
                              width: "40%",
                              float: "left",
                              paddingRight: "1%",
                            }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="firstName"
                              required
                              autoComplete="disabled"
                              label="First Name"
                              className="form-control form-control-lg"
                            />
                          </div>

                          <div className="form-outline" style={{ width: "40%", float: "left" }}>
                            <Field
                              type="text"
                              required
                              component={TextField}
                              name="lastName"
                              autoComplete="disabled"
                              label="Last Name"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>
                        <div
                          className="form-outline"
                          style={{
                            marginTop: "10px",
                            float: "left",
                            width: "100%",
                            marginBottom: "10px",
                          }}>
                          <Field
                            type="text"
                            required
                            component={TextField}
                            name="userid"
                            autoComplete="disabled"
                            label="User Id"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ paddingTop: "10px" }}>
                          <Field
                            type="text"
                            required
                            component={TextField}
                            name="phone"
                            autoComplete="disabled"
                            label="Phone"
                            className="form-control form-control-lg"
                          />
                        </div>

                        {type == "all" && (
                          <div className="form-outline" style={{ paddingTop: "10px" }}>
                            <Field
                              name="userTypeField"
                              component={Autocomplete}
                              options={ALL_USER_TYPES}
                              style={{ width: "100%" }}
                              renderInput={(params) => {
                                const inputProps = params.inputProps;
                                inputProps.autoComplete = "disabled";
                                return (
                                  <MuiTextField
                                    {...params}
                                    inputProps={inputProps}
                                    name="userTypeField"
                                    label="User Type"
                                    variant="outlined"
                                    required
                                    fullWidth
                                  />
                                );
                              }}
                            />
                          </div>
                        )}

                        {type == "agent" && (
                          <div className="form-outline" style={{ paddingTop: "10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="userType"
                              disabled
                              value={"Agent"}
                              autoComplete="disabled"
                              label="User Type"
                              className="form-control form-control-lg"
                            />
                          </div>
                        )}

                        <div className="form-outline" style={{ paddingTop: "10px" }}>
                          <Field
                            type="email"
                            required
                            component={TextField}
                            name="email"
                            autoComplete="disabled"
                            label="eMail"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ paddingTop: "10px" }}>
                          <Field
                            type="password"
                            required
                            component={TextField}
                            name="password"
                            autoComplete="disabled"
                            label="Password"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ paddingTop: "10px" }}>
                          <Field
                            type="password"
                            component={TextField}
                            name="confirmPassword"
                            autoComplete="disabled"
                            label="Confirm Password"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ paddingTop: "10px" }}>
                          <Field
                            name="permitted_country"
                            component={Autocomplete}
                            options={allCountries}
                            multiple
                            style={{ width: "100%" }}
                            renderInput={(params) => {
                              const inputProps = params.inputProps;
                              inputProps.autoComplete = "disabled";
                              return (
                                <MuiTextField
                                  {...params}
                                  inputProps={inputProps}
                                  name="permitted_country"
                                  label="Allowed Countries: "
                                  variant="outlined"
                                  fullWidth
                                />
                              );
                            }}
                          />
                        </div>
                      </div>

                      {/*..........permissions.....here................*/}
                      <div className="add-user-perm">
                        <div className="permission-legend2">
                          <p style={{ padding: "5px 12px 0px 0px" }}>Permissions</p>
                        </div>

                        <div>
                          {allPermissions &&
                            allPermissions.map((perm, index) => (
                              <div className="permission-checkbox" key={index}>
                                <Field type="checkbox" value={perm.id} name="perms" />
                                <label className="form-custom-label" style={{ fontSize: "16px", paddingLeft: "5px" }}>
                                  {perm.details}
                                </label>
                              </div>
                            ))}
                        </div>
                        <div style={{ width: "100%", float: "right", marginTop: "19px" }}>
                          <button
                            style={{ width: "47%", float: "left" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={() => {
                              setAddUserFormVisible(false);
                            }}>
                            Cancel
                          </button>
                          <button
                            style={{ width: "47%", float: "right" }}
                            className="btn btn-primary btn-lg"
                            type="submit">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </Card>
            </Backdrop>

            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">
                    <Formik
                      enableReinitialize
                      initialValues={{ search: "" }}
                      onSubmit={(values) => {
                        getAllUsers(values.search);
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
                  <th scope="col" style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: "7px 9px" }}
                      onClick={() => {
                        setSelectedUserId(-100);
                        getAllUsers();
                      }}>
                      <BiRefresh />
                    </button>
                  </th>

                  <th scope="col" style={{ textAlign: "left" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: "7px 9px" }}
                      onClick={() => {
                        setSelectedUserId(-100);
                        setSelectedUser({});
                        setAddUserFormVisible(true);
                      }}>
                      <BsFillPersonPlusFill /> {type == "all" ? "Add User" : "Add Agent"}
                    </button>
                  </th>
                </tr>
                <tr>
                  <th scope="col">{type == "all" ? "User Id" : "Agent ID"}</th>
                  <th scope="col">Country</th>
                  <th scope="col">email</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {allUsers &&
                  allUsers.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ float: "left", marginRight: "8px" }}>
                          <BiUser /> {user.userid}{" "}
                        </div>
                        {type == "all" && (
                          <div
                            style={{
                              backgroundColor: "skyblue",
                              padding: "0px 3px",
                              borderRadius: "3px",
                              float: "left",
                            }}>
                            {user.type}
                          </div>
                        )}
                        <br />
                        <div style={{ float: "left" }}>
                          {user.title}&nbsp;{user.firstname}&nbsp;{user.lastname}
                        </div>
                        <br />
                        <BiPhone /> <a href="tel://{user.phone}">{user.phone}</a>
                      </td>
                      <td>{user.permitted_country}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-circle btn-sm"
                          style={user.is_active == 1 ? { backgroundColor: "green" } : { backgroundColor: "red" }}>
                          {user.is_active == 1 ? "Activated" : "Deactivated"}
                        </button>
                      </td>
                      <td style={{ width: "13%" }}>
                        <CustomEditIcon
                          id={user.id}
                          deletePressedFunc={deleteNavPressed}
                          editPressedFunc={editNavPressed}
                          showProfileFunc={showProfilePressed}
                          userType={type}
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
