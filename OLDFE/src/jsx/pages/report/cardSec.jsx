
import './CryptoCard.css';
import UsdtLogo from '../../../assets/images/usdt.png';
import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { applyCreditCardApi, getCoinsUserApi, getLinksApi, getsignUserApi, getUserCoinApi } from '../../../Api/Service';
const CryptoCard = () => {

    const [isLoading, setisLoading] = useState(true);
    const [usdtBalance, setusdtBalance] = useState(null);
    const [isDisable, setisDisable] = useState(false);
    const [isCardDetails, setisCardDetails] = useState(false);
    const [secLoading, setsecLoading] = useState(true);

    const authUser = useAuthUser();
    const Navigate = useNavigate();
    const [isUser, setIsUser] = useState({});
    const fetchLinks = async () => {
        try {
            const data = await getLinksApi();
            console.log('data: ', data);

            if (data?.links[0]?.enabled) {

                setsecLoading(false)
            } else {
                Navigate(-1);
            }
        } catch (error) {
            console.error("Error fetching links:", error);
        }
    };
    const getsignUser = async () => {
        setisLoading(true)
        try {
            const formData = new FormData();
            formData.append("id", authUser().user._id);
            console.log("authUser().user: ", authUser().user);
            const userCoins = await getsignUserApi(formData);
            console.log('userCoins: ', userCoins);

            if (userCoins.success) {
                setIsUser(userCoins.signleUser);
                console.log('userCoins.signleUser: ', userCoins.signleUser);

                setisLoading(false)
                return;
            } else {
                toast.dismiss();
                toast.error(userCoins.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
        }
    };
    //

    useEffect(() => {
        getsignUser();
        if (authUser().user.role === "user") {

            getCoins(authUser().user);
            fetchLinks()
            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
    }, []);
    // withdraw


    const applyCard = async () => {


        try {
            setisDisable(true);

            let body = {
                userId: authUser().user._id,
                type: "card_request",
                status: "applied",

            };




            const cardRequest = await applyCreditCardApi(body);

            if (cardRequest.success) {
                toast.dismiss();
                toast.success("Card Applied Successfully");
                setIsUser(prev => ({
                    ...prev,
                    cryptoCard: { status: "applied" }
                }));

            } else {
                toast.dismiss();
                toast.error(cardRequest.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {

            setisDisable(false);
        }
    };

    //

    const formatCardNumber = (number) => {
        if (!number) return "•••• •••• •••• ••••";

        const stringNumber = number.toString().replace(/\D/g, '');

        if (stringNumber.length !== 16) return "Invalid Card Number";

        return stringNumber.replace(/(.{4})/g, '$1 ').trim();
    };

    const getCoins = async (data) => {
        let id = data._id;
        try {
            // const response = await axios.get(
            //     "https://api.coindesk.com/v1/bpi/currentprice.json"
            // );
            const userCoins = await getCoinsUserApi(id);
            console.log('usdtntt: ', userCoins);

            if (userCoins.success) {
                // setUserTransactions;

                setisLoading(false);

                const usdt = userCoins.getCoin.transactions.filter((transaction) =>
                    transaction.trxName.includes("tether")
                );
                const usdtcomplete = usdt.filter((transaction) =>
                    transaction.status.includes("completed")
                );
                let usdtCount = 0;
                let usdtValueAdded = 0;
                for (let i = 0; i < usdtcomplete.length; i++) {
                    const element = usdtcomplete[i];
                    usdtCount = element.amount;
                    usdtValueAdded += usdtCount;
                }
                setusdtBalance(usdtValueAdded);





                return;
            } else {
                toast.dismiss();
                toast.error(userCoins.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
        }
    };
    return (
        <>
            {isLoading || secLoading ?

                <div className="crypto-card skeleton">
                    <div className="crypto-card-header">
                        <div className="skeleton-box logo"></div> {/* Logo Placeholder */}
                        <span className="skeleton-box small crypto-balance"> </span>
                    </div>
                    <div className="crypto-card-body">
                        <div className="skeleton-box text"></div> {/* Apply Now Placeholder */}
                        <div className="crypto-card-footer">
                            <div className="skeleton-box small"></div> {/* Card Holder Placeholder */}
                            <div className="skeleton-box small"></div> {/* Expiry Placeholder */}
                        </div>
                    </div>
                </div>
                : !isUser.cryptoCard?.status || isUser.cryptoCard?.status === "inactive" ?
                    <div className="crypto-card">
                        <div className="crypto-card-header">
                            <img src={UsdtLogo} alt="USDT Logo" className="crypto-logo" />
                            <span className="crypto-balance">  ******</span>
                        </div>
                        <div className="crypto-card-body">
                            <button className="crypto-card-number cc-button" disabled={isDisable} style={{ color: "white", border: "1px solid white" }} onClick={applyCard}>Apply Now</button>
                            <div className="crypto-card-footer"  >
                                <span className="crypto-card-holder">**** **** </span>
                                <span className="crypto-card-expiry">EXP: **/**</span>
                            </div>
                        </div>
                    </div>

                    : isUser.cryptoCard?.status === "applied" ? <div className="crypto-card">
                        <div className="crypto-card-header">
                            <img src={UsdtLogo} alt="USDT Logo" className="crypto-logo" />
                            <span className="crypto-balance">  ******</span>
                        </div>
                        <div className="crypto-card-body">
                            <p className="crypto-card-number">Applied</p>
                            <div className="crypto-card-footer"  >
                                <span className="crypto-card-holder">**** **** </span>
                                <span className="crypto-card-expiry">EXP: **/**</span>
                            </div>
                        </div>
                    </div> : isUser.cryptoCard?.status === "active" ?

                        <>
                            <div className="crypto-card">
                                <div className="crypto-card-header">
                                    <img src={UsdtLogo} alt="USDT Logo" className="crypto-logo" />
                                    <span className="crypto-balance">{usdtBalance !== null && usdtBalance !== undefined
                                        ? Number(usdtBalance).toLocaleString()
                                        : '...'}{' '}
                                        USDT
                                    </span>

                                </div>
                                <div className="crypto-card-body">
                                    <p className="crypto-card-number">
                                        {isCardDetails
                                            ? formatCardNumber(isUser.cryptoCard?.cardNumber)
                                            : "•••• •••• •••• ••••"}

                                    </p>
                                    <div className="crypto-card-footer">
                                        <span className="crypto-card-holder">
                                            {isCardDetails ? isUser.cryptoCard?.cardName : "•••• ••••"}
                                        </span>
                                        <span className="crypto-card-expiry">
                                            EXP: {isCardDetails ? isUser.cryptoCard?.Exp : "**/**"}
                                        </span>
                                    </div>
                                    <div className="crypto-card-footer-2">
                                        <span className="crypto-card-holder">
                                            CVV: {isCardDetails ? isUser.cryptoCard?.cvv : "***"}
                                        </span>
                                    </div>

                                </div>
                            </div>
                            <div className="rev-btn">
                                <button className="reveal-button"

                                    onClick={() => setisCardDetails(!isCardDetails)}
                                >
                                    {isCardDetails ? "Hide Details" : "Show Details"}
                                </button>
                            </div>
                            <div className="card-term">
                                <h2>General Terms of Use and Restrictions</h2>
                                <p>Use of our crypto-based credit card services is subject to applicable laws and our internal policies. By using our services, you agree not to engage in fraudulent, illegal, or prohibited activities, including but not limited to money laundering, terrorism financing, or unauthorized transactions. Users must be at least 18 years old and comply with all identity verification requirements. We reserve the right to modify or restrict access to our services at our sole discretion.</p>
                            </div>
                        </> : ""

            }

        </>
    );
};

export default CryptoCard;