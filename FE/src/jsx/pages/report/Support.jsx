import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SVGICON } from '../../constant/theme';
import Bitcoin from "../../../assets/images/img/btc.svg"
import EthLogo from "../../../assets/images/img/eth.svg"
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { createTicketApi, getsignUserApi, getUserTicketsApi, sendTicketApi } from "../../../Api/Service";
import axios from 'axios';
import { Button, Card, Col, Form, DropdownDivider, InputGroup, Modal, Row, Spinner, Container } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';


const Support = () => {
    const [Active, setActive] = useState(false);
    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };
    //

    let authUser = useAuthUser();
    let Navigate = useNavigate();

    const [isUser, setIsUser] = useState({});
    const [isTicket, setisTicket] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [allTickets, setallTickets] = useState({});
    const [description, setDescription] = useState("");
    const getsignUser = async () => {
        try {
            const formData = new FormData();
            formData.append("id", authUser().user._id);
            const userCoins = await getsignUserApi(formData);

            if (userCoins.success) {
                setIsUser(userCoins.signleUser);

                return;
            } else {
                toast.dismiss();
                toast.error(userCoins.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
        }
    };
    const getTickets = async () => {
        try {
            setisLoading(true);
            let id = authUser().user._id



            const userTickets = await getUserTicketsApi(id);


            if (userTickets.success) {
                const sortedTickets = userTickets.ticket.sort((a, b) => {
                    // Sort by updatedAt
                    if (new Date(b.updatedAt) - new Date(a.updatedAt) !== 0) {
                        return new Date(b.updatedAt) - new Date(a.updatedAt);
                    }
                    // If updatedAt is the same, sort by createdAt
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                setallTickets(sortedTickets);
                // setallTickets(userTickets.ticket)
                console.log("allTickets", allTickets);
                // setisTicket(true);
                return;
            } else {
                toast.dismiss();
                toast.error(userTickets.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisLoading(false);
        }
    };

    //

    useEffect(() => {
        getsignUser();
        if (authUser().user.role === "user") {
            getTickets()
            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
    }, []);
    useEffect(() => {
        const theme = document.body.getAttribute('data-theme-version');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
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
    return (
        <>
            <div className="row">
                <div className="col-xxl-12">
                    <div className="card new-bg-dark mt-2">
                        <Card.Header>
                            <Card.Title className='text-white'>My tickets</Card.Title>
                            <Card.Title> <Button onClick={() => Navigate("/create-ticket")}
                                className="me-2" variant="primary btn-rounded">
                                Create New <i class="fa-solid fa-plus"></i>
                            </Button></Card.Title>
                        </Card.Header>
                        <div className="card-body">
                            <div className="table-responsive">
                                {isLoading ? (
                                    <table style={{ textAlign: "center" }} className="table tbleas tbls100 tickettable display mb-4 no-footer" id="example6">
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: "center" }} colSpan="5">
                                                    <div className="spinner-grow" role="status">
                                                        <span className="visually-hidden">Loading...</span> {/* Updated for Bootstrap 5 */}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    Array.isArray(allTickets) && allTickets.length > 0 ? (
                                        <table className="table tbleas tickettable display mb-4 no-footer" id="example6">
                                            <thead>
                                                <tr>
                                                    <th className='tleft'>Subject</th>
                                                    <th>Id</th>
                                                    <th>Created</th>
                                                    <th>Last Activity</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allTickets.map((ticket, index) => (
                                                    <tr key={index}  onClick={() => Navigate(`/tickets/${ticket.ticketId}`)}>
                                                        <td className='tleft'>
                                                            <span className="font-w600 fs-14">{ticket.title}</span>
                                                        </td>
                                                        <td className="fs-14 font-w400">#{ticket.ticketId}</td>
                                                        <td>{ticket.createdAt ? formatDate(ticket.createdAt) : "N/A"}</td>
                                                        <td>{ticket.updatedAt ? formatDate(ticket.updatedAt) : "N/A"}</td>
                                                        <td className='text-center'>
                                                            {ticket.status === "open" ? (
                                                                <span className="badge-open badgea">{ticket.status}</span>
                                                            ) : ticket.status === "solved" ? (
                                                                <span className="badge-solved badgea">{ticket.status}</span>
                                                            ) : ticket.status === "awaiting reply" ?
                                                                <span className="bg-warning badgea badge">{ticket.status}</span> : "Unknown"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <table className="table tbleas tickettable display mb-4 no-footer" id="example6">
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5" className="text-center">No tickets available.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )
                                )}
                            </div>

                            {/* {isLoading ? (
                                <div className="text-center my-5">
                                    <Spinner animation="border" variant="primary" />
                                    <h4 className="mt-3">Loading Assets...</h4>
                                    <p>Please wait while we load the assets.</p>
                                </div>
                            ) : UserData === null || !UserData ? (
                                <div className="text-center my-5">
                                    <h4> No Assets found!</h4>
                                </div>) : (


                              
                            )} */}
                        </div>
                    </div>
                </div>
            </div>

            {/* <Card className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 rounded-xl px-4 py-10 sm:p-10 md:mx-0">
                                    {isTicket ? (
                                        <Card.Body className="">
                                            <p>Your ticket was sent. You will be answered by one of our representatives.</p>
                                        </Card.Body>
                                    ) : (
                                        <Card.Body>
                                            <div className="d-flex align-items-center gap-4 mb-4">
                                                <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle" style={{ width: '56px', height: '56px' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                                        <path d="M224 128a96 96 0 0 1-144.07 83.11l-37.39 12.47a8 8 0 0 1-10.12-10.12l12.47-37.39A96 96 0 1 1 224 128" opacity=".2" />
                                                        <path d="M128 24a104 104 0 0 0-91.82 152.88l-11.35 34.05a16 16 0 0 0 20.24 20.24l34.05-11.35A104 104 0 1 0 128 24m0 192a87.87 87.87 0 0 1-44.06-11.81a8 8 0 0 0-6.54-.67L40 216l12.47-37.4a8 8 0 0 0-.66-6.54A88 88 0 1 1 128 216" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="h5 font-weight-semibold">Create New Ticket</h3>
                                                    <p className="text-muted">Fill in the form below to create a new ticket</p>
                                                </div>
                                            </div>
                                            <Form>
                                                <Form.Group className="mb-4">
                                                    <Form.Label htmlFor="title">Ticket title</Form.Label>
                                                    <Form.Control
                                                        id="title"
                                                        type="text"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        placeholder="Example: I can't buy BTC with my credit card"
                                                        className="dark:bg-muted-900/75 dark:text-muted-200"
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-4">
                                                    <Form.Label htmlFor="description">Long description</Form.Label>
                                                    <Form.Control
                                                        id="description"
                                                        as="textarea"
                                                        rows={5}
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        placeholder="Example: I'm trying to buy BTC with my credit card but I'm getting an error message saying that my card is not supported. I've tried with 2 different cards and I'm getting the same error. Can you please help me?"
                                                        className="dark:bg-muted-900/75 dark:text-muted-200"
                                                    />
                                                </Form.Group>
                                                <Button
                                                    onClick={sendTicket}
                                                    disabled={isDisable}
                                                    variant="primary"
                                                    className="w-100"
                                                >
                                                    {isDisable ? (
                                                        <div className="spinner-border text-light" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    ) : (
                                                        'Create'
                                                    )}
                                                </Button>
                                            </Form>
                                        </Card.Body>
                                    )}
                                </Card> */}
        </>

    );
};

export default Support;
