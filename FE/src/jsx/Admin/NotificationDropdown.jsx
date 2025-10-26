import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Badge,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  CircularProgress,
  Stack,
  Grow
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  CreditCard as CreditCardIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotificationDropdown = ({
  dropdownOpen,
  notificationsData,
  isLoading,
  hasUnread,
  isDisable,
  hasMore,
  loadingMore,
  currentPage,
  totalPages,
  onDeleteAll,
  onMarkAsRead,
  onDeleteNotification,
  onLoadMore,
  onToggleModal,
  timeAgo
}) => {
  if (!dropdownOpen) return null;

  return (
    <Grow in={dropdownOpen} timeout={300}>
      <Paper
        elevation={24}
        sx={{
          position: 'absolute',
          top: 50,
          right: 0,
          width: 420,
          maxHeight: 600,
          bgcolor: '#1e1e1e',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 4,
          overflow: 'hidden',
          zIndex: 1300,
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)',
            p: 2.5,
            borderBottom: '1px solid rgba(66, 165, 245, 0.2)'
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <NotificationsIcon sx={{ color: '#64b5f6', fontSize: 24 }} />
              <Typography variant="h6" fontWeight="700" sx={{ color: 'white' }}>
                Notifications
              </Typography>
              {notificationsData.length > 0 && (
                <Chip
                  label={notificationsData.length}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(66, 165, 245, 0.2)',
                    color: '#64b5f6',
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Stack>
            {notificationsData.length > 0 && (
              <Tooltip title="Delete All Notifications" arrow>
                <IconButton
                  onClick={onDeleteAll}
                  disabled={isDisable}
                  size="small"
                  sx={{
                    color: '#ff4757 !important',
                    bgcolor: 'rgba(255, 71, 87, 0.1)',
                    // border: '1px solid rgba(255, 71, 87, 0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 71, 87, 0.2)',
                      transform: 'scale(1.1)'
                    },
                    '&:disabled': {
                      opacity: 0.5
                    }
                  }}
                >
                  <DeleteSweepIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>

        {/* Content */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 6 }}>
            <Stack spacing={2} alignItems="center">
              <CircularProgress 
                sx={{ 
                  color: '#64b5f6',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round'
                  }
                }} 
              />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Loading notifications...
              </Typography>
            </Stack>
          </Box>
        ) : notificationsData.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 6 }}>
            <NotificationsIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 1 }}>
              No notifications yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>
              You're all caught up!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
            {notificationsData.map((notification, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: !notification.isRead ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                  borderLeft: !notification.isRead ? '3px solid #42a5f5' : 'none',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                    transform: 'translateX(2px)'
                  },
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}
                onClick={() => notification.type === "card_request" && onToggleModal(notification)}
              >
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: notification.type === "card_request" ? 'rgba(245, 124, 0, 0.2)' : 'rgba(25, 118, 210, 0.2)', 
                    border: `1px solid ${notification.type === "card_request" ? 'rgba(245, 124, 0, 0.3)' : 'rgba(25, 118, 210, 0.3)'}` 
                  }}>
                    {notification.type === "card_request" ? 
                      <CreditCardIcon sx={{ color: '#ffb74d' }} /> :
                      <SupportIcon sx={{ color: '#64b5f6' }} />
                    }
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontWeight: 500,
                      mb: 0.5
                    }}>
                      {notification.content}
                    </Typography>
                  }
                  secondary={
                    <Stack spacing={0.5}>
                      <Box 
                        component={notification.type === "ticket_message" ? Link : "div"}
                        to={notification.type === "ticket_message" ? `/admin/ticket/user/${notification.userId}/${notification.ticketId}` : undefined}
                        sx={{ 
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <EmailIcon sx={{ fontSize: 14, color: '#64b5f6' }} />
                        <Typography variant="caption" sx={{ color: '#64b5f6' }}>
                          {notification.userEmail || 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Stack direction="row" spacing={1} alignItems="center">
                        {notification.status && (
                          <Chip
                            label={notification.status}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              bgcolor: notification.status === "applied" ? 
                                'rgba(245, 124, 0, 0.2)' : 
                                notification.status === "active" ? 
                                'rgba(25, 118, 210, 0.2)' : 
                                'rgba(255, 71, 87, 0.2)',
                              color: notification.status === "applied" ? 
                                '#ffb74d' : 
                                notification.status === "active" ? 
                                '#64b5f6' : 
                                '#ff4757',
                              border: `1px solid ${notification.status === "applied" ? 
                                'rgba(245, 124, 0, 0.3)' : 
                                notification.status === "active" ? 
                                'rgba(25, 118, 210, 0.3)' : 
                                'rgba(255, 71, 87, 0.3)'}`
                            }}
                          />
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScheduleIcon sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }} />
                          <Typography variant="caption" sx={{ 
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontStyle: 'italic'
                          }}>
                            {timeAgo(notification.createdAt)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  }
                />
                
                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title={notification.isRead ? "Mark as Unread" : "Mark as Read"} arrow>
                      <IconButton
                        size="small"
                        disabled={isDisable}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notification._id, !notification.isRead);
                        }}
                        sx={{
                          color: notification.isRead ? '#64b5f6' : '#42a5f5',
                          bgcolor: 'rgba(66, 165, 245, 0.1)',
                          border: '1px solid rgba(66, 165, 245, 0.3)',
                          '&:hover': {
                            bgcolor: 'rgba(66, 165, 245, 0.2)',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        {notification.isRead ? 
                          <MarkEmailUnreadIcon fontSize="small" /> : 
                          <MarkEmailReadIcon fontSize="small" />
                        }
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete Notification" arrow>
                      <IconButton
                        size="small"
                        disabled={isDisable}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNotification(notification._id);
                        }}
                        sx={{
                          color: '#ff4757',
                          bgcolor: 'rgba(255, 71, 87, 0.1)',
                          border: '1px solid rgba(255, 71, 87, 0.3)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 71, 87, 0.2)',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
        
        {/* Load More Button */}
        {hasMore && !isLoading && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={onLoadMore}
              disabled={loadingMore}
              startIcon={loadingMore ? 
                <CircularProgress size={16} sx={{ color: 'white' }} /> : 
                <ExpandMoreIcon />
              }
              sx={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1e88e5)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #555 0%, #666 100%)',
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              {loadingMore ? 
                'Loading...' : 
                `Load More (${currentPage}/${totalPages})`
              }
            </Button>
          </Box>
        )}
      </Paper>
    </Grow>
  );
};

export default NotificationDropdown;
 










