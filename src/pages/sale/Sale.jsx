import React from "react";
import Layout from "../../components/layout/Layout";
import SalesMain from "../../components/sales/SalesMain";

const Sales = () => {
  return (
    <Layout login={true}>
      <SalesMain />
    </Layout>
  );
};

export default Sales;
