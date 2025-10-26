import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Button,
    CircularProgress,
    Chip,
    Pagination,
    Select,
    MenuItem,
    AppBar,
    Toolbar,
    IconButton,
    Checkbox,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Badge,
    LinearProgress,
} from "@mui/material";
import { DeleteForever, Restore, DeselectOutlined, Menu as MenuIcon, DeleteSweep, RestoreFromTrash, Close } from "@mui/icons-material";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import {
    listDeletedLeadsApi,
    bulkRestoreLeadsApi,
    bulkHardDeleteLeadsApi,
    restoreLeadApi,
    hardDeleteLeadApi,
    restoreAllLeadsApiWithProgress,
    hardDeleteAllLeadsApiWithProgress,
} from "../../../Api/Service";
import Sidebar from "./Sidebar.js";
import { toast } from "react-toastify";

const RecycleBin = () => {
    const authUser = useAuthUser();
    const navigate = useNavigate();
    const user = authUser?.();

    useEffect(() => {
        if (!user || user.user.role !== "superadmin") {
            navigate("/admin/dashboard/crm");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [loading, setLoading] = useState(false);
    const [leads, setLeads] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, limit: 50, totalFiltered: 0 });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenu, setisMobileMenu] = useState(false);
    const [filters, setFilters] = useState({ search: '', status: '', agent: '' });
    const [restoringId, setRestoringId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [bulkRestoring, setBulkRestoring] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [restoringAll, setRestoringAll] = useState(false);
    const [deletingAll, setDeletingAll] = useState(false);
    const [confirmRestoreAllOpen, setConfirmRestoreAllOpen] = useState(false);
    const [confirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false);
    const [restoreProgress, setRestoreProgress] = useState({
        total: 0,
        restored: 0,
        percentage: 0,
        isProcessing: false,
        msg: ''
    });
    const [deleteProgress, setDeleteProgress] = useState({
        total: 0,
        deleted: 0,
        percentage: 0,
        isProcessing: false,
        msg: ''
    });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarCollapsed(false);
            } else {
                setIsSidebarCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchDeleted = async (page = 1, limit = pagination.limit) => {
        try {
            setLoading(true);
            const res = await listDeletedLeadsApi({ page, limit, ...filters });
            if (res.success) {
                setLeads(res.data.leads || []);
                setPagination(res.data.pagination || { currentPage: 1, totalPages: 1, limit, totalFiltered: 0 });
                setSelected(new Set());
            } else {
                setLeads([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeleted(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchDeleted(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const daysRemaining = (deletedAt, updatedAt) => {
        const src = deletedAt || updatedAt;
        if (!src) return "-";
        const d = new Date(src);
        if (Number.isNaN(d.getTime())) return "-";
        const del = d.getTime();
        const now = Date.now();
        const passedDays = Math.floor((now - del) / (1000 * 60 * 60 * 24));
        const remaining = Math.max(0, 30 - passedDays);
        return `${remaining}d`;
    };

    const formatDeletedAt = (deletedAt, updatedAt) => {
        const src = deletedAt || updatedAt;
        if (!src) return "-";
        const d = new Date(src);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleString();
    };

    const toggleOne = (id) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelected(next);
    };

    const allSelected = useMemo(() => leads.length > 0 && selected.size === leads.length, [leads, selected]);
    const someSelected = useMemo(() => selected.size > 0 && selected.size < leads.length, [leads, selected]);

    const toggleAll = () => {
        if (allSelected) setSelected(new Set());
        else setSelected(new Set(leads.map(l => l._id)));
    };

    const restoreSelected = async () => {
        if (selected.size === 0) return;
        try {
            setBulkRestoring(true);
            const res = await bulkRestoreLeadsApi(Array.from(selected));
            toast.success(res?.msg || 'Selected leads restored');
            fetchDeleted(pagination.currentPage);
        } catch (e) {
            toast.error('Failed to restore selected leads');
        } finally {
            setBulkRestoring(false);
        }
    };

    const deleteSelected = async () => {
        if (selected.size === 0) return;
        try {
            setBulkDeleting(true);
            const res = await bulkHardDeleteLeadsApi(Array.from(selected));
            toast.success(res?.msg || 'Selected leads permanently deleted');
            fetchDeleted(pagination.currentPage);
        } catch (e) {
            toast.error('Failed to delete selected leads');
        } finally {
            setBulkDeleting(false);
        }
    };

    const restoreOne = async (id) => {
        try {
            setRestoringId(id);
            const res = await restoreLeadApi(id);
            toast.success(res?.msg || 'Lead restored');
            fetchDeleted(pagination.currentPage);
        } catch (e) {
            toast.error('Failed to restore lead');
        } finally {
            setRestoringId(null);
        }
    };

    const deleteOne = async (id) => {
        try {
            setDeletingId(id);
            const res = await hardDeleteLeadApi(id);
            toast.success(res?.msg || 'Lead permanently deleted');
            fetchDeleted(pagination.currentPage);
        } catch (e) {
            toast.error('Failed to delete lead');
        } finally {
            setDeletingId(null);
        }
    };

    const restoreAll = async () => {
        try {
            setRestoringAll(true);
            setRestoreProgress({
                total: 0,
                restored: 0,
                percentage: 0,
                isProcessing: true,
                msg: 'Starting restore...'
            });

            await restoreAllLeadsApiWithProgress((progressData) => {
                if (progressData.type === 'start') {
                    setRestoreProgress({
                        total: progressData.total,
                        restored: 0,
                        percentage: 0,
                        isProcessing: true,
                        msg: progressData.msg || 'Starting restore...'
                    });
                } else if (progressData.type === 'progress') {
                    setRestoreProgress({
                        total: progressData.total,
                        restored: progressData.restored,
                        percentage: progressData.percentage,
                        isProcessing: true,
                        msg: progressData.msg || `Restoring ${progressData.restored} of ${progressData.total}...`
                    });
                } else if (progressData.type === 'complete') {
                    setRestoreProgress({
                        total: progressData.total,
                        restored: progressData.restored,
                        percentage: 100,
                        isProcessing: false,
                        msg: progressData.msg || 'Restore complete!'
                    });
                    toast.success(progressData.msg || 'All leads restored successfully');
                    setTimeout(() => {
                        setConfirmRestoreAllOpen(false);
                        fetchDeleted(1);
                    }, 1000);
                } else if (progressData.type === 'error') {
                    toast.error(progressData.message || 'Failed to restore leads');
                    setRestoreProgress({
                        ...restoreProgress,
                        isProcessing: false
                    });
                }
            });
        } catch (e) {
            console.error('Restore all error:', e);
            toast.error(e.message || 'Failed to restore all leads');
            setRestoreProgress({
                ...restoreProgress,
                isProcessing: false
            });
        } finally {
            setRestoringAll(false);
        }
    };

    const deleteAll = async () => {
        try {
            setDeletingAll(true);
            setDeleteProgress({
                total: 0,
                deleted: 0,
                percentage: 0,
                isProcessing: true,
                msg: 'Starting deletion...'
            });

            await hardDeleteAllLeadsApiWithProgress((progressData) => {
                if (progressData.type === 'start') {
                    setDeleteProgress({
                        total: progressData.total,
                        deleted: 0,
                        percentage: 0,
                        isProcessing: true,
                        msg: progressData.msg || 'Starting deletion...'
                    });
                } else if (progressData.type === 'progress') {
                    setDeleteProgress({
                        total: progressData.total,
                        deleted: progressData.deleted,
                        percentage: progressData.percentage,
                        isProcessing: true,
                        msg: progressData.msg || `Deleting ${progressData.deleted} of ${progressData.total}...`
                    });
                } else if (progressData.type === 'complete') {
                    setDeleteProgress({
                        total: progressData.total,
                        deleted: progressData.deleted,
                        percentage: 100,
                        isProcessing: false,
                        msg: progressData.msg || 'Deletion complete!'
                    });
                    toast.success(progressData.msg || 'All leads permanently deleted');
                    setTimeout(() => {
                        setConfirmDeleteAllOpen(false);
                        fetchDeleted(1);
                    }, 1000);
                } else if (progressData.type === 'error') {
                    toast.error(progressData.message || 'Failed to delete leads');
                    setDeleteProgress({
                        ...deleteProgress,
                        isProcessing: false
                    });
                }
            });
        } catch (e) {
            console.error('Delete all error:', e);
            toast.error(e.message || 'Failed to permanently delete all leads');
            setDeleteProgress({
                ...deleteProgress,
                isProcessing: false
            });
        } finally {
            setDeletingAll(false);
        }
    };

    const handleLimit = (e) => {
        const limit = parseInt(e.target.value);
        setPagination(prev => ({ ...prev, limit }));
        fetchDeleted(1, limit);
    };

    return (
        <Box sx={{ display: "block", height: "100vh", bgcolor: "grey.50" }}>
            <Box>
                <Sidebar
                    setisMobileMenu={setisMobileMenu}
                    isMobileMenu={isMobileMenu}
                    isCollapsed={isSidebarCollapsed}
                    setIsSidebarCollapsed={setIsSidebarCollapsed}
                />
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    ml: {
                        xs: 0,
                        md: isSidebarCollapsed ? "80px" : "280px",
                    },
                    transition: "margin-left 0.3s ease",
                }}
            >
                <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <IconButton
                                onClick={() => setisMobileMenu(!isMobileMenu)}
                                size="small"
                                sx={{ color: 'text.secondary', display: { xs: 'block', md: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" color="text.primary">Recycle Bin</Typography>
                                <Typography variant="body2" color="text.secondary">Deleted leads are kept for 30 days</Typography>
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box sx={{ flex: 1, overflow: "auto", p: { xs: 2, sm: 3 } }}>

                    {/* Action Bar with Restore All / Delete All */}
                    <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: { xs: "flex-start", md: "center" },
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                        mb: 3 
                    }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Deleted Leads
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                {pagination.totalFiltered} lead(s) in recycle bin
                            </Typography>
                        </Box>
                        {leads.length > 0 && (
                            <Box sx={{ 
                                display: "flex", 
                                gap: 1,
                                flexWrap: "wrap",
                                width: { xs: '100%', md: 'auto' }
                            }}>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    startIcon={<RestoreFromTrash />}
                                    onClick={() => setConfirmRestoreAllOpen(true)}
                                    disabled={restoringAll || loading}
                                    size="small"
                                    sx={{ 
                                        flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                        borderRadius: 2
                                    }}
                                >
                                    Restore All
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteSweep />}
                                    onClick={() => setConfirmDeleteAllOpen(true)}
                                    disabled={deletingAll || loading}
                                    size="small"
                                    sx={{ 
                                        flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                        borderRadius: 2
                                    }}
                                >
                                    Empty Bin
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">Filters & Search</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    size="small"
                                    placeholder="Search..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                                />
                                <Select
                                    size="small"
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                    displayEmpty
                                    sx={{ minWidth: { xs: '100%', sm: '150px' } }}
                                >
                                    <MenuItem value="">All Statuses</MenuItem>
                                    <MenuItem value="New">New</MenuItem>
                                    <MenuItem value="Call Back">Call Back</MenuItem>
                                    <MenuItem value="Not Active">Not Active</MenuItem>
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Not Interested">Not Interested</MenuItem>
                                </Select>
                            </Box>
                        </CardContent>
                    </Card>

                    {selected.size > 0 && (
                        <Card elevation={4} sx={{ 
                            mb: 2, 
                            borderRadius: 3, 
                            bgcolor: 'primary.main',
                            position: 'sticky',
                            top: 0,
                            zIndex: 10
                        }}>
                            <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Badge 
                                            badgeContent={selected.size} 
                                            color="error"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    fontSize: '0.875rem',
                                                    height: 24,
                                                    minWidth: 24,
                                                    fontWeight: 'bold'
                                                }
                                            }}
                                        >
                                            <DeselectOutlined sx={{ color: 'white', fontSize: { xs: 28, sm: 32 } }} />
                                        </Badge>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                                                {selected.size} Lead{selected.size > 1 ? 's' : ''} Selected
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: { xs: 'none', sm: 'block' } }}>
                                                Choose an action below
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        gap: 1,
                                        flexWrap: 'wrap',
                                        width: { xs: '100%', sm: 'auto' }
                                    }}>
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<Close sx={{ display: { xs: 'none', sm: 'block' } }} />} 
                                            onClick={() => setSelected(new Set())}
                                            size="small"
                                            sx={{ 
                                                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                                color: 'white',
                                                borderColor: 'rgba(255,255,255,0.5)',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    bgcolor: 'rgba(255,255,255,0.1)'
                                                }
                                            }}
                                        >
                                            Clear
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="success"
                                            startIcon={<Restore sx={{ display: { xs: 'none', sm: 'block' } }} />} 
                                            onClick={restoreSelected} 
                                            disabled={bulkRestoring || loading}
                                            size="small"
                                            sx={{ 
                                                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {bulkRestoring ? 'Restoring...' : 'Restore'}
                                        </Button>
                                        <Button 
                                            color="error" 
                                            variant="contained" 
                                            startIcon={<DeleteForever />} 
                                            onClick={deleteSelected} 
                                            disabled={bulkDeleting || loading}
                                            size="small"
                                            sx={{ 
                                                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {bulkDeleting ? 'Deleting...' : `Delete (${selected.size})`}
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    <Card elevation={2} sx={{ borderRadius: 3 }}>
                        <TableContainer>
                            {loading ? (
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={someSelected}
                                                    checked={leads.length > 0 && allSelected}
                                                    onChange={toggleAll}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Email</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Agent</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Deleted At</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Expires In</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {leads.map(l => (
                                            <TableRow key={l._id} hover>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selected.has(l._id)} onChange={() => toggleOne(l._id)} />
                                                </TableCell>
                                                <TableCell>{l.firstName} {l.lastName}</TableCell>
                                                <TableCell>{l.email}</TableCell>
                                                <TableCell>{l.agent ? `${l.agent.firstName} ${l.agent.lastName} (${l.agent.role})` : 'Unassigned'}</TableCell>
                                                <TableCell>{formatDeletedAt(l.deletedAt, l.updatedAt)}</TableCell>
                                                <TableCell>
                                                    <Chip size="small" label={daysRemaining(l.deletedAt, l.updatedAt)} color="warning" />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" startIcon={<Restore />} onClick={() => restoreOne(l._id)} disabled={restoringId === l._id || loading}>
                                                        {restoringId === l._id ? 'Restoring...' : 'Restore'}
                                                    </Button>
                                                    <Button size="small" color="error" startIcon={<DeleteForever />} onClick={() => deleteOne(l._id)} disabled={deletingId === l._id || loading}>
                                                        {deletingId === l._id ? 'Deleting...' : 'Delete'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {leads.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    <Typography variant="body2" color="text.secondary">No deleted leads</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </TableContainer>
                        {leads.length > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Rows per page:</Typography>
                                    <Select size="small" value={pagination.limit} onChange={handleLimit} sx={{ minWidth: 80 }}>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                    </Select>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalFiltered)} of {pagination.totalFiltered} results
                                </Typography>
                                <Pagination count={pagination.totalPages} page={pagination.currentPage} onChange={(e, p) => fetchDeleted(p)} size="small" showFirstButton showLastButton />
                            </Box>
                        )}
                    </Card>
                </Box>
            </Box>

            {/* Restore All Confirmation Dialog */}
            <Dialog
                open={confirmRestoreAllOpen}
                onClose={() => !restoreProgress.isProcessing && setConfirmRestoreAllOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <RestoreFromTrash color="success" />
                        <Typography variant="h6">Restore All Leads?</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {!restoreProgress.isProcessing ? (
                        <>
                            <Typography variant="body1">
                                Are you sure you want to restore all <strong>{pagination.totalFiltered} lead(s)</strong> from the recycle bin?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                All leads will be restored to the active leads list and will be available again.
                            </Typography>
                        </>
                    ) : (
                        <Box sx={{ width: '100%', py: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {restoreProgress.msg}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color="success.main">
                                    {restoreProgress.percentage}%
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={restoreProgress.percentage} 
                                color="success"
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Restored {restoreProgress.restored.toLocaleString()} of {restoreProgress.total.toLocaleString()} leads
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmRestoreAllOpen(false)} disabled={restoreProgress.isProcessing}>
                        {restoreProgress.isProcessing ? 'Processing...' : 'Cancel'}
                    </Button>
                    {!restoreProgress.isProcessing && (
                        <Button 
                            variant="contained" 
                            color="success" 
                            onClick={restoreAll} 
                            disabled={restoringAll}
                            startIcon={restoringAll ? <CircularProgress size={20} /> : <RestoreFromTrash />}
                        >
                            {restoringAll ? 'Starting...' : 'Restore All'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Delete All Confirmation Dialog */}
            <Dialog
                open={confirmDeleteAllOpen}
                onClose={() => !deleteProgress.isProcessing && setConfirmDeleteAllOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <DeleteSweep color="error" />
                        <Typography variant="h6">Empty Recycle Bin?</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {!deleteProgress.isProcessing ? (
                        <>
                            <Typography variant="body1">
                                Are you sure you want to <strong>permanently delete all {pagination.totalFiltered} lead(s)</strong> from the recycle bin?
                            </Typography>
                            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
                                ⚠️ This action cannot be undone! All leads will be permanently removed from the database.
                            </Typography>
                        </>
                    ) : (
                        <Box sx={{ width: '100%', py: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {deleteProgress.msg}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color="error.main">
                                    {deleteProgress.percentage}%
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={deleteProgress.percentage} 
                                color="error"
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Deleted {deleteProgress.deleted.toLocaleString()} of {deleteProgress.total.toLocaleString()} leads
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteAllOpen(false)} disabled={deleteProgress.isProcessing}>
                        {deleteProgress.isProcessing ? 'Processing...' : 'Cancel'}
                    </Button>
                    {!deleteProgress.isProcessing && (
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={deleteAll} 
                            disabled={deletingAll}
                            startIcon={deletingAll ? <CircularProgress size={20} /> : <DeleteSweep />}
                        >
                            {deletingAll ? 'Starting...' : 'Empty Bin'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RecycleBin;

