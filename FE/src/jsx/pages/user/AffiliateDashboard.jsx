import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Nav from "../../layouts/nav";
import RightWalletBar from "../../layouts/nav/RightWalletBar";
import Footer from "../../layouts/Footer";
import { ThemeContext } from "../../../context/ThemeContext";
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
  IconButton,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
  Alert
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  AccountTree as TreeIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { 
  getMyReferralCodeApi, 
  getMyReferralsApi, 
  getMyReferralTreeApi, 
  getMyEarningsApi,
  getLinksApi 
} from '../../../Api/Service';

// Enhanced Tree component with left-to-right flow (no horizontal scroll)
const ReferralTree = ({ node, level = 0, isLastChild = false }) => {
  if (!node) return null;
  
  const isRoot = level === 0;
  const isYou = node.status === 'You';
  const hasChildren = node.children && node.children.length > 0;
  
  // Debug: Uncomment to see tree structure
  // return (
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'relative',
        mb: isLastChild ? 0 : 2
      }}
    >
      {/* Connection Line */}
      {!isRoot && (
        <>
          {/* Horizontal line from parent */}
          <Box
            sx={{
              position: 'absolute',
              left: { xs: -18, sm: -20, md: -24 },
              top: '28px',
              width: { xs: '18px', sm: '20px', md: '24px' },
              height: '2px',
              bgcolor: `rgba(102, 126, 234, ${Math.max(0.7 - level * 0.1, 0.3)})`,
              zIndex: 1
            }}
          />
        </>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Current Node */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: hasChildren ? 2 : 0 }}>
          <Card
            elevation={isYou ? 6 : 3}
            sx={{
              background: isYou 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : level === 1
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : level === 2
                    ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
                    : level === 3
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : level === 4
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                        : level === 5
                          ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
                          : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', // Pink for level 6+
              border: isYou 
                ? '2px solid #667eea' 
                : `2px solid ${
                    level === 1 ? '#10b981' : 
                    level === 2 ? '#f59e0b' : 
                    level === 3 ? '#ef4444' : 
                    level === 4 ? '#8b5cf6' :
                    level === 5 ? '#06b6d4' :
                    '#ec4899' // Pink for level 6+
                  }`,
              borderRadius: 2,
              width: { xs: '100%', sm: 280, md: 300 },
              maxWidth: '100%',
              position: 'relative',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: isYou 
                  ? '0 8px 24px rgba(102, 126, 234, 0.5)'
                  : `0 8px 24px ${
                      level === 1 ? 'rgba(16, 185, 129, 0.4)' :
                      level === 2 ? 'rgba(245, 158, 11, 0.4)' :
                      level === 3 ? 'rgba(239, 68, 68, 0.4)' :
                      level === 4 ? 'rgba(139, 92, 246, 0.4)' :
                      level === 5 ? 'rgba(6, 182, 212, 0.4)' :
                      'rgba(236, 72, 153, 0.4)' // Pink for level 6+
                    }`
              }
            }}
          >
            {/* Crown for root user */}
            {isYou && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -14,
                  left: 12,
                  fontSize: '1.5rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}
              >
                👑
              </Box>
            )}
            
            {/* Level Badge */}
            {!isYou && level > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: level === 1 ? '#10b981' : 
                          level === 2 ? '#f59e0b' : 
                          level === 3 ? '#ef4444' : 
                          level === 4 ? '#8b5cf6' :
                          level === 5 ? '#06b6d4' :
                          '#ec4899', // Pink for level 6+
                  color: 'white',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  border: '2px solid white'
                }}
              >
                L{level}
              </Box>
            )}
            
            <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Avatar */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255,255,255,0.5)',
                  flexShrink: 0,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <PeopleIcon 
                  sx={{ 
                    color: 'white', 
                    fontSize: 24
                  }} 
                />
              </Box>
              
              {/* Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700,
                    mb: 0.5,
                    fontSize: '0.9rem',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {node.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {/* Status Badge */}
                  {isYou ? (
                    <Chip
                      label="YOU"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        height: 20,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  ) : (
                    <Chip
                      label={node.status.toUpperCase()}
                      size="small"
                      icon={node.status === 'active' ? <CheckCircleIcon /> : <HourglassIcon />}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.25)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.6rem',
                        height: 20,
                        '& .MuiChip-label': { px: 1 },
                        '& .MuiChip-icon': {
                          color: 'white',
                          fontSize: '0.75rem',
                          ml: 0.5
                        }
                      }}
                    />
                  )}
                  
                  {/* Referral Count */}
                  {hasChildren && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    >
                      👥 {node.children.length}
                    </Typography>
                  )}
                  
                  {/* Join Date */}
                  {!isYou && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.65rem',
                        fontWeight: 500
                      }}
                    >
                      📅 {new Date(node.joinedDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          {/* Connection line to children */}
          {hasChildren && (
            <Box
              sx={{
                width: '24px',
                height: '2px',
                bgcolor: 'rgba(102, 126, 234, 0.5)',
                alignSelf: 'center',
                ml: 0.5
              }}
            />
          )}
        </Box>
        
        {/* Children */}
        {hasChildren && (
          <Box 
            sx={{ 
              ml: { xs: 1.5, sm: 2, md: 3 },
              pl: { xs: 1.5, sm: 2, md: 3 },
              borderLeft: `2px solid rgba(102, 126, 234, ${Math.max(0.6 - level * 0.1, 0.2)})`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -2,
                top: 0,
                bottom: 0,
                width: '2px',
                background: `linear-gradient(to bottom, rgba(102, 126, 234, ${Math.max(0.6 - level * 0.1, 0.2)}) 0%, transparent 100%)`,
                zIndex: 1
              }
            }}
          >
            {node.children.map((child, index) => (
              <Box key={index} sx={{ position: 'relative' }}>
                <ReferralTree 
                  node={child} 
                  level={level + 1}
                  isLastChild={index === node.children.length - 1}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const AffiliateDashboard = () => {
  const { sidebariconHover, headWallet } = useContext(ThemeContext);
  const sideMenu = useSelector((state) => state.sideMenu);
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // 🔐 Security: Redirect non-users to their dashboard
  useEffect(() => {
    if (authUser()?.user?.role !== "user") {
      if (authUser()?.user?.role === "superadmin" || authUser()?.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (authUser()?.user?.role === "subadmin") {
        navigate("/admin/dashboard");
      }
    }
  }, [authUser, navigate]);

  // Check if referral system is enabled
  useEffect(() => {
    const checkReferralAccess = async () => {
      try {
        const data = await getLinksApi();
        if (data?.links && Array.isArray(data.links)) {
          const referralLink = data.links[9]; // Referral System link
          if (referralLink && !referralLink.enabled) {
            // Redirect to dashboard if disabled
            navigate('/dashboard');
            toast.error('Referral system is currently not available');
          }
        }
      } catch (error) {
        console.error("Error checking referral access:", error);
      }
    };
    checkReferralAccess();
  }, [navigate]);
  
  // Data states
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const [referrals, setReferrals] = useState([]);
  const [referralTree, setReferralTree] = useState(null);
  const [earnings, setEarnings] = useState({
    total: 0,
    paid: 0,
    pending: 0
  });
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [codeRes, referralsRes, treeRes, earningsRes] = await Promise.all([
        getMyReferralCodeApi(),
        getMyReferralsApi(),
        getMyReferralTreeApi(),
        getMyEarningsApi()
      ]);
      
      if (codeRes.success) {
        setReferralCode(codeRes.referralCode);
        setReferralLink(codeRes.referralLink);
      }
      
      if (referralsRes.success) {
        setStats(referralsRes.stats);
        setReferrals(referralsRes.referrals);
      }
      
      if (treeRes.success) {
        // Build tree with current user as root
        const userRoot = {
          name: `${authUser()?.user?.firstName} ${authUser()?.user?.lastName}`,
          status: 'You',
          joinedDate: new Date(),
          children: treeRes.referralTree
        };
        setReferralTree(userRoot);
      }
      
      if (earningsRes.success) {
        setEarnings(earningsRes.earnings);
        setCommissions(earningsRes.commissions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load affiliate data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on this amazing crypto platform!',
          text: `Use my referral code: ${referralCode} and get $100 bonus!`,
          url: referralLink
        });
      } catch (error) {}
    } else {
      copyToClipboard(referralLink, 'Referral link');
    }
  };

  return (
    <div
      id="main-wrapper"
      className={`show wallet-open ${headWallet ? "" : "active"} ${
        sidebariconHover ? "iconhover-toggle" : ""
      } ${sideMenu ? "menu-toggle" : ""}`}
    >
      <Nav />
      <RightWalletBar />
      <div className="content-body new-bg-light">
        <div
          className="container-fluid"
          style={{ minHeight: window.screen.height - 45 }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ minHeight: '100vh',  py: 2 }}>
              <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            My Affiliate Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#8b92a7' }}>
            Track your referrals, earnings, and grow your network
          </Typography>
        </Box>

        {/* Referral Code Card */}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            p: 3,
            mb: 4
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                Your Referral Code
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Paper
                  elevation={0}
                  sx={{
                    px: 3,
                    py: 1.5,
                    bgcolor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, letterSpacing: 2 }}>
                    {referralCode}
                  </Typography>
                </Paper>
                
                <Tooltip title="Copy Code">
                  <IconButton
                    onClick={() => copyToClipboard(referralCode, 'Referral code')}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white !important',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)', color: 'white !important' }
                    }}
                  >
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Share">
                  <IconButton
                    onClick={shareReferral}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white !important',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)', color: 'white !important' }
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Button
                component={Link}
                to="/user/referral-promo"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#f0f0f0' }
                }}
              >
                View Promo Page
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                bgcolor: '#242833',
                border: '1px solid #2d3142',
                borderRadius: 3,
                height: '100%',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: '#667eea20',
                      borderRadius: 2,
                      p: 1.5
                    }}
                  >
                    <PeopleIcon sx={{ color: '#667eea', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      Total Referrals
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                bgcolor: '#242833',
                border: '1px solid #2d3142',
                borderRadius: 3,
                height: '100%',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: '#10b98120',
                      borderRadius: 2,
                      p: 1.5
                    }}
                  >
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      {stats.active}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      Active
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                bgcolor: '#242833',
                border: '1px solid #2d3142',
                borderRadius: 3,
                height: '100%',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: '#f59e0b20',
                      borderRadius: 2,
                      p: 1.5
                    }}
                  >
                    <HourglassIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      {stats.inactive}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      Pending
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                bgcolor: '#242833',
                border: '1px solid #2d3142',
                borderRadius: 3,
                height: '100%',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: '#10b98120',
                      borderRadius: 2,
                      p: 1.5
                    }}
                  >
                    <MoneyIcon sx={{ color: '#10b981', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      ${earnings.total}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      Total Earned
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#242833',
            border: '1px solid #2d3142',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{
              borderBottom: '1px solid #2d3142',
              px: 2,
              '& .MuiTab-root': {
                color: '#8b92a7',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem'
              },
              '& .Mui-selected': {
                color: '#667eea !important'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#667eea'
              }
            }}
          >
            <Tab label="Referrals List" icon={<PeopleIcon />} iconPosition="start" />
            <Tab label="Referral Tree" icon={<TreeIcon />} iconPosition="start" />
            <Tab label="Earnings" icon={<MoneyIcon />} iconPosition="start" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Tab 0: Referrals List */}
            {activeTab === 0 && (
              <>
                {referrals.length === 0 ? (
                  <Alert severity="info" sx={{ bgcolor: '#667eea20', color: 'white', border: '1px solid #667eea' }}>
                    You haven't referred anyone yet. Share your referral code to get started!
                  </Alert>
                ) : (
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
                            Status
                          </TableCell>
                          <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                            Joined Date
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {referrals.map((ref, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d3142' }}>
                              {ref.name}
                            </TableCell>
                            <TableCell sx={{ color: '#8b92a7', borderBottom: '1px solid #2d3142' }}>
                              {ref.email}
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #2d3142' }}>
                              <Chip
                                label={ref.status}
                                size="small"
                                sx={{
                                  bgcolor: ref.status === 'active' ? '#10b98120' : '#f59e0b20',
                                  color: ref.status === 'active' ? '#10b981' : '#f59e0b',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: '#8b92a7', borderBottom: '1px solid #2d3142' }}>
                              {new Date(ref.joinedDate).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}

            {/* Tab 1: Referral Tree */}
            {activeTab === 1 && (
              <Box>
                {referralTree && referralTree.children && referralTree.children.length > 0 ? (
                  <>
                    {/* Tree Header */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                        🌳 Your Referral Network
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#8b92a7', maxWidth: 600, mx: 'auto' }}>
                        Visualize your multi-level referral hierarchy and watch your network grow
                      </Typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 3,
                        minHeight: '400px',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%)',
                        position: 'relative'
                      }}
                    >
                      <ReferralTree node={referralTree} />
                    </Paper>
                    
                    {/* Tree Legend */}
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, mb: 2, textAlign: 'center' }}>
                        Legend
                      </Typography>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6} md={2.4}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'rgba(102, 126, 234, 0.1)',
                              border: '1px solid rgba(102, 126, 234, 0.3)',
                              borderRadius: 2,
                              textAlign: 'center'
                            }}
                          >
                            <Box sx={{ width: 24, height: 24, bgcolor: '#667eea', borderRadius: '50%', mx: 'auto', mb: 1, border: '2px solid white' }} />
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, display: 'block' }}>You</Typography>
                            <Typography variant="caption" sx={{ color: '#8b92a7', fontSize: '0.65rem' }}>Root Node</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: 2,
                              textAlign: 'center'
                            }}
                          >
                            <Box sx={{ width: 24, height: 24, bgcolor: '#10b981', borderRadius: '50%', mx: 'auto', mb: 1, border: '2px solid white' }} />
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, display: 'block' }}>Level 1</Typography>
                            <Typography variant="caption" sx={{ color: '#8b92a7', fontSize: '0.65rem' }}>Direct Referrals</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'rgba(245, 158, 11, 0.1)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              borderRadius: 2,
                              textAlign: 'center'
                            }}
                          >
                            <Box sx={{ width: 24, height: 24, bgcolor: '#f59e0b', borderRadius: '50%', mx: 'auto', mb: 1, border: '2px solid white' }} />
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, display: 'block' }}>Level 2</Typography>
                            <Typography variant="caption" sx={{ color: '#8b92a7', fontSize: '0.65rem' }}>Sub-Referrals</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: 2,
                              textAlign: 'center'
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 24, color: '#10b981', mb: 1 }} />
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, display: 'block' }}>Active</Typography>
                            <Typography variant="caption" sx={{ color: '#8b92a7', fontSize: '0.65rem' }}>Verified Users</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'rgba(245, 158, 11, 0.1)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              borderRadius: 2,
                              textAlign: 'center'
                            }}
                          >
                            <HourglassIcon sx={{ fontSize: 24, color: '#f59e0b', mb: 1 }} />
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, display: 'block' }}>Pending</Typography>
                            <Typography variant="caption" sx={{ color: '#8b92a7', fontSize: '0.65rem' }}>Awaiting Approval</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <TreeIcon sx={{ fontSize: 80, color: '#667eea40', mb: 3 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      Build Your Network
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#8b92a7', mb: 4, maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
                      Your referral tree is empty. Start referring friends to build your multi-level network and watch your earnings grow exponentially!
                    </Typography>
                    <Button
                      component={Link}
                      to="/user/referral-promo"
                      variant="contained"
                      size="large"
                      startIcon={<ShareIcon />}
                      sx={{
                        bgcolor: '#667eea',
                        color: 'white',
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                        '&:hover': { 
                          bgcolor: '#5a67d8',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Share Your Code
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* Tab 2: Earnings */}
            {activeTab === 2 && (
              <>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={0}
                      sx={{
                        bgcolor: '#1a1d29',
                        border: '1px solid #2d3142',
                        borderRadius: 2
                      }}
                    >
                      <CardContent>
                        <Typography variant="body2" sx={{ color: '#8b92a7', mb: 1 }}>
                          Total Earned
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                          ${earnings.total}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={0}
                      sx={{
                        bgcolor: '#1a1d29',
                        border: '1px solid #2d3142',
                        borderRadius: 2
                      }}
                    >
                      <CardContent>
                        <Typography variant="body2" sx={{ color: '#8b92a7', mb: 1 }}>
                          Paid
                        </Typography>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                          ${earnings.paid}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={0}
                      sx={{
                        bgcolor: '#1a1d29',
                        border: '1px solid #2d3142',
                        borderRadius: 2
                      }}
                    >
                      <CardContent>
                        <Typography variant="body2" sx={{ color: '#8b92a7', mb: 1 }}>
                          Pending
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                          ${earnings.pending}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {commissions.length === 0 ? (
                  <Alert severity="info" sx={{ bgcolor: '#667eea20', color: 'white', border: '1px solid #667eea' }}>
                    No commission earnings yet. Refer friends to start earning!
                  </Alert>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                            From
                          </TableCell>
                          <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                            Amount
                          </TableCell>
                          <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                            Status
                          </TableCell>
                          <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                            Date
                          </TableCell>
                          <TableCell sx={{ color: '#8b92a7', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                            Notes
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {commissions.map((commission, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d3142' }}>
                              {commission.from}
                            </TableCell>
                            <TableCell sx={{ color: '#10b981', fontWeight: 600, borderBottom: '1px solid #2d3142' }}>
                              ${commission.amount}
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #2d3142' }}>
                              <Chip
                                label={commission.status}
                                size="small"
                                sx={{
                                  bgcolor: commission.status === 'paid' ? '#10b98120' : '#f59e0b20',
                                  color: commission.status === 'paid' ? '#10b981' : '#f59e0b',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: '#8b92a7', borderBottom: '1px solid #2d3142' }}>
                              {new Date(commission.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell sx={{ color: '#8b92a7', borderBottom: '1px solid #2d3142', fontSize: '0.875rem' }}>
                              {commission.notes || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </Box>
        </Paper>
              </Container>
            </Box>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AffiliateDashboard;

