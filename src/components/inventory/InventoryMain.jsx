import React from 'react';
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection';
import InventoryTable from './InventoryTable';

const InventoryMain = () => {
  return (
    <>
      <BreadcrumbSection title={"Gestión de inventarios"} current={"Inventarios"} />
      <InventoryTable />
    </>
  );
};

export default InventoryMain;
