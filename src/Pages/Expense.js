import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { AiFillFacebook } from "react-icons/ai";
import { BiMoney, BiSearch, BiVideo } from "react-icons/bi";
import { CgWebsite } from "react-icons/cg";
import CustomEditIcon from "../Components/CustomEditIcon";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

export default function Expense({ toggle, type }) {
  const [allExpencesSheets, setAllExpencesSheets] = useState([]);
  const [deleteConformationVisible, setDeleteConformationVisible] = useState(false);
  const [addExpenceFormVisible, setAddExpenceFormVisible] = useState(false);
  const [selectedExpenceId, setSelectedExpenceId] = useState(-100);

  async function getAllExpenceSheet(searchTerm = "") {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllExpenceSheets",
        searchKey: searchTerm,
      });
      console.log(res.data);
      if (res.data) {
        setAllExpencesSheets(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function addEditExpence(values) {
    let funcName = "addNewExpenceSheet";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    if (selectedExpenceId >= 0) {
      funcName = "editExpenceSheet";
      values.id = selectedExpenceId;
    }

    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });
      console.log(res);
      if (res.data.includes("success")) {
        setSelectedExpenceId(-100);
        getAllExpenceSheet();
        setAddExpenceFormVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteSelectedExpence() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "deleteSelectedExpenceSheet",
        id: selectedExpenceId,
      });

      if (res.data.includes("success")) {
        setDeleteConformationVisible(false);
        getAllExpenceSheet();
        setSelectedExpenceId(-100);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getSelectedExpenceSheet() {
    for (let i = 0; i < allExpencesSheets.length; i++) {
      if (allExpencesSheets[i].id == selectedExpenceId) return allExpencesSheets[i];
    }
    return null;
  }
  function getExpenceSheetInitialValues() {
    if (selectedExpenceId >= 0) {
      let selectedSheet = getSelectedExpenceSheet();
      return {
        name: selectedSheet.name,
        website: selectedSheet.website,
        description: selectedSheet.description,
        facebook: selectedSheet.facebook,
        video_url: selectedSheet.video_url,
      };
    }
    return {
      name: "",
      website: "",
      description: "",
      facebook: "",
      video_url: "",
    };
  }
  function editButtonPressed(id) {
    setSelectedExpenceId(id);
    setAddExpenceFormVisible(true);
  }
  function deleteButtonPressed(id) {
    setSelectedExpenceId(id);
    setDeleteConformationVisible(true);
  }
  useEffect(() => {
    getAllExpenceSheet();
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
                      setDeleteConformationVisible(false);
                    }}>
                    Cancel
                  </button>

                  <button
                    style={{ width: "40%", marginLeft: "30px" }}
                    className="btn btn-primary btn-lg"
                    type="submit"
                    onClick={deleteSelectedExpence}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
            {/*....add Expence.....*/}
            <div className="fullShadow" style={addExpenceFormVisible ? { display: "flex" } : { display: "none" }}>
              <div className="ExpenceSheetFormBg">
                <div style={{ padding: "0px 10px" }}>
                  <div style={{ marginBottom: "18px" }}>
                    <h2>Add new Data</h2>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={getExpenceSheetInitialValues()}
                    enableReinitialize
                    onSubmit={(values) => {
                      addEditExpence(values);
                    }}>
                    <Form>
                      <div className="newExpenceForm">
                        {/*................title......................*/}

                        <div className="form-outline" style={{ padding: "0px 10px" }}>
                          <label className="form-custom-label">Name</label>
                          <Field type="text" name="name" placeholder="Name" className="form-control form-control-lg" />
                        </div>

                        <div className="form-outline" style={{ padding: "0px 10px" }}>
                          <label className="form-custom-label">Website</label>
                          <Field
                            type="text"
                            name="website"
                            placeholder="Website"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "0px 10px" }}>
                          <label className="form-custom-label">Facebook</label>
                          <Field
                            type="text"
                            name="facebook"
                            placeholder="Website"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "0px 10px" }}>
                          <label className="form-custom-label">Video URL</label>
                          <Field
                            type="text"
                            name="video_url"
                            placeholder="Website"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "0px 10px" }}>
                          <label className="form-custom-label">Description</label>
                          <Field
                            as="textarea"
                            name="description"
                            placeholder="Description"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div style={{ float: "right", width: "100%", padding: "12px 10px 3px 10px" }}>
                          <button
                            style={{ width: "40%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={() => {
                              setAddExpenceFormVisible(false);
                              getAllExpenceSheet();
                            }}>
                            Cancel
                          </button>

                          <button
                            style={{ width: "40%", marginLeft: "30px" }}
                            className="btn btn-primary btn-lg"
                            type="submit">
                            Add Data
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
                <th scope="col" colSpan={3}>
                  <Formik
                    enableReinitialize
                    initialValues={{ search: "" }}
                    onSubmit={(values) => {
                      getAllExpenceSheet(values.search);
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
                <tr>
                  <th scope="col">Expence Name</th>
                  <th scope="col">Website</th>
                  <th scope="col">Facebook</th>
                  <th scope="col">Video</th>
                  <th scope="col">Description</th>
                  <th scope="col">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setAddExpenceFormVisible(true);
                      }}>
                      +
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allExpencesSheets &&
                  allExpencesSheets.map((Expence, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ float: "left", marginRight: "8px" }}>
                          <BiMoney /> {Expence.name}{" "}
                        </div>
                      </td>
                      <td>
                        <CgWebsite />
                        {Expence.website}
                      </td>
                      <td>
                        <AiFillFacebook />
                        {Expence.facebook}
                      </td>
                      <td>
                        <BiVideo />
                        {Expence.video_url}
                      </td>
                      <td>{Expence.description}</td>

                      <td>
                        {/*.....Actions here.........*/}
                        <CustomEditIcon
                          id={Expence.id}
                          deletePressedFunc={deleteButtonPressed}
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
