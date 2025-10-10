import React from 'react'
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection'
import ProductsTable from './ProductsTable'

const ProductsMain = () => {
  return (
    <>
        <BreadcrumbSection title={"Gestión de productos"} current={"Productos"}/>
        <ProductsTable/>
    </>
  )
}

export default ProductsMain