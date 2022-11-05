import { Backdrop } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { Autocomplete, TextField } from "formik-mui";
import React, { useEffect, useState } from "react";
import { BiPhone, BiSearch, BiUser } from "react-icons/bi";
import * as Yup from "yup";
import AddedCityToDelivererRow from "../Components/AddedCityToDelivererRow";
import CustomEditIcon from "../Components/CustomEditIcon";
import { SERVER_URL } from "../Constants/AppConstants";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

function Deliverers({ toggle, type }) {
  const [allDelivererList, setAllDelivererList] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [deleteConformationVisible, setDeleteConformationVisible] = useState(false);
  const [addCityFormVisible, setAddCityFormVisible] = useState(false);
  const [assignCityToDelivererFormVisible, setAssignCityToDelivererFormVisible] = useState(false);
  const [addDelivererVisible, setAddDelivererVisible] = useState(false);
  const [addShippingCompanyVisible, setAddShippingCompanyVisible] = useState(false);
  const [selectedDelivererId, setSelectedDelivererId] = useState(-100);
  const [cityDetailsForSelectedDeliverer, setCityDetailsForSelectedDeliverer] = useState({
    cities: [],
    del_costs: [],
    return_costs: [],
  });
  async function getAllDelivererList(searchTerm = "") {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: type == "company" ? "getAllDeliverCompanies" : "getAllDeliverers",
        searchTerm: searchTerm,
      });
      if (res.data) {
        setAllDelivererList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function cityUpdatedForDeliverer(index) {
    let city = document.getElementById("cities[" + index + "]").value;
    let del_cost = document.getElementById("del_costs[" + index + "]").value;
    let return_cost = document.getElementById("return_costs[" + index + "]").value;

    let cities = cityDetailsForSelectedDeliverer.cities;
    let delCosts = cityDetailsForSelectedDeliverer.del_costs;
    let returnCosts = cityDetailsForSelectedDeliverer.return_costs;

    cities[index] = city;
    delCosts[index] = del_cost ? del_cost : 0;
    returnCosts[index] = return_cost ? return_cost : 0;

    setCityDetailsForSelectedDeliverer({
      cities: cities,
      del_costs: delCosts,
      return_costs: returnCosts,
    });
  }

  let removeAddedCityForDeliverer = (id) => {
    let allCities = cityDetailsForSelectedDeliverer.cities;
    let allDelCosts = cityDetailsForSelectedDeliverer.del_costs;
    let allReturnCosts = cityDetailsForSelectedDeliverer.return_costs;

    allCities.splice(id, 1);
    allDelCosts.splice(id, 1);
    allReturnCosts.splice(id, 1);

    setCityDetailsForSelectedDeliverer({
      cities: allCities,
      del_costs: allDelCosts,
      return_costs: allReturnCosts,
    });
  };
  async function getAllCities() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllCities",
      });

      if (res.data) {
        let cities = res.data.map((val) => {
          return val.city;
        });
        setAllCities(cities);
        setCityDetailsForSelectedDeliverer({ cities: [res.data[0].city], del_costs: [0], return_costs: [0] });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function addNewCity(values) {
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "addNewCity",
        formData: JSON.stringify(values),
      });

      if (res.data.includes("success")) {
        setAddCityFormVisible(false);
        setAssignCityToDelivererFormVisible(true);
        getAllCities();
      }
    } catch (error) {
      console.log(error);
    }
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

  async function addEditShippingCompany(values) {
    let funcName = "addNewShippingCompany";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;

    if (selectedDelivererId >= 0) {
      funcName = "editShippingCompany";
      values.id = selectedDelivererId;
    }

    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });
      console.log(res.data);
      if (funcName == "addNewShippingCompany") {
        if (typeof res.data == "number") {
          setSelectedDelivererId(res.data);
          getAllDelivererList();
          setAddShippingCompanyVisible(false);
          setAssignCityToDelivererFormVisible(true);
        }
      } else {
        if (res.data.includes("success")) {
          setSelectedDelivererId(-100);
          getAllDelivererList();
          setAddShippingCompanyVisible(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function addEditDeliverer(values) {
    let funcName = "addNewDeliverer";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    values.isActive = document.getElementById("isActive").checked;
    values.shippingAuto = document.getElementById("shippingAuto").checked;

    if (selectedDelivererId >= 0) {
      funcName = "editDelivererDetails";
      values.id = selectedDelivererId;
    }

    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });

      if (funcName == "addNewDeliverer") {
        if (typeof res.data == "number") {
          setSelectedDelivererId(res.data);
          getAllDelivererList();
          setAddDelivererVisible(false);
          setAssignCityToDelivererFormVisible(true);
        }
      } else {
        if (res.data.includes("success")) {
          setSelectedDelivererId(-100);
          getAllDelivererList();
          setAddDelivererVisible(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteSelectedDeliverer() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "deleteSelectedDeliverer",
        deliverer_id: selectedDelivererId,
      });

      if (res.data.includes("success")) {
        setDeleteConformationVisible(false);
        getAllDelivererList();
        setSelectedDelivererId(-100);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function saveAddedCityValuesForDeliverers() {
    let stateCopy = { ...cityDetailsForSelectedDeliverer };
    stateCopy.deliverer_id = selectedDelivererId;
    stateCopy.creatorId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;

    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "saveAddedCityValuesForDeliverers",
        formData: JSON.stringify(stateCopy),
      });
      console.log(res);
      if (res.data.includes("success")) {
        setCityDetailsForSelectedDeliverer({ cities: [allCities[0]], del_costs: [0], return_costs: [0] });
        setAssignCityToDelivererFormVisible(false);
        getAllDelivererList();
      }
    } catch (error) {
      console.log(error);
    }
  }
  function addAllCitiesForSelectedDeliverer() {
    let assignedCities = cityDetailsForSelectedDeliverer.cities;
    let assignedDelCosts = cityDetailsForSelectedDeliverer.del_costs;
    let assignedReturnCosts = cityDetailsForSelectedDeliverer.return_costs;

    for (let i = 0; i < allCities.length; i++) {
      if (assignedCities.indexOf(allCities[i]) == -1) {
        assignedCities.push(allCities[i]);
        assignedDelCosts.push(0);
        assignedReturnCosts.push(0);
      }
    }

    setCityDetailsForSelectedDeliverer({
      cities: assignedCities,
      del_costs: assignedDelCosts,
      return_costs: assignedReturnCosts,
    });
  }

  function getAddShippingCompanyInitialValues() {
    if (selectedDelivererId > 0) {
      for (let i = 0; i < allDelivererList.length; i++) {
        if (allDelivererList[i].id == selectedDelivererId) {
          return {
            name: allDelivererList[i].name,
            email: allDelivererList[i].email,
            phone: allDelivererList[i].phone,
            whatsapp: allDelivererList[i].whatsapp,
            defaultShippingCost: allDelivererList[i].default_shipping_cost,
            stockAlert: allDelivererList[i].stock_alert,
          };
        }
      }
    } else {
      return {
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        defaultShippingCost: 0,
        stockAlert: 0,
      };
    }
  }
  function getAddDelivererInitialValues() {
    if (selectedDelivererId > 0) {
      for (let i = 0; i < allDelivererList.length; i++) {
        if (allDelivererList[i].id == selectedDelivererId) {
          return {
            name: allDelivererList[i].name,
            user_id: allDelivererList[i].user_id,
            country: allDelivererList[i].country,
            city: allDelivererList[i].city,
            email: allDelivererList[i].email,
            phone: allDelivererList[i].phone,
            whatsapp: allDelivererList[i].whatsapp,
            password: "",
            password_again: "",
            isActive: allDelivererList[i].status == "1",
            shippingAuto: allDelivererList[i].auto_shipping == "1",
            defaultShippingCost: allDelivererList[i].default_shipping_cost,
            stockAlert: allDelivererList[i].stock_alert,
          };
        }
      }
    } else {
      return {
        name: "",
        user_id: "",
        country: allCountries.length > 0 ? allCountries[0] : "",
        city: allCities.length > 0 ? allCities[0] : "",
        email: "",
        phone: "",
        whatsapp: "",
        password: "",
        password_again: "",
        isActive: true,
        shippingAuto: false,
        defaultShippingCost: 0,
        stockAlert: 0,
      };
    }
  }

  function deleteButtonPressed(id) {
    setSelectedDelivererId(id);
    setDeleteConformationVisible(true);
  }
  function editButtonPressed(id) {
    setSelectedDelivererId(id);

    if (type == "individual") {
      setAddDelivererVisible(true);
    } else {
      setAddShippingCompanyVisible(true);
    }
  }

  function stockButtonPressed(id) {
    console.log("will show stock for deliverer " + id);
  }
  function commissionsButtonPressed(id) {
    console.log("will show commissions for " + id);
  }
  async function citiesButtonPressed(id) {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllAssignedCitiesForDeliverer",
        delivererId: id,
      });
      console.log(res);
      if (res.data) {
        let assignedCities = [];
        let assignedDelCosts = [];
        let assignedReturnCosts = [];

        for (let i = 0; i < res.data.length; i++) {
          assignedCities.push(res.data[i].city);
          assignedDelCosts.push(res.data[i].delivery_cost);
          assignedReturnCosts.push(res.data[i].return_cost);
        }

        setSelectedDelivererId(id);
        setAssignCityToDelivererFormVisible(true);
        setCityDetailsForSelectedDeliverer({
          cities: assignedCities,
          del_costs: assignedDelCosts,
          return_costs: assignedReturnCosts,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  let validationSchema = Yup.object().shape({
    name: Yup.string().required("Required").min(3, "Minimum 3 chars").max(50, "Max 50 chars"),
    user_id: Yup.string().required("Required").min(3, "Minimum 3 chars").max(50, "Max 50 chars"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too Short!").max(12, "Too Long!").required("Enter password"),
    password_again: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
    phone: Yup.string().required("Enter Phone Number").matches(phoneRegExp, "Phone number is not valid"),
    whatsapp: Yup.string().required("Enter Phone Number").matches(phoneRegExp, "Phone number is not valid"),
    defaultShippingCost: Yup.number("Must be Number").required("Enter Default Shipping Cost"),
    stockAlert: Yup.number("Must be Number").required("Enter Default Shipping Cost"),
  });

  let shippingCompanyValidationSchema = Yup.object().shape({
    name: Yup.string().required("Required").min(3, "Minimum 3 chars").max(50, "Max 50 chars"),
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.string().required("Enter Phone Number").matches(phoneRegExp, "Phone number is not valid"),
    whatsapp: Yup.string().required("Enter Phone Number").matches(phoneRegExp, "Phone number is not valid"),
    defaultShippingCost: Yup.number("Must be Number").required("Enter Default Shipping Cost"),
    stockAlert: Yup.number("Must be Number").required("Enter Default Shipping Cost"),
  });

  useEffect(() => {
    getAllDelivererList();
    getAllCountryList();
    getAllCities();
  }, [type]);

  var loggedIn = sessionStorage.getItem("uid");

  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <Tabs />
          <div className="container-fluid">
            {/*....delete conformation.....*/}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={deleteConformationVisible}>
              <div className="deleteConformationBg">
                <div>
                  <h4>Warning</h4>
                </div>
                <div>Are you sure you want to delete this item?</div>
                <div style={{ float: "right", width: "100%", padding: "18px 0px 10px 0px" }}>
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
                    style={{ width: "40%", marginLeft: "30px" }}
                    className="btn btn-primary btn-lg"
                    type="submit"
                    onClick={deleteSelectedDeliverer}>
                    Confirm
                  </button>
                </div>
              </div>
            </Backdrop>

            {/*....add city.....*/}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={addCityFormVisible}>
              <div className="cityFormBg">
                <div style={{ padding: "0px 10px" }}>
                  <div style={{ marginBottom: "18px" }}>
                    <h2>Add new city</h2>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={{
                      city: "",
                    }}
                    onSubmit={(values) => {
                      addNewCity(values);
                    }}>
                    <Form>
                      <div className="newCityForm">
                        {/*................title......................*/}

                        <div className="form-outline" style={{ padding: "0px 10px" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="city"
                            autoComplete="disabled"
                            required
                            label="City"
                            className="form-control form-control-lg"
                          />
                        </div>
                      </div>

                      <div style={{ float: "right", width: "100%", padding: "12px 10px 3px 10px" }}>
                        <button
                          style={{ width: "40%" }}
                          className="btn btn-secondary btn-lg"
                          type="button"
                          onClick={() => {
                            setAddCityFormVisible(false);
                            setAssignCityToDelivererFormVisible(true);
                          }}>
                          Cancel
                        </button>

                        <button
                          style={{ width: "40%", marginLeft: "30px" }}
                          className="btn btn-primary btn-lg"
                          type="submit">
                          Add City
                        </button>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>

            {/*....assign city form .....*/}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={assignCityToDelivererFormVisible}>
              <div className="assignCityToDelivererBg">
                <div>
                  <div style={{ float: "left", width: "70%" }}>
                    <h4>Assign cities to delivery service</h4>
                  </div>
                  <div style={{ float: "right", width: "30%", textAlign: "right" }}>
                    <button
                      className="btn btn-primary btn-lg"
                      type="button"
                      style={{ marginRight: "6px" }}
                      onClick={() => {
                        addAllCitiesForSelectedDeliverer();
                      }}>
                      + All city
                    </button>
                    <button
                      className="btn btn-primary btn-lg"
                      type="button"
                      onClick={() => {
                        setAssignCityToDelivererFormVisible(false);
                        setAddCityFormVisible(true);
                      }}>
                      + city
                    </button>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={{
                      cities: [],
                    }}
                    onSubmit={() => {
                      saveAddedCityValuesForDeliverers();
                    }}>
                    <Form>
                      <div>
                        <table className="table table-striped">
                          <thead className="thead-dark">
                            <tr>
                              <th scope="col">City</th>
                              <th scope="col">Delivery Cost</th>
                              <th scope="col">Return Cost</th>
                              <th scope="col" style={{ width: "13%", textAlign: "right" }}>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    let allCities = cityDetailsForSelectedDeliverer.cities;
                                    let allDelCosts = cityDetailsForSelectedDeliverer.del_costs;
                                    let allReturnCosts = cityDetailsForSelectedDeliverer.return_costs;

                                    allCities.push("");
                                    allDelCosts.push(0);
                                    allReturnCosts.push(0);

                                    setCityDetailsForSelectedDeliverer({
                                      cities: allCities,
                                      del_costs: allDelCosts,
                                      return_costs: allReturnCosts,
                                    });
                                  }}>
                                  +
                                </button>
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {cityDetailsForSelectedDeliverer.cities &&
                              cityDetailsForSelectedDeliverer.cities.map((c, index) => (
                                <AddedCityToDelivererRow
                                  removeAddedCityForDeliverer={removeAddedCityForDeliverer}
                                  cityUpdatedForDeliverer={cityUpdatedForDeliverer}
                                  city={c}
                                  key={c + "_" + index}
                                  selectedCity={cityDetailsForSelectedDeliverer.cities[index]}
                                  index={index}
                                  delivery_cost={cityDetailsForSelectedDeliverer.del_costs[index]}
                                  return_cost={cityDetailsForSelectedDeliverer.return_costs[index]}
                                  allCities={allCities}
                                />
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ textAlign: "center", marginTop: "12px" }}>
                        <button
                          style={{ width: "20%" }}
                          className="btn btn-secondary btn-lg"
                          type="button"
                          onClick={() => {
                            setAssignCityToDelivererFormVisible(false);
                          }}>
                          Cancel
                        </button>

                        <button
                          style={{ width: "20%", marginLeft: "30px" }}
                          className="btn btn-primary btn-lg"
                          type="submit">
                          Save
                        </button>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>
            {/*.......add Deliverer form here....... */}
            <Backdrop
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                overflowY: "scroll",
              }}
              open={addDelivererVisible}>
              <div className="delivererFormBg">
                <div style={{ padding: "0px 10px" }}>
                  <div>
                    <h2>Create New Deliverer</h2>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={getAddDelivererInitialValues()}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                      addEditDeliverer(values);
                    }}>
                    <Form>
                      <div className="newDelivererForm">
                        {/*................title......................*/}
                        <div style={{ height: "100px" }}>
                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="name"
                              autoComplete="disabled"
                              label={type == "company" ? "Company Name" : "Deliverer Name"}
                              className="form-control form-control-lg"
                            />
                          </div>

                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="user_id"
                              autoComplete="disabled"
                              label="Login Id"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>
                        <div style={{ height: "100px" }}>
                          <div className="form-outline" style={{ width: "25%", float: "left", padding: "10px 10px" }}>
                            <Field
                              name="country"
                              component={Autocomplete}
                              options={allCountries}
                              style={{ width: "100%" }}
                              getOptionLabel={(option) => option || ""}
                              renderInput={(params) => {
                                const inputProps = params.inputProps;
                                inputProps.autoComplete = "disabled";
                                return (
                                  <MuiTextField
                                    {...params}
                                    inputProps={inputProps}
                                    name="country"
                                    label="Country"
                                    variant="outlined"
                                    fullWidth
                                  />
                                );
                              }}
                            />
                          </div>

                          <div className="form-outline" style={{ width: "25%", float: "left", padding: "10px 10px" }}>
                            <Field
                              name="city"
                              component={Autocomplete}
                              options={allCities}
                              style={{ width: "100%" }}
                              getOptionLabel={(option) => option || ""}
                              renderInput={(params) => {
                                const inputProps = params.inputProps;
                                inputProps.autoComplete = "disabled";
                                return (
                                  <MuiTextField
                                    {...params}
                                    inputProps={inputProps}
                                    name="city"
                                    label="City"
                                    variant="outlined"
                                    fullWidth
                                  />
                                );
                              }}
                            />
                          </div>
                          <div className="form-outline" style={{ width: "50%", float: "right", padding: "10px 10px" }}>
                            <Field
                              type="email"
                              component={TextField}
                              name="email"
                              required
                              autoComplete="disabled"
                              label="email"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>
                        <div style={{ height: "100px" }}>
                          <div className="form-outline" style={{ width: "50%", float: "right", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="phone"
                              required
                              autoComplete="disabled"
                              label="Phone"
                              className="form-control form-control-lg"
                            />
                          </div>

                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="whatsapp"
                              required
                              autoComplete="disabled"
                              label="WhatsApp"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>

                        <div style={{ height: "100px" }}>
                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="password"
                              component={TextField}
                              name="password"
                              autoComplete="disabled"
                              label="Password"
                              className="form-control form-control-lg"
                            />
                          </div>
                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="password"
                              component={TextField}
                              name="password_again"
                              autoComplete="disabled"
                              label="Password Again"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>

                        <div style={{ height: "60px" }}>
                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <div
                              style={{
                                border: "1px solid lightgray",
                                borderRadius: "4px",
                                minHeight: "42px",
                                padding: "3px 12px",
                              }}>
                              <div style={{ float: "left", paddingTop: "4px" }}>
                                <b style={{ paddingRight: "12px" }}>Status:</b> Inactive
                              </div>
                              <div style={{ float: "left", margin: "0px 20px" }}>
                                <label className="switch">
                                  <input type="checkbox" id="isActive" name="isActive" />
                                  <span className="slider round"></span>
                                </label>
                              </div>
                              <div style={{ float: "left", paddingTop: "4px" }}>Active</div>
                            </div>
                          </div>

                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <div
                              style={{
                                border: "1px solid lightgray",
                                borderRadius: "4px",
                                minHeight: "42px",
                                padding: "3px 12px",
                              }}>
                              <div style={{ float: "left", paddingTop: "4px" }}>
                                <b style={{ paddingRight: "12px" }}>Shipping cost: </b> Manual
                              </div>
                              <div style={{ float: "left", margin: "0px 20px" }}>
                                <label className="switch">
                                  <input type="checkbox" id="shippingAuto" name="shippingAuto" />
                                  <span className="slider round"></span>
                                </label>
                              </div>
                              <div style={{ float: "left", paddingTop: "4px" }}>Automatic</div>
                            </div>
                          </div>
                        </div>

                        <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                          <Field
                            type="number"
                            component={TextField}
                            name="defaultShippingCost"
                            autoComplete="disabled"
                            label="Default Shipping Cost (DH)"
                            className="form-control form-control-lg"
                          />
                        </div>
                        <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                          <Field
                            type="number"
                            component={TextField}
                            name="stockAlert"
                            autoComplete="disabled"
                            label="Stock Alert"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div style={{ float: "right", width: "100%", padding: "12px 10px 3px 10px" }}>
                          <button
                            style={{ width: "20%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={() => {
                              setAddDelivererVisible(false);
                            }}>
                            Cancel
                          </button>

                          <button
                            style={{ width: "20%", marginLeft: "30px" }}
                            className="btn btn-primary btn-lg"
                            type="submit">
                            {selectedDelivererId > 0 ? "Edit Deliverer" : "Add Deliverer"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>

            {/*.......add shipping company form here....... */}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={addShippingCompanyVisible}>
              <div className="shippingFormBg">
                <div style={{ padding: "10px 10px" }}>
                  <div>
                    <h2>Create New Shipping Company</h2>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={getAddShippingCompanyInitialValues()}
                    enableReinitialize
                    validationSchema={shippingCompanyValidationSchema}
                    onSubmit={(values) => {
                      addEditShippingCompany(values);
                    }}>
                    <Form>
                      <div className="newDelivererForm">
                        {/*................title......................*/}
                        <div style={{ height: "100px" }}>
                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="name"
                              autoComplete="disabled"
                              label="Company Name"
                              className="form-control form-control-lg"
                            />
                          </div>

                          <div className="form-outline" style={{ width: "50%", float: "right", padding: "10px 10px" }}>
                            <Field
                              type="email"
                              component={TextField}
                              name="email"
                              autoComplete="disabled"
                              label="email"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>

                        <div style={{ height: "100px" }}>
                          <div className="form-outline" style={{ width: "50%", float: "right", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="phone"
                              autoComplete="disabled"
                              label="Phone"
                              className="form-control form-control-lg"
                            />
                          </div>

                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="whatsapp"
                              autoComplete="disabled"
                              label="WhatsApp"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>
                        <div style={{ height: "100px" }}>
                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="number"
                              component={TextField}
                              name="defaultShippingCost"
                              autoComplete="disabled"
                              label="Default shipping cost (DH)"
                              className="form-control form-control-lg"
                            />
                          </div>
                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="number"
                              component={TextField}
                              name="stockAlert"
                              autoComplete="disabled"
                              label="Stock Alert"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>

                        <div style={{ float: "right", width: "100%", padding: "32px 10px 3px 10px" }}>
                          <button
                            style={{ width: "20%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={() => {
                              setAddShippingCompanyVisible(false);
                            }}>
                            Cancel
                          </button>

                          <button
                            style={{ width: "20%", marginLeft: "30px" }}
                            className="btn btn-primary btn-lg"
                            type="submit">
                            {selectedDelivererId > 0 ? "Edit Company" : "Add Company"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>

            {/* .......list all deliverers or companies...... */}

            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col" colSpan={3}>
                    <Formik
                      enableReinitialize
                      initialValues={{ search: "" }}
                      onSubmit={(values) => {
                        getAllDelivererList(values.search);
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

                  <th scope="col" style={{ textAlign: "right" }} colSpan={3}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: "7px 10px" }}
                      onClick={() => {
                        setSelectedDelivererId(-100);
                        if (type == "company") {
                          setAddShippingCompanyVisible(true);
                        } else {
                          setAddDelivererVisible(true);
                        }
                      }}>
                      {type == "company" ? "+ Add Company" : "+ Add Deliverer"}
                    </button>
                  </th>
                </tr>
                <tr>
                  <th scope="col">Deliverer Name</th>
                  <th scope="col">email</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Delivery Rate</th>
                  <th scope="col">Total Debit</th>
                  <th scope="col">Default Shipping Cost</th>
                  {type == "individual" && <th scope="col">Status</th>}

                  <th scope="col" style={{ width: "13%" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {allDelivererList &&
                  allDelivererList.map((deliverer, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ float: "left", marginRight: "8px" }}>
                          <BiUser /> {deliverer.user_id}{" "}
                        </div>
                        <br />
                        <div style={{ float: "left" }}>{deliverer.name}</div>
                        <br />
                        <BiPhone /> <a href="tel://{user.phone}">{deliverer.phone}</a>
                      </td>
                      <td>{deliverer.email}</td>
                      <td>Alert quantity: {deliverer.stock_alert}</td>
                      <td>0%</td>
                      <td>TD: 0</td>
                      <td>{deliverer.default_shipping_cost}</td>
                      {type == "individual" && (
                        <td>
                          <button
                            type="button"
                            className="btn btn-secondary btn-circle btn-sm"
                            style={deliverer.status == 1 ? { backgroundColor: "green" } : { backgroundColor: "red" }}>
                            {deliverer.status == 1 ? "Activated" : "Deactivated"}
                          </button>
                        </td>
                      )}

                      <td>
                        {/*.....Actions here.........*/}
                        <CustomEditIcon
                          id={deliverer.id}
                          deletePressedFunc={deleteButtonPressed}
                          editPressedFunc={editButtonPressed}
                          citiesPressedFunc={citiesButtonPressed}
                          stockPressedFunc={stockButtonPressed}
                          commissionsPressedFunc={commissionsButtonPressed}
                          userType="deliverer"
                        />
                        {/*....Actions End Here......*/}
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

export default Deliverers;
