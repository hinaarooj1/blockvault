import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SVGICON } from '../../constant/theme';
import Bitcoin from "../../../assets/images/img/btc.svg"
import EthLogo from "../../../assets/images/img/eth.svg"
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { addCardApi, createUserTransactionApi, deletePaymentApi, getCoinsUserApi, getLinksApi, getsignUserApi, PaymentsApi } from '../../../Api/Service';
import axios from 'axios';
import { Button, Card, Col, Form, DropdownDivider, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';


const PaymentMethods = () => {
    const [Active, setActive] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [isDisable, setisDisable] = useState(false);
    const [isDisable1, setisDisable1] = useState(false);
    const [activeBankOption, setactiveBankOption] = useState(false);

    const [UserData, setUserData] = useState(true);
    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };

    const authUser = useAuthUser();
    const Navigate = useNavigate();
    const [isUser, setIsUser] = useState({});
    const getsignUser = async () => {
        try {
            const formData = new FormData();
            formData.append("id", authUser().user._id);
            const userCoins = await getsignUserApi(formData);

            if (userCoins.success) {
                setIsUser(userCoins.signleUser);

                return;
            } else {
                toast.dismiss();
                toast.error(userCoins.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisLoading(false);
        }
    };

    const deletePayment = async (pId) => {
        try {
            setisDisable1(true);
            let id = authUser().user._id;
            const deleteAccount = await deletePaymentApi(id, pId);

            if (deleteAccount.success) {
                toast.success(deleteAccount.msg);
                getsignUser();

                return;
            } else {
                toast.dismiss();
                toast.error(deleteAccount.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisable1(false);
        }
    };
    //

    //
    const [secLoading, setsecLoading] = useState(true);

    const fetchLinks = async () => {
        try {
            const data = await getLinksApi();
            console.log('data: ', data);

            if (data?.links[5]?.enabled) {

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

    useEffect(() => {
        getsignUser();
        if (authUser().user.role === "user") {
            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
    }, []);
    // withdraw
    const [modal3, setModal3] = useState(false);

    const [accountDetail, setaccountDetail] = useState({
        accountName: "",
        accountNumber: "",
        iban: "",
        accountNotes: "",
    });
    let handleTransactionId = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setaccountDetail({ ...accountDetail, [name]: value });
    };

    let closeDeposit = () => {
        setModal3(false);
    };
    const getCardTypeFromNumber = (cardNumber) => {
        // Define patterns for different card types
        const patterns = {
            visa: /^4/,
            mastercard: /^(5[1-5]|2(2(2[1-9]|[3-9])|[3-6]|7(0|1|20)))/,
            amex: /^3[47]/,
            discover: /^6(?:011|5[0-9]{2})/,
            dinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
        };

        // Check each pattern to determine the card type
        for (const [cardType, pattern] of Object.entries(patterns)) {
            if (pattern.test(cardNumber)) {
                return cardType;
            }
        }

        return "other"; // Default to 'other' if no match found
    };

    const addAccount = async () => {
        try {
            let id = authUser().user._id;
            setisDisable(true);

            let body = {
                accountName: accountDetail.accountName,
                accountNumber: accountDetail.accountNumber,
                iban: accountDetail.iban,
                accountNotes: accountDetail.accountNotes,
            };

            if (
                !body.accountName ||
                !body.accountNumber ||
                !body.accountNotes ||
                !body.iban
            ) {
                toast.dismiss();
                toast.error("Fill all the required fields");
                return;
            }
            const newAccount = await PaymentsApi(id, body);

            if (newAccount.success) {
                toast.dismiss();
                setaccountDetail({
                    accountName: "",
                    accountNumber: "",
                    iban: "",
                    accountNotes: "",
                });
                toast.success(newAccount.msg);
                getsignUser();

                closeDeposit();
            } else {
                toast.dismiss();
                toast.error(newAccount.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisable(false);
        }
    };
    let activeCredit = () => {
        setactiveBankOption(false);
    };
    let activeBank = () => {
        setactiveBankOption(true);
    };
    // bank
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number
        if (name === "cardNumber") {
            formattedValue = formattedValue.replace(/\D/g, ""); // Remove non-digit characters
            if (formattedValue.length > 16) {
                formattedValue = formattedValue.slice(0, 16); // Limit to 16 characters
            }
        }

        // Format expiry date as MM/YY
        if (name === "expiryDate") {
            formattedValue = formattedValue.replace(/\D/g, ""); // Remove non-digit characters
            if (formattedValue.length > 4) {
                formattedValue = formattedValue.slice(0, 4); // Limit to 4 characters
            }
            if (formattedValue.length > 2) {
                formattedValue =
                    formattedValue.slice(0, 2) + "/" + formattedValue.slice(2); // Add slash
            }
        }

        // Format CVV
        if (name === "cvv") {
            formattedValue = formattedValue.replace(/\D/g, ""); // Remove non-digit characters
            if (formattedValue.length > 3) {
                formattedValue = formattedValue.slice(0, 3); // Limit to 3 characters
            }
        }

        setFormData({
            ...formData,
            [name]: formattedValue,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        // Card Number validation
        if (!/^\d{16}$/.test(formData.cardNumber)) {
            newErrors.cardNumber = "Card number must be 16 digits";
        }
        const cardType = getCardTypeFromNumber(formData.cardNumber);
        if (cardType === "other" && formData.cardNumber.length === 16) {
            newErrors.cardNumber = "Invalid Card";
        }

        // Card Holder validation
        if (!formData.cardHolder) {
            newErrors.cardHolder = "Card holder is required";
        }

        // CVV validation
        if (!/^\d{3}$/.test(formData.cvv)) {
            newErrors.cvv = "CVV must be 3 digits";
        }
        // Expiry Date validation
        if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = "Expiry date must be in MM/YY format";
        }
        setErrors(newErrors);

        // If no errors, you can proceed with form submission or other actions
        if (Object.keys(newErrors).length === 0) {
            // Perform form submission or other actions here
            try {
                let id = authUser().user._id;
                setisDisable(true);

                let body = {
                    cardType: cardType,
                    cardNumber: formData.cardNumber,
                    cardName: formData.cardHolder,
                    cardExpiry: formData.expiryDate,
                    cardCvv: formData.cvv,
                    cardNotes: formData.notes,
                };

                const newAccount = await addCardApi(id, body);

                if (newAccount.success) {
                    toast.dismiss();
                    toast.success(newAccount.msg);
                    setFormData({
                        cardNumber: "",
                        cardHolder: "",
                        expiryDate: "",
                        cvv: "",
                        notes: "",
                    });
                    getsignUser();

                    closeDeposit();
                } else {
                    toast.dismiss();
                    toast.error(newAccount.msg);
                }
            } catch (error) {
                toast.dismiss();
                toast.error(error);
            } finally {
                setisDisable(false);
            }
        }
    };
    return (
        <>
            <div className="row">
                <div className="col-xxl-12">
                    {secLoading ? "" :
                        <div className="card new-bg-dark ">
                            <Card.Header>
                                <Card.Title className='text-white'>Accounts</Card.Title>
                            </Card.Header>
                            <div className="card-body">
                                {isLoading ? (
                                    <div className="text-center my-5">
                                        <Spinner animation="border" variant="primary" />
                                        <h4 className="mt-3">Loading Accounts...</h4>
                                        <p>Please wait while we load the accounts.</p>
                                    </div>
                                ) : UserData === null || !UserData ? (
                                    <div className="text-center my-5">
                                        <h4> No Account found!</h4>
                                    </div>) : (


                                    <div className=" ptbg relative w-full    transition-all duration-300 ">
                                        <div className="flex items-center justify-between p-4">
                                            <div>
                                                <h3
                                                    className=" font-heading text-white  text-sm font-medium leading-normal leading-normal uppercase tracking-wider"
                                                    tag="h2"
                                                >
                                                    Payment Methods
                                                </h3>
                                                <p className="text-white">
                                                    You can add or remove your payment methods here.
                                                </p>
                                            </div>
                                            <button onClick={() => setModal3(true)} className="add-btn btn btn-primary">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={24}
                                                    height={24}
                                                    fill="none"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 5v14m-7-7h14"
                                                    />
                                                </svg>
                                                Add New
                                            </button>
                                        </div>
                                        <div className="pt-6">
                                            <div class="MuiGrid2-root MuiGrid2-container MuiGrid2-direction-xs-row MuiGrid2-spacing-xs-3 css-v57kt1">
                                                {isLoading ? (
                                                    <div>Loading...</div>
                                                ) : isUser.payments.length !== 0 ? (
                                                    isUser.payments.map((item, key) => {
                                                        return (
                                                            <div
                                                                key={key}
                                                                class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-sm-6 MuiGrid2-grid-md-4 css-1m1aas1"
                                                            >
                                                                <div class="MuiStack-root svga css-1gq5e6f">
                                                                    <div class="MuiStack-root css-4u2is6">
                                                                        <div class="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-drtivy">
                                                                            {item.type === "bank" && (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="24"
                                                                                    height="24"
                                                                                    fill="white"
                                                                                    stroke='white'
                                                                                >
                                                                                    <path
                                                                                        fill="white"
                                                                                        stroke='white'
                                                                                        className='majd'
                                                                                        d="M19.4 21c.5601 0 .8401 0 1.054-.109a.9993.9993 0 0 0 .437-.437C21 20.2401 21 19.9601 21 19.4v-.8c0-.56 0-.8401-.109-1.054a1.0003 1.0003 0 0 0-.437-.437C20.2401 17 19.9601 17 19.4 17H4.6c-.56 0-.84 0-1.054.109a1.0005 1.0005 0 0 0-.437.437C3 17.7599 3 18.04 3 18.6v.8c0 .5601 0 .8401.109 1.054a.9994.9994 0 0 0 .437.437C3.76 21 4.04 21 4.6 21h14.8Zm0-12c.5601 0 .8401 0 1.054-.109a1 1 0 0 0 .437-.437C21 8.2401 21 7.96 21 7.4V6.2835c0-.458 0-.687-.0812-.876a.9992.9992 0 0 0-.3343-.4167c-.1668-.1202-.3903-.1699-.8374-.2692l-7.4-1.6444c-.1295-.0288-.1943-.0432-.2597-.049a1.0004 1.0004 0 0 0-.1748 0c-.0654.0058-.1302.0202-.2597.049l-7.4 1.6444c-.447.0993-.6706.149-.8374.2692a1 1 0 0 0-.3344.4168C3 5.5966 3 5.8256 3 6.2835V7.4c0 .56 0 .8401.109 1.054.0959.1882.2489.3411.437.437C3.76 9 4.04 9 4.6 9h14.8Z"
                                                                                    ></path>
                                                                                    <path
                                                                                        stroke="white"
                                                                                        stroke-linecap="round"
                                                                                        className='majd'
                                                                                        stroke-linejoin="round"
                                                                                        stroke-width="2"
                                                                                        d="M5 9v8m4.5-8v8m5-8v8M19 9v8M3 18.6v.8c0 .5601 0 .8401.109 1.054a.9994.9994 0 0 0 .437.437C3.76 21 4.04 21 4.6 21h14.8c.5601 0 .8401 0 1.054-.109a.9993.9993 0 0 0 .437-.437C21 20.2401 21 19.9601 21 19.4v-.8c0-.56 0-.8401-.109-1.054a1.0003 1.0003 0 0 0-.437-.437C20.2401 17 19.9601 17 19.4 17H4.6c-.56 0-.84 0-1.054.109a1.0005 1.0005 0 0 0-.437.437C3 17.7599 3 18.04 3 18.6Zm8.6529-15.5229-7.4 1.6445c-.447.0993-.6706.149-.8374.2692a1 1 0 0 0-.3344.4168C3 5.5966 3 5.8256 3 6.2835V7.4c0 .56 0 .8401.109 1.054.0959.1882.2489.3411.437.437C3.76 9 4.04 9 4.6 9h14.8c.5601 0 .8401 0 1.054-.109a1 1 0 0 0 .437-.437C21 8.2401 21 7.96 21 7.4V6.2835c0-.458 0-.687-.0812-.876a.9992.9992 0 0 0-.3343-.4167c-.1668-.1202-.3903-.1699-.8374-.2692l-7.4-1.6444c-.1295-.0288-.1943-.0432-.2597-.049a1.0004 1.0004 0 0 0-.1748 0c-.0654.0058-.1302.0202-.2597.049Z"
                                                                                    ></path>
                                                                                </svg>
                                                                            )}
                                                                            {item.type === "card" && (
                                                                                <svg
                                                                                    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv"
                                                                                    focusable="false"
                                                                                    aria-hidden="true"
                                                                                    width="24"
                                                                                    height="24"
                                                                                    viewBox="0 0 24 24"
                                                                                    data-testid="CreditCardIcon"
                                                                                >
                                                                                    <path
                                                                                        fill="white"
                                                                                        className='majd'
                                                                                        d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
                                                                                    />
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                        <div class="MuiStack-root css-1msa3n8">
                                                                            <h6 class="text-white MuiTypography-root MuiTypography-subtitle2 css-15udru3">
                                                                                {item.type === "bank"
                                                                                    ? "Bank Account"
                                                                                    : "Credit Card"}
                                                                            </h6>
                                                                            <h6 className="MuiTypography-root  text-white  MuiTypography-subtitle1 css-1oklce5">
                                                                                {item.type === "bank" ? (
                                                                                    <>
                                                                                        <p>
                                                                                            <b> Bank Name:</b> <br />
                                                                                            {item.bank.accountName}
                                                                                        </p>{" "}

                                                                                        <p>
                                                                                            <b> Bank Account:</b>
                                                                                            <br />
                                                                                            {item.bank.accountNumber}
                                                                                        </p>{" "}
                                                                                        <p>
                                                                                            <b>   Bank IBAN:</b>
                                                                                            <br />
                                                                                            {item.bank.iban}
                                                                                        </p>{" "}
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        {item.card.cardNumber && (
                                                                                            <>
                                                                                                <span
                                                                                                    className="uppercase text-white "
                                                                                                    style={{
                                                                                                        textTransform: "uppercase",
                                                                                                    }}
                                                                                                >
                                                                                                    {item.card.cardCategory}
                                                                                                </span>{" "}
                                                                                                *{item.card.cardNumber.slice(-4)}
                                                                                            </>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </h6>

                                                                            <span class="MuiTypography-root text-white  MuiTypography-caption css-5d62nz">
                                                                                {new Date(
                                                                                    item.card.createdAt
                                                                                ).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {item.type === "bank" ? (
                                                                        <button
                                                                            class="MuiButtonBase-root  nas asSA MuiIconButton-root MuiIconButton-sizeSmall css-1s4gov3"
                                                                            tabindex="0"
                                                                            type="button"
                                                                            disabled={isDisable1}
                                                                            onClick={() => deletePayment(item._id)}
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="24"
                                                                                height="24"
                                                                                fill="white"
                                                                            >
                                                                                <path
                                                                                    className='majd'
                                                                                    d="M3 6.6h16.2H3Z"
                                                                                    fill="white"
                                                                                ></path>
                                                                                <path
                                                                                    stroke-linecap="round"
                                                                                    className='majd2'
                                                                                    store="white"
                                                                                    fill="white"
                                                                                    stroke-linejoin="round"
                                                                                    stroke-width="2"
                                                                                    d="M14.7 6.6v-.72c0-1.008 0-1.5121-.1962-1.8972a1.8 1.8 0 0 0-.7866-.7866C13.3321 3 12.8281 3 11.82 3h-1.44c-1.008 0-1.5121 0-1.8972.1962a1.8 1.8 0 0 0-.7866.7866C7.5 4.3678 7.5 4.872 7.5 5.88v.72m1.8 4.95v4.5m3.6-4.5v4.5M3 6.6h16.2m-1.8 0v10.08c0 1.5121 0 2.2682-.2943 2.8458a2.6996 2.6996 0 0 1-1.1799 1.1799C15.3482 21 14.5921 21 13.08 21H9.12c-1.5121 0-2.2682 0-2.8458-.2943a2.6998 2.6998 0 0 1-1.18-1.1799C4.8 18.9482 4.8 18.1921 4.8 16.68V6.6"
                                                                                ></path>
                                                                            </svg>
                                                                            <span class="MuiTouchRipple-root css-w0pj6f"></span>
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            class="MuiButtonBase-root nas asSA MuiIconButton-root MuiIconButton-sizeSmall css-1s4gov3"
                                                                            tabindex="0"
                                                                            type="button"
                                                                            disabled={isDisable1}
                                                                            onClick={() => deletePayment(item._id)}
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="24"
                                                                                height="24"
                                                                                fill="white"
                                                                            >
                                                                                <path
                                                                                    className='majd'
                                                                                    d="M3 6.6h16.2H3Z"
                                                                                ></path>
                                                                                <path
                                                                                    className='majd2'
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"
                                                                                    stroke-width="2"
                                                                                    d="M14.7 6.6v-.72c0-1.008 0-1.5121-.1962-1.8972a1.8 1.8 0 0 0-.7866-.7866C13.3321 3 12.8281 3 11.82 3h-1.44c-1.008 0-1.5121 0-1.8972.1962a1.8 1.8 0 0 0-.7866.7866C7.5 4.3678 7.5 4.872 7.5 5.88v.72m1.8 4.95v4.5m3.6-4.5v4.5M3 6.6h16.2m-1.8 0v10.08c0 1.5121 0 2.2682-.2943 2.8458a2.6996 2.6996 0 0 1-1.1799 1.1799C15.3482 21 14.5921 21 13.08 21H9.12c-1.5121 0-2.2682 0-2.8458-.2943a2.6998 2.6998 0 0 1-1.18-1.1799C4.8 18.9482 4.8 18.1921 4.8 16.68V6.6"
                                                                                ></path>
                                                                            </svg>
                                                                            <span class="MuiTouchRipple-root css-w0pj6f"></span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="px-5 py-4">
                                                        <h1 className="text-white">
                                                            No payment methods found
                                                        </h1>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>}
                </div>
            </div>

            {modal3 && (
                <div
                    className="modal fade show"
                    id="paymentModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="paymentModalLabel"
                    aria-modal="true"
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="paymentModalLabel">Add Payment Method</h5>
                                <Button
                                    variant=""
                                    onClick={closeDeposit}
                                    className="btn-close"

                                ></Button>
                            </div>
                            <div className="modal-body">

                                <div className="mb-3 axs text-center" bis_skin_checked={1}>
                                    <button onClick={activeBank}
                                        className={activeBankOption ? "btn  btn-primary me-2" : "btn btn-outline-primary  btn me-2"}>Bank Account</button>
                                    <button onClick={activeCredit}
                                        type="button"
                                        className={!activeBankOption ? "btn  btn-primary" : "btn btn-outline-primary"}> Credit Card</button></div>
                                {activeBankOption ? (
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="bankName">Bank Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="bankName"
                                                placeholder="Enter bank name"
                                                value={accountDetail.accountName}
                                                onChange={handleTransactionId}
                                                name="accountName"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="accountNumber">Account Number</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="accountNumber"
                                                placeholder="Enter account number"
                                                value={accountDetail.accountNumber}
                                                onChange={handleTransactionId}
                                                name="accountNumber"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="iban">IBAN</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="iban"
                                                placeholder="Enter IBAN"
                                                value={accountDetail.iban}
                                                onChange={handleTransactionId}
                                                name="iban"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="accountNotes">
                                                * We take your privacy seriously. Bank-sensitive data undergoes thorough encryption procedures before being securely stored.
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="accountNotes"
                                                rows="3"
                                                placeholder="Enter notes"
                                                value={accountDetail.accountNotes}
                                                onChange={handleTransactionId}
                                                name="accountNotes"
                                            />
                                        </div>
                                    </form>
                                ) : (
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="cardNumber">Card Number</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                                                id="cardNumber"
                                                placeholder="Enter card number"
                                                value={formData.cardNumber}
                                                onChange={handleChange}
                                                name="cardNumber"
                                            />
                                            {errors.cardNumber && (
                                                <div className="invalid-feedback">{errors.cardNumber}</div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cardHolder">Card Holder</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.cardHolder ? 'is-invalid' : ''}`}
                                                id="cardHolder"
                                                placeholder="Enter card holder name"
                                                value={formData.cardHolder}
                                                onChange={handleChange}
                                                name="cardHolder"
                                            />
                                            {errors.cardHolder && (
                                                <div className="invalid-feedback">{errors.cardHolder}</div>
                                            )}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="expiryDate">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                                                    id="expiryDate"
                                                    placeholder="MM/YY"
                                                    value={formData.expiryDate}
                                                    onChange={handleChange}
                                                    name="expiryDate"
                                                />
                                                {errors.expiryDate && (
                                                    <div className="invalid-feedback">{errors.expiryDate}</div>
                                                )}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="cvv">CVV</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                                                    id="cvv"
                                                    placeholder="CVV"
                                                    value={formData.cvv}
                                                    onChange={handleChange}
                                                    name="cvv"
                                                />
                                                {errors.cvv && (
                                                    <div className="invalid-feedback">{errors.cvv}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="creditCardNotes">
                                                * We take your privacy seriously. Bank-sensitive data undergoes thorough encryption procedures before being securely stored.
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="creditCardNotes"
                                                rows="3"
                                                placeholder="Enter notes"
                                                value={accountDetail.accountNotes}
                                                onChange={handleTransactionId}
                                                name="accountNotes"
                                            />
                                        </div>
                                    </form>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeDeposit}
                                    disabled={isDisable}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={activeBankOption ? addAccount : handleSubmit}
                                    disabled={isDisable}
                                >
                                    {isDisable ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ) : (
                                        "Add Payment Method"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>

    );
};

export default PaymentMethods;
