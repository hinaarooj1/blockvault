import React, { useEffect, useState } from 'react';
import './AllTicket.css'; // Import your custom CSS
// import profilePic from './path_to_your_profile_picture.jpg'; // Update the path to your profile picture
import profile from "../../../assets/images/7309681.jpg";
import adminDp from "../../../assets/admin.jpg";

import LogoNew from '../../../assets/newlogo/logo.png'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Dropdown, Spinner } from 'react-bootstrap';
import { useAuthUser } from 'react-auth-kit';
import { toast } from 'react-toastify';
import AdminHeader from '../../Admin/adminHeader';

const TicketHeader = (props) => {
    const [Admin, setAdmin] = useState(false);
    let toggleBar = () => {

    }
    const authUser = useAuthUser();
    useEffect(() => {
        if (authUser().user.role === "user") {
            setAdmin(false);

            return;
        } else if (authUser().user.role === "admin" || authUser().user.role === "subadmin") {
            setAdmin(true);
            return;
        }
    }, []);
    return (
        <div className="homepg">
            <header id="header" className="header-layout1">
                <div id="sticky-header" style={{ top: "0px", position: "fixed" }} className="menu-area sasas transparent-header ">
                    <div className="container custom-container">
                        <div className="row">
                            <div className="col-12">
                                <div className="menu-wrap">
                                    <nav className="menu-nav">
                                        <div className="logo">
                                            <Link to="/">
                                                <img src={LogoNew} className='loas' style={{ width: "80px" }} alt="IKO" />
                                            </Link>
                                        </div>
                                        <div className="navbar-wrap main-menu m-auto d-none d-lg-flex">
                                            <ul id="menu-1-8e54fb7" className="navigation">
                                                {Admin ?


                                                    <><li id="menu-item-1274" className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-1274"><Link to="/admin/dashboard" aria-current="page">Dashboard</Link></li>
                                                        <li id="menu-item-1275" className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-1275"><Link to="/admin/support" aria-current="page">Tickets</Link></li>
                                                    </> :
                                                    <>                                              <li id="menu-item-1274" className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-1274"><Link to="/dashboard" aria-current="page">Dashboard</Link></li>
                                                        <li id="menu-item-1275" className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-1275"><Link to="/support" aria-current="page">Tickets</Link></li>
                                                    </>}


                                            </ul>                                      </div>
                                        <div className='main-head-not '>
                                            {Admin ?
                                                <AdminHeader toggle={toggleBar} pageName="" /> : ""}
                                        </div>
                                        <div className="header-action header-right header-profile2">
                                            <Dropdown.Toggle to={"#"} className="nav-link i-false  noap" as="div">
                                                <div className="header-info2 d-flex align-items-center">
                                                    <div className="d-flex align-items-center sidebar-info">
                                                        <div>
                                                            <h5 className="mb-0 text-white">
                                                                {props.Admin.firstName || ""} {props.Admin.lastName || ""}
                                                            </h5>
                                                            <span className="d-block text-end">
                                                                {props.Admin.email || ""}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <img src={profile} alt="profile" />
                                                </div>
                                            </Dropdown.Toggle>
                                        </div>
                                        {/* <div onClick={toggleMenu} className="mobile-nav-toggler"><i className="fas fa-bars" /></div> */}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default TicketHeader;
