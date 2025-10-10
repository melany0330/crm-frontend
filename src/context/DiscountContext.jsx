import React, { createContext, useState, useEffect } from "react";
import DiscountService from "../service/discount/DiscountService";
import { toast } from "react-toastify";

export const DiscountContext = createContext();

export const DiscountProvider = ({ children }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await DiscountService.listDiscounts();

      setDiscounts(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      toast.error("Error cargando descuentos");
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <DiscountContext.Provider value={{ discounts, loading, fetchDiscounts }}>
      {children}
    </DiscountContext.Provider>
  );
};
