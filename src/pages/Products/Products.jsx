import React from "react";
import Layout from "../../components/layout/Layout";
import ProductsMain from "../../components/products/ProductsMain";

const Products = () => {
  return (
    <Layout login={true}>
      <ProductsMain/>
    </Layout>
  );
};

export default Products;
