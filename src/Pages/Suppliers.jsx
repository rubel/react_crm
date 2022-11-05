import { Backdrop } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { Autocomplete, TextField } from "formik-mui";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import * as Yup from "yup";
import CustomEditIcon from "../Components/CustomEditIcon";
import { SERVER_URL } from "../Constants/AppConstants";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

function Suppliers({ toggle }) {
  const [allSupplierList, setAllSupplierList] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [deleteConformationVisible, toggleDeleteConformationVisibility] = useState(false);
  const [addSupplierVisible, toggleAddSupplierFormVisibility] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(-100);
  const [allCities, setAllCities] = useState([]);

  async function getAllSupplierList(searchTerm = "") {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllSuppliers",
        searchTerm: searchTerm,
      });
      if (res.data) {
        setAllSupplierList(res.data);
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
  async function getAllCountryList() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllCountries",
      });

      if (res.data) {
        let countries = res.data.map((val) => val.country);
        setAllCountries(countries);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function addEditSupplier(values, resetFormFunc) {
    let funcName = "addNewSupplier";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    values.country = values.country.country;

    if (selectedSupplierId >= 0) {
      funcName = "editSupplierDetails";
      values.id = selectedSupplierId;
    }
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });

      if (res.data.includes("success")) {
        setSelectedSupplierId(-100);
        resetFormFunc(getAddSupplierInitialValues());
        getAllSupplierList();
        updateAddSupplierFormVisibility();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteSelectedSupplier() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "deleteSelectedSupplier",
        sid: selectedSupplierId,
      });
      if (res.data.includes("success")) {
        toggleDeleteConformationVisibility(false);
        getAllSupplierList();
        setSelectedSupplierId(-100);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function getAddSupplierInitialValues() {
    if (selectedSupplierId > 0) {
      for (let i = 0; i < allSupplierList.length; i++) {
        if (allSupplierList[i].id == selectedSupplierId) {
          console.log(allSupplierList[i]);
          return {
            name: allSupplierList[i].name,
            country: allSupplierList[i].country,
            phone: allSupplierList[i].phone,
            whatsapp: allSupplierList[i].whatsapp,
            city: allSupplierList[i].city,
            address: allSupplierList[i].address,
          };
        }
      }
    } else {
      return {
        name: "",
        country: "",
        phone: "",
        whatsapp: "",
        city: "",
        address: "",
      };
    }
  }
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const newSupplierValidationSchema = Yup.object().shape({
    name: Yup.string().required("Required").min(3, "Minimum 3 chars").max(50, "Max 50 chars"),
    phone: Yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
    whatsapp: Yup.string().matches(phoneRegExp, "Whatsup number is not valid").required("Required"),
    address: Yup.string()
      .required("Required")
      .min(10, "Minimum 10 chars")
      .max(500, "Max 500 chars")
      .required("Required"),
  });

  function updateAddSupplierFormVisibility() {
    let isVisible = !addSupplierVisible;
    toggleAddSupplierFormVisibility(isVisible);
    setSelectedSupplierId(-100);
  }

  function editButtonPressed(id) {
    setSelectedSupplierId(id);
    toggleAddSupplierFormVisibility(true);
  }
  function updateDeleteConformationVisibility(delId) {
    setSelectedSupplierId(delId);
    let isVisible = !deleteConformationVisible;
    toggleDeleteConformationVisibility(isVisible);
  }
  useEffect(() => {
    getAllSupplierList();
    getAllCountryList();
    getAllCities();
  }, []);

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
                    onClick={updateDeleteConformationVisibility}>
                    Cancel
                  </button>

                  <button
                    style={{ width: "40%", marginLeft: "30px" }}
                    className="btn btn-primary btn-lg"
                    type="submit"
                    onClick={deleteSelectedSupplier}>
                    Confirm
                  </button>
                </div>
              </div>
            </Backdrop>

            {/*.......add supplier form here....... */}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={addSupplierVisible}>
              <div className="supplierFormBg">
                <div style={{ padding: "0px 10px" }}>
                  <div>
                    <h2>Create New Supplier</h2>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={getAddSupplierInitialValues()}
                    enableReinitialize
                    validationSchema={newSupplierValidationSchema}
                    onSubmit={(values, { resetForm }) => {
                      addEditSupplier(values, resetForm);
                    }}>
                    <Form>
                      <div className="newSupplierForm">
                        {/*................title......................*/}

                        <div className="form-outline" style={{ width: "100%", float: "left", padding: "10px 10px" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="name"
                            autoComplete="disabled"
                            label="Supplier Name"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
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
                                  required
                                  variant="outlined"
                                  fullWidth
                                />
                              );
                            }}
                          />
                        </div>
                        <div className="form-outline" style={{ width: "50%", float: "right", padding: "10px 10px" }}>
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
                                  required
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
                            label="Whatsapp"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div style={{ float: "right", width: "100%", padding: "32px 10px 3px 10px" }}>
                          <button
                            style={{ width: "20%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={updateAddSupplierFormVisibility}>
                            Cancel
                          </button>

                          <button
                            style={{ width: "20%", marginLeft: "30px" }}
                            className="btn btn-primary btn-lg"
                            type="submit">
                            {selectedSupplierId > 0 ? "Edit Supplier" : "Add Supplier"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>
            {/* ...........list suppliers here.......... */}
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col" colSpan={2}>
                    <Formik
                      enableReinitialize
                      initialValues={{ search: "" }}
                      onSubmit={(values) => {
                        getAllSupplierList(values.search);
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

                  <th scope="col" style={{ textAlign: "right" }} colSpan={2}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: "7px 10px" }}
                      onClick={updateAddSupplierFormVisibility}>
                      + Add Supplier
                    </button>
                  </th>
                </tr>
                <tr>
                  <th scope="col">Supplier Name</th>
                  <th scope="col">Country</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Whatsapp</th>
                  <th scope="col" style={{ width: "13%" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {allSupplierList &&
                  allSupplierList.map((supplier, index) => (
                    <tr key={index}>
                      <td>{supplier.name}</td>
                      <td>{supplier.country}</td>
                      <td>{supplier.phone}</td>
                      <td>{supplier.whatsapp}</td>
                      <td>
                        {/*.....Actions here.........*/}
                        <CustomEditIcon
                          id={supplier.id}
                          deletePressedFunc={updateDeleteConformationVisibility}
                          editPressedFunc={editButtonPressed}
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

export default Suppliers;
