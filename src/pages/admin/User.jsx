import React from "react";
import Layout from "../../components/layout/Layout";
import UserMain from "../../components/admin/UserMain";

const User = () => {
  return (
    <Layout login={true}>
      <UserMain />
    </Layout>
  );
};

export default User;