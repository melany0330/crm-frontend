import React from 'react';
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection';
import ClientsTable from './ClientsTable';

const ClientsMain = () => {
  return (
    <>
      <BreadcrumbSection title={"Gestión de Clientes"} current={"Clientes"} />
      <ClientsTable />
    </>
  );
};

export default ClientsMain;
