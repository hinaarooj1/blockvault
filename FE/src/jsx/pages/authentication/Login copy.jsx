import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { toast } from "react-toastify";
import LogoNew from "../../../assets/newlogo/logo.png";
import { loginApi } from "../../../Api/Service";
import { useSignIn, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { useAuth } from "../../../store/auth";


import { IMAGES } from '../../constant/theme';


function Login(props) {
	// 
	const [isloading, setisloading] = useState(false);
	const signIn = useSignIn();
	const isAuthenticated = useIsAuthenticated();
	const authUser = useAuthUser();
	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [type1, settype1] = useState("password");

	const handleTogglePassword = () => {
		type1 === "password"
			? settype1("text")
			: type1 === "text"
				? settype1("password")
				: settype1("password");
	};

	const { storeTokenInLs } = useAuth();
	const onLogin = async (e) => {
		e.preventDefault();
		let error = false;
		const errorObj = { ...errorsObj };
		if (email === '') {
			errorObj.email = 'Email is Required';
			error = true;
		}
		if (password === '') {
			errorObj.password = 'Password is Required';
			error = true;
		}
		setErrors(errorObj);
		if (error) {
			return;
		}
		setisloading(true);
		try {
			let data = { email, password };

			const updateHeader = await loginApi(data);
			let newData = updateHeader;
			if (updateHeader.success === true && updateHeader.link === false) {


				newData = {
					success: updateHeader.success,
					token: updateHeader.token,
					user: {
						_id: updateHeader.user._id,
						address: updateHeader.user.address,
						city: updateHeader.user.city,
						country: updateHeader.user.country,
						email: updateHeader.user.email,
						kyc: updateHeader.user.kyc,
						firstName: updateHeader.user.firstName,
						lastName: updateHeader.user.lastName,
						note: updateHeader.user.note,
						phone: updateHeader.user.phone,
						postalCode: updateHeader.user.postalCode,
						role: updateHeader.user.role,
						status: updateHeader.user.status,

						verified: updateHeader.user.verified,
					},
				};
			}
			if (
				updateHeader.success && updateHeader.link === false &&
				signIn({
					token: updateHeader.token.token,
					expiresIn: 4317,
					tokenType: "Bearer",
					authState: newData,
					sameSite: false,
				})
			) {
				storeTokenInLs(updateHeader.token);
				toast.dismiss();
				toast.success(updateHeader.msg);
				console.log('location.state?.from: ', location.state?.from);
				if (updateHeader.user.role === "user") {
					const redirectTo = location.state?.from || '/dashboard';
					navigate(redirectTo);


					return;
				} else if (
					updateHeader.user.role === "admin" ||
					updateHeader.user.role === "subadmin"
				) {
					const redirectTo = location.state?.from || '/admin/dashboard';
					navigate(redirectTo);
					// navigate("/admin/dashboard");
					return
				}
			} else if (updateHeader.success === true && updateHeader.link === true) {
				toast.dismiss();
				toast.info(updateHeader.msg);
				console.log(updateHeader);
				setPassword("");
				return
			} else {
				toast.dismiss();
				toast.error(updateHeader.msg);
				console.log(updateHeader);
			}
		} catch (error) {
			console.log('error: ', error);
			toast.dismiss();
			toast.error(error?.data?.msg || "Something went wrong");
		} finally {
			setisloading(false);
		}

	}

	useEffect(() => {

		if (isAuthenticated() && authUser().user.role === "user") {
			navigate("/dashboard");

			return;
		}
		if (isAuthenticated() && authUser().user.role === "admin") {
			navigate("/admin/dashboard");
		} else if (isAuthenticated() && authUser().user.role === "subadmin") {
			navigate("/admin/dashboard");
		}
	}, []);
	// 
	let errorsObj = { email: '', password: '' };
	const [errors, setErrors] = useState(errorsObj);



	return (

		<>
			<div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
				<div className="login-aside text-center  d-flex flex-column flex-row-auto">
					<div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
						<Link to='/' className="text-center mb-lg-4 mb-2 pt-5 logo">
							<img style={{ width: "80px" }} src={LogoNew} alt="" />
						</Link>

						<h3 className="mb-2 text-white">Welcome back!</h3>
						<p className="mb-4"> Login with social media or your credentials</p>
					</div>
					{/* <div className="aside-image position-relative" style={{ backgroundImage: `url(${IMAGES.BgPic2})` }}>
						<img className="img1 move-1" src={IMAGES.BgPic3} alt="" />
						<img className="img2 move-2" src={IMAGES.BgPic4} alt="" />
						<img className="img3 move-3" src={IMAGES.BgPic5} alt="" />
					</div> */}
				</div>
				<div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
					<div className="d-flex justify-content-center h-100 align-items-center">
						<div className="authincation-content style-2">
							<div className="row no-gutters">
								<div className="col-xl-12 tab-content">
									<div id="sign-up" className="auth-form tab-pane fade show active  form-validation">
										<form onSubmit={onLogin}>
											<div className="text-center mb-4">
												<h3 className="text-center mb-2 text-dark">Sign In</h3>
												<span>Your Social Campaigns</span>
											</div>
											<div className="row mb-4">
												<div className="col-xl-6 col-12">
													<button disabled={true} className="btn btn-outline-dark btn-sm btn-block">
														<svg className="me-1" width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M27.9851 14.2618C27.9851 13.1146 27.8899 12.2775 27.6837 11.4094H14.2788V16.5871H22.1472C21.9886 17.8738 21.132 19.8116 19.2283 21.1137L19.2016 21.287L23.44 24.4956L23.7336 24.5242C26.4304 22.0904 27.9851 18.5093 27.9851 14.2618Z" fill="#4285F4" />
															<path d="M14.279 27.904C18.1338 27.904 21.37 26.6637 23.7338 24.5245L19.2285 21.114C18.0228 21.9356 16.4047 22.5092 14.279 22.5092C10.5034 22.5092 7.29894 20.0754 6.15663 16.7114L5.9892 16.7253L1.58205 20.0583L1.52441 20.2149C3.87224 24.7725 8.69486 27.904 14.279 27.904Z" fill="#34A853" />
															<path d="M6.15656 16.7113C5.85516 15.8432 5.68072 14.913 5.68072 13.9519C5.68072 12.9907 5.85516 12.0606 6.14071 11.1925L6.13272 11.0076L1.67035 7.62109L1.52435 7.68896C0.556704 9.58024 0.00146484 11.7041 0.00146484 13.9519C0.00146484 16.1997 0.556704 18.3234 1.52435 20.2147L6.15656 16.7113Z" fill="#FBBC05" />
															<path d="M14.279 5.3947C16.9599 5.3947 18.7683 6.52635 19.7995 7.47204L23.8289 3.6275C21.3542 1.37969 18.1338 0 14.279 0C8.69485 0 3.87223 3.1314 1.52441 7.68899L6.14077 11.1925C7.29893 7.82856 10.5034 5.3947 14.279 5.3947Z" fill="#EB4335" />
														</svg>
														Sign in with Google
													</button>
												</div>
												<div className="col-xl-6 col-12">
													<button disabled={true} className="btn btn-outline-dark btn-sm btn-block mt-xl-0 mt-3">
														<svg className="me-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 456.008 560.035"><path d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655" /></svg>
														Sign in with Apple
													</button>
												</div>
											</div>
											<div className="sepertor">
												<span className="d-block mb-4 fs-13">Or with email</span>
											</div>
											{props.errorMessage && (
												<div className='text-danger p-1 my-2'>
													{props.errorMessage}
												</div>
											)}
											{props.successMessage && (
												<div className='text-danger p-1 my-2'>
													{props.successMessage}
												</div>
											)}
											<div className="mb-3">
												<label htmlFor="exampleFormControlInput1" className="form-label required">Email address</label>
												<input type="email" className="form-control"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													placeholder="Type Your Email Address"
												/>
												{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
											</div>
											<div className="mb-3 position-relative relative">
												<label className="form-label required">Password</label>
												<input
													type={type1}
													onChange={(e) =>
														setPassword(e.target.value)
													}
													value={password}
													className="form-control"
													placeholder="Type Your Password"
												/>
												<span onClick={handleTogglePassword} className="show-pass   eye">
													{type1 === "password" ? (
														<i className="fa fa-eye-slash" />
													) : (
														<i className="fa fa-eye" />
													)}

												</span>
												{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
											</div>
											<div className="form-row d-flex justify-content-between mt-4 mb-2">
												<div className="mb-3">
													<div className="form-check custom-checkbox mb-0">
														<input type="checkbox" className="form-check-input" id="customCheckBox1" required="" />
														<label className="form-check-label" htmlFor="customCheckBox1">Remember my preference</label>
													</div>
												</div>
											</div>
											<button disabled={isloading} className="btn btn-block btn-primary">Sign In</button>
										</form>
										<div className="new-account mt-3 text-center">
											<p className="font-w500">Create an account? <Link className="text-primary" to="/auth/signup" >Sign Up</Link></p>
										</div>
									</div>
									<div className="d-flex align-items-center justify-content-center">
										{/* <Link to={"#"} className="text-primary">Terms</Link>
										<Link to={"#"} className="text-primary mx-5">Plans</Link>
										<Link to={"#"} className="text-primary">Contact Us</Link> */}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
