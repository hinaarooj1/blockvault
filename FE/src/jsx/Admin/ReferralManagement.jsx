import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card,
  CardContent,
  Stack,
  Paper,
  Chip,
  Button,
  TextField,
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
  TablePagination,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import SideBar from "../layouts/AdminSidebar/Sidebar";
import AdminHeader from "./adminHeader";
import { 
  getAllReferralsAdminApi, 
  getSystemStatisticsApi, 
  getUserReferralDetailsApi,
  activateUserAndSetCommissionApi,
  signleUsersApi,
  createTransactionApi
} from "../../Api/Service";

const ReferralManagement = () => {
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const [Active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // 🔐 Security: Only admins/superadmins with referral management permission can access
  useEffect(() => {
    const checkPermissions = async () => {
      const user = authUser()?.user;
      
      // Basic role checks (these don't change dynamically)
      if (user?.role === "user") {
        navigate("/dashboard");
        return;
      } else if (user?.role === "subadmin") {
        navigate("/admin/dashboard");
        return;
      }
      
      // For admins, fetch fresh permission data from database
      if (user?.role === "admin") {
        try {
          const response = await signleUsersApi(user._id);
          if (response.success) {
            const freshUserData = response.signleUser;
            if (!freshUserData.adminPermissions?.canManageReferrals) {
              toast.error("You don't have permission to access referral management");
              navigate("/admin/dashboard");
              return;
            }
          } else {
            toast.error("Failed to verify permissions");
            navigate("/admin/dashboard");
            return;
          }
        } catch (error) {
          console.error("Error checking permissions:", error);
          toast.error("Failed to verify permissions");
          navigate("/admin/dashboard");
          return;
        }
      }
    };

    checkPermissions();
  }, [authUser, navigate]);
  
  // Data states
  const [referrals, setReferrals] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Dialog states
  const [activateDialog, setActivateDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  
  // Form states
  const [commissionAmount, setCommissionAmount] = useState('100'); // Default $100
  const [notes, setNotes] = useState('');
  const [isCommissionPaid, setIsCommissionPaid] = useState(false);

  const toggleBar = () => {
    setActive(!Active);
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchStatistics();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: page + 1,
        limit: rowsPerPage
      };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const response = await getAllReferralsAdminApi(params);
      
      if (response.success) {
        setReferrals(response.referrals);
        setTotalReferrals(response.pagination.totalReferrals);
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getSystemStatisticsApi();
      
      if (response.success) {
        setStatistics(response.statistics);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Failed to load statistics');
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await getUserReferralDetailsApi(userId);
      
      if (response.success) {
        setUserDetails(response.user);
        setViewDialog(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
    }
  };

  const handleActivateUser = async () => {
    if (!commissionAmount || parseFloat(commissionAmount) <= 0) {
      toast.error('Please enter a valid commission amount');
      return;
    }
    
    if (!selectedUser.referredBy || !selectedUser.referredBy.id) {
      toast.error('Cannot activate: No referrer found');
      return;
    }
    
    try {
      // 1. Activate user and set commission
      const response = await activateUserAndSetCommissionApi(selectedUser.id, {
        commissionAmount: parseFloat(commissionAmount),
        notes
      });
      
      if (response.success) {
        // 2. Create USDT deposit transaction for the referrer
        try {
          const transactionBody = {
            trxName: 'tether',
            amount: parseFloat(commissionAmount),
            txId: `REFERRAL-COMMISSION-${Date.now()}`,
            fromAddress: `Referral Commission for ${selectedUser.name}`,
            note: notes || `Commission for referring ${selectedUser.name}`,
            reference: `REF-${selectedUser.id}`,
            subjectLine: `Referral Commission Payment: $${commissionAmount} USDT`,
            status: 'completed',
            type: 'deposit'
          };

          const transactionResponse = await createTransactionApi(
            selectedUser.referredBy.id,
            transactionBody
          );

          if (transactionResponse.success) {
            toast.success(`${response.msg} - USDT commission deposited successfully`);
          } else {
            toast.warning(`${response.msg} - But failed to create USDT transaction: ${transactionResponse.msg}`);
          }
        } catch (transactionError) {
          console.error('Error creating transaction:', transactionError);
          toast.warning(`${response.msg} - But failed to create USDT transaction`);
        }

        setActivateDialog(false);
        setCommissionAmount('');
        setNotes('');
        setSelectedUser(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error(error.msg || 'Failed to activate user');
    }
  };

  return (
    <div className="admin dark-new-ui">
      <div className="bg-gray-900 min-h-screen">
        <SideBar state={Active} toggle={toggleBar} />
        
        <div className="bg-gray-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
          <div className="mx-auto w-full max-w-7xl">
            <AdminHeader toggle={toggleBar} pageName="Referral Management" />
            
            <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                  Referral Management
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.400' }}>
                  Manage user referrals, activate members, and set commissions
                </Typography>
              </Box>

              {/* Tabs */}
              <Paper
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  mb: 3
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={(e, v) => setActiveTab(v)}
                  sx={{
                    '& .MuiTab-root': {
                      color: 'grey.400',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      px: 3
                    },
                    '& .Mui-selected': {
                      color: 'primary.main !important'
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#667eea'
                    }
                  }}
                >
                  <Tab label="Referrals" icon={<PeopleIcon />} iconPosition="start" />
                  <Tab label="Statistics" icon={<TrendingUpIcon />} iconPosition="start" />
                </Tabs>
              </Paper>

              {/* Tab Content */}
              {activeTab === 0 && (
                <>
                  {/* Filters */}
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
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          placeholder="Search by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'primary.main' }} />
                              </InputAdornment>
                            ),
                            sx: {
                              height: '40px'
                            }
                          }}
                          sx={{
                            flex: 1,
                            minWidth: '250px',
                            '& .MuiOutlinedInput-root': {
                              color: 'grey.100',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: 2,
                              height: '40px',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                borderWidth: '2px'
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
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
                            <MenuItem value="">All Status</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<RefreshIcon />}
                          onClick={fetchData}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            height: '40px',
                            color: 'white !important',
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #1565c0, #1e88e5)',
                              boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
                              color: 'white !important'
                            }
                          }}
                        >
                          Refresh
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Referrals Table */}
                  <Paper
                    elevation={0}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                      </Box>
                    ) : referrals.length === 0 ? (
                      <Box sx={{ p: 8, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <PersonIcon sx={{ fontSize: 64, color: 'grey.600', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'grey.400' }}>
                          No referrals found
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'grey.500', mt: 1 }}>
                          {searchTerm ? 'Try adjusting your search query' : 'No referrals to display'}
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Name
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Email
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Referred By
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Status
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Commission Paid
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Referrals
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Joined
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Actions
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {referrals.map((referral) => (
                                <TableRow key={referral.id}>
                                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d3142' }}>
                                    {referral.name}
                                  </TableCell>
                                  <TableCell sx={{ color: '#8b92a7', borderBottom: '1px solid #2d3142' }}>
                                    {referral.email}
                                  </TableCell>
                                  <TableCell sx={{ color: '#8b92a7', borderBottom: '1px solid #2d3142' }}>
                                    {referral.referredBy ? (
                                      <Box>
                                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                                          {referral.referredBy.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#8b92a7' }}>
                                          {referral.referredBy.email}
                                        </Typography>
                                      </Box>
                                    ) : 'N/A'}
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: '1px solid #2d3142' }}>
                                    <Chip
                                      label={referral.status}
                                      size="small"
                                      sx={{
                                        bgcolor: referral.status === 'active' ? '#10b98120' : '#f59e0b20',
                                        color: referral.status === 'active' ? '#10b981' : '#f59e0b',
                                        fontWeight: 600
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: '1px solid #2d3142' }}>
                                    {referral.commissionPaid ? (
                                      <Box>
                                        <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>
                                          ${referral.commissionPaid.amount}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#8b92a7' }}>
                                          By: {referral.commissionPaid.approvedBy}
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                                        Not Paid
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d3142' }}>
                                    {referral.referralsCount}
                                  </TableCell>
                                  <TableCell sx={{ color: '#8b92a7', borderBottom: '1px solid #2d3142' }}>
                                    {new Date(referral.joinedDate).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: '1px solid #2d3142' }}>
                                    <Stack direction="row" spacing={1}>
                                      <Tooltip title="View Details">
                                        <IconButton
                                          size="small"
                                          onClick={() => fetchUserDetails(referral.id)}
                                          sx={{ color: 'white !important', '&:hover': { color: '#667eea !important' } }}
                                        >
                                          <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      
                                      {/* Only show activate button if: inactive, has referrer, and commission NOT paid */}
                                      {referral.status === 'inactive' && referral.referredBy && !referral.commissionPaid && (
                                        <Tooltip title="Activate & Set Commission">
                                          <IconButton
                                            size="small"
                                            onClick={() => {
                                              setSelectedUser(referral);
                                              setCommissionAmount('100'); // Default $100
                                              setNotes('');
                                              setIsCommissionPaid(false);
                                              setActivateDialog(true);
                                            }}
                                            sx={{ color: 'white !important', '&:hover': { color: '#10b981 !important' } }}
                                          >
                                            <CheckCircleIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                      
                                      {/* Show commission paid badge if already activated */}
                                      {referral.commissionPaid && (
                                        <Tooltip title={`Commission of $${referral.commissionPaid.amount} already paid`}>
                                          <Chip 
                                            label="Activated" 
                                            size="small"
                                            icon={<CheckCircleIcon />}
                                            sx={{ 
                                              bgcolor: '#10b98120', 
                                              color: '#10b981',
                                              fontWeight: 600,
                                              fontSize: '0.7rem'
                                            }} 
                                          />
                                        </Tooltip>
                                      )}
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        
                        <TablePagination
                          component="div"
                          count={totalReferrals}
                          page={page}
                          onPageChange={(e, newPage) => setPage(newPage)}
                          rowsPerPage={rowsPerPage}
                          onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                          }}
                          sx={{
                            color: '#8b92a7',
                            borderTop: '1px solid #2d3142',
                            '& .MuiTablePagination-selectIcon': {
                              color: '#8b92a7'
                            }
                          }}
                        />
                      </>
                    )}
                  </Paper>
                </>
              )}

              {/* Statistics Tab */}
              {activeTab === 1 && statistics && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={0}
                      sx={{
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)',
                        border: '1px solid rgba(66, 165, 245, 0.2)',
                        borderRadius: 3,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)' }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                              Total Referrals
                            </Typography>
                            <Typography variant="h3" fontWeight="700" sx={{ color: 'white' }}>
                              {statistics.totalReferred}
                            </Typography>
                          </Box>
                          <Box sx={{ bgcolor: 'rgba(66, 165, 245, 0.2)', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PeopleIcon sx={{ fontSize: 32, color: '#42a5f5' }} />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={0}
                      sx={{
                        background: 'linear-gradient(135deg, #1e5f3a 0%, #2d8c5a 100%)',
                        border: '1px solid rgba(76, 175, 80, 0.2)',
                        borderRadius: 3,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)' }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                              Active Referrals
                            </Typography>
                            <Typography variant="h3" fontWeight="700" sx={{ color: 'white' }}>
                              {statistics.activeReferrals}
                            </Typography>
                          </Box>
                          <Box sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircleIcon sx={{ fontSize: 32, color: '#4caf50' }} />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={0}
                      sx={{
                        background: 'linear-gradient(135deg, #5f3a1e 0%, #8c5a2d 100%)',
                        border: '1px solid rgba(255, 167, 38, 0.2)',
                        borderRadius: 3,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)' }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                              Pending
                            </Typography>
                            <Typography variant="h3" fontWeight="700" sx={{ color: 'white' }}>
                              {statistics.inactiveReferrals}
                            </Typography>
                          </Box>
                          <Box sx={{ bgcolor: 'rgba(255, 152, 0, 0.2)', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HourglassIcon sx={{ fontSize: 32, color: '#ff9800' }} />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card
                      elevation={0}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 3
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                          Commission Overview
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 700, mb: 1 }}>
                                ${statistics.commissions.totalPaid}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                                Total Paid
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h3" sx={{ color: '#f59e0b', fontWeight: 700, mb: 1 }}>
                                ${statistics.commissions.totalPending}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                                Pending
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                                ${statistics.commissions.overall}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                                Overall
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Top Referrers */}
                  {statistics.topReferrers && statistics.topReferrers.length > 0 && (
                    <Grid item xs={12}>
                      <Paper
                        elevation={0}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 3,
                          p: 3
                        }}
                      >
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                          Top Referrers
                        </Typography>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Rank
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Name
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Referral Code
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Referrals Count
                                </TableCell>
                                <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                  Total Earned
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {statistics.topReferrers.map((referrer, index) => (
                                <TableRow key={index}>
                                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d3142', fontWeight: 700 }}>
                                    #{index + 1}
                                  </TableCell>
                                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d3142' }}>
                                    <Box>
                                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                                        {referrer.name}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: '#8b92a7' }}>
                                        {referrer.email}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ color: '#667eea', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                    {referrer.referralCode}
                                  </TableCell>
                                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d3142' }}>
                                    {referrer.referralsCount}
                                  </TableCell>
                                  <TableCell sx={{ color: '#10b981', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                                    ${referrer.totalEarned}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          </div>
        </div>
      </div>

      {/* Activate User Dialog */}
      <Dialog 
        open={activateDialog} 
        onClose={() => setActivateDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1e1e1e',
            backgroundImage: 'none',
            border: '1px solid #333',
            borderRadius: 3,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', bgcolor: 'grey.900', borderBottom: '1px solid #333' }}>
          Activate User & Set Commission
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedUser && (
            <>
              <Alert severity="info" sx={{ mb: 3, bgcolor: '#667eea20', color: 'white', border: '1px solid #667eea' }}>
                Activating: <strong>{selectedUser.name}</strong>
                <br />
                Commission will be paid to: <strong>{selectedUser.referredBy?.name || 'N/A'}</strong>
              </Alert>
              <TextField
                fullWidth
                label="Commission Amount ($)"
                type="number"
                value={commissionAmount}
                onChange={(e) => setCommissionAmount(e.target.value)}
                disabled={isCommissionPaid}
                sx={{
                  mb: 2,
                  '& .MuiInputLabel-root': { color: isCommissionPaid ? 'grey.600' : 'grey.400' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
                  '& .MuiOutlinedInput-root': {
                    color: isCommissionPaid ? 'grey.600' : 'white',
                    backgroundColor: isCommissionPaid ? 'rgba(255,255,255,0.02)' : 'transparent',
                    '& fieldset': { borderColor: isCommissionPaid ? 'grey.700' : 'grey.600' },
                    '&:hover fieldset': { borderColor: isCommissionPaid ? 'grey.700' : 'grey.400' },
                    '&.Mui-focused fieldset': { borderColor: isCommissionPaid ? 'grey.700' : 'primary.main' }
                  }
                }}
              />
              <TextField
                fullWidth
                label="Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isCommissionPaid}
                sx={{
                  '& .MuiInputLabel-root': { color: isCommissionPaid ? 'grey.600' : 'grey.400' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
                  '& .MuiOutlinedInput-root': {
                    color: isCommissionPaid ? 'grey.600' : 'white',
                    backgroundColor: isCommissionPaid ? 'rgba(255,255,255,0.02)' : 'transparent',
                    '& fieldset': { borderColor: isCommissionPaid ? 'grey.700' : 'grey.600' },
                    '&:hover fieldset': { borderColor: isCommissionPaid ? 'grey.700' : 'grey.400' },
                    '&.Mui-focused fieldset': { borderColor: isCommissionPaid ? 'grey.700' : 'primary.main' }
                  }
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #333', bgcolor: 'grey.900', p: 2 }}>
          <Button onClick={() => setActivateDialog(false)} sx={{ color: 'grey.300 !important', borderColor: 'grey.600', '&:hover': { borderColor: 'grey.400', color: 'grey.300 !important' } }}>
            Cancel
          </Button>
          <Button 
            onClick={handleActivateUser} 
            variant="contained"
            disabled={isCommissionPaid}
            sx={{
              bgcolor: isCommissionPaid ? 'grey.700' : 'success.main',
              color: 'white !important',
              '&:hover': { 
                bgcolor: isCommissionPaid ? 'grey.700' : 'success.dark', 
                color: 'white !important' 
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.700',
                color: 'grey.500 !important'
              }
            }}
          >
            {isCommissionPaid ? 'Already Activated' : 'Activate & Pay Commission'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog 
        open={viewDialog} 
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
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
          User Referral Details
          <IconButton
            onClick={() => setViewDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white !important', '&:hover': { color: 'grey.400 !important' } }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {userDetails && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ bgcolor: '#1a1d29', p: 3, borderRadius: 2, border: '1px solid #2d3142' }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    {userDetails.name}
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      Email: <span style={{ color: 'white' }}>{userDetails.email}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      Referral Code: <span style={{ color: '#667eea', fontWeight: 600 }}>{userDetails.referralCode}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      Status: <Chip 
                        label={userDetails.affiliateStatus} 
                        size="small" 
                        sx={{
                          bgcolor: userDetails.affiliateStatus === 'active' ? '#10b98120' : '#f59e0b20',
                          color: userDetails.affiliateStatus === 'active' ? '#10b981' : '#f59e0b',
                          fontWeight: 600
                        }}
                      />
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      Total Earned: <span style={{ color: '#10b981', fontWeight: 600 }}>${userDetails.totalEarned}</span>
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              {userDetails.referredBy && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: '#8b92a7', mb: 1 }}>
                    Referred By
                  </Typography>
                  <Paper elevation={0} sx={{ bgcolor: '#1a1d29', p: 2, borderRadius: 2, border: '1px solid #2d3142' }}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {userDetails.referredBy.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      {userDetails.referredBy.email}
                    </Typography>
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#8b92a7', mb: 1 }}>
                  Direct Referrals ({userDetails.referrals?.length || 0})
                </Typography>
                {userDetails.referrals && userDetails.referrals.length > 0 ? (
                  <Stack spacing={1}>
                    {userDetails.referrals.map((ref, index) => (
                      <Paper key={index} elevation={0} sx={{ bgcolor: '#1a1d29', p: 2, borderRadius: 2, border: '1px solid #2d3142' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              {ref.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8b92a7' }}>
                              {ref.email}
                            </Typography>
                          </Box>
                          <Chip 
                            label={ref.status} 
                            size="small" 
                            sx={{
                              bgcolor: ref.status === 'active' ? '#10b98120' : '#f59e0b20',
                              color: ref.status === 'active' ? '#10b981' : '#f59e0b',
                              fontWeight: 600
                            }}
                          />
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Alert severity="info" sx={{ bgcolor: '#667eea20', color: 'white', border: '1px solid #667eea' }}>
                    No direct referrals yet
                  </Alert>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferralManagement;

