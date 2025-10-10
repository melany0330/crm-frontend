import React from 'react';
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection';
import RoleTable from './RoleTable';
import UserTable from './UserTable';

const UserMain = () => {
  return (
    <>
      <BreadcrumbSection title={"Gestión de Usuarios"} current={"Usuarios"} />
      <UserTable />
    </>
  );
};

export default UserMain;
