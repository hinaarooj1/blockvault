import React, { useEffect, useState } from 'react';

import { Spinner, Modal, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { adminTicketsApi, signleUsersApi,deleteTicketApi } from '../../Api/Service';
import TicketHeader from '../pages/user/TicketHeader';
import { toast } from 'react-toastify';

const AllTicket = () => {
    const Navigate = useNavigate();
    const authUser = useAuthUser();
    const [Admin, setAdmin] = useState("");
    const [tickets, setTickets] = useState([]); // State to store tickets
    const [filter, setFilter] = useState('all'); // State to manage filter selection
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // Fetch tickets from the server
    const fetchTickets = async () => {
        try {
            console.log('Admin: ', Admin);
            setIsLoading(true);
            const allTickets = await adminTicketsApi();

            if (allTickets.success) {
                const sortedTickets = allTickets.tickets.sort((a, b) => {
                    // Sort by updatedAt first, then by createdAt
                    return new Date(b.updatedAt) - new Date(a.updatedAt) || new Date(b.createdAt) - new Date(a.createdAt);
                });

                // Fetch user details for each ticket
                const ticketsWithUserDetails = await Promise.all(
                    sortedTickets.map(async (ticket) => {
                        try {
                            const userDetails = await signleUsersApi(ticket.user); // Fetch user details using user ID
                            return { ...ticket, userDetails }; // Merge user details into ticket object
                        } catch (error) {
                            console.error(`Error fetching user details for ticket ${ticket.ticketId}:`, error);
                            return { ...ticket, userDetails: null }; // Handle case if user details are not fetched
                        }
                    })
                );

                // Filter tickets based on role
                console.log('ticketsWithUserDetails: ', ticketsWithUserDetails);
                let filteredTickets = ticketsWithUserDetails;

                if (authUser().user.role === "subadmin") {
                    filteredTickets = ticketsWithUserDetails.filter(ticket =>
                        ticket.userDetails.signleUser &&
                        (ticket.userDetails.signleUser.isShared === true ||
                            ticket.userDetails.signleUser.assignedSubAdmin === authUser().user._id)
                    );
                }
                console.log('filteredTickets: ', filteredTickets);

                setTickets(filteredTickets); // Store only filtered and processed tickets
            }

        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setIsLoading(false);
        }
    };
    // Delete 
    const handleDeleteClick = (ticket) => {
        setTicketToDelete(ticket);
        setShowDeleteModal(true);
    };

    // Handle actual deletion
    const handleConfirmDelete = async () => {
        if (!ticketToDelete) return;

        setDeleteLoading(true);
        setError(null);
        setSuccess(null);

        try { 
            const response = await deleteTicketApi(ticketToDelete._id);

            if (response.success) {
                setSuccess('Ticket deleted successfully!');
                toast.success('Ticket deleted successfully!')
                // Remove the deleted ticket from state
                setTickets(tickets.filter(ticket => ticket._id !== ticketToDelete._id));
            } else {
                setError(response.message || 'Failed to delete ticket.');
            }
        } catch (error) {
            console.error('Error deleting ticket:', error);
            setError('An error occurred while deleting the ticket.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteModal(false);
            setTicketToDelete(null);

            // Clear success/error messages after 3 seconds
            setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 3000);
        }
    };

    // Close delete modal
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setTicketToDelete(null);
    };

    // Delete 
    useEffect(() => {
        fetchTickets();
    }, []); // Fetch tickets on component mount

    // Filter tickets based on selected filter
    const filteredTickets = tickets.filter(ticket => {
        if (filter === 'all') return true; // Show all tickets
        return ticket.status === filter; // Show tickets matching the selected filter
    });

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
    useEffect(() => {
        if (authUser().user.role === "user") {
            Navigate("/dashboard");
            return;
        } else if (authUser().user.role === "admin") {
            setAdmin(authUser().user);
        } else if (authUser().user.role === "subadmin") {
            setAdmin(authUser().user);
        }
    }, []);

    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="bgas">
                    <div className="container paddint mt-4">
                        <TicketHeader Admin={Admin} />
                        {success && (
                            <Alert variant="success" className="mb-3">
                                {success}
                            </Alert>
                        )}
                        {error && (
                            <Alert variant="danger" className="mb-3">
                                {error}
                            </Alert>
                        )}

                        <div className="row">
                            <div className="col-md-12">
                                <h2>Support Tickets</h2>
                                {/* Filter Dropdown */}
                                <div className="mb-3">
                                    <label htmlFor="filterSelect">Filter by Status:</label>
                                    <select
                                        id="filterSelect"
                                        className="form-select"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <option value="all">All</option>
                                        <option value="open">Open</option>
                                        <option value="solved">Solved</option>
                                        <option value="awaiting reply">Awaiting Reply</option>
                                    </select>
                                </div>

                                {/* Display filtered tickets */}
                                <div className="table-responsive">
                                    <table className="table tbb table-bordered">
                                        <thead>
                                            <tr className='taj'>
                                                <th>Ticket ID</th>
                                                <th className='lefts'>Title</th>
                                                <th>Status</th>
                                                <th>Created At</th>
                                                <th>Latest Activity</th> {/* New column for Latest Activity */}
                                                <th>User Details</th> {/* Combined User Name and Email */}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTickets.length > 0 ? (
                                                filteredTickets.map((ticket, index) => (
                                                    <tr className='tram' key={index}>
                                                        <td>{ticket.ticketId}</td>
                                                        <td className='lefts maxp'>{ticket.title}</td>
                                                        <td>
                                                            {ticket.status === 'open' ? (
                                                                <span className="badge-open badgea">Open</span>
                                                            ) : ticket.status === 'solved' ? (
                                                                <span className="badge-solved badgea">Solved</span>
                                                            ) : (
                                                                <span className="badge bg-warning">Awaiting Reply</span>
                                                            )}
                                                        </td>
                                                        <td>{formatDate(ticket.createdAt)}</td>
                                                        <td>{formatDate(ticket.updatedAt)}</td> {/* Display Latest Activity */}
                                                        {
                                                            ticket.userDetails && ticket.userDetails.signleUser ? (
                                                                <td className='td-data' onClick={() => Navigate(`/admin/users/${ticket.user}/general`)}>


                                                                    <>
                                                                        {ticket.userDetails.signleUser.firstName} {ticket.userDetails.signleUser.lastName} <br />
                                                                        {ticket.userDetails.signleUser.email}
                                                                    </>

                                                                </td>
                                                            ) : (
                                                                <td className='td-data'  >
                                                                    User not available

                                                                </td>
                                                            )}
                                                        <td>

                                                            <button
                                                                className="btn btn-info"
                                                                onClick={() => Navigate(`/admin/ticket/user/${ticket.user}/${ticket.ticketId}`)}
                                                            >
                                                                View
                                                            </button>{" "}
                                                            <button
                                                                className="btn  btn-danger "
                                                                onClick={() => handleDeleteClick(ticket)}
                                                                disabled={deleteLoading}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center">No tickets available.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal show={showDeleteModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete ticket <strong>{ticketToDelete?.ticketId}</strong>?
                            This action cannot be undone.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal} disabled={deleteLoading}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleConfirmDelete} disabled={deleteLoading}>
                                {deleteLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </>
    );
};

export default AllTicket;
