import React from "react";
import Layout from "../../components/layout/Layout";
import PurchasesMain from "../../components/purchases/PurchasesMain"

const Purchases = () => {
  return (
    <Layout login={true}>
      <PurchasesMain/>
    </Layout>
  );
};

export default Purchases;
