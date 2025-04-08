import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from "react-router-dom";
import { getAllDataApi, getsignUserApi, logoutApi, sendEmailCodeApi, signleUsersApi, updateSignleUsersApi, verifySingleUserApi } from "../../../Api/Service";
import { toast } from "react-toastify";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useDispatch } from "react-redux";
import { Button, Form, Container, Row, Col } from 'react-bootstrap'
import {
    FileCard,
    FullScreen,
    ImagePreview,
    VideoPreview,
} from "@files-ui/react";
const Documents = ({ isLoading, setisLoading }) => {

    let SignOut = useSignOut();
    const authUser = useAuthUser();
    const Navigate = useNavigate();
    const [slide1, setSlide1] = useState();
    const [slide2, setSlide2] = useState();
    const [isDisable, setisDisable] = useState(false);
    const [isDisable2, setisDisable2] = useState(false);
    const [verificationCodeSent, setverificationCodeSent] = useState(false);
    const [dataNew, setdataNew] = useState(false);
    const [newSlider1, setNewSlider1] = useState();
    const [newSlider2, setNewSlider2] = useState();
    const [isUser, setIsUser] = useState(true);
    const [emailValue, setemailValue] = useState("");
    const [optValue, setoptValue] = useState("");
    const [isEmail, setisEmail] = useState(false);
    const [isCode, setisCode] = useState(false);
    const [isDoc, setIsDoc] = useState(true);
    const [randomCode, setRandomCode] = useState(null);

    function generateRandomCode() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let changeBanner1 = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileSize = file.size;

            const maxSize = 10 * 1024 * 1024; // 3MB max size
            if (fileSize > maxSize) {
                setNewSlider1("");
                setSlide1(""); // Clear the input field
                toast.error("File size exceeds 10MB limit. Please choose a smaller file.");
                return;
            }

            // Directly set the File object
            setNewSlider1(file);
            setSlide1(URL.createObjectURL(file)); // Display preview
        } else {
            setNewSlider1("");
            setSlide1("");
        }
    };

    let changeBanner2 = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileSize = file.size;

            const maxSize = 10 * 1024 * 1024;
            if (fileSize > maxSize) {
                toast.error("File size exceeds 10MB limit. Please choose a smaller file.");
                setNewSlider2("");
                setSlide2(""); // Clear the input field
                return;
            }

            // Directly set the File object
            setNewSlider2(file);
            setSlide2(URL.createObjectURL(file)); // Display preview
        } else {
            setNewSlider2("");
            setSlide2("");
        }
    };

    const verifyUser = async () => {
        try {
            if (!newSlider1 || !newSlider2) {
                toast.dismiss();
                toast.info("Please upload both the documents");
                return;
            }

            setisDisable(true);
            const formData = new FormData();
            formData.append("cnic", newSlider1); // File object

            formData.append("id", isUser._id);
            formData.append("bill", newSlider2); // File object

            const updateHeader = await verifySingleUserApi(formData); // FormData is being sent here

            if (updateHeader.success) {
                setIsDoc(false);
                toast.dismiss();
                toast.success(updateHeader.msg);
                setTimeout(() => {
                    Navigate("/dashboard");
                }, 100);
            } else {
                toast.dismiss();
                toast.error(updateHeader.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error?.data?.msg || error?.message || "Something went wrong");
        } finally {
            setisDisable(false);
        }
    };

    const getsignUser = async () => {
        try {
            const formData = new FormData();
            formData.append("id", authUser().user._id);
            const userCoins = await getsignUserApi(formData);

            if (userCoins.success) {
                setIsUser(userCoins.signleUser);
                if (userCoins.signleUser.submitDoc.status === "completed") {
                    Navigate("/dashboard");
                    return;
                }
                // setisLoading(false);
                return;
            } else {
                toast.dismiss();
                toast.error(userCoins.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            // setisLoading(false);

        }
    };

    useEffect(() => {
        const mockAsyncOperation = () => {
            setTimeout(() => {
                setisLoading(false);
            }, 2000); // Simulate a 2-second delay
        };
        mockAsyncOperation();
        console.log(isLoading);
    }, [setisLoading]);
    console.log(isLoading);

    let sendEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isValidEmail = emailRegex.test(emailValue);
        if (emailValue === "") {
            return toast.error("Please enter your email");
        }
        if (!isValidEmail) {
            return toast.error("Enter email in correct format");
        }

        const newCode = generateRandomCode();
        setRandomCode(newCode);
        try {
            let id = authUser().user._id;
            let body = { email: emailValue, id, code: newCode };

            setisDisable(true);
            const sendEmail = await sendEmailCodeApi(body);
            if (sendEmail.success) {
                toast.dismiss();

                toast.success(sendEmail.msg);
                setisCode(true);
                setisEmail(false);
                setIsDoc(false);
            } else {
                toast.dismiss();
                toast.error(sendEmail.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error?.data?.msg || error?.message || "Something went wrong");
        } finally {
            setisDisable(false);
        }
    };
    let reSend = async () => {
        const newCode = generateRandomCode();
        setRandomCode(newCode);
        try {
            let id = authUser().user._id;
            let body = { email: emailValue, id, code: newCode };

            setisDisable2(true);

            setdataNew(true);
            const sendEmail = await sendEmailCodeApi(body);
            if (sendEmail.success) {
                toast.dismiss();

                setverificationCodeSent(true);
            } else {
                toast.dismiss();
                toast.error(sendEmail.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error?.data?.msg || error?.message || "Something went wrong");
        } finally {
            setisDisable2(false);
        }
    };
    //

    //
    let verifyCode = () => {
        if (optValue === "") {
            return toast.info(
                "Please enter the One-Time Passcode (OTP) that has been sent to your email address."
            );
        }
        setisDisable(true);
        setTimeout(() => {
            if (optValue.toString() === randomCode.toString()) {
                toast.success("Otp verified successfully");
                setisCode(false);
                setisEmail(false);
                setIsDoc(true);
                setisDisable(false);
            } else {
                toast.error("Incorrect  One-Time Passcode (OTP) , please try again ");
                setisDisable(false);
            }
        }, 2000);
    };
    useEffect(() => {
        getsignUser();
        if (authUser().user.role === "user") {
            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
    }, []);

    return (
        <>
            <Row>
                {

                    isDoc && (
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                verifyUser();
                            }}
                            noValidate
                        >
                            <Container>
                                <Row className="mb-8">
                                    <Col sm={6}>
                                        <div className="relative">
                                            <div style={{ minHeight: "260px" }} className="border bg-white rounded-xl p-4 position-relative">
                                                <div className="text-center">
                                                    <p className="text-muted font-heading text-base font-medium">
                                                        Upload ID
                                                    </p>
                                                    <p className="font-alt text-xs text-muted">
                                                        Please upload a clear image of a valid government-issued identification document (e.g., passport, national ID, or driver's license).
                                                    </p>

                                                </div>
                                                <div className="position-absolute top-0 end-0 opacity-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="icon text-primary h-7 w-7" viewBox="0 0 256 256">
                                                        <g fill="currentColor">
                                                            <path d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96" opacity=".2" />
                                                            <path d="M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88" />
                                                        </g>
                                                    </svg>
                                                </div>
                                                <img className="logo-to-show" src={slide1} alt="" />
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={changeBanner1}
                                                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                                                />
                                                <div className="text-center mt-3">
                                                    <Button variant="primary" className="w-48">
                                                        Upload
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="relative">
                                            <div style={{ minHeight: "260px" }} className="border bg-white rounded-xl p-4 position-relative">
                                                <div className="text-center">
                                                    <p className="text-muted font-heading text-base font-medium">
                                                        Upload Utility Bill
                                                    </p>
                                                    <p className="font-alt text-xs text-muted">
                                                        Please upload a clear image of a recent utility bill (e.g., electricity, water, or gas bill) in your name.
                                                    </p>

                                                </div>
                                                <div className="position-absolute top-0 end-0 opacity-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="icon text-primary h-7 w-7" viewBox="0 0 256 256">
                                                        <g fill="currentColor">
                                                            <path d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96" opacity=".2" />
                                                            <path d="M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88" />
                                                        </g>
                                                    </svg>
                                                </div>
                                                <img className="logo-to-show2" src={slide2} alt="" />
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={changeBanner2}
                                                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                                                />
                                                <div className="text-center mt-3">
                                                    <Button variant="primary" className="w-48">
                                                        Upload
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="text-center mt-4">
                                    <Button
                                        variant="primary"
                                        className="w-48"
                                        type="submit"
                                        disabled={isDisable}
                                    >
                                        {isDisable ? (
                                            <div className="spinner-border spinner-border-sm" role="status"></div>
                                        ) : (
                                            "Continue"
                                        )}
                                    </Button>
                                </div>
                                <br />
                                <br />
                                <br />
                            </Container>
                        </Form>
                    )}

            </Row>
        </>
    )
}

export default Documents;
