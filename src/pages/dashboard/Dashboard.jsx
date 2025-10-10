
import React from "react";
import Layout from "../../components/layout/Layout";
import DashboardAdmin from "../../components/dashboard/DashboardAdmin";

const Dashboard = () => {
  return (
    <Layout login={true}>
      <DashboardAdmin />
    </Layout>
  );
};

export default Dashboard;
