import React from "react";
import Layout from "../../components/layout/Layout";
import RoleMain from "../../components/admin/RoleMain";

const Role = () => {
  return (
    <Layout login={true}>
      <RoleMain />
    </Layout>
  );
};

export default Role;