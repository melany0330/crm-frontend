import React, { useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';

import HeaderSection2 from "../header/HeaderSection2";
import FooterSection from "../footer/FooterSection";
import RightSideBar from "../sidebar/RightSideBar";
import APIUtil from "../../core/system/APIUtil";

const Layout = ({ children, login = false }) => {
  if (!APIUtil.validateSession() && login) {    
    return <>
      <Navigate to="/account" replace />
    </>
  } else {
    return (
      <>
        <HeaderSection2 session={login} />
        {children}
        <RightSideBar />
        <FooterSection logo="assets/images/logo-1.png" />
      </>
    );
  }
};

export default Layout;
