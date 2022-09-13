import React from "react";

export default function ProductRowInOrder({
  removeAddedProductForTheOrder,
  productUpdatedForOrder,
  index,
  selectedProduct,
  allProducts,
  quantity,
  subtotal,
}) {
  return (
    <div style={{ marginBottom: "6px" }}>
      <div className="form-outline" style={{ width: "31%", float: "left", padding: "0px 10px 5px 10px" }}>
        <select
          name={"product[" + index + "]"}
          id={"product[" + index + "]"}
          style={{ width: "100%" }}
          className="select form-control-lg"
          onChange={() => {
            productUpdatedForOrder(index);
          }}
          value={selectedProduct}>
          {allProducts &&
            allProducts.map((product, index) => (
              <option key={index} value={product.id}>
                {product.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-outline" style={{ width: "32%", float: "left", padding: "0px 10px 5px 10px" }}>
        <input
          type="number"
          name={"quantity[" + index + "]"}
          id={"quantity[" + index + "]"}
          style={{ textAlign: "center" }}
          placeholder={quantity}
          value={quantity}
          className="form-control form-control-lg"
          onChange={() => {
            productUpdatedForOrder(index);
          }}
        />
      </div>
      <div
        className="form-outline"
        style={{
          width: "32%",
          float: "left",
          padding: "0px 10px 5px 10px",
        }}>
        <input
          type="number"
          name={"subtotal[" + index + "]"}
          id={"subtotal[" + index + "]"}
          style={{ textAlign: "center" }}
          placeholder={subtotal}
          disabled
          value={subtotal}
          className="form-control form-control-lg"
          onChange={() => {
            productUpdatedForOrder(index);
          }}
        />
      </div>

      <div
        className="form-outline"
        style={{
          width: "5%",
          float: "right",
          padding: "0px 10px 5px 10px",
          textAlign: "right",
        }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            removeAddedProductForTheOrder(index);
          }}>
          -
        </button>
      </div>
    </div>
  );
}
