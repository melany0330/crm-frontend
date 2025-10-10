import React from 'react';
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection';
import MovementTable from './MovementTable';

const MovementMain = () => {
  return (
    <>
      <BreadcrumbSection title={"Gestión de movimientos"} current={"Transacciones"} />
      <MovementTable />
    </>
  );
};

export default MovementMain;
