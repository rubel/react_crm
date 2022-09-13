import { Backdrop } from "@mui/material";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import React, { useEffect, useState } from "react";
import { BiPlus, BiSearch } from "react-icons/bi";
import ProductSheet from "../Components/ProductSheet";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

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
        voice_over_audio: selectedSheet.voice_over_audio,
        voice_over_text: selectedSheet.voice_over_text,
        photo_and_video: selectedSheet.photo_and_video,
        price: selectedSheet.price,
        compare_price: selectedSheet.compare_price,
        ad_copy: selectedSheet.ad_copy,
        final_video_url: selectedSheet.final_video_url,
        video_url: selectedSheet.video_url,
      };
    }
    return {
      name: "",
      website: "",
      description: "",
      facebook: "",
      video_url: "",
      voice_over_audio: "",
      voice_over_text: "",
      photo_and_video: "",
      price: 0,
      compare_price: 0,
      ad_copy: "",
      final_video_url: "",
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
                    onClick={deleteSelectedProduct}>
                    Confirm
                  </button>
                </div>
              </div>
            </Backdrop>
            {/*....add product.....*/}
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflowY: "scroll" }}
              open={addProductFormVisible}>
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

                        <div className="form-outline" style={{ padding: "10px 10px", float: "left", width: "50%" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="name"
                            autoComplete="disabled"
                            label="Name"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px", float: "right", width: "50%" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="website"
                            autoComplete="disabled"
                            label="Website"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px", float: "left", width: "50%" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="facebook"
                            autoComplete="disabled"
                            label="Facebook"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px", float: "right", width: "50%" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="video_url"
                            autoComplete="disabled"
                            label="Video URL"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px", float: "left", width: "50%" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="final_video_url"
                            autoComplete="disabled"
                            label="Final Video URL"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px", float: "right", width: "50%" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="ad_copy"
                            autoComplete="disabled"
                            label="Ad Copy"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px", float: "left", width: "50%" }}>
                          <Field
                            type="number"
                            component={TextField}
                            name="price"
                            autoComplete="disabled"
                            label="Price"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px", float: "right", width: "50%" }}>
                          <Field
                            type="number"
                            component={TextField}
                            name="compare_price"
                            autoComplete="disabled"
                            label="Compare Price"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px", float: "left", width: "50%" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="voice_over_audio"
                            autoComplete="disabled"
                            label="Voice over audio"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px", float: "right", width: "50%" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="voice_over_text"
                            autoComplete="disabled"
                            label="Voice over text"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="photo_and_video"
                            autoComplete="disabled"
                            label="Photo And Video"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline" style={{ padding: "10px 10px" }}>
                          <Field
                            type="text"
                            component={TextField}
                            name="description"
                            autoComplete="disabled"
                            multiline
                            rows={3}
                            label="Description"
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
                            {selectedProductId >= 0 ? "Edit Data" : "Add Data"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </Backdrop>

            <div>
              {" "}
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

                  <button
                    type="button"
                    style={{ padding: "7px 9px", margin: "0px 10px" }}
                    className="btn btn-primary"
                    onClick={() => {
                      setAddProductFormVisible(true);
                    }}>
                    <BiPlus />
                  </button>
                </Form>
              </Formik>
            </div>

            <div style={{ height: "550px", overflowY: "scroll", width: "100%", marginTop: "20px" }}>
              {allProductsSheets &&
                allProductsSheets.map((product, index) => (
                  <ProductSheet
                    deleteButtonPressed={deleteButtonPressed}
                    editButtonPressed={editButtonPressed}
                    key={index}
                    details={product}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {!loggedIn && <AccessDenied />}
    </div>
  );
}
