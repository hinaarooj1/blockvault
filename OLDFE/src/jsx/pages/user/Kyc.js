import React, { useContext, useEffect, useState } from "react";
import Nav from "../../layouts/nav";
import RightWalletBar from "../../layouts/nav/RightWalletBar";
import Footer from "../../layouts/Footer";
import { ThemeContext } from "../../../context/ThemeContext";
import PaymentMethods from "../report/PaymentMethods";
import { useSelector } from "react-redux";
import { getAllDataApi } from "../../../Api/Service";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import KycSec from "../dashboard/KycSec.js";
import { Spinner } from "react-bootstrap";

const Kyc = () => {
  const { sidebariconHover, headWallet } = useContext(ThemeContext);
  const sideMenu = useSelector((state) => state.sideMenu);
  const authUser = useAuthUser();
  const Navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    if (authUser().user.role === "user") {
      return;
    } else if (authUser().user.role === "admin") {
      Navigate("/admin/dashboard");
      return;
    }
    console.log(isLoading);
  }, []);
  console.log(isLoading);
  return (

    <>
      {isLoading ? <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
        <div style={{ opacity: 0, position: "absolute", left: "-2000%" }}><KycSec isLoading={isLoading} setisLoading={setisLoading} /></div>
      </div> : <div
        id="main-wrapper "
        className={`show main-kyc wallet-open ${headWallet ? "" : "active"} ${sidebariconHover ? "iconhover-toggle" : ""
          } ${sideMenu ? "menu-toggle" : ""}`}
      >
        <Nav />
        {/* <RightWalletBar /> */}
        <div className="content-body new-bg-light">
          <div
            className="container-fluid"
            style={{ minHeight: window.screen.height - 45 }}
          >
            <KycSec isLoading={isLoading} setisLoading={setisLoading} />
          </div>
        </div>
        <Footer />
      </div>}
    </>
  );
};

export default Kyc;
