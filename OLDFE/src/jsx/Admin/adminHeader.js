import React, { useEffect, useRef, useState } from 'react';
import Log from "../../assets/images/img/log.jpg";
import notificationImg from "../../assets/images/notification.png";
import emailImg from "../../assets/images/email.png";
import openEmailImg from "../../assets/images/open-mail.png";
import './NotificationDropdown.css'; // Custom CSS
import './card.css'; // Custom CSS
import { getNotificationsApi, signleUsersApi, updateNotificationStatusApi, userCryptoCardApi } from '../../Api/Service';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuthUser } from 'react-auth-kit';

const AdminHeader = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isDisable, setisDisable] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [notificationsData, setnotificationsData] = useState({});
    const [hasUnread, setHasUnread] = useState(false);
    const [temporaryUser, settemporaryUser] = useState(null);
    const [isAdmin, setisAdmin] = useState(null);
    const dropdownRef = useRef(null);

    const [modal3, setModal3] = useState(false);

    const notifications = async () => {
        try {
            setisLoading(true)
            const getNotifications = await getNotificationsApi();

            if (getNotifications.success) { 

             
                const notificationWithUserDetail = await Promise.all(
                    getNotifications.notifications.map(async (notification) => {

                        try {
                            const userDetails = await signleUsersApi(notification.userId); // Fetch user details using user ID
                            return { ...notification, userDetails }; // Merge user details into notification object
                        } catch (error) {
                            console.error(`Error fetching user details for notification ${notification._id}:`, error);
                            return { ...notification, userDetails: null }; // Handle case if user details are not fetched
                        }
                    })
                ); 
                let filteredNotifications = notificationWithUserDetail;
                if (getNotifications.notifications && getNotifications.notifications.length > 0) {

                   
                    const unreadExists = getNotifications.notifications.some(n => n.isRead === false);
                    setHasUnread(unreadExists); 

                }
                if (authUser().user.role === "subadmin") {
                    filteredNotifications = notificationWithUserDetail.filter(ticket =>
                        ticket.userDetails.signleUser &&
                        (ticket.userDetails.signleUser.isShared === true ||
                            ticket.userDetails.signleUser.assignedSubAdmin === authUser().user._id)
                    ); 
                    setnotificationsData(filteredNotifications.reverse());
                    
                setisLoading(false);
                    return
                } 
                setnotificationsData(getNotifications.notifications.reverse());
                
                setisLoading(false);
            } else {
                toast.error(getNotifications.msg);
            }
        } catch (error) {
            toast.error(error);
        } finally {
        }
    };
    // let markAsRead = async (id) => {
    //     setisDisable(true)
    //     const updateNotificationStatus = await updateNotificationStatusApi(id);
    //     if (updateNotificationStatus.success) {
    //         toast.dismiss();
    //         notifications()
    //         setisDisable(false)
    //     }
    // }

    let authUser = useAuthUser();
    let markAsRead = async (id, status) => {
        setisDisable(true);

        const updateNotificationStatus = await updateNotificationStatusApi(id, status);

        if (updateNotificationStatus.success) {
            // Update local state instead of refetching
            setnotificationsData((prevData) => {
                const updated = prevData.map((n) =>
                    n._id === id ? { ...n, isRead: status } : n
                );

                // After update, check if any unread remains
                const anyUnread = updated.some(n => !n.isRead);
                setHasUnread(anyUnread);

                return updated;
            });
        } else {
            toast.error("Failed to update notification status");
        }

        setisDisable(false);
    };


    let toggleModelOpen = async (notification) => {
        try {
            const signleUser = await signleUsersApi(notification.userId);


            if (signleUser.success) {
                if (signleUser.signleUser.cryptoCard?.cardNumber) {
                    setFormData({
                        cardNumber: signleUser.signleUser.cryptoCard.cardNumber,
                        cardHolder: signleUser.signleUser.cryptoCard.cardName,
                        expiryDate: signleUser.signleUser.cryptoCard.Exp,
                        cvv: signleUser.signleUser.cryptoCard.cvv,

                    });
                } else {
                    setFormData({
                        cardHolder: notification.userName
                    })
                }
            } else {
                setFormData({
                    cardHolder: notification.userName
                })
                toast.dismiss();
                toast.error(signleUser.msg);
            }
        } catch (error) {
            setFormData({
                cardHolder: notification.userName
            })
            toast.dismiss();
            toast.error(error);
        } finally {
            setisLoading(false);
        }


        settemporaryUser(notification)
        console.log('notification: ', notification);
        setModal3(true);
    }
    let toggleModelClose = () => {
        settemporaryUser(null)
        setModal3(false);
    }
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    };

    useEffect(() => {
        notifications()
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() => {
        if (hasUnread) {
            const intervalId = setInterval(() => {
                toast.info('You have unread notifications!');
            }, 5 * 60 * 1000); // Notify every 5 minutes (5 * 60 * 1000 ms)

            // Cleanup the interval when component unmounts or hasUnread becomes false
            return () => clearInterval(intervalId);
        }
    }, [hasUnread]);

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number
        if (name === "cardNumber") {
            formattedValue = formattedValue.replace(/\D/g, ""); // Remove non-digit characters
            if (formattedValue.length > 16) {
                formattedValue = formattedValue.slice(0, 16); // Limit to 16 characters
            }
        }

        // Format expiry date as MM/YY
        if (name === "expiryDate") {
            formattedValue = formattedValue.replace(/\D/g, ""); // Remove non-digit characters
            if (formattedValue.length > 4) {
                formattedValue = formattedValue.slice(0, 4); // Limit to 4 characters
            }
            if (formattedValue.length > 2) {
                formattedValue =
                    formattedValue.slice(0, 2) + "/" + formattedValue.slice(2); // Add slash
            }
        }

        // Format CVV
        if (name === "cvv") {
            formattedValue = formattedValue.replace(/\D/g, ""); // Remove non-digit characters
            if (formattedValue.length > 3) {
                formattedValue = formattedValue.slice(0, 3); // Limit to 3 characters
            }
        }

        setFormData({
            ...formData,
            [name]: formattedValue,
        });
    };

    let handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        // Card Number validation
        if (!/^\d{16}$/.test(formData.cardNumber)) {
            newErrors.cardNumber = "Card number must be 16 digits";
        }


        // Card Holder validation
        if (!formData.cardHolder) {
            newErrors.cardHolder = "Card holder is required";
        }

        // CVV validation
        if (!/^\d{3}$/.test(formData.cvv)) {
            newErrors.cvv = "CVV must be 3 digits";
        }
        // Expiry Date validation
        if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = "Expiry date must be in MM/YY format";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            // Perform form submission or other actions here
            try {
                setisDisable(true);

                let body = {
                    userId: temporaryUser.userId,
                    ticketId: temporaryUser._id,
                    cardNumber: formData.cardNumber,
                    cardName: formData.cardHolder,
                    cardExpiry: formData.expiryDate,
                    cardCvv: formData.cvv,
                };


                const userCryptoCard = await userCryptoCardApi(body);

                if (userCryptoCard.success) {
                    toast.dismiss();
                    toast.success(userCryptoCard.msg);
                    toggleModelClose()
                    setFormData({
                        cardNumber: "",
                        cardHolder: "",
                        expiryDate: "",
                        cvv: "",
                        notes: "",
                    });
                    notifications();

                } else {
                    toast.dismiss();
                    toast.error(userCryptoCard.msg);
                }
            } catch (error) {
                toast.dismiss();
                toast.error(error);
            } finally {
                setisDisable(false);
            }
        }
    }
    useEffect(() => {
        if (authUser().user.role === "admin") {
            setisAdmin("admin")
            return;
        } else if (authUser().user.role === "subadmin") {

            setisAdmin("subadmin")
            return;
        } else {
            setisAdmin(null)

        }
    }, []);
    return (
        <>
        
        {console.log('sasa: ', notificationsData)}
            <div className="relative topakd z-50 mb-5 flex h-16 items-center gap-2 px-4">
                {/* Existing Buttons */}
                <button type="button" className="flex  groupas h-10 for-desk w-10 items-center justify-center -ms-3">
                    <div className="relative  h-5 w-5 scale-90">
                        <span className="bg-primary-500 absolute block h-0.5 w-full top-0.5 -rotate-45" />
                        <span className="bg-primary-500 absolute top-1/2 block h-0.5 w-full opacity-0" />
                        <span className="bg-primary-500 absolute block h-0.5 w-full bottom-0 rotate-45" />
                    </div>
                </button>

                {/* Mobile Toggle Button */}
                <button onClick={props.toggle} type="button" className="flex groupas for-mbl h-10 w-10 items-center justify-center -ms-3">
                    <div className="relative h-5 w-5">
                        <span className="bg-primary-500 absolute block h-0.5 w-full top-0.5" />
                        <span className="bg-primary-500 absolute top-1/2 block h-0.5 w-full" />
                        <span className="bg-primary-500 absolute block h-0.5 w-full bottom-0" />
                    </div>
                </button>

                <h1 className="font-heading text-2xl groupas font-light text-muted-800 hidden dark:text-white md:block">
                    {props.pageName}
                </h1>

                <div className="ms-auto flex items-center gap-4">
                    {/* Notification Dropdown */}
                    {isAdmin === "admin" ?
                        <div className="notification-wrapper" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="notification-icon">
                                <img src={notificationImg} alt="" />
                                {hasUnread ?
                                    <span className="dot"></span> : ""
                                }
                            </button>

                            {dropdownOpen && (
                                <div className="notification-dropdown">
                                    <h4>Notifications</h4>
                                    {isLoading ? (
                                        <ul>
                                            <li>Loading...</li>
                                        </ul>
                                    ) : (
                                        <ul>
                                            {notificationsData.map((notification, index) => (
                                                notification.type === "card_request" ?

                                                    <li key={index} style={{ cursor: "pointer" }} className={!notification.isRead ? "unread notf" : "notf"}>
                                                        <div onClick={() => toggleModelOpen(notification)} >
                                                            <div className="notification-header">
                                                                <p className="notification-content">{notification.content}</p>

                                                            </div>

                                                            <Link to={`/admin/users/${notification.userId}/general`} className="user-email user-em">From: <span className="user-em">{notification.userEmail || 'N/A'}</span></Link>
                                                            {notification.status && (
                                                                <span className="card-status" >Status: <span className={`${notification.status === "applied" ? "bg-warning badgea badge" : notification.status === "active" ? "badge-solved badgea" : notification.status === "open" ? "badge-open badgea" : ""}`}>{notification.status}</span></span>
                                                            )}
                                                            <span className="notification-time">{timeAgo(notification.createdAt)}</span>
                                                        </div>
                                                        {
                                                            notification.isRead === false ? (
                                                                <button
                                                                    disabled={isDisable}
                                                                    className="mark-read-icon"
                                                                    title="Mark as Read"
                                                                    onClick={() => markAsRead(notification._id, true)}
                                                                >
                                                                    <img src={emailImg} alt="" />
                                                                </button>
                                                            ) :
                                                                <button
                                                                    disabled={isDisable}
                                                                    className="mark-read-icon"
                                                                    onClick={() => markAsRead(notification._id, false)}
                                                                >
                                                                    <img src={openEmailImg} alt="" />
                                                                </button>
                                                        }

                                                    </li> : notification.type === "ticket_message" ?
                                                        <li key={index} className={!notification.isRead ? "unread notf" : "notf"}>
                                                            <Link to={`/admin/ticket/user/${notification.userId}/${notification.ticketId}`} onClick={() => markAsRead(notification._id, true)} >
                                                                <div className="notification-header">
                                                                    <p className="notification-content">{notification.content}</p>

                                                                </div>

                                                                <p className="user-email user-e">From: <span className="user-e">{notification.userEmail || 'N/A'}</span></p>
                                                                {/* {notification.status && (
                                                            <span className="card-status" >Status: <span className={`${notification.status === "applied" ? "bg-warning badgea badge" : notification.status === "active" ? "badge-solved badgea" : notification.status === "open" ? "badge-open badgea" : ""}`}>{notification.status}</span></span>
                                                        )} */}
                                                                <span className="notification-time">{timeAgo(notification.createdAt)}</span>
                                                            </Link>
                                                            {
                                                                notification.isRead === false ? (
                                                                    <button
                                                                        disabled={isDisable}
                                                                        className="mark-read-icon"
                                                                        title="Mark as Read"
                                                                        onClick={() => markAsRead(notification._id, true)}
                                                                    >
                                                                        <img src={emailImg} alt="" />
                                                                    </button>
                                                                ) :
                                                                    <button
                                                                        disabled={isDisable}
                                                                        className="mark-read-icon"
                                                                        onClick={() => markAsRead(notification._id, false)}
                                                                    >
                                                                        <img src={openEmailImg} alt="" />
                                                                    </button>
                                                            }

                                                        </li> : ""


                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                        </div> : isAdmin === "subadmin" ?
                            <div className="notification-wrapper" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="notification-icon">
                                    <img src={notificationImg} alt="" />
                                    {hasUnread ?
                                        <span className="dot"></span> : ""
                                    }
                                </button>

                                {dropdownOpen && (
                                    <div className="notification-dropdown">
                                        <h4>Notifications</h4>
                                        {isLoading ? (
                                            <ul>
                                                <li>Loading...</li>
                                            </ul>
                                        ) : (
                                            <ul>
                                                {notificationsData.map((notification, index) => (
                                                    notification.type === "card_request" ?

                                                        <li key={index} style={{ cursor: "pointer" }} className={!notification.isRead ? "unread notf" : "notf"}>
                                                            <div onClick={() => toggleModelOpen(notification)} >
                                                                <div className="notification-header">
                                                                    <p className="notification-content">{notification.content}</p>

                                                                </div>

                                                                <Link to={`/admin/users/${notification.userId}/general`} className="user-email user-em">From: <span className="user-em">{notification.userEmail || 'N/A'}</span></Link>
                                                                {notification.status && (
                                                                    <span className="card-status" >Status: <span className={`${notification.status === "applied" ? "bg-warning badgea badge" : notification.status === "active" ? "badge-solved badgea" : notification.status === "open" ? "badge-open badgea" : ""}`}>{notification.status}</span></span>
                                                                )}
                                                                <span className="notification-time">{timeAgo(notification.createdAt)}</span>
                                                            </div>
                                                            {
                                                                notification.isRead === false ? (
                                                                    <button
                                                                        disabled={isDisable}
                                                                        className="mark-read-icon"
                                                                        title="Mark as Read"
                                                                        onClick={() => markAsRead(notification._id, true)}
                                                                    >
                                                                        <img src={emailImg} alt="" />
                                                                    </button>
                                                                ) :
                                                                    <button
                                                                        disabled={isDisable}
                                                                        className="mark-read-icon"
                                                                        onClick={() => markAsRead(notification._id, false)}
                                                                    >
                                                                        <img src={openEmailImg} alt="" />
                                                                    </button>
                                                            }

                                                        </li> : notification.type === "ticket_message" ?
                                                            <li key={index} className={!notification.isRead ? "unread notf" : "notf"}>
                                                                <Link to={`/admin/ticket/user/${notification.userId}/${notification.ticketId}`} onClick={() => markAsRead(notification._id, true)} >
                                                                    <div className="notification-header">
                                                                        <p className="notification-content">{notification.content}</p>

                                                                    </div>

                                                                    <p className="user-email user-e">From: <span className="user-e">{notification.userEmail || 'N/A'}</span></p>
                                                                    {/* {notification.status && (
                                                            <span className="card-status" >Status: <span className={`${notification.status === "applied" ? "bg-warning badgea badge" : notification.status === "active" ? "badge-solved badgea" : notification.status === "open" ? "badge-open badgea" : ""}`}>{notification.status}</span></span>
                                                        )} */}
                                                                    <span className="notification-time">{timeAgo(notification.createdAt)}</span>
                                                                </Link>
                                                                {
                                                                    notification.isRead === false ? (
                                                                        <button
                                                                            disabled={isDisable}
                                                                            className="mark-read-icon"
                                                                            title="Mark as Read"
                                                                            onClick={() => markAsRead(notification._id, true)}
                                                                        >
                                                                            <img src={emailImg} alt="" />
                                                                        </button>
                                                                    ) :
                                                                        <button
                                                                            disabled={isDisable}
                                                                            className="mark-read-icon"
                                                                            onClick={() => markAsRead(notification._id, false)}
                                                                        >
                                                                            <img src={openEmailImg} alt="" />
                                                                        </button>
                                                                }

                                                            </li> : ""


                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}

                            </div> : ""}

                    {/* User Avatar */}
                    <div className="group groupas inline-flex items-center justify-center text-right">
                        <div className="relative h-9 w-9 text-left">
                            <button className="group-hover:ring-primary-500 inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-offset-4">
                                <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-full">
                                    <img src={Log} className="max-w-full rounded-full object-cover shadow-sm" alt="User" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {modal3 && (
                <div className="this-model">
                    <div
                        className="modal fade show"
                        id="paymentModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="paymentModalLabel"
                        aria-modal="true"
                        style={{ display: "block" }}
                    >
                        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="paymentModalLabel">Crypto Card</h5>
                                    <Button variant="" onClick={toggleModelClose} className="btn-close">x</Button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="cardNumber">Card Number</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                                                id="cardNumber"
                                                placeholder="Enter card number"
                                                value={formData.cardNumber}
                                                onChange={handleChange}
                                                name="cardNumber"
                                            />
                                            {errors.cardNumber && (
                                                <div className="invalid-feedback">{errors.cardNumber}</div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cardHolder">Card Holder</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.cardHolder ? 'is-invalid' : ''}`}
                                                id="cardHolder"
                                                placeholder="Enter card holder name"
                                                value={formData.cardHolder}
                                                onChange={handleChange}
                                                name="cardHolder"
                                            />
                                            {errors.cardHolder && (
                                                <div className="invalid-feedback">{errors.cardHolder}</div>
                                            )}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="expiryDate">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                                                    id="expiryDate"
                                                    placeholder="MM/YY"
                                                    value={formData.expiryDate}
                                                    onChange={handleChange}
                                                    name="expiryDate"
                                                />
                                                {errors.expiryDate && (
                                                    <div className="invalid-feedback">{errors.expiryDate}</div>
                                                )}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="cvv">CVV</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                                                    id="cvv"
                                                    placeholder="CVV"
                                                    value={formData.cvv}
                                                    onChange={handleChange}
                                                    name="cvv"
                                                />
                                                {errors.cvv && (
                                                    <div className="invalid-feedback">{errors.cvv}</div>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={toggleModelClose}
                                        disabled={isDisable}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                        disabled={isDisable}
                                    >
                                        {isDisable ? (
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        ) : (
                                            "Create Card"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </>
    );
};

export default AdminHeader;
