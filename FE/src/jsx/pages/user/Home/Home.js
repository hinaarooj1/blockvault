
// Home Page CSS - Imported from assets
import './assets/post-3.css'
import './assets/e-animation-shrink.min.css'
import './assets/e-swiper.min.css'
// import './assets/elementor-icons.min.css' // Commented - requires font files
import './assets/fontawesome.min.css'
import './home-latest.css'
import './assets/frontend.min.css'
import './assets/lexend.css'
import './assets/motion-fx.min.css'
import './assets/post-582.css'
import './assets/post-6.css'
import './assets/post-634.css'
import './assets/questrial.css'
import './assets/style.css'
import './assets/theme.min.css'
import './assets/widget-counter.min.css'
import './assets/widget-divider.min.css'
import './assets/widget-form.min.css'
import './assets/widget-heading.min.css'
import './assets/widget-icon-list.min.css'
import './assets/widget-image-box.min.css'
import './assets/widget-image.min.css'
import './assets/widget-nav-menu.min.css'
import './assets/widget-price-list.min.css'
import './assets/widget-slides.min.css'
import './assets/widget-spacer.min.css'
import './assets/widget-text-editor.min.css'
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.css";
import "./style.css";
import LogoNew from '../../../../assets/newlogo/logo-home.png'
// Home Page Images - Imported from assets
import Logo from './assets/images/Logo-1024x265.png'
import Logo300 from './assets/images/Logo-300x78.png'
import Logo768 from './assets/images/Logo-768x199.png'
import Logo800 from './assets/images/Logo-800x207.png'
import LogoFull from './assets/images/Logo.png'
import Group654 from './assets/images/Group-654@2x.png'
import Group654Small from './assets/images/Group-654@2x-297x300.png'
import CoinHome03 from './assets/images/coinonehome03-1024x992.png'
import CoinHome03_300 from './assets/images/coinonehome03-300x291.png'
import CoinHome03_768 from './assets/images/coinonehome03-768x744.png'
import CoinHome03_800 from './assets/images/coinonehome03-800x775.png'
import CoinHome03Full from './assets/images/coinonehome03.png'
import Cards from './assets/images/Cards.png'
import Cards300 from './assets/images/Cards-300x300.png'
import Cards150 from './assets/images/Cards-150x150.png'
import Bag from './assets/images/Bag.png'
import Bag300 from './assets/images/Bag-300x300.png'
import Bag150 from './assets/images/Bag-150x150.png'
import Safety from './assets/images/Safety.png'
import Safety300 from './assets/images/Safety-300x300.png'
import Safety150 from './assets/images/Safety-150x150.png'
import CoinHome010 from './assets/images/coinonehome010.png'
import CoinHome010_300 from './assets/images/coinonehome010-300x89.png'
import CoinHome09 from './assets/images/coinonehome09.png'
import CoinHome09_300 from './assets/images/coinonehome09-300x89.png'
import CoinHome011 from './assets/images/coinonehome011.png'
import CoinHome07 from './assets/images/coinonehome07-1024x697.png'
import CoinHome07_300 from './assets/images/coinonehome07-300x204.png'
import CoinHome07_768 from './assets/images/coinonehome07-768x523.png'
import CoinHome07_800 from './assets/images/coinonehome07-800x545.png'
import CoinHome07Full from './assets/images/coinonehome07.png'
import CoinIcon02 from './assets/images/coinoneicon02.png'
import CoinIcon03 from './assets/images/coinoneicon03.png'
import CoinIcon06 from './assets/images/coinoneicon06.png'
import CoinHome021 from './assets/images/coinonehome021.jpg'
import CoinHome021_300 from './assets/images/coinonehome021-300x300.jpg'
import CoinHome021_150 from './assets/images/coinonehome021-150x150.jpg'
import CoinHome021_768 from './assets/images/coinonehome021-768x768.jpg'
import CoinHome021_800 from './assets/images/coinonehome021-800x800.jpg'
import Monitoring from './assets/images/Monitoring.png'
import Monitoring300 from './assets/images/Monitoring-300x300.png'
import Monitoring150 from './assets/images/Monitoring-150x150.png'
import SelectIcon from './assets/images/Select.png'
import Settings from './assets/images/Settings.png'
import Settings300 from './assets/images/Settings-300x300.png'
import Settings150 from './assets/images/Settings-150x150.png'
import CoinHome029 from './assets/images/coinonehome029-1024x838.png'
import CoinHome029_300 from './assets/images/coinonehome029-300x246.png'
import CoinHome029_768 from './assets/images/coinonehome029-768x629.png'
import CoinHome029_800 from './assets/images/coinonehome029-800x655.png'
import CoinHome029Full from './assets/images/coinonehome029.png'
import CoinHome030 from './assets/images/coinonehome030.png'
import CoinHome030_300 from './assets/images/coinonehome030-300x146.png'
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
import { useAuthUser } from 'react-auth-kit'
const Home = () => {
  let user = useAuthUser()
  return (
    <div className="hompg homepaag">
      <div data-elementor-type="header" data-elementor-id={634} className="elementor elementor-634 elementor-location-header" data-elementor-post-type="elementor_library" bis_skin_checked={1}>
        <section className="elementor-section elementor-top-section elementor-element elementor-element-aabb6c8 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="aabb6c8" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
          <div className="elementor-container elementor-column-gap-default ammajjd" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-b768278" data-id="b768278" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-element elementor-element-5e03de4 elementor-widget elementor-widget-image" data-id="5e03de4" data-element_type="widget" data-widget_type="image.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <img fetchpriority="high" style={{width:"100px", borderRadius:"10px"}}   src={LogoNew} className="attachment-large size-large wp-image-613" alt  />
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-column  elementor-hidden-phone elementor-col-33 elementor-top-column elementor-element elementor-element-0766e43" data-id="0766e43" data-element_type="column" bis_skin_checked={1}>
            </div>
            <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-7b48a59 elementor-hidden-tablet" data-id="7b48a59" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-b59c7b3 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="b59c7b3" data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default " bis_skin_checked={1}>
                    {!user() ? (
                      <>
                        <div className="elementor-column  elementor-hidden-phone elementor-col-50 elementor-inner-column elementor-element elementor-element-7c6da81" data-id="7c6da81" data-element_type="column" bis_skin_checked={1}>
                          <div className="elementor-widget-wrap elementor-element-populated" style={{ width: "max-content" }} bis_skin_checked={1}>
                            <div className="elementor-element elementor-element-cc7529d elementor-align-justify elementor-widget elementor-widget-button" data-id="cc7529d" data-element_type="widget" data-widget_type="button.default" bis_skin_checked={1}>
                              <div className="elementor-widget-container" bis_skin_checked={1}>
                                <div className="elementor-button-wrapper" bis_skin_checked={1}>
                                  <Link className="elementor-button elementor-button-link elementor-size-sm" to="/auth/signup">
                                    <span className="elementor-button-content-wrapper">
                                      <span className="elementor-button-text">Sign Up</span>
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-6515f55" data-id="6515f55" data-element_type="column" bis_skin_checked={1}>
                          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                            <div className="elementor-element elementor-element-050c9e1 elementor-align-right elementor-widget elementor-widget-button" data-id="050c9e1" data-element_type="widget" data-widget_type="button.default" bis_skin_checked={1}>
                              <div className="elementor-widget-container" bis_skin_checked={1}>
                                <div className="elementor-button-wrapper" bis_skin_checked={1}>
                                  <Link className="elementor-button elementor-button-link elementor-size-sm" to="/auth/login">
                                    <span className="elementor-button-content-wrapper">
                                      <span className="elementor-button-text">Login</span>
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : user()?.user?.role === "user" ? (
                      <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-6515f55" data-id="6515f55" data-element_type="column" bis_skin_checked={1}>
                        <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                          <div className="elementor-element elementor-element-050c9e1 elementor-align-right elementor-widget elementor-widget-button" data-id="050c9e1" data-element_type="widget" data-widget_type="button.default" bis_skin_checked={1}>
                            <div className="elementor-widget-container" bis_skin_checked={1}>
                              <div className="elementor-button-wrapper" bis_skin_checked={1}>
                                <Link className="elementor-button elementor-button-link elementor-size-sm" to="/dashboard">
                                  <span className="elementor-button-content-wrapper">
                                    <span className="elementor-button-text">Dashboard</span>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-6515f55" data-id="6515f55" data-element_type="column" bis_skin_checked={1}>
                        <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                          <div className="elementor-element elementor-element-050c9e1 elementor-align-right elementor-widget elementor-widget-button" data-id="050c9e1" data-element_type="widget" data-widget_type="button.default" bis_skin_checked={1}>
                            <div className="elementor-widget-container" bis_skin_checked={1}>
                              <div className="elementor-button-wrapper" bis_skin_checked={1}>
                                <Link className="elementor-button elementor-button-link elementor-size-sm" to="/admin/dashboard">
                                  <span className="elementor-button-content-wrapper">
                                    <span className="elementor-button-text">Dashboard</span>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div data-elementor-type="wp-page" data-elementor-id={6} className="elementor elementor-6" data-elementor-post-type="page" bis_skin_checked={1}>
        <section className="elementor-section elementor-top-section elementor-element elementor-element-b63fbaf elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-id="b63fbaf" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
          <div className="elementor-background-overlay" bis_skin_checked={1} />
          <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-be0fa84" data-id="be0fa84" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-element elementor-element-d2f17fb elementor-widget elementor-widget-heading animated fadeIn" data-id="d2f17fb" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:200}" data-widget_type="heading.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <h1 className="elementor-heading-title elementor-size-default"> Exchange & <br/> non-custodial wallet </h1>
                  </div>
                </div>
                <div className="elementor-element elementor-element-f5bc79d elementor-widget elementor-widget-heading animated fadeIn" data-id="f5bc79d" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:400}" data-widget_type="heading.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <h1 className="elementor-heading-title elementor-size-default"></h1>
                  </div>
                </div>
                <div className="elementor-element elementor-element-06a5288 elementor-widget elementor-widget-heading animated fadeIn" data-id="06a5288" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:600}" data-widget_type="heading.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <h5 className="elementor-heading-title elementor-size-default">Trade. Store. Grow Your Crypto — All in One Place.</h5>
                  </div>
                </div>
                <div className="elementor-element elementor-element-deafccb elementor-widget elementor-widget-button animated fadeIn" data-id="deafccb" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:800}" data-widget_type="button.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <div className="elementor-button-wrapper" bis_skin_checked={1}>
                      <Link className="elementor-button elementor-button-link elementor-size-sm"  to="/auth/signup">
                        <span className="elementor-button-content-wrapper">
                          <span className="elementor-button-text">Start Now</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-a6d8c60" data-id="a6d8c60" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-element elementor-element-e03dc75 elementor-widget elementor-widget-image elementor-motion-effects-parent animated fadeIn" data-id="e03dc75" data-element_type="widget" data-settings="{&quot;motion_fx_motion_fx_mouse&quot;:&quot;yes&quot;,&quot;motion_fx_mouseTrack_effect&quot;:&quot;yes&quot;,&quot;motion_fx_mouseTrack_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0.20000000000000001,&quot;sizes&quot;:[]},&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:200}" data-widget_type="image.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container elementor-motion-effects-element" bis_skin_checked={1}  >
                    <img decoding="async" width={399} height={403} src={Group654} className="attachment-large size-large wp-image-119" alt="" srcSet={`${Group654} 399w, ${Group654Small} 297w`} sizes="(max-width: 399px) 100vw, 399px" />
                  </div>
                </div>
                <div className="elementor-element elementor-element-93685ed elementor-widget elementor-widget-image animated fadeIn" data-id="93685ed" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:400}" data-widget_type="image.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <img decoding="async" width={800} height={775} src={CoinHome03} className="attachment-large size-large wp-image-94" alt="" srcSet={`${CoinHome03} 1024w, ${CoinHome03_300} 300w, ${CoinHome03_768} 768w, ${CoinHome03_800} 800w, ${CoinHome03Full} 1115w`} sizes="(max-width: 800px) 100vw, 800px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="elementor-section elementor-top-section elementor-element elementor-element-b30fbaa elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="b30fbaa" data-element_type="section">
          <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-fadb85a animated fadeIn" data-id="fadb85a" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-background-overlay" bis_skin_checked={1} />
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-c33f4f9 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="c33f4f9" data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
                    <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-9c37018" data-id="9c37018" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap" bis_skin_checked={1}>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-6c8ddc5 animated fadeIn" data-id="6c8ddc5" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-background-overlay" bis_skin_checked={1} />
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-e68afd8 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="e68afd8" data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
                    <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-dd33d6a" data-id="dd33d6a" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap" bis_skin_checked={1}>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-6c2c6d1 animated fadeIn" data-id="6c2c6d1" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-background-overlay" bis_skin_checked={1} />
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-881e7be elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="881e7be" data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
                    <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-62fb430" data-id="62fb430" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap" bis_skin_checked={1}>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
        <section className="elementor-section elementor-top-section elementor-element elementor-element-8e33f15 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="8e33f15" data-element_type="section">
          <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-a4efbc9" data-id="a4efbc9" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-element elementor-element-351838d elementor-widget elementor-widget-heading" data-id="351838d" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <h3 className="elementor-heading-title elementor-size-default">Refer a Friend </h3>
                  </div>
                </div>
                <div className="elementor-element elementor-element-cee0870 elementor-widget elementor-widget-text-editor" data-id="cee0870" data-element_type="widget" data-widget_type="text-editor.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <p>Refer a Friend and Get 100 USDT Trading Fee Credit.</p>
                  </div>
                </div>
                <div className="elementor-element elementor-element-6f99068 elementor-widget elementor-widget-button animated fadeIn" data-id="6f99068" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:800}" data-widget_type="button.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <div className="elementor-button-wrapper" bis_skin_checked={1}>
                      <Link className="elementor-button elementor-button-link elementor-size-sm" to="/auth/signup">
                        <span className="elementor-button-content-wrapper">
                          <span className="elementor-button-text">Get Started</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-48d5339" data-id="48d5339" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap" bis_skin_checked={1}>
              </div>
            </div>
          </div>
        </section>
        <section className="elementor-section elementor-top-section elementor-element elementor-element-72297b4 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="72297b4" data-element_type="section">
          <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-3a79e10" data-id="3a79e10" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-element elementor-element-3cd3267 elementor-widget elementor-widget-heading animated fadeInUp" data-id="3cd3267" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:200}" data-widget_type="heading.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <h2 className="elementor-heading-title elementor-size-default">Core Services</h2>
                  </div>
                </div>
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-ef38b02 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="ef38b02" data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
                    <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-7dadf13 animated fadeIn" data-id="7dadf13" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-background-overlay" bis_skin_checked={1} />
                        <div className="elementor-element elementor-element-668067d elementor-position-left elementor-vertical-align-bottom elementor-widget elementor-widget-image-box" data-id="668067d" data-element_type="widget" data-widget_type="image-box.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <div className="elementor-image-box-wrapper" bis_skin_checked={1}>
                              <figure className="elementor-image-box-img"><img loading="lazy" decoding="async" width={512} height={512} src={Cards} className="attachment-full size-full wp-image-238" alt="" srcSet={`${Cards} 512w, ${Cards300} 300w, ${Cards150} 150w`} sizes="(max-width: 512px) 100vw, 512px" /></figure>
                              <div className="elementor-image-box-content" bis_skin_checked={1}>
                                <h3 className="elementor-image-box-title">Exchange Platform</h3>
                                <p className="elementor-image-box-description">Buy, sell, or swap cryptocurrencies in real time with transparent pricing, advanced charting tools, and reliable performance.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-39bba48 animated fadeIn" data-id="39bba48" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:400}" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-background-overlay" bis_skin_checked={1} />
                        <div className="elementor-element elementor-element-f454171 elementor-position-left elementor-vertical-align-bottom elementor-widget elementor-widget-image-box" data-id="f454171" data-element_type="widget" data-widget_type="image-box.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <div className="elementor-image-box-wrapper" bis_skin_checked={1}>
                              <figure className="elementor-image-box-img"><img loading="lazy" decoding="async" width={512} height={512} src={Bag} className="attachment-full size-full wp-image-234" alt="" srcSet={`${Bag} 512w, ${Bag300} 300w, ${Bag150} 150w`} sizes="(max-width: 512px) 100vw, 512px" /></figure>
                              <div className="elementor-image-box-content" bis_skin_checked={1}>
                                <h3 className="elementor-image-box-title">Smart Wallet</h3>
                                <p className="elementor-image-box-description">Securely store, send, and receive crypto assets. You control the keys, we provide the seamless interface.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-cd57fa5 elementor-hidden-tablet animated fadeIn" data-id="cd57fa5" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:600}" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-background-overlay" bis_skin_checked={1} />
                        <div className="elementor-element elementor-element-77876f5 elementor-position-left elementor-vertical-align-bottom elementor-widget elementor-widget-image-box" data-id="77876f5" data-element_type="widget" data-widget_type="image-box.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <div className="elementor-image-box-wrapper" bis_skin_checked={1}>
                              <figure className="elementor-image-box-img"><img loading="lazy" decoding="async" width={512} height={512} src={Safety} className="attachment-full size-full wp-image-250" alt="" srcSet={`${Safety} 512w, ${Safety300} 300w, ${Safety150} 150w`} sizes="(max-width: 512px) 100vw, 512px" /></figure>
                              <div className="elementor-image-box-content" bis_skin_checked={1}>
                                <h3 className="elementor-image-box-title">Staking & Earn</h3>
                                <p className="elementor-image-box-description">Grow your portfolio automatically. Stake top tokens and earn passive rewards every day.
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
        <section className="elementor-section elementor-top-section elementor-element elementor-element-38deae4 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="38deae4" data-element_type="section">
          <div className="elementor-background-overlay" bis_skin_checked={1} />
          <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-6172c17" data-id="6172c17" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-element elementor-element-c1bcbb8 elementor-widget elementor-widget-heading" data-id="c1bcbb8" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <h2 className="elementor-heading-title elementor-size-default">
