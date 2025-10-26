import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { createUserTransactionApi, getCoinsUserApi, getsignUserApi, getUserCoinApi } from '../../../Api/Service';
import { SVGICON } from '../../constant/theme';
import Bitcoin from "../../../assets/images/img/btc.svg"
import logoHead from "../../../assets/header.jpg"
import EthLogo from "../../../assets/images/img/eth.svg"
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import axios from 'axios';
import { Button, Card, Col, Form, DropdownDivider, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';


const LetterSec = () => {

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
            {/* <div className="row">
                <div className="col-xxl-12">
                    <div className="card">

                        <div className="card-body">
                            <div className="max-w-2xl mx-auto p-6   bg-white">
                              
                                <div className="mb-6 text-center">
                                    <img style={{ width: "300px" }} src={logoHead} alt="Header" className="w-full h-32 object-cover rounded-lg" />
                                </div>
 
                                <br />
                                <br />
                                <div className="text-lg text-gray-800 mb-6">
                                    <p>Dear <span className="font-semibold">{"clientName"}</span>,</p>

                                    <p className="mt-4">We appreciate your business and look forward to serving you again in the future. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum officia blanditiis soluta quis. Architecto delectus accusamus eum molestias quisquam placeat ipsa, possimus, quos cumque impedit atque! Natus enim molestias reprehenderit neque numquam fugiat officia suscipit voluptates eligendi hic, amet voluptate aliquam modi voluptatem, cum saepe officiis laboriosam dignissimos inventore quam facere aliquid quidem doloremque assumenda! Quae, corporis ad dignissimos perspiciatis quis esse amet dicta natus, non a accusantium sed vero neque adipisci eum dolor illo voluptatem consequatur laudantium fuga. Nam ipsa molestiae facilis sequi reprehenderit perspiciatis saepe soluta? Ratione quaerat nisi ducimus quas id sequi iure natus laborum, eius iusto tenetur corrupti, eligendi, voluptatum dolor. Odit laudantium et debitis, voluptas rerum eos excepturi quidem blanditiis dolor. Eum incidunt perferendis porro qui odit deserunt. Quos soluta molestias delectus architecto itaque atque maxime voluptatibus distinctio deserunt unde laudantium, culpa, corrupti iure in praesentium dicta magni laborum? Esse, ipsum incidunt minima rerum ea minus, reiciendis quam harum enim quos deleniti aut doloribus iusto impedit necessitatibus adipisci delectus distinctio perferendis alias voluptates eius laudantium error! Iure iste nulla, sit reiciendis animi mollitia quos consequatur saepe earum excepturi illum a laudantium similique quasi. Mollitia reprehenderit doloribus natus accusamus atque. Ab fugit nostrum excepturi sequi sint soluta possimus iste ea, officiis iure obcaecati quasi placeat laboriosam et illum dolorem magnam at. Ullam necessitatibus ipsam voluptatibus repellendus odit sit, minus porro eligendi sint id, numquam labore, harum pariatur? Dolore quas ipsa doloremque dignissimos beatae quidem sit nobis, dolorum iste rem quis, ducimus culpa excepturi nemo voluptate maxime deserunt consectetur fuga autem molestiae? A accusamus cupiditate rem veniam nulla, obcaecati soluta reiciendis sit. Eius voluptatum laboriosam deleniti explicabo sed facilis odit accusantium similique rerum ut minus distinctio praesentium tempore corporis modi nulla optio, ipsa sunt incidunt! Totam asperiores suscipit deserunt architecto eaque laborum sunt sed itaque iusto porro et magnam ipsam quasi vitae sapiente, voluptatum animi fugit natus quo, provident laboriosam! Sit pariatur dolore error nulla doloremque, neque doloribus tempora quaerat, corporis repellat porro. Laudantium dolorum repellendus dolores eius eos facilis rem ut unde natus, iusto tempore vitae aspernatur delectus fuga quasi ipsum ea beatae doloribus, praesentium harum consectetur qui. Hic veritatis minus similique nostrum quis. Recusandae neque a, reiciendis officia dolorem enim dicta sequi voluptatem, aut hic, accusantium ipsum aperiam laborum unde corrupti beatae. Dolor, beatae omnis? Fuga deleniti ea modi ex fugit aut quod quibusdam fugiat illo odio, consequatur sed iure veniam repellat iusto atque magnam minima? Quos reprehenderit laboriosam laudantium neque! Excepturi blanditiis quas nam explicabo voluptatem esse voluptas incidunt nemo aspernatur tenetur, numquam temporibus nesciunt omnis consequuntur veniam quaerat! Porro dolores tempore doloremque fugiat esse? Non dolorem nemo alias eligendi beatae porro quod illo praesentium, tempora rem quibusdam quasi eaque vero asperiores architecto! Officiis eligendi omnis aliquam voluptatum quidem, iure dolore doloribus cumque. Eligendi praesentium maiores vel veniam et fugiat, nam iste aut possimus suscipit blanditiis commodi dignissimos ducimus sit qui at adipisci est autem. Magni, ad nesciunt! Harum quis temporibus quibusdam doloribus, in veritatis tenetur vel tempore esse, corporis nihil commodi suscipit autem.</p>
                                    <p className="mt-4">Please feel free to reach out if you have any questions.</p>
                                </div>
 
                                <div className="mt-6 text-center">
                                    <img src={"signatureImage"} alt="Signature" className="w-48 mx-auto" />
                                    <p className="text-sm text-gray-600 mt-2">Authorized Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div> */}
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

export default LetterSec;
