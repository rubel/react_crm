import { Field } from "formik";
import React from "react";

export default function ProductRowInOrder({ allProductList, product_index, selectedProduct, subtotal }) {
  function productSelected(itemId, qty) {
    for (let i = 0; i < allProductList.length; i++) {
      if (allProductList[i].id == itemId) {
        let subtotal = allProductList[i].price * qty;
        document.getElementById("subtotal[" + product_index + "]").innerHTML = subtotal;
        break;
      }
    }
  }
  return (
    <div
      style={{ marginBottom: "6px" }}
      onChange={() => {
        let itemId = document.getElementById("product[" + product_index + "]").value;
        let qty = document.getElementById("quantity[" + product_index + "]").value;
        if (!qty) {
          qty = 1;
        }
        productSelected(itemId, qty);
      }}>
      <div className="form-outline" style={{ width: "33%", float: "left", padding: "0px 10px 5px 10px" }}>
        <Field
          as="select"
          name={"product[" + product_index + "]"}
          id={"product[" + product_index + "]"}
          className="select form-control-lg"
          placeholder={selectedProduct}
          style={{ width: "100%" }}>
          {allProductList &&
            allProductList.map((product, index) => (
              <option key={index} value={product.id}>
                {product.name}
              </option>
            ))}
        </Field>
      </div>
      <div className="form-outline" style={{ width: "33%", float: "left", padding: "0px 10px 5px 10px" }}>
        <Field
          type="number"
          id={"quantity[" + product_index + "]"}
          name={"quantity[" + product_index + "]"}
          className="form-control form-control-lg"
          style={{ textAlign: "center" }}
          placeholder="1"
        />
      </div>
      <div
        className="form-outline"
        style={{
          width: "33%",
          float: "left",
          padding: "0px 10px 5px 10px",
        }}>
        <div
          id={"subtotal[" + product_index + "]"}
          style={{
            border: "1px solid #ced4da",
            textAlign: "center",
            minHeight: "calc(1.5em + 1rem + 2px)",
            padding: "0.5rem 1rem",
            borderRadius: "0.3rem",
          }}>
          {subtotal}
        </div>
      </div>
    </div>
  );
}
