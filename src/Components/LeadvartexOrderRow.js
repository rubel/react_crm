import { Button, FormControl, MenuItem, Select } from "@mui/material";
import axios from "axios";
import React from "react";
import { headers, SERVER_URL } from "../Constants/AppConstants";

function LeadvartexOrderRow({
  order,
  orderIdInLeadvartex,
  index,
  loadAllProductsFromLeadVertex,
  setSnakebarMessage,
  setSnakebarShown,
}) {
  const products = order.goods;
  const productIds = products && Object.keys(products);
  var productString = "";

  if (products && productIds && productIds.length > 0) {
    for (let i = 0; i < productIds.length; i++) {
      let details = products[productIds[0]];

      productString +=
        "Name : " +
        details.name +
        " | Category" +
        details.categoryName +
        " | Price: " +
        details.price +
        " | Quantity: " +
        details.quantity;
    }
  }

  const deliveryStatusChangedFunc = async (order) => {
    let newStatus = document.getElementById("status_" + orderIdInLeadvartex).innerHTML;
    if (order.statusGroup != newStatus) {
      const res = await axios.post(
        SERVER_URL + "crm/service.php",
        {
          id: orderIdInLeadvartex,
          newStatus: getStatusCodeByStatusGroup(newStatus),
          statusGroup: newStatus,
          func: "updateLeadvartexOrderStatus",
        },
        {
          headers: headers,
        }
      );

      console.log(
        "here...we...go..." + orderIdInLeadvartex + "_" + newStatus + "__" + getStatusCodeByStatusGroup(newStatus)
      );
      console.log(res.data);
      if (res.data.indexOf("OK") == -1) {
        alert("Failed To Update Order Status\n\nPlease correct the order details first. \n" + res.data);
      } else {
        setSnakebarMessage("Order Status Updated Successfully to " + newStatus + " for id: " + orderIdInLeadvartex);
        setSnakebarShown(true);
      }

      loadAllProductsFromLeadVertex();
    }
  };

  const getStatusCodeByStatusGroup = (status) => {
    const statuses = { processing: 0, accepted: 1, canceled: 2, shipped: 4, paid: 5, return: 7, spam: 8 };
    return statuses[status];
  };

  return (
    <div key={index} style={{ backgroundColor: "#eeeeee", padding: "10px", borderBottom: "1px solid gray" }}>
      <div>
        Address: {order.address},{order.city},{order.country}
      </div>
      <div>Amount: {order.price}</div>
      <div>Phone: {order.phone}</div>
      <div>eMail: {order.email}</div>
      {products && (
        <div style={{ backgroundColor: "#ddd" }}>
          <div>Products: </div>
          <div>{productString}</div>
        </div>
      )}

      <div>Comment: {order.comment}</div>
      <div style={{ minHeight: "60px" }}>
        <div style={{ float: "left", width: "70%" }}>Updated at: {order.lastUpdate}</div>
        <div style={{ width: "30%", float: "left" }}>
          {/* <ConformationStatusMenu
            currentStatus={order.statuses[order.statuses.length - 1].conformation_status}
            id={order.id}
            conformationStatusChangedFunc={conformationStatusChangedFunc}
          /> */}
          <FormControl style={{ width: "60%" }} variant="standard">
            {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
            <Select id={`status_${orderIdInLeadvartex}`} label="Status">
              <MenuItem value="processing">processing</MenuItem>
              <MenuItem value="accepted">accepted</MenuItem>
              <MenuItem value="canceled">canceled</MenuItem>
              <MenuItem value="shipped">shipped</MenuItem>
              <MenuItem value="paid">paid</MenuItem>
              <MenuItem value="return">return</MenuItem>
              <MenuItem value="spam">spam</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="button"
            variant="contained"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              deliveryStatusChangedFunc(order);
            }}>
            Save
          </Button>

          {/* <LeadvartexStatusMenu
            id={orderIdInLeadvartex}
            currentStatus={order.statusGroup}
            deliveryStatusChangedFunc={deliveryStatusChangedFunc}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default LeadvartexOrderRow;
