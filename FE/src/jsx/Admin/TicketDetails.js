import React, { useEffect, useRef, useState } from 'react';
import profile from "../../assets/images/7309681.jpg";
import adminDp from "../../assets/admin.jpg";
import { format, isWithinInterval, subDays, differenceInDays } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { allUsersApi, getIndivTicketApi, signleUsersApi, updateMessageApi } from '../../Api/Service';
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
  TextField,
  Paper,
  Avatar,
  Stack,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  Divider,
  IconButton
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Support as SupportIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const AllTicket = () => {
    const messagesEndRef = useRef(null);
    const Navigate = useNavigate();
    const authUser = useAuthUser();
    const [isDisable, setIsDisable] = useState(false);
    const [Admin, setAdmin] = useState("");
    const [isLoading, setisLoading] = useState(true);
    const [Ticket, setTicket] = useState({});
    const { ticketId, id } = useParams();
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [TicketUser, setTicketUser] = useState("");
    const [Active, setActive] = useState(false);

    const toggleBar = () => {
        setActive(!Active);
    };
    const getTickets = async (showLoading = true) => {
        try {
            if (showLoading) setisLoading(true);
            
            if (authUser().user.role === "subadmin") {
                // Get user ID from params
                const allUsers = await allUsersApi();

                if (!allUsers || !Array.isArray(allUsers.allUsers) || allUsers.allUsers.length === 0) {
                    toast.error("Unable to fetch users");
                    if (showLoading) setisLoading(false);
                    return;
                }

                // Find the specific user by ID and check permissions
                const user = allUsers.allUsers.find(user => user._id === id);

                if (!user) {
                    toast.error("User not found");
                    if (showLoading) setisLoading(false);
                    return;
                }

                const hasPermission = user.isShared === true ||
                    (user.isShared === false && user.assignedSubAdmin === authUser().user._id);

                if (!hasPermission) {
                    toast.error("You don't have permission to view this ticket");
                    if (showLoading) setisLoading(false);
                    Navigate("/admin/support");
                    return;
                }
            }

            const indivTicket = await getIndivTicketApi(id, ticketId);if (indivTicket.success) {
                if (!indivTicket.ticket || indivTicket.ticket.length <= 0) {
                    toast.error("Ticket not found");
                    if (showLoading) setisLoading(false);
                    Navigate("/admin/support");
                    return;
                }
                
                const ticketData = indivTicket.ticket[0];
                setTicket(ticketData);
                setMessages(ticketData.ticketContent || []);

                const userDetails = await signleUsersApi(ticketData.user);
                if (userDetails.success) {
                    setTicketUser(userDetails.signleUser);
                } else {
                    setTicketUser(null);
                }
            } else {
                toast.dismiss();
                toast.error(indivTicket.msg || 'Failed to fetch ticket');
            }
        } catch (error) {
            console.error('Error fetching ticket:', error);
            toast.dismiss();
            toast.error(error?.message || 'An error occurred while fetching the ticket');
        } finally {
            if (showLoading) setisLoading(false);
        }
    };

    useEffect(() => {
        const user = authUser()?.user;
        if (!user) {
            Navigate("/login");
            return;
        }

        if (user.role === "admin" || user.role === "subadmin" || user.role === "superadmin") {
            setAdmin(user);
            getTickets();
        } else if (user.role === "user") {
            Navigate("/dashboard");
        } else {
            Navigate("/login");
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
        if (!status || status === "") {
            toast.error("Please select new status for the ticket");
            return;

        }
        try {
            setIsDisable(true)
            const messageData = {
                status: status,
                userId: id,
                ticketId,
                sender: "admin", // Or pass a role/identifier
                description: newMessage
            };

            const response = await updateMessageApi(messageData); // Make the API call

            if (response.success) {
                toast.success("Ticket updated successfully!");
                // Update messages array
                setNewMessage(""); // Clear the textarea
                setStatus(""); // Clear the status
                // Don't refresh immediately - let the email failure flag be added first
                setTimeout(() => {
                    getTickets(false); // Refresh after a delay to allow email processing
                }, 2000);
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
        setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }, [messages]);

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

    const statusColors = Ticket.status ? getStatusColor(Ticket.status) : { bg: 'rgba(255, 255, 255, 0.1)', color: 'grey.400' };

    return (
        <div className="admin dark-new-ui">
            <div className="bg-gray-900 min-h-screen">
                <SideBar state={Active} toggle={toggleBar} />
                
                <div className="bg-gray-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
                    <div className="mx-auto w-full max-w-7xl">
                        <AdminHeader toggle={toggleBar} pageName="Ticket Details" />

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
                                    Loading ticket details...
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                                {/* Back Button & Ticket Title */}
                                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconButton 
                                        onClick={() => Navigate("/admin/support")}
                                        sx={{ 
                                            color: 'primary.main',
                                            bgcolor: 'rgba(66, 165, 245, 0.1)',
                                            '&:hover': { bgcolor: 'rgba(66, 165, 245, 0.2)' }
                                        }}
                                    >
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                        {Ticket.title}
                                    </Typography>
                                    <Chip
                                        label={Ticket.status}
                                        size="medium"
                                        sx={{
                                            bgcolor: statusColors.bg,
                                            color: statusColors.color,
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </Box>

                                <Grid container spacing={3}>
                                    {/* Left Side: Messages */}
                                    <Grid item xs={12} md={8}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                background: 'rgba(255, 255, 255, 0.02)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                borderRadius: 3,
                                                p: 3,
                                                mb: 3
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                                                Messages
                                            </Typography>

                                            {/* Messages List */}
                                            <Stack spacing={3} sx={{ mb: 4 }}>
                                                {messages.map((message, index) => (
                                                    <Card
                                                        key={index}
                                                        elevation={0}
                                                        sx={{
                                                            background: message.sender === 'admin' 
                                                                ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)'
                                                                : 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
                                                            border: message.sender === 'admin'
                                                                ? '1px solid rgba(66, 165, 245, 0.2)'
                                                                : '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: 2,
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                                                <Avatar
                                                                    src={message.sender === 'user' ? profile : adminDp}
                                                                    sx={{
                                                                        width: 48,
                                                                        height: 48,
                                                                        border: '2px solid',
                                                                        borderColor: message.sender === 'admin' ? 'primary.main' : 'grey.600'
                                                                    }}
                                                                >
                                                                    {message.sender === 'admin' ? <AdminIcon /> : <PersonIcon />}
                                                                </Avatar>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography 
                                                                        variant="subtitle1" 
                                                                        sx={{ 
                                                                            color: 'white', 
                                                                            fontWeight: 600,
                                                                            mb: 1,
                                                                            textTransform: 'capitalize',
                                                                            cursor: message.sender === 'user' ? 'pointer' : 'default'
                                                                        }}
                                                                        onClick={message.sender === 'user' ? () => Navigate(`/admin/user/${TicketUser?._id}/general`) : undefined}
                                                                    >
                                                                        {message.sender === 'user' 
                                                                            ? (TicketUser ? `${TicketUser.firstName} ${TicketUser.lastName}` : 'User')
                                                                            : 'Support Team'
                                                                        }
                                                                    </Typography>
                                                                    <Typography 
                                                                        variant="body1" 
                                                                        sx={{ 
                                                                            color: 'rgba(255, 255, 255, 0.9)', 
                                                                            whiteSpace: 'pre-wrap',
                                                                            mb: 2,
                                                                            lineHeight: 1.6
                                                                        }}
                                                                    >
                                                                        {message.description}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ color: 'grey.400' }}>
                                                                        {formatDate(message.createdAt)}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </CardContent>
                                                        
                                                        {/* Email Failure Indicator - Admin Only */}
                                                        {message.emailFailed && (
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 8,
                                                                    right: 8,
                                                                    bgcolor: 'error.main',
                                                                    color: 'white',
                                                                    borderRadius: '50%',
                                                                    width: 24,
                                                                    height: 24,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '12px',
                                                                    fontWeight: 'bold',
                                                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                                                    boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)'
                                                                }}
                                                                title="Email notification failed to send"
                                                            >
                                                                ⚠️
                                                            </Box>
                                                        )}
                                                    </Card>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </Stack>

                                            {/* Send Message Section */}
                                            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                                            
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                                                Send a Message
                                            </Typography>

                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                placeholder="Type your message here..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                sx={{
                                                    mb: 2,
                                                    '& .MuiInputLabel-root': { color: 'grey.400' },
                                                    '& .MuiOutlinedInput-root': {
                                                        color: 'white',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                                    }
                                                }}
                                            />

                                            <FormControl fullWidth sx={{ mb: 3 }} size="small">
                                                <Select
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    displayEmpty
                                                    sx={{
                                                        color: 'grey.100',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        borderRadius: 2,
                                                        height: '40px',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'primary.main',
                                                            borderWidth: '2px'
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            color: 'grey.400',
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="" disabled>Select ticket status</MenuItem>
                                                    <MenuItem value="open">Open</MenuItem>
                                                    <MenuItem value="solved">Solved</MenuItem>
                                                    <MenuItem value="awaiting reply">Awaiting Reply</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<SendIcon />}
                                                onClick={handleSendMessage}
                                                disabled={isDisable}
                                                sx={{
                                                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                                    color: 'white !important',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    height: '48px',
                                                    borderRadius: 2,
                                                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #1565c0, #1e88e5)',
                                                        color: 'white !important',
                                                        boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)'
                                                    },
                                                    '&:disabled': {
                                                        background: 'grey.600 !important',
                                                        color: 'grey.400 !important'
                                                    }
                                                }}
                                            >
                                                {isDisable ? 'Submitting...' : 'Submit'}
                                            </Button>
                                        </Paper>
                                    </Grid>

                                    {/* Right Side: Ticket Info */}
                                    <Grid item xs={12} md={4}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                background: 'rgba(255, 255, 255, 0.02)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                borderRadius: 3,
                                                p: 3,
                                                position: 'sticky !important',
                                                top: '100px !important',
                                                height: 'fit-content !important',
                                                maxHeight: 'calc(100vh - 120px) !important',
                                                overflow: 'auto !important',
                                                zIndex: '10 !important'
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                                                Ticket Information
                                            </Typography>

                                            <Stack spacing={2.5}>
                                                {/* Ticket ID */}
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: 'grey.400', textTransform: 'uppercase', fontWeight: 600 }}>
                                                        Ticket ID
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'primary.light', fontWeight: 600, mt: 0.5 }}>
                                                        {Ticket.ticketId}
                                                    </Typography>
                                                </Box>

                                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                                                {/* User Info */}
                                                {TicketUser && (
                                                    <Box 
                                                        onClick={() => Navigate(`/admin/user/${TicketUser._id}/general`)}
                                                        sx={{ 
                                                            cursor: 'pointer',
                                                            p: 2,
                                                            borderRadius: 2,
                                                            background: 'rgba(66, 165, 245, 0.05)',
                                                            border: '1px solid rgba(66, 165, 245, 0.1)',
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                background: 'rgba(66, 165, 245, 0.1)',
                                                                border: '1px solid rgba(66, 165, 245, 0.2)',
                                                            }
                                                        }}
                                                    >
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Avatar 
                                                                src={profile}
                                                                sx={{ 
                                                                    width: 40, 
                                                                    height: 40,
                                                                    border: '2px solid rgba(66, 165, 245, 0.3)'
                                                                }}
                                                            >
                                                                <PersonIcon />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                                                                    {TicketUser.firstName} {TicketUser.lastName}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: 'grey.400' }}>
                                                                    {TicketUser.email}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                )}

                                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                                                {/* Created Date */}
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: 'grey.400', textTransform: 'uppercase', fontWeight: 600 }}>
                                                        Created
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'white', mt: 0.5 }}>
                                                        {formatDateNew(Ticket.createdAt)}
                                                    </Typography>
                                                </Box>

                                                {/* Last Activity */}
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: 'grey.400', textTransform: 'uppercase', fontWeight: 600 }}>
                                                        Last Activity
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'white', mt: 0.5 }}>
                                                        {formatDateNew(Ticket.updatedAt)}
                                                    </Typography>
                                                </Box>

                                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                                                {/* Status */}
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: 'grey.400', textTransform: 'uppercase', fontWeight: 600, mb: 1, display: 'block' }}>
                                                        Current Status
                                                    </Typography>
                                                    <Chip
                                                        label={Ticket.status}
                                                        size="medium"
                                                        sx={{
                                                            bgcolor: statusColors.bg,
                                                            color: statusColors.color,
                                                            fontWeight: 600,
                                                            textTransform: 'capitalize',
                                                            width: '100%'
                                                        }}
                                                    />
                                                </Box>

                                                {/* Messages Count */}
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: 'grey.400', textTransform: 'uppercase', fontWeight: 600 }}>
                                                        Total Messages
                                                    </Typography>
                                                    <Typography variant="h4" sx={{ color: 'primary.light', fontWeight: 700, mt: 0.5 }}>
                                                        {messages.length}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllTicket;
