import React, { useState, useEffect } from "react";
import { useSignIn, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { loginApi, registerApi, verifyReferralCodeApi } from "../../../Api/Service";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Grid,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import LogoNew from "../../../assets/newlogo/logo-blue.png";

// Dark theme configuration matching Login page
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7635dc',
    },
    secondary: {
      main: '#919EAB',
    },
    background: {
      default: '#25282c',
      paper: '#141A21',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#919EAB',
    },
    error: {
      main: '#ff5630',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(145, 158, 171, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(145, 158, 171, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7635dc',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7) !important',
            fontWeight: 500,
            fontSize: '0.875rem',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#7635dc !important',
            fontWeight: 600,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#141A21',
          borderRadius: 8,
        },
        input: {
          color: '#FFFFFF',
        },
      },
    },
  },
});

function Register(props) {
  const [isloading, setisloading] = useState(false);
  const [chkbx, setchkbx] = useState(false);
  const [verifyP, setverifyP] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  let errorsObj = { email: '', password: '' };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState('');
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const [type2, settype2] = useState("password");
  const [type1, settype1] = useState("password");
  const [searchParams] = useSearchParams(); // MLM: Get ref from URL

  const handleTogglePassword = () => {
    type1 === "password"
      ? settype1("text")
      : type1 === "text"
        ? settype1("password")
        : settype1("password");
  };
  const handleTogglePassword1 = () => {
    type2 === "password"
      ? settype2("text")
      : type2 === "text"
        ? settype2("password")
        : settype2("password");
  };
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    note: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    cpassword: "",
    referralCode: "", // MLM: Referral code from URL or manual input
  });
  
  const [referrerInfo, setReferrerInfo] = useState(null); // To show who referred them
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [isAutoVerify, setIsAutoVerify] = useState(false); // Track if verification is from URL auto-load
  const [referralCodeError, setReferralCodeError] = useState(''); // Error message for referral code
  let handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUserData({ ...userData, [name]: value });

    if (userData.password.length > 6) {
      setverifyP(true);
    } else if (userData.password.length < 8) {
      setverifyP(false);
    }
  };
  let toggleagree = (e) => {
    if (e.target.checked === true) {
      setchkbx(true);
    } else if (e.target.checked === false) {
      setchkbx(false);
    }
  };

  const onSignUp = async (e) => {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };

    if (!userData.firstName.trim()) {
      errorObj.firstName = 'Password is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.password,
      })
    }
    if (!userData.lastName.trim()) {
      errorObj.lastName = 'Last Name is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.phone.trim()) {
      errorObj.phone = 'Phone is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.phone.trim()) {
      errorObj.phone = 'Phone is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.country.trim()) {
      errorObj.country = 'Country is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.postalCode.trim()) {
      errorObj.postalCode = 'Postal Code is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.city.trim()) {
      errorObj.city = 'City is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.address.trim()) {
      errorObj.address = 'Address is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.email.trim()) {
      errorObj.email = 'Email is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (userData.password === '') {
      errorObj.password = 'Password is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.password,
      });
    } else if (userData.password.length < 8) {
      errorObj.password = 'Password must be at least 8 characters long';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.password,
      });
    }
    if (userData.password != userData.cpassword) {
      errorObj.cpassword = "Password and confirm password doesn't match";
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.cpassword,
      })
    }

    // Validate referral code if provided
    if (userData.referralCode && userData.referralCode.trim()) {
      if (referralCodeError || !referrerInfo) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Referral Code',
          text: 'Please remove the referral code or enter a valid one to continue registration.',
        });
        error = true;
      }
    }

    setErrors(errorObj);
    if (error) return;
    setisloading(true)
    try {

      let data = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        postalCode: userData.postalCode,
      };
      
      // MLM: Include referral code if provided and verified
      if (userData.referralCode && userData.referralCode.trim() && referrerInfo) {
        data.referralCode = userData.referralCode.trim().toUpperCase();
      }

      const updateHeader = await registerApi(data);

      if (updateHeader.success) {
        toast.dismiss();
        toast.info(updateHeader.msg);
        navigate("/auth/login");
      } else {
        toast.dismiss();
        toast.error(updateHeader.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error?.data?.msg || error?.message || "Something went wrong");
    } finally {
      setisloading(false);
    }
  }
  useEffect(() => {
    if (isAuthenticated() && authUser().user.role === "user") {
      navigate("/dashboard");
      return;
    } else if (isAuthenticated() && authUser().user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, []);
  
  // MLM: Extract referral code from URL on mount
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setUserData(prev => ({ ...prev, referralCode: refCode.toUpperCase() }));
      setIsAutoVerify(true);
      verifyReferralCode(refCode.toUpperCase(), true); // true = auto-verify from URL
    }
  }, [searchParams]);
  
  // MLM: Verify referral code
  const verifyReferralCode = async (code, isFromURL = false) => {
    if (!code || code.trim().length === 0) {
      setReferrerInfo(null);
      setReferralCodeError('');
      return;
    }
    
    // Check minimum length (referral codes are typically 8 characters)
    if (code.trim().length < 8) {
      setReferrerInfo(null);
      setReferralCodeError('Referral code must be at least 8 characters');
      return;
    }
    
    try {
      setVerifyingCode(true);
      setReferralCodeError('');
      const response = await verifyReferralCodeApi(code.toUpperCase());
      
      if (response.success && response.valid) {
        setReferrerInfo(response.referrer);
        setReferralCodeError('');
      } else {
        setReferrerInfo(null);
        setReferralCodeError('Invalid referral code. Please check and try again.');
      }
    } catch (error) {
      setReferrerInfo(null);
      setReferralCodeError('Invalid referral code. Please check and try again.');
      console.error('Referral code verification error:', error);
    } finally {
      setVerifyingCode(false);
      if (isFromURL) {
        setIsAutoVerify(false);
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#25282c',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 2,
              backgroundColor: '#141A21',
              boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
            }}
          >
            {/* Logo and Title */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Link to="/" style={{ display: 'inline-block' }}>
                <img
                  src={LogoNew}
                  alt="Logo"
                  style={{ width: '80px', marginBottom: '16px' }}
                />
              </Link>
              <Typography
                variant="h5"
                component="h1"
                fontWeight="700"
                color="#FFFFFF"
                gutterBottom
              >
                Sign up
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                <Typography variant="body2" color="#919EAB">
                  Already have an account?
                </Typography>
                <Link
                  to="/auth/login"
                  style={{
                    color: '#7635dc',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  Sign in
                </Link>
              </Box>
            </Box>

            {/* Error/Success Messages */}
            {props.errorMessage && (
              <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                {props.errorMessage}
              </Typography>
            )}
            {props.successMessage && (
              <Typography color="success.main" sx={{ mb: 2, textAlign: 'center' }}>
                {props.successMessage}
              </Typography>
            )}

            {/* Registration Form */}
            <form onSubmit={onSignUp}>
              <Grid container spacing={2}>
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInput}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    variant="outlined"
                  />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInput}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    variant="outlined"
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInput}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                  />
                </Grid>

                {/* Phone */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    type="number"
                    value={userData.phone}
                    onChange={handleInput}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    variant="outlined"
                    onFocus={() => (window.onwheel = () => false)}
                    onBlur={() => (window.onwheel = null)}
                    onKeyDown={(e) =>
                      ["ArrowUp", "ArrowDown", "e", "E", "+", "-", "*", ""].includes(e.key) &&
                      e.preventDefault()
                    }
                  />
                </Grid>

                {/* Password */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={type1}
                    value={userData.password}
                    onChange={handleInput}
                    error={!!errors.password}
                    helperText={errors.password}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePassword}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {type1 === "password" ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Confirm Password */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="cpassword"
                    type={type2}
                    value={userData.cpassword}
                    onChange={handleInput}
                    error={!!errors.cpassword}
                    helperText={errors.cpassword}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePassword1}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {type2 === "password" ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Country */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={userData.country}
                    onChange={handleInput}
                    error={!!errors.country}
                    helperText={errors.country}
                    variant="outlined"
                  />
                </Grid>

                {/* Postal Code */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    name="postalCode"
                    value={userData.postalCode}
                    onChange={handleInput}
                    error={!!errors.postalCode}
                    helperText={errors.postalCode}
                    variant="outlined"
                  />
                </Grid>

                {/* City */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={userData.city}
                    onChange={handleInput}
                    error={!!errors.city}
                    helperText={errors.city}
                    variant="outlined"
                  />
                </Grid>

                {/* Address */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={userData.address}
                    onChange={handleInput}
                    error={!!errors.address}
                    helperText={errors.address}
                    variant="outlined"
                  />
                </Grid>

                {/* Referral Code (Optional) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Referral Code (Optional)"
                    name="referralCode"
                    value={userData.referralCode}
                    onChange={(e) => {
                      const code = e.target.value.toUpperCase();
                      setUserData({ ...userData, referralCode: code });
                      
                      // Clear error and referrer info when user starts typing
                      if (code.length === 0) {
                        setReferrerInfo(null);
                        setReferralCodeError('');
                      } else if (code.length >= 8) {
                        // Verify code when user types 8+ characters
                        verifyReferralCode(code, false);
                      } else {
                        // Reset states for incomplete codes
                        setReferrerInfo(null);
                        setReferralCodeError('');
                      }
                    }}
                    variant="outlined"
                    placeholder="Enter referral code if you have one"
                    error={!!referralCodeError}
                    InputProps={{
                      endAdornment: verifyingCode ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ) : referrerInfo ? (
                        <InputAdornment position="end">
                          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                            ✓ Valid
                          </Typography>
                        </InputAdornment>
                      ) : null
                    }}
                    helperText={
                      referralCodeError
                        ? `${referralCodeError} Remove it or correct it to continue.`
                        : referrerInfo 
                          ? `✓ Referred by: ${referrerInfo.name}` 
                          : "Optional: Get $100 bonus when you use a friend's referral code!"
                    }
                    sx={{
                      '& .MuiFormHelperText-root': {
                        color: referralCodeError
                          ? 'error.main'
                          : referrerInfo 
                            ? 'success.main' 
                            : 'text.secondary'
                      }
                    }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isloading}
                    sx={{
                      mt: 1,
                      py: 1.5,
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      height: '48px',
                      backgroundColor: '#FFFFFF',
                      color: '#1C252E',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        boxShadow: 'none',
                      },
                      '&:disabled': {
                        backgroundColor: '#FFFFFF',
                        opacity: 0.5,
                      },
                    }}
                  >
                    {isloading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1, color: '#1C252E' }} />
                        Creating Account...
                      </>
                    ) : (
                      'Sign me up'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Register;
