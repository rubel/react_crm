import { Backdrop } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { Autocomplete, TextField } from "formik-mui";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import CustomEditIcon from "../Components/CustomEditIcon";
import { SERVER_URL } from "../Constants/AppConstants";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

export default function Products({ toggle }) {
  const [allProductList, setAllProductList] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [addProductVisible, toggleAddProductFormVisibility] = useState(false);
  const [addCategoryVisible, toggleAddCategoryFormVisibility] = useState(false);
  const [deleteConformationVisible, toggleDeleteConformationVisibility] = useState(false);
  const [productIdGoingTobeDeleted, setProductIdGoingTobeDeleted] = useState(-100);
  const [productIdGoingTobeEdited, setProductIdGoingTobeEdited] = useState(-100);

  async function getAllProductList() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllProducts",
      });

      if (res.data) {
        setAllProductList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllCategories() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "getAllCategories",
      });

      if (res.data) {
        setAllCategories(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllProductList();
    getAllCategories();
  }, []);

  async function addEditProduct(values) {
    let funcName = "addNewProduct";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    values.category = values.category.id;

    if (productIdGoingTobeEdited >= 0) {
      funcName = "editProductDetails";
      values.id = productIdGoingTobeEdited;
    }
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });

      if (res.data.includes("success")) {
        setProductIdGoingTobeEdited(-100);
        getAllProductList();
        updateAddProductFormVisibility();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function addNewCategory(values) {
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "addNewCategory",
        formData: JSON.stringify(values),
      });

      if (res.data.includes("success")) {
        getAllCategories();
        updateAddCategoryFormVisibility();
      }
    } catch (error) {
      console.log(error);
    }
  }
  function updateAddProductFormVisibility() {
    let isVisible = !addProductVisible;
    toggleAddProductFormVisibility(isVisible);
    setProductIdGoingTobeEdited(-100);
  }
  function updateAddCategoryFormVisibility() {
    let isVisible = !addCategoryVisible;
    toggleAddCategoryFormVisibility(isVisible);
    updateAddProductFormVisibility();
  }
  function updateDeleteConformationVisibility(delId) {
    setProductIdGoingTobeDeleted(delId);
    let isVisible = !deleteConformationVisible;
    toggleDeleteConformationVisibility(isVisible);
  }
  async function deleteSelectedProduct() {
    try {
      const res = await axios.post(SERVER_URL + "crm/service.php", {
        func: "deleteSelectedProduct",
        pid: productIdGoingTobeDeleted,
      });
      if (res.data.includes("success")) {
        toggleDeleteConformationVisibility(false);
        getAllProductList();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function editButtonPressed(pid) {
    setProductIdGoingTobeEdited(pid);
    toggleAddProductFormVisibility(true);
  }
  function getCategoryById(id) {
    for (let i = 0; i < allCategories.length; i++) {
      if (allCategories[i].id == id) return allCategories[i];
    }
  }

  const newProductValidationSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
    label: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
    sku: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
    price: Yup.number().required("Required"),
    defaultSalePrice: Yup.number().required("Required"),
  });

  function getAddProductInitialValues() {
    if (productIdGoingTobeEdited > 0) {
      for (let i = 0; i < allProductList.length; i++) {
        if (allProductList[i].id == productIdGoingTobeEdited) {
          return {
            name: allProductList[i].name,
            label: allProductList[i].label,
            sku: allProductList[i].sku,
            price: allProductList[i].price,
            defaultSalePrice: allProductList[i].default_sale_price,
            category: getCategoryById(allProductList[i].category_id),
          };
        }
      }
    } else {
      return {
        name: "",
        label: "",
        sku: "",
        price: "",
        defaultSalePrice: "",
        category: "",
      };
    }
  }

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
                    onClick={deleteSelectedProduct}>
                    Confirm
                  </button>
                </div>
              </div>
            </Backdrop>
            {/*.......Add category form here...... */}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={addCategoryVisible}>
              <div className="categoryFormBg">
                <div style={{ padding: "0px 10px" }}>
                  <div style={{ marginBottom: "18px" }}>
                    <h2>Create New Category</h2>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={{
                      categoryName: "",
                    }}
                    onSubmit={(values) => {
                      addNewCategory(values);
                    }}>
                    <Form>
                      <div className="newProductForm">
                        {/*................title......................*/}

                        <div className="form-outline" style={{ padding: "0px 10px" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="categoryName"
                            label="Category Name"
                            required
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div style={{ float: "right", width: "100%", padding: "12px 10px 3px 10px" }}>
                          <button
                            style={{ width: "40%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={updateAddCategoryFormVisibility}>
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
            {/*.......add product form here....... */}
            <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }} open={addProductVisible}>
              <div className="productFormBg">
                <div style={{ padding: "0px 10px", height: "100px" }}>
                  <div style={{ float: "left", width: "50%" }}>
                    <h2>Create New Product</h2>
                  </div>
                  <div style={{ float: "right", width: "50%" }}>
                    <button
                      style={{ float: "right" }}
                      className="btn btn-primary btn-lg"
                      type="submit"
                      onClick={updateAddCategoryFormVisibility}>
                      + Add Category
                    </button>
                  </div>
                </div>
                <div>
                  <Formik
                    initialValues={getAddProductInitialValues()}
                    validationSchema={newProductValidationSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                      addEditProduct(values);
                    }}>
                    <Form>
                      <div className="newProductForm">
                        {/*................title......................*/}

                        <div style={{ height: "100px" }}>
                          <div
                            className="form-outline"
                            style={{ width: "50%", float: "left", padding: "10px 10px 10px 10px" }}>
                            <Field
                              type="text"
                              component={TextField}
                              name="name"
                              label="Product Name"
                              className="form-control form-control-lg"
                            />
                          </div>

                          <div
                            className="form-outline"
                            style={{ width: "50%", float: "right", padding: "10px 10px 10px 10px" }}>
                            <Field
                              component={TextField}
                              label="Label"
                              type="text"
                              name="label"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>

                        <div style={{ height: "100px" }}>
                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="text"
                              label="SKU"
                              component={TextField}
                              name="sku"
                              className="form-control form-control-lg"
                            />
                          </div>

                          <div className="form-outline" style={{ width: "50%", float: "right", padding: "10px 10px" }}>
                            <Field
                              name="category"
                              component={Autocomplete}
                              options={allCategories}
                              style={{ width: "100%" }}
                              getOptionLabel={(option) => option.category || ""}
                              renderInput={(params) => (
                                <MuiTextField
                                  {...params}
                                  name="category"
                                  required
                                  label="Category"
                                  variant="outlined"
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div style={{ height: "100px" }}>
                          <div className="form-outline" style={{ width: "50%", float: "left", padding: "10px 10px" }}>
                            <Field
                              type="number"
                              component={TextField}
                              name="price"
                              label="Price"
                              className="form-control form-control-lg"
                            />
                          </div>

                          <div className="form-outline" style={{ width: "50%", float: "right", padding: "10px 10px" }}>
                            <Field
                              type="number"
                              component={TextField}
                              name="defaultSalePrice"
                              placeholder="0"
                              label="Default Sale Price"
                              className="form-control form-control-lg"
                            />
                          </div>
                        </div>
                        <div style={{ float: "right", width: "100%", padding: "20px 10px 3px 10px" }}>
                          <button
                            style={{ width: "20%" }}
                            className="btn btn-secondary btn-lg"
                            type="button"
                            onClick={updateAddProductFormVisibility}>
                            Cancel
                          </button>

                          <button
                            style={{ width: "20%", marginLeft: "30px" }}
                            className="btn btn-primary btn-lg"
                            type="submit">
                            {productIdGoingTobeEdited > 0 ? "Edit Product" : "Add Product"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>
            {/* .............show products............ */}
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Product Name</th>
                  <th scope="col">Label</th>
                  <th scope="col">sku</th>
                  <th scope="col">price</th>
                  <th scope="col">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: "7px 4px" }}
                      onClick={updateAddProductFormVisibility}>
                      + Add Product
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {allProductList &&
                  allProductList.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.label}</td>
                      <td>{product.sku}</td>
                      <td>{product.price}</td>
                      <td>
                        {/*.....Actions here.........*/}
                        <CustomEditIcon
                          id={product.id}
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
