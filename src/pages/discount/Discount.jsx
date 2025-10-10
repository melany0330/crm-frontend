import React from "react";
import Layout from "../../components/layout/Layout";
import DiscountMain from "../../components/discounts/DiscountsMain";

const Discount = () => {
  return (
    <Layout login={true}>
      <DiscountMain />
    </Layout>
  );
};

export default Discount;
