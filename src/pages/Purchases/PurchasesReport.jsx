import React from "react";
import Layout from "../../components/layout/Layout";
import PurchasesReportMain from "../../components/purchases/PurchasesReportMain";

const PurchasesReport = () => {
  return (
    <Layout login={true}>
      <PurchasesReportMain/>
    </Layout>
  );
};

export default PurchasesReport;
