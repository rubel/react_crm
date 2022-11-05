import { Snackbar } from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import FullWidthTabs from "../Components/AffiliateTabs";
import { headers, SERVER_URL } from "../Constants/AppConstants";
import TopTabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";
import AccessDenied from "./AccessDenied";

function Affiliate({ toggle }) {
  const [snakebarMessage, setSnakebarMessage] = useState("");
  const [snakebarShown, setSnakebarShown] = useState(false);
  const [allCancelledOrders, setAllCancelledOrders] = useState([]);
  const [allAcceptedOrders, setAllAcceptedOrders] = useState([]);
  const [allShippedOrders, setAllShippedOrders] = useState([]);
  const [allProcessingOrders, setAllProcessingOrders] = useState([]);

  const [allCancelledOrdersDetails, setAllCancelledOrdersDetails] = useState([]);
  const [allAcceptedOrdersDetails, setAllAcceptedOrdersDetails] = useState([]);
  const [allShippedOrdersDetails, setAllShippedOrdersDetails] = useState([]);
  const [allProcessingOrdersDetails, setAllProcessingOrdersDetails] = useState([]);

  var loggedIn = sessionStorage.getItem("uid");
  //let searchLeadvartexUrl = "/api/admin/getOrdersIdsInStatus.html?token=Aniraz2021&";
  //let orderFetchBaseUrl = "/api/admin/getOrdersByIds.html?token=Aniraz2021&ids=";

  //status = 0 -> processing
  //status = 1 -> accepted
  //status = 2 -> cancelled
  //status = 3 ->
  //status = 4 ->  shipped

  // "0": "Processing"/"processing",
  // "1": "Accepted"/"accepted",
  // "2": "Cancelled",/"canceled",
  // "3": "Sent to",/"shipped",
  // "4": "Waiting for payment",/"shipped",
  // "5": "Paid",/"paid",
  // "6": "Transfer",/"paid",
  // "7": "Return",/"return",
  // "8": "Double",/"spam",
  // "9": "Spam/Errors",/"spam",

  const loadAllProductsFromLeadVertex = async () => {
    const resProcessing = await axios.post(
      SERVER_URL + "crm/service.php",
      {
        status: 0,
        func: "getLeadvartexOrdersOfStatus",
      },
      {
        headers: headers,
      }
    );
    setAllProcessingOrders(resProcessing.data);
    getAllOrderDetails(setAllProcessingOrdersDetails, resProcessing.data);

    const resAccpted = await axios.post(
      SERVER_URL + "crm/service.php",
      {
        status: 1,
        func: "getLeadvartexOrdersOfStatus",
      },
      {
        headers: headers,
      }
    );
    setAllAcceptedOrders(resAccpted.data);
    getAllOrderDetails(setAllAcceptedOrdersDetails, resAccpted.data);

    const resCancelled = await axios.post(
      SERVER_URL + "crm/service.php",
      {
        status: 2,
        func: "getLeadvartexOrdersOfStatus",
      },
      {
        headers: headers,
      }
    );
    setAllCancelledOrders(resCancelled.data);
    getAllOrderDetails(setAllCancelledOrdersDetails, resCancelled.data);

    const resShipped = await axios.post(
      SERVER_URL + "crm/service.php",
      {
        status: 4,
        func: "getLeadvartexOrdersOfStatus",
      },
      {
        headers: headers,
      }
    );
    setAllShippedOrders(resShipped.data);
    getAllOrderDetails(setAllShippedOrdersDetails, resShipped.data);
  };

  const getAllOrderDetails = async (setFunc, ids) => {
    const res = await axios.post(
      SERVER_URL + "crm/service.php",
      {
        ids: ids.join(","),
        func: "getAllLeadvartexOrderDetails",
      },
      {
        headers: headers,
      }
    );

    const receivedOrderDrtails = [];
    for (let i = 0; i < ids.length; i++) {
      const element = res.data[ids[i]];
      receivedOrderDrtails.push(element);
    }
    setFunc(receivedOrderDrtails);
  };

  useEffect(() => {
    loadAllProductsFromLeadVertex();
  }, []);

  return (
    <div>
      {loggedIn && (
        <div>
          <TopBar toggle={toggle} />
          <TopTabs />
          <Snackbar
            open={snakebarShown}
            autoHideDuration={6000}
            onClose={() => {
              setSnakebarShown(false);
            }}
            message={snakebarMessage}
          />
          <div style={{ height: "100%" }}>
            <div>&nbsp;</div>
            <Formik
              onSubmit={(values) => {
                console.log(values);
              }}>
              <Form>
                <FullWidthTabs
                  allCancelledOrdersDetails={allCancelledOrdersDetails}
                  allAcceptedOrdersDetails={allAcceptedOrdersDetails}
                  allProcessingOrdersDetails={allProcessingOrdersDetails}
                  allShippedOrdersDetails={allShippedOrdersDetails}
                  allCancellabledOrderIds={allCancelledOrders}
                  allAcceptedOrderIds={allAcceptedOrders}
                  allProcessingOrderIds={allProcessingOrders}
                  allShippedOrderIds={allShippedOrders}
                  setSnakebarMessage={setSnakebarMessage}
                  setSnakebarShown={setSnakebarShown}
                  loadAllProductsFromLeadVertex={loadAllProductsFromLeadVertex}
                />
              </Form>
            </Formik>
          </div>
        </div>
      )}

      {!loggedIn && <AccessDenied />}
    </div>
  );
}

export default Affiliate;
