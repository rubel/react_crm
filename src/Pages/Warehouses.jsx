import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import WarehouseBlock from "../Components/WarehouseBlock";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

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
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
  async function addNewCity(values) {
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "addNewCity",
        formData: JSON.stringify(values),
      });

      if (res.data.includes("success")) {
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

  async function addEditWarehouse(values) {
    let funcName = "addNewWarehouse";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    values.isdefault = document.getElementById("isdefault").checked;
    if (selectedWarehouseId >= 0) {
      funcName = "editWarehouseDetails";
      values.id = selectedWarehouseId;
    }
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });
      console.log(res);
      if (res.data.includes("success")) {
        setSelectedWarehouseId(-100);
        setAddWarehouseFormVisibility(false);
        getAllWarehouseList();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteSelectedWarehouse() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
    return {
      title: "",
      address: "",
      city: allCities.length > 0 ? allCities[0].id : 0,
    };
  }

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
        </div>

        {/*....add city.....*/}
        <div className="fullShadow" style={addCityFormVisible ? { display: "flex" } : { display: "none" }}>
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
                      <label className="form-custom-label">Category Name</label>
                      <Field type="text" name="city" placeholder="City" className="form-control form-control-lg" />
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
        </div>

        {/*.......add warehouse form here....... */}
        <div className="fullShadow" style={addWarehouseVisible ? { display: "block" } : { display: "none" }}>
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
                onSubmit={(values) => {
                  addEditWarehouse(values);
                }}>
                <Form>
                  <div className="newProductForm">
                    {/*................title......................*/}

                    <div className="form-outline" style={{ width: "50%", float: "left", padding: "0px 10px" }}>
                      <label className="form-custom-label">Title</label>
                      <Field type="text" name="title" placeholder="Title" className="form-control form-control-lg" />
                    </div>

                    <div className="form-outline" style={{ width: "50%", float: "left", padding: "0px 10px" }}>
                      <label className="form-custom-label">City: </label>
                      <Field as="select" name="city" className="select form-control-lg" style={{ width: "100%" }}>
                        {allCities &&
                          allCities.map((c, index) => (
                            <option key={index} value={c.city}>
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
        </div>
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
                  <Field type="text" name="keyword" placeholder="Keyword" className="form-control form-control-lg" />
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
  );
}
