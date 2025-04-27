import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './iko.css'
import './post.css'
// import './bootstrap.css'
import './iko-core.css'
import './iko-unit.css'
import Refer from '../../../../assets/refer.jpg'
import './custom-frontend.css'
import './custom.css'
import './home-latest.css'
import './bootstrapNew.css'
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.css";
import "./style.css";
import LogoNew from '../../../../assets/newlogo/logo.png'
import Ethan from '../../../../assets/images/ethan.jpg'
import Leo from '../../../../assets/images/leo.jpg'
import Lily from '../../../../assets/images/lily.jpg'
import Sophie from '../../../../assets/images/sophie.jpg'


const Home = () => {
  const sliderRef = useRef(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  const [activeTab, setActiveTab] = useState(null);

  const toggleTab = (tabIndex) => {
    setActiveTab((prev) => (prev === tabIndex ? null : tabIndex));
  };



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
    // let header = this.document.querySelector("#sticky-header");

    // header.classList.toggle("sticky-menu", window.scrollY > 150);
  });
  const faqData = [
    {
      id: 1,
      question: "What is Blockvault Wallet?",
      answer:
        "Blockvault Wallet is a secure, easy-to-use platform for managing, sending, and receiving cryptocurrencies. It supports multiple tokens and offers advanced security features to protect your digital assets.",
    },
    {
      id: 2,
      question: "How do I get started?",
      answer:
        "Simply register online or download the Windows app, create an account, and follow the setup instructions. You'll be able to securely store, send, and receive a wide range of cryptocurrencies in just a few steps.",
    },
    {
      id: 3,
      question: "Is my crypto safe in Blockvault Wallet?",
      answer:
        "Yes, your crypto is protected with top-level encryption, multi-layer authentication, and cold storage solutions, ensuring maximum security for your digital assets.",
    },
    {
      id: 4,
      question: "What crypto is supported?",
      answer:
        "Blockvault Wallet supports a wide variety of cryptocurrencies, including Bitcoin, Ethereum, and many popular altcoins. Check our supported tokens list for the full range of assets you can store and manage.",
    },
    {
      id: 5,
      question: "Can I stake my crypto in Blockvault Wallet?",
      answer:
        "Yes, Blockvault Wallet offers a simple staking option that allows you to earn rewards by staking your tokens directly within the app. Just choose your desired crypto, and start staking to maximize your returns.",
    },
    {
      id: 6,
      question: "Can I connect my bank account or credit card to Blockvault Wallet?",
      answer:
        "Yes, Blockvault Wallet allows you to link your bank account or credit card for easy purchasing and transferring of cryptocurrencies. Enjoy a simple, secure way to fund your wallet and manage your assets.",
    },
  ];

  return (
    <div className="hompg homepaag">
      <div>
        <nav id="pr-nav" className="primary-menu navbar navbar-expand-lg navbar-dark nav-white-desktop">
          <div className="container-fluid primary-menu-inner px-0" >
            <div className="top-wrap" >
              <Link className="custom-logo-link" to="/" >
                <h5 className="m-0"><img style={{ width: "70px" }} src={LogoNew} alt="" /></h5>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: "row" }} className="collapse fldla navbar-collapse justify-content-end"   >


              {/* <div className="header-cta nnmmn" ><a target="_blank" href="https://drive.google.com/file/d/1XVfhTww7tjdo2vXMQA8SJ5z6hQuhnwtA/view?usp=sharing"  >
                <div className="d-inline-block elementor-button-link elementor-button elementor-size-md" >Download Windows App</div>
              </a></div> */}
              <div className="header-cta" ><Link to="/auth/login"  >
                <div className="d-inline-block elementor-button-link elementor-button elementor-size-md" >Sign In</div>
              </Link></div>
            </div>
          </div>
        </nav>
        <main id="site-content" className="flex-grow-1 nav-white-desktop" role="main">
          <article className="post-23310 page type-page status-publish hentry" id="post-23310">
            <div className="post-inner" >
              <header className="entry-header header-group">
                <div className="entry-header-inner" >
                </div>{/* .entry-header-inner */}
              </header>{/* .entry-header */}
              <div className="entry-content clearfix" >
                <div data-elementor-type="wp-page" data-elementor-id={23310} className="elementor elementor-23310" >
                  <section className="elementor-section elementor-top-section elementor-element elementor-element-aa23c9b elementor-reverse-tablet elementor-reverse-mobile elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="aa23c9b" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                    <div className="elementor-background-overlay" />
                    <div className="elementor-container elementor-column-gap-custom" >
                      <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-7cfe8d4 animated fadeIn" data-id="7cfe8d4" data-element_type="column" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:500}" >
                        <div className="elementor-widget-wrap elementor-element-populated" >

                          <div className="elementor-element elementor-element-b53c240 elementor-widget elementor-widget-text-editor" data-id="b53c240" data-element_type="widget" data-widget_type="text-editor.default" >
                            <div className="elementor-widget-container" >

                              Refer a Friend
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-bcb0398 elementor-widget elementor-widget-text-editor" data-id="bcb0398" data-element_type="widget" data-widget_type="text-editor.default" >
                            <div className="elementor-widget-container" >

                              Refer Friends and Get 100 USDT Trading Fee Credit. </div>
                          </div>
                          <div className="elementor-element elementor-element-2dcc85d elementor-tablet-align-center elementor-widget elementor-widget-button" data-id="2dcc85d" data-element_type="widget" data-widget_type="button.default" >
                            <div className="elementor-widget-container" >
                              <div className="elementor-button-wrapper" >
                                <Link className="elementor-button elementor-button-link elementor-size-xl elementor-animation-float" to="/auth/signup" >
                                  <span className="elementor-button-content-wrapper">
                                    <span className="elementor-button-text">Start now</span>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <section className="elementor-section elementor-inner-section elementor-element elementor-element-2944cb3 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="2944cb3" data-element_type="section">
                            <div className="elementor-container elementor-column-gap-default" >

                            </div>
                          </section>
                        </div>
                      </div>
                      <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-1f98f87 animated fadeIn" data-id="1f98f87" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:0}" >
                        <div className="elementor-widget-wrap elementor-element-populated" >
                          <div className="elementor-element elementor-element-5301810 elementor-widget elementor-widget-image" data-id={5301810} data-element_type="widget" data-widget_type="image.default" >
                            <div className="elementor-widget-container" >
                              <img fetchpriority="high" decoding="async" style={{ width: "100%", maxWidth: '100%', borderRadius: "20px" }} src={Refer} className="attachment-large size-large wp-image-23315" alt
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="elementor-section elementor-top-section elementor-element elementor-element-a558b12 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="a558b12" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                    <div className="elementor-background-overlay" />
                    <div className="elementor-container elementor-column-gap-default" >
                      <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-bb7c5ff" data-id="bb7c5ff" data-element_type="column" >
                        <div className="elementor-widget-wrap elementor-element-populated" >
                          <section className="elementor-section elementor-inner-section elementor-element elementor-element-40b2f2a elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="40b2f2a" data-element_type="section">
                            <div className="elementor-container elementor-column-gap-default" >
                              <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-a6aec6c animated fadeIn" data-id="a6aec6c" data-element_type="column" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:150}" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-7bae0be elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7bae0be" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;none&quot;}" data-widget_type="image.default" >
                                    <div className="elementor-widget-container" >
                                      <img loading="lazy" decoding="async" width={947} height={1024} src="https://toka.peerduck.com/wp-content/uploads/2022/11/eiufvhef-947x1024.png" className="attachment-large size-large wp-image-23602" alt srcSet="https://toka.peerduck.com/wp-content/uploads/2022/11/eiufvhef-947x1024.png 947w, https://toka.peerduck.com/wp-content/uploads/2022/11/eiufvhef-277x300.png 277w, https://toka.peerduck.com/wp-content/uploads/2022/11/eiufvhef-768x830.png 768w, https://toka.peerduck.com/wp-content/uploads/2022/11/eiufvhef-1421x1536.png 1421w, https://toka.peerduck.com/wp-content/uploads/2022/11/eiufvhef-600x649.png 600w, https://toka.peerduck.com/wp-content/uploads/2022/11/eiufvhef.png 1501w" sizes="(max-width: 947px) 100vw, 947px" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-8b50d79 animated fadeIn" data-id="8b50d79" data-element_type="column" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;}" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-eeeaa9b elementor-widget__width-auto elementor-widget elementor-widget-text-editor" data-id="eeeaa9b" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Backed by Leading Blockchain Investors </div>
                                  </div>
                                  <div className="elementor-element elementor-element-cbf5029 elementor-widget-mobile__width-inherit elementor-widget elementor-widget-text-editor" data-id="cbf5029" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      A trusted platform built to streamline   your cryptocurrency journey
                                    </div>
                                  </div>
                                  <div className="elementor-element elementor-element-2304308 elementor-widget elementor-widget-text-editor" data-id={2304308} data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      offering secure wallets, lightning-fast exchanges, and real-time market insights
                                      we empower you to explore the crypto world with confidence and ease.
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </section>
                          <section className="elementor-section elementor-inner-section elementor-element elementor-element-2822b86 elementor-reverse-tablet elementor-reverse-mobile elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="2822b86" data-element_type="section">
                            <div className="elementor-container elementor-column-gap-default" >
                              <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-a2a185f animated fadeIn" data-id="a2a185f" data-element_type="column" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-509a20d elementor-widget__width-auto elementor-widget elementor-widget-text-editor" data-id="509a20d" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Uncompromising Security  </div>
                                  </div>
                                  <div className="elementor-element elementor-element-98160a8 elementor-widget-mobile__width-inherit elementor-widget elementor-widget-text-editor" data-id="98160a8" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Backup with ultra-high security
                                    </div>
                                  </div>
                                  <div className="elementor-element elementor-element-938b44e elementor-widget elementor-widget-text-editor" data-id="938b44e" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      We prioritizes your safety with advanced encryption,
                                      multi-layer authentication, and cold storage solutions.
                                      Rest assured, your digital assets are protected.
                                    </div>
                                  </div>
                                  <div className="elementor-element elementor-element-c22a729 elementor-tablet-align-center elementor-widget elementor-widget-button" data-id="c22a729" data-element_type="widget" data-widget_type="button.default" >
                                    <div className="elementor-widget-container" >
                                      <div className="elementor-button-wrapper" >
                                        <Link className="elementor-button elementor-button-link elementor-size-xl elementor-animation-float" to="/auth/signup" >
                                          <span className="elementor-button-content-wrapper">
                                            <span className="elementor-button-text">Start
                                              now</span>
                                          </span>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-6471cde animated fadeIn" data-id="6471cde" data-element_type="column" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;background_background&quot;:&quot;classic&quot;}" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-386ebce elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="386ebce" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;none&quot;}" data-widget_type="image.default" >
                                    <div className="elementor-widget-container" >
                                      <img loading="lazy" decoding="async" width={867} height={1024} src={Refer} className="attachment-large size-large wp-image-23422" alt srcSet="https://toka.peerduck.com/wp-content/uploads/2022/11/eygfve-867x1024.png 867w, https://toka.peerduck.com/wp-content/uploads/2022/11/eygfve-254x300.png 254w, https://toka.peerduck.com/wp-content/uploads/2022/11/eygfve-768x907.png 768w, https://toka.peerduck.com/wp-content/uploads/2022/11/eygfve-600x709.png 600w, https://toka.peerduck.com/wp-content/uploads/2022/11/eygfve.png 1200w" sizes="(max-width: 867px) 100vw, 867px" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="elementor-section elementor-top-section elementor-element elementor-element-d8647f7 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d8647f7" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                    <div className="elementor-background-overlay" />
                    <div className="elementor-container elementor-column-gap-default" >
                      <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-84fb7ba" data-id="84fb7ba" data-element_type="column" >
                        <div className="elementor-widget-wrap elementor-element-populated" >
                          <section className="elementor-section elementor-inner-section elementor-element elementor-element-51fcf7f elementor-section-boxed elementor-section-height-default elementor-section-height-default animated fadeIn" data-id="51fcf7f" data-element_type="section" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:100}">
                            <div className="elementor-container elementor-column-gap-no" >
                              <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-ced4232" data-id="ced4232" data-element_type="column" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-965343f elementor-widget__width-auto elementor-widget elementor-widget-text-editor" data-id="965343f" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Main Features </div>
                                  </div>
                                  <div className="elementor-element elementor-element-0c882c7 elementor-widget-mobile__width-inherit elementor-widget elementor-widget-heading" data-id="0c882c7" data-element_type="widget" data-widget_type="heading.default" >
                                    <div className="elementor-widget-container" >
                                      <style dangerouslySetInnerHTML={{ __html: "\n                                                                    /*! elementor - v3.21.0 - 24-04-2024 */\n                                                                    .elementor-heading-title {\n                                                                        padding: 0;\n                                                                        margin: 0;\n                                                                        line-height: 1\n                                                                    }\n\n                                                                    .elementor-widget-heading .elementor-heading-title[class*=elementor-size-]>a {\n                                                                        color: inherit;\n                                                                        font-size: inherit;\n                                                                        line-height: inherit\n                                                                    }\n\n                                                                    .elementor-widget-heading .elementor-heading-title.elementor-size-small {\n                                                                        font-size: 15px\n                                                                    }\n\n                                                                    .elementor-widget-heading .elementor-heading-title.elementor-size-medium {\n                                                                        font-size: 19px\n                                                                    }\n\n                                                                    .elementor-widget-heading .elementor-heading-title.elementor-size-large {\n                                                                        font-size: 29px\n                                                                    }\n\n                                                                    .elementor-widget-heading .elementor-heading-title.elementor-size-xl {\n                                                                        font-size: 39px\n                                                                    }\n\n                                                                    .elementor-widget-heading .elementor-heading-title.elementor-size-xxl {\n                                                                        font-size: 59px\n                                                                    }\n                                                                " }} />
                                      <h2 className="elementor-heading-title elementor-size-default">
                                        A new generation wallet</h2>
                                    </div>
                                  </div>
                                  <div className="elementor-element elementor-element-270179f elementor-widget elementor-widget-text-editor" data-id="270179f" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Experience the ultimate combination of security, simplicity, and speed for all your crypto needs. </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                          <section className="elementor-section elementor-inner-section elementor-element elementor-element-1eb3ef6 elementor-section-full_width elementor-section-height-default elementor-section-height-default animated fadeIn" data-id="1eb3ef6" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;gradient&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:100}">
                            <div className="elementor-container elementor-column-gap-default" >
                              <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-c496e1d" data-id="c496e1d" data-element_type="column" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <section className="elementor-section elementor-inner-section elementor-element elementor-element-e464b44 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="e464b44" data-element_type="section">
                                    <div className="elementor-container elementor-column-gap-default" >
                                      <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-ef5e75a" data-id="ef5e75a" data-element_type="column" >
                                        <div className="elementor-widget-wrap elementor-element-populated" >
                                          <div className="elementor-element elementor-element-dcb275e elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="dcb275e" data-element_type="widget" data-widget_type="image-box.default" >
                                            <div className="elementor-widget-container" >
                                              <style dangerouslySetInnerHTML={{ __html: "\n                                                                                    /*! elementor - v3.21.0 - 24-04-2024 */\n                                                                                    .elementor-widget-image-box .elementor-image-box-content {\n                                                                                        width: 100%\n                                                                                    }\n\n                                                                                    @media (min-width:768px) {\n\n                                                                                        .elementor-widget-image-box.elementor-position-left .elementor-image-box-wrapper,\n                                                                                        .elementor-widget-image-box.elementor-position-right .elementor-image-box-wrapper {\n                                                                                            display: flex\n                                                                                        }\n\n                                                                                        .elementor-widget-image-box.elementor-position-right .elementor-image-box-wrapper {\n                                                                                            text-align: end;\n                                                                                            flex-direction: row-reverse\n                                                                                        }\n\n                                                                                        .elementor-widget-image-box.elementor-position-left .elementor-image-box-wrapper {\n                                                                                            text-align: start;\n                                                                                            flex-direction: row\n                                                                                        }\n\n                                                                                        .elementor-widget-image-box.elementor-position-top .elementor-image-box-img {\n                                                                                            margin: auto\n                                                                                        }\n\n                                                                                        .elementor-widget-image-box.elementor-vertical-align-top .elementor-image-box-wrapper {\n                                                                                            align-items: flex-start\n                                                                                        }\n\n                                                                                        .elementor-widget-image-box.elementor-vertical-align-middle .elementor-image-box-wrapper {\n                                                                                            align-items: center\n                                                                                        }\n\n                                                                                        .elementor-widget-image-box.elementor-vertical-align-bottom .elementor-image-box-wrapper {\n                                                                                            align-items: flex-end\n                                                                                        }\n                                                                                    }\n\n                                                                                    @media (max-width:767px) {\n                                                                                        .elementor-widget-image-box .elementor-image-box-img {\n                                                                                            margin-left: auto !important;\n                                                                                            margin-right: auto !important;\n                                                                                            margin-bottom: 15px\n                                                                                        }\n                                                                                    }\n\n                                                                                    .elementor-widget-image-box .elementor-image-box-img {\n                                                                                        display: inline-block\n                                                                                    }\n\n                                                                                    .elementor-widget-image-box .elementor-image-box-title a {\n                                                                                        color: inherit\n                                                                                    }\n\n                                                                                    .elementor-widget-image-box .elementor-image-box-wrapper {\n                                                                                        text-align: center\n                                                                                    }\n\n                                                                                    .elementor-widget-image-box .elementor-image-box-description {\n                                                                                        margin: 0\n                                                                                    }\n                                                                                " }} />
                                              <div className="elementor-image-box-wrapper" >
                                                <figure className="elementor-image-box-img">
                                                  <img loading="lazy" decoding="async" width={160} height={160} src="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png" className="attachment-full size-full wp-image-23481" alt srcSet="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png 160w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-150x150.png 150w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-100x100.png 100w" sizes="(max-width: 160px) 100vw, 160px" />
                                                </figure>
                                                <div className="elementor-image-box-content" ><span className="elementor-image-box-title">User-Friendly Design</span>
                                                  <p className="elementor-image-box-description">
                                                    Effortlessly manage your crypto with an intuitive interface.
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-c7b39fd" data-id="c7b39fd" data-element_type="column" >
                                        <div className="elementor-widget-wrap elementor-element-populated" >
                                          <div className="elementor-element elementor-element-4289a80 elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="4289a80" data-element_type="widget" data-widget_type="image-box.default" >
                                            <div className="elementor-widget-container" >
                                              <div className="elementor-image-box-wrapper" >
                                                <figure className="elementor-image-box-img">
                                                  <img loading="lazy" decoding="async" width={160} height={160} src="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png" className="attachment-full size-full wp-image-23481" alt srcSet="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png 160w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-150x150.png 150w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-100x100.png 100w" sizes="(max-width: 160px) 100vw, 160px" />
                                                </figure>
                                                <div className="elementor-image-box-content" ><span className="elementor-image-box-title">Top-Tier Security </span>
                                                  <p className="elementor-image-box-description">

                                                    Advanced encryption to safeguard your digital assets.
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-c806738" data-id="c806738" data-element_type="column" >
                                        <div className="elementor-widget-wrap elementor-element-populated" >
                                          <div className="elementor-element elementor-element-d1347bb elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="d1347bb" data-element_type="widget" data-widget_type="image-box.default" >
                                            <div className="elementor-widget-container" >
                                              <div className="elementor-image-box-wrapper" >
                                                <figure className="elementor-image-box-img">
                                                  <img loading="lazy" decoding="async" width={160} height={160} src="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png" className="attachment-full size-full wp-image-23481" alt srcSet="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png 160w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-150x150.png 150w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-100x100.png 100w" sizes="(max-width: 160px) 100vw, 160px" />
                                                </figure>
                                                <div className="elementor-image-box-content" ><span className="elementor-image-box-title">Password
                                                  protection</span>
                                                  <p className="elementor-image-box-description">

                                                    Secure access with robust, customizable password options.
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </section>
                                  <section className="elementor-section elementor-inner-section elementor-element elementor-element-1b5e8d8 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="1b5e8d8" data-element_type="section">
                                    <div className="elementor-container elementor-column-gap-default" >
                                      <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-c1a0b28" data-id="c1a0b28" data-element_type="column" >
                                        <div className="elementor-widget-wrap elementor-element-populated" >
                                          <div className="elementor-element elementor-element-1d9315d elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="1d9315d" data-element_type="widget" data-widget_type="image-box.default" >
                                            <div className="elementor-widget-container" >
                                              <div className="elementor-image-box-wrapper" >
                                                <figure className="elementor-image-box-img">
                                                  <img loading="lazy" decoding="async" width={160} height={160} src="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png" className="attachment-full size-full wp-image-23481" alt srcSet="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png 160w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-150x150.png 150w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-100x100.png 100w" sizes="(max-width: 160px) 100vw, 160px" />
                                                </figure>
                                                <div className="elementor-image-box-content" ><span className="elementor-image-box-title">Multi-Token</span>
                                                  <p className="elementor-image-box-description">
                                                    Store, send, and Stake a wide variety of cryptocurrencies.
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-d0a9de6" data-id="d0a9de6" data-element_type="column" >
                                        <div className="elementor-widget-wrap elementor-element-populated" >
                                          <div className="elementor-element elementor-element-5e983ee elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="5e983ee" data-element_type="widget" data-widget_type="image-box.default" >
                                            <div className="elementor-widget-container" >
                                              <div className="elementor-image-box-wrapper" >
                                                <figure className="elementor-image-box-img">
                                                  <img loading="lazy" decoding="async" width={160} height={160} src="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png" className="attachment-full size-full wp-image-23481" alt srcSet="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png 160w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-150x150.png 150w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-100x100.png 100w" sizes="(max-width: 160px) 100vw, 160px" />
                                                </figure>
                                                <div className="elementor-image-box-content" ><span className="elementor-image-box-title">Unmatched Safety</span>
                                                  <p className="elementor-image-box-description">
                                                    Cold storage solutions to keep your funds secure from threats.
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-e47aa9c" data-id="e47aa9c" data-element_type="column" >
                                        <div className="elementor-widget-wrap elementor-element-populated" >
                                          <div className="elementor-element elementor-element-4c457de elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="4c457de" data-element_type="widget" data-widget_type="image-box.default" >
                                            <div className="elementor-widget-container" >
                                              <div className="elementor-image-box-wrapper" >
                                                <figure className="elementor-image-box-img">
                                                  <img loading="lazy" decoding="async" width={160} height={160} src="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png" className="attachment-full size-full wp-image-23481" alt srcSet="https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb.png 160w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-150x150.png 150w, https://toka.peerduck.com/wp-content/uploads/2022/11/ewfvrb-100x100.png 100w" sizes="(max-width: 160px) 100vw, 160px" />
                                                </figure>
                                                <div className="elementor-image-box-content" ><span className="elementor-image-box-title">Staking+</span>
                                                  <p className="elementor-image-box-description">
                                                    Earn rewards by staking your tokens directly in the wallet.
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </section>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="elementor-section elementor-top-section elementor-element elementor-element-01dd347 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="01dd347" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                    <div className="elementor-background-overlay" />
                    <div className="elementor-container elementor-column-gap-default" >
                      <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-d3dea06" data-id="d3dea06" data-element_type="column" >
                        <div className="elementor-widget-wrap elementor-element-populated" >
                          <section className="elementor-section elementor-inner-section elementor-element elementor-element-d862441 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d862441" data-element_type="section">
                            <div className="elementor-container elementor-column-gap-default" >
                              <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-678334d animated fadeIn" data-id="678334d" data-element_type="column" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-4bde5b0 elementor-widget elementor-widget-image" data-id="4bde5b0" data-element_type="widget" data-widget_type="image.default" >
                                    <div className="elementor-widget-container" >
                                      <img loading="lazy" decoding="async" width={890} height={1024} src="https://toka.peerduck.com/wp-content/uploads/2022/11/efvhjef-890x1024.png" className="attachment-large size-large wp-image-23512" alt srcSet="https://toka.peerduck.com/wp-content/uploads/2022/11/efvhjef-890x1024.png 890w, https://toka.peerduck.com/wp-content/uploads/2022/11/efvhjef-261x300.png 261w, https://toka.peerduck.com/wp-content/uploads/2022/11/efvhjef-768x883.png 768w, https://toka.peerduck.com/wp-content/uploads/2022/11/efvhjef-600x690.png 600w, https://toka.peerduck.com/wp-content/uploads/2022/11/efvhjef.png 931w" sizes="(max-width: 890px) 100vw, 890px" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-d32966a animated fadeIn" data-id="d32966a" data-element_type="column" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;}" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-fad5859 elementor-widget__width-auto elementor-widget elementor-widget-text-editor" data-id="fad5859" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      More possibilities </div>
                                  </div>
                                  <div className="elementor-element elementor-element-49f092c elementor-widget-mobile__width-inherit elementor-widget elementor-widget-text-editor" data-id="49f092c" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Stake, swap and trade in one place </div>
                                  </div>
                                  <div className="elementor-element elementor-element-1e475b5 elementor-widget elementor-widget-text-editor" data-id="1e475b5" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Manage, trade, stake, and grow your crypto portfolio all in one secure and intuitive platform. Explore the future of finance with confidence.
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </section>
                          <section className="elementor-section elementor-inner-section elementor-element elementor-element-78582c5 elementor-reverse-tablet elementor-reverse-mobile elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="78582c5" data-element_type="section">
                            <div className="elementor-container elementor-column-gap-default" >
                              <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-6a64521 animated fadeIn" data-id="6a64521" data-element_type="column" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-5d8c7ca elementor-widget__width-auto elementor-widget elementor-widget-text-editor" data-id="5d8c7ca" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      WMulti-Token Support </div>
                                  </div>
                                  <div className="elementor-element elementor-element-b44c8e9 elementor-widget-mobile__width-inherit elementor-widget elementor-widget-text-editor" data-id="b44c8e9" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Effortlessly store a wide range of cryptocurrencies </div>
                                  </div>
                                  <div className="elementor-element elementor-element-1130466 elementor-widget elementor-widget-text-editor" data-id={1130466} data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Whether you're managing Bitcoin, Ethereum,
                                      or altcoins, we provide seamless compatibility for your diverse digital assets.
                                    </div>
                                  </div>

                                </div>
                              </div>
                              <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-191c4f9 animated fadeIn" data-id="191c4f9" data-element_type="column" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;background_background&quot;:&quot;classic&quot;}" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-745fb57 elementor-widget elementor-widget-image" data-id="745fb57" data-element_type="widget" data-widget_type="image.default" >
                                    <div className="elementor-widget-container" >
                                      <img loading="lazy" decoding="async" width={1024} height={797} src="https://toka.peerduck.com/wp-content/uploads/2022/11/t8gbhtg-1024x797.png" className="attachment-large size-large wp-image-23507" alt srcSet="https://toka.peerduck.com/wp-content/uploads/2022/11/t8gbhtg-1024x797.png 1024w, https://toka.peerduck.com/wp-content/uploads/2022/11/t8gbhtg-300x233.png 300w, https://toka.peerduck.com/wp-content/uploads/2022/11/t8gbhtg-768x598.png 768w, https://toka.peerduck.com/wp-content/uploads/2022/11/t8gbhtg-1536x1195.png 1536w, https://toka.peerduck.com/wp-content/uploads/2022/11/t8gbhtg-2048x1594.png 2048w, https://toka.peerduck.com/wp-content/uploads/2022/11/t8gbhtg-600x467.png 600w" sizes="(max-width: 1024px) 100vw, 1024px" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="elementor-section elementor-top-section elementor-element elementor-element-9ed58fe elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="9ed58fe" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                    <div className="elementor-background-overlay" />
                    <div className="elementor-container elementor-column-gap-default" >
                      <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-2530493" data-id={2530493} data-element_type="column" >
                        <div className="elementor-widget-wrap elementor-element-populated" >
                          <section className="elementor-section elementor-inner-section elementor-element elementor-element-cfbacae elementor-section-boxed elementor-section-height-default elementor-section-height-default animated fadeIn" data-id="cfbacae" data-element_type="section" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:100}">
                            <div className="elementor-container elementor-column-gap-no" >
                              <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-972db4f" data-id="972db4f" data-element_type="column" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-57d7e81 elementor-widget__width-auto elementor-widget elementor-widget-text-editor" data-id="57d7e81" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      FAQ </div>
                                  </div>
                                  <div className="elementor-element elementor-element-bac89af elementor-widget-mobile__width-inherit elementor-widget elementor-widget-heading" data-id="bac89af" data-element_type="widget" data-widget_type="heading.default" >
                                    <div className="elementor-widget-container" >
                                      <h2 className="elementor-heading-title elementor-size-default">
                                        Frequently asked questions
                                      </h2>
                                    </div>
                                  </div>
                                  <div className="elementor-element elementor-element-101d19f elementor-widget elementor-widget-text-editor" data-id="101d19f" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Check Out Our FAQ for All the Information You Need to Get Started.</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                          <section className="elementor-section elementor-inner-section elementor-element elementor-element-2c660bf elementor-section-boxed elementor-section-height-default elementor-section-height-default animated fadeIn" data-id="2c660bf" data-element_type="section" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:100}">
                            <div className="elementor-container elementor-column-gap-default" >
                              <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-d8fc851" data-id="d8fc851" data-element_type="column" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-615039f elementor-widget elementor-widget-toggle" data-id="615039f" data-element_type="widget" data-widget_type="toggle.default" >
                                    <div className="elementor-widget-container" >
                                      <style dangerouslySetInnerHTML={{ __html: "\n                                                                    /*! elementor - v3.21.0 - 24-04-2024 */\n                                                                    .elementor-toggle {\n                                                                        text-align: start\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-title {\n                                                                        font-weight: 700;\n                                                                        line-height: 1;\n                                                                        margin: 0;\n                                                                        padding: 15px;\n                                                                        border-bottom: 1px solid #d5d8dc;\n                                                                        cursor: pointer;\n                                                                        outline: none\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-title .elementor-toggle-icon {\n                                                                        display: inline-block;\n                                                                        width: 1em\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-title .elementor-toggle-icon svg {\n                                                                        margin-inline-start: -5px;\n                                                                        width: 1em;\n                                                                        height: 1em\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-title .elementor-toggle-icon.elementor-toggle-icon-right {\n                                                                        float: right;\n                                                                        text-align: right\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-title .elementor-toggle-icon.elementor-toggle-icon-left {\n                                                                        float: left;\n                                                                        text-align: left\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-title .elementor-toggle-icon .elementor-toggle-icon-closed {\n                                                                        display: block\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-title .elementor-toggle-icon .elementor-toggle-icon-opened {\n                                                                        display: none\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-title.elementor-active {\n                                                                        border-bottom: none\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-title.elementor-active .elementor-toggle-icon-closed {\n                                                                        display: none\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-title.elementor-active .elementor-toggle-icon-opened {\n                                                                        display: block\n                                                                    }\n\n                                                                    .elementor-toggle .elementor-tab-content {\n                                                                        padding: 15px;\n                                                                        border-bottom: 1px solid #d5d8dc;\n                                                                        display: none\n                                                                    }\n\n                                                                    @media (max-width:767px) {\n                                                                        .elementor-toggle .elementor-tab-title {\n                                                                            padding: 12px\n                                                                        }\n\n                                                                        .elementor-toggle .elementor-tab-content {\n                                                                            padding: 12px 10px\n                                                                        }\n                                                                    }\n\n                                                                    .e-con-inner>.elementor-widget-toggle,\n                                                                    .e-con>.elementor-widget-toggle {\n                                                                        width: var(--container-widget-width);\n                                                                        --flex-grow: var(--container-widget-flex-grow)\n                                                                    }\n                                                                " }} />
                                      <div className="elementor-toggle">
                                        {faqData.map((item) => (
                                          <div
                                            className="elementor-toggle-item"
                                            key={item.id}
                                            onClick={() => toggleTab(item.id)}
                                          >
                                            <div
                                              id={`elementor-tab-title-${item.id}`}
                                              className="elementor-tab-title"
                                              data-tab={item.id}
                                              role="button"
                                              aria-controls={`elementor-tab-content-${item.id}`}
                                              aria-expanded={activeTab === item.id}
                                            >
                                              <span className="elementor-toggle-icon elementor-toggle-icon-right" aria-hidden="true">
                                                <span className={`elementor-toggle-icon-closed ${activeTab === item.id ? "rotatef" : "rotateaf"}`}>
                                                  <i className="fas fa-chevron-down" />
                                                </span>
                                                {/* <span className={`elementor-toggle-icon-opened ${activeTab === item.id ? "" : "hidden"}`}>
                                                  <i className="fas fa-chevron-up" />
                                                </span> */}
                                              </span>
                                              <a className="elementor-toggle-title" tabIndex={0}>
                                                {item.question}
                                              </a>
                                            </div>
                                            <div
                                              id={`elementor-tab-content-${item.id}`}
                                              className={`elementor-tab-content elementor-clearfix ${activeTab === item.id ? "dblock" : "hidden"
                                                }`}
                                              data-tab={item.id}
                                              role="region"
                                              aria-labelledby={`elementor-tab-title-${item.id}`}
                                            >
                                              {item.answer}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                          <section className="elementor-section elementor-inner-section elementor-element elementor-element-f0db96b elementor-section-boxed elementor-section-height-default elementor-section-height-default animated fadeIn" data-id="f0db96b" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;gradient&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:150}">
                            <div className="elementor-background-overlay" />
                            <div className="elementor-container elementor-column-gap-default" >
                              <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-9bb5d4f" data-id="9bb5d4f" data-element_type="column" >
                                <div className="elementor-widget-wrap elementor-element-populated" >
                                  <div className="elementor-element elementor-element-774b677 elementor-widget elementor-widget-text-editor" data-id="774b677" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      Ready to Take Control of Your Crypto?
                                    </div>
                                  </div>
                                  <div className="elementor-element elementor-element-9db2b7c elementor-widget elementor-widget-text-editor" data-id="9db2b7c" data-element_type="widget" data-widget_type="text-editor.default" >
                                    <div className="elementor-widget-container" >
                                      The Toka Wallet lets you store your private keys on your
                                      card while maintaining easy access to them. </div>
                                  </div>Sign up for Blockvault Wallet today and start managing, securing, and growing your digital assets with confidence. Experience seamless transactions, top-notch security, and a wide range of features designed to help you succeed in the world of cryptocurrency. Take action now and unlock the future of finance!

                                  <div className="elementor-element elementor-element-c92040a elementor-tablet-align-center elementor-align-center elementor-widget elementor-widget-button" data-id="c92040a" data-element_type="widget" data-widget_type="button.default" >
                                    <div className="elementor-widget-container" >
                                      <div className="elementor-button-wrapper" >
                                        <Link className="elementor-button elementor-button-link elementor-size-xl elementor-animation-float" to="/auth/signup" >
                                          <span className="elementor-button-content-wrapper">
                                            <span className="elementor-button-text">Start
                                              now</span>
                                          </span>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>{/* .entry-content */}
            </div>{/* .post-inner */}
            <div className="section-inner clearfix" />{/* .section-inner */}
          </article>{/* .post */}
        </main>{/* #site-content */}
        <footer id="site-footer" className="nav-white-desktop" role="contentinfo">
          <div id="footer-wave" />
          <div className="footer-bg" >
            <div className="footer-inner container-xl" >
              <div className="footer-top" >
                <div className="row" >
                  <div className="ft-col-1 col-sm-12 col-lg-4" >
                    <div className="widget widget_text" >
                      <div className="widget-content" >
                        <div className="textwidget" >
                          <h4><img src={LogoNew} style={{ width: "80px" }} alt="" /></h4>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ft-col-2 col-sm-12 col-lg-4" >
                    <div className="widget widget_text" >
                      <div className="widget-content" >
                        <h4 className="widget-title">Contact Us</h4>
                        <div className="textwidget" >
                          <p>Place de La Defense, Puteaux, 92400</p>
                          <p><a href="mailto:support@blockvault.pro" >support@blockvault.pro</a></p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="footer-bottom" >
                <div className="footer-credits" >
                  <p className="footer-copyright">Copyright ©2025 Blockvault. All rights reserved.
                  </p>{/* .footer-copyright */}
                </div>{/* .footer-credits */}

              </div>{/* .footer-bottom  */}
            </div>{/* .footer-inner */}
          </div>
        </footer>{/* #site-footer */}
      </div>
      <div id="google_translate_element"></div>

    </div>

  );
};

export default Home;
