import React from 'react'
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection'
import PurchasesTable from './PurchasesTable'

const PurchasesMain = () => {
  return (
    <>
        <BreadcrumbSection title={"Gestión de compras"} current={"Compras"}/>
        <PurchasesTable/>
    </>
  )
}

export default PurchasesMain