import React from 'react'
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection'
import NewPurchases from './newPurchase'

const newPurchaseMain = () => {
  return (
    <>
        <BreadcrumbSection title={"Realizar una compra"} current={"Compra"}/>
        <NewPurchases />
    </>
  )
}

export default newPurchaseMain