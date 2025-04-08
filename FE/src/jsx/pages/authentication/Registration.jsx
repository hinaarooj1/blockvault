import React, { useState, useEffect } from "react";
import { useSignIn, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { loginApi, registerApi } from "../../../Api/Service";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import LogoNew from "../../../assets/newlogo/logo-blue.png";

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
  });
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
  return (
    <div className="fix-wrapper thisnnf">
      <div className="container ">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6">


            <div className="card mb-0 h-auto">
              <div className="card-body">
                <div className="text-center mb-2">
                  <Link to="/">
                    <img style={{ width: "80px" }} src={LogoNew} alt="" />
                  </Link>
                </div>
                <h4 className="text-center mb-4 ">Sign up  </h4>
                {props.errorMessage && (
                  <div className='text-danger'>
                    {props.errorMessage}
                  </div>
                )}
                {props.successMessage && (
                  <div className='text-danger'>
                    {props.successMessage}
                  </div>
                )}
                <form onSubmit={onSignUp} className="MuiStack-root css-1i43dhb">
                  <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r0:-label">
                      First Name
                    </label>
                    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u1jokr">
                      <input onChange={handleInput}
                        value={userData.firstName}
                        name="firstName"
                        type="text" className="MuiInputBase-input MuiOutlinedInput-input css-126sty9" id=":r0:" />
                      <fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
                        <legend className="css-14lo706">
                          <span>
                            First Name
                          </span>
                        </legend>
                      </fieldset>
                    </div>
                    {errors.firstName && <div className="text-danger mt-2">{errors.firstName}</div>}

                  </div>
                  <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r0:-label">
                      Last Name
                    </label>
                    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u1jokr">
                      <input onChange={handleInput}
                        value={userData.lastName}
                        name="lastName"
                        type="text" className="MuiInputBase-input MuiOutlinedInput-input css-126sty9" id=":r0:" />
                      <fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
                        <legend className="css-14lo706">
                          <span>
                            Last Name
                          </span>
                        </legend>
                      </fieldset>
                    </div>
                    {errors.lastName && <div className="text-danger mt-2">{errors.lastName}</div>}

                  </div>
                  <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r0:-label">
                      Email Address
                    </label>
                    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u1jokr">
                      <input type="email"
                        onChange={handleInput}
                        value={userData.email}
                        name="email" className="MuiInputBase-input MuiOutlinedInput-input css-126sty9" id=":r0:" />
                      <fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
                        <legend className="css-14lo706">
                          <span>
                            Email Address
                          </span>
                        </legend>
                      </fieldset>
                    </div>
                    {errors.email && <div className="text-danger mt-2">{errors.email}</div>}

                  </div>
                  <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r0:-label">
                      Phone Number
                    </label>
                    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u1jokr">
                      <input onChange={handleInput}
                        type="number"
                        onFocus={() => (window.onwheel = () => false)} // Disable scrolling on focus
                        onBlur={() => (window.onwheel = null)}
                        onKeyDown={(e) =>
                          [
                            "ArrowUp",
                            "ArrowDown",
                            "e",
                            "E",
                            "+",
                            "-",
                            "*",
                            "",
                          ].includes(e.key) && e.preventDefault()
                        }
                        value={userData.phone}
                        name="phone" className="MuiInputBase-input MuiOutlinedInput-input css-126sty9" id=":r0:" />
                      <fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
                        <legend className="css-14lo706">
                          <span>
                            Phone Number
                          </span>
                        </legend>
                      </fieldset>
                    </div>
                    {errors.phone && <div className="text-danger mt-2">{errors.phone}</div>}

                  </div>



                  <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r1:-label">
                      Password
                    </label>
                    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd css-ssv83">
                      <input type={type1}
                        onChange={handleInput}
                        value={userData.password}
                        name="password" className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-1puc122" id=":r1:" />
                      <div className="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-outlined MuiInputAdornment-sizeMedium css-w8wce8">
                        {type1 === "password" ? <button type="button" onClick={handleTogglePassword} className="MuiButtonBase-root MuiIconButton-root MuiIconButton-edgeEnd MuiIconButton-sizeMedium css-1fk2kk1">
                          <svg aria-hidden="true" className="iconify iconify--solar mnl__icon__root MuiBox-root css-cnvj7y" height="1em" role="img" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <path clipRule="evenodd" d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045l.094.194c.086.172.219.424.4.729a13.4 13.4 0 0 0 1.67 2.237a12 12 0 0 0 .59.592C7.18 11.8 9.251 13 12 13a8.7 8.7 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13 13 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394l-.003.005l-.004.008l-.011.026l-.04.087a14 14 0 0 1-.741 1.348a15.4 15.4 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.4 15.4 0 0 1-1.87-2.519a14 14 0 0 1-.591-1.107l-.033-.072l-.01-.021l-.002-.007l-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314" fill="currentColor" fillRule="evenodd">
                            </path>
                          </svg>
                          <span className="MuiTouchRipple-root css-w0pj6f">
                          </span>
                        </button> : <button onClick={handleTogglePassword} className="MuiButtonBase-root MuiIconButton-root MuiIconButton-edgeEnd MuiIconButton-sizeMedium css-1fk2kk1" tabIndex={0} type="button"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--solar mnl__icon__root MuiBox-root css-cnvj7y" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0" /><path fill="currentColor" fillRule="evenodd" d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5" clipRule="evenodd" /></svg><span className="MuiTouchRipple-root css-w0pj6f" /></button>
                        }
                      </div>
                      <fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
                        <legend className="css-14lo706">
                          <span>
                            Password
                          </span>
                        </legend>
                      </fieldset>
                    </div>
                    {errors.password && <div className="text-danger mt-2 fs-12 mt-2">{errors.password}</div>}
                  </div>


                  <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r1:-label">
                      Confirm	Password
                    </label>
                    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd css-ssv83">
                      <input type={type2}
                        onChange={handleInput}
                        value={userData.cpassword}
                        name="cpassword" className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-1puc122" id=":r1:" />
                      <div className="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-outlined MuiInputAdornment-sizeMedium css-w8wce8">
                        {type2 === "password" ? <button type="button" onClick={handleTogglePassword1} className="MuiButtonBase-root MuiIconButton-root MuiIconButton-edgeEnd MuiIconButton-sizeMedium css-1fk2kk1">
                          <svg aria-hidden="true" className="iconify iconify--solar mnl__icon__root MuiBox-root css-cnvj7y" height="1em" role="img" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <path clipRule="evenodd" d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045l.094.194c.086.172.219.424.4.729a13.4 13.4 0 0 0 1.67 2.237a12 12 0 0 0 .59.592C7.18 11.8 9.251 13 12 13a8.7 8.7 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13 13 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394l-.003.005l-.004.008l-.011.026l-.04.087a14 14 0 0 1-.741 1.348a15.4 15.4 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.4 15.4 0 0 1-1.87-2.519a14 14 0 0 1-.591-1.107l-.033-.072l-.01-.021l-.002-.007l-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314" fill="currentColor" fillRule="evenodd">
                            </path>
                          </svg>
                          <span className="MuiTouchRipple-root css-w0pj6f">
                          </span>
                        </button> :



                          <button onClick={handleTogglePassword1} className="MuiButtonBase-root MuiIconButton-root MuiIconButton-edgeEnd MuiIconButton-sizeMedium css-1fk2kk1" tabIndex={0} type="button"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--solar mnl__icon__root MuiBox-root css-cnvj7y" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0" /><path fill="currentColor" fillRule="evenodd" d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5" clipRule="evenodd" /></svg><span className="MuiTouchRipple-root css-w0pj6f" /></button>
                        }
                      </div>
                      <fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
                        <legend className="css-14lo706">
                          <span>
                            Confirm		Password
                          </span>
                        </legend>
                      </fieldset>
                    </div>
                    {errors.cpassword && <div className="text-danger fs-12 mt-2">{errors.cpassword}</div>}
                  </div>


                  <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r0:-label">
                      Country
                    </label>
                    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u1jokr">
                      <input


                        type="text"
                        onChange={handleInput}
                        value={userData.country}
                        name="country"

                        className="MuiInputBase-input MuiOutlinedInput-input css-126sty9" id=":r0:" />
                      <fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
                        <legend className="css-14lo706">
                          <span>
                            Country
                          </span>
                        </legend>
                      </fieldset>
                    </div>
                    {errors.country && <div className="text-danger mt-2">{errors.country}</div>}
                  </div>



                  <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r0:-label">
                      Postal Code
                    </label>
                    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u1jokr">
                      <input


                        type="text"
                        onChange={handleInput}
                        value={userData.postalCode}
                        name="postalCode"

                        className="MuiInputBase-input MuiOutlinedInput-input css-126sty9" id=":r0:" />
                      <fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
                        <legend className="css-14lo706">
                          <span>
                            Postal Code
                          </span>
                        </legend>
                      </fieldset>
                    </div>   {errors.postalCode && <div className="text-danger mt-2">{errors.postalCode}</div>}

                  </div>
                  <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r0:-label">
                      City
                    </label>
                    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u1jokr">
                      <input


                        type="text"
                        onChange={handleInput}
                        value={userData.city}
                        name="city"

                        className="MuiInputBase-input MuiOutlinedInput-input css-126sty9" id=":r0:" />
                      <fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
                        <legend className="css-14lo706">
                          <span>
                            City
                          </span>
                        </legend>
                      </fieldset>
                    </div>
                    {errors.city && <div className="text-danger mt-2">{errors.city}</div>}

                  </div>

                  <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r0:-label">
                      Address
                    </label>
                    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u1jokr">
                      <input
                        type="text"
                        onChange={handleInput}
                        value={userData.address}
                        name="address"

                        className="MuiInputBase-input MuiOutlinedInput-input css-126sty9" id=":r0:" />
                      <fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
                        <legend className="css-14lo706">
                          <span>
                            Address
                          </span>
                        </legend>
                      </fieldset>
                    </div>
                    {errors.address && <div className="text-danger mt-2">{errors.address}</div>}

                  </div>




                  <button type="submit" style={{ opacity: isloading ? 0.5 : 1, cursor: isloading ? "default" : "pointer" }} disabled={isloading} className="MuiButtonBase-root MuiButton-root MuiLoadingButton-root MuiButton-contained MuiButton-containedInherit MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButton-colorInherit MuiButton-disableElevation MuiButton-fullWidth MuiButton-root MuiLoadingButton-root MuiButton-contained MuiButton-containedInherit MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButton-colorInherit MuiButton-disableElevation MuiButton-fullWidth css-1i03yle" id=":r2:">

                    Sign me up
                    <span className="MuiTouchRipple-root css-w0pj6f">
                    </span>
                  </button>
                </form>
                <div className="new-account mt-3">
                  <p className="">
                    Already have an account?{" "}
                    <Link className="text-primary" to="/auth/login">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


export default Register;
