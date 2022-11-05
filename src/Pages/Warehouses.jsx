import { Backdrop } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { Autocomplete, TextField } from "formik-mui";
import React, { useEffect, useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import * as Yup from "yup";
import WarehouseBlock from "../Components/WarehouseBlock";
import { SERVER_URL } from "../Constants/AppConstants";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

export default function Warehouses({ toggle }) {
  const [allWarehouseList, setAllWarehouseList] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [addCityFormVisible, setAddCityFormVisible] = useState(false);
  const [addWarehouseVisible, setAddWarehouseFormVisibility] = useState(false);
  const [warehouseStockVisible, setWarehouseStockVisibility] = useState(false);
  const [deleteConformationVisible, setDeleteConformationVisibility] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(-100);

  async function getAllWarehouseList(searchKey = "") {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllWarehouse",
        searchKey: searchKey,
      });
      console.log(res.data);
      if (res.data) {
        setAllWarehouseList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllCities() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllCities",
      });

      if (res.data) {
        let cities = res.data.map((val) => val.city);
        setAllCities(cities);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function addNewCity(values, resetFormFunc) {
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "addNewCity",
        formData: JSON.stringify(values),
      });

      if (res.data.includes("success")) {
        resetFormFunc({ city: "" });
        getAllWarehouseList();
        setAddCityFormVisible(false);
        setAddWarehouseFormVisibility(true);
        getAllCities();
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllWarehouseList();
    getAllCities();
    console.log(warehouseStockVisible + "/");
    setWarehouseStockVisibility(false);
  }, []);

  async function addEditWarehouse(values, resetFormFunc) {
    let funcName = "addNewWarehouse";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    values.isdefault = document.getElementById("isdefault").checked;
    values.city = values.city.city;
    if (selectedWarehouseId >= 0) {
      funcName = "editWarehouseDetails";
      values.id = selectedWarehouseId;
    }
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });
      console.log(res);
      if (res.data.includes("success")) {
        setSelectedWarehouseId(-100);
        resetFormFunc({ title: "", address: "", city: allCities.length > 0 ? allCities[0].id : 0 });
        setAddWarehouseFormVisibility(false);
        getAllWarehouseList();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteSelectedWarehouse() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "deleteSelectedWarehouse",
        pid: selectedWarehouseId,
      });
      if (res.data.includes("success")) {
        setDeleteConformationVisibility(false);
        getAllWarehouseList();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function editButtonPressed(wid) {
    console.log("edit warehouse..." + wid);
    setSelectedWarehouseId(wid);
    setAddWarehouseFormVisibility(true);
  }
  function deleteButtonPressed(wid) {
    console.log("del warehouse..." + wid);
    setSelectedWarehouseId(wid);
    setDeleteConformationVisibility(true);
  }
  function getAddWarehouseInitialValues() {
    if (selectedWarehouseId >= 0) {
      for (let i = 0; i < allWarehouseList.length; i++) {
        if (allWarehouseList[i].id == selectedWarehouseId) {
          return {
            title: allWarehouseList[i].title,
            address: allWarehouseList[i].address,
            city: allWarehouseList[i].city,
          };
        }
      }
    } else {
      return {
        title: "",
        address: "",
        city: allCities.length > 0 ? allCities[0].id : "",
      };
    }
  }
  const addWarehouseValidationSchema = Yup.object().shape({
    title: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
    address: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
  });

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
                      setDeleteConformationVisibility(false);
                    }}>
                    Cancel
                  </button>

                  <button
                    style={{ width: "40%", marginLeft: "30px" }}
                    className="btn btn-primary btn-lg"
                    type="submit"
                    onClick={deleteSelectedWarehouse}>
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
                    onSubmit={(values, { resetForm }) => {
                      addNewCity(values, resetForm);
                    }}>
                    <Form>
                      <div className="newCityForm">
                        {/*................title......................*/}

                        <div className="form-outline" style={{ padding: "0px 10px" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="city"
                            required
                            autoComplete="disabled"
                            label="City"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div style={{ float: "right", width: "100%", padding: "12px 10px 3px 10px" }}>
                          <button
                            style={{ width: "40%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={() => {
                              setAddCityFormVisible(false);
                              setAddWarehouseFormVisibility(true);
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
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>

            {/*.......add warehouse form here....... */}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={addWarehouseVisible}>
              <div className="warehouseFormBg">
                <div style={{ padding: "0px 10px" }}>
                  <div style={{ float: "left", width: "60%" }}>
                    <h2>Create New Warehouse</h2>
                  </div>
                  <div style={{ float: "right", width: "30%" }}>
                    <div style={{ width: "60%", float: "left", paddingTop: "8px" }}>
                      <div style={{ width: "45%", float: "left" }}>
                        <label className="switch">
                          <input type="checkbox" id="isdefault" name="isdefault" />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      <div style={{ paddingTop: "5px", float: "left", paddingLeft: "7px", width: "30%" }}>Default</div>
                    </div>
                    <div style={{ float: "right", width: "40%" }}>
                      <button
                        style={{ float: "right" }}
                        className="btn btn-primary btn-lg"
                        type="submit"
                        onClick={() => {
                          setAddCityFormVisible(true);
                          setAddWarehouseFormVisibility(false);
                        }}>
                        + City
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={getAddWarehouseInitialValues()}
                    enableReinitialize
                    validationSchema={addWarehouseValidationSchema}
                    onSubmit={(values, { resetForm }) => {
                      addEditWarehouse(values, resetForm);
                    }}>
                    <Form>
                      <div className="newProductForm">
                        {/*................title......................*/}

                        <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="title"
                            autoComplete="disabled"
                            label="Title"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
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

                        <div className="form-outline" style={{ width: "100%", float: "left", padding: "10px 10px" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="address"
                            multiline
                            rows={3}
                            autoComplete="disabled"
                            label="Address"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div style={{ float: "right", width: "100%", padding: "32px 10px 3px 10px" }}>
                          <button
                            style={{ width: "20%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={() => {
                              setAddWarehouseFormVisibility(false);
                            }}>
                            Cancel
                          </button>

                          <button
                            style={{ width: "20%", marginLeft: "30px" }}
                            className="btn btn-primary btn-lg"
                            type="submit">
                            {selectedWarehouseId >= 0 ? "Save" : "Save"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>
            {/*....................show warehouses........... */}
            <div className="warehouse_page_searchform">
              <Formik
                initialValues={{ keyword: "" }}
                onSubmit={(values) => {
                  getAllWarehouseList(values.keyword);
                }}>
                <Form>
                  <div>
                    <div className="form-outline" style={{ width: "30%", float: "left", padding: "0px 2px" }}>
                      <Field
                        type="text"
                        name="keyword"
                        placeholder="Keyword"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div style={{ width: "10%", float: "left", padding: "0px 2px" }}>
                      <button type="submit" className="btn btn-secondary" style={{ width: "42px", height: "42px" }}>
                        <FaSearch />
                      </button>
                    </div>
                  </div>
                  <div style={{ width: "50%", float: "right", textAlign: "right" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ width: "42", height: "42:px" }}
                      onClick={() => {
                        getAllWarehouseList();
                      }}>
                      <AiOutlineReload />
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ height: "42px", marginLeft: "10px" }}
                      onClick={() => {
                        setAddWarehouseFormVisibility(true);
                      }}>
                      + Add Warehouse
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
            <div>
              {allWarehouseList &&
                allWarehouseList.map((w, index) => (
                  <WarehouseBlock
                    editPressedFunc={editButtonPressed}
                    deletePressedFunc={deleteButtonPressed}
                    key={index}
                    id={w.id}
                    title={w.title}
                    balance={"100DH"}
                    city={w.city}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {!loggedIn && <AccessDenied />}
    </div>
  );
}
