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
  Button, 
  Grid, 
  Card,
  CardContent,
  Stack,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Autorenew as AutorenewIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { 
  getMyReferralCodeApi, 
  getMyReferralsApi, 
  getMyEarningsApi,
  getLinksApi 
} from '../../../Api/Service';

const ReferralPromo = () => {
  const { sidebariconHover, headWallet } = useContext(ThemeContext);
  const sideMenu = useSelector((state) => state.sideMenu);
  const authUser = useAuthUser();
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const [earnings, setEarnings] = useState(0);

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

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      
      // Get referral code
      const codeResponse = await getMyReferralCodeApi();
      
      if (codeResponse.success) {
        setReferralCode(codeResponse.referralCode);
        setReferralLink(codeResponse.referralLink);
      }
      
      // Get referrals stats
      const referralsResponse = await getMyReferralsApi();
      
      if (referralsResponse.success) {
        setStats(referralsResponse.stats);
      }
      
      // Get earnings
      const earningsResponse = await getMyEarningsApi();
      
      if (earningsResponse.success) {
        setEarnings(earningsResponse.earnings.total || 0);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast.error('Failed to load referral data');
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
            <Box sx={{ minHeight: '100vh', py: 2 }}>
              <Container maxWidth="lg">
        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(30%, -30%)'
            }
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                  lineHeight: 1.2
                }}
              >
                Turn your friends into crypto buddies!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: 3,
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Share your unique code and get <strong>$100</strong> for every friend who signs up and starts trading.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  mb: 4,
                  fontSize: '1.1rem'
                }}
              >
                The more you refer, the more you earn — it's that simple!
              </Typography>
              
              {/* Referral Code Display */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'nowrap',
                  mb: 3
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    px: 3,
                    py: 2,
                    bgcolor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 0.5 }}>
                    YOUR REFERRAL CODE
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, letterSpacing: 2 }}>
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
              
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/user/affiliate')}
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: '#f0f0f0',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                View My Dashboard
              </Button>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Ccircle cx='150' cy='150' r='140' fill='%23fff' opacity='0.1'/%3E%3Ccircle cx='150' cy='150' r='100' fill='%23fff' opacity='0.15'/%3E%3Ccircle cx='150' cy='150' r='60' fill='%23fff' opacity='0.2'/%3E%3C/svg%3E"
                  alt="Referral"
                  sx={{
                    width: '100%',
                    maxWidth: '300px',
                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card
              elevation={0}
              sx={{
                bgcolor: '#242833',
                border: '1px solid #2d3142',
                borderRadius: 3,
                height: '100%',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                }
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: '#667eea20',
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center'
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={`${stats.active} Active`}
                    size="small"
                    sx={{ bgcolor: '#10b98120', color: '#10b981', fontWeight: 600 }}
                  />
                  <Chip
                    label={`${stats.inactive} Pending`}
                    size="small"
                    sx={{ bgcolor: '#f59e0b20', color: '#f59e0b', fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              elevation={0}
              sx={{
                bgcolor: '#242833',
                border: '1px solid #2d3142',
                borderRadius: 3,
                height: '100%',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                }
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: '#10b98120',
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <MoneyIcon sx={{ color: '#10b981', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      ${earnings.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      Total Earned
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              elevation={0}
              sx={{
                bgcolor: '#242833',
                border: '1px solid #2d3142',
                borderRadius: 3,
                height: '100%',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                }
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: '#f59e0b20',
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <TrendingUpIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      $100
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                      Per Referral
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* How It Works Section */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#242833',
            border: '1px solid #2d3142',
            borderRadius: 3,
            p: 4,
            mb: 4
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
              textAlign: 'center'
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#8b92a7',
              mb: 4,
              textAlign: 'center'
            }}
          >
            Let's make crypto social — invite, earn, repeat!
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                icon: <ShareIcon sx={{ fontSize: 40 }} />,
                title: 'Share Your Code',
                description: 'Send your unique referral code to friends via social media, email, or messaging apps.'
              },
              {
                icon: <AutorenewIcon sx={{ fontSize: 40 }} />,
                title: 'They Sign Up',
                description: 'Your friends register using your code and start their crypto trading journey.'
              },
              {
                icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
                title: 'Get Activated',
                description: 'Once approved by admin after their first trade, both you and your friend get bonuses!'
              }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: '#1a1d29',
                    border: '1px solid #2d3142',
                    borderRadius: 3,
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#667eea',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: '#667eea20',
                      color: '#667eea',
                      borderRadius: '50%',
                      width: 80,
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#8b92a7' }}>
                    {step.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* CTA Section */}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: 3,
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Ready to Start Earning?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, maxWidth: 600, mx: 'auto' }}>
            Copy your referral link and start sharing with friends today. The more friends you refer, the more you earn!
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => copyToClipboard(referralLink, 'Referral link')}
              startIcon={<CopyIcon />}
              sx={{
                bgcolor: 'white',
                color: '#10b981',
                px: 4,
                fontWeight: 700,
                '&:hover': { bgcolor: '#f0f0f0' }
              }}
            >
              Copy Referral Link
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/user/affiliate"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                fontWeight: 700,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              View Dashboard
            </Button>
          </Stack>
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

export default ReferralPromo;

