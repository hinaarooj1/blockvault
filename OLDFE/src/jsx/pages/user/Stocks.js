import React, { useContext, useEffect } from "react";
import Nav from "../../layouts/nav";
import RightWalletBar from "../../layouts/nav/RightWalletBar";
import Footer from "../../layouts/Footer";
import { ThemeContext } from "../../../context/ThemeContext";
import StocksSec from "../report/StocksSec.jsx";
import { useSelector } from "react-redux";
import { getAllDataApi } from "../../../Api/Service";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import AllDocuments from "../dashboard/Documents";

const Transactions = () => {
  const { sidebariconHover, headWallet } = useContext(ThemeContext);
  const sideMenu = useSelector((state) => state.sideMenu);
  const authUser = useAuthUser();
  const Navigate = useNavigate();

  useEffect(() => {
    if (authUser().user.role === "user") {
      return;
    } else if (authUser().user.role === "admin") {
      Navigate("/admin/dashboard");
      return;
    }
  }, []);
  return (
    <div
      id="main-wrapper"
      className={`show wallet-open ${headWallet ? "" : "active"} ${sidebariconHover ? "iconhover-toggle" : ""
        } ${sideMenu ? "menu-toggle" : ""}`}
    >
      <Nav />
      <RightWalletBar />
      <div className="content-body new-bg-light">
        <div
          className="container-fluid"
          style={{ minHeight: window.screen.height - 45 }}
        >
          <StocksSec />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Transactions;
