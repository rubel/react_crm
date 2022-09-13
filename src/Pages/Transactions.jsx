import { Backdrop } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { Autocomplete, TextField } from "formik-mui";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { TiWarning } from "react-icons/ti";
import AddTransactionTabs from "../Components/AddTransactionTabs";
import TransactionsDottedIcon from "../Components/TransactionsDottedIcon";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

function Transactions({ toggle }) {
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [allWarehouseList, setAllWarehouseList] = useState([]);
  const [allSupplierList, setAllSupplierList] = useState([]);
  const [addTransactionFormVisible, setAddTransactionFormVisible] = useState(false);
  const [transactionDetailsPageVisible, setTransactionDetailsPageVisible] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState(-100);
  var loggedIn = sessionStorage.getItem("uid");

  function deleteTheTransaction() {}
  function getAddTransactionInitialValues() {
    return {};
  }

  function addEditTransaction(values) {
    console.log(values);
  }
  async function getAllTransactions(searchTerm = "") {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllTransactions",
        searchTerm: searchTerm,
      });
      console.log(res.data);
      if (res.data) {
        setAllTransactions(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllWarehouseList() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllWarehouse",
        searchKey: "",
      });
      console.log(res.data);
      if (res.data) {
        setAllWarehouseList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function editTransactionPressed(id) {
    setSelectedTransactionId(id);
    setAddTransactionFormVisible(true);
  }
  async function getAllSupplierList() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllSuppliers",
        searchTerm: "",
      });
      if (res.data) {
        setAllSupplierList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllTransactions();
    getAllSupplierList();
    getAllWarehouseList();
  }, []);

  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <Tabs />
          <div className="container-fluid">
            {/*...........add transaction form.................*/}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={addTransactionFormVisible}>
              <div className="addTransactionFormBg">
                <Formik
                  initialValues={getAddTransactionInitialValues()}
                  enableReinitialize
                  //validationSchema={newTransactionValidationSchema}
                  onSubmit={(values) => {
                    addEditTransaction(values);
                  }}>
                  <Form>
                    <div className="newProductForm">
                      {/*................title......................*/}
                      <div>
                        <h3>Create transaction</h3>
                      </div>
                      <div
                        className="form-outline"
                        style={{ width: "33%", float: "left", padding: "20px 10px 10px 10px" }}>
                        <Field
                          name="supplier"
                          component={Autocomplete}
                          options={allSupplierList}
                          style={{ width: "100%" }}
                          getOptionLabel={(option) => option.name || ""}
                          renderInput={(params) => (
                            <MuiTextField {...params} name="supplier" label="Supplier" variant="outlined" />
                          )}
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ width: "33%", float: "right", padding: "20px 10px 10px 10px" }}>
                        <Field
                          component={TextField}
                          label="TVA (%)"
                          type="number"
                          name="tva"
                          className="form-control form-control-lg"
                        />
                      </div>

                      <div className="form-outline" style={{ width: "33%", float: "left", padding: "20px 10px" }}>
                        <Field
                          type="number"
                          label="Discount"
                          component={TextField}
                          name="discount"
                          className="form-control form-control-lg"
                        />
                      </div>

                      <div className="form-outline" style={{ width: "50%", float: "right", padding: "10px 10px" }}>
                        <Field
                          name="warehouse"
                          component={Autocomplete}
                          options={allWarehouseList}
                          style={{ width: "100%" }}
                          getOptionLabel={(option) => option.title || ""}
                          renderInput={(params) => (
                            <MuiTextField {...params} name="warehouse" label="Warehouse" variant="outlined" />
                          )}
                        />
                      </div>

                      <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                        <Field
                          type="date"
                          component={TextField}
                          name="date"
                          label="Date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          autoComplete="disabled"
                          className="form-control form-control-lg"
                        />
                      </div>

                      <div className="form-outline" style={{ width: "100%", float: "right", padding: "10px 10px" }}>
                        <Field
                          type="text"
                          component={TextField}
                          name="note"
                          multiline
                          rows={3}
                          label="Note"
                          className="form-control form-control-lg"
                        />
                      </div>

                      <div style={{ marginTop: "300px" }}>
                        <AddTransactionTabs />
                      </div>

                      <div style={{ float: "right", width: "100%", padding: "26px 10px 3px 10px" }}>
                        <button
                          style={{ width: "20%" }}
                          className="btn btn-secondary btn-lg"
                          type="button"
                          onClick={() => {
                            setAddTransactionFormVisible(false);
                          }}>
                          Cancel
                        </button>

                        <button
                          style={{ width: "20%", marginLeft: "30px" }}
                          className="btn btn-primary btn-lg"
                          type="submit">
                          {selectedTransactionId > 0 ? "Edit Transaction" : "Save"}
                        </button>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            </Backdrop>
            {/*...........delete confirm.................*/}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={deleteConfirmVisible}>
              <div className="deleteOrderConfirmBg">
                <div>
                  <h4>Warning</h4>
                </div>
                <div style={{ float: "left" }}>
                  <TiWarning />
                </div>
                <div style={{ paddingLeft: "15px", float: "left" }}>
                  Are you sure you want to delete the Transaction?
                </div>
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
                      deleteTheTransaction();
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            </Backdrop>
            {/*.............view transaction....................*/}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={transactionDetailsPageVisible}>
              <div className="transactionDetailsBg">
                <div>
                  <div style={{ width: "90%", float: "left" }}>id</div>
                  <div
                    className="xButton"
                    onClick={() => {
                      setTransactionDetailsPageVisible(false);
                    }}>
                    x
                  </div>
                </div>
              </div>
            </Backdrop>

            {/*.......list transactions here..........*/}
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col" colSpan={2}>
                    <Formik
                      enableReinitialize
                      initialValues={{ search: "" }}
                      onSubmit={(values) => {
                        getAllTransactions(values.search);
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

                  <th scope="col" style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: "7px 10px" }}
                      onClick={() => {
                        setAddTransactionFormVisible(true);
                      }}>
                      + Add Transaction
                    </button>
                  </th>
                </tr>
                <tr>
                  <th scope="col">Ref</th>
                  <th scope="col">Supplier</th>
                  <th scope="col">Total (DH)</th>
                  <th scope="col">Note</th>
                  <th scope="col">Payment Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody style={{ whiteSpace: "pre-line" }}>
                {allTransactions &&
                  allTransactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.id}</td>
                      <td>{transaction.supplier.name}</td>
                      <td>{transaction.id} Total ..</td>
                      <td>{transaction.note}</td>
                      <td>ACTIVE</td>
                      <td>
                        <TransactionsDottedIcon editTransactionPressed={editTransactionPressed} />
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

export default Transactions;
