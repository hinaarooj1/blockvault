import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from "react-router-dom";
import { getAllDataApi, getLinksApi, logoutApi, signleUsersApi, updateSignleUsersApi } from "../../../Api/Service";
import { toast } from "react-toastify";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useDispatch } from "react-redux";

import { Button, Card, Spinner, Container, Row, Col } from "react-bootstrap";
import {
	FileCard,
	FullScreen,
	ImagePreview,
	VideoPreview,
} from "@files-ui/react";
const Documents = () => {

	const [Active, setActive] = useState(false);
	const [isLoading, setisLoading] = useState(true);
	const [allFiles, setallFiles] = useState([]);
	const [imgSrc, setImgSrc] = React.useState(undefined);

	const [videoSrc, setVideoSrc] = useState(undefined);
	const [showImagePreview, setShowImagePreview] = useState(false);
	const [showVideoPreview, setShowVideoPreview] = useState(false);
	const handleSee = (file) => {
		if (file.type.startsWith("image")) {
			setImgSrc(file.url);
			setShowImagePreview(true);
		} else if (file.type.startsWith("video")) {
			setVideoSrc(file.url);
			setShowVideoPreview(true);
		}
	};

	const handleDownload = async (file) => {
		const fileUrl = file.url;
		const response = await fetch(fileUrl);
		const fileContent = await response.blob();
		const blob = new Blob([fileContent], { type: file.type });
		const downloadLink = document.createElement("a");
		downloadLink.href = URL.createObjectURL(blob);
		downloadLink.download = file.public_id;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	};
	const [secLoading, setsecLoading] = useState(true);
	const fetchLinks = async () => {
		try {
			const data = await getLinksApi();
			console.log('data: ', data);

			if (data?.links[3]?.enabled) {

				setsecLoading(false)
			} else {
				Navigate(-1);
			}
		} catch (error) {
			console.error("Error fetching links:", error);
		}
	};
	useEffect(() => {
		fetchLinks()
	}, []);
	let toggleBar = () => {
		if (Active === true) {
			setActive(false);
		} else {
			setActive(true);
		}
	};

	const getsignUser = async () => {
		try {
			const uploadFiles = await getAllDataApi(authUser().user._id);
			console.log("authUser().user.id: ", authUser().user._id);

			if (uploadFiles.success) {
				if (uploadFiles.allFiles && uploadFiles.allFiles.files) {
					setallFiles(uploadFiles.allFiles.files);
				} else {
					setallFiles(null);
				}
			} else {
				toast.error(uploadFiles.msg);
			}
		} catch (error) {
			console.log("error: ", error);
			toast.error(error?.data?.msg || error?.message || "Something went wrong");
		} finally {
			setisLoading(false);
		}
	};
	//

	//

	useEffect(() => {
		getsignUser();
		if (authUser().user.role === "user") {
			return;
		} else if (authUser().user.role === "admin") {
			Navigate("/admin/dashboard");
			return;
		}
	}, []);
	// 
	let signOut = useSignOut();
	const dispatch = useDispatch();

	const onLogout = async () => {
		try {
			const logout = await logoutApi();

			if (logout.success) {
				signOut();

				Navigate("/auth/login");
				return;
			} else {
				toast.dismiss();
				toast.error(logout.msg);
			}
		} catch (error) {
			toast.dismiss();
			toast.error(error);
		} finally {
		}
	};
	const [isDisable, setisDisable] = useState(true);
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		phone: "",
		confirmPassword: "",
		address: "",
		city: "",
		country: "",
		postalCode: "",
	});
	const [errors, setErrors] = useState({});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	let handleInput = (e) => {
		let name = e.target.name;
		let value = e.target.value;
		setUserData({ ...userData, [name]: value });
	};

	let { id } = useParams();
	let authUser = useAuthUser();
	
	let Navigate = useNavigate();

	const getSignleUser = async () => {
		try {
			const signleUser = await signleUsersApi(authUser().user._id);

			if (signleUser.success) {
				setUserData(signleUser.signleUser);
			} else {
				toast.dismiss();
				toast.error(signleUser.msg);
			}
		} catch (error) {
			toast.dismiss();
			toast.error(error);
		} finally {
			setisLoading(false);
			setisDisable(false)
		}
	};

	const validateForm = () => {
		if (userData.password || userData.confirmPassword) {
			let formErrors = { ...errors };

			if (userData.password !== userData.confirmPassword) {
				formErrors.confirmPassword = "Passwords do not match";
			} else {
				delete formErrors.confirmPassword;
			}

			setErrors(formErrors);
		}
		let formErrors = {};
		let isValid = true;

		// Check if all fields are filled, excluding 'note'
		const fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone', 'address', 'city', 'country', 'postalCode'];

		fieldsToValidate.forEach(field => {
			if (!userData[field]) {
				formErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required`;
				isValid = false;
			}
		});

		// Ensure password match is checked
		if (userData.password !== userData.confirmPassword) {
			formErrors.confirmPassword = "Passwords do not match";
			isValid = false;
		}

		setErrors(formErrors);
		return isValid;
	};


	const updateSignleUser = async (e) => {
		e.preventDefault();
		console.log("ds");
		if (!validateForm()) {
			console.log("asa");
			return;
		}
		console.log("sa");
		try {
			setisDisable(true);
			const body = { ...userData };
			const signleUser = await updateSignleUsersApi(userData._id, body);

			if (signleUser.success) {
				toast.dismiss();
				toast.success(signleUser.msg);
				onLogout()
				toast.info("Profile Updated! Please login again with new details")
			} else {
				toast.dismiss();
				toast.error(signleUser.msg);
			}
		} catch (error) {
			toast.dismiss();
			toast.error(error);
		} finally {
			setisDisable(false);
		}
	};


	useEffect(() => {
		getSignleUser();
		if (authUser().user.role === "user") {
			return;
		} else if (authUser().user.role === "admin") {
			Navigate("/dashboard");
			setUserData(authUser().user);
			return;
		}
	}, []);
	// useEffect(() => {
	//     // Run validation when either password or confirmPassword changes
	//     if (userData.password || userData.confirmPassword) {
	//         let formErrors = { ...errors };

	//         if (userData.password !== userData.confirmPassword) {
	//             formErrors.confirmPassword = "Passwords do not match";
	//         } else {
	//             delete formErrors.confirmPassword;
	//         }

	//         setErrors(formErrors);
	//     }
	// }, [userData.password, userData.confirmPassword]);
	return (
		<>
			<Row>
				<Col xl={12} lg={12}>
					<Card className="new-bg-dark">
						{secLoading ? "" :
							<><Card.Header className="text-white">
								<Card.Title className="text-white">All Files</Card.Title>
							</Card.Header>
								{isLoading ? (
									<div className="text-center my-5">
										<Spinner animation="border" variant="primary" />
										<h4 className="mt-3">Loading files...</h4>
										<p>Please wait while we load the file.</p>
									</div>
								) : !Array.isArray(allFiles) || allFiles.length === 0 ? (
									<div className="text-center my-5">
										<h4 className="text-white">No documents found!</h4>
									</div>
								) : (
									<div className="p-4">
										<div className="m4">
										</div>
										{allFiles.slice().reverse().map((file, index) => (
											<Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-3">
												<FileCard
													id={index}
													name={file.name}
													type={file.type}
													info
													downloadUrl={file.url}
													onDownload={() => handleDownload(file)}
													darkMode
													imageUrl={file.url}
													onSee={file.type.startsWith("image") || file.type.startsWith("video") ? () => handleSee(file) : undefined}
													size={file.size}
												/>
											</Col>
										))}
										{showImagePreview && (
											<FullScreen onClose={() => setShowImagePreview(false)}>
												<ImagePreview src={imgSrc} onClose={() => setShowImagePreview(false)} />
											</FullScreen>
										)}
										{showVideoPreview && (
											<FullScreen onClose={() => setShowVideoPreview(false)}>
												<VideoPreview src={videoSrc} onClose={() => setShowVideoPreview(false)} />
											</FullScreen>
										)}
									</div>
								)}</>
						}
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default Documents;
