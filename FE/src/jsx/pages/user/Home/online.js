import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './iko.css'
import './post.css'
// import './bootstrap.css'
import './iko-core.css'
import './iko-unit.css'
import './custom-frontend.css'
import './custom.css'
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.css";
import "./style.css";
import LogoNew from '../../../../assets/images/logo.png'
import Ethan from '../../../../assets/images/ethan.jpg'
import Leo from '../../../../assets/images/leo.jpg'
import Lily from '../../../../assets/images/lily.jpg'
import Sophie from '../../../../assets/images/sophie.jpg'
const testimonials = [
  {
    name: "Ethan Bennett",
    designation: "",
    image: Ethan,
    text: "I just used Block Guard for the first time, and I’m blown away! Everything was so easy. Thanks a lot!"
  },
  {
    name: "Leo Harrison",
    designation: "",
    image: Leo,
    text: "Block Guard is fantastic! They have the lowest fees, fast transactions, and amazing support in many countries. Truly unmatched!"
  },
  {
    name: "Lily Carter",
    designation: "",
    image: Lily,
    text: "Block Guard is great! I bought crypto yesterday, and the whole process was smooth—no delays at all. I’ll be back for sure!"
  },
  {
    name: "Sophie Ling",
    designation: "",
    image: Sophie,
    text: "The process is super simple, and the customer service is so friendly. Buying and transferring Bitcoin is quick and easy. I love Block Guard!"
  }
];


