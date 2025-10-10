import React from "react";
import Layout from "../../components/layout/Layout";
import ProvidersMain from "../../components/providers/ProvidersMain";

const Providers = () => {
  return (
    <Layout login={true}>
      <ProvidersMain/>
    </Layout>
  );
};

export default Providers;
