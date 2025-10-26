import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
  Badge,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Dashboard,
  People,
  Logout,
  Menu,
  EmailOutlined,
} from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useAuthUser, useSignOut } from "react-auth-kit";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutApi, getEmailQueueStatusApi } from '../../../Api/Service';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const Sidebar = ({ isCollapsed, setIsSidebarCollapsed, isMobileMenu, setisMobileMenu }) => {
  const user = useAuthUser();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerVariant, setDrawerVariant] = useState(isMobile ? "temporary" : "permanent");
  const [emailQueueCount, setEmailQueueCount] = useState(0);
  const [internalMobileMenu, setInternalMobileMenu] = useState(false);
  
  // Use internal state if setisMobileMenu not provided
  const mobileMenuState = isMobileMenu ?? internalMobileMenu;
  const setMobileMenuState = setisMobileMenu ?? setInternalMobileMenu;

  // ✅ Socket.io for real-time email queue updates
  useEffect(() => {
    if (user()?.user?.role !== 'superadmin') return;

    // Connect to Socket.io - Use same backend as API calls 
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    // Parse URL properly to avoid malformed URLs
    let backendUrl;
    try {
      const url = new URL(apiUrl);
      backendUrl = `${url.protocol}//${url.host}`; // Get protocol + host only
    } catch (e) {
      console.error('Invalid REACT_APP_API_URL:', apiUrl);
      backendUrl = 'http://localhost:5000'; // Fallback
    }const socket = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'] // Better compatibility
    });

    socket.on('connect', () => {});

    socket.on('connect_error', (error) => {
      console.error('❌ Socket.io connection error:', error.message);
    });

    // Listen for email queue updates
    socket.on('emailQueueUpdate', (data) => {const totalCount = (data.pending || 0) + (data.failed || 0);
      setEmailQueueCount(totalCount);
    });

    // Fetch initial status
    getEmailQueueStatusApi().then(response => {
      if (response.success) {
        const totalCount = (response.data.pending || 0) + (response.data.failed || 0);
        setEmailQueueCount(totalCount);}
    }).catch(err => {
      console.error('Error fetching email queue status:', err);
    });

    return () => {socket.disconnect();
    };
  }, [user]);

  const menuItems = [
    { icon: <Dashboard />, label: 'Dashboard', link: "/admin/dashboard" },
    { icon: <People />, label: 'Leads', link: "/admin/dashboard/crm" },
  ];

  // Add Recycle Bin and Email Queue for superadmin
  if (user()?.user?.role === 'superadmin') {
    menuItems.push({ icon: <DeleteForeverIcon />, label: 'Recycle Bin', link: "/admin/dashboard/crm/recycle-bin" });
    menuItems.push({ icon: <EmailOutlined />, label: 'Email Queue', link: "/admin/crm/email-queue", badge: true });
  }

  const handleLogout = async () => {
    try {
      const logout = await logoutApi();
      if (logout.success) {
        signOut();
        navigate("/auth/login/crm");
      } else {
        toast.error(logout.msg);
      }
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  const drawerWidth = isCollapsed ? 80 : 280;

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setDrawerVariant("permanent");
        if (setMobileMenuState) {
          setMobileMenuState(false);
        }
      } else {
        setDrawerVariant("temporary");
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener('resize', handleResize);
  }, [setMobileMenuState]);

  const isActiveLink = (link) => {
    return location.pathname === link;
  };

  return (
    <Drawer
      variant={drawerVariant}
      open={isMobile ? mobileMenuState : true}
      onClose={() => setMobileMenuState && setMobileMenuState(false)}
      sx={{
        width: { xs: 280, md: drawerWidth },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: 280, md: drawerWidth },
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          transition: 'width 0.3s ease, transform 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Header / Logo */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!isCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>B</Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Fortivault
              </Typography>
            </Box>
          )}
          {isCollapsed && (
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mx: 'auto' }}>B</Avatar>
          )}
          <Box>
            {/* Desktop collapse toggle */}
            <IconButton
              onClick={() => setIsSidebarCollapsed(!isCollapsed)}
              size="small"
              sx={{ color: 'text.secondary', display: { xs: 'none', md: 'inline-flex' } }}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
            {/* Mobile menu toggle */}
            <IconButton
              onClick={() => setMobileMenuState && setMobileMenuState(false)}
              size="small"
              sx={{ color: 'text.secondary', display: { xs: 'inline-flex', md: 'none' } }}
            >
              <Menu />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <Box sx={{ flex: 1, p: 1, overflow: 'auto' }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.link}
                onClick={() => isMobile && setMobileMenuState && setMobileMenuState(false)}
                sx={{
                  borderRadius: 2,
                  color: isActiveLink(item.link) ? 'primary.main' : 'text.secondary',
                  backgroundColor: isActiveLink(item.link) ? 'action.selected' : 'transparent',
                  '&:hover': { 
                    backgroundColor: isActiveLink(item.link) ? 'action.selected' : 'action.hover' 
                  },
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 'auto',
                    color: 'inherit',
                    mr: isCollapsed ? 0 : 2,
                  }}
                >
                  {item.badge && emailQueueCount > 0 ? (
                    <Badge 
                      badgeContent={emailQueueCount} 
                      color="warning" 
                      max={99}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActiveLink(item.link) ? 600 : 500,
                    }}
                  />
                )}
                {!isCollapsed && item.badge && emailQueueCount > 0 && (
                  <Badge 
                    badgeContent={emailQueueCount} 
                    color="warning" 
                    max={99}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      {/* Bottom Section - Logout */}
      <Box sx={{ p: 1 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: 2,
                py: 1.5,
                color: 'text.secondary',
                '&:hover': { 
                  backgroundColor: 'error.light',
                  color: 'error.main'
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'auto',
                  color: 'inherit',
                  mr: isCollapsed ? 0 : 2,
                }}
              >
                <Logout />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* User Profile */}
      {!isCollapsed && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user()?.user?.firstName?.[0] || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
                {user()?.user?.firstName} {user()?.user?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {user()?.user?.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
