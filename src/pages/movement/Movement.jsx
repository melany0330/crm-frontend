import React from "react";
import Layout from "../../components/layout/Layout";
import MovementMain from "../../components/movement/MovementMain";

const Movement = () => {
  return (
    <Layout login={true}>
      <MovementMain />
    </Layout>
  );
};

export default Movement;