const Home = () => {
  const sliderRef = useRef(null);
  const [openAccordion, setOpenAccordion] = useState(null);




  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };
  const settings = {

    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    nextArrow: <button className="slider-arrow next-btn"><i className="fas fa-arrow-right"></i></button>,
    prevArrow: <button className="slider-arrow prev-btn"><i className="fas fa-arrow-left"></i></button>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const [Bar, setBar] = useState(false);
  const [Nav, setNav] = useState(false);
  let toggleMenu = () => {
    let body = document.querySelector("body")
    body.classList.add('mobile-menu-visible')
    setNav(true);
    setBar(true);
  };
  let closeMenu = () => {
    let body = document.querySelector("body")
    body.classList.remove('mobile-menu-visible')
    setNav(false);
    setBar(false);
  };
  window.addEventListener("scroll", function () {
    let header = this.document.querySelector("#sticky-header");

    header.classList.toggle("sticky-menu", window.scrollY > 150);
  });

  return (
    <div className="homepg">
      <div data-elementor-type="wp-post" data-elementor-id={121} className="elementor elementor-121">
        <div className="elementor-element elementor-element-aa37635 e-con-full e-flex e-con e-parent" data-id="aa37635" data-element_type="container" data-core-v316-plus="true">
          <div className="elementor-element elementor-element-8e54fb7 elementor-widget elementor-widget-tg-header" data-id="8e54fb7" data-element_type="widget" data-widget_type="tg-header.default">
            <div className="elementor-widget-container">
              <header id="header" className="header-layout1">
                <div id="sticky-header" className="menu-area transparent-header ">
                  <div className="container custom-container">
                    <div className="row">
                      <div className="col-12">
                        <div className="menu-wrap">
                          <nav className="menu-nav">
                            <div className="logo">
                              <Link to="/">
                                <img src={LogoNew} alt="IKO" />
                              </Link>
                            </div>
                            <div className="navbar-wrap main-menu m-auto d-none d-lg-flex">
                              <ul id="menu-1-8e54fb7" className="navigation"><li id="menu-item-1270" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item page_item page-item-144 current_page_item menu-item-1270"><a href="#" aria-current="page">Home</a></li>
                                <li id="menu-item-1274" className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-1274"><a href="#why-blockchain" aria-current="page">Why Blockchain</a></li>
                                <li id="menu-item-1275" className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-1275"><a href="#features" aria-current="page">Features</a></li>
                                <li id="menu-item-1275" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-1275">
                                  <Link className="btn2 ansa" to="/auth/login">Download windows app</Link></li>


                              </ul>                                      </div>
                            <div className="header-action">
                              <ul className="list-wrap">
                                <li className="header-login">
                                  <Link className="btn2" to="/auth/login">LOGIN</Link>
                                </li>
                              </ul>
                            </div>
                            <div onClick={toggleMenu} className="mobile-nav-toggler"><i className="fas fa-bars" /></div>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              <div className="mobile-menu">
                <nav className="menu-box">
                  <div onClick={closeMenu} className="close-btn"><i className="fas fa-times" /></div>
                  <div className="nav-logo mobile-logo">
                    <a href="#">
                      <img src={LogoNew} alt="IKO" />
                    </a>
                  </div>
                  <div className="menu-outer">
                    {/*Here Menu Will Come Automatically Via Javascript / Same Menu as in Header*/}
                    <ul id="menu-1-8e54fb7" className="navigation"><li id="menu-item-1270" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item page_item page-item-144 current_page_item menu-item-1270"><a href="#" aria-current="page">Home</a></li>
                      <li id="menu-item-1274" className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-1274"><a href="#why-blockchain" aria-current="page">Why Blockchain</a></li>
                      <li id="menu-item-1275" className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-1275"><a href="#features" aria-current="page">Features</a></li>

                      <li id="menu-item-1272" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1272"><Link to="auth/login">Sign in</Link></li>
                    </ul>                                      </div>
                  <div className="social-links">
                    <ul className="clearfix list-wrap">
                      <li>
                        <a href="#" target="_blank">
                          <i aria-hidden="true" className="fab fa-facebook-f" />                          </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none"><path d="M9.52219 6.77491L15.4786 0H14.0671L8.89518 5.88256L4.76438 0H0L6.24657 8.89547L0 16H1.41155L6.87322 9.78779L11.2356 16H16L9.52219 6.77491ZM7.58888 8.97384L6.95597 8.08805L1.92015 1.03974H4.08821L8.15218 6.72796L8.78508 7.61374L14.0677 15.0076H11.8997L7.58888 8.97384Z" fill="currentColor" /></svg>                          </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <i aria-hidden="true" className="fab fa-instagram" />                          </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <i aria-hidden="true" className="fab fa-telegram-plane" />                          </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <i aria-hidden="true" className="fab fa-youtube" />                          </a>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
              <div onClick={closeMenu} className="menu-backdrop" />
            </div>
          </div>
        </div>
      </div>


      <main className="main-area">
        <div data-elementor-type="wp-page" data-elementor-id={144} className="elementor elementor-144">
          <div className="elementor-element elementor-element-035b06e e-con-full e-flex e-con e-parent" data-id="035b06e" data-element_type="container" data-core-v316-plus="true">
            <div className="elementor-element elementor-element-0eb8845 elementor-widget elementor-widget-tg-gradient" data-id="0eb8845" data-element_type="widget" data-widget_type="tg-gradient.default">
              <div className="elementor-widget-container">
                <div className="tg-bg-gradient d-block purple-bg-gradient" />
              </div>
            </div>
            <div className="elementor-element elementor-element-f7ee2de position-static elementor-widget elementor-widget-tg-gradient" data-id="f7ee2de" data-element_type="widget" data-widget_type="tg-gradient.default">
              <div className="elementor-widget-container">
                <div className="tg-bg-gradient d-block hero-gradient-ball alltuchtopdown" />
              </div>
            </div>
            <div className="elementor-element elementor-element-e38eacf position-static elementor-widget elementor-widget-tg-gradient" data-id="e38eacf" data-element_type="widget" data-widget_type="tg-gradient.default">
              <div className="elementor-widget-container">
                <div className="tg-bg-gradient d-block green-bg-gradient" />
              </div>
            </div>
            <div className="elementor-element elementor-element-9af2a27 elementor-widget elementor-widget-html" data-id="9af2a27" data-element_type="widget" data-widget_type="html.default">
              <div className="elementor-widget-container">
                <div className="ripple-shape2">
                  <span className="ripple-11" />
                  <span className="ripple-12" />
                  <span className="ripple-13" />
                  <span className="ripple-14" />
                  <span className="ripple-15" />
                </div>		</div>
            </div>
            <div className="elementor-element elementor-element-4a35d6b e-flex e-con-boxed e-con e-child" data-id="4a35d6b" data-element_type="container">
              <div className="e-con-inner" style={{ paddingBottom: "50px" }}>
                <div className="elementor-element elementor-element-fbbe53e elementor-widget elementor-widget-tg-heading" data-id="fbbe53e" data-element_type="widget" data-widget_type="tg-heading.default">
                  <div className="elementor-widget-container">
                    <h2 className="title gradient-title">Trusted Worldwide</h2>
                  </div>
                </div>
                <div className="elementor-element elementor-element-dc7cfdb bitcoin-icon-position elementor-widget elementor-widget-heading" data-id="dc7cfdb" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container">
                    <style dangerouslySetInnerHTML={{ __html: "/*! elementor - v3.20.0 - 26-03-2024 */\n.elementor-heading-title{padding:0;margin:0;line-height:1}.elementor-widget-heading .elementor-heading-title[class*=elementor-size-]>a{color:inherit;font-size:inherit;line-height:inherit}.elementor-widget-heading .elementor-heading-title.elementor-size-small{font-size:15px}.elementor-widget-heading .elementor-heading-title.elementor-size-medium{font-size:19px}.elementor-widget-heading .elementor-heading-title.elementor-size-large{font-size:29px}.elementor-widget-heading .elementor-heading-title.elementor-size-xl{font-size:39px}.elementor-widget-heading .elementor-heading-title.elementor-size-xxl{font-size:59px}" }} /><h2 className="elementor-heading-title elementor-size-default">
                      Block Guard
                    </h2>		</div>
                </div>
                <div className="elementor-element elementor-element-e05638a e-con-full e-flex e-con e-child" data-id="e05638a" data-element_type="container">
                  <div className="elementor-element elementor-element-d572db2 e-con-full e-flex e-con e-child" data-id="d572db2" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;gradient&quot;}">
                    <div className="elementor-element elementor-element-8ab7883 elementor-widget elementor-widget-heading" data-id="8ab7883" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default">Empowering your crypto journey</h2>		</div>
                    </div>
                  </div>
                  <div className="elementor-element elementor-element-1a1d570 e-con-full e-flex e-con e-child" data-id="1a1d570" data-element_type="container">
                    <div className="elementor-element elementor-element-54af084 elementor-widget elementor-widget-heading" data-id="54af084" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <p className="elementor-heading-title elementor-size-default">Block Guard is your go-to resource for secure wallets, seamless exchanges, and real-time crypto insights. From coin tracking and analysis to the latest news, we've got you covered.</p>		</div>
                    </div>
                    <div className="elementor-element elementor-element-fa06e25 elementor-widget elementor-widget-tg-btn" data-id="fa06e25" data-element_type="widget" data-widget_type="tg-btn.default">
                      <div className="elementor-widget-container">
                        <Link to="/auth/signup" target="_self" rel="nofollow" className="btn btn2 show-arrow">
                          Get Started Today          </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="elementor-element elementor-element-209c9fd e-flex e-con-boxed e-con e-parent" data-id="209c9fd" data-element_type="container" id="why-blockchain" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" data-core-v316-plus="true">
            <div className="e-con-inner">
              <div className="elementor-element elementor-element-e47cb87 elementor-absolute elementor-widget elementor-widget-genix-image" data-id="e47cb87" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="genix-image.default">
                <div className="elementor-widget-container">
                  <div className="feature-area-shape">
                    <img decoding="async" className="feature-shape2-1 alltuchtopdown" src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-shape-11.png" alt />
                    <img decoding="async" className="feature-shape2-2 alltuchtopdown" src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-shape-12.png" alt />
                    <img decoding="async" className="feature-shape2-3 leftToRight" src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-shape-13.png" alt />
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-fe23971 elementor-absolute elementor-widget elementor-widget-image" data-id="fe23971" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                <div className="elementor-widget-container">
                  <style dangerouslySetInnerHTML={{ __html: "/*! elementor - v3.20.0 - 26-03-2024 */\n.elementor-widget-image{text-align:center}.elementor-widget-image a{display:inline-block}.elementor-widget-image a img[src$=\".svg\"]{width:48px}.elementor-widget-image img{vertical-align:middle;display:inline-block}" }} />										<img fetchpriority="high" decoding="async" width={363} height={435} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/cirlce-radius.png" className="attachment-full size-full wp-image-974" alt srcSet="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/cirlce-radius.png 363w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/cirlce-radius-250x300.png 250w" sizes="(max-width: 363px) 100vw, 363px" />													</div>
              </div>
              <div className="elementor-element elementor-element-b82ac03 e-flex e-con-boxed e-con e-child" data-id="b82ac03" data-element_type="container">
                <div className="e-con-inner" style={{ maxWidth: "800px" }}>
                  <div className="elementor-element elementor-element-04db060 elementor-widget elementor-widget-tg-heading" data-id="04db060" data-element_type="widget" data-widget_type="tg-heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="title gradient-title">About  Block Guard</h2>
                    </div>
                  </div>
                  <div className="elementor-element elementor-element-c4a8331 elementor-widget elementor-widget-heading" data-id="c4a8331" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">Supported by Top Blockchain Investors and Founders</h2>		</div>
                  </div>
                  <div className="elementor-element elementor-element-d9b0b6c elementor-widget elementor-widget-heading" data-id="d9b0b6c" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <p className="elementor-heading-title elementor-size-default">Block Guard is a trusted platform designed to simplify your cryptocurrency experience. With secure wallets, fast exchanges, and real-time market data, we empower users to navigate the crypto space with confidence. Backed by leading blockchain investors and innovators, we are committed to providing cutting-edge tools and insights for all your crypto needs.</p>		</div>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-a328fa0 e-grid e-con-full e-con e-child" data-id="a328fa0" data-element_type="container">
                <div className="elementor-element elementor-element-5f4d013 e-con-full e-flex e-con e-child" data-id="5f4d013" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                  <div className="elementor-element elementor-element-6cf0f13 e-con-full e-flex e-con e-child" data-id="6cf0f13" data-element_type="container">
                    <div className="elementor-element elementor-element-db631c7 elementor-widget elementor-widget-heading" data-id="db631c7" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default">Flexibility</h2>		</div>
                    </div>
                    <div className="elementor-element elementor-element-aa8a993 elementor-widget elementor-widget-heading" data-id="aa8a993" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <p className="elementor-heading-title elementor-size-default">With Block Guard, you can effortlessly manage a diverse portfolio of cryptocurrencies. Our platform supports a wide range of digital assets, giving you the flexibility to trade, store, and monitor multiple coins in one place. Whether you're a seasoned investor or just starting out, Block Guard is designed to adapt to your needs, helping you stay agile in the ever-changing crypto market.</p>		</div>
                    </div>

                  </div>
                  <div className="elementor-element elementor-element-14d1b6d alltuchtopdown e-transform elementor-widget elementor-widget-image" data-id="14d1b6d" data-element_type="widget" data-settings="{&quot;_transform_translateX_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:-90,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}" data-widget_type="image.default">
                    <div className="elementor-widget-container">
                      <img decoding="async" width={536} height={286} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-card-thumb-1.png" className="attachment-full size-full wp-image-944" alt srcSet="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-card-thumb-1.png 536w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-card-thumb-1-300x160.png 300w" sizes="(max-width: 536px) 100vw, 536px" />													</div>
                  </div>
                </div>
                <div className="elementor-element elementor-element-75b3ac5 e-con-full e-flex e-con e-child" data-id="75b3ac5" data-element_type="container">
                  <div className="elementor-element elementor-element-046f9bd e-con-full e-flex e-con e-child" data-id="046f9bd" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                    <div className="elementor-element elementor-element-2e99aa3 e-con-full e-flex e-con e-child" data-id="2e99aa3" data-element_type="container">
                      <div className="elementor-element elementor-element-81e0203 elementor-widget elementor-widget-heading" data-id="81e0203" data-element_type="widget" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default">Transference</h2>		</div>
                      </div>
                      <div className="elementor-element elementor-element-b0ad7c3 elementor-widget elementor-widget-heading" data-id="b0ad7c3" data-element_type="widget" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                          <p className="elementor-heading-title elementor-size-default">Block Guard offers seamless, lightning-fast transfers, allowing you to send and receive cryptocurrency across borders with ease. Our platform is optimized to minimize transaction fees, making global transfers not only quick but cost-effective. Whether you’re moving assets between wallets or making international payments, you can rely on smooth, hassle-free transactions.</p>		</div>
                      </div>

                    </div>
                    <div className="elementor-element elementor-element-d0c5623 elementor-widget elementor-widget-image" data-id="d0c5623" data-element_type="widget" data-widget_type="image.default">
                      <div className="elementor-widget-container">
                        <img decoding="async" width={254} height={245} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-card-thumb-2.png" className="attachment-full size-full wp-image-952" alt />													</div>
                    </div>
                  </div>
                  <div className="elementor-element elementor-element-1576866 e-con-full e-flex e-con e-child" data-id={1576866} data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                    <div className="elementor-element elementor-element-d977c5c e-con-full e-flex e-con e-child" data-id="d977c5c" data-element_type="container">
                      <div className="elementor-element elementor-element-0b41698 elementor-widget elementor-widget-heading" data-id="0b41698" data-element_type="widget" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default">Secure &amp; Safe</h2>		</div>
                      </div>
                      <div className="elementor-element elementor-element-b75024c elementor-widget elementor-widget-heading" data-id="b75024c" data-element_type="widget" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                          <p className="elementor-heading-title elementor-size-default">Security is our top priority. Block Guard employs advanced encryption technologies, multi-factor authentication, and cold storage options to ensure your assets are fully protected. With state-of-the-art security protocols in place, you can trade and store your digital currencies with peace of mind, knowing your funds are safeguarded against potential threats.</p>		</div>
                      </div>

                    </div>
                    <div className="elementor-element elementor-element-6f6aeef elementor-widget elementor-widget-image" data-id="6f6aeef" data-element_type="widget" data-widget_type="image.default">
                      <div className="elementor-widget-container">
                        <img loading="lazy" decoding="async" width={300} height={298} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-card-thumb-3.png" className="attachment-full size-full wp-image-953" alt srcSet="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-card-thumb-3.png 300w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-card-thumb-3-150x150.png 150w" sizes="(max-width: 300px) 100vw, 300px" />													</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-element elementor-element-35a2f6f e-flex e-con-boxed e-con e-parent" data-id="35a2f6f" data-element_type="container" id="features" data-settings="{&quot;background_background&quot;:&quot;gradient&quot;}" data-core-v316-plus="true">
            <div className="e-con-inner">
              <div className="elementor-element elementor-element-5f80d9a elementor-absolute alltuchtopdown elementor-widget elementor-widget-image" data-id="5f80d9a" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                <div className="elementor-widget-container">
                  <img loading="lazy" decoding="async" width={81} height={247} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/left-vector.png" className="attachment-full size-full wp-image-1009" alt />													</div>
              </div>
              <div className="elementor-element elementor-element-658be2a elementor-absolute alltuchtopdown elementor-widget elementor-widget-image" data-id="658be2a" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                <div className="elementor-widget-container">
                  <img loading="lazy" decoding="async" width={67} height={202} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/right-vector.png" className="attachment-full size-full wp-image-1010" alt />													</div>
              </div>
              <div className="elementor-element elementor-element-0198f33 e-con-full e-flex e-con e-child" data-id="0198f33" data-element_type="container">
                <div className="elementor-element elementor-element-92f0251 elementor-widget elementor-widget-image" data-id="92f0251" data-element_type="widget" data-widget_type="image.default">
                  <div className="elementor-widget-container">
                    <img loading="lazy" decoding="async" width={276} height={344} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/intro_1-1.png" className="attachment-full size-full wp-image-982" alt srcSet="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/intro_1-1.png 276w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/intro_1-1-241x300.png 241w" sizes="(max-width: 276px) 100vw, 276px" />													</div>
                </div>
                <div className="elementor-element elementor-element-1d82943 elementor-absolute alltuchtopdown elementor-widget elementor-widget-image" data-id="1d82943" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                  <div className="elementor-widget-container">
                    <img loading="lazy" decoding="async" width={445} height={362} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-glaxy.png" className="attachment-full size-full wp-image-983" alt srcSet="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-glaxy.png 445w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/feature-glaxy-300x244.png 300w" sizes="(max-width: 445px) 100vw, 445px" />													</div>
                </div>
                <div className="elementor-element elementor-element-861aebe elementor-absolute elementor-widget elementor-widget-image" data-id="861aebe" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                  <div className="elementor-widget-container">
                    <img loading="lazy" decoding="async" width={153} height={153} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/vector.png" className="attachment-full size-full wp-image-984" alt srcSet="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/vector.png 153w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/vector-150x150.png 150w" sizes="(max-width: 153px) 100vw, 153px" />													</div>
                </div>
              </div>
              <div className="elementor-element elementor-element-1893fc5 e-con-full e-flex e-con e-child" data-id="1893fc5" data-element_type="container">
                <div className="elementor-element elementor-element-13d0d8d elementor-widget elementor-widget-heading" data-id="13d0d8d" data-element_type="widget" data-widget_type="heading.default">

                </div>
                <div className="elementor-element elementor-element-27f4ded elementor-widget elementor-widget-heading" data-id="27f4ded" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container">
                    <h2 className="elementor-heading-title elementor-size-default">Your Security, Our Commitment</h2>		</div>
                </div>
                <div className="elementor-element elementor-element-f7a8db6 elementor-widget__width-initial elementor-widget elementor-widget-heading" data-id="f7a8db6" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container">
                    <p className="elementor-heading-title elementor-size-default">At Block Guard, security is paramount. We utilize advanced encryption, multi-factor authentication, and cold storage to protect your assets. With robust security protocols, you can trade and store your cryptocurrencies confidently, knowing your funds are secure.</p>		</div>
                </div>

              </div>
            </div>
          </div>
          <div className="elementor-element elementor-element-b249357 e-flex e-con-boxed e-con e-parent" data-id="b249357" data-element_type="container" data-core-v316-plus="true">
            <div className="e-con-inner">
              <div className="elementor-element elementor-element-9916532 position-static elementor-widget elementor-widget-html" data-id={9916532} data-element_type="widget" data-widget_type="html.default">
                <div className="elementor-widget-container">
                  <div className="feature-shape-4-1 spin" />
                  <div className="feature-shape-4-2 alltuchtopdown" />
                  <div className="feature-shape-4-3 alltuchtopdown" />
                  <div className="feature-shape-4-4" />		</div>
              </div>
              <div className="elementor-element elementor-element-1e8544f e-con-full e-flex e-con e-child" data-id="1e8544f" data-element_type="container">
                <div className="elementor-element elementor-element-652ecd2 e-con-full e-flex e-con e-child" data-id="652ecd2" data-element_type="container">
                  <div className="elementor-element elementor-element-57fac6f elementor-widget elementor-widget-tg-heading" data-id="57fac6f" data-element_type="widget" data-widget_type="tg-heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="title gradient-title">Expand Your Crypto Journey</h2>
                    </div>
                  </div>
                  <div className="elementor-element elementor-element-4c43919 elementor-widget elementor-widget-heading" data-id="4c43919" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">Unlock the full potential of your cryptocurrency journey with Block Guard</h2>		</div>
                  </div>
                  <div className="elementor-element elementor-element-da716e1 elementor-widget elementor-widget-heading" data-id="da716e1" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <p className="elementor-heading-title elementor-size-default">We have collaborated with numerous companies to develop customized blockchain solutions, and we continue to grow.</p>		</div>
                  </div>
                </div>
                <div className="elementor-element elementor-element-583b942 e-con-full e-flex e-con e-child" data-id="583b942" data-element_type="container">
                  <div className="elementor-element elementor-element-5a58f54 e-grid e-con-full e-con e-child" data-id="5a58f54" data-element_type="container">
                    <div className="elementor-element elementor-element-c61a9cd elementor-widget elementor-widget-heading" data-id="c61a9cd" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default"><a >Buying Crypto</a></h2>		</div>
                    </div>
                    <div className="elementor-element elementor-element-75283a0 elementor-widget elementor-widget-heading" data-id="75283a0" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default"><a >Staking Crypto</a></h2>		</div>
                    </div>
                    <div className="elementor-element elementor-element-fbed052 elementor-widget elementor-widget-heading" data-id="fbed052" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default"><a >Crypto custodian</a></h2>		</div>
                    </div>
                    <div className="elementor-element elementor-element-d53333e elementor-widget elementor-widget-heading" data-id="d53333e" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default"><a >Smart contracts</a></h2>		</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-51acc00 e-con-full e-flex e-con e-child" data-id="51acc00" data-element_type="container">
                <div className="elementor-element elementor-element-16efc18 e-con-full e-flex e-con e-child" data-id="16efc18" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;gradient&quot;}">
                  <div className="elementor-element elementor-element-ce43b1d e-con-full e-flex e-con e-child" data-id="ce43b1d" data-element_type="container">
                    <div className="elementor-element elementor-element-298ad1e alltuchtopdown elementor-widget elementor-widget-image" data-id="298ad1e" data-element_type="widget" data-widget_type="image.default">
                      <div className="elementor-widget-container">
                        <img loading="lazy" decoding="async" width={461} height={462} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/bitcoin-img.png" className="attachment-full size-full wp-image-1025" alt srcSet="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/bitcoin-img.png 461w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/bitcoin-img-300x300.png 300w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/bitcoin-img-150x150.png 150w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/bitcoin-img-350x350.png 350w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/bitcoin-img-460x460.png 460w" sizes="(max-width: 461px) 100vw, 461px" />													</div>
                    </div>
                  </div>
                  <div className="elementor-element elementor-element-2441eb9 e-con-full e-flex e-con e-child" data-id="2441eb9" data-element_type="container">
                    <div className="elementor-element elementor-element-6efdca0 elementor-widget elementor-widget-heading" data-id="6efdca0" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default">impowering Businesses</h2>		</div>
                    </div>
                    <div className="elementor-element elementor-element-6cdb28e elementor-widget elementor-widget-heading" data-id="6cdb28e" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default">Building Trust Through Blockchain</h2>		</div>
                    </div>
                    <div className="elementor-element elementor-element-cc11a85 elementor-widget elementor-widget-heading" data-id="cc11a85" data-element_type="widget" data-widget_type="heading.default">
                      <div className="elementor-widget-container">
                        <p className="elementor-heading-title elementor-size-default">Our team has developed blockchain solutions for a wide range of companies, and we’re still expanding. By reducing paperwork and minimizing disputes, we foster happier customers and innovative business methods. A shared record of truth is truly invaluable.</p>		</div>
                    </div>
                    <div className="elementor-element elementor-element-35e814c elementor-widget elementor-widget-tg-btn" data-id="35e814c" data-element_type="widget" data-widget_type="tg-btn.default">
                      <div className="elementor-widget-container">
                        <Link to="/auth/signup" target="_self" rel="nofollow" className="btn btn2 show-arrow">
                          Get Started          </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-element elementor-element-d89d063 e-flex e-con-boxed e-con e-parent" data-id="d89d063" data-element_type="container" data-core-v316-plus="true">
            <div className="e-con-inner">
              <div className="elementor-element elementor-element-2555070 e-flex e-con-boxed e-con e-child" data-id={2555070} data-element_type="container">
                <div className="e-con-inner">
                  <div className="elementor-element elementor-element-b41639d elementor-widget elementor-widget-tg-heading" data-id="b41639d" data-element_type="widget" data-widget_type="tg-heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="title gradient-title">TESTIMONIALS</h2>
                    </div>
                  </div>
                  <div className="elementor-element elementor-element-1f2c251 elementor-widget elementor-widget-heading" data-id="1f2c251" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">Hear Directly from Our Clients About Their Journey with Block Guard</h2>		</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-wrap-3">
                <div className="testimonial-wrap-circle1 alltuchtopdown" />
                <div className="testimonial-wrap-circle2 leftToRight" />
                <div className="testimonial-wrap-circle3 leftToRight" />
                <div className="testimonial-wrap-bg alltuchtopdown">
                  <img decoding="async" src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/testimonial-4-bg.png" alt="img" />
                </div>
                <div className="slider-area testimonial-slider-wrap">
                  <div className="testimonial-slider-wrap">
                    <div className="testimonial-wrap-bg">
                      <img
                        src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/testimonial-4-bg.png"
                        alt="Testimonial Background"
                      />
                    </div>
                    <Slider ref={sliderRef}  {...settings} className="testimonial-slider1">
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="slider-item col-lg-6">
                          <div className="testi-box">
                            <div className="testi-box-profile">
                              <div className="testi-box-profile-thumb">
                                <img src={testimonial.image} alt={testimonial.name} />
                              </div>
                              <div className="testi-box-profile-details">
                                <h4 className="testi-box_name">{testimonial.name}</h4>
                                <span className="testi-box_desig">{testimonial.designation}</span>
                              </div>
                              <div className="testi-box-profile-ratting">
                                {Array(5)
                                  .fill()
                                  .map((_, i) => (
                                    <i key={i} className="fas fa-star"></i>
                                  ))}
                              </div>
                            </div>
                            <p className="testi-box_text">{testimonial.text}</p>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                  <button onClick={prevSlide} className="slider-arrow prev-btn">
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <button onClick={nextSlide} className="slider-arrow next-btn">
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>


            </div>
          </div>
          <div className="elementor-element elementor-element-b8413d2 e-flex e-con-boxed e-con e-parent" data-id="b8413d2" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;gradient&quot;}" data-core-v316-plus="true">
            <div className="e-con-inner">
              <div className="elementor-element elementor-element-6e475f8 elementor-absolute alltuchtopdown elementor-widget elementor-widget-image" data-id="6e475f8" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                <div className="elementor-widget-container">
                  <img loading="lazy" decoding="async" width={256} height={167} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/line-shape.png" className="attachment-full size-full wp-image-1082" alt />													</div>
              </div>
              <div className="elementor-element elementor-element-5a40551 elementor-absolute alltuchtopdown elementor-widget elementor-widget-image" data-id="5a40551" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                <div className="elementor-widget-container">
                  <img loading="lazy" decoding="async" width={82} height={82} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/circle001.png" className="attachment-full size-full wp-image-1102" alt />													</div>
              </div>
              <div className="elementor-element elementor-element-d405f5e elementor-absolute leftToRight elementor-widget elementor-widget-image" data-id="d405f5e" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                <div className="elementor-widget-container">
                  <img loading="lazy" decoding="async" width={109} height={109} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/circle002.png" className="attachment-full size-full wp-image-1103" alt />													</div>
              </div>
              <div className="elementor-element elementor-element-baa8431 e-con-full e-flex e-con e-child" data-id="baa8431" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                <div style={{ width: "100%" }} className="elementor-element elementor-element-7f87821 e-con-full e-flex e-con e-child" data-id="7f87821" data-element_type="container">
                  <div className="elementor-element elementor-element-1641128 elementor-widget elementor-widget-heading" data-id={1641128} data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">Unlock Passive Income Opportunities</h2>		</div>
                  </div>
                  <div className="elementor-element elementor-element-2e83b30 elementor-widget elementor-widget-heading" data-id="2e83b30" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default"> Maximize Your Earnings with Crypto Staking</h2>		</div>
                  </div>
                  <div className="elementor-element elementor-element-361d4a1 elementor-widget__width-initial elementor-widget elementor-widget-heading" data-id="361d4a1" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <p className="elementor-heading-title elementor-size-default">Crypto staking allows you to earn rewards by holding and supporting your digital assets in a blockchain network. By participating in staking, you contribute to the security and efficiency of the network while earning a steady stream of income. It's a straightforward way to make your cryptocurrencies work for you.</p>		</div>
                  </div>
                  <div className="elementor-element elementor-element-5d4ca75 elementor-widget elementor-widget-tg-btn" data-id="5d4ca75" data-element_type="widget" data-widget_type="tg-btn.default">
                    <div className="elementor-widget-container">
                      <Link to="/auth/signup" target="_self" rel="nofollow" className="btn btn2 show-arrow">
                        Get Started          </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="elementor-element elementor-element-3ecec9d e-flex e-con-boxed e-con e-parent" data-id="3ecec9d" data-element_type="container" data-core-v316-plus="true">
            <div className="e-con-inner">
              <div className="elementor-element elementor-element-39547d9 position-static elementor-widget elementor-widget-html" data-id="39547d9" data-element_type="widget" data-widget_type="html.default">
                <div className="elementor-widget-container">
                  <div className="faq-2-shape-1" />		</div>
              </div>
              <div className="elementor-element elementor-element-70e30b1 e-flex e-con-boxed e-con e-child" data-id="70e30b1" data-element_type="container">
                <div className="e-con-inner">
                  <div className="elementor-element elementor-element-272d0d2 elementor-widget elementor-widget-tg-heading" data-id="272d0d2" data-element_type="widget" data-widget_type="tg-heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="title gradient-title">Frequently Asked Questions</h2>
                    </div>
                  </div>
                  <div className="elementor-element elementor-element-2f68d8f elementor-widget elementor-widget-heading" data-id="2f68d8f" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">Common Inquiries </h2>		</div>
                  </div>
                  <div className="elementor-element elementor-element-63b6c49 elementor-widget elementor-widget-heading" data-id="63b6c49" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <p className="elementor-heading-title elementor-size-default">We’re here to help! Explore our Q&A section to find clear answers to common inquiries about our services, features, and the world of cryptocurrency. Whether you're a beginner or an experienced user, we aim to provide the information you need to navigate your crypto journey with confidence. If you have more questions, feel free to reach out!</p>		</div>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-69471f4 e-flex e-con-boxed e-con e-child" data-id="69471f4" data-element_type="container">
                <div className="e-con-inner">
                  <div className="elementor-element elementor-element-b9173be elementor-widget elementor-widget-genix-faq" data-id="b9173be" data-element_type="widget" data-widget_type="genix-faq.default">
                    <div className="elementor-widget-container">
                      <div className="accordion-area accordion" id="blockchainAccordion">
                        {/* Accordion Card 1 */}
                        <div className="accordion-card style2">
                          <div className="accordion-header" id="headingOne-0">
                            <button
                              className={`accordion-button ${openAccordion === 0 ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => toggleAccordion(0)}
                              aria-expanded={openAccordion === 0}
                              aria-controls="collapseOne-0"
                            >
                              What is a crypto wallet?
                            </button>
                          </div>
                          <div
                            id="collapseOne-0"
                            className={`accordion-collapse collapse ${openAccordion === 0 ? 'show' : ''}`}
                            aria-labelledby="headingOne-0"
                          >
                            <div className="accordion-body">
                              <p className="faq-text">
                                A crypto wallet is your gateway to the world of digital assets, enabling you to securely store, send, and receive cryptocurrencies with ease. Our wallet offers both software options for everyday transactions and hardware options for long-term storage, so you can choose what suits you best!
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Accordion Card 2 */}
                        <div className="accordion-card style2">
                          <div className="accordion-header" id="headingOne-1">
                            <button
                              className={`accordion-button ${openAccordion === 1 ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => toggleAccordion(1)}
                              aria-expanded={openAccordion === 1}
                              aria-controls="collapseOne-1"
                            >
                              How do I choose the right crypto wallet?
                            </button>
                          </div>
                          <div
                            id="collapseOne-1"
                            className={`accordion-collapse collapse ${openAccordion === 1 ? 'show' : ''}`}
                            aria-labelledby="headingOne-1"
                          >
                            <div className="accordion-body">
                              <p className="faq-text">
                                Choosing the right crypto wallet is straightforward! We provide a wallet that features robust security, a user-friendly interface, and compatibility with your favorite cryptocurrencies. Whether you're just starting out or are an experienced trader, our wallet is tailored to meet your needs!
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Accordion Card 3 */}
                        <div className="accordion-card style2">
                          <div className="accordion-header" id="headingOne-2">
                            <button
                              className={`accordion-button ${openAccordion === 2 ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => toggleAccordion(2)}
                              aria-expanded={openAccordion === 2}
                              aria-controls="collapseOne-2"
                            >
                              Can I buy crypto directly in the wallet?
                            </button>
                          </div>
                          <div
                            id="collapseOne-2"
                            className={`accordion-collapse collapse ${openAccordion === 2 ? 'show' : ''}`}
                            aria-labelledby="headingOne-2"
                          >
                            <div className="accordion-body">
                              <p className="faq-text">
                                Yes! With our wallet, you can conveniently purchase cryptocurrencies directly within the app. This seamless integration allows you to buy, store, and manage your assets all in one place, making your crypto journey smoother and more efficient!
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Accordion Card 4 */}
                        <div className="accordion-card style2">
                          <div className="accordion-header" id="headingOne-3">
                            <button
                              className={`accordion-button ${openAccordion === 3 ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => toggleAccordion(3)}
                              aria-expanded={openAccordion === 3}
                              aria-controls="collapseOne-3"
                            >
                              What is crypto staking?
                            </button>
                          </div>
                          <div
                            id="collapseOne-3"
                            className={`accordion-collapse collapse ${openAccordion === 3 ? 'show' : ''}`}
                            aria-labelledby="headingOne-3"
                          >
                            <div className="accordion-body">
                              <p className="faq-text">
                                Crypto staking is a feature we offer that allows you to participate in a proof-of-stake network by locking up your cryptocurrencies. By doing so, you help support network operations, like validating transactions, and earn rewards over time in return.
                              </p>
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-element elementor-element-e17943d e-flex e-con-boxed e-con e-parent" data-id="e17943d" data-element_type="container" data-core-v316-plus="true">
            <div className="e-con-inner">
              <div className="elementor-element elementor-element-dbad8e1 e-con-full e-flex e-con e-child" data-id="dbad8e1" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;gradient&quot;}">
                <div className="elementor-element elementor-element-666fae3 e-con-full e-flex e-con e-child" data-id="666fae3" data-element_type="container">
                  <div className="elementor-element elementor-element-ad50eeb elementor-widget elementor-widget-heading" data-id="ad50eeb" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">Be part of the future</h2>		</div>
                  </div>
                  <div className="elementor-element elementor-element-b6e4a45 elementor-widget elementor-widget-heading" data-id="b6e4a45" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <p className="elementor-heading-title elementor-size-default">Join the revolution in technology and innovation. We’ve partnered with over 100 companies to develop cutting-edge blockchain solutions that transform their businesses. Now, it's your turn to harness the power of blockchain and shape the future of your industry.
                        Don’t wait—let’s build tomorrow together!
                      </p>		</div>
                  </div>
                  <div className="elementor-element elementor-element-32e8152 elementor-widget elementor-widget-tg-btn" data-id="32e8152" data-element_type="widget" data-widget_type="tg-btn.default">
                    <div className="elementor-widget-container">
                      <Link to="/auth/signup" target="_self" rel="nofollow" className="btn btn2 show-arrow">
                        Get Started          </Link>
                    </div>
                  </div>
                </div>
                <div className="elementor-element elementor-element-72229c9 elementor-widget elementor-widget-image" data-id="72229c9" data-element_type="widget" data-widget_type="image.default">
                  <div className="elementor-widget-container">
                    <img loading="lazy" decoding="async" width={405} height={404} src="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/cta.png" className="attachment-full size-full wp-image-1123" alt srcSet="https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/cta.png 405w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/cta-300x300.png 300w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/cta-150x150.png 150w, https://iko.themegenix.net/blockchain/wp-content/uploads/2024/04/cta-350x350.png 350w" sizes="(max-width: 405px) 100vw, 405px" />													</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div data-elementor-type="wp-post" data-elementor-id={539} className="elementor elementor-539">
        <div className="elementor-element elementor-element-3bebaff e-con-full e-flex e-con e-parent" data-id="3bebaff" data-element_type="container" data-core-v316-plus="true">
          <div className="elementor-element elementor-element-96a9234 position-static elementor-widget elementor-widget-html" data-id="96a9234" data-element_type="widget" data-widget_type="html.default">
            <div className="elementor-widget-container">
              <div className="footer-gradient-shape" />		</div>
          </div>
          <div className="elementor-element  elementor-element-6bf6dc7 e-grid e-con-boxed e-con e-child" data-id="6bf6dc7" data-element_type="container">
            <div className="e-con-inner masas">
              <div className="elementor-element elementor-element-40f4141 e-con-full e-flex e-con e-child" data-id="40f4141" data-element_type="container">
                <div className="elementor-element elementor-element-609d349 elementor-widget elementor-widget-image" data-id="609d349" data-element_type="widget" data-widget_type="image.default">
                  <div className="elementor-widget-container">
                    <a href="#">
                      <img width={236} height={78} src={LogoNew} className="attachment-full size-full wp-image-57" alt />								</a>
                  </div>
                </div>
                <div className="elementor-element elementor-element-924bab6 elementor-widget elementor-widget-heading" data-id="924bab6" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container">
                    <p className="elementor-heading-title elementor-size-default">Block Guard is a leading blockchain technology company driving innovation in the decentralized ledger space. Established in 2021, we are at the forefront of cutting-edge solutions.</p>		</div>
                </div>
                <div className="elementor-element elementor-element-dfedce5 elementor-widget elementor-widget-iconlist" data-id="dfedce5" data-element_type="widget" data-widget_type="iconlist.default">
                  <div className="elementor-widget-container">
                    <div className="social-btn justify-content-center justify-content-lg-start">
                      <a href="#">
                        <i aria-hidden="true" className="fab fa-facebook-f" />                  </a>
                      <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none"><path d="M9.52219 6.77491L15.4786 0H14.0671L8.89518 5.88256L4.76438 0H0L6.24657 8.89547L0 16H1.41155L6.87322 9.78779L11.2356 16H16L9.52219 6.77491ZM7.58888 8.97384L6.95597 8.08805L1.92015 1.03974H4.08821L8.15218 6.72796L8.78508 7.61374L14.0677 15.0076H11.8997L7.58888 8.97384Z" fill="currentColor" /></svg>                  </a>

                    </div>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-8b8abf8 e-con-full e-flex e-con e-child" style={{ borderRight: "none" }} data-id="8b8abf8" data-element_type="container">
                <div className="elementor-element elementor-element-fb20a95 elementor-widget elementor-widget-heading" data-id="fb20a95" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container">
                    <h2 className="elementor-heading-title elementor-size-default">CONTACT US</h2>		</div>
                </div>
                {/* <div className="elementor-element elementor-element-ff449b1 elementor-widget elementor-widget-heading" data-id="ff449b1" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container">
                    <p className="elementor-heading-title elementor-size-default">202 Helga Springs Rd, Crawford, TN 38554</p>		</div>
                </div> */}

                <div className="elementor-element elementor-element-7db22c3 elementor-widget elementor-widget-heading" data-id="7db22c3" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container">
                    <p className="elementor-heading-title elementor-size-default">admin@www.blockguard.io</p>		</div>
                </div>
                <div className="elementor-element elementor-element-924bab6 elementor-widget elementor-widget-heading" data-id="924bab6" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container">
                    <p className="elementor-heading-title elementor-size-default">Risk Warning: Trading involves significant risk, as leverage can amplify both gains and losses. Therefore, you should never invest money you cannot afford to lose. Before engaging in the trading of complex financial products, ensure you fully understand the associated risks.</p>		</div>
                </div>
                <br />
                <div className="elementor-element elementor-element-59b9cd7 e-con-full mt-auto e-flex e-con e-child" data-id="59b9cd7" data-element_type="container">
                  <div className="elementor-element elementor-element-04d48a4 elementor-widget elementor-widget-heading" data-id="04d48a4" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <p className="elementor-heading-title elementor-size-default">Copyright © 2024 BLOCKGUARD. All rights reserved.</p>		</div>
                  </div>
                </div>
              </div>
              {/* <div className="elementor-element elementor-element-2d3506e e-con-full e-flex e-con e-child" data-id="2d3506e" data-element_type="container">
                <div className="elementor-element elementor-element-04d8b85 elementor-widget elementor-widget-heading" data-id="04d8b85" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container">
                    <h2 className="elementor-heading-title elementor-size-default">SIGN UP FOR EMAIL UPDATES</h2>		</div>
                </div>
                <div className="elementor-element elementor-element-9ee2216 elementor-widget elementor-widget-heading" data-id="9ee2216" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container">
                    <p className="elementor-heading-title elementor-size-default">Sign up with your email address to receive news and updates</p>		</div>
                </div>

              </div> */}
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Home;
