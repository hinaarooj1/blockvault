import logo_300x57_1 from "../../assets/img/logo-300x57-1.png";
import React, { useEffect, useState } from "react";
import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import Log from "../../assets/img/log.jpg";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { logoutApi } from "../../Api/Service";
import { toast } from "react-toastify";
const SideBar = (props) => {
  let signOut = useSignOut();

  let authUser = useAuthUser();
  const [Admin, setAdmin] = useState("");
  const [noPop, setnoPop] = useState(false);
  useEffect(() => {
    if (authUser().user.role === "user") {
      setAdmin(authUser().user);
      return;
    } else if (authUser().user.role === "admin") {
      setAdmin(authUser().user);
      return;
    }
  }, []);
  let togglePop = () => {
    if (noPop === false) {
      setnoPop(true);
    } else {
      setnoPop(false);
    }
  };
  let Navigate = useNavigate();
  const isLoginOrLogout = async () => {
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
  return (
    <div
      id="sidebar"
      className={
        props.state
          ? "bgdk border-muted-200 dark:border-muted-700 fixed left-0 top-0 z-[60] flex h-full flex-col border-r bg-white transition-all duration-300 w-[280px] -translate-x-full translate-x-0 lg:translate-x-0"
          : "bgdk border-muted-200 dark:border-muted-700 fixed left-0 top-0 z-[60] flex h-full flex-col border-r bg-white transition-all duration-300 w-[280px] -translate-x-full lg:translate-x-0"
      }
    >
      <div onClick={props.toggle} className="closes text-white ">
        X
      </div>
      <div className="flex h-16 w-full items-center justify-between px-6">
        <div className="flex  items-center  ">
          <NavLink
            to="/"
            className="router-link-active router-link-exact-active flex items-center justify-center"
            aria-current="page"
          >
            <img src={logo_300x57_1} alt="" />

            {/* <svg
              width={224}
              height={24}
              viewBox="0 0 224 24"
              fill="none"
              className="Header__BlockchainLogo-ra9ecu-7 jPvoRr"
            >
              <g clipPath="url(#a)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M139.92 3.879a2.028 2.028 0 0 1 1.163-1.954 2.026 2.026 0 1 1 .862 3.859 1.968 1.968 0 0 1-1.853-1.158 1.969 1.969 0 0 1-.172-.747zm.15 3.645h3.735v13.5h-3.735v-13.5zm-99.87-4.5H33v18h7.71c4.035 0 6.195-2.115 6.195-4.98a4.17 4.17 0 0 0-3.96-4.365v-.18a3.84 3.84 0 0 0 3.255-3.87c0-2.685-2.025-4.605-6-4.605zm2.145 5.22c0 1.425-1.215 2.28-2.715 2.28l-2.88.045v-4.5h2.94c1.695 0 2.655.75 2.655 2.175zm.555 7.395c0 1.35-.87 2.235-3 2.235h-3.15v-4.77h3.15a2.626 2.626 0 0 1 3 2.535zm5.85 5.385h3.795l-.06-18H48.75v18zm5.76-6.705c0-4.185 2.55-6.975 6.645-6.975s6.645 2.79 6.645 6.975-2.55 6.96-6.645 6.96-6.645-2.79-6.645-6.96zm9.48-.008c-.002-2.35-.977-4.087-2.82-4.087-1.845 0-2.865 1.74-2.865 4.095 0 2.355.975 4.08 2.865 4.08 1.888 0 2.818-1.736 2.82-4.088zm11.85-6.967c-4.095 0-6.63 2.835-6.63 6.975 0 4.11 2.49 6.96 6.63 6.96 3.555 0 5.82-2.1 6-5.205H78.3a2.4 2.4 0 0 1-2.445 2.25c-1.755 0-2.88-1.545-2.88-4.05s1.14-4.005 2.88-4.005a2.4 2.4 0 0 1 2.445 2.25h3.54c-.12-3.12-2.475-5.175-6-5.175zm7.965-4.32h3.75v9.615h.195l4.335-5.115h4.29l-5.01 5.85 5.265 7.65h-4.38l-3.69-5.445-1.005 1.155v4.29h-3.75v-18zm19.44 4.32c-4.095 0-6.63 2.835-6.63 6.975 0 4.11 2.49 6.96 6.66 6.96 3.57 0 5.82-2.1 6-5.205h-3.525a2.414 2.414 0 0 1-2.46 2.25c-1.755 0-2.88-1.545-2.88-4.05s1.14-4.005 2.88-4.005a2.417 2.417 0 0 1 2.46 2.25h3.495c-.105-3.12-2.475-5.175-6-5.175zm11.715 13.68h-3.735v-18h3.63v6.885h.165a3.985 3.985 0 0 1 4.035-2.565c2.805 0 4.665 1.92 4.665 5.085v8.595h-3.75v-7.935a2.299 2.299 0 0 0-.577-1.882 2.292 2.292 0 0 0-1.823-.743 2.523 2.523 0 0 0-2.485 1.7 2.51 2.51 0 0 0-.125 1.06v7.8zm15.66-7.935c-2.67.255-5.07 1.17-5.07 4.17 0 2.67 1.905 4.02 4.485 4.02a4.141 4.141 0 0 0 3.945-2.13h.105v1.875h3.555v-9.12c0-3.225-2.73-4.575-5.73-4.575-3.24 0-5.355 1.545-5.88 4.005l3.465.285a2.25 2.25 0 0 1 2.4-1.5c1.275 0 1.995.645 1.995 1.755 0 .885-.915.99-3.27 1.215zm3.3 1.605v1.5a2.599 2.599 0 0 1-.891 1.805 2.591 2.591 0 0 1-1.914.625c-1.155 0-1.98-.525-1.98-1.575 0-1.05.87-1.575 2.19-1.755a9.189 9.189 0 0 0 2.595-.6zm12.33 6.33h3.81l-.06-7.8a2.473 2.473 0 0 1 2.55-2.76 2.31 2.31 0 0 1 2.4 2.625v7.935h3.75v-8.595c0-3.15-1.845-5.085-4.665-5.085a4.112 4.112 0 0 0-4.065 2.565h-.15V7.524h-3.57v13.5z"
                  fill="currentColor"
                />
                <path
                  opacity=".6"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M199.95 7.524h-3.57l-.015 13.5h3.75v-8.1a2.268 2.268 0 0 1 1.292-2.276 2.26 2.26 0 0 1 .898-.214 1.977 1.977 0 0 1 1.959 1.339c.091.268.124.554.096.836v8.415h3.63v-8.25a2.114 2.114 0 0 1 2.175-2.34 2.01 2.01 0 0 1 2.085 2.25v8.34H216v-9a4.366 4.366 0 0 0-8.25-2.115h-.21a3.57 3.57 0 0 0-3.675-2.565 3.778 3.778 0 0 0-3.75 2.565h-.165V7.524zm-26.25-.18c-4.095 0-6.615 2.835-6.615 6.975 0 4.11 2.475 6.96 6.69 6.96 3.57 0 5.835-2.1 6-5.205h-3.525a2.414 2.414 0 0 1-2.46 2.25c-1.74 0-2.88-1.545-2.88-4.05s1.14-4.005 2.88-4.005a2.417 2.417 0 0 1 2.46 2.25h3.45c-.105-3.12-2.475-5.175-6-5.175zm-11.83 10.315a2.102 2.102 0 0 0 1.48 3.59 2.1 2.1 0 1 0-1.48-3.59zm19.27-3.34c0-4.185 2.55-6.975 6.645-6.975s6.63 2.79 6.63 6.975-2.535 6.96-6.63 6.96-6.645-2.79-6.645-6.96zm9.48-.007c-.002-2.352-.977-4.088-2.82-4.088-1.845 0-2.865 1.74-2.865 4.095 0 2.355.975 4.08 2.865 4.08 1.888 0 2.818-1.736 2.82-4.087z"
                  fill="currentColor"
                />
                <path
                  d="M2.054 8.722.959 9.817a3.12 3.12 0 0 0 0 4.5l8.821 8.909c.21.214.452.391.72.525V12.952l-8.446-4.23z"
                  fill="#3D89F5"
                />
                <path
                  d="m21.947 8.722 1.095 1.095a3.12 3.12 0 0 1 0 4.5l-8.822 8.909c-.21.214-.452.391-.72.525V12.952l8.447-4.23z"
                  fill="#1656B9"
                />
                <path
                  d="M19.828 6.487 14.308.952a3.134 3.134 0 0 0-4.5 0L4.273 6.487l7.755 3.87 7.8-3.87z"
                  fill="#85B5F8"
                />
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M0 0h216v24H0z" />
                </clipPath>
              </defs>
            </svg> */}
          </NavLink>
        </div>
      </div>

      <div className="slimscroll relative w-full grow overflow-y-auto py-6 px-6">
        <ul id="sidebar-menu" className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className=" nui-focus text-muted-500 color-whute dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex cursor-pointer items-center gap-4 rounded-lg py-3 transition-colors duration-300 px-4"
              aria-current="page"
            >
              <svg
                data-v-cd102a71
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                className="icon w-5 h-5"
                width="1em"
                height="1em"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M5 3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm9 4a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0zm-3 2a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0zm-3 3a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="whitespace-nowrap font-sans text-sm block">
                Dashboard
              </span>
            </NavLink>
          </li>
          <li>
            <div className="border-muted-200 dark:border-muted-700 my-3 h-px w-full border-t" />
          </li>
          <li>
            <NavLink
              to="/assets"
              className="router-link-active nui-focus text-muted-500 color-whute dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex cursor-pointer items-center gap-4 rounded-lg py-3 transition-colors duration-300 px-4"
            >
              <svg
                data-v-cd102a71
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                className="icon w-5 h-5"
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
              >
                <g fill="currentColor">
                  <path
                    d="M88 48v160H40a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8Z"
                    opacity=".2"
                  />
                  <path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M40 152h16a8 8 0 0 0 0-16H40v-16h16a8 8 0 0 0 0-16H40V88h16a8 8 0 0 0 0-16H40V56h40v144H40Zm176 48H96V56h120z"></path>
                </g>
              </svg>
              <span className="whitespace-nowrap font-sans text-sm block">
                My Assets
              </span>
            </NavLink>
          </li>

          <div className="painchod">
            <li>
              <NavLink
                to="/exchanges"
                className="router-link-active nui-focus text-muted-500 color-whute dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex cursor-pointer items-center gap-4 rounded-lg py-3 transition-colors duration-300 px-4"
              >
                <svg
                  fill="currentColor"
                  height="1rem"
                  width="1rem"
                  className="icon w-5 h-5"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 477.427 477.427"
                  xmlSpace="preserve"
                >
                  <g>
                    <polygon
                      points="101.82,187.52 57.673,143.372 476.213,143.372 476.213,113.372 57.181,113.372 101.82,68.733 80.607,47.519 
		0,128.126 80.607,208.733 	"
                    />
                    <polygon
                      points="396.82,268.694 375.607,289.907 420,334.301 1.213,334.301 1.213,364.301 420,364.301 375.607,408.694 
		396.82,429.907 477.427,349.301 	"
                    />
                  </g>
                </svg>
                <span className="whitespace-nowrap font-sans text-sm block">
                  Exchange
                </span>
              </NavLink>
            </li>
            <li>
              <a
                href="https://www.blockchain.com/explorer"
                target="_blank"
                onClick={props.toggle}
                className="router-link-active nui-focus text-muted-500 color-whute dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex cursor-pointer items-center gap-4 rounded-lg py-3 transition-colors duration-300 px-4"
              >
                <svg
                  fill="currentColor"
                  height="1rem"
                  width="1rem"
                  className="icon w-5 h-5"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                >
                  <g>
                    <g>
                      <path
                        d="M498.61,437.537l-25.802-25.802l-61.688,61.687l25.802,25.802c17.035,17.035,44.653,17.035,61.687,0
			C515.645,482.189,515.645,454.571,498.61,437.537z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M385.303,324.229c20.834-45.666,12.682-101.686-25.307-139.676c-48.651-48.651-127.397-48.657-176.055,0
			c-48.483,48.482-48.611,127.446,0,176.057c38.518,38.518,94.769,45.796,139.674,25.306c5.84,5.84,52.433,52.433,58.248,58.248
			l61.687-61.687C437.734,376.661,391.143,330.07,385.303,324.229z M320.529,321.144c-26.841,26.839-70.281,26.84-97.122,0
			c-26.777-26.776-26.777-70.347,0-97.123c26.84-26.839,70.281-26.84,97.122,0C347.369,250.861,347.371,294.302,320.529,321.144z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M151.314,0C68.218,0,0.614,67.604,0.614,150.7c0,75.066,55.171,137.482,127.092,148.845
			c-2.914-15.719-3.359-32.278-0.81-49.117c-4.559-6.655-8.194-14.082-11.164-21.548c5.445-0.791,11.021-1.398,16.676-1.823
			c6.91-21.299,18.858-41.37,35.65-58.193l1.45-1.42c17.269-16.84,38.8-29.738,63.577-36.497
			c-0.798-11.655-2.296-22.996-4.452-33.826c7.815-2.455,15.207-5.289,22.068-8.479c7.07,11.282,12.273,23.846,15.173,37.258
			c11.662-0.472,23.114,0.381,34.499,2.601C289.609,55.893,226.869,0,151.314,0z M51.79,212.543
			c-8.396-13.462-14.136-28.739-16.487-45.099h34.037c0.719,12.621,2.253,24.898,4.553,36.588
			C66.064,206.495,58.66,209.34,51.79,212.543z M69.358,133.955H35.304c2.363-16.447,8.152-31.801,16.622-45.315
			c6.861,3.19,14.253,6.024,22.068,8.479C71.653,108.88,70.094,121.244,69.358,133.955z M74.517,239.266
			c0.023-0.009,0.049-0.018,0.073-0.027c2.64-1.012,5.367-1.97,8.172-2.873c1.64,4.506,3.428,8.834,5.337,12.997
			c0.013,0.03,0.028,0.059,0.041,0.088C83.383,246.399,78.821,243.011,74.517,239.266z M88.281,51.92
			c-1.907,4.13-3.697,8.42-5.338,12.891c-2.772-0.889-5.516-1.846-8.199-2.871c4.292-3.715,8.838-7.076,13.578-10.105
			C88.307,51.863,88.294,51.891,88.281,51.92z M134.569,193.332c-9.592,0.556-18.988,1.587-28.075,3.062
			c-1.759-9.231-2.976-18.933-3.615-28.95h31.689V193.332z M134.569,133.955h-31.673c0.655-10.114,1.9-19.907,3.698-29.213
			c9.055,1.467,18.418,2.493,27.974,3.046V133.955z M134.569,74.22c-6.327-0.422-12.558-1.074-18.633-1.952
			c4.272-10.616,10.436-22.288,18.633-30.333V74.22z M168.058,41.935c8.198,8.047,14.363,19.722,18.633,30.333
			c-6.075,0.878-12.306,1.53-18.633,1.952V41.935z M168.058,133.955v-26.167c9.557-0.554,18.919-1.58,27.974-3.046
			c1.799,9.307,3.043,19.1,3.699,29.213H168.058z M219.685,64.811c-1.666-4.539-3.436-8.77-5.378-12.976
			c4.74,3.029,9.285,6.39,13.577,10.105C225.201,62.963,222.457,63.922,219.685,64.811z"
                      />
                    </g>
                  </g>
                </svg>
                <span className="whitespace-nowrap font-sans text-sm block">
                  Explorer
                </span>
              </a>
            </li>
          </div>
          <li>
            <NavLink
              to={`/transactions/${Admin._id}`}
              className="router-link-active nui-focus text-muted-500 color-whute dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex cursor-pointer items-center gap-4 rounded-lg py-3 transition-colors duration-300 px-4"
            >
              <svg
                data-v-cd102a71
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                className="icon w-5 h-5"
                width="1em"
                height="1em"
                viewBox="0 0 20 20"
              >
                <g fill="currentColor">
                  <path d="M9 2a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 0 1 2-2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm3 4a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2zm3 0a1 1 0 0 0 0 2h3a1 1 0 1 0 0-2zm-3 4a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2zm3 0a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2z"
                    clipRule="evenodd"
                  />
                </g>
              </svg>
              <span className="whitespace-nowrap font-sans text-sm block">
                Transactions
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ticket"
              className=" router-link-active nui-focus text-muted-500 color-whute dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex cursor-pointer items-center gap-4 rounded-lg py-3 transition-colors duration-300 px-4"
            >
              <svg
                data-v-cd102a71
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                className="icon w-5 h-5"
                width="1em"
                height="1em"
                viewBox="0 0 20 20"
              >
                <g fill="currentColor">
                  <path d="M2 5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9l-3 3v-3H4a2 2 0 0 1-2-2z"></path>
                  <path d="M15 7v2a4 4 0 0 1-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                </g>
              </svg>
              <span className="whitespace-nowrap font-sans text-sm block">
                Feedback &amp; Support
              </span>
            </NavLink>
          </li>
          <li onClick={() => isLoginOrLogout()}>
            <p className="cursor-pointer router-link-active nui-focus text-muted-500 color-whute dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex cursor-pointer items-center gap-4 rounded-lg py-3 transition-colors duration-300 px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                id="logout"
                width="1rem"
                height="1rem"
              >
                <g data-name="Layer 2" fill="currentColor">
                  <path
                    d="M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6zm13.82 5.42-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z"
                    data-name="log-out"
                  ></path>
                </g>
              </svg>
              <span className="whitespace-nowrap font-sans text-sm block">
                Logout
              </span>
            </p>
          </li>
          {/**/}
        </ul>
      </div>
      <div className="flex h-16 w-full items-center gap-4 transition-all duration-150 px-6">
        <div className="group inline-flex items-center justify-center text-right">
          <div data-headlessui-state className="relative h-10 w-10 text-left">
            <button
              onClick={togglePop}
              className="group-hover:ring-primary-500 dark:ring-offset-muted-800 inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-offset-4"
              id="headlessui-menu-button-34"
              aria-haspopup="menu"
              aria-expanded="false"
              type="button"
            >
              <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-full">
                <img
                  src={Log}
                  className="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                  alt=""
                />
              </div>
            </button>
            {noPop && (
              <div
                aria-labelledby="headlessui-menu-button-31"
                id="headlessui-menu-items-32"
                role="menu"
                tabIndex={0}
                data-headlessui-state="open"
                className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 absolute mt-2 w-60 origin-bottom-right rounded-md border bg-white text-left shadow-lg focus:outline-none bottom-0 -end-64"
              >
                <div
                  className="bg-muted-50 dark:bg-muted-700/40 p-6"
                  role="none"
                >
                  <div className="flex items-center" role="none">
                    <div
                      className="relative inline-flex h-14 w-14 items-center justify-center rounded-full"
                      role="none"
                    >
                      <img
                        src={Log}
                        className="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                        alt=""
                        role="none"
                      />
                    </div>
                    <div className="ms-3" role="none">
                      <h6
                        className="font-heading text-muted-800 text-sm font-medium dark:text-white"
                        role="none"
                      >
                        {Admin.firstName}
                      </h6>
                      <p
                        className="text-muted-400 font-sans text-xs"
                        role="none"
                      >
                        {Admin.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2" role="none">
                  <div
                    id="headlessui-menu-item-44"
                    role="menuitem"
                    tabIndex={-1}
                    data-headlessui-state
                  >
                    <p
                      onClick={() => isLoginOrLogout()}
                      className="group flex w-full cursor-pointer items-center rounded-md p-3 text-sm transition-colors duration-300 text-muted-400"
                    >
                      <div className="ms-3">
                        <h6 className="font-heading text-muted-800 text-xs font-medium leading-none dark:text-white">
                          Logout
                        </h6>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/**/}
          </div>
        </div>
        <span className="text-muted-500 color-whute dark:text-muted-400/80 whitespace-nowrap font-sans text-sm block">
          My Account
        </span>
      </div>
    </div>
  );
};

export default SideBar;
