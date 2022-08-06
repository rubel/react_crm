import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import CustomEditIcon from "../Components/CustomEditIcon";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

function Suppliers({ toggle }) {
  const [allSupplierList, setAllSupplierList] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [deleteConformationVisible, toggleDeleteConformationVisibility] = useState(false);
  const [addSupplierVisible, toggleAddSupplierFormVisibility] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(-100);
  async function getAllSupplierList(searchTerm = "") {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
  async function addEditSupplier(values) {
    let funcName = "addNewSupplier";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;

    if (selectedSupplierId >= 0) {
      funcName = "editSupplierDetails";
      values.id = selectedSupplierId;
    }
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });

      if (res.data.includes("success")) {
        setSelectedSupplierId(-100);
        getAllSupplierList();
        updateAddSupplierFormVisibility();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteSelectedSupplier() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
                onClick={deleteSelectedSupplier}>
                Confirm
              </button>
            </div>
          </div>
        </div>

        {/*.......add supplier form here....... */}
        <div className="fullShadow" style={addSupplierVisible ? { display: "block" } : { display: "none" }}>
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
                onSubmit={(values) => {
                  addEditSupplier(values);
                }}>
                <Form>
                  <div className="newSupplierForm">
                    {/*................title......................*/}

                    <div className="form-outline" style={{ width: "100%", float: "left", padding: "0px 10px" }}>
                      <label className="form-custom-label">Supplier Name</label>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Supplier Name"
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
                      <Field type="text" name="city" placeholder="City" className="form-control form-control-lg" />
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
        </div>
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
  );
}

export default Suppliers;
