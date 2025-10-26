import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { adminTicketsApi, signleUsersApi, deleteTicketApi } from '../../Api/Service';
import { toast } from 'react-toastify';
import SideBar from "../layouts/AdminSidebar/Sidebar";
import AdminHeader from "./adminHeader";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Alert as MuiAlert,
  CircularProgress
} from '@mui/material';
import {
  Support as SupportIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const AllTicket = () => {
    const Navigate = useNavigate();
    const authUser = useAuthUser();
    const [Admin, setAdmin] = useState("");
    const [tickets, setTickets] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [Active, setActive] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch tickets from the server with pagination
    const fetchTickets = async (page = 1, limit = 20, loadMore = false, statusFilter = filter) => {
        try {
            if (loadMore) {
                setLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            // Fetch tickets with pagination and user details already included from backend
            const params = { page, limit };
            if (statusFilter && statusFilter !== 'all') {
                params.status = statusFilter;
            }
            const response = await adminTicketsApi(params);

            console.log('Tickets API Response:', response);

            if (response && response.success) {
                const newTickets = response.tickets || [];
                const paginationData = response.pagination || {
                    currentPage: 1,
                    totalPages: 1,
                    hasMore: false,
                    totalCount: 0
                };

                console.log('New Tickets:', newTickets);
                console.log('Pagination:', paginationData);

                // Backend already provides tickets with user details and filtered for subadmin
                if (loadMore) {
                    setTickets(prev => [...prev, ...newTickets]);
                } else {
                    setTickets(newTickets);
                }

                // Update pagination state
                setCurrentPage(paginationData.currentPage);
                setTotalPages(paginationData.totalPages);
                setHasMore(paginationData.hasMore);
                setTotalCount(paginationData.totalCount);
            } else {
                console.error('API returned success: false or no response', response);
                setTickets([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Failed to load tickets');
            setTickets([]);
            setTotalCount(0);
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    };
    const toggleBar = () => {
        setActive(!Active);
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

        try { 
            const response = await deleteTicketApi(ticketToDelete._id);

            if (response.success) {
                toast.success('Ticket deleted successfully!')
                setTickets(tickets.filter(ticket => ticket._id !== ticketToDelete._id));
            } else {
                toast.error(response.msg || 'Failed to delete ticket.');
            }
        } catch (error) {
            console.error('Error deleting ticket:', error);
            toast.error('An error occurred while deleting the ticket.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteModal(false);
            setTicketToDelete(null);
        }
    };

    // Close delete modal
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setTicketToDelete(null);
    };

    // Load more tickets
    const loadMoreTickets = () => {
        if (!loadingMore && hasMore) {
            fetchTickets(currentPage + 1, 20, true, filter);
        }
    };

    // Handle filter change
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
        fetchTickets(1, 20, false, newFilter);
    };

    // Delete 
    useEffect(() => {
        fetchTickets(1, 20, false, filter);
    }, []); // Fetch tickets on component mount

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

    const getStatusColor = (status) => {
        switch(status) {
            case 'open':
                return { bg: 'rgba(255, 152, 0, 0.2)', color: '#ff9800' };
            case 'solved':
                return { bg: 'rgba(76, 175, 80, 0.2)', color: '#4caf50' };
            case 'awaiting reply':
                return { bg: 'rgba(33, 150, 243, 0.2)', color: '#2196f3' };
            default:
                return { bg: 'rgba(255, 255, 255, 0.1)', color: 'grey.400' };
        }
    };

    return (
        <div className="admin dark-new-ui">
            <div className="bg-gray-900 min-h-screen">
                <SideBar state={Active} toggle={toggleBar} />
                
                <div className="bg-gray-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
                    <div className="mx-auto w-full max-w-7xl">
                        <AdminHeader toggle={toggleBar} pageName="Support Tickets" />

            {isLoading ? (
                            <Box sx={{ width: '100%', p: 4 }}>
                                <LinearProgress
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: 'grey.800',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: 'primary.main'
                                        }
                                    }}
                                />
                                <Typography variant="h6" align="center" sx={{ mt: 2, color: 'grey.300' }}>
                                    Loading tickets...
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                                {/* Stats Cards */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card sx={{ 
                                            background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)',
                                            border: '1px solid rgba(66, 165, 245, 0.2)',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-4px)' }
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                                            {filter === 'all' ? 'Total Tickets' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Tickets`}
                                                        </Typography>
                                                        <Typography variant="h3" fontWeight="700" sx={{ color: 'white' }}>
                                                            {totalCount > 0 ? totalCount : tickets.length}
                                                        </Typography>
                                                    </Box>
                                                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(66, 165, 245, 0.2)' }}>
                                                        <SupportIcon sx={{ fontSize: 32, color: '#42a5f5' }} />
                                                    </Avatar>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card sx={{ 
                                            background: 'linear-gradient(135deg, #5f3a1e 0%, #8c5a2d 100%)',
                                            border: '1px solid rgba(255, 167, 38, 0.2)',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-4px)' }
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                                            Open Tickets
                                                        </Typography>
                                                        <Typography variant="h3" fontWeight="700" sx={{ color: 'white' }}>
                                                            {tickets.filter(t => t.status === 'open').length}
                                                        </Typography>
                                                    </Box>
                                                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(255, 152, 0, 0.2)' }}>
                                                        <HourglassIcon sx={{ fontSize: 32, color: '#ff9800' }} />
                                                    </Avatar>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card sx={{ 
                                            background: 'linear-gradient(135deg, #1e5f3a 0%, #2d8c5a 100%)',
                                            border: '1px solid rgba(76, 175, 80, 0.2)',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-4px)' }
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                                            Solved Tickets
                                                        </Typography>
                                                        <Typography variant="h3" fontWeight="700" sx={{ color: 'white' }}>
                                                            {tickets.filter(t => t.status === 'solved').length}
                                                        </Typography>
                                                    </Box>
                                                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(76, 175, 80, 0.2)' }}>
                                                        <CheckCircleIcon sx={{ fontSize: 32, color: '#4caf50' }} />
                                                    </Avatar>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card sx={{ 
                                            background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-4px)' }
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                                            Awaiting Reply
                                                        </Typography>
                                                        <Typography variant="h3" fontWeight="700" sx={{ color: 'white' }}>
                                                            {tickets.filter(t => t.status === 'awaiting reply').length}
                                                        </Typography>
                                                    </Box>
                                                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(33, 150, 243, 0.2)' }}>
                                                        <EmailIcon sx={{ fontSize: 32, color: '#2196f3' }} />
                                                    </Avatar>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Filter Section */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        mb: 4,
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: 3,
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={3}>
                                            <FormControl fullWidth size="small">
                                                <Select
                                        value={filter}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                                    displayEmpty
                                                    sx={{
                                                        color: 'grey.100',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        borderRadius: 2,
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'primary.main',
                                                            borderWidth: '2px'
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="all">All Status</MenuItem>
                                                    <MenuItem value="open">Open</MenuItem>
                                                    <MenuItem value="solved">Solved</MenuItem>
                                                    <MenuItem value="awaiting reply">Awaiting Reply</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Tickets Table */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: 3,
                                        overflow: 'hidden'
                                    }}
                                >
                                            {tickets.length > 0 ? (
                                                <>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ color: 'grey.400', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                            Ticket ID
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'grey.400', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                            Title
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'grey.400', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                            Status
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'grey.400', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                            User
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'grey.400', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                            Created
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'grey.400', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                            Latest Activity
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'grey.400', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                            Actions
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {tickets.map((ticket) => {
                                                        const statusColors = getStatusColor(ticket.status);
                                                        return (
                                                            <TableRow key={ticket._id}>
                                                                <TableCell sx={{ color: 'primary.light', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                                    {ticket.ticketId}
                                                                </TableCell>
                                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', maxWidth: 300 }}>
                                                                    <Typography variant="body2" noWrap>
                                                                        {ticket.title}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                                    <Chip
                                                                        label={ticket.status}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: statusColors.bg,
                                                                            color: statusColors.color,
                                                                            fontWeight: 600,
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                                    {ticket.userDetails && ticket.userDetails.signleUser ? (
                                                                        <Box 
                                                                            onClick={() => Navigate(`/admin/user/${ticket.user}/general`)}
                                                                            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                                                                        >
                                                                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                                                                                {ticket.userDetails.signleUser.firstName} {ticket.userDetails.signleUser.lastName}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ color: 'grey.400' }}>
                                                                        {ticket.userDetails.signleUser.email}
                                                                            </Typography>
                                                                        </Box>
                                                            ) : (
                                                                        <Typography variant="caption" sx={{ color: 'grey.500' }}>
                                                                    User not available
                                                                        </Typography>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell sx={{ color: 'grey.400', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                                    {formatDate(ticket.createdAt)}
                                                                </TableCell>
                                                                <TableCell sx={{ color: 'grey.400', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                                    {formatDate(ticket.updatedAt)}
                                                                </TableCell>
                                                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                                    <Stack direction="row" spacing={1}>
                                                                        <Button
                                                                            size="small"
                                                                            variant="contained"
                                                                            startIcon={<VisibilityIcon />}
                                                                onClick={() => Navigate(`/admin/ticket/user/${ticket.user}/${ticket.ticketId}`)}
                                                                            sx={{
                                                                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                                                                color: 'white !important',
                                                                                textTransform: 'none',
                                                                                '&:hover': {
                                                                                    background: 'linear-gradient(45deg, #1565c0, #1e88e5)',
                                                                                    color: 'white !important'
                                                                                }
                                                                            }}
                                                            >
                                                                View
                                                                        </Button>
                                                                        <IconButton
                                                                            size="small"
                                                                onClick={() => handleDeleteClick(ticket)}
                                                                disabled={deleteLoading}
                                                                            sx={{ 
                                                                                color: 'error.main',
                                                                                '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' }
                                                                            }}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                                    {/* Load More Button */}
                                                    {hasMore && (
                                                        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                            <Button
                                                                variant="contained"
                                                                onClick={loadMoreTickets}
                                                                disabled={loadingMore}
                                                                startIcon={loadingMore && <CircularProgress size={16} sx={{ color: 'white' }} />}
                                                                sx={{
                                                                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                                                    color: 'white !important',
                                                                    fontWeight: 'bold',
                                                                    px: 4,
                                                                    py: 1.5,
                                                                    borderRadius: 2,
                                                                    textTransform: 'none',
                                                                    fontSize: '0.95rem',
                                                                    '&:hover': {
                                                                        background: 'linear-gradient(45deg, #1565c0, #1e88e5)',
                                                                        transform: 'translateY(-2px)',
                                                                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                                                        color: 'white !important'
                                                                    },
                                                                    '&:disabled': {
                                                                        background: 'linear-gradient(135deg, #555 0%, #666 100%)',
                                                                        color: 'rgba(255, 255, 255, 0.5) !important'
                                                                    }
                                                                }}
                                                            >
                                                                {loadingMore ? 'Loading...' : `Load More (${currentPage}/${totalPages})`}
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </>
                                    ) : (
                                        <Box sx={{ p: 8, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <SupportIcon sx={{ fontSize: 64, color: 'grey.600', mb: 2 }} />
                                            <Typography variant="h6" sx={{ color: 'grey.400' }}>
                                                No tickets found
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'grey.500', mt: 1 }}>
                                                {filter !== 'all' ? 'Try changing the filter' : 'No support tickets available'}
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Box>
                        )}
                                </div>
                            </div>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={showDeleteModal}
                    onClose={handleCloseModal}
                    PaperProps={{
                        sx: {
                            backgroundColor: '#1e1e1e',
                            backgroundImage: 'none',
                            border: '1px solid #333',
                            borderRadius: 3
                        }
                    }}
                >
                    <DialogTitle sx={{ color: 'white', bgcolor: 'grey.900', borderBottom: '1px solid #333' }}>
                        Confirm Delete
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.400' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <DeleteIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                            <Typography variant="body1" sx={{ color: 'grey.300' }}>
                                Are you sure you want to delete ticket <strong style={{ color: 'white' }}>{ticketToDelete?.ticketId}</strong>?
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'grey.500', mt: 1 }}>
                            This action cannot be undone.
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ borderTop: '1px solid #333', bgcolor: 'grey.900', p: 2 }}>
                        <Button 
                            onClick={handleCloseModal} 
                            disabled={deleteLoading}
                            sx={{ color: 'grey.300 !important', borderColor: 'grey.600', '&:hover': { borderColor: 'grey.400' } }}
                        >
                                Cancel
                            </Button>
                        <Button 
                            onClick={handleConfirmDelete} 
                            disabled={deleteLoading}
                            variant="contained"
                            sx={{
                                bgcolor: 'error.main',
                                color: 'white !important',
                                '&:hover': { bgcolor: 'error.dark', color: 'white !important' }
                            }}
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                            </Button>
                    </DialogActions>
                </Dialog>
            </div>
                </div>
    );
};

export default AllTicket;
