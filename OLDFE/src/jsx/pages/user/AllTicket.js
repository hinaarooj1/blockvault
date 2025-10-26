import React, { useEffect, useRef, useState } from 'react';
import './AllTicket.css'; // Import your custom CSS
// import profilePic from './path_to_your_profile_picture.jpg'; // Update the path to your profile picture
import profile from "../../../assets/images/7309681.jpg";
import adminDp from "../../../assets/admin.jpg";
import { format, isWithinInterval, subDays, differenceInDays } from 'date-fns';

import LogoNew from '../../../assets/images/logo.png'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Dropdown, Spinner } from 'react-bootstrap';
import { useAuthUser } from 'react-auth-kit';
import { getIndivTicketApi, updateMessageApi } from '../../../Api/Service';
import { toast } from 'react-toastify';
import TicketHeader from './TicketHeader';

const AllTicket = () => {

    const messagesEndRef = useRef(null);
    let Navigate = useNavigate()
    const authUser = useAuthUser();
    const [isDisable, setIsDisable] = useState(false);
    const [Admin, setAdmin] = useState("");
    const [isLoading, setisLoading] = useState(true);
    const [Ticket, setTicket] = useState({});
    let { ticketId } = useParams()
    const [messages, setMessages] = useState([]); // New state for messages
    const [newMessage, setNewMessage] = useState("");
    const getTickets = async () => {
        try {
            // setisLoading(true);

            let id = authUser().user._id


            const indivTicket = await getIndivTicketApi(id, ticketId);


            if (indivTicket.success) {
                if (indivTicket.ticket.length <= 0 || indivTicket === undefined) {
                    Navigate("/support")
                    return
                }
                setisLoading(false);
                const ticketData = indivTicket.ticket[0];
                console.log('ticketData: ', indivTicket);
                setTicket(ticketData);
                setMessages(ticketData.ticketContent);
                console.log('ticketData.ticketContent: ', ticketData.ticketContent);
                return;
            } else {
                toast.dismiss();
                toast.error(indivTicket.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
        }
    };
    useEffect(() => {
        if (authUser().user.role === "user") {
            setAdmin(authUser().user);
            getTickets()
            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
        console.log("messages", messages);
    }, []);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInTime = now - date; // Difference in milliseconds

        const diffInSeconds = Math.floor(diffInTime / 1000); // Convert to seconds
        const diffInMinutes = Math.floor(diffInSeconds / 60); // Convert to minutes
        const diffInHours = Math.floor(diffInMinutes / 60); // Convert to hours
        const diffInDays = Math.floor(diffInHours / 24); // Convert to days

        if (diffInSeconds < 60) {
            return "just now"; // Less than 1 minute
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`; // Less than 60 minutes
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`; // Less than 24 hours
        } else if (diffInDays < 30) {
            return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`; // Less than 30 days
        } else {
            return date.toLocaleDateString(); // Fallback to formatted date
        }
    };
    const formatMessage = (message) => {
        return message.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };


    const formatDateNew = (dateString) => {
        const date = new Date(dateString);

        // Check for valid date
        if (isNaN(date.getTime())) {
            console.error("Invalid date value:", dateString);
            return "Invalid date"; // or return a default string
        }

        const now = new Date();

        // Check if the date is within the last week
        if (isWithinInterval(date, { start: subDays(now, 7), end: now })) {
            // Format for last week
            return format(date, 'EEEE \'at\' HH:mm');
        } else {
            // Format for older dates
            return format(date, 'MMMM d, yyyy HH:mm');
        }
    };
    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            toast.error("Message cannot be empty");
            return;
        }

        try {
            setIsDisable(true)
            const messageData = {
                status: "open",
                userId: authUser().user._id,
                ticketId,
                sender: authUser().user.role, // Or pass a role/identifier
                description: newMessage
            };

            const response = await updateMessageApi(messageData); // Make the API call

            if (response.success) {
                toast.success("Ticket updated successfully!");
                // Update messages array
                setNewMessage(""); // Clear the textarea
                getTickets()
            } else {
                toast.error(response.msg);
            }
        } catch (error) {
            toast.error("Failed to submit the ticket.");
        } finally {
            setIsDisable(false)

        }
    };
    const isTicketClosed = () => {
        if (Ticket.status === "open") {
            return false; // Ticket cannot be closed if its status is "open"
        }
        const lastActivityDate = new Date(Ticket.updatedAt);
        const currentDate = new Date();
        const daysSinceLastActivity = differenceInDays(currentDate, lastActivityDate);
        return daysSinceLastActivity > 30; // Ticket is closed if last activity was more than 30 days ago
    };
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    return (
        <>
            <TicketHeader Admin={Admin} />
            {
                isLoading ? <div className="d-flex new-bg-light justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Spinner animation="border" variant="primary" />
                    <div style={{ opacity: 0, position: "absolute", left: "-2000%" }}></div>
                </div> : <div  style={{minHeight:"100vh"}} className='  new-bg-light saasasa  '>

                    <div className="container paddint mt-4">
                        {/* Bootstrap Navbar */}

                        {/* Ticket Section */}
                        <div className="row">
                            {/* Left Side: Ticket Messages */}
                            <div className="col-md-8 mb-3">
                                <h2 className="mb-4   fla"><span style={{ marginRight: "20px", cursor: "pointer" }} onClick={() => Navigate("/support")}><i style={{ fontSize: "23px" }} className="fa-solid fa-arrow-left"></i> </span>{Ticket.title}

                                    {Ticket.status === "open" ?

                                        <span className="badge-open badgea">{Ticket.status}</span> : Ticket.status === "solved" ? <span className="badge-solved badgea">{Ticket.status}</span> : Ticket.status === "awaiting reply" ?
                                            <span className="bg-warning badgea badge">{Ticket.status}</span> :

                                            "Unknown"}
                                </h2>
                                {messages.map((message, index) => (
                                    <div key={index} className=" mb-4 p-4     tckt0mn">
                                        <div className="d-flex align-items-start">

                                            <div>
                                                {
                                                    message.sender === "user" ?
                                                        <h5 className="card-title text-white" style={{ display: 'flex', alignItems: 'center', textTransform: "capitalize" }}> <img src={profile} alt="Profile" className="profile-pic me-3" /> <span> {Admin.firstName} {Admin.lastName}</span></h5>
                                                        : message.sender === "admin" ?

                                                            <h5 className="card-title text-white" style={{ display: 'flex', alignItems: 'center', textTransform: "capitalize" }}> <img src={adminDp} alt="Profile" className="profile-pic me-3" /> <span> Support Team</span></h5>

                                                            : ""
                                                }
                                                <p className="card-text py-4" >

                                                    {formatMessage(message.description)}
                                                </p>

                                                <p className="card-text"><small className="text-muted">{formatDate(message.createdAt)}</small></p>
                                            </div>
                                        </div>

                                        <div ref={messagesEndRef} />
                                    </div>
                                ))}
                                {/* Ticket Message */}


                                {isTicketClosed() ? (
                                    <h5 className="text-muted font-bold text-white">This request is closed for comments. You can <Link style={{ textDecoration: "underline" }} to="/create-ticket">create a new ticket</Link>.</h5>
                                ) : (
                                    <>
                                        <div className="form-group mb-4 mt-5">
                                            <p htmlFor="message" className='bold mb-1'>Send a Message:</p>
                                            <textarea
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                className="form-control new-bg-light"
                                                id="message"
                                                rows="3"
                                                
                                                placeholder="Type your message here..."
                                            ></textarea>
                                        </div>
                                        <button disabled={isDisable} onClick={handleSendMessage} className="btn btn-primary">  {isDisable ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>{" "}
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit"
                                        )}</button>
                                    </>
                                )}
                            </div>

                            {/* Right Side: Ticket Info */}
                            <div className="col-md-4">
                                <h2 className="mb-4">Ticket Info</h2>
                                <div className="card mb-4 border-infoas">
                                    <div className="card-body">
                                        <p><strong>ID:</strong> <span className="">{Ticket.ticketId}</span></p>
                                        <p><strong>Created:</strong> <span className="">{formatDateNew(Ticket.createdAt)}</span></p>
                                        <p><strong>Last Activity:</strong> <span className="">{formatDateNew(Ticket.updatedAt)}</span></p>
                                        <p><strong>Status:</strong>   {Ticket.status === "open" ?

                                            <span className="badge-open badgea">{Ticket.status}</span> : Ticket.status === "solved" ? <span className="badge-solved badgea">{Ticket.status}</span> : Ticket.status === "awaiting reply" ?
                                                <span className="bg-warning badgea badge">{Ticket.status}</span> :

                                                "Unknown"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div></div>
            }
        </>

    );
}

export default AllTicket;
