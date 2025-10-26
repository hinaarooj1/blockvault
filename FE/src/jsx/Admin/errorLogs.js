import React, { useEffect, useState, useCallback } from "react";
import SideBar from "../layouts/AdminSidebar/Sidebar";
import AdminHeader from "./adminHeader";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Paper,
  Tooltip,
  Avatar,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  CardHeader,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  BugReport as BugIcon,
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  Launch as LaunchIcon,
  Visibility as ViewIcon,
  SelectAll as SelectAllIcon,
  Deselect as DeselectIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Route as RouteIcon,
  Schedule as ScheduleIcon,
  Code as CodeIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { Link, useNavigate } from "react-router-dom";
import {
  getErrorLogsApi,
  deleteErrorLogsApi,
} from "../../Api/Service";

const AdminErrorLogs = () => {
  const authUser = useAuthUser()();
  const Navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const toggleBar = useCallback(() => setActive((p) => !p), []);

  const fetchLogs = useCallback(async (pageNum = 0, limit = rowsPerPage) => {
    setIsLoading(true);
    try {
      const res = await getErrorLogsApi(pageNum + 1, limit);
      if (res.success) {
        setLogs(res.logs);
        setPage(pageNum);
        setTotalCount(res.pagination?.total || res.logs.length);
        setRowsPerPage(limit);
      } else {
        toast.error(res.msg || "Failed to fetch logs");
      }
    } catch (err) {
      toast.error(err.message || "Error fetching logs");
    } finally {
      setIsLoading(false);
    }
  }, [rowsPerPage]);

  const handleDelete = useCallback(async (ids = []) => {
    try {
      const res = await deleteErrorLogsApi(ids);
      if (res.success) {
        toast.success(res.message || "Logs deleted successfully");
        setSelectedIds([]);
        setSelectAll(false);
        fetchLogs(page, rowsPerPage);
      } else {
        toast.error(res.msg || "Deletion failed");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting logs");
    }
  }, [fetchLogs, page, rowsPerPage]);

  useEffect(() => {
    if (authUser.user.role !== "superadmin") {
      Navigate("/admin/dashboard");
      return;
    }
    fetchLogs(0, rowsPerPage);
  }, [authUser, Navigate, fetchLogs, rowsPerPage]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(logs.map(log => log._id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleChangePage = (event, newPage) => {
    fetchLogs(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    fetchLogs(0, newRowsPerPage);
  };

  const getStatusColor = (statusCode) => {
    if (statusCode >= 500) return "error";
    if (statusCode >= 400) return "warning";
    return "info";
  };

  const getSeverityColor = (statusCode) => {
    if (statusCode >= 500) return "#f44336";
    if (statusCode >= 400) return "#ff9800";
    return "#2196f3";
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return "No message";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDetailDialog(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const ErrorDetailDialog = ({ log, open, onClose }) => {
    if (!log) return null;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        fullScreen={window.innerWidth < 600}
        PaperProps={{
          sx: {
            backgroundColor: 'grey.900',
            borderRadius: { xs: 0, sm: 3 },
            background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            m: { xs: 0, sm: 2 }
          }
        }}
      >
        <DialogTitle sx={{
          color: 'white',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          p: { xs: 2, sm: 3 }
        }}>
          <BugIcon sx={{ color: getSeverityColor(log.statusCode), fontSize: { xs: 24, sm: 32 } }} />
          <Box>
            <Typography 
              variant="h5" 
              fontWeight={700}
              sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
            >
              Error Details
            </Typography>
            <Typography 
              variant="body2" 
              color="grey.400"
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                wordBreak: 'break-all'
              }}
            >
              ID: {log._id}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Header Card */}
          <Card sx={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            m: { xs: 2, sm: 3 },
            mb: 2,
            border: `2px solid ${getSeverityColor(log.statusCode)}20`
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <WarningIcon color="error" />
                    <Typography variant="h6" style={{ color: "white" }} color="white">
                      Error Message
                    </Typography>
                  </Box>
                  <Alert
                    severity={log.statusCode >= 500 ? "error" : log.statusCode >= 400 ? "warning" : "info"}
                    sx={{
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      color: 'white',
                      alignItems: 'flex-start'
                    }}
                  >
                    {log.message}
                  </Alert>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <InfoIcon color="primary" />
                    <Typography variant="h6" style={{ color: "white" }} color="white">
                      Quick Info
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    <Chip
                      label={`Status: ${log.statusCode || 'N/A'}`}
                      color={getStatusColor(log.statusCode)}
                      variant="outlined"
                    />
                    <Chip
                      label={`Method: ${log.method}`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={formatRelativeTime(log.createdAt)}
                      color="secondary"
                      variant="outlined"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          {/* Detailed Information */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Accordion defaultExpanded sx={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: 'white',
              mb: 2
            }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RouteIcon />
                  <Typography variant="h6" style={{ color: "white" }}>Route Information</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CodeIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Endpoint"
                      secondary={log.route}
                      secondaryTypographyProps={{ color: 'grey.300' }}
                    />
                    <IconButton size="small" onClick={() => copyToClipboard(log.route)}>
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BugIcon sx={{ color: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="HTTP Method"
                      secondary={log.method}
                      secondaryTypographyProps={{ color: 'grey.300' }}
                    />
                  </ListItem>
                  {log.ipAddress && (
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon sx={{ color: 'info.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="IP Address"
                        secondary={log.ipAddress}
                        secondaryTypographyProps={{ color: 'grey.300' }}
                      />
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded sx={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: 'white',
              mb: 2
            }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon />
                  <Typography variant="h6" style={{ color: "white" }}>Timeline</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Occurred At"
                      secondary={formatDateTime(log.createdAt)}
                      secondaryTypographyProps={{ color: 'grey.300' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Relative Time"
                      secondary={formatRelativeTime(log.createdAt)}
                      secondaryTypographyProps={{ color: 'grey.300' }}
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {log.UserEmail && (
              <Accordion defaultExpanded sx={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                color: 'white'
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    <Typography variant="h6" style={{ color: "white" }}>User Information</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon sx={{ color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="User Name"
                        secondary={log.userName}
                        secondaryTypographyProps={{ color: 'grey.300' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon sx={{ color: 'info.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={log.UserEmail}
                        secondaryTypographyProps={{ color: 'grey.300' }}
                      />
                      <IconButton size="small" onClick={() => copyToClipboard(log.UserEmail)}>
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                    {log.userId && (
                      <ListItem>
                        <ListItemIcon>
                          <LaunchIcon sx={{ color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="User ID"
                          secondary={log.userId}
                          secondaryTypographyProps={{ color: 'grey.300' }}
                        />
                        <Button
                          size="small"
                          component={Link}
                          to={`/admin/user/${log.userId}/general`}
                          startIcon={<LaunchIcon />}
                          sx={{ color: 'primary.main' }}
                        >
                          View Profile
                        </Button>
                      </ListItem>
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {log.body && Object.keys(log.body).length > 0 && (
              <Accordion sx={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                color: 'white',
                mt: 2
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon />
                    <Typography variant="h6" style={{ color: "white" }}>Request Body</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper sx={{
                    p: 2,
                    backgroundColor: 'black',
                    color: 'grey.300',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    maxHeight: 300,
                    overflow: 'auto'
                  }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(log.body, null, 2)}
                    </pre>
                  </Paper>
                </AccordionDetails>
              </Accordion>
            )}

            {log.params && Object.keys(log.params).length > 0 && (
              <Accordion sx={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                color: 'white',
                mt: 2
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon />
                    <Typography variant="h6" style={{ color: "white" }}>Request Params</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper sx={{
                    p: 2,
                    backgroundColor: 'black',
                    color: 'grey.300',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    maxHeight: 200,
                    overflow: 'auto'
                  }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(log.params, null, 2)}
                    </pre>
                  </Paper>
                </AccordionDetails>
              </Accordion>
            )}

            {log.query && Object.keys(log.query).length > 0 && (
              <Accordion sx={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                color: 'white',
                mt: 2
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon />
                    <Typography variant="h6" style={{ color: "white" }}>Query Parameters</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper sx={{
                    p: 2,
                    backgroundColor: 'black',
                    color: 'grey.300',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    maxHeight: 200,
                    overflow: 'auto'
                  }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(log.query, null, 2)}
                    </pre>
                  </Paper>
                </AccordionDetails>
              </Accordion>
            )}

            {log.stackTrace && (
              <Accordion sx={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                color: 'white',
                mt: 2
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon />
                    <Typography variant="h6" style={{ color: "white" }}>Stack Trace</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper sx={{
                    p: 2,
                    backgroundColor: 'black',
                    color: 'grey.300',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    maxHeight: 200,
                    overflow: 'auto'
                  }}>
                    <pre>{log.stackTrace}</pre>
                  </Paper>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{
          p: { xs: 2, sm: 3 },
          borderTop: '1px solid rgba(255,255,255,0.1)',
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button
            onClick={onClose}
            fullWidth={window.innerWidth < 600}
            sx={{
              color: 'white !important',
              backgroundColor: 'grey.700 !important',
              '&:hover': { backgroundColor: 'grey.600 !important' }
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setSelectedIds([log._id]);
              setDeleteDialog(true);
              onClose();
            }}
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon sx={{ color: 'inherit !important' }} />}
            fullWidth={window.innerWidth < 600}
            sx={{
              color: 'error.main !important',
              borderColor: 'error.main !important',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1) !important',
                borderColor: 'error.dark !important'
              }
            }}
          >
            Delete This Log
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div className="admin dark-new-ui">
      <div className="bg-gray-900 min-h-screen">
        <SideBar state={active} toggle={toggleBar} />
        <div className="bg-gray-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
          <AdminHeader toggle={toggleBar} pageName="Error Logs" />

          <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            {/* Modern Header Section */}
            <Card sx={{
              mb: 3,
              background: 'linear-gradient(135deg, #25256cff 0%, #764ba2 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between", 
                  alignItems: { xs: "flex-start", sm: "center" }, 
                  mb: 3,
                  gap: 2
                }}>
                  <Box>
                    <Typography 
                      variant="h3" 
                      fontWeight={800} 
                      color="white" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
                    >
                      🚨 Error Monitoring
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="rgba(255,255,255,0.8)" 
                      sx={{ 
                        mb: 2,
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                      }}
                    >
                      Real-time system error tracking and management
                    </Typography>
                    <Chip
                      label={`${totalCount} Total Errors (Last 7 days)`}
                      variant="filled"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    />
                  </Box>
                  <Avatar sx={{
                    width: { xs: 60, sm: 70, md: 80 },
                    height: { xs: 60, sm: 70, md: 80 },
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    display: { xs: 'none', sm: 'flex' }
                  }}>
                    <BugIcon sx={{ fontSize: { sm: 35, md: 40 } }} />
                  </Avatar>
                </Box>

                <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                  <Grid item xs={6} sm={6} md={3}>
                    <Paper sx={{
                      p: { xs: 1.5, sm: 2 },
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      height: '100%',
                      minHeight: { xs: 90, sm: 100 },
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, width: '100%' }}>
                        <Box sx={{
                          p: { xs: 1, sm: 1.5 },
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ErrorIcon sx={{ color: 'white', fontSize: { xs: 20, sm: 28 } }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h4" 
                            color="white" 
                            fontWeight={700}
                            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}
                          >
                            {totalCount}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="rgba(255,255,255,0.8)"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                          >
                            Total Errors
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={6} sm={6} md={3}>
                    <Paper sx={{
                      p: { xs: 1.5, sm: 2 },
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      height: '100%',
                      minHeight: { xs: 90, sm: 100 },
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, width: '100%' }}>
                        <Box sx={{
                          p: { xs: 1, sm: 1.5 },
                          borderRadius: 2,
                          backgroundColor: selectedIds.length > 0 ? 'rgba(244,67,54,0.3)' : 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}>
                          <DeleteIcon sx={{ color: selectedIds.length > 0 ? '#ff6b6b' : 'white', fontSize: { xs: 20, sm: 28 } }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h4"
                            color={selectedIds.length > 0 ? "#ff6b6b" : "white"}
                            fontWeight={700}
                            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}
                          >
                            {selectedIds.length}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="rgba(255,255,255,0.8)"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                          >
                            Selected
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* New Card: Critical Errors (500+) */}
                  <Grid item xs={6} sm={6} md={3}>
                    <Paper sx={{
                      p: { xs: 1.5, sm: 2 },
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      height: '100%',
                      minHeight: { xs: 90, sm: 100 },
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, width: '100%' }}>
                        <Box sx={{
                          p: { xs: 1, sm: 1.5 },
                          borderRadius: 2,
                          backgroundColor: 'rgba(244,67,54,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <WarningIcon sx={{ color: '#ff6b6b', fontSize: { xs: 20, sm: 28 } }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h4" 
                            color="#ff6b6b" 
                            fontWeight={700}
                            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}
                          >
                            {logs.filter(log => log.statusCode >= 500).length}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="rgba(255,255,255,0.8)"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                          >
                            Critical
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* New Card: Recent (24h) */}
                  <Grid item xs={6} sm={6} md={3}>
                    <Paper sx={{
                      p: { xs: 1.5, sm: 2 },
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      height: '100%',
                      minHeight: { xs: 90, sm: 100 },
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, width: '100%' }}>
                        <Box sx={{
                          p: { xs: 1, sm: 1.5 },
                          borderRadius: 2,
                          backgroundColor: 'rgba(33,150,243,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ScheduleIcon sx={{ color: '#64b5f6', fontSize: { xs: 20, sm: 28 } }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h4" 
                            color="#64b5f6" 
                            fontWeight={700}
                            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}
                          >
                            {logs.filter(log => {
                              const logDate = new Date(log.createdAt);
                              const now = new Date();
                              const diffHours = (now - logDate) / (1000 * 60 * 60);
                              return diffHours <= 24;
                            }).length}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="rgba(255,255,255,0.8)"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                          >
                            Last 24h
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Action Bar */}
            <Paper sx={{
              p: { xs: 1.5, sm: 2 },
              mb: 2,
              backgroundColor: 'grey.800',
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              flexWrap: 'wrap',
              borderRadius: 2
            }}>
              <Tooltip title="Refresh logs">
                <IconButton
                  onClick={() => fetchLogs(page, rowsPerPage)}
                  sx={{
                    backgroundColor: 'primary.main !important',
                    '&:hover': { backgroundColor: 'primary.dark !important' },
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    color: 'white !important'
                  }}
                >
                  <RefreshIcon sx={{ color: 'white !important', fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
              </Tooltip>

              <Badge badgeContent={selectedIds.length} color="error" showZero={false}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon sx={{ display: { xs: 'none', sm: 'block' }, color: 'crimson !important' }} />}
                  onClick={() => setDeleteDialog(true)}
                  disabled={selectedIds.length === 0}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    minWidth: { xs: 'auto', sm: 'auto' },
                    padding: { xs: '6px 12px !important', sm: '8px 24px !important' },
                    border: '1px solid crimson !important',
                    color: 'crimson !important',
                    backgroundColor: 'transparent !important',
                    '&:hover': {
                      backgroundColor: 'rgba(220, 20, 60, 0.1) !important'
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(220, 20, 60, 0.4) !important',
                      border: '1px solid rgba(220, 20, 60, 0.4) !important'
                    }
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, color: 'inherit !important' }}>
                    Delete Selected
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' }, color: 'inherit !important' }}>
                    Delete
                  </Box>
                </Button>
              </Badge>

              <Tooltip title={selectAll ? "Deselect all" : "Select all"}>
                <IconButton
                  onClick={handleSelectAll}
                  sx={{
                    backgroundColor: 'grey.700 !important',
                    '&:hover': { backgroundColor: 'grey.600 !important' },
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    color: 'white !important'
                  }}
                >
                  {selectAll ? <DeselectIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: 'white !important' }} /> : <SelectAllIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: 'white !important' }} />}
                </IconButton>
              </Tooltip>

              <Box sx={{ flexGrow: 1 }} />

              <Typography 
                variant="body2" 
                color="grey.400"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Showing {logs.length} of {totalCount} errors
              </Typography>
              <Typography 
                variant="body2" 
                color="grey.400"
                sx={{ 
                  fontSize: '0.7rem',
                  display: { xs: 'block', sm: 'none' }
                }}
              >
                {logs.length}/{totalCount}
              </Typography>
            </Paper>

            {isLoading && (
              <LinearProgress sx={{ mb: 2, height: 4, borderRadius: 2 }} />
            )}

            {/* Modern Table */}
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: 'grey.800',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                overflowX: 'auto'
              }}
            >
              <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <TableCell 
                      padding="checkbox" 
                      sx={{ 
                        borderColor: 'rgba(255,255,255,0.1)',
                        display: { xs: 'none', sm: 'table-cell' }
                      }}
                    >
                      <Checkbox
                        indeterminate={selectedIds.length > 0 && selectedIds.length < logs.length}
                        checked={selectAll}
                        onChange={handleSelectAll}
                        sx={{ color: 'grey.400' }}
                      />
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'grey.300', 
                        fontWeight: 600, 
                        borderColor: 'rgba(255,255,255,0.1)',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      Error Details
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'grey.300', 
                        fontWeight: 600, 
                        borderColor: 'rgba(255,255,255,0.1)',
                        display: { xs: 'none', md: 'table-cell' },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      Route
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'grey.300', 
                        fontWeight: 600, 
                        borderColor: 'rgba(255,255,255,0.1)',
                        display: { xs: 'none', lg: 'table-cell' },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      User
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'grey.300', 
                        fontWeight: 600, 
                        borderColor: 'rgba(255,255,255,0.1)',
                        display: { xs: 'none', sm: 'table-cell' },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      Time
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'grey.300', 
                        fontWeight: 600, 
                        borderColor: 'rgba(255,255,255,0.1)', 
                        textAlign: 'center',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.length === 0 && !isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: { xs: 4, sm: 6 } }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <ErrorIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'grey.500', mb: 2 }} />
                          <Typography 
                            variant="h5" 
                            color="grey.400" 
                            gutterBottom
                            sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
                          >
                            No Error Logs Found
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="grey.500"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                          >
                            Your system is running smoothly with no errors detected
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow
                        key={log._id}
                        hover
                        selected={selectedIds.includes(log._id)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                          transition: 'all 0.2s ease',
                          borderColor: 'rgba(255,255,255,0.1)'
                        }}
                      >
                        <TableCell 
                          padding="checkbox" 
                          sx={{ 
                            borderColor: 'rgba(255,255,255,0.1)',
                            display: { xs: 'none', sm: 'table-cell' }
                          }}
                        >
                          <Checkbox
                            checked={selectedIds.includes(log._id)}
                            onChange={() => toggleSelect(log._id)}
                            sx={{ color: 'grey.400' }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, sm: 2 }, maxWidth: { xs: 200, sm: 300, md: 400 } }}>
                            <Box sx={{
                              p: { xs: 0.5, sm: 1 },
                              borderRadius: 1,
                              backgroundColor: `${getSeverityColor(log.statusCode)}20`,
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              <BugIcon sx={{ color: getSeverityColor(log.statusCode), fontSize: { xs: 16, sm: 20 } }} />
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Tooltip title={log.message || "No error message"} arrow>
                                <Typography
                                  variant="body2"
                                  color="white"
                                  fontWeight={500}
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: 1.4,
                                    maxHeight: '2.8em',
                                    wordBreak: 'break-word',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                  }}
                                >
                                  {truncateText(log.message, 70)}
                                </Typography>
                              </Tooltip>
                              {log.statusCode && (
                                <Chip
                                  label={`${log.statusCode}`}
                                  size="small"
                                  sx={{
                                    mt: 0.5,
                                    backgroundColor: getSeverityColor(log.statusCode),
                                    color: 'white',
                                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                    height: { xs: 18, sm: 20 }
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            borderColor: 'rgba(255,255,255,0.1)',
                            display: { xs: 'none', md: 'table-cell' }
                          }}
                        >
                          <Box>
                            <Chip
                              label={log.method}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ mb: 0.5, fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
                            />
                            <Typography
                              variant="body2"
                              color="grey.300"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: { xs: 100, sm: 150 },
                                fontFamily: 'monospace',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' }
                              }}
                            >
                              {log.route}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            borderColor: 'rgba(255,255,255,0.1)',
                            display: { xs: 'none', lg: 'table-cell' }
                          }}
                        >
                          {log.UserEmail ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, fontSize: '0.8rem' }}>
                                {log.userName?.charAt(0) || 'U'}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography 
                                  variant="body2" 
                                  color="white" 
                                  noWrap
                                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                  {log.userName}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  color="grey.400" 
                                  noWrap
                                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                                >
                                  {log.UserEmail}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Chip
                              label="System"
                              size="small"
                              variant="outlined"
                              color="default"
                            />
                          )}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            borderColor: 'rgba(255,255,255,0.1)',
                            display: { xs: 'none', sm: 'table-cell' }
                          }}
                        >
                          <Box>
                            <Typography 
                              variant="body2" 
                              color="white" 
                              fontWeight={500}
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              {formatRelativeTime(log.createdAt)}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="grey.400"
                              sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                            >
                              {formatDateTime(log.createdAt)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.1)', textAlign: 'center' }}>
                          <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={{ xs: 0.5, sm: 1 }} 
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Tooltip title="View full details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(log)}
                                sx={{
                                  backgroundColor: 'primary.main !important',
                                  '&:hover': { backgroundColor: 'primary.dark !important' },
                                  width: { xs: 28, sm: 32 },
                                  height: { xs: 28, sm: 32 },
                                  color: 'white !important'
                                }}
                              >
                                <ViewIcon sx={{ color: 'white !important', fontSize: { xs: 14, sm: 18 } }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete this log">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSelectedIds([log._id]);
                                  setDeleteDialog(true);
                                }}
                                sx={{
                                  backgroundColor: 'error.main !important',
                                  '&:hover': { backgroundColor: 'error.dark !important' },
                                  width: { xs: 28, sm: 32 },
                                  height: { xs: 28, sm: 32 },
                                  color: 'white !important'
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: 'white !important' }} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Enhanced Pagination */}
            {logs.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  color: 'grey.300',
                  backgroundColor: 'grey.800',
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderTop: 'none'
                }}
              />
            )}
          </Box>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        fullScreen={window.innerWidth < 600}
        PaperProps={{
          sx: {
            backgroundColor: 'grey.900',
            borderRadius: { xs: 0, sm: 3 },
            background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            m: { xs: 0, sm: 2 }
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'white', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          p: { xs: 2, sm: 3 },
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}>
          🗑️ Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Alert severity="warning" sx={{ 
            mt: 2, 
            backgroundColor: 'rgba(255,152,0,0.1)',
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }}>
            This action cannot be undone. The selected error logs will be permanently deleted.
          </Alert>
          <Typography sx={{ 
            color: 'grey.300', 
            mt: 2,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            {selectedIds.length === 1
              ? "Are you sure you want to delete this error log?"
              : `You're about to delete ${selectedIds.length} error logs.`
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1
        }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            fullWidth={window.innerWidth < 600}
            sx={{
              color: 'white !important',
              backgroundColor: 'grey.700 !important',
              '&:hover': { backgroundColor: 'grey.600 !important' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDelete(selectedIds);
              setDeleteDialog(false);
            }}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon sx={{ color: 'white !important' }} />}
            fullWidth={window.innerWidth < 600}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              backgroundColor: 'error.main !important',
              color: 'white !important',
              '&:hover': {
                backgroundColor: 'error.dark !important'
              }
            }}
          >
            Delete {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Details Dialog */}
      <ErrorDetailDialog
        log={selectedLog}
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
      />
    </div>
  );
};

export default React.memo(AdminErrorLogs);