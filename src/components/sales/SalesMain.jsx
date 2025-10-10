import React, { useState, useEffect } from 'react';
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection';
import SalesTable from './SalesTable';
import SaleService from '../../service/sale/SaleService';
import { toast } from 'react-toastify';

const SalesMain = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = () => {
    setLoading(true);
    SaleService.listAll()
      .then(res => {
        setSales(res.data || []);
      })
      .catch(() => toast.error('Error cargando ventas'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <>
      <BreadcrumbSection title={"Gestión de Ventas"} current={"Ventas"} />
      
      <SalesTable sales={sales} loading={loading} />
    </>
  );
};

export default SalesMain;
