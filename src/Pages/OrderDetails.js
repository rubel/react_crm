import React from "react";
import AccessDenied from "./AccessDenied";

function OrderDetails() {
  var loggedIn = sessionStorage.getItem("uid");

  return (
    <div>
      {loggedIn && (
        <div>
          <div>Order Details</div>
        </div>
      )}
      {!loggedIn && <AccessDenied />}
    </div>
  );
}

export default OrderDetails;
