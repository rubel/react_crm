import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { AiFillFacebook } from "react-icons/ai";
import { BiSearch, BiVideo } from "react-icons/bi";
import { CgProductHunt, CgWebsite } from "react-icons/cg";
import CustomEditIcon from "../Components/CustomEditIcon";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

export default function ProductsSheet({ toggle }) {
  const [allProductsSheets, setAllProductsSheets] = useState([]);
  const [deleteConformationVisible, setDeleteConformationVisible] = useState(false);
  const [addProductFormVisible, setAddProductFormVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(-100);

  async function getAllProductSheet(searchTerm = "") {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getAllProductSheets",
        searchKey: searchTerm,
      });
      console.log(res.data);
      if (res.data) {
        setAllProductsSheets(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function addEditProduct(values) {
    let funcName = "addNewProductSheet";
    values.userId = JSON.parse(sessionStorage.getItem("fullUserDetails")).id;
    if (selectedProductId >= 0) {
      funcName = "editProductSheet";
      values.id = selectedProductId;
    }

    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: funcName,
        formData: JSON.stringify(values),
      });
      console.log(res);
      if (res.data.includes("success")) {
        setSelectedProductId(-100);
        getAllProductSheet();
        setAddProductFormVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteSelectedProduct() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "deleteSelectedProductSheet",
        id: selectedProductId,
      });

      if (res.data.includes("success")) {
        setDeleteConformationVisible(false);
        getAllProductSheet();
        setSelectedProductId(-100);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getSelectedProductSheet() {
    for (let i = 0; i < allProductsSheets.length; i++) {
      if (allProductsSheets[i].id == selectedProductId) return allProductsSheets[i];
    }
    return null;
  }
  function getProductSheetInitialValues() {
    if (selectedProductId >= 0) {
      let selectedSheet = getSelectedProductSheet();
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
    setSelectedProductId(id);
    setAddProductFormVisible(true);
  }
  function deleteButtonPressed(id) {
    setSelectedProductId(id);
    setDeleteConformationVisible(true);
  }
  useEffect(() => {
    getAllProductSheet();
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
                onClick={() => {
                  setDeleteConformationVisible(false);
                }}>
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
        {/*....add product.....*/}
        <div className="fullShadow" style={addProductFormVisible ? { display: "flex" } : { display: "none" }}>
          <div className="productSheetFormBg">
            <div style={{ padding: "0px 10px" }}>
              <div style={{ marginBottom: "18px" }}>
                <h2>Add new Data</h2>
              </div>
            </div>
            <div>
              <Formik
                initialValues={getProductSheetInitialValues()}
                enableReinitialize
                onSubmit={(values) => {
                  addEditProduct(values);
                }}>
                <Form>
                  <div className="newProductForm">
                    {/*................title......................*/}

                    <div className="form-outline" style={{ padding: "0px 10px", float: "left", width: "50%" }}>
                      <label className="form-custom-label">Name</label>
                      <Field type="text" name="name" placeholder="Name" className="form-control form-control-lg" />
                    </div>

                    <div className="form-outline" style={{ padding: "0px 10px", float: "right", width: "50%" }}>
                      <label className="form-custom-label">Website</label>
                      <Field
                        type="text"
                        name="website"
                        placeholder="http://"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div className="form-outline" style={{ padding: "0px 10px", float: "left", width: "50%" }}>
                      <label className="form-custom-label">Facebook</label>
                      <Field
                        type="text"
                        name="facebook"
                        placeholder="http://"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div className="form-outline" style={{ padding: "0px 10px", float: "right", width: "50%" }}>
                      <label className="form-custom-label">Video URL</label>
                      <Field
                        type="text"
                        name="video_url"
                        placeholder="http://"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div className="form-outline" style={{ padding: "0px 10px", float: "left", width: "50%" }}>
                      <label className="form-custom-label">Final Video URL</label>
                      <Field
                        type="text"
                        name="final_video_url"
                        placeholder="http://"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div className="form-outline" style={{ padding: "0px 10px", float: "right", width: "50%" }}>
                      <label className="form-custom-label">Ad Copy</label>
                      <Field
                        type="text"
                        name="ad_copy"
                        placeholder="http://"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div className="form-outline" style={{ padding: "0px 10px", float: "left", width: "50%" }}>
                      <label className="form-custom-label">Price</label>
                      <Field type="number" name="price" placeholder="0" className="form-control form-control-lg" />
                    </div>

                    <div className="form-outline" style={{ padding: "0px 10px", float: "right", width: "50%" }}>
                      <label className="form-custom-label">Compare Price</label>
                      <Field
                        type="number"
                        name="compare_price"
                        placeholder="0"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div className="form-outline" style={{ padding: "0px 10px", float: "left", width: "50%" }}>
                      <label className="form-custom-label">Voice over audio</label>
                      <Field
                        type="text"
                        name="voice_over_audio"
                        placeholder="http://"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div className="form-outline" style={{ padding: "0px 10px", float: "right", width: "50%" }}>
                      <label className="form-custom-label">Voice over text</label>
                      <Field
                        type="text"
                        name="voice_over_audio"
                        placeholder="http://"
                        className="form-control form-control-lg"
                      />
                    </div>

                    <div className="form-outline" style={{ padding: "0px 10px" }}>
                      <label className="form-custom-label">Photo and Video</label>
                      <Field
                        type="text"
                        name="photo_and_video"
                        placeholder="http://"
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
                          setAddProductFormVisible(false);
                          getAllProductSheet();
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
                  getAllProductSheet(values.search);
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
            <th scope="col"></th>
            <tr>
              <th scope="col">Product Name</th>
              <th scope="col">Website</th>
              <th scope="col">Facebook</th>
              <th scope="col">Video</th>
              <th scope="col">Description</th>
              <th scope="col">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setAddProductFormVisible(true);
                  }}>
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {allProductsSheets &&
              allProductsSheets.map((product, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ float: "left", marginRight: "8px" }}>
                      <CgProductHunt /> {product.name}{" "}
                    </div>
                  </td>
                  <td>
                    <CgWebsite />
                    {product.website}
                  </td>
                  <td>
                    <AiFillFacebook />
                    {product.facebook}
                  </td>
                  <td>
                    <BiVideo />
                    {product.video_url}
                  </td>
                  <td>{product.description}</td>

                  <td>
                    {/*.....Actions here.........*/}
                    <CustomEditIcon
                      id={product.id}
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
  );
}
