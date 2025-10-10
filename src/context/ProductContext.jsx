import React, { createContext, useState, useEffect, useMemo } from 'react';
import { getCatalog, getCategories } from '../service/products/productService';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState(null);

  const [price, setPrice] = useState([0, 1000]);
  
  const [priceFilter, setPriceFilter] = useState([0, 1000]);

  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const productsData = await getCatalog();
        const categoriesData = await getCategories();
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error cargando productos o categorías:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  
  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
  };

  
  const handlePriceFilter = () => {
    setPriceFilter(price);
    setCurrentPage(1);
  };

  
const filteredProducts = useMemo(() => {
  return products.filter(p => {
    const matchCategory = filteredCategory ? p.idCategory === filteredCategory : true;
    const productPrice = Number(p.salePrice ?? p.price ?? 0); 
    const matchPrice = productPrice >= priceFilter[0] && productPrice <= priceFilter[1];
    return matchCategory && matchPrice;
  });
}, [products, filteredCategory, priceFilter]);

  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedProducts(filteredProducts.slice(start, end));
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryFilter = (categoryId) => {
    setFilteredCategory(categoryId);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      filteredCategory,
      paginatedProducts,
      loading,
      currentPage,
      totalPages,
      handlePageChange,
      handleCategoryFilter,

      price,
      handlePriceChange,
      handlePriceFilter,
    }}>
      {children}
    </ProductContext.Provider>
  );
};