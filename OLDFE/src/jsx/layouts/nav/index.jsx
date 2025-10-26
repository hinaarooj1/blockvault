import React, { Fragment, useEffect, useState } from "react";
import SideBar from "./SideBar";
import NavHader from "./NavHader";
import Header from "./Header";
import ChatBox from "../ChatBox";

import bgimg from '../../../assets/images/bg-1.png';
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

const JobieNav = ({ title, onClick: ClickToAddEvent, onClick2, onClick3 }) => {
  const [toggle, setToggle] = useState("");
  const onClick = (name) => setToggle(toggle === name ? "" : name);
  let path = window.location.pathname
  path = path.split('/')
  path = path[path.length - 1]
  const authUser = useAuthUser();
  const Navigate = useNavigate();

  useEffect(() => {
    if (authUser().user.role === "user") {
      return;
    } else if (authUser().user.role === "admin" || authUser().user.role === "subadmin") {
      Navigate("/admin/dashboard");
      return;
    }
  }, []);
  return (
    <Fragment>
      {
        path === "dashboard" || path === "index-2" ?
          <div className="header-banner" style={{ backgroundImage: `url(${bgimg})` }}></div>
          :
          ""
      }
      <NavHader />
      <ChatBox onClick={() => onClick("chatbox")} toggle={toggle} />
      <Header
        onNote={() => onClick("chatbox")}
        onNotification={() => onClick("notification")}
        onProfile={() => onClick("profile")}
        toggle={toggle}
        title={title}
        onBox={() => onClick("box")}
        onClick={() => ClickToAddEvent()}
      />
      <SideBar />
    </Fragment>
  );
};

export default JobieNav;
