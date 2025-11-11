import React from "react";
import Layout from "../../components/layout/Layout";
import RoleSystemDocs from "../../components/docs/RoleSystemDocs";

const RoleDocumentation = () => {
    return (
        <Layout login={true}>
            <RoleSystemDocs />
        </Layout>
    );
};

export default RoleDocumentation;