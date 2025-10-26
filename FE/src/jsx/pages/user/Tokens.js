import React, { useContext, useEffect } from "react";
import Nav from "../../layouts/nav";
import RightWalletBar from "../../layouts/nav/RightWalletBar";
import Footer from "../../layouts/Footer";
import { ThemeContext } from "../../../context/ThemeContext";
import MyTokens from "../report/MyTokens.jsx";
import { useSelector } from "react-redux";
import { getAllDataApi, getLinksApi } from "../../../Api/Service";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import AllDocuments from "../dashboard/Documents";
import { useState } from "react";

const Tokens = () => {
  const
    [isLoading, setisLoading] = useState(true);
  const { sidebariconHover, headWallet } = useContext(ThemeContext);
  const sideMenu = useSelector((state) => state.sideMenu);
  const authUser = useAuthUser();
  const Navigate = useNavigate();
  const fetchLinks = async () => {
    try {
      const data = await getLinksApi();if (data?.links[8]?.enabled) {

        setisLoading(false)
      } else {
        Navigate(-1);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };
  useEffect(() => {
    fetchLinks()
  }, []);

  useEffect(() => {
    if (authUser().user.role === "user") {
      return;
    } else if (authUser().user.role === "admin"|| authUser().user.role === "superadmin"|| authUser().user.role === "subadmin") {
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
          {isLoading ? "" :

            <MyTokens />
          }
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Tokens;
