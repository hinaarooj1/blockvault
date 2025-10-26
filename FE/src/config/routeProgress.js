// RouteProgress.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // important

export default function RouteProgress() {
  const location = useLocation();

  useEffect(() => {
    // Page switch hone ke turant pehle bar start
    NProgress.start();
    return () => {
      // cleanup jab component unmount hoga
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
}
