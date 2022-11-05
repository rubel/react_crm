/* eslint-disable prettier/prettier */
import React from "react";
import LeadvartexOrderRow from "./LeadvartexOrderRow";


function AffiliateTable({
    ordersToShow,
    orderIdsInLeadvartex,
    loadAllProductsFromLeadVertex,
    setSnakebarMessage,
    setSnakebarShown
}) {
    
  return (
        <div style={{maxHeight:"600px",overflowY:"scroll"}}>
            
                    {ordersToShow &&
                        ordersToShow.map((order, index) => {
                        return (
                            <LeadvartexOrderRow
                            order={order}
                            orderIdInLeadvartex = {orderIdsInLeadvartex && orderIdsInLeadvartex[index]}
                            index={index}
                            key={index}
                            loadAllProductsFromLeadVertex={loadAllProductsFromLeadVertex}
                            setSnakebarMessage={setSnakebarMessage}
                            setSnakebarShown={setSnakebarShown}
                            />
                        );
                    })}
        </div>
  );
}

export default AffiliateTable;
