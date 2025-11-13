import React from "react";
import Layout from "../../components/layout/Layout";
import SimpleRoleDemo from "../../components/admin/SimpleRoleDemo";

const RoleDemo = () => {
    return (
        <Layout login={true}>
            <SimpleRoleDemo />
        </Layout>
    );
}; export default RoleDemo;