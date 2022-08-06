import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import CustomEditIcon from "../Components/CustomEditIcon";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

function Customers({ toggle }) {
  const [allCustomerList, setAllCustomerList] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [deleteConformationVisible, toggleDeleteConformationVisibility] = useState(false);
  const [addCustomerVisible, toggleAddCustomerFormVisibility] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(-100);
  async function getAllCustomerList(searchTerm = "") {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllCustomers",
        searchTerm: searchTerm,
      });
      if (res.data) {
        setAllCustomerList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllCountryList() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllCountries",
      });

      if (res.data) {
        setAllCountries(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllCities() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllCities",
      });

      if (res.data) {
        setAllCities(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function addEditCustomer(values) {
    let funcName = "addNewCustomer";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;

    if (selectedCustomerId >= 0) {
      funcName = "editCustomerDetails";
      values.id = selectedCustomerId;
    }
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });

      if (res.data.includes("success")) {
        setSelectedCustomerId(-100);
        getAllCustomerList();
        updateAddCustomerFormVisibility();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteSelectedCustomer() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "deleteSelectedCustomer",
        cid: selectedCustomerId,
      });
      if (res.data.includes("success")) {
        toggleDeleteConformationVisibility(false);
        getAllCustomerList();
        setSelectedCustomerId(-100);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function getAddCustomerInitialValues() {
    if (selectedCustomerId > 0) {
      for (let i = 0; i < allCustomerList.length; i++) {
        if (allCustomerList[i].id == selectedCustomerId) {
          console.log(allCustomerList[i]);
          return {
            name: allCustomerList[i].name,
            country: allCustomerList[i].country,
            phone: allCustomerList[i].phone,
            whatsapp: allCustomerList[i].whatsapp,
            city: allCustomerList[i].city,
            address: allCustomerList[i].address,
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
  function updateAddCustomerFormVisibility() {
    let isVisible = !addCustomerVisible;
    toggleAddCustomerFormVisibility(isVisible);
    setSelectedCustomerId(-100);
  }

  function editButtonPressed(id) {
    setSelectedCustomerId(id);
    toggleAddCustomerFormVisibility(true);
  }
  function updateDeleteConformationVisibility(delId) {
    setSelectedCustomerId(delId);
    let isVisible = !deleteConformationVisible;
    toggleDeleteConformationVisibility(isVisible);
  }
  useEffect(() => {
    getAllCustomerList();
    getAllCountryList();
    getAllCities();
  }, []);

  return (
    <div>
      <TopBar toggle={toggle} />
      <Tabs />
      <div className="container-fluid">
        {/*....delete conformation.....*/}
        <div className="fullShadow" style={deleteConformationVisible ? { display: "flex" } : { display: "none" }}>
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
                onClick={deleteSelectedCustomer}>
                Confirm
              </button>
            </div>
          </div>
        </div>

        {/*.......add customer form here....... */}
        <div className="fullShadow" style={addCustomerVisible ? { display: "block" } : { display: "none" }}>
          <div className="customerFormBg">
            <div style={{ padding: "0px 10px" }}>
              <div>
                <h2>Create New Customer</h2>
              </div>
            </div>
            <div>
              <Formik
                initialValues={getAddCustomerInitialValues()}
                enableReinitialize
                onSubmit={(values) => {
                  addEditCustomer(values);
                }}>
                <Form>
                  <div className="newCustomerForm">
                    {/*................title......................*/}

                    <div className="form-outline" style={{ width: "100%", float: "left", padding: "0px 10px" }}>
                      <label className="form-custom-label">Customer Name</label>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Customer Name"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div className="form-outline" style={{ width: "50%", float: "left", padding: "0px 10px" }}>
                      <label className="form-custom-label">Country: </label>
                      <Field as="select" name="country" className="select form-control-lg" style={{ width: "100%" }}>
                        {allCountries &&
                          allCountries.map((c, index) => (
                            <option key={index} value={c.country}>
                              {c.country}
                            </option>
                          ))}
                      </Field>
                    </div>
                    <div className="form-outline" style={{ width: "50%", float: "right", padding: "0px 10px" }}>
                      <label className="form-custom-label">City</label>
                      <Field as="select" name="city" className="select form-control-lg" style={{ width: "100%" }}>
                        {allCities &&
                          allCities.map((c, index) => (
                            <option key={index} value={c.id}>
                              {c.city}
                            </option>
                          ))}
                      </Field>
                    </div>
                    <div className="form-outline" style={{ width: "100%", float: "left", padding: "0px 10px" }}>
                      <label className="form-custom-label">Address: </label>
                      <Field
                        as="textarea"
                        name="address"
                        className="select form-control-lg"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div className="form-outline" style={{ width: "50%", float: "right", padding: "0px 10px" }}>
                      <label className="form-custom-label">Phone</label>
                      <Field type="text" name="phone" placeholder="Phone" className="form-control form-control-lg" />
                    </div>

                    <div className="form-outline" style={{ width: "50%", float: "left", padding: "0px 10px" }}>
                      <label className="form-custom-label">Whatsapp</label>
                      <Field
                        type="text"
                        name="whatsapp"
                        placeholder="WhatsApp"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div style={{ float: "right", width: "100%", padding: "32px 10px 3px 10px" }}>
                      <button
                        style={{ width: "20%" }}
                        className="btn btn-secondary btn-lg"
                        type="button"
                        onClick={updateAddCustomerFormVisibility}>
                        Cancel
                      </button>

                      <button
                        style={{ width: "20%", marginLeft: "30px" }}
                        className="btn btn-primary btn-lg"
                        type="submit">
                        {selectedCustomerId > 0 ? "Edit Customer" : "Add Customer"}
                      </button>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col" colSpan={2}>
                <Formik
                  enableReinitialize
                  initialValues={{ search: "" }}
                  onSubmit={(values) => {
                    getAllCustomerList(values.search);
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

              <th scope="col" style={{ textAlign: "right" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "7px 4px" }}
                  onClick={updateAddCustomerFormVisibility}>
                  + Add Customer
                </button>
              </th>
            </tr>
            <tr>
              <th scope="col">Customer Name</th>
              <th scope="col">Country</th>
              <th scope="col">Mobile</th>
              <th scope="col">Whatsapp</th>
              <th scope="col"></th>
            </tr>
          </thead>

          <tbody>
            {allCustomerList &&
              allCustomerList.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.name}</td>
                  <td>{customer.country}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.whatsapp}</td>
                  <td>
                    {/*.....Actions here.........*/}
                    <CustomEditIcon
                      id={customer.id}
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
  );
}

export default Customers;
