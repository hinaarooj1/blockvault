import React, { useReducer, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMenuList from './Menu';
import { ThemeContext } from "../../../context/ThemeContext";
import SidebarExtraContent from "./SidebarExtraContent";
import { logoutApi } from "../../../Api/Service";
import { useSignOut } from 'react-auth-kit';
import { toast } from "react-toastify";

const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
};

const SideBar = () => {
  let Navigate = useNavigate();
  let signOut = useSignOut();
  const location = useLocation();
  const { ChangeIconSidebar } = useContext(ThemeContext);
  let Latest = new Date();

  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    const currentPath = location.pathname;
    MenuList.forEach((item) => {
      // Check if path starts with the item's route (e.g., /transactions or /transactions/:id)
      if (currentPath.startsWith(item.to)) {
        setState({ active: item.title });
      }
    });
  }, [location.pathname]);

  const onLogout = async () => {
    try {
      const logout = await logoutApi();

      if (logout.success) {
        signOut();

        Navigate("/auth/login");
        return;
      } else {
        toast.dismiss();
        toast.error(logout.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
    }
  };

  const MenuList = useMenuList();

  return (
    <div onMouseEnter={() => ChangeIconSidebar(true)} onMouseLeave={() => ChangeIconSidebar(false)} className="dlabnav">
      <SidebarExtraContent />
      {/* <span className="main-menu">Main Menu</span> */}
      <div className="menu-scroll new-bg-dark">
        <div className="dlabnav-scroll">
          <ul className="metismenu" id="menu">
            {MenuList.map((item, index) => (
              <li
                key={index}
                className={
                  state.active === item.title ||
                    location.pathname.startsWith(item.to) ? "mm-active" : ""
                }
              >
                <Link
                  to={item.to}
                  onClick={item.title === "Logout" ? onLogout : undefined} // Handle Logout click
                >
                  {item.iconStyle}
                  <span className="nav-text">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="support-box">
            <div className="media">
              <span>
                <svg width="40" height="46" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#fff"
                    d="M14 8.3v-2.3c0-3.3-2.7-6-6-6s-6 2.7-6 6v2.3c-1.2 0.5-2 1.7-2 3.1v1.2c0 1.8 1.3 3.2 3 3.4h2v-8h-1v-2c0-2.2 1.8-4 4-4s4 1.8 4 4v2h-1v8h2c1.7-0.2 3-1.7 3-3.4v-1.2c0-1.4-0.8-2.6-2-3.1zM4 15h-1v-6h1v6zM13 15h-1v-6h1v6z"
                  />
                </svg>
              </span>
            </div>
            <div className="info">
              <p>Contact our support</p>
              <Link to={"/support"} className="btn bg-white text-black w-75 btn-sm">
                Support
              </Link>
            </div>
          </div>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
