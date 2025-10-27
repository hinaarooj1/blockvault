import React, { useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  useEffect(() => {
    // Load necessary scripts
    const scripts = [
      '/home-js/jquery.min.js',
      '/home-js/jquery-migrate.min.js',
      '/home-js/imagesloaded.min.js',
      '/home-js/swiper.min.js',
      '/home-js/elementor-frontend.min.js'
    ];

    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });

    return () => {
      // Cleanup scripts on unmount
      scripts.forEach(src => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) script.remove();
      });
    };
  }, []);

  return (
    <div className="homepage-scoped">



  <a className="skip-link screen-reader-text" href="#content" bis_skin_checked="1">Skip to content</a>

  <div data-elementor-type="header" data-elementor-id="634" className="elementor elementor-634 elementor-location-header"
    data-elementor-post-type="elementor_library" bis_skin_checked="1">
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-aabb6c8 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="aabb6c8" data-element_type="section"
      data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-b768278"
          data-id="b768278" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div className="elementor-element elementor-element-5e03de4 elementor-widget elementor-widget-image"
              data-id="5e03de4" data-element_type="widget" data-widget_type="image.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <img fetchpriority="high" width="800" height="207"
                  src="/home-images/Logo-1024x265.png"
                  className="attachment-large size-large wp-image-613" alt=""
                  srcset="/home-images/Logo-1024x265.png 1024w, /home-images/Logo-300x78.png 300w, /home-images/Logo-768x199.png 768w, /home-images/Logo-800x207.png 800w, /home-images/Logo.png 1276w"
                  sizes="(max-width: 800px) 100vw, 800px" />
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-0766e43"
          data-id="0766e43" data-element_type="column" bis_skin_checked="1">
          
        </div>
        <div
          className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-7b48a59 elementor-hidden-tablet elementor-hidden-phone"
          data-id="7b48a59" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-b59c7b3 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="b59c7b3" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-7c6da81"
                  data-id="7c6da81" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-cc7529d elementor-align-justify elementor-widget elementor-widget-button"
                      data-id="cc7529d" data-element_type="widget" data-widget_type="button.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-button-wrapper" bis_skin_checked="1">
                          <a className="elementor-button elementor-button-link elementor-size-sm" href="#">
                            <span className="elementor-button-content-wrapper">
                              <span className="elementor-button-text">Sign Up</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-6515f55"
                  data-id="6515f55" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-050c9e1 elementor-align-right elementor-widget elementor-widget-button"
                      data-id="050c9e1" data-element_type="widget" data-widget_type="button.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-button-wrapper" bis_skin_checked="1">
                          <a className="elementor-button elementor-button-link elementor-size-sm" href="#">
                            <span className="elementor-button-content-wrapper">
                              <span className="elementor-button-text">Login</span>
                            </span>
                          </a>
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
  <div data-elementor-type="wp-page" data-elementor-id="6" className="elementor elementor-6" data-elementor-post-type="page"
    bis_skin_checked="1">
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-b63fbaf elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle"
      data-id="b63fbaf" data-element_type="section"
      data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
      <div className="elementor-background-overlay" bis_skin_checked="1"></div>
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-be0fa84"
          data-id="be0fa84" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-d2f17fb elementor-widget elementor-widget-heading animated fadeIn"
              data-id="d2f17fb" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:200}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h1 className="elementor-heading-title elementor-size-default">buy and sell </h1>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-f5bc79d elementor-widget elementor-widget-heading animated fadeIn"
              data-id="f5bc79d" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:400}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h1 className="elementor-heading-title elementor-size-default">Cryptocurrency</h1>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-06a5288 elementor-widget elementor-widget-heading animated fadeIn"
              data-id="06a5288" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:600}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h5 className="elementor-heading-title elementor-size-default">With our application platform. Sign up and
                  get started today.</h5>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-deafccb elementor-widget elementor-widget-button animated fadeIn"
              data-id="deafccb" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:800}"
              data-widget_type="button.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <div className="elementor-button-wrapper" bis_skin_checked="1">
                  <a className="elementor-button elementor-button-link elementor-size-sm" href="#">
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-text">Get Started</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-a6d8c60"
          data-id="a6d8c60" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-e03dc75 elementor-widget elementor-widget-image elementor-motion-effects-parent animated fadeIn"
              data-id="e03dc75" data-element_type="widget"
              data-settings="{&quot;motion_fx_motion_fx_mouse&quot;:&quot;yes&quot;,&quot;motion_fx_mouseTrack_effect&quot;:&quot;yes&quot;,&quot;motion_fx_mouseTrack_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0.20000000000000001,&quot;sizes&quot;:[]},&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:200}"
              data-widget_type="image.default" bis_skin_checked="1">
              <div className="elementor-widget-container elementor-motion-effects-element" bis_skin_checked="1"
                style={{'--translateX': '5.606850335070738px', '--translateY': '-2.3076923076923066px', transform: 'translateX(var(--translateX))translateY(var(--translateY))'}}>
                <img decoding="async" width="399" height="403"
                  src="/home-images/Group-654@2x.png"
                  className="attachment-large size-large wp-image-119" alt=""
                  srcset="/home-images/Group-654@2x.png 399w, /home-images/Group-654@2x-297x300.png 297w"
                  sizes="(max-width: 399px) 100vw, 399px" />
              </div>
            </div>
            <div
              className="elementor-element elementor-element-93685ed elementor-widget elementor-widget-image animated fadeIn"
              data-id="93685ed" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:400}"
              data-widget_type="image.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <img decoding="async" width="800" height="775"
                  src="/home-images/coinonehome03-1024x992.png"
                  className="attachment-large size-large wp-image-94" alt=""
                  srcset="/home-images/coinonehome03-1024x992.png 1024w, /home-images/coinonehome03-300x291.png 300w, /home-images/coinonehome03-768x744.png 768w, /home-images/coinonehome03-800x775.png 800w, /home-images/coinonehome03.png 1115w"
                  sizes="(max-width: 800px) 100vw, 800px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-b30fbaa elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="b30fbaa" data-element_type="section">
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div
          className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-fadb85a animated fadeIn"
          data-id="fadb85a" data-element_type="column"
          data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}"
          bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div className="elementor-background-overlay" bis_skin_checked="1"></div>
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-c33f4f9 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="c33f4f9" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-9c37018"
                  data-id="9c37018" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap" bis_skin_checked="1">
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div
          className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-6c8ddc5 animated fadeIn"
          data-id="6c8ddc5" data-element_type="column"
          data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}"
          bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div className="elementor-background-overlay" bis_skin_checked="1"></div>
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-e68afd8 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="e68afd8" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-dd33d6a"
                  data-id="dd33d6a" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap" bis_skin_checked="1">
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div
          className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-6c2c6d1 animated fadeIn"
          data-id="6c2c6d1" data-element_type="column"
          data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}"
          bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div className="elementor-background-overlay" bis_skin_checked="1"></div>
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-881e7be elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="881e7be" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-62fb430"
                  data-id="62fb430" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap" bis_skin_checked="1">
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-8e33f15 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="8e33f15" data-element_type="section">
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-a4efbc9"
          data-id="a4efbc9" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div className="elementor-element elementor-element-351838d elementor-widget elementor-widget-heading"
              data-id="351838d" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h3 className="elementor-heading-title elementor-size-default">Earn up from cryptocurrency</h3>
              </div>
            </div>
            <div className="elementor-element elementor-element-cee0870 elementor-widget elementor-widget-text-editor"
              data-id="cee0870" data-element_type="widget" data-widget_type="text-editor.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <p>Lacinia maecenas rhoncus aliquet ultrices massa taciti aenean vitae etiam luctus velit</p>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-6f99068 elementor-widget elementor-widget-button animated fadeIn"
              data-id="6f99068" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:800}"
              data-widget_type="button.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <div className="elementor-button-wrapper" bis_skin_checked="1">
                  <a className="elementor-button elementor-button-link elementor-size-sm" href="#">
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-text">Get Started</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-48d5339"
          data-id="48d5339" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap" bis_skin_checked="1">
          </div>
        </div>
      </div>
    </section>
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-72297b4 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="72297b4" data-element_type="section">
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-3a79e10"
          data-id="3a79e10" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-3cd3267 elementor-widget elementor-widget-heading animated fadeInUp"
              data-id="3cd3267" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:200}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h2 className="elementor-heading-title elementor-size-default">we provide services</h2>
              </div>
            </div>
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-ef38b02 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="ef38b02" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-7dadf13 animated fadeIn"
                  data-id="7dadf13" data-element_type="column"
                  data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}"
                  bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-background-overlay" bis_skin_checked="1"></div>
                    <div
                      className="elementor-element elementor-element-668067d elementor-position-left elementor-vertical-align-bottom elementor-widget elementor-widget-image-box"
                      data-id="668067d" data-element_type="widget" data-widget_type="image-box.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-image-box-wrapper" bis_skin_checked="1">
                          <figure className="elementor-image-box-img"><img loading="lazy" decoding="async" width="512"
                              height="512"
                              src="/home-images/Cards.png"
                              className="attachment-full size-full wp-image-238" alt=""
                              srcset="/home-images/Cards.png 512w, /home-images/Cards-300x300.png 300w, /home-images/Cards-150x150.png 150w"
                              sizes="(max-width: 512px) 100vw, 512px" /></figure>
                          <div className="elementor-image-box-content" bis_skin_checked="1">
                            <h3 className="elementor-image-box-title">Buy Crypto Assets</h3>
                            <p className="elementor-image-box-description">Justo malesuada nunc enim himenaeos pellentesque
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-39bba48 animated fadeIn"
                  data-id="39bba48" data-element_type="column"
                  data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:400}"
                  bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-background-overlay" bis_skin_checked="1"></div>
                    <div
                      className="elementor-element elementor-element-f454171 elementor-position-left elementor-vertical-align-bottom elementor-widget elementor-widget-image-box"
                      data-id="f454171" data-element_type="widget" data-widget_type="image-box.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-image-box-wrapper" bis_skin_checked="1">
                          <figure className="elementor-image-box-img"><img loading="lazy" decoding="async" width="512"
                              height="512"
                              src="/home-images/Bag.png"
                              className="attachment-full size-full wp-image-234" alt=""
                              srcset="/home-images/Bag.png 512w, /home-images/Bag-300x300.png 300w, /home-images/Bag-150x150.png 150w"
                              sizes="(max-width: 512px) 100vw, 512px" /></figure>
                          <div className="elementor-image-box-content" bis_skin_checked="1">
                            <h3 className="elementor-image-box-title">Sell Crypto Assets</h3>
                            <p className="elementor-image-box-description">Justo malesuada nunc enim himenaeos pellentesque
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-cd57fa5 elementor-hidden-tablet animated fadeIn"
                  data-id="cd57fa5" data-element_type="column"
                  data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:600}"
                  bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-background-overlay" bis_skin_checked="1"></div>
                    <div
                      className="elementor-element elementor-element-77876f5 elementor-position-left elementor-vertical-align-bottom elementor-widget elementor-widget-image-box"
                      data-id="77876f5" data-element_type="widget" data-widget_type="image-box.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-image-box-wrapper" bis_skin_checked="1">
                          <figure className="elementor-image-box-img"><img loading="lazy" decoding="async" width="512"
                              height="512"
                              src="/home-images/Safety.png"
                              className="attachment-full size-full wp-image-250" alt=""
                              srcset="/home-images/Safety.png 512w, /home-images/Safety-300x300.png 300w, /home-images/Safety-150x150.png 150w"
                              sizes="(max-width: 512px) 100vw, 512px" /></figure>
                          <div className="elementor-image-box-content" bis_skin_checked="1">
                            <h3 className="elementor-image-box-title">24 Hours Transaction</h3>
                            <p className="elementor-image-box-description">Justo malesuada nunc enim himenaeos pellentesque
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
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-38deae4 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="38deae4" data-element_type="section">
      <div className="elementor-background-overlay" bis_skin_checked="1"></div>
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-6172c17"
          data-id="6172c17" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div className="elementor-element elementor-element-c1bcbb8 elementor-widget elementor-widget-heading"
              data-id="c1bcbb8" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h2 className="elementor-heading-title elementor-size-default">Find the crypto </h2>
              </div>
            </div>
            <div className="elementor-element elementor-element-d183fc9 elementor-widget elementor-widget-heading"
              data-id="d183fc9" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h2 className="elementor-heading-title elementor-size-default">data you need</h2>
              </div>
            </div>
            <div className="elementor-element elementor-element-9557597 elementor-widget elementor-widget-text-editor"
              data-id="9557597" data-element_type="widget" data-widget_type="text-editor.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <p>Mi feugiat dignissim dis pulvinar mollis, imperdiet congue maecenas tortor vel porta, duis potenti
                  nisl conubia.</p>
              </div>
            </div>
            <div className="elementor-element elementor-element-ea3e871 elementor-widget elementor-widget-heading"
              data-id="ea3e871" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h6 className="elementor-heading-title elementor-size-default">Download our platfom on </h6>
              </div>
            </div>
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-c019f0f elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="c019f0f" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-31af91a"
                  data-id="31af91a" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-element elementor-element-59a2e34 elementor-widget elementor-widget-image"
                      data-id="59a2e34" data-element_type="widget" data-widget_type="image.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <img loading="lazy" decoding="async" width="592" height="175"
                          src="/home-images/coinonehome010.png"
                          className="elementor-animation-shrink attachment-large size-large wp-image-332" alt=""
                          srcset="/home-images/coinonehome010.png 592w, /home-images/coinonehome010-300x89.png 300w"
                          sizes="(max-width: 592px) 100vw, 592px" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-a97004b"
                  data-id="a97004b" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-element elementor-element-a4a2195 elementor-widget elementor-widget-image"
                      data-id="a4a2195" data-element_type="widget" data-widget_type="image.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <img loading="lazy" decoding="async" width="592" height="175"
                          src="/home-images/coinonehome09.png"
                          className="elementor-animation-shrink attachment-large size-large wp-image-331" alt=""
                          srcset="/home-images/coinonehome09.png 592w, /home-images/coinonehome09-300x89.png 300w"
                          sizes="(max-width: 592px) 100vw, 592px" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-5f2e5fe"
                  data-id="5f2e5fe" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-element elementor-element-02a4447 elementor-widget elementor-widget-image"
                      data-id="02a4447" data-element_type="widget" data-widget_type="image.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <img loading="lazy" decoding="async" width="234" height="68"
                          src="/home-images/coinonehome011.png"
                          className="elementor-animation-shrink attachment-large size-large wp-image-336" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-34cff6d"
          data-id="34cff6d" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div className="elementor-element elementor-element-face4bc elementor-widget elementor-widget-image"
              data-id="face4bc" data-element_type="widget" data-widget_type="image.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <img loading="lazy" decoding="async" width="800" height="545"
                  src="/home-images/coinonehome07-1024x697.png"
                  className="attachment-large size-large wp-image-309" alt=""
                  srcset="/home-images/coinonehome07-1024x697.png 1024w, /home-images/coinonehome07-300x204.png 300w, /home-images/coinonehome07-768x523.png 768w, /home-images/coinonehome07-800x545.png 800w, /home-images/coinonehome07.png 1200w"
                  sizes="(max-width: 800px) 100vw, 800px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-3ef3e61 elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle"
      data-id="3ef3e61" data-element_type="section"
      data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
      <div className="elementor-background-overlay" bis_skin_checked="1"></div>
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-0a2bed7"
          data-id="0a2bed7" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated e-swiper-container" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-1a1e3e6 elementor--h-position-left elementor--v-position-middle elementor-pagination-position-inside elementor-widget elementor-widget-slides e-widget-swiper"
              data-id="1a1e3e6" data-element_type="widget"
              data-settings="{&quot;navigation&quot;:&quot;dots&quot;,&quot;autoplay_speed&quot;:4000,&quot;autoplay&quot;:&quot;yes&quot;,&quot;pause_on_hover&quot;:&quot;yes&quot;,&quot;pause_on_interaction&quot;:&quot;yes&quot;,&quot;infinite&quot;:&quot;yes&quot;,&quot;transition&quot;:&quot;slide&quot;,&quot;transition_speed&quot;:500}"
              data-widget_type="slides.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <div className="elementor-swiper" bis_skin_checked="1">
                  <div
                    className="elementor-slides-wrapper elementor-main-swiper swiper swiper-initialized swiper-horizontal swiper-pointer-events"
                    role="region" aria-roledescription="carousel" aria-label="Slides" dir="ltr"
                    data-animation="fadeInUp" bis_skin_checked="1">
                    <div className="swiper-wrapper elementor-slides" bis_skin_checked="1"
                      id="swiper-wrapper-ea94b83203ee34c9" aria-live="off"
                      style={{cursor: 'grab', transitionDuration: '500ms', transform: 'translate3d(-4060px, 0px, 0px)'}}>
                      <div className="elementor-repeater-item-707fc82 swiper-slide swiper-slide-duplicate" role="group"
                        aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="0"
                        style={{width: '580px'}} aria-label="1 / 4">
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div className="elementor-repeater-item-1b4bfeb swiper-slide swiper-slide-duplicate" role="group"
                        aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="1"
                        style={{width: '580px'}} aria-label="2 / 4">
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div
                        className="elementor-repeater-item-aeaec7e swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev"
                        role="group" aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="2"
                        style={{width: '580px'}} aria-label="3 / 4">
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div
                        className="elementor-repeater-item-d2e04e3 swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active"
                        role="group" aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="3"
                        style={{width: '580px'}} aria-label="4 / 4">
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div className="elementor-repeater-item-707fc82 swiper-slide swiper-slide-duplicate-next" role="group"
                        aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="0"
                        style={{width: '580px'}} aria-label="1 / 4">
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div className="elementor-repeater-item-1b4bfeb swiper-slide" role="group"
                        aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="1"
                        style={{width: '580px'}} aria-label="2 / 4">
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div className="elementor-repeater-item-aeaec7e swiper-slide swiper-slide-prev" role="group"
                        aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="2"
                        style={{width: '580px'}} aria-label="3 / 4">
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div className="elementor-repeater-item-d2e04e3 swiper-slide swiper-slide-active" role="group"
                        aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="3"
                        style={{width: '580px'}} aria-label="4 / 4">
                        <div className="swiper-slide-bg elementor-ken-burns--active" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div className="elementor-repeater-item-707fc82 swiper-slide swiper-slide-duplicate swiper-slide-next"
                        role="group" aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="0"
                        style={{width: '580px'}} aria-label="1 / 4">
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div className="elementor-repeater-item-1b4bfeb swiper-slide swiper-slide-duplicate" role="group"
                        aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="1"
                        style={{width: '580px'}} aria-label="2 / 4">
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div
                        className="elementor-repeater-item-aeaec7e swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev"
                        role="group" aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="2"
                        style={{width: '580px'}} aria-label="3 / 4">
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                      <div
                        className="elementor-repeater-item-d2e04e3 swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active"
                        role="group" aria-roledescription="slide" bis_skin_checked="1" data-swiper-slide-index="3"
                        aria-label="4 / 4" style={{width: '580px'}}>
                        <div className="swiper-slide-bg" role="img" bis_skin_checked="1"></div>
                        <div className="swiper-slide-inner" bis_skin_checked="1">
                          <div className="swiper-slide-contents" bis_skin_checked="1" style={{display: 'none'}}></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"
                      bis_skin_checked="1"><span className="swiper-pagination-bullet" tabindex="0" role="button"
                        aria-label="Go to slide 1"></span><span className="swiper-pagination-bullet" tabindex="0"
                        role="button" aria-label="Go to slide 2"></span><span className="swiper-pagination-bullet"
                        tabindex="0" role="button" aria-label="Go to slide 3"></span><span
                        className="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button"
                        aria-label="Go to slide 4" aria-current="true"></span></div>
                    <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-99e6575"
          data-id="99e6575" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div className="elementor-element elementor-element-be6d41b elementor-widget elementor-widget-heading"
              data-id="be6d41b" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h2 className="elementor-heading-title elementor-size-default">Manage your </h2>
              </div>
            </div>
            <div className="elementor-element elementor-element-0acfef2 elementor-widget elementor-widget-heading"
              data-id="0acfef2" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h2 className="elementor-heading-title elementor-size-default">cryptocurrency</h2>
              </div>
            </div>
            <div className="elementor-element elementor-element-e7a350a elementor-widget elementor-widget-text-editor"
              data-id="e7a350a" data-element_type="widget" data-widget_type="text-editor.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <p>Accumsan dignissim at sollicitudin congue luctus nisl praesent proin scelerisque massa feugiat
                  dictumst</p>
              </div>
            </div>
            <div className="elementor-element elementor-element-86544f1 elementor-widget elementor-widget-price-list"
              data-id="86544f1" data-element_type="widget" data-widget_type="price-list.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">

                <ul className="elementor-price-list">

                  <li><a className="elementor-price-list-item" href="#">
                      <div className="elementor-price-list-image" bis_skin_checked="1">
                        <img decoding="async"
                          src="/home-images/coinoneicon02.png"
                          alt="Manage  Crypto" loading="lazy" />
                      </div>

                      <div className="elementor-price-list-text" bis_skin_checked="1">
                        <div className="elementor-price-list-header" bis_skin_checked="1">
                          <span className="elementor-price-list-title">
                            Manage Crypto </span>
                          <span className="elementor-price-list-separator"></span>
                        </div>
                        <p className="elementor-price-list-description">
                          Pharetra cum massa maecenas aenean </p>
                      </div>
                    </a></li>
                  <li><a className="elementor-price-list-item" href="#">
                      <div className="elementor-price-list-image" bis_skin_checked="1">
                        <img decoding="async"
                          src="/home-images/coinoneicon03.png"
                          alt="Mobile Apps" loading="lazy" />
                      </div>

                      <div className="elementor-price-list-text" bis_skin_checked="1">
                        <div className="elementor-price-list-header" bis_skin_checked="1">
                          <span className="elementor-price-list-title">
                            Mobile Apps </span>
                          <span className="elementor-price-list-separator"></span>
                        </div>
                        <p className="elementor-price-list-description">
                          Pharetra cum massa maecenas aenean </p>
                      </div>
                    </a></li>
                  <li><a className="elementor-price-list-item" href="#">
                      <div className="elementor-price-list-image" bis_skin_checked="1">
                        <img decoding="async"
                          src="/home-images/coinoneicon06.png"
                          alt="Capital Market" loading="lazy" />
                      </div>

                      <div className="elementor-price-list-text" bis_skin_checked="1">
                        <div className="elementor-price-list-header" bis_skin_checked="1">
                          <span className="elementor-price-list-title">
                            Capital Market </span>
                          <span className="elementor-price-list-separator"></span>
                        </div>
                        <p className="elementor-price-list-description">
                          Pharetra cum massa maecenas aenean </p>
                      </div>
                    </a></li>
                </ul>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-f52239c elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle"
      data-id="f52239c" data-element_type="section"
      data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
      <div className="elementor-background-overlay" bis_skin_checked="1"></div>
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div
          className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-b21ee28 animated fadeIn"
          data-id="b21ee28" data-element_type="column"
          data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:600}"
          bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div className="elementor-element elementor-element-275f5ed elementor-widget elementor-widget-image"
              data-id="275f5ed" data-element_type="widget" data-widget_type="image.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <img loading="lazy" decoding="async" width="800" height="800"
                  src="/home-images/coinonehome021.jpg"
                  className="attachment-large size-large wp-image-470" alt=""
                  srcset="/home-images/coinonehome021.jpg 1000w, /home-images/coinonehome021-300x300.jpg 300w, /home-images/coinonehome021-150x150.jpg 150w, /home-images/coinonehome021-768x768.jpg 768w, /home-images/coinonehome021-800x800.jpg 800w"
                  sizes="(max-width: 800px) 100vw, 800px" />
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-7dba2c7"
          data-id="7dba2c7" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-e903384 elementor-widget elementor-widget-heading animated fadeInUp"
              data-id="e903384" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:200}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h5 className="elementor-heading-title elementor-size-default">Our Mission</h5>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-e044d1f elementor-widget elementor-widget-heading animated fadeInUp"
              data-id="e044d1f" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h2 className="elementor-heading-title elementor-size-default">Creating the Future </h2>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-deb05b1 elementor-widget elementor-widget-heading animated fadeInUp"
              data-id="deb05b1" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h2 className="elementor-heading-title elementor-size-default">of Finance Today</h2>
              </div>
            </div>
            <div className="elementor-element elementor-element-887bea1 elementor-widget elementor-widget-spacer"
              data-id="887bea1" data-element_type="widget" data-widget_type="spacer.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <div className="elementor-spacer" bis_skin_checked="1">
                  <div className="elementor-spacer-inner" bis_skin_checked="1"></div>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-431f31d elementor-widget elementor-widget-text-editor animated fadeInUp"
              data-id="431f31d" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:600}"
              data-widget_type="text-editor.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <p>Nunc suscipit cras nibh vel nisi imperdiet convallis leo cubilia&nbsp; sollicitudin, urna curae
                  integer&nbsp; condimentum velit semper mattis aenean montes.</p>
                <p>Imper accumsan nisi etiam nibh eget curabitur aliquam&nbsp; duis in praesent, facilisis venenatis
                  orci taciti lobortis vestibulum vivamus eleifend.</p>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-6fbbcd0 elementor-widget-divider--view-line elementor-widget elementor-widget-divider"
              data-id="6fbbcd0" data-element_type="widget" data-widget_type="divider.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <div className="elementor-divider" bis_skin_checked="1">
                  <span className="elementor-divider-separator">
                  </span>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-e65bff2 elementor-widget elementor-widget-button animated fadeInUp"
              data-id="e65bff2" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:800}"
              data-widget_type="button.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <div className="elementor-button-wrapper" bis_skin_checked="1">
                  <a className="elementor-button elementor-button-link elementor-size-sm" href="#">
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-icon">
                        <i aria-hidden="true" className="fas fa-arrow-right"></i> </span>
                      <span className="elementor-button-text">About Us</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-56eed45 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="56eed45" data-element_type="section">
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-cda09c9"
          data-id="cda09c9" data-element_type="column"
          data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-066a030 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="066a030" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-271a19f"
                  data-id="271a19f" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-element elementor-element-0643354 elementor-widget elementor-widget-counter"
                      data-id="0643354" data-element_type="widget" data-widget_type="counter.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-counter" bis_skin_checked="1">
                          <div className="elementor-counter-title" bis_skin_checked="1">Currencies Available</div>
                          <div className="elementor-counter-number-wrapper" bis_skin_checked="1">
                            <span className="elementor-counter-number-prefix"></span>
                            <span className="elementor-counter-number" data-duration="2000" data-to-value="65"
                              data-from-value="0" data-delimiter=",">65</span>
                            <span className="elementor-counter-number-suffix">+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-638a008"
                  data-id="638a008" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-element elementor-element-7c51973 elementor-widget elementor-widget-counter"
                      data-id="7c51973" data-element_type="widget" data-widget_type="counter.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-counter" bis_skin_checked="1">
                          <div className="elementor-counter-title" bis_skin_checked="1">Verified Users</div>
                          <div className="elementor-counter-number-wrapper" bis_skin_checked="1">
                            <span className="elementor-counter-number-prefix"></span>
                            <span className="elementor-counter-number" data-duration="2000" data-to-value="34"
                              data-from-value="0" data-delimiter=",">34</span>
                            <span className="elementor-counter-number-suffix">M</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-12598d1"
                  data-id="12598d1" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-element elementor-element-0551d08 elementor-widget elementor-widget-counter"
                      data-id="0551d08" data-element_type="widget" data-widget_type="counter.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-counter" bis_skin_checked="1">
                          <div className="elementor-counter-title" bis_skin_checked="1">volume Traded</div>
                          <div className="elementor-counter-number-wrapper" bis_skin_checked="1">
                            <span className="elementor-counter-number-prefix">$</span>
                            <span className="elementor-counter-number" data-duration="2000" data-to-value="400"
                              data-from-value="0" data-delimiter=",">400</span>
                            <span className="elementor-counter-number-suffix">M</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-79c1ac9"
                  data-id="79c1ac9" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-element elementor-element-d6c696f elementor-widget elementor-widget-counter"
                      data-id="d6c696f" data-element_type="widget" data-widget_type="counter.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-counter" bis_skin_checked="1">
                          <div className="elementor-counter-title" bis_skin_checked="1">Countries Supported</div>
                          <div className="elementor-counter-number-wrapper" bis_skin_checked="1">
                            <span className="elementor-counter-number-prefix"></span>
                            <span className="elementor-counter-number" data-duration="2000" data-to-value="98"
                              data-from-value="0" data-delimiter=",">98</span>
                            <span className="elementor-counter-number-suffix">+</span>
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
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-7013a27 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="7013a27" data-element_type="section">
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div
          className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-cd3d05d animated fadeIn"
          data-id="cd3d05d" data-element_type="column"
          data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:200}"
          bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div className="elementor-background-overlay" bis_skin_checked="1"></div>
            <div className="elementor-element elementor-element-d8546c8 elementor-widget elementor-widget-heading"
              data-id="d8546c8" data-element_type="widget" data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h2 className="elementor-heading-title elementor-size-default">Trusted crypto<br /> platform</h2>
              </div>
            </div>
            <div className="elementor-element elementor-element-8cc8df8 elementor-widget elementor-widget-text-editor"
              data-id="8cc8df8" data-element_type="widget" data-widget_type="text-editor.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <p>Nunc suscipit cras nibh vel nisi imperdiet convallis leo cubilia&nbsp;&nbsp;</p>
              </div>
            </div>
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-9089766 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="9089766" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-26dbefd"
                  data-id="26dbefd" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-element elementor-element-4851e29 elementor-widget elementor-widget-image"
                      data-id="4851e29" data-element_type="widget" data-widget_type="image.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <img loading="lazy" decoding="async" width="592" height="175"
                          src="/home-images/coinonehome010.png"
                          className="elementor-animation-shrink attachment-large size-large wp-image-332" alt=""
                          srcset="/home-images/coinonehome010.png 592w, /home-images/coinonehome010-300x89.png 300w"
                          sizes="(max-width: 592px) 100vw, 592px" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-21163d2"
                  data-id="21163d2" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-element elementor-element-91d6081 elementor-widget elementor-widget-image"
                      data-id="91d6081" data-element_type="widget" data-widget_type="image.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <img loading="lazy" decoding="async" width="592" height="175"
                          src="/home-images/coinonehome09.png"
                          className="elementor-animation-shrink attachment-large size-large wp-image-331" alt=""
                          srcset="/home-images/coinonehome09.png 592w, /home-images/coinonehome09-300x89.png 300w"
                          sizes="(max-width: 592px) 100vw, 592px" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-1b68880"
          data-id="1b68880" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-9a22afe elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="9a22afe" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-b8a2467 animated fadeIn"
                  data-id="b8a2467" data-element_type="column"
                  data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:400}"
                  bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-6753513 elementor-position-top elementor-widget elementor-widget-image-box"
                      data-id="6753513" data-element_type="widget" data-widget_type="image-box.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-image-box-wrapper" bis_skin_checked="1">
                          <figure className="elementor-image-box-img"><img decoding="async"
                              src="/home-images/Safety.png"
                              title="Safety" alt="Safety" loading="lazy" /></figure>
                          <div className="elementor-image-box-content" bis_skin_checked="1">
                            <h3 className="elementor-image-box-title">Safe and Secure</h3>
                            <p className="elementor-image-box-description">Nunc suscipit cras nibh vel nisi imperdiet
                              convallis leo cubilia&nbsp;&nbsp;</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-074ff8c animated fadeIn"
                  data-id="074ff8c" data-element_type="column"
                  data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:600}"
                  bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-2f920fc elementor-position-top elementor-widget elementor-widget-image-box"
                      data-id="2f920fc" data-element_type="widget" data-widget_type="image-box.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-image-box-wrapper" bis_skin_checked="1">
                          <figure className="elementor-image-box-img"><img loading="lazy" decoding="async" width="512"
                              height="512"
                              src="/home-images/Monitoring.png"
                              className="attachment-full size-full wp-image-246" alt=""
                              srcset="/home-images/Monitoring.png 512w, /home-images/Monitoring-300x300.png 300w, /home-images/Monitoring-150x150.png 150w"
                              sizes="(max-width: 512px) 100vw, 512px" /></figure>
                          <div className="elementor-image-box-content" bis_skin_checked="1">
                            <h3 className="elementor-image-box-title">Real-time Data</h3>
                            <p className="elementor-image-box-description">Nunc suscipit cras nibh vel nisi imperdiet
                              convallis leo cubilia&nbsp;&nbsp;</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-87e6d17 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="87e6d17" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-b1b321a animated fadeIn"
                  data-id="b1b321a" data-element_type="column"
                  data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:800}"
                  bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-ba1aa31 elementor-position-top elementor-widget elementor-widget-image-box"
                      data-id="ba1aa31" data-element_type="widget" data-widget_type="image-box.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-image-box-wrapper" bis_skin_checked="1">
                          <figure className="elementor-image-box-img"><img decoding="async"
                              src="/home-images/Select.png"
                              title="Select" alt="Select" loading="lazy" /></figure>
                          <div className="elementor-image-box-content" bis_skin_checked="1">
                            <h3 className="elementor-image-box-title">Track Profit</h3>
                            <p className="elementor-image-box-description">Nunc suscipit cras nibh vel nisi imperdiet
                              convallis leo cubilia&nbsp;&nbsp;</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-0a818a0 animated fadeIn"
                  data-id="0a818a0" data-element_type="column"
                  data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:1000}"
                  bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-c6f250e elementor-position-top elementor-widget elementor-widget-image-box"
                      data-id="c6f250e" data-element_type="widget" data-widget_type="image-box.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <div className="elementor-image-box-wrapper" bis_skin_checked="1">
                          <figure className="elementor-image-box-img"><img loading="lazy" decoding="async" width="512"
                              height="512"
                              src="/home-images/Settings.png"
                              className="attachment-full size-full wp-image-252" alt=""
                              srcset="/home-images/Settings.png 512w, /home-images/Settings-300x300.png 300w, /home-images/Settings-150x150.png 150w"
                              sizes="(max-width: 512px) 100vw, 512px" /></figure>
                          <div className="elementor-image-box-content" bis_skin_checked="1">
                            <h3 className="elementor-image-box-title">Customizable Charts</h3>
                            <p className="elementor-image-box-description">Nunc suscipit cras nibh vel nisi imperdiet
                              convallis leo cubilia&nbsp;&nbsp;</p>
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
  <div data-elementor-type="footer" data-elementor-id="582" className="elementor elementor-582 elementor-location-footer"
    data-elementor-post-type="elementor_library" bis_skin_checked="1">
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-f5c7696 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="f5c7696" data-element_type="section">
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-b6c1931"
          data-id="b6c1931" data-element_type="column"
          data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-731a3d4 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="731a3d4" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-8d87f94"
                  data-id="8d87f94" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-0851529 elementor-widget elementor-widget-heading animated fadeInUp"
                      data-id="0851529" data-element_type="widget"
                      data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:200}"
                      data-widget_type="heading.default" bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <h2 className="elementor-heading-title elementor-size-default">Get CoinOne Crypto</h2>
                      </div>
                    </div>
                    <div
                      className="elementor-element elementor-element-83d1b7a elementor-widget elementor-widget-heading animated fadeInUp"
                      data-id="83d1b7a" data-element_type="widget"
                      data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}"
                      data-widget_type="heading.default" bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <h6 className="elementor-heading-title elementor-size-default">The Ultimate Security for Your
                          Digital Assets</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-7760c54"
                  data-id="7760c54" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-52c232d elementor-widget elementor-widget-image animated fadeInUp"
                      data-id="52c232d" data-element_type="widget"
                      data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:200}"
                      data-widget_type="image.default" bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <img width="592" height="175"
                          src="/home-images/coinonehome010.png"
                          className="elementor-animation-shrink attachment-large size-large wp-image-332" alt=""
                          srcset="/home-images/coinonehome010.png 592w, /home-images/coinonehome010-300x89.png 300w"
                          sizes="(max-width: 592px) 100vw, 592px" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-66457a1"
                  data-id="66457a1" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-e4d5c6c elementor-widget elementor-widget-image animated fadeInUp"
                      data-id="e4d5c6c" data-element_type="widget"
                      data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}"
                      data-widget_type="image.default" bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <img width="592" height="175"
                          src="/home-images/coinonehome09.png"
                          className="elementor-animation-shrink attachment-large size-large wp-image-331" alt=""
                          srcset="/home-images/coinonehome09.png 592w, /home-images/coinonehome09-300x89.png 300w"
                          sizes="(max-width: 592px) 100vw, 592px" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-15801da elementor-hidden-phone"
                  data-id="15801da" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-3f30b9c elementor-widget elementor-widget-image animated fadeInUp"
                      data-id="3f30b9c" data-element_type="widget"
                      data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:600}"
                      data-widget_type="image.default" bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <img width="234" height="68"
                          src="/home-images/coinonehome011.png"
                          className="elementor-animation-shrink attachment-large size-large wp-image-336" alt="" />
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
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-54a2ebf elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="54a2ebf" data-element_type="section">
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-afba3d9"
          data-id="afba3d9" data-element_type="column"
          data-settings="{&quot;background_background&quot;:&quot;gradient&quot;}" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <section
              className="elementor-section elementor-inner-section elementor-element elementor-element-c8fce66 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="c8fce66" data-element_type="section">
              <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
                <div
                  className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-f318752"
                  data-id="f318752" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div
                      className="elementor-element elementor-element-2fa9851 elementor-widget elementor-widget-image animated fadeIn"
                      data-id="2fa9851" data-element_type="widget"
                      data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:400}"
                      data-widget_type="image.default" bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <img width="800" height="655"
                          src="/home-images/coinonehome029-1024x838.png"
                          className="attachment-large size-large wp-image-591" alt=""
                          srcset="/home-images/coinonehome029-1024x838.png 1024w, /home-images/coinonehome029-300x246.png 300w, /home-images/coinonehome029-768x629.png 768w, /home-images/coinonehome029-800x655.png 800w, /home-images/coinonehome029.png 1250w"
                          sizes="(max-width: 800px) 100vw, 800px" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-53ad710"
                  data-id="53ad710" data-element_type="column" bis_skin_checked="1">
                  <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
                    <div className="elementor-element elementor-element-6afa4fe elementor-widget elementor-widget-heading"
                      data-id="6afa4fe" data-element_type="widget" data-widget_type="heading.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <h4 className="elementor-heading-title elementor-size-default">Sign up for updates</h4>
                      </div>
                    </div>
                    <div
                      className="elementor-element elementor-element-e332ecb elementor-widget elementor-widget-text-editor"
                      data-id="e332ecb" data-element_type="widget" data-widget_type="text-editor.default"
                      bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <p>Mi feugiat dignissim dis pulvinar mollis</p>
                      </div>
                    </div>
                    <div
                      className="elementor-element elementor-element-137ebe6 elementor-button-align-stretch elementor-widget elementor-widget-form"
                      data-id="137ebe6" data-element_type="widget"
                      data-settings="{&quot;button_width&quot;:&quot;30&quot;,&quot;step_next_label&quot;:&quot;Next&quot;,&quot;step_previous_label&quot;:&quot;Previous&quot;,&quot;step_type&quot;:&quot;number_text&quot;,&quot;step_icon_shape&quot;:&quot;circle&quot;}"
                      data-widget_type="form.default" bis_skin_checked="1">
                      <div className="elementor-widget-container" bis_skin_checked="1">
                        <form className="elementor-form" method="post" name="New Form">
                          <input type="hidden" name="post_id" value="582" />
                          <input type="hidden" name="form_id" value="137ebe6" />
                          <input type="hidden" name="referer_title" value="" />

                          <input type="hidden" name="queried_id" value="6" />

                          <div className="elementor-form-fields-wrapper elementor-labels-" bis_skin_checked="1">
                            <div
                              className="elementor-field-type-email elementor-field-group elementor-column elementor-field-group-email elementor-col-70 elementor-field-required"
                              bis_skin_checked="1">
                              <label htmlFor="form-field-email" className="elementor-field-label elementor-screen-only">
                                Email </label>
                              <input size="1" type="email" name="form_fields[email]" id="form-field-email"
                                className="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Email"
                                required="required" />
                            </div>
                            <div
                              className="elementor-field-group elementor-column elementor-field-type-submit elementor-col-30 e-form__buttons"
                              bis_skin_checked="1">
                              <button className="elementor-button elementor-size-sm" type="submit">
                                <span className="elementor-button-content-wrapper">
                                  <span className="elementor-button-text">Send</span>
                                </span>
                              </button>
                            </div>
                          </div>
                        </form>
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
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-6445f69 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="6445f69" data-element_type="section"
      data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-61906ae"
          data-id="61906ae" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-85102d6 elementor-widget elementor-widget-image animated fadeInUp"
              data-id="85102d6" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:100}"
              data-widget_type="image.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <img width="800" height="207"
                  src="/home-images/Logo-1024x265.png"
                  className="attachment-large size-large wp-image-613" alt=""
                  srcset="/home-images/Logo-1024x265.png 1024w, /home-images/Logo-300x78.png 300w, /home-images/Logo-768x199.png 768w, /home-images/Logo-800x207.png 800w, /home-images/Logo.png 1276w"
                  sizes="(max-width: 800px) 100vw, 800px" />
              </div>
            </div>
            <div
              className="elementor-element elementor-element-1c2b30e elementor-widget elementor-widget-text-editor animated fadeInUp"
              data-id="1c2b30e" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}"
              data-widget_type="text-editor.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <p>Accumsan dignissim at sollicitudin congue luctus</p>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-2baed1f elementor-widget elementor-widget-image animated fadeInUp"
              data-id="2baed1f" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}"
              data-widget_type="image.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <img width="600" height="292"
                  src="/home-images/coinonehome030.png"
                  className="attachment-large size-large wp-image-629" alt=""
                  srcset="/home-images/coinonehome030.png 600w, /home-images/coinonehome030-300x146.png 300w"
                  sizes="(max-width: 600px) 100vw, 600px" />
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-75950fd"
          data-id="75950fd" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-4c05f6e elementor-widget elementor-widget-heading animated fadeInUp"
              data-id="4c05f6e" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:200}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h4 className="elementor-heading-title elementor-size-default">Product</h4>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-8d3a485 elementor-tablet-align-center elementor-mobile-align-left elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list animated fadeInUp"
              data-id="8d3a485" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:300}"
              data-widget_type="icon-list.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Buy Cypto</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Sell Cypto</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Track Profit</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Realtime Data</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Referral Program</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-24788fe"
          data-id="24788fe" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-d4a19c8 elementor-widget elementor-widget-heading animated fadeInUp"
              data-id="d4a19c8" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h4 className="elementor-heading-title elementor-size-default">Company</h4>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-0978a3f elementor-tablet-align-center elementor-mobile-align-left elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list animated fadeInUp"
              data-id="0978a3f" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:500}"
              data-widget_type="icon-list.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">About Us</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Blog</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Career</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Community</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Notices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-a76baf0"
          data-id="a76baf0" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-cf78ce8 elementor-widget elementor-widget-heading animated fadeInUp"
              data-id="cf78ce8" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:600}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h4 className="elementor-heading-title elementor-size-default">Services</h4>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-bf489ba elementor-tablet-align-center elementor-mobile-align-left elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list animated fadeInUp"
              data-id="bf489ba" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:700}"
              data-widget_type="icon-list.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Download</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Desktop Application</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Affiliate</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Trading Rules</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Referral</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-cd0e941"
          data-id="cd0e941" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-406bdc7 elementor-widget elementor-widget-heading animated fadeInUp"
              data-id="406bdc7" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:800}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h4 className="elementor-heading-title elementor-size-default">Help</h4>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-339bd17 elementor-tablet-align-center elementor-mobile-align-left elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list animated fadeInUp"
              data-id="339bd17" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:900}"
              data-widget_type="icon-list.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Help Center</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Apply to List</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Contact Us</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Privacy</span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-text">Terms</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section
      className="elementor-section elementor-top-section elementor-element elementor-element-113be4a elementor-section-boxed elementor-section-height-default elementor-section-height-default"
      data-id="113be4a" data-element_type="section"
      data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
      <div className="elementor-background-overlay" bis_skin_checked="1"></div>
      <div className="elementor-container elementor-column-gap-default" bis_skin_checked="1">
        <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-0dcce92"
          data-id="0dcce92" data-element_type="column" bis_skin_checked="1">
          <div className="elementor-widget-wrap elementor-element-populated" bis_skin_checked="1">
            <div
              className="elementor-element elementor-element-081eeb4 elementor-widget elementor-widget-heading animated fadeInUp"
              data-id="081eeb4" data-element_type="widget"
              data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:400}"
              data-widget_type="heading.default" bis_skin_checked="1">
              <div className="elementor-widget-container" bis_skin_checked="1">
                <h6 className="elementor-heading-title elementor-size-default">Ã‚Â© 2021 CoinOne is proudly powered by
                  Onecontributor</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div id="scrnli_recorder_root" bis_skin_checked="1"></div>

  
  <script src="./js/hello-frontend.min.js" id="hello-theme-frontend-js"></script>
  <script src="./js/jquery.smartmenus.min.js" id="smartmenus-js"></script>
  <script src="./js/imagesloaded.min.js" id="imagesloaded-js"></script>
  <script src="./js/swiper.min.js" id="swiper-js"></script>
  <script src="./js/jquery-numerator.min.js" id="jquery-numerator-js"></script>
  <script src="./js/webpack.runtime.min.js" id="elementor-webpack-runtime-js"></script>
  <script src="./js/frontend-modules.min.js" id="elementor-frontend-modules-js"></script>
  <script src="./js/jquery-ui.min.js" id="jquery-ui-core-js"></script>
  
  <script src="./js/elementor-frontend.min.js" id="elementor-frontend-js"></script>
  <span id="elementor-device-mode" className="elementor-screen-only"></span>
  <script src="./js/webpack-pro.runtime.min.js" id="elementor-pro-webpack-runtime-js"></script>
  <script src="./js/hooks.min.js" id="wp-hooks-js"></script>
  <script src="./js/i18n.min.js" id="wp-i18n-js"></script>
  <script id="wp-i18n-js-after"> 
  </script>
  
  <script src="./js/elementor-pro-frontend.min.js" id="elementor-pro-frontend-js"></script>
  <script src="./js/elements-handlers.min.js" id="pro-elements-handlers-js"></script>
  <svg style={{display: 'none'}} className="e-font-icon-svg-symbols"></svg>


    </div>
  );
};

export default HomePage;
