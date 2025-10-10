import React from 'react';
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection';
import RoleTable from './RoleTable';

const RoleMain = () => {
  return (
    <>
      <BreadcrumbSection title={"Gestión de Roles"} current={"Roles"} />
      <RoleTable />
    </>
  );
};

export default RoleMain;
