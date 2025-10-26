import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Checkbox,
    Alert,
    CircularProgress,
    Pagination,
    Stack,
    Badge,
} from '@mui/material';
import {
    Email as EmailIcon,
    Refresh as RefreshIcon,
    Delete as DeleteIcon,
    SelectAll,
    Send as SendIcon,
} from '@mui/icons-material';
import { getFailedEmailsApi, resendFailedEmailsApi, deleteFailedEmailsApi } from '../../../Api/Service';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';

const FailedEmails = () => {
    const [failedEmails, setFailedEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState(new Set());
    const [resending, setResending] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 50
    });
    
    const navigate = useNavigate();
    const authUser = useAuthUser();

    useEffect(() => {
        if (authUser()?.user?.role !== 'superadmin') {
            navigate('/dashboard');
            return;
        }
        fetchFailedEmails();
    }, []);

    const fetchFailedEmails = async (page = 1) => {
        try {
            setLoading(true);
            // Don't pass status - backend will show pending, retrying, permanent_failure (NOT sent)
            const response = await getFailedEmailsApi({ page, limit: pagination.limit });
            if (response.success) {
                setFailedEmails(response.data.emails);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching failed emails:', error);
            toast.error('Failed to load emails');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = () => {
        if (selectedEmails.size === failedEmails.length) {
            setSelectedEmails(new Set());
        } else {
            setSelectedEmails(new Set(failedEmails.map(e => e._id)));
        }
    };

    const handleSelectEmail = (emailId) => {
        const newSelected = new Set(selectedEmails);
        if (newSelected.has(emailId)) {
            newSelected.delete(emailId);
        } else {
            newSelected.add(emailId);
        }
        setSelectedEmails(newSelected);
    };

    const handleResend = async () => {
        if (selectedEmails.size === 0) {
            toast.warning('No emails selected');
            return;
        }

        if (!window.confirm(`Resend ${selectedEmails.size} failed email(s)? This will send them one by one with 20-second delays.`)) {
            return;
        }

        try {
            setResending(true);
            const response = await resendFailedEmailsApi(Array.from(selectedEmails));
            if (response.success) {
                toast.success(response.msg);
                setSelectedEmails(new Set());
                fetchFailedEmails(pagination.currentPage);
            } else {
                toast.error(response.msg || 'Failed to resend emails');
            }
        } catch (error) {
            console.error('Error resending emails:', error);
            toast.error('Error resending emails');
        } finally {
            setResending(false);
        }
    };

    const handleDelete = async () => {
        if (selectedEmails.size === 0) {
            toast.warning('No emails selected');
            return;
        }

        if (!window.confirm(`Delete ${selectedEmails.size} failed email record(s)?`)) {
            return;
        }

        try {
            setDeleting(true);
            const response = await deleteFailedEmailsApi(Array.from(selectedEmails));
            if (response.success) {
                toast.success(response.msg);
                setSelectedEmails(new Set());
                fetchFailedEmails(pagination.currentPage);
            } else {
                toast.error(response.msg || 'Failed to delete records');
            }
        } catch (error) {
            console.error('Error deleting records:', error);
            toast.error('Error deleting records');
        } finally {
            setDeleting(false);
        }
    };

    const getErrorTypeChip = (errorType) => {
        const configs = {
            rate_limit: { label: 'Rate Limit', color: 'error' },
            quota_exceeded: { label: 'Quota Exceeded', color: 'error' },
            authentication: { label: 'Auth Failed', color: 'warning' },
            timeout: { label: 'Timeout', color: 'default' },
            other: { label: 'Error', color: 'default' },
        };
        const config = configs[errorType] || configs.other;
        return <Chip label={config.label} color={config.color} size="small" />;
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'grey.50' }}>
            <Sidebar />
            <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                <Card elevation={3}>
                    <CardContent>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <EmailIcon sx={{ fontSize: 40, color: 'error.main' }} />
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        Failed Activation Emails
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Manage and resend failed welcome emails
                                    </Typography>
                                </Box>
                            </Box>
                            <Badge badgeContent={pagination.total} color="error" max={999}>
                                <Button
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
                                    onClick={() => fetchFailedEmails(pagination.currentPage)}
                                    disabled={loading}
                                >
                                    Refresh
                                </Button>
                            </Badge>
                        </Box>

                        {/* Info Alert */}
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                These emails failed during lead activation due to SMTP limits or other issues.
                                <strong> Users were created successfully</strong> - only the welcome emails failed to send.
                                You can resend them here.
                            </Typography>
                        </Alert>

                        {/* Bulk Actions */}
                        {selectedEmails.size > 0 && (
                            <Card elevation={4} sx={{ mb: 2, bgcolor: 'primary.main', color: 'white' }}>
                                <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {selectedEmails.size} Email{selectedEmails.size > 1 ? 's' : ''} Selected
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<SendIcon />}
                                                onClick={handleResend}
                                                disabled={resending}
                                            >
                                                {resending ? <CircularProgress size={20} /> : `Resend (${selectedEmails.size})`}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<DeleteIcon />}
                                                onClick={handleDelete}
                                                disabled={deleting}
                                                sx={{ color: 'white', borderColor: 'white' }}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                variant="text"
                                                onClick={() => setSelectedEmails(new Set())}
                                                sx={{ color: 'white' }}
                                            >
                                                Clear
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}

                        {/* Table */}
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : failedEmails.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <EmailIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    No Failed Emails! 🎉
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    All activation emails were sent successfully
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={failedEmails.length > 0 && selectedEmails.size === failedEmails.length}
                                                        onChange={handleSelectAll}
                                                    />
                                                </TableCell>
                                                <TableCell><strong>Email</strong></TableCell>
                                                <TableCell><strong>Lead Name</strong></TableCell>
                                                <TableCell><strong>Status</strong></TableCell>
                                                <TableCell><strong>Error Type</strong></TableCell>
                                                <TableCell><strong>Failure Reason</strong></TableCell>
                                                <TableCell><strong>Retry Count</strong></TableCell>
                                                <TableCell><strong>Failed At</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {failedEmails.map((email) => (
                                                <TableRow key={email._id} hover>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedEmails.has(email._id)}
                                                            onChange={() => handleSelectEmail(email._id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{email.email}</TableCell>
                                                    <TableCell>{email.leadName || '-'}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={email.status || 'pending'} 
                                                            size="small"
                                                            color={
                                                                email.status === 'retrying' ? 'info' :
                                                                email.status === 'permanent_failure' ? 'error' :
                                                                'warning'
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>{getErrorTypeChip(email.errorType)}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" sx={{ maxWidth: 200, display: 'block' }}>
                                                            {email.failureReason?.substring(0, 80) || '-'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{email.retryCount}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption">
                                                            {new Date(email.createdAt).toLocaleString()}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Pagination */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Pagination
                                        count={pagination.totalPages}
                                        page={pagination.currentPage}
                                        onChange={(e, page) => fetchFailedEmails(page)}
                                        color="primary"
                                    />
                                </Box>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default FailedEmails;

