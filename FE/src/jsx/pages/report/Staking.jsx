import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SVGICON } from '../../constant/theme';
import Bitcoin from "../../../assets/images/img/btc.svg"
import EthLogo from "../../../assets/images/img/eth.svg"
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { createUserTransactionApi, getCoinsUserApi, getsignUserApi, getUserCoinApi } from '../../../Api/Service';
import axios from 'axios';
import { Button, Card, Col, Form, DropdownDivider, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';


const Staking = () => {

    const [activeDurationBtc, setActiveDurationBtc] = useState(30);
    const [activeDurationEth, setActiveDurationEth] = useState(30);
    const [activeDurationUsdt, setActiveDurationUsdt] = useState(30);
    const [isLoading, setisLoading] = useState(true);
    const [isDisable, setisDisable] = useState(false);
    const [liveBtc, setliveBtc] = useState(null);
    const [UserTransactions, setUserTransactions] = useState([]);

    const [btcBalance, setbtcBalance] = useState(0);
    const [UserData, setUserData] = useState(true);
    const [fractionBalance, setfractionBalance] = useState("00");
    const [ethBalance, setethBalance] = useState(0);
    const [usdtBalance, setusdtBalance] = useState(0);

    const activeBtc = (duration) => {
        setActiveDurationBtc(duration);
    };
    const activeEth = (duration) => {
        setActiveDurationEth(duration);
    };
    const activeUsdt = (duration) => {
        setActiveDurationUsdt(duration);
    };

    const getCoins = async (data) => {
        let id = data._id;
        try {
            // const response = await axios.get(
            //     "https://api.coindesk.com/v1/bpi/currentprice.json"
            // );
            const userCoins = await getCoinsUserApi(id);

            if (userCoins.success) {
                setUserData(userCoins.getCoin);
                // setUserTransactions;
                let val = 0;
                if (userCoins && userCoins.btcPrice && userCoins.btcPrice.quote && userCoins.btcPrice.quote.USD) {

                    val = userCoins.btcPrice.quote.USD.price
                } else {
                    val = 96075.25
                }
                console.log("val: ", val);
                setliveBtc(val);
                console.log("userCoins.success: ", userCoins.success);
                setisLoading(false);
                // tx
                const btc = userCoins.getCoin.transactions.filter((transaction) =>
                    transaction.trxName.includes("bitcoin")
                );
                const btccomplete = btc.filter((transaction) =>
                    transaction.status.includes("completed")
                );
                let btcCount = 0;
                let btcValueAdded = 0;
                for (let i = 0; i < btccomplete.length; i++) {
                    const element = btccomplete[i];
                    btcCount = element.amount;
                    btcValueAdded += btcCount;
                }
                setbtcBalance(btcValueAdded);
                console.log("btcValueAdded: ", btcValueAdded);
                // tx
                // tx
                const eth = userCoins.getCoin.transactions.filter((transaction) =>
                    transaction.trxName.includes("ethereum")
                );
                const ethcomplete = eth.filter((transaction) =>
                    transaction.status.includes("completed")
                );
                let ethCount = 0;
                let ethValueAdded = 0;
                for (let i = 0; i < ethcomplete.length; i++) {
                    const element = ethcomplete[i];
                    ethCount = element.amount;
                    ethValueAdded += ethCount;
                }
                setethBalance(ethValueAdded);
                console.log("ethValueAdded: ", ethValueAdded);
                // tx
                // tx
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
                // tx

                const totalValue = (
                    btcValueAdded * liveBtc +
                    ethValueAdded * 2640 +
                    usdtValueAdded
                ).toFixed(2);

                //
                const [integerPart, fractionalPart] = totalValue.split(".");

                const formattedTotalValue = parseFloat(integerPart).toLocaleString(
                    "en-US",
                    {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }
                );

                //
                setfractionBalance(fractionalPart);
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
    const [Active, setActive] = useState(false);
    const [stakingModal, setstakingModal] = useState(false);
    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };
    const [currentCrypto, setCurrentCrypto] = useState(null);
    let toggleStaking = (cryptoType) => {
        if (stakingModal === true) {
            setstakingModal(false);

            setCurrentCrypto(null);
            setAmount("");
        } else {
            setstakingModal(true);

            setCurrentCrypto(cryptoType);
        }
    };

    const authUser = useAuthUser();
    const Navigate = useNavigate();
    const [isUser, setIsUser] = useState({});
    const getsignUser = async () => {
        try {
            const formData = new FormData();
            formData.append("id", authUser().user._id);
            console.log("authUser().user: ", authUser().user);
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
        }
    };
    //

    useEffect(() => {
        getCoins(authUser().user);
        getsignUser();
        if (authUser().user.role === "user") {
            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
    }, []);
    // withdraw
    const handleAmountChange = (e, cryptoName) => {
        const value = e.target.value;

        console.log("e: ", cryptoName);

        // Allow empty value (when all digits are removed)
        if (value === "") {
            setAmount("");
            return;
        }

        // Parse the value to a number
        const numericValue = parseFloat(value);
        if (cryptoName === "bitcoin") {
            if (!isNaN(numericValue)) {
                // If value exceeds btcBalance, set it to btcBalance
                if (numericValue > btcBalance) {
                    setAmount(btcBalance.toString());
                } else {
                    setAmount(value);
                }
            }
            return;
        }
        if (cryptoName === "ethereum") {
            if (!isNaN(numericValue)) {
                // If value exceeds btcBalance, set it to btcBalance
                if (numericValue > ethBalance) {
                    setAmount(ethBalance.toString());
                } else {
                    setAmount(value);
                }
            }
            return;
        }
        if (cryptoName === "tether") {
            if (!isNaN(numericValue)) {
                // If value exceeds btcBalance, set it to btcBalance
                if (numericValue > usdtBalance) {
                    setAmount(usdtBalance.toString());
                } else {
                    setAmount(value);
                }
            }
            return;
        }
        // Check if the value is a valid number
    };
    const [amount, setAmount] = useState("");
    const [parseAmountBtc, setparseAmountBtc] = useState(0);
    const [parsrIntBtc, setparsrIntBtc] = useState(0);
    const [estInterest, setEstInterest] = useState(0);
    useEffect(() => {
        calculateEstInterest();
    }, [amount, activeDurationBtc]);

    const calculateEstInterest = () => {
        let rate;
        switch (activeDurationBtc) {
            case 30:
                rate = 11;
                break;
            case 60:
                rate = 45;
                break;
            case 90:
                rate = 123;
                break;
            default:
                rate = 0;
        }
        const validAmount = parseFloat(amount) || 0;
        const interest = (validAmount * rate) / 100;
        const total = validAmount + interest;
        setEstInterest(interest);
        setparseAmountBtc(parseFloat(validAmount));
        setparsrIntBtc(parseFloat(interest));
    };
    const [parseAmountEth, setparseAmountEth] = useState(0);
    const [parsrIntEth, setparsrIntEth] = useState(0);
    const [estInterestEth, setEstInterestEth] = useState(0);
    useEffect(() => {
        calculateEstInterestEth();
    }, [amount, activeDurationEth]);

    const calculateEstInterestEth = () => {
        let rate;
        switch (activeDurationEth) {
            case 30:
                rate = 11;
                break;
            case 60:
                rate = 45;
                break;
            case 90:
                rate = 123;
                break;
            default:
                rate = 0;
        }
        const validAmount = parseFloat(amount) || 0;
        const interest = (validAmount * rate) / 100;
        const total = validAmount + interest;
        setEstInterestEth(interest);
        setparseAmountEth(parseFloat(validAmount));
        setparsrIntEth(parseFloat(interest));
    };
    const [parseAmountUsdt, setparseAmountUsdt] = useState(0);
    const [parsrIntUsdt, setparsrIntUsdt] = useState(0);
    const [estInterestUsdt, setEstInterestUsdt] = useState(0);
    useEffect(() => {
        calculateEstInterestUsdt();
    }, [amount, activeDurationUsdt]);

    const calculateEstInterestUsdt = () => {
        let rate;
        switch (activeDurationUsdt) {
            case 30:
                rate = 11;
                break;
            case 60:
                rate = 45;
                break;
            case 90:
                rate = 123;
                break;
            default:
                rate = 0;
        }
        const validAmount = parseFloat(amount) || 0;
        const interest = (validAmount * rate) / 100;
        const total = validAmount + interest;
        setEstInterestUsdt(interest);
        setparseAmountUsdt(parseFloat(validAmount));
        setparsrIntUsdt(parseFloat(interest));
    };
    const confirmTransaction = async (depositName) => {
        let e = "crypto";
        if (amount.trim() === "") {
            toast.error("Amount cannot be empty");
            return false;
        }

        // Parse the input to a floating-point number
        const parsedAmount = parseFloat(amount);

        // Check if the parsed amount is not a number
        if (isNaN(parsedAmount)) {
            toast.error("Invalid amount");
            return false;
        }

        // Check if the amount is zero
        if (parsedAmount === 0) {
            toast.error("Amount cannot be zero");
            return false;
        }

        // Check if the amount is negative
        if (parsedAmount < 0) {
            toast.error("Amount cannot be negative");
            return false;
        }

        try {
            setisDisable(true);
            let body;
            if (e == "crypto") {
                body = {
                    trxName: depositName,
                    amount: -parsedAmount,
                    txId: "staking amount",
                    e: e,
                    status: "completed",
                };
                if (!body.trxName || !body.amount || !body.txId) {
                    console.log("body.amount: ", body.amount);
                    console.log("body.trxName: ", body.trxName);
                    toast.dismiss();
                    toast.error("Fill all the required fields");
                    return;
                }
            }

            let id = authUser().user._id;
            console.log("e: ", e);

            const newTransaction = await createUserTransactionApi(id, body);

            if (newTransaction.success) {
                toast.dismiss();
                toast.success("Staking completed successfully");

                setstakingModal(false);

                getCoins(authUser().user);
                setCurrentCrypto(null);
                setAmount("");
            } else {
                toast.dismiss();
                toast.error(newTransaction.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisable(false);
            getTransactions()
        }
    };
    const getTransactions = async () => {
        try {
            // const response = await axios.get(
            //     "https://api.coindesk.com/v1/bpi/currentprice.json"
            // );
            const allTransactions = await getUserCoinApi(authUser().user._id);
            if (allTransactions.success) {
                console.log('allTransactions: ', allTransactions);
                setUserTransactions(allTransactions.getCoin.transactions.reverse());

                return;
            } else {
                toast.dismiss();
                toast.error(allTransactions.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisLoading(false);
        }
    };
    useEffect(() => {
        getTransactions()

    }, []);
    //
    return (
        <>
            <div className="row">
                <div className="col-xxl-12">
                    <div className="card">
                        <Card.Header>
                            <Card.Title>Assets</Card.Title>
                        </Card.Header>
                        <div className="card-body">
                            <div className="MuiStack-root css-jddaxh">
                                <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-4 css-1tz8m30">
                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-6 MuiGrid-grid-md-4 css-i9p3im">
                                        <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-l43idd">
                                            <div className="MuiCardContent-root css-1dzn5ey">
                                                <div className="MuiStack-root css-jelo4q">
                                                    <div className="MuiAvatar-root MuiAvatar-circular css-1m3w9oh">
                                                        <img
                                                            src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png"
                                                            className="MuiAvatar-img css-1hy9t21"
                                                        />
                                                    </div>
                                                    <h6 className="MuiTypography-root MuiTypography-h6 css-ow70wi">
                                                        Staking Bitcoin
                                                    </h6>
                                                </div>
                                                <p className="MuiTypography-root MuiTypography-body2 css-1jorj1k">
                                                    DURATION
                                                </p>
                                                <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2 css-krtfz2">
                                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 css-kdq3hv">
                                                        <div
                                                            onClick={() => activeBtc(30)}
                                                            className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root   ${activeDurationBtc === 30
                                                                ? "css-qy35p"
                                                                : "css-18xyzlx"
                                                                }`}
                                                        >
                                                            <span className="MuiTypography-root MuiTypography-caption css-50upxb">
                                                                30 Days
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 css-kdq3hv">
                                                        <div
                                                            onClick={() => activeBtc(60)}
                                                            className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root  ${activeDurationBtc === 60
                                                                ? "css-qy35p"
                                                                : "css-18xyzlx"
                                                                }`}
                                                        >
                                                            <span className="MuiTypography-root MuiTypography-caption css-50upxb">
                                                                60 Days
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 css-kdq3hv">
                                                        <div
                                                            onClick={() => activeBtc(90)}
                                                            className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root  ${activeDurationBtc === 90
                                                                ? "css-qy35p"
                                                                : "css-18xyzlx"
                                                                }`}
                                                        >
                                                            <span className="MuiTypography-root MuiTypography-caption css-50upxb">
                                                                90 Days
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="MuiStack-root css-9npne8">
                                                    <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                        Tap Stake to see your reward
                                                    </span>
                                                </div>
                                                <div className="MuiStack-root css-j0iiqq">
                                                    <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                        Min Value
                                                    </span>
                                                    <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                        0.0117769844 BTC
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => toggleStaking("btc")}
                                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1j9kn1e"
                                                    tabIndex={0}
                                                    type="button"
                                                >
                                                    Stake
                                                    <span className="MuiTouchRipple-root css-w0pj6f" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-6 MuiGrid-grid-md-4 css-i9p3im">
                                        <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-l43idd">
                                            <div className="MuiCardContent-root css-1dzn5ey">
                                                <div className="MuiStack-root css-jelo4q">
                                                    <div className="MuiAvatar-root MuiAvatar-circular css-1m3w9oh">
                                                        <img
                                                            src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png"
                                                            className="MuiAvatar-img css-1hy9t21"
                                                        />
                                                    </div>
                                                    <h6 className="MuiTypography-root MuiTypography-h6 css-ow70wi">
                                                        Staking Ethereum
                                                    </h6>
                                                </div>
                                                <p className="MuiTypography-root MuiTypography-body2 css-1jorj1k">
                                                    DURATION
                                                </p>
                                                <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2 css-krtfz2">
                                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 css-kdq3hv">
                                                        <div
                                                            onClick={() => activeEth(30)}
                                                            className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root   ${activeDurationEth === 30
                                                                ? "css-qy35p"
                                                                : "css-18xyzlx"
                                                                }`}
                                                        >
                                                            <span className="MuiTypography-root MuiTypography-caption css-50upxb">
                                                                30 Days
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 css-kdq3hv">
                                                        <div
                                                            onClick={() => activeEth(60)}
                                                            className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root  ${activeDurationEth === 60
                                                                ? "css-qy35p"
                                                                : "css-18xyzlx"
                                                                }`}
                                                        >
                                                            <span className="MuiTypography-root MuiTypography-caption css-50upxb">
                                                                60 Days
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 css-kdq3hv">
                                                        <div
                                                            onClick={() => activeEth(90)}
                                                            className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root  ${activeDurationEth === 90
                                                                ? "css-qy35p"
                                                                : "css-18xyzlx"
                                                                }`}
                                                        >
                                                            <span className="MuiTypography-root MuiTypography-caption css-50upxb">
                                                                90 Days
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="MuiStack-root css-9npne8">
                                                    <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                        Tap Stake to see your reward
                                                    </span>
                                                </div>
                                                <div className="MuiStack-root css-j0iiqq">
                                                    <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                        Min Value
                                                    </span>
                                                    <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                        0.1969969781 ETH
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => toggleStaking("eth")}
                                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1j9kn1e"
                                                    tabIndex={0}
                                                    type="button"
                                                >
                                                    Stake
                                                    <span className="MuiTouchRipple-root css-w0pj6f" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-6 MuiGrid-grid-md-4 css-i9p3im">
                                        <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-l43idd">
                                            <div className="MuiCardContent-root css-1dzn5ey">
                                                <div className="MuiStack-root css-jelo4q">
                                                    <div className="MuiAvatar-root MuiAvatar-circular css-1m3w9oh">
                                                        <img
                                                            src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/usdt.png"
                                                            className="MuiAvatar-img css-1hy9t21"
                                                        />
                                                    </div>
                                                    <h6 className="MuiTypography-root MuiTypography-h6 css-ow70wi">
                                                        Staking Tether USDT
                                                    </h6>
                                                </div>
                                                <p className="MuiTypography-root MuiTypography-body2 css-1jorj1k">
                                                    DURATION
                                                </p>
                                                <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2 css-krtfz2">
                                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 css-kdq3hv">
                                                        <div
                                                            onClick={() => activeUsdt(30)}
                                                            className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root   ${activeDurationUsdt === 30
                                                                ? "css-qy35p"
                                                                : "css-18xyzlx"
                                                                }`}
                                                        >
                                                            <span className="MuiTypography-root MuiTypography-caption css-50upxb">
                                                                30 Days
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 css-kdq3hv">
                                                        <div
                                                            onClick={() => activeUsdt(60)}
                                                            className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root  ${activeDurationUsdt === 60
                                                                ? "css-qy35p"
                                                                : "css-18xyzlx"
                                                                }`}
                                                        >
                                                            <span className="MuiTypography-root MuiTypography-caption css-50upxb">
                                                                60 Days
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 css-kdq3hv">
                                                        <div
                                                            onClick={() => activeUsdt(90)}
                                                            className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root  ${activeDurationUsdt === 90
                                                                ? "css-qy35p"
                                                                : "css-18xyzlx"
                                                                }`}
                                                        >
                                                            <span className="MuiTypography-root MuiTypography-caption css-50upxb">
                                                                90 Days
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="MuiStack-root css-9npne8">
                                                    <span className="MuiTypography-root text-center MuiTypography-caption css-1canfvu">
                                                        Tap Stake to see your reward
                                                    </span>
                                                </div>
                                                <div className="MuiStack-root css-j0iiqq">
                                                    <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                        Min Value
                                                    </span>
                                                    <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                        500.3001801081 USDT
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => toggleStaking("usdt")}
                                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1j9kn1e"
                                                    tabIndex={0}
                                                    type="button"
                                                >
                                                    Stake
                                                    <span className="MuiTouchRipple-root css-w0pj6f" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-x-12">
                    <div className="card">
                        <Card.Header>
                            <Card.Title>Staking Rewards</Card.Title>
                        </Card.Header>
                        <div className="card-body">
                            {isLoading ? (
                                <div className="text-center my-5">
                                    <Spinner animation="border" variant="primary" />
                                    <h4 className="mt-3"> Loading...</h4>
                                </div>
                            ) : (

                                <>
                                    <div className="d-grid gap-4">
                                        {UserTransactions &&
                                            UserTransactions.filter(Transaction => !Transaction.isHidden && Transaction.txId === "staking amount")
                                                .map((Transaction, index) => (
                                                    <Card
                                                        key={index}
                                                        className="transaction-card border-0 shadow-sm rounded-3 transition-all duration-300"
                                                    >
                                                        <Card.Body className="p-3">
                                                            <Row className="align-items-center">

                                                                <Col>
                                                                    <Card.Title as="h6" className="mb-1">
                                                                        {Transaction.trxName}{' '}
                                                                        <small className="transaction-status">({Transaction.status})</small>
                                                                    </Card.Title>
                                                                    <Card.Text className="mb-1 transaction-amount">
                                                                        {Math.abs(Transaction.amount).toFixed(8)}{' '}
                                                                        <small>
                                                                            {Transaction.type === 'deposit' ? (
                                                                                <td className="text-success font-w600">{`($${Transaction.trxName === 'bitcoin'
                                                                                    ? (Transaction.amount * liveBtc).toFixed(2)
                                                                                    : Transaction.trxName === 'ethereum'
                                                                                        ? (Transaction.amount * 2640).toFixed(2)
                                                                                        : Transaction.trxName === 'tether'
                                                                                            ? Transaction.amount.toFixed(2)
                                                                                            : (0).toFixed(2)
                                                                                    })`}</td>
                                                                            ) : Transaction.type === 'withdraw' ? (
                                                                                <td className="text-danger font-w600"> {`($${Transaction.trxName === 'bitcoin'
                                                                                    ? Math.abs((Transaction.amount * liveBtc)).toFixed(2)
                                                                                    : Transaction.trxName === 'ethereum'
                                                                                        ? Math.abs((Transaction.amount * 2640)).toFixed(2)
                                                                                        : Transaction.trxName === 'tether'
                                                                                            ? Math.abs(Transaction.amount).toFixed(2)
                                                                                            : (0).toFixed(2)
                                                                                    })`}</td>
                                                                            ) : null}
                                                                        </small>
                                                                    </Card.Text>
                                                                    <Card.Text className="transaction-date d-md-none">
                                                                        At: {new Date(Transaction.createdAt).toLocaleString()}
                                                                    </Card.Text>
                                                                </Col>
                                                                <Col xs="auto" className="d-flex align-items-center">
                                                                    <Card.Text className="me-3 mb-0 transaction-date d-none d-md-block">
                                                                        At: {new Date(Transaction.createdAt).toLocaleString()}
                                                                    </Card.Text>

                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                ))}

                                    </div>
                                    {UserTransactions.length === 0 ? (
                                        <div>
                                            <div>
                                                <div className="flex min-h-[400px] items-center justify-center">
                                                    <div className="mx-auto w-full text-center max-w-xs">
                                                        <div className="mx-auto max-w-xs new">
                                                            {/* <img
                                      className="block dark:hidden"
                                      src={searcH}
                                      alt="Placeholder image"
                                    />
                                    <img
                                      className="hidden dark:block"
                                      src={searcH}
                                      alt="Placeholder image"
                                    /> */}
                                                        </div>
                                                        <div className="mx-auto max-w-sm">
                                                            <h4 className="font-heading text-xl font-medium leading-normal leading-normal text-muted-800 mb-1 mt-4 dark:text-white">
                                                                No staking found
                                                            </h4>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/**/}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {stakingModal && (
                <div
                    role="presentation"
                    className="MuiDialog-root MuiModal-root css-126xj0f"
                >
                    <div
                        aria-hidden="true"
                        className="MuiBackdrop-root MuiModal-backdrop css-1p6v7w1"
                        style={{
                            opacity: 1,
                            transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        }}
                    />
                    <div tabIndex={0} data-testid="sentinelStart" />
                    <div
                        className="MuiDialog-container MuiDialog-scrollPaper css-ekeie0"
                        role="presentation"
                        tabIndex={-1}
                        style={{
                            opacity: 1,
                            transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        }}
                    >
                        <div
                            className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-maa7c0"
                            role="dialog"
                            aria-labelledby=":r2:"
                        >
                            <h2
                                className="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-19d9fw5"
                                id=":r2:"
                            >
                                Stake
                                <button
                                    className="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-inqsmp"
                                    tabIndex={0}
                                    onClick={toggleStaking}
                                    type="button"
                                >
                                    <svg
                                        className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv"
                                        focusable="false"
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        data-testid="CloseIcon"
                                    >
                                        <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                    <span className="MuiTouchRipple-root css-w0pj6f" />
                                </button>
                            </h2>
                            <div className="MuiDialogContent-root css-z83ub">
                                {currentCrypto === "btc" ? (
                                    <form>
                                        <div className="MuiStack-root css-36lwkk">
                                            <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-1lnu8xy">
                                                <label
                                                    className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined css-58zb7v"
                                                    data-shrink="false"
                                                    htmlFor=":r3:"
                                                    id=":r3:-label"
                                                ></label>
                                                <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1a4ax0g">
                                                    <input
                                                        aria-invalid="false"
                                                        aria-describedby=":r3:-helper-text"
                                                        id=":r3:"
                                                        name="amount"
                                                        placeholder="Locked Amount"
                                                        type="text"
                                                        className="MuiInputBase-input MuiOutlinedInput-input css-f0guyy"
                                                        value={amount}
                                                        onChange={(e) => handleAmountChange(e, "bitcoin")}
                                                    />
                                                    <fieldset
                                                        aria-hidden="true"
                                                        className="MuiOutlinedInput-notchedOutline css-100o8dq"
                                                    >
                                                        <legend className="css-yjsfm1">
                                                            <span>Locked Amount</span>
                                                        </legend>
                                                    </fieldset>
                                                </div>
                                                <p
                                                    className="MuiFormHelperText-root MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-126giv0"
                                                    id=":r3:-helper-text"
                                                >
                                                    Total Balance{" "}
                                                    {`${btcBalance.toFixed(8)} (${(
                                                        btcBalance * liveBtc
                                                    ).toFixed(2)} USD)`}{" "}
                                                    BTC
                                                </p>
                                            </div>
                                            <div className="MuiStack-root css-9npne8">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Rate
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {activeDurationBtc === 30
                                                        ? "11%"
                                                        : activeDurationBtc === 60
                                                            ? "45%"
                                                            : activeDurationBtc === 90
                                                                ? "123%"
                                                                : "..."}{" "}
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Min Value
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    0.0117769844 BTC
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Est. Interest
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {estInterest.toFixed(8)} BTC
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Total Amount
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {(parseAmountBtc + parsrIntBtc).toFixed(8)} BTC
                                                </span>
                                            </div>
                                            <button
                                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1j9kn1e"
                                                tabIndex={0}
                                                onClick={() => confirmTransaction("bitcoin")}
                                                type="button"
                                            >
                                                {isDisable ? (
                                                    <div>
                                                        <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        Stake
                                                        <span className="MuiTouchRipple-root css-w0pj6f" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : currentCrypto === "eth" ? (
                                    <form>
                                        <div className="MuiStack-root css-36lwkk">
                                            <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-1lnu8xy">
                                                <label
                                                    className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined css-58zb7v"
                                                    data-shrink="false"
                                                    htmlFor=":r3:"
                                                    id=":r3:-label"
                                                ></label>
                                                <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1a4ax0g">
                                                    <input
                                                        aria-invalid="false"
                                                        aria-describedby=":r3:-helper-text"
                                                        id=":r3:"
                                                        name="amount"
                                                        placeholder="Locked Amount"
                                                        type="text"
                                                        className="MuiInputBase-input MuiOutlinedInput-input css-f0guyy"
                                                        value={amount}
                                                        onChange={(e) => handleAmountChange(e, "ethereum")}
                                                    />
                                                    <fieldset
                                                        aria-hidden="true"
                                                        className="MuiOutlinedInput-notchedOutline css-100o8dq"
                                                    >
                                                        <legend className="css-yjsfm1">
                                                            <span>Locked Amount</span>
                                                        </legend>
                                                    </fieldset>
                                                </div>
                                                <p
                                                    className="MuiFormHelperText-root MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-126giv0"
                                                    id=":r3:-helper-text"
                                                >
                                                    {isLoading ? (
                                                        "..."
                                                    ) : (
                                                        <>
                                                            {`${ethBalance.toFixed(8)} (${(
                                                                ethBalance * 2640
                                                            ).toFixed(2)} USD)`}{" "}
                                                            ETH
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="MuiStack-root css-9npne8">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Rate
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {activeDurationEth === 30
                                                        ? "11%"
                                                        : activeDurationEth === 60
                                                            ? "45%"
                                                            : activeDurationEth === 90
                                                                ? "123%"
                                                                : "..."}
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Min Value
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    0.1969969781 ETH
                                                </span>
                                            </div>

                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Est. Interest
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {estInterestEth.toFixed(8)} ETH
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Total Amount
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {(parseAmountEth + parsrIntEth).toFixed(8)} ETH
                                                </span>
                                            </div>
                                            <button
                                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1j9kn1e"
                                                tabIndex={0}
                                                onClick={() => confirmTransaction("ethereum")}
                                                type="button"
                                            >
                                                {isDisable ? (
                                                    <div>
                                                        <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        Stake
                                                        <span className="MuiTouchRipple-root css-w0pj6f" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : currentCrypto === "usdt" ? (
                                    <form>
                                        <div className="MuiStack-root css-36lwkk">
                                            <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-1lnu8xy">
                                                <label
                                                    className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined css-58zb7v"
                                                    data-shrink="false"
                                                    htmlFor=":r3:"
                                                    id=":r3:-label"
                                                ></label>
                                                <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1a4ax0g">
                                                    <input
                                                        aria-invalid="false"
                                                        aria-describedby=":r3:-helper-text"
                                                        id=":r3:"
                                                        name="amount"
                                                        placeholder="Locked Amount"
                                                        type="text"
                                                        className="MuiInputBase-input MuiOutlinedInput-input css-f0guyy"
                                                        value={amount}
                                                        onChange={(e) => handleAmountChange(e, "tether")}
                                                    />
                                                    <fieldset
                                                        aria-hidden="true"
                                                        className="MuiOutlinedInput-notchedOutline css-100o8dq"
                                                    >
                                                        <legend className="css-yjsfm1">
                                                            <span>Locked Amount</span>
                                                        </legend>
                                                    </fieldset>
                                                </div>
                                                <p
                                                    className="MuiFormHelperText-root MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-126giv0"
                                                    id=":r3:-helper-text"
                                                >
                                                    {isLoading ? (
                                                        "..."
                                                    ) : (
                                                        <>
                                                            Total Balance{" "}
                                                            {`${usdtBalance.toFixed(
                                                                8
                                                            )} (${usdtBalance.toFixed(2)} USD)`}{" "}
                                                            USDT
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="MuiStack-root css-9npne8">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Rate
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {activeDurationUsdt === 30
                                                        ? "11%"
                                                        : activeDurationUsdt === 60
                                                            ? "45%"
                                                            : activeDurationUsdt === 90
                                                                ? "123%"
                                                                : "..."}
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Min Value
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    500.3001801081 USDT
                                                </span>
                                            </div>

                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Est. Interest
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {estInterestUsdt.toFixed(2)} USDT
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    Total Amount
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {(parseAmountUsdt + parsrIntUsdt).toFixed(8)} USDT
                                                </span>
                                            </div>
                                            <button
                                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1j9kn1e"
                                                tabIndex={0}
                                                onClick={() => confirmTransaction("tether")}
                                                type="button"
                                            >
                                                {isDisable ? (
                                                    <div>
                                                        <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        Stake
                                                        <span className="MuiTouchRipple-root css-w0pj6f" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                    <div tabIndex={0} data-testid="sentinelEnd" />
                </div>
            )}

        </>

    );
};

export default Staking;
