import React from 'react'
import Layout from '../components/layout/Layout'
import AccountMain from '../components/main/AccountMain'
import APIUtil from '../core/system/APIUtil'
import { Navigate } from 'react-router-dom'

const Account = () => {
  if ( APIUtil.validateSession() ) {
    return <>
          <Navigate to="/dashboard" replace />
        </>
  } else {
    return (
      <Layout>
          <AccountMain/>
      </Layout>
    )
  }
}

export default Account