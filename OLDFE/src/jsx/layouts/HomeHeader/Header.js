import logo_300x57_1 from "../../assets/img/logo-300x57-1.png";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useAuthUser } from "react-auth-kit";
const Header = () => {
  let authUser = useAuthUser();
  const [isNav, setisNav] = useState(false);
  let toggleNav = () => {
    if (isNav === false) {
      setisNav(true);
    } else {
      setisNav(false);
    }
  };

  return (
    <div>
      <div className="Header__TopBar-ra9ecu-0 eVUBqp">
        <div className="Header__Container-ra9ecu-1 cQDlQl">
          <Link
            to="/"
            aria-label="homepage"
            className="Link__CustomLink-sc-1p80yfz-0 hDjhKH"
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
          </Link>
          <div className="Header__DesktopContainer-ra9ecu-2 Header__DesktopMenu-ra9ecu-3 bZhfok ddctkp">
            <nav>
              <ul className="Header__List-ra9ecu-8 ffonJJ">
                <li className="Header__ListItem-ra9ecu-9 kRTKLx">
                  <Link
                    to="/wallet"
                    className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 Header__Link-ra9ecu-10 vvWMe kmtyGJ iVPEJa"
                    target="_self"
                  >
                    Wallet
                  </Link>
                </li>
                <li className="Header__ListItem-ra9ecu-9 kRTKLx">
                  <a
                    href="https://exchange.blockchain.com"
                    className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 Header__Link-ra9ecu-10 vvWMe kmtyGJ kIWMbY"
                    target="_self"
                  >
                    Exchange
                  </a>
                </li>
                <li className="Header__ListItem-ra9ecu-9 kRTKLx">
                  <a
                    href="https://www.blockchain.com/explorer"
                    className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 Header__Link-ra9ecu-10 vvWMe kmtyGJ kIWMbY"
                    target="_self"
                  >
                    Explorer
                  </a>
                </li>
                <li className="Header__ListItem-ra9ecu-9 kRTKLx">
                  <a
                    href="https://www.blockchain.com/pay"
                    className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 Header__Link-ra9ecu-10 vvWMe kmtyGJ kIWMbY"
                    target="_self"
                  >
                    Pay
                  </a>
                </li>
                <li className="Header__ListItem-ra9ecu-9 kRTKLx">
                  <a
                    href="https://www.blockchain.com/institutional"
                    className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 Header__Link-ra9ecu-10 vvWMe kmtyGJ kIWMbY"
                    target="_self"
                  >
                    Institutional
                  </a>
                </li>
                <li className="EllipsisMenu__Menu-s24ovs-2 duaFoJ">
                  <button
                    aria-label="open menu"
                    className="EllipsisMenu__MegaButton-s24ovs-0 gdPmLE"
                  >
                    <svg width={24} height={25} viewBox="0 0 24 25" fill="none">
                      <path
                        d="M19 13.5C19.5523 13.5 20 13.0523 20 12.5C20 11.9477 19.5523 11.5 19 11.5C18.4477 11.5 18 11.9477 18 12.5C18 13.0523 18.4477 13.5 19 13.5Z"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 13.5C12.5523 13.5 13 13.0523 13 12.5C13 11.9477 12.5523 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5C11 13.0523 11.4477 13.5 12 13.5Z"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 13.5C5.55228 13.5 6 13.0523 6 12.5C6 11.9477 5.55228 11.5 5 11.5C4.44772 11.5 4 11.9477 4 12.5C4 13.0523 4.44772 13.5 5 13.5Z"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div className="EllipsisMenu__MegaMenuContainer-s24ovs-1 INfLT">
                    <nav className="MegaMenu__MegaNav-fwgpnb-0 idhROZ">
                      <div className="MegaMenu__Column-fwgpnb-1 kJUygl">
                        <p className="Text__BodyBig-sc-1fwf07x-15 Text__BodyBold-sc-1fwf07x-16 MegaMenu__ColumnTitle-fwgpnb-2 jdRAXE hOyGHK gThmmq">
                          Products
                        </p>
                        <ul className="MegaMenu__List-fwgpnb-3 hyPzr">
                          <li
                            onClick={toggleNav}
                            className="MegaMenu__Item-fwgpnb-4 lnAMCv"
                          >
                            <Link
                              to="/wallet"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Wallet
                            </Link>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://exchange.blockchain.com"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Exchange
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/explorer"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Explorer
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/pay"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Pay
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/institutional"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Institutional
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/earn"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Earn
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/card"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Card
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/learning-portal/bitcoin-faq"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Learn
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/prices"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Prices
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/charts"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Charts
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/waitlist/nft"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              NFT
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="MegaMenu__Column-fwgpnb-1 kJUygl">
                        <p className="Text__BodyBig-sc-1fwf07x-15 Text__BodyBold-sc-1fwf07x-16 MegaMenu__ColumnTitle-fwgpnb-2 jdRAXE hOyGHK gThmmq">
                          Resources
                        </p>
                        <ul className="MegaMenu__List-fwgpnb-3 hyPzr">
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/api"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              APIs
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain-status.com/"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_blank"
                            >
                              Status
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://github.com/blockchain/"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_blank"
                            >
                              Open Source
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/research"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Research
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/legal/privacy"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Legal &amp; Privacy
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://support.blockchain.com"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_blank"
                            >
                              Support
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/blog"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Blog
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/security"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Security
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/podcast"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Podcast
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="MegaMenu__Column-fwgpnb-1 kJUygl">
                        <p className="Text__BodyBig-sc-1fwf07x-15 Text__BodyBold-sc-1fwf07x-16 MegaMenu__ColumnTitle-fwgpnb-2 jdRAXE hOyGHK gThmmq">
                          Company
                        </p>
                        <ul className="MegaMenu__List-fwgpnb-3 hyPzr">
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/about"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              About
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/careers"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Careers
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/press"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Press Center
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://exchange.blockchain.com/prime"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Prime
                            </a>
                          </li>
                          <li className="MegaMenu__Item-fwgpnb-4 lnAMCv">
                            <a
                              href="https://www.blockchain.com/ventures"
                              className="Link__CustomLink-sc-1p80yfz-0 hDjhKH MegaMenu__Link-fwgpnb-5 iksypf"
                              target="_self"
                            >
                              Ventures
                            </a>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
          <div className="Header__DesktopContainer-ra9ecu-2 Header__DesktopActions-ra9ecu-4 bZhfok kvQKhY">
            <div className="DesktopSearchNav__Component-x03xav-5 ibLEuO Header__SearchNav-ra9ecu-5 eLyMAV">
              <button
                aria-label="Open search"
                className="DesktopSearchNav__SearchButton-x03xav-1 ctBmkR"
              >
                <div
                  className="DesktopSearchNav__TransitionAnimation-x03xav-2 imGUBn"
                  style={{
                    opacity: 0,
                    visibility: "visible",
                    transformOrigin: "50% 50% 0px",
                  }}
                />
                <svg height={19} viewBox="0 0 18 19" width={18}>
                  <path
                    d="m559.179993 45.9010802c0-3.4003115-2.373108-5.56108-5.564608-5.56108-3.191501 0-5.565397 2.1674824-5.565397 5.56108 0 3.3935975 2.090012 5.568921 5.565397 5.568921s5.564608-2.1686096 5.564608-5.568921zm4.820007 9c0 .7572115-.627404 1.3846154-1.384615 1.3846154-.367789 0-.72476-.1514424-.973558-.4110577l-3.710337-3.6995193c-1.265625.876202-2.780048 1.3413462-4.316105 1.3413462-4.207933 0-7.615385-3.4074519-7.615385-7.6153846s3.407452-7.6153846 7.615385-7.6153846c4.207932 0 7.615384 3.4074519 7.615384 7.6153846 0 1.5360577-.465144 3.0504807-1.341346 4.3161057l3.710337 3.7103366c.248798.2487981.40024.6057692.40024.9735577z"
                    fill="currentColor"
                    fillRule="evenodd"
                    transform="translate(-546 -38)"
                  />
                </svg>
              </button>
            </div>
            {authUser() ? (
              authUser().user.role === "user" ? (
                <Link
                  to="/dashboard"
                  className="Link__CustomLink-sc-1p80yfz-0 hDjhKH LoginButton__CustomLink-sc-9q8gbu-1 bOFsqz"
                >
                  <button className="Button__BaseButton-sc-1e82yhp-0 cxOGwh LoginButton__Component-sc-9q8gbu-0 hUelrf">
                    Dashboard
                  </button>
                </Link>
              ) : authUser().user.role === "admin" ? (
                <Link
                  to="/admin/dashboard"
                  className="Link__CustomLink-sc-1p80yfz-0 hDjhKH LoginButton__CustomLink-sc-9q8gbu-1 bOFsqz"
                >
                  <button className="Button__BaseButton-sc-1e82yhp-0 cxOGwh LoginButton__Component-sc-9q8gbu-0 hUelrf">
                    Dashboard
                  </button>
                </Link>
              ) : (
                ""
              )
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="Link__CustomLink-sc-1p80yfz-0 hDjhKH LoginButton__CustomLink-sc-9q8gbu-1 bOFsqz"
                >
                  <button className="Button__BaseButton-sc-1e82yhp-0 cxOGwh LoginButton__Component-sc-9q8gbu-0 hUelrf">
                    Log In
                  </button>
                </Link>
                <Link
                  to="/auth/signup"
                  className="Link__CustomLink-sc-1p80yfz-0 hDjhKH SignupButton__CustomLink-sc-4rqyau-1 crgNqM"
                >
                  <button className="Button__BaseButton-sc-1e82yhp-0 llgLia SignupButton__Component-sc-4rqyau-0 cDdOpj">
                    Sign Up
                  </button>
                </Link>
              </>
            )}

            <div
              onClick={toggleNav}
              className="TabletMenu__Container-ds1nxt-2 dOAKcZ"
            >
              <div className="TabletMenu__TableMenuTriggerWrapper-ds1nxt-0 WziMa">
                <button
                  color="#FFFFFF"
                  aria-expanded="false"
                  id="menu-trigger"
                  className="ButtonIcon__ButtonContainer-pnabhn-0 ccraQD TabletMenu__TableMenuTrigger-ds1nxt-1 cdyLoc"
                  aria-label="Tablet Menu"
                >
                  <svg
                    width={24}
                    height={24}
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M20 18h-6M20 6H10M20 12H4"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ButtonIcon__Hidden-pnabhn-1 ifFoww">
                    Open Menu
                  </span>
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={toggleNav}
            color="#FFFFFF"
            aria-expanded="false"
            id="menu-trigger"
            className="ButtonIcon__ButtonContainer-pnabhn-0 ccraQD Header__MobileMenuTrigger-ra9ecu-13 dBUZdq"
            aria-label="Mobile Menu"
          >
            <svg
              width={24}
              height={24}
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M20 18h-6M20 6H10M20 12H4"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ButtonIcon__Hidden-pnabhn-1 ifFoww">
              Open Menu
            </span>
          </button>
        </div>
      </div>
      <div className="Header__Snitch-ra9ecu-12 IKRsL" />
      {/* sidebar */}

      {isNav && (
        <div
          className="MobileMenu__Component-vbfhhc-0 izTKCE"
          style={{ transform: "translateX(0%) translateZ(0px)" }}
        >
          <header className="MobileMenu__Header-vbfhhc-1 cVAYkx">
            <svg width={224} height={24} viewBox="0 0 224 24" fill="none">
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
            </svg>
            <button
              onClick={toggleNav}
              aria-expanded="false"
              id="menu-trigger"
              className="MobileMenu__CloseButton-vbfhhc-2 bZAztx"
            >
              <svg
                width={32}
                height={32}
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M24 8 8 24M8 8l16 16"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="MobileMenu__Hidden-vbfhhc-3 ldtbAq">
                Close Menu
              </span>
            </button>
          </header>
          <div className="MobileMenu__Main-vbfhhc-4 civDGE">
            <div className="MobileSearchNav__Component-svo4or-3 frnRnh">
              <div className="MobileSearchNav__SearchPanel-svo4or-0 CoYaV">
                <div className="MobileSearchNav__Wrapper-svo4or-1 dHaTIC">
                  <div className="SearchBox__Container-wc8x5h-0 fGkhCw">
                    <button
                      aria-label="Close search"
                      className="SearchBox__SearchButton-wc8x5h-2 dKoxAc"
                    >
                      <svg height={19} viewBox="0 0 18 19" width={18}>
                        <path
                          d="m559.179993 45.9010802c0-3.4003115-2.373108-5.56108-5.564608-5.56108-3.191501 0-5.565397 2.1674824-5.565397 5.56108 0 3.3935975 2.090012 5.568921 5.565397 5.568921s5.564608-2.1686096 5.564608-5.568921zm4.820007 9c0 .7572115-.627404 1.3846154-1.384615 1.3846154-.367789 0-.72476-.1514424-.973558-.4110577l-3.710337-3.6995193c-1.265625.876202-2.780048 1.3413462-4.316105 1.3413462-4.207933 0-7.615385-3.4074519-7.615385-7.6153846s3.407452-7.6153846 7.615385-7.6153846c4.207932 0 7.615384 3.4074519 7.615384 7.6153846 0 1.5360577-.465144 3.0504807-1.341346 4.3161057l3.710337 3.7103366c.248798.2487981.40024.6057692.40024.9735577z"
                          fill="currentColor"
                          fillRule="evenodd"
                          transform="translate(-546 -38)"
                        />
                      </svg>
                    </button>
                    <span className="Text__Button2-sc-1fwf07x-12 goCthX" />
                    <input
                      autoComplete="off"
                      placeholder="Search blocks, transactions, hash..."
                      name="search"
                      type="search"
                      className="Text__Button2-sc-1fwf07x-12 SearchBox__SearchInput-wc8x5h-1 goCthX dyFQsa"
                    />
                  </div>
                </div>
              </div>
            </div>
            <section>
              <div className="MobileMenu__SectionHeader-vbfhhc-5 hSkKYk">
                <h4 className="Text__MobileNavTitle-sc-1fwf07x-17 MobileMenu__SectionTitle-vbfhhc-6 bPSjlj flGaJY">
                  Products
                </h4>
              </div>
              <nav>
                <ul>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 MobileMenu__NavDropdownListItem-vbfhhc-8 vvWMe kmtyGJ gaEixf iWYdFG">
                    <a
                      href="https://exchange.blockchain.com"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 MobileMenu__IconLink-vbfhhc-10 vvWMe kmtyGJ kfOoaO ihxgiF"
                      target="_self"
                    >
                      <div className="MobileMenu__IconWrapper-vbfhhc-11 hYbymD">
                        <svg width={32} height={32} fill="none">
                          <path
                            d="m12.5 13-.53-.848.53.848zM2 23H1v3l1.8-2.4L2 23zm11.227-10.455.531.847-.531-.847zm.997-.624.528.849.786-.489-.427-.821-.887.46zm3.47-1.984-.846.532.475.756.805-.387-.433-.9zM30 11.5l-.468.884L31 13.16v-1.66h-1zm-.327-7.862.891-.454-.891.454zm-1.311-1.311-.454.891.454-.891zm-24.724 0 .454.891-.454-.891zM2.327 3.638l.891.454-.891-.454zm9.643 8.514C7.827 14.742 3.241 19.68 1.2 22.4l1.6 1.2c1.959-2.612 6.373-7.34 10.23-9.752l-1.06-1.696zm.726-.454-.726.454 1.06 1.696.728-.456-1.062-1.694zm1-.626c-.323.201-.657.41-1 .626l1.062 1.694.995-.622-1.057-1.698zm1.415.388A.991.991 0 0 1 15 11h-2c0 .496.121.967.337 1.382l1.774-.922zM15 11a1 1 0 0 1 1-1V8a3 3 0 0 0-3 3h2zm1-1c.356 0 .67.185.848.47l1.693-1.065A2.998 2.998 0 0 0 16 8v2zm14.468.616c-3.012-1.594-5.342-2.478-7.424-2.707-2.127-.234-3.905.224-5.783 1.127l.867 1.802c1.64-.788 3.039-1.123 4.698-.94 1.704.187 3.767.93 6.706 2.486l.936-1.768zM29 6.8v4.7h2V6.8h-2zm-.218-2.708c.08.156.145.38.18.819C29 5.361 29 5.943 29 6.8h2c0-.824 0-1.501-.044-2.052-.046-.562-.145-1.079-.392-1.564l-1.782.908zm-.874-.874a2 2 0 0 1 .874.874l1.782-.908a4 4 0 0 0-1.748-1.748l-.908 1.782zM25.2 3c.857 0 1.439 0 1.889.038.438.035.663.1.819.18l.908-1.782c-.485-.247-1.002-.346-1.564-.392C26.702 1 26.024 1 25.2 1v2zM6.8 3h18.4V1H6.8v2zm-2.708.218c.156-.08.38-.145.819-.18C5.361 3 5.943 3 6.8 3V1c-.824 0-1.501 0-2.052.044-.562.046-1.079.145-1.564.392l.908 1.782zm-.874.874a2 2 0 0 1 .874-.874l-.908-1.782a4 4 0 0 0-1.748 1.748l1.782.908zM3 6.8c0-.857 0-1.439.038-1.889.035-.438.1-.663.18-.819l-1.782-.908c-.247.485-.346 1.002-.392 1.564C1 5.298 1 5.976 1 6.8h2zM3 23V6.8H1V23h2z"
                            fill="#0C6CF2"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2 23c2-2.667 6.5-7.5 10.5-10l.727-.456.997-.624a2 2 0 1 0 3.47-1.984C21.214 8.246 24.05 8.35 30 11.5v13.7c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327H6.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C2 27.719 2 26.879 2 25.199v-2.2z"
                            fill="#0C6CF2"
                            fillOpacity=".36"
                          />
                          <path
                            d="m12.5 13-.53-.849.53.848zM2 23l-.8-.6-.2.266v.333h1zm11.227-10.456.531.847-.531-.847zm.997-.624.887-.461-.498-.959-.917.571.528.849zm3.47-1.984-.433-.901-1.01.485.597.948.847-.532zM30 11.5h1v-.602l-.532-.282L30 11.5zm-.327 16.862-.891-.454.891.454zm-1.311 1.311-.454-.891.454.891zm-24.724 0-.454.891.454-.891zm-1.311-1.311.891-.454-.891.454zm9.643-16.21C7.827 14.741 3.241 19.678 1.2 22.4l1.6 1.2c1.959-2.612 6.373-7.34 10.23-9.752l-1.06-1.696zm.726-.454-.726.454 1.06 1.696c.25-.155.492-.308.728-.456l-1.062-1.694zm1-.626c-.323.201-.657.41-1 .626l1.062 1.694.995-.622-1.057-1.698zm2.304.928a1 1 0 0 1-.889-.54l-1.774.922A3 3 0 0 0 16 14v-2zm1-1a1 1 0 0 1-1 1v2a3 3 0 0 0 3-3h-2zm-.152-.53a.99.99 0 0 1 .152.53h2a2.99 2.99 0 0 0-.459-1.595l-1.693 1.064zm13.62.146c-3.012-1.594-5.342-2.478-7.424-2.707-2.126-.234-3.905.224-5.783 1.127l.867 1.803c1.64-.789 3.039-1.124 4.698-.942 1.704.188 3.767.931 6.706 2.487l.936-1.768zM31 25.2v-13.7h-2v13.7h2zm-.436 3.616c.247-.485.346-1.002.392-1.564.045-.55.044-1.228.044-2.052h-2c0 .857 0 1.439-.038 1.889-.035.438-.1.663-.18.819l1.782.908zm-1.748 1.748a4 4 0 0 0 1.748-1.748l-1.782-.908a2 2 0 0 1-.874.874l.908 1.782zm-3.616.436c.824 0 1.501 0 2.052-.044.562-.046 1.079-.145 1.564-.392l-.908-1.782c-.156.08-.38.145-.819.18-.45.037-1.032.038-1.889.038v2zm-18.4 0h18.4v-2H6.8v2zm-3.616-.436c.485.247 1.002.346 1.564.392.55.045 1.228.044 2.052.044v-2c-.857 0-1.439 0-1.889-.037-.438-.036-.663-.101-.819-.181l-.908 1.782zm-1.748-1.748a4 4 0 0 0 1.748 1.748l.908-1.782a2 2 0 0 1-.874-.874l-1.782.908zM1 25.199c0 .824 0 1.501.044 2.052.046.562.145 1.079.392 1.564l1.782-.908c-.08-.156-.145-.38-.18-.819C3 26.638 3 26.056 3 25.199H1zm0-2.2v2.2h2v-2.2H1z"
                            fill="#0C6CF2"
                          />
                          <path
                            d="M16 16v14m-7-8v8m7-28v4m7 8v16M6.8 30h18.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C30 27.72 30 26.88 30 25.2V6.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C27.72 2 26.88 2 25.2 2H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 4.28 2 5.12 2 6.8v18.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 30 5.12 30 6.8 30zM18 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
                            stroke="#0C6CF2"
                            strokeWidth={2}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="MobileMenu__IconLinkContents-vbfhhc-12 jtUbWt">
                        <p className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__IconLinkTitle-vbfhhc-13 vvWMe kmtyGJ eRRaAq">
                          Exchange
                        </p>
                        <p className="Text__Small-sc-1fwf07x-18 MobileMenu__IconLinkDescription-vbfhhc-14 diDqUe hhsbKz">
                          Profesional trading
                        </p>
                      </div>
                    </a>
                    <button className="ExchangeMenuDropdown__ArrowButton-bwca4-0 iDgAla">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <Link
                      onClick={toggleNav}
                      to="/wallet"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 MobileMenu__IconLink-vbfhhc-10 vvWMe kmtyGJ kfOoaO dnrNy"
                      target="_self"
                    >
                      <div className="MobileMenu__IconWrapper-vbfhhc-11 hUBKNX">
                        <svg width={32} height={32} fill="none">
                          <path
                            d="M22 23V12h8v8a3 3 0 0 1-3 3h-5z"
                            fill="#fff"
                            stroke="#7349F2"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2 5.775v15.097a3 3 0 0 0 2.009 2.831l14 4.9A3 3 0 0 0 22 25.772V11.829a3 3 0 0 0-2.051-2.846L4.632 3.877A2 2 0 0 0 2 5.775zM16 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                            fill="#fff"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2 5.775v15.097a3 3 0 0 0 2.009 2.831l14 4.9A3 3 0 0 0 22 25.772V11.829a3 3 0 0 0-2.051-2.846L4.632 3.877A2 2 0 0 0 2 5.775zM16 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                            fill="#5322E5"
                            fillOpacity=".36"
                          />
                          <path
                            d="M2.241 4.82a2.001 2.001 0 0 1 2.391-.943L19.95 8.983A3 3 0 0 1 22 11.829V12h8V6a3 3 0 0 0-3-3H5a3 3 0 0 0-2.759 1.82z"
                            fill="#fff"
                          />
                          <path
                            d="M2.241 4.82a2.001 2.001 0 0 1 2.391-.943L19.95 8.983A3 3 0 0 1 22 11.829V12h8V6a3 3 0 0 0-3-3H5a3 3 0 0 0-2.759 1.82z"
                            fill="#5322E5"
                            fillOpacity=".36"
                          />
                          <path
                            d="M22 11.829v13.943a3 3 0 0 1-3.991 2.831l-14-4.9A3 3 0 0 1 2 20.872V5.775a2 2 0 0 1 2.632-1.898M22 11.83a3 3 0 0 0-2.051-2.846L4.632 3.877M22 11.83V12h8V6a3 3 0 0 0-3-3H5a3 3 0 0 0-2.759 1.82 2.001 2.001 0 0 1 2.391-.943M18 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
                            stroke="#7349F2"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="MobileMenu__IconLinkContents-vbfhhc-12 jtUbWt">
                        <p className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__IconLinkTitle-vbfhhc-13 vvWMe kmtyGJ eRRaAq">
                          Wallet
                        </p>
                        <p className="Text__Small-sc-1fwf07x-18 MobileMenu__IconLinkDescription-vbfhhc-14 diDqUe hhsbKz">
                          Buy &amp; Sell Crypto
                        </p>
                      </div>
                    </Link>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/explorer"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 MobileMenu__IconLink-vbfhhc-10 vvWMe kmtyGJ kfOoaO bhAbZR"
                      target="_self"
                    >
                      <div className="MobileMenu__IconWrapper-vbfhhc-11 fFxXYh">
                        <svg width={32} height={32} fill="none">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M30.49 18.778 26.23 6.532a5.26 5.26 0 0 0-10.23 1.729A5.26 5.26 0 0 0 5.772 6.53L1.509 18.78a7.503 7.503 0 0 1 14.475 3.218L16 22l.016-.003a7.5 7.5 0 0 1 14.474-3.22z"
                            fill="#F5A250"
                            fillOpacity=".36"
                          />
                          <path
                            d="m26.229 6.532-.945.328.945-.328zm4.262 12.246-.932.363a1 1 0 0 0 1.876-.692l-.944.329zM15 8.26a1 1 0 1 0 2 0h-2zM5.77 6.53l.945.33-.944-.33zM1.51 18.78l-.945-.329a1 1 0 0 0 1.877.692l-.932-.363zm14.475 3.218-.998-.066a1 1 0 0 0 .799 1.046l.199-.98zM16 22l-.2.98a.998.998 0 0 0 .399 0l-.2-.98zm.016-.003.199.98a1 1 0 0 0 .799-1.046l-.998.066zM15 22a1 1 0 1 0 2 0h-2zm2-13.74a1 1 0 1 0-2 0h2zm8.284-1.4 4.262 12.246 1.889-.657-4.262-12.246-1.889.657zM21.261 4a4.26 4.26 0 0 1 4.023 2.86l1.89-.657A6.26 6.26 0 0 0 21.26 2v2zM17 8.26A4.26 4.26 0 0 1 21.26 4V2A6.26 6.26 0 0 0 15 8.26h2zM10.74 4A4.26 4.26 0 0 1 15 8.26h2A6.26 6.26 0 0 0 10.74 2v2zM6.714 6.86A4.26 4.26 0 0 1 10.74 4V2a6.26 6.26 0 0 0-5.913 4.203l1.89.657zM2.453 19.108 6.715 6.86l-1.889-.657L.564 18.45l1.89.658zM8.5 13a8.503 8.503 0 0 0-7.923 5.416l1.864.726A6.503 6.503 0 0 1 8.5 15v-2zm8.5 8.5A8.5 8.5 0 0 0 8.5 13v2a6.5 6.5 0 0 1 6.5 6.5h2zm-.018.562c.012-.186.018-.373.018-.562h-2c0 .145-.005.289-.014.431l1.996.131zm-.783-1.042-.016-.003-.398 1.96.016.003.398-1.96zm-.382-.003-.016.003.398 1.96.016-.003-.398-1.96zM15 21.5c0 .189.006.376.018.562l1.996-.13A6.626 6.626 0 0 1 17 21.5h-2zm8.5-8.5a8.5 8.5 0 0 0-8.5 8.5h2a6.5 6.5 0 0 1 6.5-6.5v-2zm7.922 5.415A8.503 8.503 0 0 0 23.5 13v2a6.503 6.503 0 0 1 6.059 4.14l1.863-.726zM17 22V8.26h-2V22h2z"
                            fill="#F5A250"
                          />
                          <path
                            d="M8.5 29a7.5 7.5 0 0 0 7.5-7.5 7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0A7.5 7.5 0 1 0 8.5 29z"
                            fill="#fff"
                          />
                          <path
                            d="M8.5 17a1 1 0 1 0 0 2v-2zm2.5 4.5a1 1 0 1 0 2 0h-2zM23.5 17a1 1 0 1 0 0 2v-2zm2.5 4.5a1 1 0 1 0 2 0h-2zm-11 0A6.5 6.5 0 0 1 8.5 28v2a8.5 8.5 0 0 0 8.5-8.5h-2zm8.5 6.5a6.5 6.5 0 0 1-6.5-6.5h-2a8.5 8.5 0 0 0 8.5 8.5v-2zm6.5-6.5a6.5 6.5 0 0 1-6.5 6.5v2a8.5 8.5 0 0 0 8.5-8.5h-2zM23.5 15a6.5 6.5 0 0 1 6.5 6.5h2a8.5 8.5 0 0 0-8.5-8.5v2zM17 21.5a6.5 6.5 0 0 1 6.5-6.5v-2a8.5 8.5 0 0 0-8.5 8.5h2zM8.5 15a6.5 6.5 0 0 1 6.5 6.5h2A8.5 8.5 0 0 0 8.5 13v2zM2 21.5A6.5 6.5 0 0 1 8.5 15v-2A8.5 8.5 0 0 0 0 21.5h2zM8.5 28A6.5 6.5 0 0 1 2 21.5H0A8.5 8.5 0 0 0 8.5 30v-2zm0-9a2.5 2.5 0 0 1 2.5 2.5h2A4.5 4.5 0 0 0 8.5 17v2zm15 0a2.5 2.5 0 0 1 2.5 2.5h2a4.5 4.5 0 0 0-4.5-4.5v2z"
                            fill="#F5A250"
                          />
                        </svg>
                      </div>
                      <div className="MobileMenu__IconLinkContents-vbfhhc-12 jtUbWt">
                        <p className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__IconLinkTitle-vbfhhc-13 vvWMe kmtyGJ eRRaAq">
                          Explorer
                        </p>
                        <p className="Text__Small-sc-1fwf07x-18 MobileMenu__IconLinkDescription-vbfhhc-14 diDqUe hhsbKz">
                          Live Data, Charts &amp; Transactions
                        </p>
                      </div>
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/pay"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 MobileMenu__IconLink-vbfhhc-10 vvWMe kmtyGJ kfOoaO jhYBWj"
                      target="_self"
                    >
                      <div className="MobileMenu__IconWrapper-vbfhhc-11 dVeqwX">
                        <svg
                          width={32}
                          height={32}
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y={10}
                            width={27}
                            height={19}
                            rx={3}
                            transform="rotate(-15 0.5 10)"
                            fill="#06D6A0"
                            fillOpacity="0.36"
                            stroke="#06D6A0"
                            strokeWidth={2}
                          />
                          <path
                            d="M17.94 22.9267C20.874 22.1405 22.4414 18.476 21.4408 14.7417C20.4402 11.0074 17.2506 8.61754 14.3165 9.40372C11.3824 10.1899 9.81505 13.8544 10.8156 17.5887C11.8162 21.323 15.0059 23.7129 17.94 22.9267Z"
                            fill="white"
                          />
                          <path
                            d="M21 29.6969C24.866 29.6969 28 26.5629 28 22.6969C28 18.831 24.866 15.6969 21 15.6969C17.134 15.6969 14 18.831 14 22.6969C14 26.5629 17.134 29.6969 21 29.6969Z"
                            fill="white"
                            stroke="#06D6A0"
                            strokeWidth={2}
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M21.596 18.6508V19.4143C21.4365 19.3937 21.2716 19.3834 21.1011 19.3834C20.8574 19.3834 20.6238 19.4063 20.4 19.452V18.6508H19.5029L19.5029 19.7876C19.0487 20.0462 18.6873 20.4201 18.4188 20.9093C18.1448 21.4084 18.0078 22.0169 18.0078 22.7347C18.0078 23.4504 18.1427 24.0578 18.4124 24.5569C18.6798 25.0518 19.0434 25.4297 19.5029 25.6907L19.5029 26.7992H20.4V26.0195C20.6232 26.0638 20.8568 26.086 21.1011 26.086C21.2736 26.086 21.4386 26.0759 21.596 26.0558V26.7992H22.493V25.7959C22.7556 25.6721 22.9839 25.5182 23.1781 25.3342C23.4202 25.1027 23.6103 24.8468 23.7483 24.5664C23.8885 24.2861 23.9724 24.0015 24 23.7127L22.4072 23.7031C22.3796 23.8603 22.3297 24.0015 22.2575 24.1268C22.1874 24.25 22.0971 24.3551 21.9867 24.4422C21.8784 24.5272 21.752 24.5919 21.6076 24.6365C21.4653 24.6811 21.3071 24.7034 21.1329 24.7034C20.8229 24.7034 20.5542 24.6302 20.327 24.4836C20.1018 24.335 19.9266 24.1151 19.8013 23.8242C19.6781 23.5311 19.6166 23.1679 19.6166 22.7347C19.6166 22.3184 19.6771 21.9638 19.7981 21.6707C19.9213 21.3776 20.0965 21.1536 20.3238 20.9985C20.5531 20.8435 20.826 20.766 21.1425 20.766C21.3209 20.766 21.4833 20.7915 21.6299 20.8424C21.7785 20.8913 21.907 20.9624 22.0153 21.0559C22.1237 21.1493 22.2107 21.2619 22.2766 21.3935C22.3424 21.5252 22.3859 21.6728 22.4072 21.8363H24C23.9618 21.4456 23.863 21.0983 23.7037 20.7946C23.5445 20.4909 23.3374 20.235 23.0825 20.0269C22.9055 19.8809 22.709 19.7594 22.493 19.6625V18.6508H21.596Z"
                            fill="#06D6A0"
                          />
                        </svg>
                      </div>
                      <div className="MobileMenu__IconLinkContents-vbfhhc-12 jtUbWt">
                        <p className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__IconLinkTitle-vbfhhc-13 vvWMe kmtyGJ eRRaAq">
                          Pay
                        </p>
                        <p className="Text__Small-sc-1fwf07x-18 MobileMenu__IconLinkDescription-vbfhhc-14 diDqUe hhsbKz">
                          On-ramp for your users in your app
                        </p>
                      </div>
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/institutional"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 MobileMenu__IconLink-vbfhhc-10 vvWMe kmtyGJ kfOoaO bAfnVF"
                      target="_self"
                    >
                      <div className="MobileMenu__IconWrapper-vbfhhc-11 deHTay">
                        <svg width={32} height={32} fill="none">
                          <path
                            d="M9.35 17.305V26M15.871 17.305V26M22.393 17.305V26"
                            stroke="#121D33"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M25.101 17.303a9.783 9.783 0 0 0-18.452 0H25.1z"
                            fill="#121D33"
                            fillOpacity=".36"
                            stroke="#121D33"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.871 10.783V1"
                            stroke="#121D33"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.871 5.348c2.174 0 3.261 2.174 6.522 2.174V3.174C19.132 3.174 18.045 1 15.87 1"
                            fill="#121D33"
                            fillOpacity=".36"
                          />
                          <path
                            d="M15.871 5.348c2.174 0 3.261 2.174 6.522 2.174V3.174C19.132 3.174 18.045 1 15.87 1"
                            stroke="#121D33"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            fill="#121D33"
                            fillOpacity=".36"
                            stroke="#121D33"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.871 26h22v5h-22z"
                          />
                        </svg>
                      </div>
                      <div className="MobileMenu__IconLinkContents-vbfhhc-12 jtUbWt">
                        <p className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__IconLinkTitle-vbfhhc-13 vvWMe kmtyGJ eRRaAq">
                          Institutional
                        </p>
                        <p className="Text__Small-sc-1fwf07x-18 MobileMenu__IconLinkDescription-vbfhhc-14 diDqUe hhsbKz">
                          Full-stack crypto services platform
                        </p>
                      </div>
                    </a>
                  </li>
                </ul>
              </nav>
            </section>
            <section>
              <div className="MobileMenu__SectionHeader-vbfhhc-5 hSkKYk">
                <h4 className="Text__MobileNavTitle-sc-1fwf07x-17 MobileMenu__SectionTitle-vbfhhc-6 bPSjlj flGaJY">
                  Resources
                </h4>
              </div>
              <nav>
                <ul>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/api"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      APIs
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain-status.com/"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_blank"
                    >
                      Status
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://github.com/blockchain/"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_blank"
                    >
                      Open Source
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/research"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      Research
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/legal/privacy"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      Legal &amp; Privacy
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://support.blockchain.com"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_blank"
                    >
                      Support
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/blog"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      Blog
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/security"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      Security
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/podcast"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      Podcast
                    </a>
                  </li>
                </ul>
              </nav>
            </section>
            <section>
              <div className="MobileMenu__SectionHeader-vbfhhc-5 hSkKYk">
                <h4 className="Text__MobileNavTitle-sc-1fwf07x-17 MobileMenu__SectionTitle-vbfhhc-6 bPSjlj flGaJY">
                  Company
                </h4>
              </div>
              <nav>
                <ul>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/about"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      About
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/careers"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      Careers
                      <span className="Text__Caption-sc-1fwf07x-13 MobileMenu__Badge-vbfhhc-15 gzboDI kLixvC">
                        Hiring
                      </span>
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/press"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      Press Center
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/prime"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      Prime
                    </a>
                  </li>
                  <li className="Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__ListItem-vbfhhc-7 vvWMe kmtyGJ gaEixf">
                    <a
                      href="https://www.blockchain.com/ventures"
                      className="Link__CustomLink-sc-1p80yfz-0 hDjhKH Text__Body1-sc-1fwf07x-7 Text__Body1Highlight-sc-1fwf07x-8 MobileMenu__Link-vbfhhc-9 vvWMe kmtyGJ kfOoaO"
                      target="_self"
                    >
                      Ventures
                    </a>
                  </li>
                </ul>
              </nav>
            </section>
          </div>
          <footer className="MobileMenu__Footer-vbfhhc-16 dLGWtx">
            {authUser() ? (
              authUser().user.role === "user" ? (
                <Link
                  to="/dashboard"
                  className="Link__CustomLink-sc-1p80yfz-0 hDjhKH SignupButton__CustomLink-sc-4rqyau-1 crgNqM"
                >
                  <button className="Button__BaseButton-sc-1e82yhp-0 eOOfRK SignupButton__Component-sc-4rqyau-0 cDxlUM">
                    Dashboard
                  </button>
                </Link>
              ) : authUser().user.role === "admin" ? (
                <Link
                  to="/admin/dashboard"
                  className="Link__CustomLink-sc-1p80yfz-0 hDjhKH SignupButton__CustomLink-sc-4rqyau-1 crgNqM"
                >
                  <button className="Button__BaseButton-sc-1e82yhp-0 eOOfRK SignupButton__Component-sc-4rqyau-0 cDxlUM">
                    Dashboard
                  </button>
                </Link>
              ) : (
                ""
              )
            ) : (
              <div className="MobileMenu__ButtonsRow-vbfhhc-17 eCTxqO">
                <Link
                  to="/auth/login"
                  onClick={toggleNav}
                  className="Link__CustomLink-sc-1p80yfz-0 hDjhKH LoginButton__CustomLink-sc-9q8gbu-1 bOFsqz"
                >
                  <button className="Button__BaseButton-sc-1e82yhp-0 bHMlWK LoginButton__Component-sc-9q8gbu-0 hiHwFx">
                    Log In
                  </button>
                </Link>
                <Link
                  to="/auth/signup"
                  className="Link__CustomLink-sc-1p80yfz-0 hDjhKH SignupButton__CustomLink-sc-4rqyau-1 crgNqM"
                >
                  <button
                    onClick={toggleNav}
                    className="Button__BaseButton-sc-1e82yhp-0 eOOfRK SignupButton__Component-sc-4rqyau-0 cDxlUM"
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </footer>
        </div>
      )}

      {/* sidebar */}
    </div>
  );
};

export default Header;
