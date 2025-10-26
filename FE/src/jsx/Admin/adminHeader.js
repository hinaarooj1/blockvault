import React, { useEffect, useRef, useState } from 'react';
import Log from "../../assets/images/img/log.jpg";
import './card.css';
import './NotificationDropdown.css';
import { deleteAllNotificationsApi, deleteNotificationApi, getNotificationsApi, updateNotificationStatusApi, userCryptoCardApi } from '../../Api/Service';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { IconButton, Tooltip, CircularProgress, Button } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  CreditCard as CreditCardIcon,
  Support as SupportIcon,
  VerifiedUser as VerifiedUserIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon
} from '@mui/icons-material';

const AdminHeader = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isDisable, setisDisable] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [notificationsData, setnotificationsData] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [temporaryUser, settemporaryUser] = useState(null);
    const [isAdmin, setisAdmin] = useState(null);
    const dropdownRef = useRef(null);
    let Navigate = useNavigate();
    const [modal3, setModal3] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Form state for crypto card
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: ""
    });

    let authUser = useAuthUser();

    const notifications = async (page = 1, limit = 10, loadMore = false) => {
        try {
            if (loadMore) {
                setLoadingMore(true);
            } else {
                setisLoading(true);
            }
            
            const response = await getNotificationsApi({ page, limit });

            if (response.success) {
                const { notifications: newNotifications, pagination } = response;
                
                setCurrentPage(pagination.currentPage);
                setTotalPages(pagination.totalPages);
                setHasMore(pagination.hasMore);
                
                const unreadExists = newNotifications.some(n => n.isRead === false);
                setHasUnread(unreadExists);

                if (loadMore) {
                    setnotificationsData(prev => [...prev, ...newNotifications]);
                } else {
                    setnotificationsData(newNotifications);
                }
            } else {
                toast.error(response.msg);
            }
        } catch (error) {
            console.error('Notification fetch error:', error);
            toast.error('Failed to load notifications');
        } finally {
            setisLoading(false);
            setLoadingMore(false);
        }
    };
    
    const loadMoreNotifications = () => {
        if (!loadingMore && hasMore) {
            notifications(currentPage + 1, 10, true);
        }
    };

    let markAsRead = async (id, status) => {
        setisDisable(true);
        const updateNotificationStatus = await updateNotificationStatusApi(id, status);

        if (updateNotificationStatus.success) {
            setnotificationsData((prevData) => {
                const updated = prevData.map((n) =>
                    n._id === id ? { ...n, isRead: status } : n
                );
                const anyUnread = updated.some(n => !n.isRead);
                setHasUnread(anyUnread);
                return updated;
            });
        } else {
            toast.error("Failed to update notification status");
        }
        setisDisable(false);
    };

    const deleteNotification = async (id) => {
        try {
            setisDisable(true);
            const response = await deleteNotificationApi(id);

            if (response.success) {
                setnotificationsData(prevData => {
                    const updated = prevData.filter(n => n._id !== id);
                    const anyUnread = updated.some(n => !n.isRead);
                    setHasUnread(anyUnread);
                    return updated;
                });
                toast.success("Notification deleted successfully");
            } else {
                toast.error(response.msg);
            }
        } catch (error) {
            toast.error("Error deleting notification");
        } finally {
            setisDisable(false);
        }
    };

    const deleteAllNotifications = async () => {
        try {
            setisDisable(true);
            const response = await deleteAllNotificationsApi();

            if (response.success) {
                setnotificationsData([]);
                setHasUnread(false);
                toast.success("All notifications deleted successfully");
            } else {
                toast.error(response.msg);
            }
        } catch (error) {
            toast.error("Error deleting all notifications");
        } finally {
            setisDisable(false);
        }
    };

    let toggleModelOpen = async (notification) => {
        setFormData({
            cardNumber: "",
            cardHolder: notification.userName || "",
            expiryDate: "",
            cvv: ""
        });
        settemporaryUser(notification);
        setModal3(true);
    };

    let toggleModelClose = () => {
        settemporaryUser(null);
        setModal3(false);
        setErrors({});
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async () => {
        const newErrors = {};
        if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
        if (!formData.cardHolder) newErrors.cardHolder = "Card holder is required";
        if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
        if (!formData.cvv) newErrors.cvv = "CVV is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setisDisable(true);
            const response = await userCryptoCardApi(temporaryUser.userId, formData);
            if (response.success) {
                toast.success("Card created successfully!");
                toggleModelClose();
                notifications(1, 10);
            } else {
                toast.error(response.msg);
            }
        } catch (error) {
            toast.error("Error creating card");
        } finally {
            setisDisable(false);
        }
    };

    useEffect(() => {
        notifications(1, 10);
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
        if (authUser().user.role === "admin") {
            setisAdmin("admin");
        } else if (authUser().user.role === "superadmin") {
            setisAdmin("superadmin");
        } else if (authUser().user.role === "subadmin") {
            setisAdmin("subadmin");
        } else {
            setisAdmin(null);
        }
    }, []);

    // Render notification item
    const renderNotificationItem = (notification, index) => {
        const getNotificationIcon = (type) => {
            switch (type) {
                case "card_request":
                    return <CreditCardIcon />;
                case "ticket_message":
                    return <SupportIcon />;
                case "KYC_request":
                    return <VerifiedUserIcon />;
                case "withdraw_request":
                    return <AccountBalanceWalletIcon />;
                default:
                    return <NotificationsIcon />;
            }
        };

        const getAvatarClass = (type) => {
            switch (type) {
                case "card_request":
                    return "card";
                case "ticket_message":
                    return "ticket";
                case "KYC_request":
                    return "kyc";
                case "withdraw_request":
                    return "withdraw";
                default:
                    return "card";
            }
        };

        const isUnread = !notification.isRead;
        const linkPath = 
            notification.type === "card_request" ? null :
            notification.type === "ticket_message" ? `/admin/ticket/user/${notification.userId}/${notification.ticketId}` :
            notification.type === "KYC_request" ? `/admin/users/${notification.userId}/verifications` :
            notification.type === "withdraw_request" ? `/admin/users/${notification.userId}/transactions` :
            `/admin/dashboard`;

        const handleClick = () => {
            if (notification.type === "card_request") {
                toggleModelOpen(notification);
            } else if (linkPath) {
                Navigate(linkPath);
                markAsRead(notification._id, true);
            }
        };

        return (
            <div 
                key={index} 
                className={`notification-item ${isUnread ? 'unread' : ''}`}
                onClick={handleClick}
            >
                <div className={`notification-avatar ${getAvatarClass(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-details">
                    <div className="notification-message">
                        {notification.content}
                    </div>
                    
                    <div className="notification-meta">
                        <Link 
                            to={`/admin/user/${notification.userId}/general`}
                            className="notification-email"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <EmailIcon style={{ fontSize: 14 }} />
                            {notification.userEmail || 'N/A'}
                        </Link>
                        
                        {notification.status && (
                            <span className={`notification-status-chip ${notification.status.toLowerCase()}`}>
                                {notification.status}
                            </span>
                        )}
                        
                        <span className="notification-time">
                            <ScheduleIcon style={{ fontSize: 12 }} />
                            {timeAgo(notification.createdAt)}
                        </span>
                    </div>
                </div>
                
                <div className="notification-actions">
                    <Tooltip title={isUnread ? "Mark as Read" : "Mark as Unread"} arrow>
                        <button
                            className="notification-action-btn mark-read"
                            disabled={isDisable}
                            onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification._id, !isUnread);
                            }}
                        >
                            {isUnread ? <MarkEmailReadIcon /> : <MarkEmailUnreadIcon />}
                        </button>
                    </Tooltip>
                    
                    <Tooltip title="Delete Notification" arrow>
                        <button
                            className="notification-action-btn delete"
                            disabled={isDisable}
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification._id);
                            }}
                        >
                            <DeleteIcon />
                        </button>
                    </Tooltip>
                </div>
            </div>
        );
    };

    // Skeleton Loader
    const renderSkeleton = () => (
        <div className="notification-skeleton">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-item">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line short"></div>
                        <div className="skeleton-line medium"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <div className="relative topakd z-50 mb-5 flex h-16 items-center gap-2 px-4">
                <button 
                    onClick={() => Navigate(-1)} 
                    type="button" 
                    className="flex groupas h-10 for-desk w-10 items-center justify-center -ms-3"
                >
                    <div className="relative h-5 w-5 scale-90">
                        <span className="bg-primary-500 absolute block h-0.5 w-full top-0.5 -rotate-45" />
                        <span className="bg-primary-500 absolute top-1/2 block h-0.5 w-full opacity-0" />
                        <span className="bg-primary-500 absolute block h-0.5 w-full bottom-0 rotate-45" />
                    </div>
                </button>

                <button 
                    onClick={props.toggle} 
                    type="button" 
                    className="flex groupas for-mbl h-10 w-10 items-center justify-center -ms-3"
                >
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
                    {(isAdmin === "admin" || isAdmin === "superadmin" || isAdmin === "subadmin") && (
                        <div ref={dropdownRef} style={{ position: 'relative' }}>
                            <Tooltip title="Notifications" arrow>
                                <IconButton
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="notification-bell-btn"
                                >
                                    {hasUnread && <span className="notification-badge">!</span>}
                                    {hasUnread ? 
                                        <NotificationsActiveIcon style={{ fontSize: 28, color: 'white' }} /> : 
                                        <NotificationsIcon style={{ fontSize: 28, color: 'white' }} />
                                    }
                                </IconButton>
                            </Tooltip>

                            {dropdownOpen && (
                                <div className="notification-dropdown">
                                    {/* Header */}
                                    <div className="notification-header">
                                        <div className="notification-header-left">
                                            <div className="notification-header-icon">
                                                <NotificationsIcon style={{ fontSize: 20, color: '#64b5f6' }} />
                                            </div>
                                            <h3 className="notification-header-title">Notifications</h3>
                                            {notificationsData.length > 0 && (
                                                <span className="notification-count-badge">
                                                    {notificationsData.length}
                                                </span>
                                            )}
                                        </div>
                                        {notificationsData.length > 0 && isAdmin !== "subadmin" && (
                                            <Tooltip title="Delete All Notifications" arrow>
                                                <button 
                                                style={{color:"red",paddingInline:"5px"}}
                                                    className="delete-all-btn"
                                                    onClick={deleteAllNotifications}
                                                    disabled={isDisable}
                                                >
                                                    <DeleteSweepIcon style={{ fontSize: 18 }} />
                                                    Delete All
                                                </button>
                                            </Tooltip>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="notification-content">
                                        {isLoading ? (
                                            renderSkeleton()
                                        ) : notificationsData.length === 0 ? (
                                            <div className="notification-empty">
                                                <NotificationsIcon className="notification-empty-icon" />
                                                <h4 className="notification-empty-title">No notifications yet</h4>
                                                <p className="notification-empty-subtitle">You're all caught up!</p>
                                            </div>
                                        ) : (
                                            notificationsData.map((notification, index) => 
                                                renderNotificationItem(notification, index)
                                            )
                                        )}
                                    </div>
                                    
                                    {/* Load More Button */}
                                    {hasMore && !isLoading && (
                                        <div className="load-more-container">
                                            <button
                                                className="load-more-btn"
                                                onClick={loadMoreNotifications}
                                                disabled={loadingMore}
                                            >
                                                {loadingMore ? (
                                                    <div  className='flex items-center justify-center'>
                                                        <CircularProgress size={16} style={{ color: 'white', marginRight: 8 }} />
                                                        Loading...
                                                    </div>
                                                ) : (
                                                    <div className='flex items-center justify-center'>
                                                        <ExpandMoreIcon style={{ fontSize: 20 }} />
                                                       <p> Load More ({currentPage}/{totalPages})</p>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

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

            {/* Modal for Crypto Card */}
            {modal3 && (
                <div className="this-model ASMD">
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
