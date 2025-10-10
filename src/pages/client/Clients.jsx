import React from "react";
import Layout from "../../components/layout/Layout";
import ClientsMain from "../../components/clients/ClientsMain";

const Clients = () => {
  return (
    <Layout login={true}>
      <ClientsMain />
    </Layout>
  );
};

export default Clients;