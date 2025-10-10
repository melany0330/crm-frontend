import React from 'react'
import CakeHeaderWrapper from '../../components/wrapper/CakeHeaderWrapper'
import FooterSection3 from '../../components/footer/FooterSection3'
import CakeMain from '../../components/products/CakeMain'
import RightSideBar from '../../components/sidebar/RightSideBar'

const CakeShop = () => {
  return (
    <>
        <CakeHeaderWrapper/>
        <CakeMain/>
        <RightSideBar/>
        <FooterSection3/>
    </>
  )
}

export default CakeShop