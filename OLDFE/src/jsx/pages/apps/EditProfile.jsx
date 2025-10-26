import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from "react-router-dom";
import { logoutApi, signleUsersApi, updateSignleUsersApi } from "../../../Api/Service";
import { toast } from "react-toastify";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useDispatch } from "react-redux";

const EditProfile = () => {
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
    const [isLoading, setisLoading] = useState(true);
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

            console.log('signleUser: ', signleUser);
            if (signleUser.success) {
                setUserData(signleUser.signleUser);
            } else {
                toast.dismiss();
                toast.error(signleUser);
                return
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
        // Trim all fields in userData
        const trimmedUserData = { ...userData };
        for (let key in trimmedUserData) {
            if (trimmedUserData[key] && typeof trimmedUserData[key] === 'string') {
                trimmedUserData[key] = trimmedUserData[key].trim();
            }
        }

        if (trimmedUserData.password || trimmedUserData.confirmPassword) {
            let formErrors = { ...errors };

            if (trimmedUserData.password !== trimmedUserData.confirmPassword) {
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
            if (!trimmedUserData[field]) {
                formErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required`;
                isValid = false;
            }
        });

        // Ensure password match is checked
        if (trimmedUserData.password !== trimmedUserData.confirmPassword) {
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
                console.log('signleUsera: ', signleUser);
                toast.error(signleUser);
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
            <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <div className="card new-bg-dark  profile-card card-bx">
                        <div className="card-header">
                            <h6 className="card-title text-white">Account setup</h6>
                        </div>
                        <form className="profile-form" onSubmit={updateSignleUser}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="firstName"
                                            value={userData.firstName}
                                            onChange={handleInput}
                                            disabled={isDisable}
                                        />
                                        {errors.firstName && <div className="text-danger fs-12">{errors.firstName}</div>}
                                    </div>

                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="lastName"
                                            value={userData.lastName}
                                            onChange={handleInput}
                                            disabled={isDisable}
                                        />
                                        {errors.lastName && <div className="text-danger fs-12">{errors.lastName}</div>}

                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleInput}
                                            disabled={isDisable}
                                        />
                                        {errors.email && <div className="text-danger fs-12">{errors.email}</div>}

                                    </div>
                                    <div className="col-sm-6 mb-3 relative">
                                        <label className="form-label">Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            name="password"
                                            value={userData.password}
                                            onChange={handleInput}
                                            disabled={isDisable}
                                        />

                                        <span
                                            onClick={() => setShowPassword(!showPassword)} className=" eye">
                                            {showPassword ?
                                                <i class="fa-solid fa-eye"></i> :
                                                <i className="fa fa-eye-slash" />}


                                        </span>
                                        {errors.password && <div className="text-danger fs-12">{errors.password}</div>}
                                    </div>
                                    <div className="col-sm-6 mb-3 relative">
                                        <label className="form-label">Confirm Password</label>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="form-control"
                                            name="confirmPassword"
                                            value={userData.confirmPassword}
                                            onChange={handleInput}
                                            disabled={isDisable}
                                        />
                                        <span
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} className=" eye">
                                            {showConfirmPassword ?
                                                <i class="fa-solid fa-eye"></i> :
                                                <i className="fa fa-eye-slash" />}


                                        </span>
                                        {errors.confirmPassword && <div className="text-danger fs-12">{errors.confirmPassword}</div>}
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={userData.phone}
                                            onChange={handleInput}
                                            disabled={isDisable}
                                        />
                                        {errors.phone && <div className="text-danger fs-12">{errors.phone}</div>}

                                    </div>

                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="address"
                                            value={userData.address}
                                            onChange={handleInput}
                                            disabled={isDisable}
                                        />
                                        {errors.address && <div className="text-danger fs-12">{errors.address}</div>}

                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="city"
                                            value={userData.city}
                                            onChange={handleInput}
                                            disabled={isDisable}
                                        />
                                        {errors.city && <div className="text-danger fs-12">{errors.city}</div>}

                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Country</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="country"
                                            value={userData.country}
                                            onChange={handleInput}
                                            disabled={isDisable}
                                        />
                                        {errors.country && <div className="text-danger fs-12">{errors.country}</div>}

                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Postal Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="postalCode"
                                            value={userData.postalCode}
                                            onChange={handleInput}
                                            disabled={isDisable}
                                        />
                                        {errors.postalCode && <div className="text-danger fs-12">{errors.phone}</div>}

                                    </div>
                                </div>
                            </div>
                            <div className="card-footer align-items-center d-flex">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                    disabled={isDisable}
                                >
                                    UPDATE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfile;
