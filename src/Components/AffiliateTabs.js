import { Box, Tab, Tabs } from "@mui/material";
import * as React from "react";
import AffiliateTable from "./AffiliateTable";

import TabPanel from "./TabPanel";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function FullWidthTabs({
  allCancelledOrdersDetails,
  allAcceptedOrdersDetails,
  allProcessingOrdersDetails,
  allShippedOrdersDetails,
  allCancellabledOrderIds,
  allAcceptedOrderIds,
  allProcessingOrderIds,
  allShippedOrderIds,
  loadAllProductsFromLeadVertex,
  setSnakebarMessage,
  setSnakebarShown,
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTableView = (ordersToShow, orderIdsInLeadvartex) => {
    return (
      <AffiliateTable
        loadAllProductsFromLeadVertex={loadAllProductsFromLeadVertex}
        ordersToShow={ordersToShow}
        orderIdsInLeadvartex={orderIdsInLeadvartex}
        setSnakebarMessage={setSnakebarMessage}
        setSnakebarShown={setSnakebarShown}
      />
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="Orders">
          <Tab
            label={"Accepted Orders (" + (allAcceptedOrdersDetails && allAcceptedOrdersDetails.length) + " )"}
            {...a11yProps(0)}
          />
          <Tab
            label={"Processing Orders ( " + (allProcessingOrdersDetails && allProcessingOrdersDetails.length) + " )"}
            {...a11yProps(1)}
          />
          <Tab
            label={"Shipped Orders ( " + (allShippedOrdersDetails && allShippedOrdersDetails.length) + " )"}
            {...a11yProps(2)}
          />
          <Tab
            label={"Cancelled ( " + (allCancelledOrdersDetails && allCancelledOrdersDetails.length) + " )"}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {allAcceptedOrdersDetails && getTableView(allAcceptedOrdersDetails, allAcceptedOrderIds)}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {allProcessingOrdersDetails && getTableView(allProcessingOrdersDetails, allProcessingOrderIds)}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {allShippedOrdersDetails && getTableView(allShippedOrdersDetails, allShippedOrderIds)}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {allCancelledOrdersDetails && getTableView(allCancelledOrdersDetails, allCancellabledOrderIds)}
      </TabPanel>
    </Box>
  );
}
