import React from "react";
import Layout from "../../components/layout/Layout";
import NewPurchaseMain from "../../components/purchases/newPurchaseMain";

const NewPurchasePage = () => {
  return (
    <Layout login={true}>
      <NewPurchaseMain/>
    </Layout>
  );
};

export default NewPurchasePage;
