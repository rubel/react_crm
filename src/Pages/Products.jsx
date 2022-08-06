import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import CustomEditIcon from "../Components/CustomEditIcon";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

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
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
    console.log(values);

    if (productIdGoingTobeEdited >= 0) {
      funcName = "editProductDetails";
      values.id = productIdGoingTobeEdited;
    }
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
      const res = await axios.post("http://localhost:80/crm/service.php", {
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
  function getAddProductInitialValues() {
    if (productIdGoingTobeEdited > 0) {
      for (let i = 0; i < allProductList.length; i++) {
        if (allProductList[i].id == productIdGoingTobeEdited) {
          console.log(allProductList[i]);
          return {
            name: allProductList[i].name,
            label: allProductList[i].label,
            sku: allProductList[i].sku,
            price: allProductList[i].price,
            defaultSalePrice: allProductList[i].default_sale_price,
            category: allProductList[i].category_id,
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
        category: "2",
      };
    }
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
        </div>
        {/*.......Add category form here...... */}
        <div className="fullShadow" style={addCategoryVisible ? { display: "flex" } : { display: "none" }}>
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
                      <label className="form-custom-label">Category Name</label>
                      <Field
                        type="text"
                        name="categoryName"
                        placeholder="Category Name"
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
        </div>
        {/*.......add product form here....... */}
        <div className="fullShadow" style={addProductVisible ? { display: "block" } : { display: "none" }}>
          <div className="productFormBg">
            <div style={{ padding: "0px 10px" }}>
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
                enableReinitialize
                onSubmit={(values) => {
                  addEditProduct(values);
                }}>
                <Form>
                  <div className="newProductForm">
                    {/*................title......................*/}

                    <div className="form-outline" style={{ width: "50%", float: "left", padding: "0px 10px" }}>
                      <label className="form-custom-label">Product Name</label>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div className="form-outline" style={{ width: "50%", float: "right", padding: "0px 10px" }}>
                      <label className="form-custom-label">Label</label>
                      <Field type="text" name="label" placeholder="Label" className="form-control form-control-lg" />
                    </div>

                    <div className="form-outline" style={{ width: "50%", float: "left", padding: "0px 10px" }}>
                      <label className="form-custom-label">SKU</label>
                      <Field type="text" name="sku" placeholder="SKU" className="form-control form-control-lg" />
                    </div>

                    <div className="form-outline" style={{ width: "50%", float: "right", padding: "0px 10px" }}>
                      <label className="form-custom-label">Category</label>
                      <Field as="select" name="category" className="select form-control-lg" style={{ width: "100%" }}>
                        {allCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.category}
                          </option>
                        ))}
                      </Field>
                    </div>

                    <div className="form-outline" style={{ width: "50%", float: "left", padding: "0px 10px" }}>
                      <label className="form-custom-label">Product Cost</label>
                      <Field type="number" name="price" placeholder="0" className="form-control form-control-lg" />
                    </div>

                    <div className="form-outline" style={{ width: "50%", float: "right", padding: "0px 10px" }}>
                      <label className="form-custom-label">Default Sale Price</label>
                      <Field
                        type="number"
                        name="defaultSalePrice"
                        placeholder="0"
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div style={{ float: "right", width: "100%", padding: "32px 10px 3px 10px" }}>
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
        </div>
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
  );
}
