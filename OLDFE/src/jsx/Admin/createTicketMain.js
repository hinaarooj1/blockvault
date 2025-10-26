import React, { useContext, useEffect } from "react";
import Nav from "../../jsx/layouts/nav/index.jsx";
import RightWalletBar from "../../jsx/layouts/nav/RightWalletBar.jsx";
import Footer from "../../jsx/layouts/Footer.jsx";
import { useSelector } from "react-redux";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import CreateTicket from "./createTicket.js";
import { ThemeContext } from "../../context/ThemeContext.jsx";
const Supportpage = () => {
  const { sidebariconHover, headWallet } = useContext(ThemeContext);
  const sideMenu = useSelector((state) => state.sideMenu);
  const authUser = useAuthUser();
  const Navigate = useNavigate();

  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    } else if (authUser().user.role === "admin") {
      return;
    }
  }, []);
  return (
    <div
      id="main-wrapper"
      className={`show wallet-open ${headWallet ? "" : "active"} ${sidebariconHover ? "iconhover-toggle" : ""
        } ${sideMenu ? "menu-toggle" : ""}`}
    >
      {/* <Nav /> */}
      {/* <RightWalletBar /> */}
      <div className="content-body new-bg-light">
        <div
          className="container-fluid"
          style={{ minHeight: window.screen.height - 45 }}
        >
          <CreateTicket />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Supportpage;
