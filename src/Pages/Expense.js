import { Backdrop } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { Autocomplete, TextField } from "formik-mui";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import CustomEditIcon from "../Components/CustomEditIcon";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

export default function Expense({ toggle, type }) {
  const [allExpencesSheets, setAllExpencesSheets] = useState([]);
  const [allExpenceCategories, setAllExpenceCatefories] = useState([]);
  const [deleteConformationVisible, setDeleteConformationVisible] = useState(false);
  const [addExpenceFormVisible, setAddExpenceFormVisible] = useState(false);
  const [selectedExpenceId, setSelectedExpenceId] = useState(-100);
  const [addCategoryFormVisible, setAddCategoryFormVisible] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  async function getAllExpenceSheet(searchTerm = "") {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllExpenceSheets",
        searchKey: searchTerm,
        type: type,
      });
      console.log(res.data);
      if (res.data) {
        setAllExpencesSheets(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllUsers(searchTerm = "") {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllUsers",
        searchTerm: searchTerm,
        type: "",
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
  async function getAllExpenceCategories() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllExpenceCategories",
      });

      if (res.data) {
        let categories = res.data.map((val) => val.category);
        setAllExpenceCatefories(categories);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function addEditExpence(values) {
    let funcName = "addNewExpenceSheet";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    values.type = type;

    if (!values.member_id) {
      values.member_id = -100;
    } else {
      values.member_id = values.member_id.id;
    }

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
  async function addNewExpenceCategory(values, resetFormFunc) {
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "addNewExpenceCategory",
        formData: JSON.stringify(values),
      });

      if (res.data.includes("success")) {
        resetFormFunc({ category: "" });
        setAddCategoryFormVisible(false);
        setAddExpenceFormVisible(true);
        getAllExpenceCategories();
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
        category: selectedSheet.category,
        amount: selectedSheet.amount,
        date: selectedSheet.date,
        status: selectedSheet.status,
        note: selectedSheet.note,
        member_id: selectedSheet.member,
      };
    }
    return {
      category: "",
      amount: "",
      date: "",
      status: "",
      note: "",
      member_id: "",
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
    getAllExpenceCategories();
    getAllUsers();
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
                    onClick={deleteSelectedExpence}>
                    Confirm
                  </button>
                </div>
              </div>
            </Backdrop>
            {/*....add category.....*/}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={addCategoryFormVisible}>
              <div className="cityFormBg">
                <div style={{ padding: "0px 10px" }}>
                  <div style={{ marginBottom: "18px" }}>
                    <h2>Add new Category</h2>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={{
                      category: "",
                    }}
                    onSubmit={(values, { resetForm }) => {
                      addNewExpenceCategory(values, resetForm);
                    }}>
                    <Form>
                      <div className="newCityForm">
                        {/*................title......................*/}

                        <div className="form-outline" style={{ padding: "0px 10px" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="category"
                            autoComplete="disabled"
                            label="Category"
                            required
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div style={{ float: "right", width: "100%", padding: "12px 10px 3px 10px" }}>
                          <button
                            style={{ width: "40%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={() => {
                              setAddCategoryFormVisible(false);
                              setAddExpenceFormVisible(true);
                            }}>
                            Cancel
                          </button>

                          <button
                            style={{ width: "40%", marginLeft: "30px" }}
                            className="btn btn-primary btn-lg"
                            type="submit">
                            Add Category
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>
            {/*....add Expence.....*/}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={addExpenceFormVisible}>
              <div className="expenceSheetFormBg">
                <div style={{ padding: "0px 10px" }}>
                  <div style={{ marginBottom: "18px", float: "left" }}>
                    <h2>Add new {type} Expence</h2>
                  </div>

                  <div style={{ float: "right", width: "40%" }}>
                    <button
                      style={{ float: "right" }}
                      className="btn btn-primary btn-lg"
                      type="submit"
                      onClick={() => {
                        setAddCategoryFormVisible(true);
                        setAddExpenceFormVisible(false);
                      }}>
                      + Category
                    </button>
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
                        <div className="form-outline" style={{ padding: "10px 10px" }}>
                          <Field
                            name="category"
                            component={Autocomplete}
                            options={allExpenceCategories}
                            style={{ width: "100%" }}
                            getOptionLabel={(option) => option || ""}
                            renderInput={(params) => {
                              const inputProps = params.inputProps;
                              inputProps.autoComplete = "disabled";
                              return (
                                <MuiTextField
                                  {...params}
                                  inputProps={inputProps}
                                  name="category"
                                  label="Category"
                                  variant="outlined"
                                  fullWidth
                                />
                              );
                            }}
                          />
                        </div>

                        {type == "team" && (
                          <div className="form-outline" style={{ padding: "10px 10px" }}>
                            <Field
                              name="member_id"
                              component={Autocomplete}
                              options={allUsers}
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
                                    name="member_id"
                                    label="Member"
                                    variant="outlined"
                                    fullWidth
                                  />
                                );
                              }}
                            />
                          </div>
                        )}

                        <div className="form-outline" style={{ padding: "10px 10px" }}>
                          <Field
                            type="number"
                            component={TextField}
                            name="amount"
                            autoComplete="disabled"
                            label="Amount"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px" }}>
                          <Field
                            type="date"
                            component={TextField}
                            name="date"
                            autoComplete="disabled"
                            label="Date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px" }}>
                          <Field
                            name="status"
                            component={Autocomplete}
                            options={["Pending", "Approved"]}
                            style={{ width: "100%" }}
                            getOptionLabel={(option) => option || ""}
                            renderInput={(params) => {
                              const inputProps = params.inputProps;
                              inputProps.autoComplete = "disabled";
                              return (
                                <MuiTextField
                                  {...params}
                                  inputProps={inputProps}
                                  name="status"
                                  label="Status"
                                  variant="outlined"
                                  fullWidth
                                />
                              );
                            }}
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px" }}>
                          <Field
                            type="text"
                            multiline
                            rows={3}
                            component={TextField}
                            name="note"
                            autoComplete="disabled"
                            label="Note"
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
            </Backdrop>
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
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
                </tr>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Member</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Date</th>
                  <th scope="col">Note</th>
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
                      <td>{Expence.category}</td>
                      <td>
                        <div style={{ float: "left", marginRight: "8px" }}>{Expence.member_id} </div>
                      </td>
                      <td>{Expence.amount}</td>
                      <td>{Expence.date}</td>
                      <td>{Expence.note}</td>

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
