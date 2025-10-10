import React from 'react';
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection';
import DiscountsTable from './DiscountsTable';

const DiscountMain = () => {
  return (
    <>
      <BreadcrumbSection title={"Gestión de Descuentos"} current={"Descuentos"} />
      <DiscountsTable />
    </>
  );
};

export default DiscountMain;
