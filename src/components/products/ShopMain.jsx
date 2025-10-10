import React from 'react'
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection'
import ShopAreaSection from '../../components/products/ShopAreaSection'

const ShopMain = () => {
  return (
    <>
        <BreadcrumbSection title={"Cakes"} current={"Cakes"}/>
        <ShopAreaSection/>
    </>
  )
}

export default ShopMain