Extra Features</h2>
                  </div>
                </div>
                 
                <div className="elementor-element elementor-element-9557597 elementor-widget elementor-widget-text-editor" data-id={9557597} data-element_type="widget" data-widget_type="text-editor.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <p>Live charts, analytics and performance tracking. 24/7 Support: Get instant help. Designed for both individual traders and corporate clients.</p>
                  </div>
                </div>
                <div className="elementor-element elementor-element-ea3e871 elementor-widget elementor-widget-heading" data-id="ea3e871" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <h6 className="elementor-heading-title elementor-size-default">Download our platfom on </h6>
                  </div>
                </div>
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-c019f0f elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="c019f0f" data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
                    <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-31af91a" data-id="31af91a" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-59a2e34 elementor-widget elementor-widget-image" data-id="59a2e34" data-element_type="widget" data-widget_type="image.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <img loading="lazy" decoding="async" width={592} height={175} src={CoinHome010} className="elementor-animation-shrink attachment-large size-large wp-image-332" alt="" srcSet={`${CoinHome010} 592w, ${CoinHome010_300} 300w`} sizes="(max-width: 592px) 100vw, 592px" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-a97004b" data-id="a97004b" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-a4a2195 elementor-widget elementor-widget-image" data-id="a4a2195" data-element_type="widget" data-widget_type="image.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <img loading="lazy" decoding="async" width={592} height={175} src={CoinHome09} className="elementor-animation-shrink attachment-large size-large wp-image-331" alt="" srcSet={`${CoinHome09} 592w, ${CoinHome09_300} 300w`} sizes="(max-width: 592px) 100vw, 592px" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-5f2e5fe" data-id="5f2e5fe" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-02a4447 elementor-widget elementor-widget-image" data-id="02a4447" data-element_type="widget" data-widget_type="image.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <img loading="lazy" decoding="async" width={234} height={68} src={CoinHome011} className="elementor-animation-shrink attachment-large size-large wp-image-336" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-34cff6d" data-id="34cff6d" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-element elementor-element-face4bc elementor-widget elementor-widget-image" data-id="face4bc" data-element_type="widget" data-widget_type="image.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    {/* <img loading="lazy" decoding="async" width={800} height={545} src={CoinHome07} className="attachment-large size-large wp-image-309" alt="" srcSet={`${CoinHome07} 1024w, ${CoinHome07_300} 300w, ${CoinHome07_768} 768w, ${CoinHome07_800} 800w, ${CoinHome07Full} 1200w`} sizes="(max-width: 800px) 100vw, 800px" /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="elementor-section elementor-top-section elementor-element elementor-element-3ef3e61 elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-id="3ef3e61" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
          <div className="elementor-background-overlay" bis_skin_checked={1} />
          <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-0a2bed7" data-id="0a2bed7" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated e-swiper-container" bis_skin_checked={1}>
                <div className="elementor-element elementor-element-1a1e3e6 elementor--h-position-left elementor--v-position-middle elementor-pagination-position-inside elementor-widget elementor-widget-slides e-widget-swiper" data-id="1a1e3e6" data-element_type="widget" data-settings="{&quot;navigation&quot;:&quot;dots&quot;,&quot;autoplay_speed&quot;:4000,&quot;autoplay&quot;:&quot;yes&quot;,&quot;pause_on_hover&quot;:&quot;yes&quot;,&quot;pause_on_interaction&quot;:&quot;yes&quot;,&quot;infinite&quot;:&quot;yes&quot;,&quot;transition&quot;:&quot;slide&quot;,&quot;transition_speed&quot;:500}" data-widget_type="slides.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <div className="elementor-swiper" bis_skin_checked={1}>
                      <div className="elementor-slides-wrapper elementor-main-swiper swiper swiper-initialized swiper-horizontal swiper-pointer-events" role="region" aria-roledescription="carousel" aria-label="Slides" dir="ltr" data-animation="fadeInUp" bis_skin_checked={1}>
                        <div className="swiper-wrapper elementor-slides" bis_skin_checked={1} id="swiper-wrapper-ea94b83203ee34c9" aria-live="off" style={{ cursor: 'grab', transitionDuration: '0ms', transform: 'translate3d(-4060px, 0px, 0px)' }}><div className="elementor-repeater-item-707fc82 swiper-slide swiper-slide-duplicate" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={0} style={{ width: '580px' }} aria-label="1 / 4">
                          <div className="swiper-slide-bg" role="img" bis_skin_checked={1} />
                          <div className="swiper-slide-inner" bis_skin_checked={1}>
                            <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                          </div>
                        </div><div className="elementor-repeater-item-1b4bfeb swiper-slide swiper-slide-duplicate" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={1} style={{ width: '580px' }} aria-label="2 / 4">
                            <div className="swiper-slide-bg" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div><div className="elementor-repeater-item-aeaec7e swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={2} style={{ width: '580px' }} aria-label="3 / 4">
                            <div className="swiper-slide-bg" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div><div className="elementor-repeater-item-d2e04e3 swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={3} style={{ width: '580px' }} aria-label="4 / 4">
                            <div className="swiper-slide-bg elementor-ken-burns--active" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div>
                          <div className="elementor-repeater-item-707fc82 swiper-slide swiper-slide-duplicate-next" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={0} style={{ width: '580px' }} aria-label="1 / 4">
                            <div className="swiper-slide-bg" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div>
                          <div className="elementor-repeater-item-1b4bfeb swiper-slide" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={1} style={{ width: '580px' }} aria-label="2 / 4">
                            <div className="swiper-slide-bg" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div>
                          <div className="elementor-repeater-item-aeaec7e swiper-slide swiper-slide-prev" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={2} style={{ width: '580px' }} aria-label="3 / 4">
                            <div className="swiper-slide-bg" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div>
                          <div className="elementor-repeater-item-d2e04e3 swiper-slide swiper-slide-active" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={3} style={{ width: '580px' }} aria-label="4 / 4">
                            <div className="swiper-slide-bg elementor-ken-burns--active" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div>
                          <div className="elementor-repeater-item-707fc82 swiper-slide swiper-slide-duplicate swiper-slide-next" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={0} style={{ width: '580px' }} aria-label="1 / 4">
                            <div className="swiper-slide-bg" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div><div className="elementor-repeater-item-1b4bfeb swiper-slide swiper-slide-duplicate" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={1} style={{ width: '580px' }} aria-label="2 / 4">
                            <div className="swiper-slide-bg" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div><div className="elementor-repeater-item-aeaec7e swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={2} style={{ width: '580px' }} aria-label="3 / 4">
                            <div className="swiper-slide-bg" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div><div className="elementor-repeater-item-d2e04e3 swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active" role="group" aria-roledescription="slide" bis_skin_checked={1} data-swiper-slide-index={3} style={{ width: '580px' }} aria-label="4 / 4">
                            <div className="swiper-slide-bg elementor-ken-burns--active" role="img" bis_skin_checked={1} />
                            <div className="swiper-slide-inner" bis_skin_checked={1}>
                              <div className="swiper-slide-contents animated fadeInUp" bis_skin_checked={1} style={{}} />
                            </div>
                          </div></div>
                        <div className="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal" bis_skin_checked={1}><span className="swiper-pagination-bullet" tabIndex={0} role="button" aria-label="Go to slide 1" /><span className="swiper-pagination-bullet" tabIndex={0} role="button" aria-label="Go to slide 2" /><span className="swiper-pagination-bullet" tabIndex={0} role="button" aria-label="Go to slide 3" /><span className="swiper-pagination-bullet swiper-pagination-bullet-active" tabIndex={0} role="button" aria-label="Go to slide 4" aria-current="true" /></div>
                        <span className="swiper-notification" aria-live="assertive" aria-atomic="true" />
                        <span className="swiper-notification" aria-live="assertive" aria-atomic="true" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-99e6575" data-id="99e6575" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-element elementor-element-be6d41b elementor-widget elementor-widget-heading" data-id="be6d41b" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <h2 className="elementor-heading-title elementor-size-default">Control your </h2>
                  </div>
                </div>
                <div className="elementor-element elementor-element-0acfef2 elementor-widget elementor-widget-heading" data-id="0acfef2" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <h2 className="elementor-heading-title elementor-size-default">Crypto journey</h2>
                  </div>
                </div>
                
                <div className="elementor-element elementor-element-86544f1 elementor-widget elementor-widget-price-list" data-id="86544f1" data-element_type="widget" data-widget_type="price-list.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <ul className="elementor-price-list">
                      <li><a className="elementor-price-list-item" href="#">
                        <div className="elementor-price-list-image" bis_skin_checked={1}>
                          <img decoding="async" src={CoinIcon02} alt="Manage  Crypto" loading="lazy" />
                        </div>
                        <div className="elementor-price-list-text" bis_skin_checked={1}>
                        
                          <p className="elementor-price-list-description">
                           Stake top tokens and earn passive rewards every day.</p>
                        </div>
                      </a></li>
                      <li><a className="elementor-price-list-item" href="#">
                        <div className="elementor-price-list-image" bis_skin_checked={1}>
                          <img decoding="async" src={CoinIcon03} alt="Mobile Apps" loading="lazy" />
                        </div>
                        <div className="elementor-price-list-text" bis_skin_checked={1}>
                          
                          <p className="elementor-price-list-description">
                         Swap Crypto assets cross-chain with ease. </p>
                        </div>
                      </a></li>
                      <li><a className="elementor-price-list-item" href="#">
                        <div className="elementor-price-list-image" bis_skin_checked={1}>
                          <img decoding="async" src={CoinIcon06} alt="Capital Market" loading="lazy" />
                        </div>
                        <div className="elementor-price-list-text" bis_skin_checked={1}>
                          
                          <p className="elementor-price-list-description">
                           Deposit using card, bank transfer or stablecoins. </p>
                        </div>
                      </a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        
        <section className="elementor-section elementor-top-section elementor-element elementor-element-7013a27 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="7013a27" data-element_type="section">
          <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-cd3d05d animated fadeIn" data-id="cd3d05d" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-background-overlay" bis_skin_checked={1} />
                <div className="elementor-element elementor-element-d8546c8 elementor-widget elementor-widget-heading" data-id="d8546c8" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <h2 className="elementor-heading-title elementor-size-default">Trusted crypto<br /> platform</h2>
                  </div>
                </div>
                <div className="elementor-element elementor-element-8cc8df8 elementor-widget elementor-widget-text-editor" data-id="8cc8df8" data-element_type="widget" data-widget_type="text-editor.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <p>Trade, earn, and store your assets with confidence. Our platform delivers institutional-grade security and lightning execution speeds.</p>
                  </div>
                </div>
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-9089766 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id={9089766} data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-26dbefd" data-id="26dbefd" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-4851e29 elementor-widget elementor-widget-image" data-id="4851e29" data-element_type="widget" data-widget_type="image.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <img loading="lazy" decoding="async" width={592} height={175} src={CoinHome010} className="elementor-animation-shrink attachment-large size-large wp-image-332" alt="" srcSet={`${CoinHome010} 592w, ${CoinHome010_300} 300w`} sizes="(max-width: 592px) 100vw, 592px" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-21163d2" data-id="21163d2" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-91d6081 elementor-widget elementor-widget-image" data-id="91d6081" data-element_type="widget" data-widget_type="image.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <img loading="lazy" decoding="async" width={592} height={175} src={CoinHome09} className="elementor-animation-shrink attachment-large size-large wp-image-331" alt="" srcSet={`${CoinHome09} 592w, ${CoinHome09_300} 300w`} sizes="(max-width: 592px) 100vw, 592px" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-1b68880" data-id="1b68880" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-9a22afe elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="9a22afe" data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-b8a2467 animated fadeIn" data-id="b8a2467" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:400}" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-6753513 elementor-position-top elementor-widget elementor-widget-image-box" data-id={6753513} data-element_type="widget" data-widget_type="image-box.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <div className="elementor-image-box-wrapper" bis_skin_checked={1}>
                              <figure className="elementor-image-box-img"><img decoding="async" src={Safety} title="Safety" alt="Safety" loading="lazy" /></figure>
                              <div className="elementor-image-box-content" bis_skin_checked={1}>
                                <h3 className="elementor-image-box-title">Safe and Secure</h3>
                                <p className="elementor-image-box-description">Your funds, your control. We use multi-layer encryption and decentralized storage to protect every transaction.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-074ff8c animated fadeIn" data-id="074ff8c" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:600}" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-2f920fc elementor-position-top elementor-widget elementor-widget-image-box" data-id="2f920fc" data-element_type="widget" data-widget_type="image-box.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <div className="elementor-image-box-wrapper" bis_skin_checked={1}>
                              <figure className="elementor-image-box-img"><img loading="lazy" decoding="async" width={512} height={512} src={Monitoring} className="attachment-full size-full wp-image-246" alt="" srcSet={`${Monitoring} 512w, ${Monitoring300} 300w, ${Monitoring150} 150w`} sizes="(max-width: 512px) 100vw, 512px" /></figure>
                              <div className="elementor-image-box-content" bis_skin_checked={1}>
                                <h3 className="elementor-image-box-title">Real-time Data</h3>
                                <p className="elementor-image-box-description">Access live market prices, volume trends, and analytics — updated every second for smarter trading decisions.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-87e6d17 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="87e6d17" data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-b1b321a animated fadeIn" data-id="b1b321a" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:800}" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-ba1aa31 elementor-position-top elementor-widget elementor-widget-image-box" data-id="ba1aa31" data-element_type="widget" data-widget_type="image-box.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <div className="elementor-image-box-wrapper" bis_skin_checked={1}>
                              <figure className="elementor-image-box-img"><img decoding="async" src={SelectIcon} title="Select" alt="Select" loading="lazy" /></figure>
                              <div className="elementor-image-box-content" bis_skin_checked={1}>
                                <h3 className="elementor-image-box-title">Track Profit</h3>
                                <p className="elementor-image-box-description">Monitor your holdings and trading performance with automated profit/loss reports and portfolio insights.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-0a818a0 animated fadeIn" data-id="0a818a0" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:1000}" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-c6f250e elementor-position-top elementor-widget elementor-widget-image-box" data-id="c6f250e" data-element_type="widget" data-widget_type="image-box.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <div className="elementor-image-box-wrapper" bis_skin_checked={1}>
                              <figure className="elementor-image-box-img"><img loading="lazy" decoding="async" width={512} height={512} src={Settings} className="attachment-full size-full wp-image-252" alt="" srcSet={`${Settings} 512w, ${Settings300} 300w, ${Settings150} 150w`} sizes="(max-width: 512px) 100vw, 512px" /></figure>
                              <div className="elementor-image-box-content" bis_skin_checked={1}>
                                <h3 className="elementor-image-box-title">Customizable Charts</h3>
                                <p className="elementor-image-box-description">Tailor your trading view with advanced chart tools, indicators, and multi-asset comparisons for a personalized experience.</p>
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

      <div data-elementor-type="footer" data-elementor-id={582} className="elementor elementor-582 elementor-location-footer" data-elementor-post-type="elementor_library" bis_skin_checked={1}>
        <section className="elementor-section elementor-top-section elementor-element elementor-element-f5c7696 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="f5c7696" data-element_type="section">
          <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-b6c1931" data-id="b6c1931" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-731a3d4 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="731a3d4" data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
                    <div className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-8d87f94" data-id="8d87f94" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-0851529 elementor-widget elementor-widget-heading animated fadeInUp" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:200}" data-widget_type="heading.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <h2 className="elementor-heading-title elementor-size-default">Be part of the future</h2>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-83d1b7a elementor-widget elementor-widget-heading animated fadeInUp" data-id="83d1b7a" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}" data-widget_type="heading.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <h6 className="elementor-heading-title elementor-size-default">thousands of crypto pioneers are already trading, earning, and building with us every day.</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-7760c54" data-id="7760c54" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-52c232d elementor-widget elementor-widget-image animated fadeInUp" data-id="52c232d" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:200}" data-widget_type="image.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <img width={592} height={175} src={CoinHome010} className="elementor-animation-shrink attachment-large size-large wp-image-332" alt="" srcSet={`${CoinHome010} 592w, ${CoinHome010_300} 300w`} sizes="(max-width: 592px) 100vw, 592px" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-66457a1" data-id="66457a1" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-e4d5c6c elementor-widget elementor-widget-image animated fadeInUp" data-id="e4d5c6c" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}" data-widget_type="image.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <img width={592} height={175} src={CoinHome09} className="elementor-animation-shrink attachment-large size-large wp-image-331" alt="" srcSet={`${CoinHome09} 592w, ${CoinHome09_300} 300w`} sizes="(max-width: 592px) 100vw, 592px" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-15801da elementor-hidden-phone" data-id="15801da" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-3f30b9c elementor-widget elementor-widget-image animated fadeInUp" data-id="3f30b9c" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:600}" data-widget_type="image.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <img width={234} height={68} src={CoinHome011} className="elementor-animation-shrink attachment-large size-large wp-image-336" alt="" />
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
        <section className="elementor-section elementor-top-section elementor-element elementor-element-54a2ebf elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="54a2ebf" data-element_type="section">
          <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-afba3d9" data-id="afba3d9" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;gradient&quot;}" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <section className="elementor-section elementor-inner-section elementor-element elementor-element-c8fce66 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="c8fce66" data-element_type="section">
                  <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-f318752" data-id="f318752" data-element_type="column" bis_skin_checked={1}>
                      <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                        <div className="elementor-element elementor-element-2fa9851 elementor-widget elementor-widget-image animated fadeIn" data-id="2fa9851" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:400}" data-widget_type="image.default" bis_skin_checked={1}>
                          <div className="elementor-widget-container" bis_skin_checked={1}>
                            <img width={800} height={655} src={CoinHome029} className="attachment-large size-large wp-image-591" alt="" srcSet={`${CoinHome029} 1024w, ${CoinHome029_300} 300w, ${CoinHome029_768} 768w, ${CoinHome029_800} 800w, ${CoinHome029Full} 1250w`} sizes="(max-width: 800px) 100vw, 800px" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-53ad710" data-id="53ad710" data-element_type="column" bis_skin_checked={1}>
                      
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
        <section className="elementor-section elementor-top-section elementor-element elementor-element-6445f69 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="6445f69" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
          <div className="elementor-container elementor-column-gap-default" bis_skin_checked={1}>
            <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-61906ae" data-id="61906ae" data-element_type="column" bis_skin_checked={1}>
              <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked={1}>
                <div className="elementor-element elementor-element-85102d6 elementor-widget elementor-widget-image animated fadeInUp" data-id="85102d6" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:100}" data-widget_type="image.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <img src={LogoNew} className="attachment-large size-large wp-image-613" alt=""   />
                  </div>
                </div>
                
                <div className="elementor-element elementor-element-2baed1f elementor-widget elementor-widget-image animated fadeInUp" data-id="2baed1f" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}" data-widget_type="image.default" bis_skin_checked={1}>
                  <div className="elementor-widget-container" bis_skin_checked={1}>
                    <img width={600} height={292} src={CoinHome030} className="attachment-large size-large wp-image-629" alt="" srcSet={`${CoinHome030} 600w, ${CoinHome030_300} 300w`} sizes="(max-width: 600px) 100vw, 600px" />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </section>
        
      </div>
    </div>

  );
};

export default Home;
