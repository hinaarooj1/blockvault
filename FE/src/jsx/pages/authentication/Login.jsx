import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './login.css'
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

		<main className='new-login'>
			<div className="layout__root MuiBox-root css-migdz" id="root__layout">
				<header className="MuiPaper-root MuiPaper-elevation MuiPaper-elevation4 MuiAppBar-root MuiAppBar-colorTransparent MuiAppBar-positionSticky layout__header css-q2wzv6">

					<div className="MuiToolbar-root MuiToolbar-regular css-uot54n">
						<div className="MuiContainer-root css-13uezk9">
							<Link to="/" className="mnl__logo__root MuiBox-root css-ga3xdk">
								<img className="MuiBox-root css-1ngw63v" src={LogoNew} />
							</Link>
							<span className="css-19pabp7">
							</span>
							<div className="MuiBox-root css-mxmcl7">
							</div>
							<div className="MuiBox-root css-19aqap1">
								<hr className="MuiDivider-root MuiDivider-fullWidth MuiDivider-vertical MuiDivider-flexItem css-1l2xvz7" />
							</div>
						</div>
					</div>
				</header>
				<main className="layout__main MuiBox-root css-vufwa1">
					<div className="MuiBox-root css-1iu2lsq">
						<div className="MuiBox-root css-phm93g">
							<Link to="/" className="mnl__logo__root MuiBox-root css-19nzp7d">
								<img className="MuiBox-root css-1ngw63v" src={LogoNew} />
							</Link>
							<div className="MuiBox-root css-sqs8lx" style={{ transform: 'rotate(216.144deg) translateZ(0px)' }}>
							</div>
						</div>
						<div className="MuiStack-root css-zlqbjq">
							<h5 className="MuiTypography-root MuiTypography-h5 css-fp59aj">
								Sign in to your account
							</h5>
							<div className="MuiStack-root css-fhxiwe">
								<p className="MuiTypography-root MuiTypography-body2 css-ffhzw7">
									Don't have an account?
								</p>
								<Link to="/auth/signup" className="MuiTypography-root MuiTypography-subtitle2 MuiLink-root MuiLink-underlineHover css-1vuw1wj">
									Get started
								</Link>
							</div>
						</div>
						<form onSubmit={onLogin}>
							<div className="MuiStack-root css-1i43dhb">
								<div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
									<label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r0:-label">
										Email address
									</label>
									<div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u1jokr">
										<input value={email}
											onChange={(e) => setEmail(e.target.value)} className="MuiInputBase-input MuiOutlinedInput-input css-126sty9" id=":r0:" />
										<fieldset className="MuiOutlinedInput-notchedOutline css-15bf1b4">
											<legend className="css-14lo706">
												<span>
													Email address
												</span>
											</legend>
										</fieldset>
									</div>
									{errors.email && <div className="text-danger mt-2 fs-12">{errors.email}</div>}
								</div>
								<div className="MuiStack-root css-1hdbc19">
									{/* <a className="MuiTypography-root MuiTypography-body2 MuiLink-root MuiLink-underlineHover css-1ast7b5">
										Forgot password?
									</a> */}
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
									<div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6">
										<label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeMedium MuiInputLabel-outlined css-jpp5th" id=":r1:-label">
											Password
										</label>
										<div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd css-ssv83">
											<input type={type1}
												onChange={(e) =>
													setPassword(e.target.value)
												}
												value={password} className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-1puc122" id=":r1:" />
											<div className="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-outlined MuiInputAdornment-sizeMedium css-w8wce8">
												{type1 === "password" ? <button type='button' onClick={handleTogglePassword} className="MuiButtonBase-root MuiIconButton-root MuiIconButton-edgeEnd MuiIconButton-sizeMedium css-1fk2kk1">
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
										{errors.password && <div className="text-danger fs-12 mt-2">{errors.password}</div>}
									</div>
								</div>
								<button style={{ opacity: isloading ? 0.5 : 1, cursor: isloading ? "default" : "pointer" }} disabled={isloading} className="MuiButtonBase-root MuiButton-root MuiLoadingButton-root MuiButton-contained MuiButton-containedInherit MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButton-colorInherit MuiButton-disableElevation MuiButton-fullWidth MuiButton-root MuiLoadingButton-root MuiButton-contained MuiButton-containedInherit MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButton-colorInherit MuiButton-disableElevation MuiButton-fullWidth css-1i03yle" id=":r2:">
									Sign in
									<span className="MuiTouchRipple-root css-w0pj6f">
									</span>
								</button>
							</div>
						</form>
					</div>
				</main>
			</div>


		</main>
	);
};

export default Login;
