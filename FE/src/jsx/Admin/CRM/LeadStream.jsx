import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    IconButton,
    AppBar,
    Toolbar,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Divider,
    Avatar,
    Stack,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tabs,
    Tab,
    InputAdornment,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Menu,
    Autocomplete,
} from '@mui/material';
import {
    ArrowBack,
    Send,
    Menu as MenuIcon,
    Person,
    Email,
    Phone,
    LocationOn,
    Business,
    Refresh,
    Edit,
    Save,
    Close,
    Check,
    FilterList,
    History,
    Comment as CommentIcon,
    Info,
    CalendarToday,
    People,
    Delete as DeleteIcon,
    MoreVert,
    ThumbUp,
    ThumbUpOutlined,
    PushPin,
    PushPinOutlined,
    Flag,
    FlagOutlined,
    Reply,
    FormatQuote,
    HistoryOutlined,
    AttachFile,
    Search,
    GetApp,
    AlternateEmail,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar.js';
import { 
    getLeadWithActivityApi, 
    addLeadCommentApi, 
    updateLeadApi, 
    allUsersApi, 
    assignLeadsApi,
    editCommentApi,
    deleteCommentApi,
    toggleLikeCommentApi,
    togglePinCommentApi,
    toggleImportantCommentApi,
    addQuoteReplyApi,
    addNestedReplyApi,
    getCommentHistoryApi,
    getNestedRepliesApi,
    searchCommentsApi
} from '../../../Api/Service';
import { useAuthUser } from 'react-auth-kit';

const STATUS_OPTIONS = ["New", "Call Back", "Not Active", "Active", "Not Interested"];

// Editable Field Component - Moved outside to prevent re-creation
const EditableField = React.memo(({ 
    label, 
    field, 
    value, 
    icon: Icon, 
    multiline = false, 
    type = 'text', 
    options = null,
    isEditing,
    isSaving,
    editValue,
    onEditToggle,
    onEditChange,
    onSave,
    onCancel,
    canEdit = false
}) => {
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {Icon && <Icon sx={{ fontSize: 14 }} />}
                    {label}
                </Typography>
                {canEdit && (!isEditing ? (
                    <Tooltip title={`Edit ${label}`}>
                        <IconButton 
                            size="small" 
                            onClick={onEditToggle}
                            sx={{ p: 0.5 }}
                        >
                            <Edit sx={{ fontSize: 16, color: 'action.active' }} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Save">
                            <IconButton 
                                size="small" 
                                onClick={onSave}
                                disabled={isSaving}
                                sx={{ p: 0.5 }}
                            >
                                {isSaving ? <CircularProgress size={14} /> : <Check sx={{ fontSize: 16, color: 'success.main' }} />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                            <IconButton 
                                size="small" 
                                onClick={onCancel}
                                disabled={isSaving}
                                sx={{ p: 0.5 }}
                            >
                                <Close sx={{ fontSize: 16, color: 'error.main' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ))}
            </Box>
            {isEditing ? (
                options ? (
                    <FormControl fullWidth size="small">
                        <Select
                            value={editValue}
                            onChange={(e) => onEditChange(e.target.value)}
                            disabled={isSaving}
                            autoFocus
                        >
                            {options.map(option => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <TextField
                        fullWidth
                        size="small"
                        multiline={multiline}
                        rows={multiline ? 2 : 1}
                        type={type}
                        value={editValue}
                        onChange={(e) => onEditChange(e.target.value)}
                        disabled={isSaving}
                        autoFocus
                        sx={{ 
                            bgcolor: 'white',
                            '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem'
                            }
                        }}
                    />
                )
            ) : (
                <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
                    {value || 'Not provided'}
                </Typography>
            )}
        </Box>
    );
});

const LeadStream = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const authUser = useAuthUser();
    const [loading, setLoading] = useState(true);
    const [lead, setLead] = useState(null);
    const [activities, setActivities] = useState([]);
    const [totalActivities, setTotalActivities] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenu, setIsMobileMenu] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    // Edit states
    const [editMode, setEditMode] = useState({});
    const [editValues, setEditValues] = useState({});
    const [saving, setSaving] = useState({});
    
    // Filter states
    const [activityFilter, setActivityFilter] = useState('all');
    const [currentTab, setCurrentTab] = useState(0);
    
    // Permission states
    const [currentUserLatest, setCurrentUserLatest] = useState(null);
    const [agents, setAgents] = useState([]);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState('');
    const [assigning, setAssigning] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [canAssign, setCanAssign] = useState(false);
    
    // ✅ NEW: Comment Feature States
    const [commentMenuAnchor, setCommentMenuAnchor] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [editCommentDialogOpen, setEditCommentDialogOpen] = useState(false);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [editCommentReason, setEditCommentReason] = useState('');
    const [editingComment, setEditingComment] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deletingComment, setDeletingComment] = useState(false);
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [commentHistory, setCommentHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [quoteReplyDialogOpen, setQuoteReplyDialogOpen] = useState(false);
    const [quoteReplyContent, setQuoteReplyContent] = useState('');
    const [addingQuoteReply, setAddingQuoteReply] = useState(false);
    const [nestedReplyDialogOpen, setNestedReplyDialogOpen] = useState(false);
    const [nestedReplyContent, setNestedReplyContent] = useState('');
    const [addingNestedReply, setAddingNestedReply] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState(new Set());
    const [nestedReplies, setNestedReplies] = useState({});
    const [loadingReplies, setLoadingReplies] = useState({});
    const [commentSearch, setCommentSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [likesDialogOpen, setLikesDialogOpen] = useState(false);
    const [selectedLikes, setSelectedLikes] = useState([]);

    // Get user permissions and check access
    const getUserPermissions = useCallback(async () => {
        try {
            const currentUser = authUser().user;

            // ✅ SECURITY: Fetch current user's latest data BY ID (not email to avoid duplicates)
            const currentUserResponse = await allUsersApi({ 
                search: currentUser._id,  // Search by ID instead of email!
                limit: 1 
            });

            if (!currentUserResponse.success || currentUserResponse.allUsers.length === 0) {
                toast.error("Failed to fetch user data");
                navigate("/admin/dashboard/crm");
                return;
            }

            const updatedCurrentUser = currentUserResponse.allUsers[0];
            setCurrentUserLatest(updatedCurrentUser);

            // ✅ KEEP: Important for debugging authentication issues
            if (updatedCurrentUser.role !== authUser().user.role) {
                console.warn('⚠️ Role mismatch detected:', {
                    expected: authUser().user.role,
                    actual: updatedCurrentUser.role,
                    user: updatedCurrentUser.email
                });
            }
            // ✅ SECURITY: Check CRM access permissions
            if (updatedCurrentUser.role === "admin") {
                if (!updatedCurrentUser.adminPermissions?.accessCrm) {
                    toast.error("Access denied: No CRM permission");
                    navigate("/admin/dashboard");
                    return;
                }
            } else if (updatedCurrentUser.role === "subadmin") {
                if (!updatedCurrentUser.permissions?.accessCrm) {
                    toast.error("Access denied: No CRM permission");
                    navigate("/admin/dashboard");
                    return;
                }
            } else if (updatedCurrentUser.role === "user") {
                toast.error("Access denied: This is an admin area");
                navigate("/dashboard");
                return;
            }

            // Set edit permission
            const canUserEdit = updatedCurrentUser.role === 'superadmin' || 
                               (updatedCurrentUser.role === 'admin' && updatedCurrentUser.adminPermissions?.canManageCrmLeads);
            setCanEdit(canUserEdit);

            // Set assign permission
            const canUserAssign = updatedCurrentUser.role === 'superadmin' || 
                                 (updatedCurrentUser.role === 'admin' && updatedCurrentUser.adminPermissions?.canManageCrmLeads);
            setCanAssign(canUserAssign);

            // Fetch agents if can assign
            if (canUserAssign) {
                let agentsList = [];
                if (updatedCurrentUser.role === "superadmin") {
                    const [adminsResponse, subadminsResponse] = await Promise.all([
                        allUsersApi({ role: 'admin', limit: 1000 }),
                        allUsersApi({ role: 'subadmin', limit: 1000 })
                    ]);
                    
                    const allFetchedAgents = [
                        ...(adminsResponse.success ? adminsResponse.allUsers : []),
                        ...(subadminsResponse.success ? subadminsResponse.allUsers : [])
                    ];

                    // ✅ DEDUPLICATION: Check if current user already exists in fetched agents
                    const currentUserExists = allFetchedAgents.some(agent => agent._id === updatedCurrentUser._id);
                    
                    agentsList = currentUserExists 
                        ? allFetchedAgents 
                        : [...allFetchedAgents, updatedCurrentUser]; // Include self only if not already present
                        
                } else if (updatedCurrentUser.role === "admin") {
                    const subadminsResponse = await allUsersApi({ role: 'subadmin', limit: 1000 });
                    agentsList = subadminsResponse.success ? subadminsResponse.allUsers : [];
                }
                setAgents(agentsList);
            }

        } catch (error) {
            console.error('Error fetching permissions:', error);
            toast.error("Error loading permissions");
            navigate("/admin/dashboard/crm");
        }
    }, []); // ✅ EMPTY dependencies - only run once on mount

    useEffect(() => {
        getUserPermissions();
    }, []); // ✅ EMPTY dependencies - only call getUserPermissions once on mount

    // Mobile menu handling
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobileMenu(false);
                setIsSidebarCollapsed(false);
            } else {
                setIsMobileMenu(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchLeadData = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            setRefreshing(true);
            
            const response = await getLeadWithActivityApi(leadId);

            if (response.success) {
                const fetchedLead = response.lead;
                
                setLead(fetchedLead);
                setActivities(response.activities);
                setTotalActivities(response.totalActivities);
                
                // Initialize edit values only once
                setEditValues(prev => {
                    if (Object.keys(prev).length === 0) {
                        return {
                            firstName: fetchedLead.firstName || '',
                            lastName: fetchedLead.lastName || '',
                            email: fetchedLead.email || '',
                            phone: fetchedLead.phone || '',
                            country: fetchedLead.country || '',
                            Brand: fetchedLead.Brand || '',
                            Address: fetchedLead.Address || '',
                            status: fetchedLead.status || 'New',
                        };
                    }
                    return prev;
                });
            } else {
                const errorMsg = response.message || 'Failed to load lead data';
                toast.error(errorMsg);
                // If access denied, redirect to leads page
                if (errorMsg.includes('Access denied')) {
                    setTimeout(() => navigate('/admin/dashboard/crm'), 1500);
                }
            }
        } catch (error) {
            console.error('❌ Error fetching lead data:', error); // ✅ KEEP: Error logging is important
            if (!silent) {
                toast.error('Error loading lead stream');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [leadId]);

    useEffect(() => {
        let mounted = true;
        let interval;

        const initializePage = async () => {
            // Always fetch data, don't wait for permissions
            await fetchLeadData();
            
            if (mounted) {
                // Start auto-refresh interval
                interval = setInterval(() => {
                    fetchLeadData(true);
                }, 30000);
            }
        };

        initializePage();

        return () => {
            mounted = false;
            if (interval) clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadId]);

    // Note: Record-level authorization is handled by backend
    // Backend returns 403 if user doesn't have access to this specific lead

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.warning('Please enter a comment');
            return;
        }

        try {
            setSubmittingComment(true);
            const response = await addLeadCommentApi(leadId, newComment.trim());

            if (response.success) {
                toast.success('Comment added successfully');
                setNewComment('');
                fetchLeadData(true);
            } else {
                toast.error(response.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Error adding comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    const handleEditToggle = (field) => {
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleEditChange = (field, value) => {
        setEditValues(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveField = async (field) => {
        try {
            setSaving(prev => ({ ...prev, [field]: true }));
            
            const response = await updateLeadApi(leadId, editValues);

            if (response.success) {
                toast.success(`${field} updated successfully`);
                setEditMode(prev => ({ ...prev, [field]: false }));
                fetchLeadData(true);
            } else {
                toast.error(response.msg || 'Failed to update');
            }
        } catch (error) {
            console.error('Error updating field:', error);
            toast.error('Error updating field');
        } finally {
            setSaving(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleCancelEdit = (field) => {
        setEditValues(prev => ({ ...prev, [field]: lead[field] || '' }));
        setEditMode(prev => ({ ...prev, [field]: false }));
    };

    // ===========================
    // ✅ NEW: COMMENT FEATURE HANDLERS
    // ===========================

    // Comment Menu Handlers
    const handleCommentMenuOpen = (event, comment) => {
        setCommentMenuAnchor(event.currentTarget);
        setSelectedComment(comment);
    };

    const handleCommentMenuClose = () => {
        setCommentMenuAnchor(null);
    };

    // Edit Comment
    const handleEditCommentClick = () => {
        setEditCommentContent(selectedComment.comment || '');
        setEditCommentReason('');
        setEditCommentDialogOpen(true);
        handleCommentMenuClose();
    };

    const handleEditCommentSubmit = async () => {
        if (!editCommentContent.trim()) {
            toast.warning('Comment content cannot be empty');
            return;
        }

        try {
            setEditingComment(true);
            const response = await editCommentApi(
                leadId, 
                selectedComment._id, 
                editCommentContent.trim(),
                editCommentReason.trim()
            );

            if (response.success) {
                toast.success('Comment edited successfully');
                setEditCommentDialogOpen(false);
                setEditCommentContent('');
                setEditCommentReason('');
                fetchLeadData(true);
            } else {
                toast.error(response.message || 'Failed to edit comment');
            }
        } catch (error) {
            console.error('Error editing comment:', error);
            toast.error('Error editing comment');
        } finally {
            setEditingComment(false);
        }
    };

    // Delete Comment
    const handleDeleteCommentClick = () => {
        setDeleteConfirmOpen(true);
        handleCommentMenuClose();
    };

    const handleDeleteCommentConfirm = async () => {
        try {
            setDeletingComment(true);
            const response = await deleteCommentApi(leadId, selectedComment._id);

            if (response.success) {
                toast.success('Comment deleted successfully');
                setDeleteConfirmOpen(false);
                setSelectedComment(null);
                fetchLeadData(true);
            } else {
                toast.error(response.message || 'Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Error deleting comment');
        } finally {
            setDeletingComment(false);
        }
    };

    // Like/Unlike
    const handleToggleLike = async (comment, event) => {
        event.stopPropagation();
        try {
            const response = await toggleLikeCommentApi(leadId, comment._id);
            if (response.success) {
                // Update the comment in local state
                setActivities(prev => prev.map(activity => 
                    activity._id === comment._id 
                        ? { ...activity, likes: response.likes }
                        : activity
                ));
            } else {
                toast.error(response.message || 'Failed to toggle like');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            toast.error('Error liking comment');
        }
    };

    // Pin/Unpin
    const handleTogglePin = async () => {
        try {
            const response = await togglePinCommentApi(leadId, selectedComment._id);
            if (response.success) {
                toast.success(response.message);
                handleCommentMenuClose();
                fetchLeadData(true);
            } else {
                toast.error(response.message || 'Failed to toggle pin');
            }
        } catch (error) {
            console.error('Error toggling pin:', error);
            toast.error('Error pinning comment');
        }
    };

    // Mark Important
    const handleToggleImportant = async () => {
        try {
            const response = await toggleImportantCommentApi(leadId, selectedComment._id);
            if (response.success) {
                toast.success(response.message);
                handleCommentMenuClose();
                fetchLeadData(true);
            } else {
                toast.error(response.message || 'Failed to toggle importance');
            }
        } catch (error) {
            console.error('Error toggling importance:', error);
            toast.error('Error marking comment');
        }
    };

    // View Edit History
    const handleViewHistory = async () => {
        try {
            setLoadingHistory(true);
            setHistoryDialogOpen(true);
            handleCommentMenuClose();
            
            const response = await getCommentHistoryApi(leadId, selectedComment._id);
            if (response.success) {
                setCommentHistory(response.history || []);
            } else {
                toast.error('Failed to load edit history');
            }
        } catch (error) {
            console.error('Error loading history:', error);
            toast.error('Error loading edit history');
        } finally {
            setLoadingHistory(false);
        }
    };

    // Quote Reply
    const handleQuoteReplyClick = () => {
        setQuoteReplyContent('');
        setQuoteReplyDialogOpen(true);
        handleCommentMenuClose();
    };

    const handleQuoteReplySubmit = async () => {
        if (!quoteReplyContent.trim()) {
            toast.warning('Reply content cannot be empty');
            return;
        }

        try {
            setAddingQuoteReply(true);
            const response = await addQuoteReplyApi(
                leadId, 
                selectedComment._id, 
                quoteReplyContent.trim()
            );

            if (response.success) {
                toast.success('Quote reply added successfully');
                setQuoteReplyDialogOpen(false);
                setQuoteReplyContent('');
                setSelectedComment(null);
                
                // Refresh main data to show the new quote reply
                await fetchLeadData(true);
            } else {
                toast.error(response.message || 'Failed to add quote reply');
            }
        } catch (error) {
            console.error('Error adding quote reply:', error);
            toast.error('Error adding quote reply');
        } finally {
            setAddingQuoteReply(false);
        }
    };

    // Nested Reply
    const handleNestedReplyClick = () => {
        setNestedReplyContent('');
        setNestedReplyDialogOpen(true);
        handleCommentMenuClose();
    };

    const handleNestedReplySubmit = async () => {
        if (!nestedReplyContent.trim()) {
            toast.warning('Reply content cannot be empty');
            return;
        }

        try {
            setAddingNestedReply(true);
            const parentCommentId = selectedComment._id;
            const parentIsNested = selectedComment.parentCommentId; // Check if replying to a nested reply
            const topLevelParentId = parentIsNested || parentCommentId; // Get the top-level parent
            
            const response = await addNestedReplyApi(
                leadId, 
                parentCommentId, 
                nestedReplyContent.trim()
            );

            if (response.success) {
                toast.success('Reply added successfully');
                setNestedReplyDialogOpen(false);
                setNestedReplyContent('');
                
                // ✅ CRITICAL FIX: Reload the TOP-LEVEL parent's replies tree
                
                // Step 1: Refresh main data
                await fetchLeadData(true);
                
                // Step 2: Auto-expand the TOP-LEVEL parent comment (not nested parent)
                const newExpanded = new Set(expandedReplies);
                newExpanded.add(topLevelParentId);
                setExpandedReplies(newExpanded);
                
                // Step 3: Reload ALL nested replies for the TOP-LEVEL parent
                try {
                    setLoadingReplies(prev => ({ ...prev, [topLevelParentId]: true }));
                    const repliesResponse = await getNestedRepliesApi(leadId, topLevelParentId);
                    if (repliesResponse.success) {setNestedReplies(prev => ({
                            ...prev,
                            [topLevelParentId]: repliesResponse.replies || []
                        }));
                    }
                } catch (err) {
                    console.error('Error reloading replies:', err);
                } finally {
                    setLoadingReplies(prev => ({ ...prev, [topLevelParentId]: false }));
                }
            } else {
                toast.error(response.message || 'Failed to add reply');
            }
        } catch (error) {
            console.error('Error adding nested reply:', error);
            toast.error('Error adding reply');
        } finally {
            setAddingNestedReply(false);
        }
    };

    // Toggle Nested Replies
    const handleToggleReplies = async (commentId) => {
        const newExpanded = new Set(expandedReplies);
        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
            setExpandedReplies(newExpanded);
        } else {
            newExpanded.add(commentId);
            setExpandedReplies(newExpanded);
            
            // Load replies if not already loaded
            if (!nestedReplies[commentId]) {
                try {
                    setLoadingReplies(prev => ({ ...prev, [commentId]: true }));
                    const response = await getNestedRepliesApi(leadId, commentId);
                    if (response.success) {
                        setNestedReplies(prev => ({
                            ...prev,
                            [commentId]: response.replies || []
                        }));
                    }
                } catch (error) {
                    console.error('Error loading replies:', error);
                    toast.error('Error loading replies');
                } finally {
                    setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
                }
            }
        }
    };

    // Comment Search
    const handleSearchComments = async () => {
        if (!commentSearch.trim()) {
            setShowSearchResults(false);
            setSearchResults([]);
            return;
        }

        try {
            setSearching(true);
            const response = await searchCommentsApi(leadId, { query: commentSearch.trim() });
            if (response.success) {
                setSearchResults(response.results || []);
                setShowSearchResults(true);
                toast.success(`Found ${response.count} matching comment(s)`);
            } else {
                toast.error('Search failed');
            }
        } catch (error) {
            console.error('Error searching comments:', error);
            toast.error('Error searching comments');
        } finally {
            setSearching(false);
        }
    };

    const handleClearSearch = () => {
        setCommentSearch('');
        setSearchResults([]);
        setShowSearchResults(false);
    };

    // Show Likes Dialog
    const handleShowLikes = (comment) => {
        setSelectedLikes(comment.likes || []);
        setLikesDialogOpen(true);
        handleCommentMenuClose();
    };

    // Check if user can delete a comment
    const canDeleteComment = useCallback((comment) => {
        if (!currentUserLatest) return false;
        const userRole = currentUserLatest.role;
        const userId = currentUserLatest._id;
        const authorId = comment.createdBy?.userId;
        const authorRole = comment.createdBy?.userRole;

        // Superadmin can delete all
        if (userRole === 'superadmin') return true;
        
        // Admin can delete subadmin and own
        if (userRole === 'admin') {
            if (userId === authorId) return true;
            if (authorRole === 'subadmin') return true;
            return false;
        }
        
        // Subadmin can delete only own
        if (userRole === 'subadmin') {
            return userId === authorId;
        }
        
        return false;
    }, [currentUserLatest]);

    // Check if user can edit a comment
    const canEditComment = useCallback((comment) => {
        if (!currentUserLatest) return false;
        const userId = currentUserLatest._id;
        const authorId = comment.createdBy?.userId;
        
        // Only author can edit
        return userId === authorId && comment.type === 'comment';
    }, [currentUserLatest]);

    // Check if user can pin
    const canPinComment = useCallback(() => {
        if (!currentUserLatest) return false;
        return currentUserLatest.role === 'superadmin' || currentUserLatest.role === 'admin';
    }, [currentUserLatest]);

    // Check if user liked a comment
    const hasUserLiked = useCallback((comment) => {
        if (!currentUserLatest) return false;
        return comment.likes?.some(like => like.userId === currentUserLatest._id) || false;
    }, [currentUserLatest]);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();

        const timeStr = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `Today ${timeStr}`;
        if (isYesterday) return `Yesterday ${timeStr}`;
        
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getActivityTypeLabel = (type) => {
        const labels = {
            'created': 'Created',
            'comment': 'Comment',
            'status_change': 'Status Changed',
            'assignment_change': 'Agent Changed',
            'field_update': 'Updated',
            'email_sent': 'Email Sent',
            'call_logged': 'Call Logged'
        };
        return labels[type] || type;
    };

    // ✅ Highlight mentions in text
    const highlightMentions = (text) => {
        if (!text) return text;
        
        // Match @FirstName LastName pattern
        const mentionPattern = /@(\w+\s+\w+)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = mentionPattern.exec(text)) !== null) {
            // Add text before mention
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            
            // Add highlighted mention
            parts.push(
                <Chip
                    key={match.index}
                    label={`@${match[1]}`}
                    size="small"
                    icon={<AlternateEmail sx={{ fontSize: 14 }} />}
                    sx={{
                        height: 22,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: 'primary.light',
                        color: 'primary.dark',
                        mx: 0.5,
                        verticalAlign: 'middle'
                    }}
                />
            );
            
            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return parts.length > 0 ? parts : text;
    };

    const getActivityTypeColor = (type) => {
        const colors = {
            'created': 'success',
            'comment': 'primary',
            'status_change': 'warning',
            'assignment_change': 'secondary',
            'field_update': 'info',
            'email_sent': 'info',
            'call_logged': 'default'
        };
        return colors[type] || 'default';
    };

    // Filter activities (with search results support)
    // ✅ IMPORTANT: Exclude nested replies from main stream (they appear under parent)
    const isTopLevelActivity = (activity) => {
        // Include if: no parentCommentId, parentCommentId is null, or parentCommentId is undefined
        return !activity.parentCommentId;
    };
    
    const filteredActivities = showSearchResults 
        ? searchResults 
        : activityFilter === 'all' 
            ? activities.filter(isTopLevelActivity) // Only top-level activities
            : activities.filter(a => a.type === activityFilter && isTopLevelActivity(a));

    // Editable Field Component
    const EditableField = ({ label, field, value, icon: Icon, multiline = false, type = 'text', options = null }) => {
        const isEditing = editMode[field];
        const isSaving = saving[field];

        return (
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {Icon && <Icon sx={{ fontSize: 14 }} />}
                        {label}
                    </Typography>
                    {!isEditing ? (
                        <Tooltip title={`Edit ${label}`}>
                            <IconButton 
                                size="small" 
                                onClick={() => handleEditToggle(field)}
                                sx={{ p: 0.5 }}
                            >
                                <Edit sx={{ fontSize: 16, color: 'action.active' }} />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Save">
                                <IconButton 
                                    size="small" 
                                    onClick={() => handleSaveField(field)}
                                    disabled={isSaving}
                                    sx={{ p: 0.5 }}
                                >
                                    {isSaving ? <CircularProgress size={14} /> : <Check sx={{ fontSize: 16, color: 'success.main' }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <IconButton 
                                    size="small" 
                                    onClick={() => handleCancelEdit(field)}
                                    disabled={isSaving}
                                    sx={{ p: 0.5 }}
                                >
                                    <Close sx={{ fontSize: 16, color: 'error.main' }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
                {isEditing ? (
                    options ? (
                        <FormControl fullWidth size="small">
                            <Select
                                value={editValues[field]}
                                onChange={(e) => handleEditChange(field, e.target.value)}
                                disabled={isSaving}
                            >
                                {options.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <TextField
                            fullWidth
                            size="small"
                            multiline={multiline}
                            rows={multiline ? 2 : 1}
                            type={type}
                            value={editValues[field]}
                            onChange={(e) => handleEditChange(field, e.target.value)}
                            disabled={isSaving}
                            sx={{ 
                                bgcolor: 'white',
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '0.875rem'
                                }
                            }}
                        />
                    )
                ) : (
                    <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
                        {value || 'Not provided'}
                    </Typography>
                )}
            </Box>
        );
    };// ✅ KEEP: Helps debug render issues

    if (loading && !lead) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f5f5f5' }}>
                <CircularProgress size={48} />
            </Box>
        );
    }

    if (!loading && !lead) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f5f5f5' }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="error" gutterBottom>Lead not found</Typography>
                    <Button variant="contained" onClick={() => navigate('/admin/dashboard/crm')} sx={{ mt: 2 }}>
                        Back to Leads
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'block', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <Sidebar
                setisMobileMenu={setIsMobileMenu}
                isMobileMenu={isMobileMenu}
                isCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
            />

            {isMobileMenu && (
                <Box
                    onClick={() => setIsMobileMenu(false)}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1199,
                        display: { xs: 'block', md: 'none' },
                        cursor: 'pointer'
                    }}
                />
            )}

            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    ml: {
                        xs: 0,
                        md: isSidebarCollapsed ? '80px' : '280px',
                    },
                    transition: 'margin-left 0.3s ease',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}
                >
                    <Toolbar>
                        <IconButton
                            onClick={() => setIsMobileMenu(!isMobileMenu)}
                            size="small"
                            edge="start"
                            sx={{
                                color: 'text.primary',
                                display: { xs: 'block', md: 'none' },
                                mr: 1
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => navigate('/admin/dashboard/crm')}
                            sx={{ mr: 2, color: 'text.primary' }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                {lead.firstName} {lead.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Lead ID: {leadId.slice(-8)} • {totalActivities} activities
                            </Typography>
                        </Box>
                        <Chip 
                            label={lead.status} 
                            size="small"
                            color={
                                lead.status === 'Active' ? 'success' :
                                lead.status === 'New' ? 'primary' :
                                lead.status === 'Call Back' ? 'warning' : 'default'
                            }
                            sx={{ fontWeight: 600, mr: 2, display: { xs: 'none', sm: 'inline-flex' } }}
                        />
                        {canAssign && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Person />}
                                onClick={() => setAssignDialogOpen(true)}
                                sx={{ 
                                    mr: 2,
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Assign
                            </Button>
                        )}
                        <IconButton
                            onClick={() => fetchLeadData(true)}
                            disabled={refreshing}
                            sx={{ color: 'text.secondary' }}
                        >
                            {refreshing ? <CircularProgress size={20} /> : <Refresh />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Content */}
                <Box sx={{ 
                    flex: 1, 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ 
                        flex: 1,
                        overflow: 'auto',
                        p: { xs: 2, sm: 3 },
                        '&::-webkit-scrollbar': {
                            width: '10px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f5f5f5',
                            borderRadius: '5px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#bdbdbd',
                            borderRadius: '5px',
                            '&:hover': {
                                background: '#9e9e9e',
                            },
                        },
                    }}>
                        <Box sx={{ maxWidth: 1600, mx: 'auto', width: '100%' }}>
                            <Grid container spacing={3} alignItems="flex-start">
                                {/* Left Column - Lead Information */}
                                <Grid item xs={12} lg={4}>
                                    <Card elevation={1} sx={{ borderRadius: 2, position: 'sticky', top: 0 }}>
                                {/* Lead Header */}
                                <Box sx={{ 
                                    p: 3, 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                fontSize: '1.5rem',
                                                fontWeight: 600,
                                                border: '3px solid rgba(255,255,255,0.3)'
                                            }}
                                        >
                                            {lead.firstName?.[0]}{lead.lastName?.[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                {lead.firstName} {lead.lastName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                Created {new Date(lead.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider />

                                {/* Tabs */}
                                <Tabs 
                                    value={currentTab} 
                                    onChange={(e, v) => setCurrentTab(v)}
                                    variant="fullWidth"
                                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                                >
                                    <Tab label="Details" icon={<Info sx={{ fontSize: 18 }} />} iconPosition="start" />
                                    <Tab label="Summary" icon={<History sx={{ fontSize: 18 }} />} iconPosition="start" />
                                </Tabs>

                                {/* Tab Content */}
                                <Box sx={{ p: 3 }}>
                                    {currentTab === 0 ? (
                                        <Stack spacing={2.5}>
                                            {/* Contact Information */}
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                                                    Contact Information
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <EditableField
                                                        label="First Name"
                                                        field="firstName"
                                                        value={lead.firstName}
                                                        icon={Person}
                                                        isEditing={editMode.firstName}
                                                        isSaving={saving.firstName}
                                                        editValue={editValues.firstName}
                                                        onEditToggle={() => handleEditToggle('firstName')}
                                                        onEditChange={(value) => handleEditChange('firstName', value)}
                                                        onSave={() => handleSaveField('firstName')}
                                                        onCancel={() => handleCancelEdit('firstName')}
                                                        canEdit={canEdit}
                                                    />
                                                    <EditableField
                                                        label="Last Name"
                                                        field="lastName"
                                                        value={lead.lastName}
                                                        icon={Person}
                                                        isEditing={editMode.lastName}
                                                        isSaving={saving.lastName}
                                                        editValue={editValues.lastName}
                                                        onEditToggle={() => handleEditToggle('lastName')}
                                                        onEditChange={(value) => handleEditChange('lastName', value)}
                                                        onSave={() => handleSaveField('lastName')}
                                                        onCancel={() => handleCancelEdit('lastName')}
                                                        canEdit={canEdit}
                                                    />
                                                    <EditableField
                                                        label="Email"
                                                        field="email"
                                                        value={lead.email}
                                                        icon={Email}
                                                        type="email"
                                                        isEditing={editMode.email}
                                                        isSaving={saving.email}
                                                        editValue={editValues.email}
                                                        onEditToggle={() => handleEditToggle('email')}
                                                        onEditChange={(value) => handleEditChange('email', value)}
                                                        onSave={() => handleSaveField('email')}
                                                        onCancel={() => handleCancelEdit('email')}
                                                        canEdit={canEdit}
                                                    />
                                                    <EditableField
                                                        label="Phone"
                                                        field="phone"
                                                        value={lead.phone}
                                                        icon={Phone}
                                                        isEditing={editMode.phone}
                                                        isSaving={saving.phone}
                                                        editValue={editValues.phone}
                                                        onEditToggle={() => handleEditToggle('phone')}
                                                        onEditChange={(value) => handleEditChange('phone', value)}
                                                        onSave={() => handleSaveField('phone')}
                                                        onCancel={() => handleCancelEdit('phone')}
                                                        canEdit={canEdit}
                                                    />
                                                </Stack>
                                            </Box>

                                            <Divider />

                                            {/* Business Information */}
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                                                    Business Information
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <EditableField
                                                        label="Brand"
                                                        field="Brand"
                                                        value={lead.Brand}
                                                        icon={Business}
                                                        isEditing={editMode.Brand}
                                                        isSaving={saving.Brand}
                                                        editValue={editValues.Brand}
                                                        onEditToggle={() => handleEditToggle('Brand')}
                                                        onEditChange={(value) => handleEditChange('Brand', value)}
                                                        onSave={() => handleSaveField('Brand')}
                                                        onCancel={() => handleCancelEdit('Brand')}
                                                        canEdit={canEdit}
                                                    />
                                                    <EditableField
                                                        label="Country"
                                                        field="country"
                                                        value={lead.country}
                                                        icon={LocationOn}
                                                        isEditing={editMode.country}
                                                        isSaving={saving.country}
                                                        editValue={editValues.country}
                                                        onEditToggle={() => handleEditToggle('country')}
                                                        onEditChange={(value) => handleEditChange('country', value)}
                                                        onSave={() => handleSaveField('country')}
                                                        onCancel={() => handleCancelEdit('country')}
                                                        canEdit={canEdit}
                                                    />
                                                    <EditableField
                                                        label="Address"
                                                        field="Address"
                                                        value={lead.Address}
                                                        icon={LocationOn}
                                                        multiline
                                                        isEditing={editMode.Address}
                                                        isSaving={saving.Address}
                                                        editValue={editValues.Address}
                                                        onEditToggle={() => handleEditToggle('Address')}
                                                        onEditChange={(value) => handleEditChange('Address', value)}
                                                        onSave={() => handleSaveField('Address')}
                                                        onCancel={() => handleCancelEdit('Address')}
                                                        canEdit={canEdit}
                                                    />
                                                </Stack>
                                            </Box>

                                            <Divider />

                                            {/* Status & Agent */}
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                                                    Lead Status
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <EditableField
                                                        label="Status"
                                                        field="status"
                                                        value={lead.status}
                                                        options={STATUS_OPTIONS}
                                                        isEditing={editMode.status}
                                                        isSaving={saving.status}
                                                        editValue={editValues.status}
                                                        onEditToggle={() => handleEditToggle('status')}
                                                        onEditChange={(value) => handleEditChange('status', value)}
                                                        onSave={() => handleSaveField('status')}
                                                        onCancel={() => handleCancelEdit('status')}
                                                        canEdit={canEdit}
                                                    />
                                                    {lead.agent && (
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                                                <Person sx={{ fontSize: 14 }} /> Assigned Agent
                                                            </Typography>
                                                            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50' }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                                                                        {lead.agent.firstName?.[0]}{lead.agent.lastName?.[0]}
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.813rem' }}>
                                                                            {lead.agent.firstName} {lead.agent.lastName}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {lead.agent.role} • {lead.agent.email}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Paper>
                                                        </Box>
                                                    )}
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    ) : (
                                        <Stack spacing={2}>
                                            {/* Summary Tab */}
                                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {totalActivities}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                    Total Activities
                                                </Typography>
                                            </Paper>

                                            <Paper variant="outlined" sx={{ p: 2 }}>
                                                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                                    Activity Breakdown
                                                </Typography>
                                                <Stack spacing={1}>
                                                    {['comment', 'status_change', 'assignment_change', 'field_update', 'created'].map(type => {
                                                        const count = activities.filter(a => a.type === type).length;
                                                        if (count === 0) return null;
                                                        return (
                                                            <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Chip 
                                                                    label={getActivityTypeLabel(type)} 
                                                                    size="small" 
                                                                    color={getActivityTypeColor(type)}
                                                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                                                />
                                                                <Typography variant="body2" fontWeight="bold">
                                                                    {count}
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    })}
                                                </Stack>
                                            </Paper>

                                            <Paper variant="outlined" sx={{ p: 2 }}>
                                                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                                    Timeline
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        First Activity
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="600">
                                                        {activities.length > 0 ? formatDateTime(activities[activities.length - 1].createdAt) : 'N/A'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Latest Activity
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="600">
                                                        {activities.length > 0 ? formatDateTime(activities[0].createdAt) : 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Stack>
                                    )}
                                </Box>
                            </Card>
                        </Grid>

                        {/* Right Column - Activity Stream */}
                        <Grid item xs={12} lg={8}>
                            <Card elevation={1} sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Activity Stream
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                                <InputLabel>Filter Type</InputLabel>
                                                <Select
                                                    value={activityFilter}
                                                    label="Filter Type"
                                                    onChange={(e) => setActivityFilter(e.target.value)}
                                                    startAdornment={<FilterList sx={{ fontSize: 18, mr: 0.5 }} />}
                                                >
                                                    <MenuItem value="all">All Activities ({activities.length})</MenuItem>
                                                    <MenuItem value="comment">Comments ({activities.filter(a => a.type === 'comment').length})</MenuItem>
                                                    <MenuItem value="status_change">Status Changes ({activities.filter(a => a.type === 'status_change').length})</MenuItem>
                                                    <MenuItem value="assignment_change">Agent Changes ({activities.filter(a => a.type === 'assignment_change').length})</MenuItem>
                                                    <MenuItem value="field_update">Field Updates ({activities.filter(a => a.type === 'field_update').length})</MenuItem>
                                                    <MenuItem value="created">Created ({activities.filter(a => a.type === 'created').length})</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {/* ✅ Export Button */}
                                            <Tooltip title="Export Comments to PDF">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => {
                                                        toast.info('Export feature coming soon!');
                                                    }}
                                                >
                                                    <GetApp />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                    {/* ✅ Comment Search Bar */}
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search comments..."
                                        value={commentSearch}
                                        onChange={(e) => setCommentSearch(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearchComments();
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search sx={{ fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: commentSearch && (
                                                <InputAdornment position="end">
                                                    {searching ? (
                                                        <CircularProgress size={16} />
                                                    ) : (
                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                            <IconButton size="small" onClick={handleClearSearch}>
                                                                <Close sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={handleSearchComments}>
                                                                <Search sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                    {/* Search Results Indicator */}
                                    {showSearchResults && (
                                        <Box sx={{ mt: 1 }}>
                                            <Chip
                                                label={`Showing ${searchResults.length} search result(s)`}
                                                size="small"
                                                color="primary"
                                                onDelete={handleClearSearch}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                {/* Comment Input - Professional Design */}
                                <Box sx={{ p: 3, bgcolor: 'linear-gradient(to bottom, #fafafa, #ffffff)', borderBottom: '2px solid #e0e0e0', flexShrink: 0 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                        <Avatar 
                                            sx={{ 
                                                width: 40, 
                                                height: 40, 
                                                bgcolor: 'primary.main',
                                                fontSize: '0.875rem',
                                                fontWeight: 700,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                            }}
                                        >
                                            {authUser()?.user?.firstName?.[0]}{authUser()?.user?.lastName?.[0]}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {authUser()?.user?.firstName} {authUser()?.user?.lastName}
                                                </Typography>
                                                <Chip 
                                                    label={authUser()?.user?.role} 
                                                    size="small"
                                                    sx={{ 
                                                        height: 20, 
                                                        fontSize: '0.65rem',
                                                        fontWeight: 600,
                                                        bgcolor: 'primary.light',
                                                        color: 'white'
                                                    }}
                                                />
                                            </Box>
                                            <Paper 
                                                elevation={0}
                                                sx={{ 
                                                    border: '2px solid',
                                                    borderColor: newComment.trim() ? 'primary.main' : '#e0e0e0',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        boxShadow: '0 2px 12px rgba(102, 126, 234, 0.15)'
                                                    }
                                                }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    placeholder="Write your comment here... (Press Enter to send, Shift+Enter for new line)"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    variant="standard"
                                                    InputProps={{
                                                        disableUnderline: true,
                                                        sx: {
                                                            p: 2,
                                                            fontSize: '0.938rem',
                                                            lineHeight: 1.6,
                                                            '& textarea::placeholder': {
                                                                color: 'text.secondary',
                                                                opacity: 0.7
                                                            }
                                                        }
                                                    }}
                                                />
                                                {newComment.trim() && (
                                                    <Box sx={{ 
                                                        px: 2, 
                                                        py: 1, 
                                                        bgcolor: '#f5f5f5',
                                                        borderTop: '1px solid #e0e0e0',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Info sx={{ fontSize: 12 }} />
                                                            Press Enter to send, Shift+Enter for new line
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {newComment.length} characters
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Paper>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                                                {newComment.trim() && (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => setNewComment('')}
                                                        sx={{
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            borderRadius: 2,
                                                            borderColor: 'grey.300'
                                                        }}
                                                    >
                                                        Clear
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    startIcon={submittingComment ? <CircularProgress size={16} color="inherit" /> : <Send />}
                                                    onClick={handleAddComment}
                                                    disabled={submittingComment || !newComment.trim()}
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        px: 4,
                                                        py: 1,
                                                        borderRadius: 2,
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                                            boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                                                        },
                                                        '&:disabled': {
                                                            background: 'grey.300',
                                                            boxShadow: 'none'
                                                        }
                                                    }}
                                                >
                                                    {submittingComment ? 'Posting...' : 'Post Comment'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Activity Stream - Professional Design */}
                                <Box sx={{ 
                                    flex: 1,
                                    overflow: 'auto',
                                    p: 3,
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: '#f5f5f5',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: '#c0c0c0',
                                        borderRadius: '4px',
                                        '&:hover': {
                                            background: '#a0a0a0',
                                        },
                                    },
                                }}>
                                    {filteredActivities.length === 0 ? (
                                        <Paper 
                                            elevation={0} 
                                            sx={{ 
                                                py: 8, 
                                                textAlign: 'center',
                                                bgcolor: '#fafafa',
                                                borderRadius: 2,
                                                border: '2px dashed #e0e0e0'
                                            }}
                                        >
                                            <CommentIcon sx={{ fontSize: 56, color: 'grey.300', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                                                {activityFilter === 'all' 
                                                    ? 'No activities yet' 
                                                    : `No ${getActivityTypeLabel(activityFilter).toLowerCase()} activities`}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {activityFilter === 'all'
                                                    ? 'Start by adding your first comment above'
                                                    : 'Try selecting a different filter'}
                                            </Typography>
                                            {activityFilter !== 'all' && (
                                                <Button 
                                                    variant="outlined"
                                                    size="small" 
                                                    onClick={() => setActivityFilter('all')}
                                                    sx={{ mt: 2, borderRadius: 2 }}
                                                >
                                                    Show All Activities
                                                </Button>
                                            )}
                                        </Paper>
                                    ) : (
                                        <Stack spacing={3}>
                                            {filteredActivities.map((activity, index) => (
                                                <Box
                                                    key={activity._id || index}
                                                    sx={{ 
                                                        display: 'flex',
                                                        gap: 2,
                                                        alignItems: 'flex-start'
                                                    }}
                                                >
                                                    {/* User Avatar */}
                                                    <Avatar 
                                                        sx={{ 
                                                            width: 48, 
                                                            height: 48, 
                                                            fontSize: '1rem',
                                                            bgcolor: activity.type === 'comment' ? 'primary.main' : 'secondary.main',
                                                            fontWeight: 700,
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {activity.createdBy?.userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'SYS'}
                                                    </Avatar>

                                                    {/* Activity Content */}
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        {/* Header */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                                                                    {activity.createdBy?.userName || 'System'}
                                                                </Typography>
                                                                <Chip
                                                                    label={activity.createdBy?.userRole || 'system'}
                                                                    size="small"
                                                                    sx={{ 
                                                                        fontSize: '0.65rem',
                                                                        height: 20,
                                                                        bgcolor: 'grey.300',
                                                                        fontWeight: 600,
                                                                        textTransform: 'uppercase'
                                                                    }}
                                                                />
                                                                <Typography variant="caption" color="text.secondary">•</Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {formatDateTime(activity.createdAt)}
                                                                </Typography>
                                                                {activity.isEdited && (
                                                                    <Tooltip title="Click to view edit history">
                                                                        <Chip
                                                                            label="Edited"
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{ 
                                                                                fontSize: '0.6rem',
                                                                                height: 18,
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={() => {
                                                                                setSelectedComment(activity);
                                                                                handleViewHistory();
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                                {activity.quotedComment && (
                                                                    <Tooltip title="Quote Reply">
                                                                        <Chip
                                                                            icon={<FormatQuote sx={{ fontSize: 12 }} />}
                                                                            label="Quote Reply"
                                                                            size="small"
                                                                            color="primary"
                                                                            variant="outlined"
                                                                            sx={{ 
                                                                                fontSize: '0.6rem',
                                                                                height: 18
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                                <Chip
                                                                    label={getActivityTypeLabel(activity.type)}
                                                                    size="small"
                                                                    color={getActivityTypeColor(activity.type)}
                                                                    variant="outlined"
                                                                    sx={{ 
                                                                        fontSize: '0.7rem',
                                                                        height: 22,
                                                                        fontWeight: 600,
                                                                        borderWidth: 2
                                                                    }}
                                                                />
                                                            </Box>

                                                            {/* ✅ Action Menu for Comments Only */}
                                                            {activity.type === 'comment' && (
                                                                <IconButton 
                                                                    size="small"
                                                                    onClick={(e) => handleCommentMenuOpen(e, activity)}
                                                                    sx={{ ml: 'auto' }}
                                                                >
                                                                    <MoreVert sx={{ fontSize: 18 }} />
                                                                </IconButton>
                                                            )}
                                                        </Box>

                                                        {/* ✅ Pin & Important Indicators */}
                                                        {(activity.isPinned || activity.isImportant) && (
                                                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                                {activity.isPinned && (
                                                                    <Chip
                                                                        icon={<PushPin sx={{ fontSize: 14 }} />}
                                                                        label={`Pinned by ${activity.pinnedBy?.userName || 'Admin'}`}
                                                                        size="small"
                                                                        color="secondary"
                                                                        sx={{ fontSize: '0.7rem', height: 24 }}
                                                                    />
                                                                )}
                                                                {activity.isImportant && (
                                                                    <Chip
                                                                        icon={<Flag sx={{ fontSize: 14 }} />}
                                                                        label="Important"
                                                                        size="small"
                                                                        color="warning"
                                                                        sx={{ fontSize: '0.7rem', height: 24 }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        )}

                                                        {/* Comment/Activity Bubble */}
                                                        <Paper 
                                                            elevation={0}
                                                            sx={{ 
                                                                p: 2.5,
                                                                mt: 1,
                                                                bgcolor: activity.isPinned 
                                                                    ? '#fff8e1' 
                                                                    : activity.isImportant 
                                                                        ? '#fff3e0'
                                                                        : activity.type === 'comment' ? 'white' : '#f8f9fa',
                                                                borderRadius: '12px',
                                                                border: activity.isPinned || activity.isImportant ? '2px solid' : '1px solid',
                                                                borderColor: activity.isPinned 
                                                                    ? '#fbc02d' 
                                                                    : activity.isImportant 
                                                                        ? '#ff9800'
                                                                        : activity.type === 'comment' ? '#e3e8ef' : '#e0e0e0',
                                                                position: 'relative',
                                                                boxShadow: activity.type === 'comment' ? '0 2px 8px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.06)',
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    boxShadow: activity.type === 'comment' ? '0 4px 12px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.1)',
                                                                    borderColor: activity.type === 'comment' ? 'primary.light' : 'grey.400'
                                                                },
                                                                '&::before': activity.type === 'comment' ? {
                                                                    content: '""',
                                                                    position: 'absolute',
                                                                    left: '-8px',
                                                                    top: '12px',
                                                                    width: 0,
                                                                    height: 0,
                                                                    borderTop: '8px solid transparent',
                                                                    borderBottom: '8px solid transparent',
                                                                    borderRight: `8px solid ${activity.isPinned ? '#fbc02d' : activity.isImportant ? '#ff9800' : '#e3e8ef'}`,
                                                                } : {}
                                                            }}
                                                        >
                                                            {/* ✅ Quoted Comment INSIDE Bubble - Cleaner Design */}
                                                            {activity.quotedComment && (
                                                                <Box 
                                                                    sx={{ 
                                                                        mb: 1.5,
                                                                        p: 1.5,
                                                                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                                                                        borderLeft: '3px solid',
                                                                        borderColor: 'primary.main',
                                                                        borderRadius: 1
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                                                        <FormatQuote sx={{ fontSize: 14, color: 'primary.main' }} />
                                                                        <Typography variant="caption" fontWeight="bold" color="primary.main">
                                                                            {activity.quotedComment.author?.userName}
                                                                        </Typography>
                                                                        <Chip 
                                                                            label={activity.quotedComment.author?.userRole} 
                                                                            size="small" 
                                                                            sx={{ 
                                                                                height: 16, 
                                                                                fontSize: '0.6rem',
                                                                                bgcolor: 'primary.light',
                                                                                color: 'white'
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Typography 
                                                                        variant="body2" 
                                                                        sx={{ 
                                                                            fontSize: '0.813rem',
                                                                            color: 'text.secondary',
                                                                            fontStyle: 'italic',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            display: '-webkit-box',
                                                                            WebkitLineClamp: 2,
                                                                            WebkitBoxOrient: 'vertical',
                                                                            lineHeight: 1.4
                                                                        }}
                                                                    >
                                                                        {activity.quotedComment.content}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            
                                                            {/* ✅ Actual Comment Content */}
                                                            <Typography 
                                                                variant="body1" 
                                                                sx={{ 
                                                                    fontSize: '0.938rem',
                                                                    lineHeight: 1.6,
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordBreak: 'break-word',
                                                                    color: 'text.primary',
                                                                    fontWeight: 400
                                                                }}
                                                            >
                                                                {activity.type === 'comment' 
                                                                    ? highlightMentions(activity.comment || activity.description || 'No description')
                                                                    : (activity.description || activity.comment || 'No description')}
                                                            </Typography>

                                                            {/* ✅ Call Summary Display */}
                                                            {activity.type === 'call_logged' && activity.metadata && (
                                                                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(25, 118, 210, 0.08)', borderRadius: 2, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                                                        <Phone sx={{ fontSize: 18, color: 'primary.main' }} />
                                                                        <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                                                                            Call Summary
                                                                        </Typography>
                                                                        {activity.metadata.duration && (
                                                                            <Chip 
                                                                                label={`${Math.floor(activity.metadata.duration / 60)}:${String(activity.metadata.duration % 60).padStart(2, '0')}`}
                                                                                size="small"
                                                                                sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'primary.light', color: 'white' }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                    <Typography 
                                                                        variant="body2" 
                                                                        sx={{ 
                                                                            fontSize: '0.875rem',
                                                                            lineHeight: 1.6,
                                                                            whiteSpace: 'pre-wrap',
                                                                            wordBreak: 'break-word',
                                                                            color: 'text.primary',
                                                                            mb: activity.metadata.transcript ? 1.5 : 0
                                                                        }}
                                                                    >
                                                                        {activity.comment || activity.description || 'No summary available'}
                                                                    </Typography>
                                                                    {activity.metadata.transcript && (
                                                                        <Box sx={{ mt: 1.5 }}>
                                                                            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                                                Full Transcript:
                                                                            </Typography>
                                                                            <Typography 
                                                                                variant="body2" 
                                                                                sx={{ 
                                                                                    fontSize: '0.813rem',
                                                                                    lineHeight: 1.5,
                                                                                    whiteSpace: 'pre-wrap',
                                                                                    wordBreak: 'break-word',
                                                                                    color: 'text.secondary',
                                                                                    fontStyle: 'italic',
                                                                                    maxHeight: '200px',
                                                                                    overflowY: 'auto',
                                                                                    p: 1,
                                                                                    bgcolor: 'rgba(0,0,0,0.02)',
                                                                                    borderRadius: 1
                                                                                }}
                                                                            >
                                                                                {activity.metadata.transcript}
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            )}
                                                            
                                                            {/* ✅ Show Mentions Below Comment */}
                                                            {activity.mentions && activity.mentions.length > 0 && (
                                                                <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                                                                    <AlternateEmail sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                                    <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                                                                        Mentioned:
                                                                    </Typography>
                                                                    {activity.mentions.map((mention, idx) => (
                                                                        <Chip
                                                                            key={idx}
                                                                            label={mention.userName}
                                                                            size="small"
                                                                            sx={{
                                                                                height: 20,
                                                                                fontSize: '0.7rem',
                                                                                bgcolor: 'primary.light',
                                                                                color: 'primary.dark'
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            )}

                                                            {/* ✅ Attachments */}
                                                            {activity.attachments && activity.attachments.length > 0 && (
                                                                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                                    {activity.attachments.map((attachment, idx) => (
                                                                        <Chip
                                                                            key={idx}
                                                                            icon={<AttachFile sx={{ fontSize: 14 }} />}
                                                                            label={attachment.fileName}
                                                                            size="small"
                                                                            onClick={() => window.open(attachment.fileUrl, '_blank')}
                                                                            sx={{ cursor: 'pointer' }}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            )}

                                                            {/* ✅ Comment Actions Bar (Like, Reply) - Only for comments */}
                                                            {activity.type === 'comment' && (
                                                                <Box sx={{ 
                                                                    display: 'flex', 
                                                                    gap: 1, 
                                                                    mt: 2, 
                                                                    pt: 1.5,
                                                                    borderTop: '1px solid',
                                                                    borderColor: 'divider',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    {/* Like Button */}
                                                                    <Tooltip title={hasUserLiked(activity) ? 'Unlike' : 'Like'}>
                                                                        <Button
                                                                            size="small"
                                                                            startIcon={hasUserLiked(activity) ? <ThumbUp sx={{ fontSize: 16 }} /> : <ThumbUpOutlined sx={{ fontSize: 16 }} />}
                                                                            onClick={(e) => handleToggleLike(activity, e)}
                                                                            sx={{
                                                                                textTransform: 'none',
                                                                                fontSize: '0.75rem',
                                                                                minWidth: 'auto',
                                                                                px: 1.5,
                                                                                py: 0.5,
                                                                                color: hasUserLiked(activity) ? 'primary.main' : 'text.secondary',
                                                                                fontWeight: hasUserLiked(activity) ? 700 : 500,
                                                                                '&:hover': {
                                                                                    bgcolor: 'primary.light',
                                                                                    color: 'primary.dark'
                                                                                }
                                                                            }}
                                                                        >
                                                                            {activity.likes?.length > 0 && (
                                                                                <Typography 
                                                                                    variant="caption" 
                                                                                    sx={{ 
                                                                                        ml: 0.5,
                                                                                        fontWeight: 'bold',
                                                                                        cursor: 'pointer'
                                                                                    }}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleShowLikes(activity);
                                                                                    }}
                                                                                >
                                                                                    {activity.likes.length}
                                                                                </Typography>
                                                                            )}
                                                                        </Button>
                                                                    </Tooltip>

                                                                    {/* Reply Button */}
                                                                    <Tooltip title="Reply">
                                                                        <Button
                                                                            size="small"
                                                                            startIcon={<Reply sx={{ fontSize: 16 }} />}
                                                                            onClick={() => {
                                                                                setSelectedComment(activity);
                                                                                handleNestedReplyClick();
                                                                            }}
                                                                            sx={{
                                                                                textTransform: 'none',
                                                                                fontSize: '0.75rem',
                                                                                px: 1.5,
                                                                                py: 0.5,
                                                                                color: 'text.secondary',
                                                                                '&:hover': {
                                                                                    bgcolor: 'success.light',
                                                                                    color: 'success.dark'
                                                                                }
                                                                            }}
                                                                        >
                                                                            {activity.replies?.length > 0 && (
                                                                                <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                                                                                    {activity.replies.length}
                                                                                </Typography>
                                                                            )}
                                                                        </Button>
                                                                    </Tooltip>

                                                                    {/* Show Replies Button */}
                                                                    {activity.replies && activity.replies.length > 0 && (
                                                                        <Button
                                                                            size="small"
                                                                            onClick={() => handleToggleReplies(activity._id)}
                                                                            sx={{
                                                                                textTransform: 'none',
                                                                                fontSize: '0.7rem',
                                                                                px: 1,
                                                                                py: 0.5,
                                                                                color: 'primary.main'
                                                                            }}
                                                                        >
                                                                            {expandedReplies.has(activity._id) ? 'Hide' : 'View'} {activity.replies.length} {activity.replies.length === 1 ? 'reply' : 'replies'}
                                                                        </Button>
                                                                    )}
                                                                </Box>
                                                            )}
                                                        </Paper>

                                                        {/* ✅ Nested Replies Display - Facebook-Style */}
                                                        {activity.type === 'comment' && expandedReplies.has(activity._id) && (
                                                            <Box sx={{ mt: 2 }}>
                                                                {loadingReplies[activity._id] ? (
                                                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                                                        <CircularProgress size={20} />
                                                                    </Box>
                                                                ) : (
                                                                    <Stack spacing={1.5}>
                                                                        {(nestedReplies[activity._id] || []).map((reply, replyIdx) => (
                                                                            <Box 
                                                                                key={reply._id} 
                                                                                sx={{ 
                                                                                    pl: { xs: 2, sm: 6 },
                                                                                    py: 1.5,
                                                                                    bgcolor: replyIdx % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent',
                                                                                    borderRadius: 1,
                                                                                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.04)' }
                                                                                }}
                                                                            >
                                                                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                                                                    <Avatar sx={{ 
                                                                                        width: 32, 
                                                                                        height: 32, 
                                                                                        fontSize: '0.7rem', 
                                                                                        bgcolor: 'success.main',
                                                                                        flexShrink: 0
                                                                                    }}>
                                                                                        {reply.createdBy?.userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'R'}
                                                                                    </Avatar>
                                                                                    
                                                                                    <Box sx={{ flex: 1 }}>
                                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, flexWrap: 'wrap' }}>
                                                                                            <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                                                                                                {reply.createdBy?.userName}
                                                                                            </Typography>
                                                                                            <Chip 
                                                                                                label={reply.createdBy?.userRole} 
                                                                                                size="small"
                                                                                                sx={{ height: 18, fontSize: '0.65rem', bgcolor: 'grey.200' }}
                                                                                            />
                                                                                            <Typography variant="caption" color="text.secondary">
                                                                                                {formatDateTime(reply.createdAt)}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                        
                                                                                        {/* Replying to */}
                                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                                                                            <Reply sx={{ fontSize: 12, color: 'text.secondary' }} />
                                                                                            <Typography variant="caption" color="text.secondary">Replying to</Typography>
                                                                                            <Typography variant="caption" fontWeight="bold" color="primary.main">
                                                                                                {activity.createdBy?.userName}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                        
                                                                                        {/* Reply Content */}
                                                                                        <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5, mb: 1 }}>
                                                                                            {highlightMentions(reply.comment)}
                                                                                        </Typography>
                                                                                        
                                                                                        {/* Actions */}
                                                                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                                                            <Button
                                                                                                size="small"
                                                                                                startIcon={hasUserLiked(reply) ? <ThumbUp sx={{ fontSize: 14 }} /> : <ThumbUpOutlined sx={{ fontSize: 14 }} />}
                                                                                                onClick={(e) => handleToggleLike(reply, e)}
                                                                                                sx={{
                                                                                                    textTransform: 'none',
                                                                                                    fontSize: '0.7rem',
                                                                                                    px: 0.5,
                                                                                                    color: hasUserLiked(reply) ? 'primary.main' : 'text.secondary',
                                                                                                    fontWeight: 600,
                                                                                                    '&:hover': { bgcolor: 'transparent' }
                                                                                                }}
                                                                                            >
                                                                                                {reply.likes?.length > 0 ? `Like (${reply.likes.length})` : 'Like'}
                                                                                            </Button>
                                                                                            <Typography variant="caption" color="text.secondary">•</Typography>
                                                                                            <Button
                                                                                                size="small"
                                                                                                onClick={() => { setSelectedComment(reply); handleNestedReplyClick(); }}
                                                                                                sx={{
                                                                                                    textTransform: 'none',
                                                                                                    fontSize: '0.7rem',
                                                                                                    px: 0.5,
                                                                                                    color: 'text.secondary',
                                                                                                    fontWeight: 600,
                                                                                                    '&:hover': { bgcolor: 'transparent' }
                                                                                                }}
                                                                                            >
                                                                                                Reply
                                                                                            </Button>
                                                                                            <Typography variant="caption" color="text.secondary">•</Typography>
                                                                                            <IconButton size="small" onClick={(e) => handleCommentMenuOpen(e, reply)} sx={{ p: 0, ml: 'auto' }}>
                                                                                                <MoreVert sx={{ fontSize: 14 }} />
                                                                                            </IconButton>
                                                                                        </Box>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Box>
                                                                        ))}
                                                                    </Stack>
                                                                )}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                        </Box>
                    </Box>
                </Box>

            {/* Assign Agent Dialog */}
            <Dialog 
                open={assignDialogOpen} 
                onClose={() => setAssignDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Assign Lead to Agent</Typography>
                        <IconButton onClick={() => setAssignDialogOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
                    <Typography sx={{ mb: 2 }}>
                        Assign <strong>{lead?.firstName} {lead?.lastName}</strong> to an agent:
                    </Typography>
                    <FormControl fullWidth size="small">
                        <InputLabel>Agent</InputLabel>
                        <Select
                            value={selectedAgentId}
                            label="Agent"
                            onChange={(e) => setSelectedAgentId(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Unassigned</em>
                            </MenuItem>
                            {agents
                                .filter(a => a.role === 'admin' || a.role === 'subadmin' || a.role === 'superadmin')
                                .map(agent => (
                                    <MenuItem key={agent._id} value={agent._id}>
                                        {agent.firstName} {agent.lastName} ({agent.role}) - {agent.email}
                                        {currentUserLatest?._id === agent._id ? ' (self)' : ''}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignDialogOpen(false)} disabled={assigning}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            try {
                                if (!selectedAgentId) {
                                    toast.error('Please select an agent');
                                    return;
                                }
                                setAssigning(true);
                                const res = await assignLeadsApi([leadId], selectedAgentId);
                                if (res.success) {
                                    toast.success('Lead assigned successfully');
                                    setSelectedAgentId("");
                                    setAssignDialogOpen(false);
                                    fetchLeadData(true);
                                } else {
                                    toast.error(res.msg || 'Failed to assign lead');
                                }
                            } catch (err) {
                                console.error('Assign error:', err);
                                toast.error('Error assigning lead');
                            } finally {
                                setAssigning(false);
                            }
                        }}
                        disabled={assigning || !selectedAgentId}
                        startIcon={assigning ? <CircularProgress size={20} /> : <People />}
                    >
                        {assigning ? 'Assigning...' : 'Assign'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ✅ Comment Action Menu */}
            <Menu
                anchorEl={commentMenuAnchor}
                open={Boolean(commentMenuAnchor)}
                onClose={handleCommentMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: { borderRadius: 2, minWidth: 200 }
                }}
            >
                {/* Edit (only own comments) */}
                {selectedComment && canEditComment(selectedComment) && (
                    <MenuItem onClick={handleEditCommentClick}>
                        <Edit sx={{ mr: 1, fontSize: 20 }} />
                        Edit Comment
                    </MenuItem>
                )}
                
                {/* View History (if edited) */}
                {selectedComment?.isEdited && (
                    <MenuItem onClick={handleViewHistory}>
                        <HistoryOutlined sx={{ mr: 1, fontSize: 20 }} />
                        View Edit History
                    </MenuItem>
                )}
                
                {/* Quote Reply */}
                <MenuItem onClick={handleQuoteReplyClick}>
                    <FormatQuote sx={{ mr: 1, fontSize: 20 }} />
                    Quote Reply
                </MenuItem>
                
                {/* Nested Reply */}
                <MenuItem onClick={handleNestedReplyClick}>
                    <Reply sx={{ mr: 1, fontSize: 20 }} />
                    Reply
                </MenuItem>
                
                <Divider />
                
                {/* Pin (admin/superadmin only) */}
                {canPinComment() && (
                    <MenuItem onClick={handleTogglePin}>
                        {selectedComment?.isPinned ? <PushPinOutlined sx={{ mr: 1, fontSize: 20 }} /> : <PushPin sx={{ mr: 1, fontSize: 20 }} />}
                        {selectedComment?.isPinned ? 'Unpin Comment' : 'Pin Comment'}
                    </MenuItem>
                )}
                
                {/* Mark Important (admin/superadmin only) */}
                {canPinComment() && (
                    <MenuItem onClick={handleToggleImportant}>
                        {selectedComment?.isImportant ? <FlagOutlined sx={{ mr: 1, fontSize: 20 }} /> : <Flag sx={{ mr: 1, fontSize: 20 }} />}
                        {selectedComment?.isImportant ? 'Unmark Important' : 'Mark as Important'}
                    </MenuItem>
                )}
                
                {/* View Likes */}
                {selectedComment?.likes && selectedComment.likes.length > 0 && (
                    <MenuItem onClick={() => handleShowLikes(selectedComment)}>
                        <ThumbUp sx={{ mr: 1, fontSize: 20 }} />
                        View Likes ({selectedComment.likes.length})
                    </MenuItem>
                )}
                
                <Divider />
                
                {/* Delete (role-based) */}
                {selectedComment && canDeleteComment(selectedComment) && (
                    <MenuItem onClick={handleDeleteCommentClick} sx={{ color: 'error.main' }}>
                        <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                        Delete Comment
                    </MenuItem>
                )}
            </Menu>

            {/* ✅ Edit Comment Dialog */}
            <Dialog
                open={editCommentDialogOpen}
                onClose={() => !editingComment && setEditCommentDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Edit Comment</Typography>
                        <IconButton onClick={() => setEditCommentDialogOpen(false)} disabled={editingComment}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Comment Content"
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        disabled={editingComment}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Edit Reason (optional)"
                        placeholder="Why are you editing this comment?"
                        value={editCommentReason}
                        onChange={(e) => setEditCommentReason(e.target.value)}
                        disabled={editingComment}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditCommentDialogOpen(false)} disabled={editingComment}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleEditCommentSubmit}
                        disabled={editingComment || !editCommentContent.trim()}
                        startIcon={editingComment ? <CircularProgress size={20} /> : <Save />}
                    >
                        {editingComment ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ✅ Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => !deletingComment && setDeleteConfirmOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <DeleteIcon color="error" />
                        <Typography variant="h6">Delete Comment</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this comment by <strong>{selectedComment?.createdBy?.userName}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} disabled={deletingComment}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteCommentConfirm}
                        disabled={deletingComment}
                        startIcon={deletingComment ? <CircularProgress size={20} /> : <DeleteIcon />}
                    >
                        {deletingComment ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ✅ Edit History Dialog */}
            <Dialog
                open={historyDialogOpen}
                onClose={() => setHistoryDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                            <HistoryOutlined />
                            <Typography variant="h6">Edit History</Typography>
                        </Box>
                        <IconButton onClick={() => setHistoryDialogOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
                    {loadingHistory ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : commentHistory.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            No edit history available
                        </Typography>
                    ) : (
                        <Stack spacing={2}>
                            {commentHistory.map((edit, index) => (
                                <Card key={index} variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {edit.editedBy?.userName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDateTime(edit.editedAt)}
                                                </Typography>
                                            </Box>
                                            <Chip label={edit.editedBy?.userRole} size="small" />
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                            Previous Content:
                                        </Typography>
                                        <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#f5f5f5', mb: 1 }}>
                                            <Typography variant="body2">
                                                {edit.previousContent}
                                            </Typography>
                                        </Paper>
                                        {edit.editReason && (
                                            <>
                                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                                    Edit Reason:
                                                </Typography>
                                                <Typography variant="body2" fontStyle="italic">
                                                    {edit.editReason}
                                                </Typography>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* ✅ Quote Reply Dialog */}
            <Dialog
                open={quoteReplyDialogOpen}
                onClose={() => !addingQuoteReply && setQuoteReplyDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                            <FormatQuote />
                            <Typography variant="h6">Quote Reply</Typography>
                        </Box>
                        <IconButton onClick={() => setQuoteReplyDialogOpen(false)} disabled={addingQuoteReply}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
                    {/* Quoted Comment */}
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 2,
                            mb: 2,
                            bgcolor: '#f5f5f5',
                            borderLeft: '4px solid',
                            borderColor: 'primary.main'
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                            <Typography variant="caption" fontWeight="bold">
                                {selectedComment?.createdBy?.userName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                ({selectedComment?.createdBy?.userRole})
                            </Typography>
                        </Box>
                        <Typography variant="body2" fontStyle="italic">
                            {selectedComment?.comment}
                        </Typography>
                    </Paper>
                    
                    {/* Reply Content */}
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Your Reply"
                        placeholder="Write your reply... Use @FirstName LastName to mention someone"
                        value={quoteReplyContent}
                        onChange={(e) => setQuoteReplyContent(e.target.value)}
                        disabled={addingQuoteReply}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setQuoteReplyDialogOpen(false)} disabled={addingQuoteReply}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleQuoteReplySubmit}
                        disabled={addingQuoteReply || !quoteReplyContent.trim()}
                        startIcon={addingQuoteReply ? <CircularProgress size={20} /> : <Send />}
                    >
                        {addingQuoteReply ? 'Sending...' : 'Send Reply'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ✅ Nested Reply Dialog */}
            <Dialog
                open={nestedReplyDialogOpen}
                onClose={() => !addingNestedReply && setNestedReplyDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                            <Reply />
                            <Typography variant="h6">Reply to Comment</Typography>
                        </Box>
                        <IconButton onClick={() => setNestedReplyDialogOpen(false)} disabled={addingNestedReply}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
                    {/* Original Comment */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                            Replying to:
                        </Typography>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                                    {selectedComment?.createdBy?.userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </Avatar>
                                <Typography variant="caption" fontWeight="bold">
                                    {selectedComment?.createdBy?.userName}
                                </Typography>
                            </Box>
                            <Typography variant="body2">
                                {selectedComment?.comment}
                            </Typography>
                        </Paper>
                    </Box>
                    
                    {/* Reply Content */}
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Your Reply"
                        placeholder="Write your reply... Use @FirstName LastName to mention someone"
                        value={nestedReplyContent}
                        onChange={(e) => setNestedReplyContent(e.target.value)}
                        disabled={addingNestedReply}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNestedReplyDialogOpen(false)} disabled={addingNestedReply}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNestedReplySubmit}
                        disabled={addingNestedReply || !nestedReplyContent.trim()}
                        startIcon={addingNestedReply ? <CircularProgress size={20} /> : <Send />}
                    >
                        {addingNestedReply ? 'Sending...' : 'Send Reply'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ✅ Likes Dialog */}
            <Dialog
                open={likesDialogOpen}
                onClose={() => setLikesDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                            <ThumbUp color="primary" />
                            <Typography variant="h6">Likes ({selectedLikes.length})</Typography>
                        </Box>
                        <IconButton onClick={() => setLikesDialogOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                    {selectedLikes.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                            No likes yet
                        </Typography>
                    ) : (
                        <Stack spacing={1.5}>
                            {selectedLikes.map((like, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ width: 40, height: 40, fontSize: '0.875rem' }}>
                                        {like.userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {like.userName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip label={like.userRole} size="small" sx={{ height: 18, fontSize: '0.7rem' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDateTime(like.likedAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLikesDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            </Box>
        </Box>
    );
};

export default LeadStream;
