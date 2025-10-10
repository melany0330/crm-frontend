import React from "react";
import Layout from "../../components/layout/Layout";
import InventoryMain from "../../components/inventory/InventoryMain";

const Inventory = () => {
  return (
    <Layout login={true}>
      <InventoryMain />
    </Layout>
  );
};

export default Inventory;