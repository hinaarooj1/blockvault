import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App";
import { ToastContainer } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthProvider } from "./store/auth";
import Router from "./config/router";
import ThemeContext from "./context/ThemeContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <AuthProvider>
      <Provider store={store}>
        <ThemeContext>
          <App />
        </ThemeContext>
        {/* <BrowserRouter>
      </BrowserRouter> */}
        <ToastContainer
          position="bottom-center"
          transition={Slide}
          autoClose={2000}
          closeButton={false}
          pauseOnFocusLoss={false}
          theme="colored"
        />
      </Provider>
    </AuthProvider>
  </>
);
