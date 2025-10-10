import React from 'react'
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection'
import AuthenticationView from '../authentication/AuthenticationView'

const AccountMain = () => {
  return (
    <>
        <BreadcrumbSection title={"Mi cuenta"} current={"Mi Cuenta"}/>
        <AuthenticationView />
    </>
  )
}

export default AccountMain