import React from 'react'
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection'
import PurchaseReport from './PurchaseReport'

const PurchasesReportMain = () => {
  return (
    <>
        <BreadcrumbSection title={"Reporte de Compras"} current={"Compras"}/>
        <PurchaseReport/>
    </>
  )
}

export default PurchasesReportMain