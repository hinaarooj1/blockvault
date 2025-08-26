//  import { lazy, Suspense, useEffect } from 'react';
// import Index from './jsx/router/index';
// import { connect, useDispatch } from 'react-redux';
// import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
// import { checkAutoLogin } from './services/AuthService';
// import { isAuthenticated } from './store/selectors/AuthSelectors';
import 'rsuite/dist/rsuite-no-reset.min.css';
import "./assets/css/style.css";
import "./assets/css/styles.css";
import "./assets/css/main.css";
import "./assets/css/stylemain.css";
// import { AuthProvider } from "react-auth-kit"; // Ensure this is correct
// // import Login from './jsx/pages/authentication/Login'
// const SignUp = lazy(() => import('./jsx/pages/authentication/Registration'));
// const Login = lazy(() => import('./jsx/pages/authentication/Login'));

// function withRouter(Component) {
//     function ComponentWithRouterProp(props) {
//         let location = useLocation();
//         let navigate = useNavigate();
//         let params = useParams();

//         return (
//             <Component
//                 {...props}
//                 router={{ location, navigate, params }}
//             />
//         );
//     }

//     return ComponentWithRouterProp;
// }

// function App(props) {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     useEffect(() => {
//         checkAutoLogin(dispatch, navigate);
//     }, [dispatch, navigate]);

//     let routeblog = (
//         <Routes>
//             <Route path='/login' element={<Login />} />
//             <Route path='/page-register' element={<SignUp />} />
//         </Routes>
//     );

//     return (
//         <AuthProvider authType={"localstorage"} authName={"auth"}>
//             {props.isAuthenticated ? (
//                 <Suspense fallback={
//                     <div id="preloader">
//                         <div className="sk-three-bounce">
//                             <div className="sk-child sk-bounce1"></div>
//                             <div className="sk-child sk-bounce2"></div>
//                             <div className="sk-child sk-bounce3"></div>
//                         </div>
//                     </div>
//                 }>
//                     <Index />
//                 </Suspense>
//             ) : (
//                 <div className="vh-100">
//                     <Suspense fallback={
//                         <div id="preloader">
//                             <div className="sk-three-bounce">
//                                 <div className="sk-child sk-bounce1"></div>
//                                 <div className="sk-child sk-bounce2"></div>
//                                 <div className="sk-child sk-bounce3"></div>
//                             </div>
//                         </div>
//                     }>
//                         {routeblog}
//                     </Suspense>
//                 </div>
//             )}
//         </AuthProvider>
//     );
// };


// export default withRouter(connect(App));
import React from 'react';import './i18n'
import Router from './config/router';
import { useTranslation } from 'react-i18next';
// import Login from './jsx/pages/authentication/Login';

const App = () => {
    
    const { t, i18n } = useTranslation();
    return (
        <div>
            <Router />

        </div>
    );
}

export default App;
