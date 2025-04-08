import React  from 'react';
import {connect, useDispatch } from 'react-redux';
import {  useLocation, useNavigate, useParams } from 'react-router-dom';

import { Logout } from '../../../store/actions/AuthActions';
import { isAuthenticated } from '../../../store/selectors/AuthSelectors';
import { logoutApi } from '../../../Api/Service';
import { toast } from 'react-toastify';
import { useSignOut } from 'react-auth-kit';

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
      let location = useLocation();
      let navigate = useNavigate();
      let params = useParams();
      return (
        <Component
          {...props}
          router={{ location, navigate, params }}
        />
      );
    }
  
  return ComponentWithRouterProp;
}

function LogoutPage() {
  let Navigate = useNavigate();
  let signOut = useSignOut();
    const dispatch = useDispatch(); 

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
    return(
        <>
            <button  className="dropdown-item ai-icon ms-1" onClick={onLogout}>
                <svg
                  id="icon-logout" xmlns="http://www.w3.org/2000/svg"
                  className="text-danger logout" width={18} height={18} viewBox="0 0 24 24" 
                  fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1={21} y1={12} x2={9} y2={12} />
                </svg>
                <span className="ms-2 text-danger" >Logout </span>
            </button>
        </>
    )
} 
const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
    };
};

export default withRouter(connect(mapStateToProps)(LogoutPage));