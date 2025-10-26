import React, { useEffect, useState } from "react";
import SideBar from "../layouts/AdminSidebar/Sidebar";
import useSWR from 'swr'
import Log from "../../assets/images/img/log.jpg";
import {
  adminTicketsApi,
  allUsersApi,
  bypassSingleUserApi,
  deleteEachUserApi,
  signleUsersApi,
  updateSignleUsersStatusApi,
  UpdateSubAdminPermissionsApi,
} from "../../Api/Service";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import AdminHeader from "./adminHeader";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Stack,
  Button,
  FormControlLabel,
  Switch,
  Tooltip,
  Box,
  Chip,
  LinearProgress,
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleIcon from "@mui/icons-material/People";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

const AdminSubAdmin = () => {
  const [Users, setUsers] = useState([]);
  const [unVerified, setunVerified] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalData, setmodalData] = useState({});
  const [isDisable, setisDisable] = useState(false);
  const [isUsers, setisUsers] = useState(false);
  const [userCounts, setUserCounts] = useState([]);
  const [dedicatedCounts, setDedicatedCounts] = useState([]);
  const [sharedCounts, setSharedCounts] = useState([]);

  let authUser = useAuthUser();
  let Navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);

  const getAllUsers = async () => {
    try {
      // Fetch subadmins with role filter
      const subadminParams = { role: 'subadmin', limit: 1000 };
      const subadminsResponse = await allUsersApi(subadminParams);

      // Fetch all regular users to calculate counts
      const usersParams = { role: 'user', limit: 10000 };
      const usersResponse = await allUsersApi(usersParams);

      if (subadminsResponse.success && usersResponse.success) {
        let filtered;
        let unverified;

        if (authUser().user.role === "admin" || authUser().user.role === "superadmin") {
          filtered = subadminsResponse.allUsers.filter((user) => {
            return user.role.includes("subadmin") && user.verified === true;
          });
          unverified = subadminsResponse.allUsers.filter((user) => {
            return user.role.includes("subadmin") && user.verified === false;
          });

          // Calculate user counts for each subadmin using all users
          const dedicatedCounts = {};
          const sharedCounts = {};
          const totalCounts = {};

          // First count dedicated users
          usersResponse.allUsers.forEach(user => {
            if (user.assignedSubAdmin && !user.isShared) {
              dedicatedCounts[user.assignedSubAdmin] = (dedicatedCounts[user.assignedSubAdmin] || 0) + 1;
            }
          });

          // Count shared users (same count for all subadmins)
          const sharedUserCount = usersResponse.allUsers.filter(user => user.isShared).length;
          const subadminIds = [...filtered, ...unverified].map(subadmin => subadmin._id);

          subadminIds.forEach(subadminId => {
            sharedCounts[subadminId] = sharedUserCount;
            totalCounts[subadminId] = (dedicatedCounts[subadminId] || 0) + sharedUserCount;
          });

          setUserCounts(totalCounts);
          setDedicatedCounts(dedicatedCounts);
          setSharedCounts(sharedCounts);
        } else if (authUser().user.role === "subadmin") {
          Navigate('/admin/dashboard')
        }
        setUsers(filtered.reverse());
        setunVerified(unverified.reverse());
      } else {
        toast.dismiss();
        toast.error(subadminsResponse.msg || "Failed to fetch subadmins");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisLoading(false);
    }
  };

  const deleteEachUser = async (user) => {
    try {
      setisDisable(true);
      const allUsers = await deleteEachUserApi(user._id);

      if (allUsers.success) {
        toast.dismiss();
        toast.success(allUsers.msg);
        setOpen(false);
        getAllUsers();
      } else {
        toast.dismiss();
        toast.error(allUsers.msg);
        setOpen(false);
        getAllUsers();
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisDisable(false);
    }
  };

  const bypassSingleUser = async (e) => {
    try {
      setisUsers(true);
      const signleUser = await bypassSingleUserApi(e._id);

      if (signleUser.success) {
        toast.dismiss();
        getAllUsers();
        toast.success(signleUser.msg);
      } else {
        toast.dismiss();
        toast.error(signleUser.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisUsers(false);
    }
  };

  const onOpenModal = (user) => {
    setOpen(true);
    setmodalData(user);
  };

  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    }
    if (authUser().user.role === "subadmin") {
      Navigate("/dashboard");
      return;
    }
    getAllUsers();
  }, []);

  const [Active, setActive] = useState(false);
  let toggleBar = () => {
    setActive(!Active);
  };

  const [disabledIn, setdisabledIn] = useState(false);
  const updateUserIsShared = async (userId, isShared) => {
    try {
      setdisabledIn(true);
      const updatedUser = await updateSignleUsersStatusApi(userId, {
        isShared,
      });
      if (updatedUser.success) {
        toast.success("User status updated successfully");
        getAllUsers();
      } else {
        toast.error(updatedUser.msg);
      }
    } catch (error) {
      toast.error("Error updating user status");
    } finally {
      setdisabledIn(false);
    }
  };
  const [signedAdmin, setsignedAdmin] = useState(false);
  const getSignleUser = async () => {
    try {
      const signleUser = await signleUsersApi(authUser().user._id);

      if (signleUser.success) {
        if (signleUser.signleUser.adminPermissions?.isSubManagement === false && signleUser.signleUser.role === "admin") {
          Navigate("/admin/dashboard")
        }setsignedAdmin(signleUser.signleUser?.adminPermissions?.isEditSubManagementPermissions)
      } else {
        toast.dismiss();
        toast.error(signleUser.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
    }
  };

  useEffect(() => {
    getSignleUser()
  }, []);

  const [permLoad, setpermLoad] = useState(false);
  const handlePermissionChange = async (userId, key, value) => {
    setpermLoad(true)
    try {
      let body = {
        [key]: value
      };

      const signleUser = await UpdateSubAdminPermissionsApi(userId, body);

      if (signleUser.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, permissions: { ...u.permissions, [key]: value } }
              : u
          )
        );
        toast.success("Permission updated success!")
      } else {
        toast.dismiss();
        toast.error(signleUser.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setpermLoad(false)
    }
  };

  // Dark Theme Styles
  const darkCardStyles = {
    background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
    border: '1px solid #333',
    color: '#ffffff',
    '&:hover': {
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      transform: 'translateY(-2px)'
    }
  };

  const darkButtonStyles = {
    variant: 'contained',
    sx: {
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 600,
      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
      '&:hover': {
        background: 'linear-gradient(45deg, #1565c0, #1e88e5)'
      }
    }
  };

  const darkOutlinedButtonStyles = {
    variant: 'outlined',
    sx: {
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 500,
      borderColor: 'grey.600',
      color: 'grey.300',
      '&:hover': {
        borderColor: 'grey.400',
        backgroundColor: 'grey.800'
      }
    }
  };

  return (
    <div className="admin dark-theme dark-new-ui">
      <div className="bg-gray-900 min-h-screen">
        <SideBar state={Active} toggle={toggleBar} />
        <div className="bg-gray-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
          <div className="mx-auto w-full max-w-7xl">
            <AdminHeader toggle={toggleBar} pageName="Sub Admin Management" />

            {isLoading ? (
              <Box sx={{ width: '100%', p: 4, textAlign: 'center' }}>
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
                <Typography variant="h6" sx={{ mt: 2, color: 'grey.300' }}>
                  Loading Sub Admins...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 3 }}>
                {/* Search Bar */}

                {/* Verified Sub-Admins Section */}
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h4" style={{ marginBottom: "20px" }} sx={{ color: 'grey.100', mb: 3, fontWeight: 700 }}>
                    Verified Sub-Admins: {Users.length}
                  </Typography>

                  <Grid container spacing={3}>
                    {Users.map((user) => (
                      <Grid item xs={12} sm={6} md={4} key={user._id}>
                        <Card sx={{ ...darkCardStyles, position: 'relative', borderRadius: 3, overflow: 'visible' }}>
                          {/* User Count Badge */}
                          <Tooltip title={`${dedicatedCounts?.[user._id] || 0} dedicated + ${sharedCounts?.[user._id] || 0} shared users`}>
                            <Box sx={{
                              bgcolor: 'primary.dark',
                              color: 'white',
                              px: 2,
                              py: 1,
                              borderTopLeftRadius: 12,
                              borderTopRightRadius: 12,
                              fontSize: 12,
                              fontWeight: 'bold',
                              boxShadow: 2
                            }}>
                              <Typography variant="body2" fontWeight={600}>
                                {userCounts[user._id] || 0} Users managed
                              </Typography>
                              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                {dedicatedCounts?.[user._id] || 0} dedicated • {sharedCounts?.[user._id] || 0} shared
                              </Typography>
                            </Box>
                          </Tooltip>

                          <CardHeader
                            avatar={
                              <Avatar
                                src={Log}
                                sx={{
                                  bgcolor: 'primary.main',
                                  width: 60,
                                  height: 60,
                                  border: '3px solid',
                                  borderColor: 'primary.light'
                                }}
                              />
                            }
                            title={
                              <Typography variant="h6" fontWeight={600} sx={{ color: 'grey.100' }} noWrap>
                                {user.firstName} {user.lastName}
                              </Typography>
                            }
                            subheader={
                              <Box>
                                <Typography variant="body2" sx={{ color: 'grey.400' }} noWrap>
                                  {user.email}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'grey.500' }}>
                                  Registered: {new Date(user.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            }
                            sx={{ pb: 1 }}
                          />

                          <CardContent sx={{ pt: 1, pb: 2 }}>
                            <Stack spacing={3}>
                              {/* Action Buttons */}
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'grey.400', mb: 1 }}>
                                  Actions
                                </Typography>
                                <Grid container spacing={1}>
                                  {authUser().user.role === "admin" && signedAdmin || authUser().user.role === "superadmin" ?

                                    <Grid item xs={6}>
                                      <Button
                                        fullWidth
                                        component={Link}
                                        to={`/admin/user/${user._id}/general`}
                                        startIcon={<ManageAccountsIcon />}
                                        size="small"
                                        {...darkOutlinedButtonStyles}
                                      >
                                        Manage
                                      </Button>
                                    </Grid> : ""}
                                  <Grid item xs={6}>
                                    <Button
                                      fullWidth
                                      component={Link}
                                      to={`/admin/subadmin/users/${user._id}`}
                                      startIcon={<PeopleIcon />}
                                      size="small"
                                      {...darkButtonStyles}
                                    >
                                      Users
                                    </Button>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Button
                                      fullWidth
                                      component={Link}
                                      to={`/admin/createTicket/${user._id}/${user.email}`}
                                      startIcon={<ContactMailIcon />}
                                      size="small"
                                      sx={{
                                        ...darkButtonStyles.sx,
                                        background: 'linear-gradient(45deg, #ed6c02, #ff9800)',
                                        '&:hover': {
                                          background: 'linear-gradient(45deg, #e65100, #f57c00)'
                                        }
                                      }}
                                    >
                                      Contact
                                    </Button>
                                  </Grid>
                                  <Grid item xs={6}>
                                    {(authUser().user.role === "admin" && signedAdmin || authUser().user.role === "superadmin") && (
                                      <Button
                                        fullWidth
                                        style={{ paddingBlock: "6px" }}
                                        startIcon={<DeleteIcon />}
                                        size="small"
                                        onClick={() => onOpenModal(user)}
                                        sx={{
                                          ...darkOutlinedButtonStyles.sx,
                                          borderColor: 'error.dark',
                                          color: 'error.main',
                                          '&:hover': {
                                            borderColor: 'error.main',
                                            backgroundColor: 'error.dark'
                                          }
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    )}
                                  </Grid>
                                </Grid>
                              </Box>

                              {/* Permission Switches */}
                              {authUser().user.role === "admin" && signedAdmin || authUser().user.role === "superadmin" ?
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'grey.400', mb: 1 }}>
                                    Permissions to manage users:
                                  </Typography>
                                  <Grid container spacing={1}>
                                    {[
                                      { key: 'editUserProfile', label: 'Edit Profiles' },
                                      { key: 'editUserWallet', label: 'Edit Wallets' },
                                      { key: 'editWalletAddress', label: 'Wallet Addresses' },
                                      { key: 'addTransaction', label: 'Manage Transactions' },
                                      { key: 'accessCrm', label: 'Access CRM' }
                                    ].map((permission) => (
                                      <Grid item xs={12} sm={6} key={permission.key}>
                                        <FormControlLabel
                                          control={
                                            <Switch
                                              disabled={permLoad}
                                              size="small"
                                              checked={user.permissions?.[permission.key] || false}
                                              onChange={(e) =>
                                                handlePermissionChange(user._id, permission.key, e.target.checked)
                                              }
                                              sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                  color: 'primary.main',
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                  backgroundColor: 'primary.main',
                                                },
                                              }}
                                            />
                                          }
                                          label={
                                            <Typography variant="body2" sx={{ color: 'grey.300' }}>
                                              {permission.label}
                                            </Typography>
                                          }
                                          sx={{ mr: 0 }}
                                        />
                                      </Grid>
                                    ))}
                                  </Grid>
                                </Box> : ""
                              }
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Unverified Sub-Admins Section */}
                {unVerified.length > 0 && (
                  <Box>
                    <Typography variant="h4" sx={{ color: 'grey.100', mb: 3, fontWeight: 700 }}>
                      Unverified Sub-Admins: {unVerified.length}
                    </Typography>

                    <Grid container spacing={3}>
                      {unVerified.map((user, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card sx={{ ...darkCardStyles, borderRadius: 2 }}>
                            <CardContent>
                              <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Avatar
                                  src={Log}
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: 'warning.dark'
                                  }}
                                />
                                <Typography variant="h6" sx={{ color: 'grey.100', mb: 1 }}>
                                  {user.firstName} {user.lastName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
                                  {user.email}
                                </Typography>
                                <Chip
                                  label="Unverified"
                                  color="warning"
                                  size="small"
                                  sx={{ mb: 2 }}
                                />
                                <Typography variant="caption" sx={{ color: 'grey.500', display: 'block' }}>
                                  Registered: {new Date(user.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>

                              <Stack spacing={2}>
                                <Button
                                  component={Link}
                                  to={`/admin/user/${user._id}/general`}
                                  variant="outlined"
                                  fullWidth
                                  sx={{
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    '&:hover': {
                                      backgroundColor: 'primary.dark'
                                    }
                                  }}
                                >
                                  Manage Sub Admin
                                </Button>

                                <Button
                                  disabled={isUsers}
                                  onClick={() => bypassSingleUser(user)}
                                  variant="contained"
                                  fullWidth
                                  startIcon={<CheckIcon />}
                                  sx={{
                                    backgroundColor: 'warning.dark',
                                    '&:hover': {
                                      backgroundColor: 'warning.main'
                                    }
                                  }}
                                >
                                  {isUsers ? 'Verifying...' : 'Verify Email'}
                                </Button>

                                <Button
                                  onClick={() => onOpenModal(user)}
                                  variant="outlined"
                                  fullWidth
                                  startIcon={<DeleteIcon />}
                                  sx={{
                                    borderColor: 'error.dark',
                                    color: 'error.main',
                                    '&:hover': {
                                      backgroundColor: 'error.dark'
                                    }
                                  }}
                                >
                                  Delete Sub Admin
                                </Button>
                              </Stack>

                              {/* Permissions for unverified users */}
                              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'grey.700' }}>
                                <Typography variant="subtitle2" sx={{ color: 'grey.400', mb: 2 }}>
                                  Permissions:
                                </Typography>
                                <Grid container spacing={1}>
                                  {[
                                    { key: 'editUserProfile', label: 'Edit Profiles' },
                                    { key: 'editUserWallet', label: 'Edit Wallets' },
                                    { key: 'editWalletAddress', label: 'Wallet Addresses' },
                                    { key: 'addTransaction', label: 'Manage Transactions' }
                                  ].map((permission) => (
                                    <Grid item xs={12} sm={6} key={permission.key}>
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            disabled={permLoad}
                                            size="small"
                                            checked={user.permissions?.[permission.key] || false}
                                            onChange={(e) =>
                                              handlePermissionChange(user._id, permission.key, e.target.checked)
                                            }
                                          />
                                        }
                                        label={
                                          <Typography variant="body2" sx={{ color: 'grey.300', fontSize: '0.8rem' }}>
                                            {permission.label}
                                          </Typography>
                                        }
                                      />
                                    </Grid>
                                  ))}
                                </Grid>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Dark Theme */}
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        styles={{
          modal: {
            backgroundColor: '#1e1e1e',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '0'
          }
        }}
      >
        <Box sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
          <DeleteIcon sx={{ fontSize: 64, mb: 2, color: 'error.main' }} />
          <Typography variant="h5" fontWeight="700" gutterBottom sx={{ color: 'grey.100' }}>
            Confirm Deletion
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'grey.400' }}>
            Are you sure you want to delete <strong style={{ color: 'grey.100' }}>{modalData.firstName} {modalData.lastName}</strong>? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={onCloseModal}
              sx={{
                borderRadius: 2,
                px: 4,
                color: 'grey.300',
                borderColor: 'grey.600',
                '&:hover': {
                  borderColor: 'grey.400'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteEachUser(modalData)}
              disabled={isDisable}
              sx={{ borderRadius: 2, px: 4 }}
            >
              {isDisable ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminSubAdmin;