import React from 'react'
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection'
import ProvidersTable from './ProvidersTable'

const ProvidersMain = () => {
  return (
    <>
        <BreadcrumbSection title={"Gestión de proveedores"} current={"Proveedores"}/>
        <ProvidersTable/>
    </>
  )
}

export default ProvidersMain