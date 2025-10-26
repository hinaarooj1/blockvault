import React, { useContext, useEffect, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import Truncate from "react-truncate-inside";
import Select from 'react-select';
import btcLogo from "../../../assets/images/img/btc-logo.svg";
import ethLogo from "../../../assets/images/img/ethereum-logo.svg";
import BNBcoin from '../../../assets/images/new/bnb.png';
import Coin1 from '../../../assets/images/new/1.png';
import Coin2 from '../../../assets/images/new/2.png';
import Coin3 from '../../../assets/images/new/3.png';
import Coin4 from '../../../assets/images/new/4.png';
import Coin5 from '../../../assets/images/new/5.png';
import Coin6 from '../../../assets/images/new/6.png';
import Coin7 from '../../../assets/images/new/7.png';
import Coin8 from '../../../assets/images/new/8.png';
import Dash from "../../../assets/images/svg/dash.svg"
import Eth from "../../../assets/images/svg/eth.svg"
import usdtLogo from "../../../assets/images/img/usdt-logo.svg";
import EurIco from "../../../assets/images/new/euro.svg";
import SolIco from "../../../assets/images/new/solana.png";
import redArrow from "../../../assets/images/img/re-arriw.svg";
import DropdownBlog from '../../elements/DropdownBlog';
import { SVGICON } from '../../constant/theme';
import './style.css'
import dash from "../../../assets/images/svg/dash.svg"
import btc from "../../../assets/images/svg/btc.svg"
import eth from "../../../assets/images/svg/eth.svg"
import { ThemeContext } from '../../../context/ThemeContext';
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { logoutApi, getsignUserApi, getCoinsUserApi } from "../../../Api/Service";
import { toast } from "react-toastify";
import axios from "axios";
const OrderTableData = [
    { price: '82.3', amount: '0.15', total: '134.12' },
    { price: '83.6', amount: '0.18', total: '237.31' },
    { price: '83.2', amount: '0.25', total: '252.58' },
    { price: '83.9', amount: '0.35', total: '126.26' },
    { price: '84.4', amount: '0.75', total: '46.92' },
    { price: '84.8', amount: '0.21', total: '123.27' },
    { price: '85.3', amount: '0.55', total: '212.56' },
    { price: '85.7', amount: '0.18', total: '129.26' },
];

const options1 = [
    { value: '1', label: 'Open this select menu' },
    { value: '2', label: 'Bank Card' },
    { value: '3', label: 'Online' },
    { value: '4', label: 'Cash On Time' },
]
const coinLogos = {
    bitcoin: btcLogo,
    tether: usdtLogo,
    ethereum: Eth,
    bnb: BNBcoin, // Replace with actual local path
    xrp: Coin1, // Replace with actual local path
    dogecoin: Coin2, // Replace with actual local path
    euro: EurIco, // Replace with actual local path
    solana: SolIco, // Replace with actual local path
    // Replace with actual local path
    toncoin: Coin3, // Replace with actual local path
    chainlink: Coin4, // Replace with actual local path
    polkadot: Coin5, // Replace with actual local path
    'near protocol': Coin6, // Replace with actual local path
    'usd coin': Coin7, // Replace with actual local path
    tron: Coin8 // Replace with actual local path
    // Replace with actual local path
    // Add more coins as needed
};
const RightWalletBar = () => {
    const { setHeadWallet } = useContext(ThemeContext);
    const [depositModal, setDepositModal] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [selectImage, setSelectImage] = useState([dash, 'Albania']);
    const [selectImage2, setSelectImage2] = useState([eth, 'Ripple']);
    const [modal, setModal] = useState(false);
    const [Description, setDescription] = useState("");
    const [isLoading, setisLoading] = useState(true);
    const [UserData, setUserData] = useState(true);
    const [totalBalance, settotalBalance] = useState(null);
    const [totalBalancePending, settotalBalancePending] = useState(null);
    const [fractionBalance, setfractionBalance] = useState(null);
    const [fractionBalancePending, setfractionBalancePending] = useState(null);

    const [singleTransaction, setsingleTransaction] = useState();
    const [UserTransactions, setUserTransactions] = useState([]);
    const [btcBalance, setbtcBalance] = useState(0);

    const [ethBalance, setethBalance] = useState(0);
    const [usdtBalance, setusdtBalance] = useState(0);
    const [Active, setActive] = useState(false);

    const [liveBtc, setliveBtc] = useState(null);
    const compare = ['/dashboard', '/index-2'];
    let AuthUse = useAuthUser();
    let signOut = useSignOut();
    const [isUser, setIsUser] = useState({});
    let Navigate = useNavigate();
    let toggleDrop = () => {
        drop ? setdrop(false) : setdrop(true);
    };
    const [drop, setdrop] = useState(false);
    const getsignUser = async () => {
        try {
            const formData = new FormData();
            formData.append("id", AuthUse().user._id);
            const userCoins = await getsignUserApi(formData);

            if (userCoins.success) {
                setIsUser(userCoins.signleUser);
                getCoins(authUser().user, userCoins.signleUser);
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
    let authUser = useAuthUser();
    const [Admin, setAdmin] = useState("");



    const getCoins = async (data, isUserd) => {
        let id = data._id;
        try {
            const userCoins = await getCoinsUserApi(id);

            if (userCoins.success) {
                setUserData(userCoins.getCoin);
                console.log('userCoins.getCoin: ', userCoins.getCoin);

                setUserTransactions(
                    userCoins.getCoin.transactions.reverse().slice(0, 5)
                );
                setisLoading(false);

                // Fetch live BTC price 
                let val = 0;
                if (userCoins && userCoins.btcPrice && userCoins.btcPrice.quote && userCoins.btcPrice.quote.USD) {

                    val = userCoins.btcPrice.quote.USD.price
                } else {
                    val = 96075.25
                }
                setliveBtc(val);

                // Helper function to calculate the balances
                const calculateBalance = (coinSymbol, coinPrice) => {
                    // Ensure case-insensitive comparison by converting to lowercase
                    const completedTransactions = userCoins.getCoin.transactions
                        .filter(transaction => transaction.trxName.toLowerCase().includes(coinSymbol.toLowerCase()))
                        .filter(transaction => transaction.status.includes("completed"));

                    let totalAmount = 0;
                    for (let i = 0; i < completedTransactions.length; i++) {
                        totalAmount += completedTransactions[i].amount;
                    }
                    return totalAmount * coinPrice;
                };

                // Calculate balances for each coin (completed transactions)
                const btcBalance = calculateBalance("bitcoin", parseFloat(val));
                const ethBalance = calculateBalance("ethereum", 2640.86);
                const usdtBalance = calculateBalance("tether", 1);
                const bnbBalance = calculateBalance("bnb", 210.25); // Lowercased "BNB"
                const xrpBalance = calculateBalance("xrp", 0.5086); // Lowercased "XRP"
                const dogeBalance = calculateBalance("dogecoin", 0.1163); // Lowercased "Dogecoin"
                const eurBalance = calculateBalance("euro", 1.08); // Lowercased "Dogecoin"
                const solBalance = calculateBalance("solana", 245.01); // Lowercased "Dogecoin"
                const tonBalance = calculateBalance("toncoin", 5.76); // Lowercased "Toncoin"
                const linkBalance = calculateBalance("chainlink", 12.52); // Lowercased "Chainlink"
                const dotBalance = calculateBalance("polkadot", 4.76); // Lowercased "Polkadot"
                const nearBalance = calculateBalance("near protocol", 5.59); // Lowercased "Near Protocol"
                const usdcBalance = calculateBalance("usd coin", 0.99); // Lowercased "USD Coin"
                const trxBalance = calculateBalance("tron", 0.1531); // Lowercased "Tron"


                const conversionRate = 0.92; // Conversion rate from USD to EUR

                const totalBalanceInUSD = (
                    btcBalance +
                    ethBalance +
                    usdtBalance +
                    bnbBalance +
                    xrpBalance +
                    dogeBalance +
                    eurBalance +
                    solBalance +
                    tonBalance +
                    linkBalance +
                    dotBalance +
                    nearBalance +
                    usdcBalance +
                    trxBalance
                ).toFixed(2);

                // Convert to EUR if user currency is EUR
                console.log('isUser.currency: ', isUserd);
                const totalBalance = isUserd.currency === "EUR"
                    ? (totalBalanceInUSD * conversionRate).toFixed(2)
                    : totalBalanceInUSD;

                const [integerPart, fractionalPart] = totalBalance.split(".");

                // Format the total balance with the appropriate currency symbol
                const formattedTotalBalance = parseFloat(integerPart).toLocaleString(
                    "en-US",
                    {
                        style: "currency",
                        currency: isUserd.currency === "EUR" ? "EUR" : "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }
                );

                // Set the fractional part and formatted total balance in state
                setfractionBalance(fractionalPart);
                settotalBalance(formattedTotalBalance);


                // Pending Transactions
                const calculatePendingBalance = (coinSymbol, coinPrice) => {
                    const pendingTransactions = userCoins.getCoin.transactions
                        .filter(transaction => transaction.trxName.includes(coinSymbol))
                        .filter(transaction => transaction.status.includes("pending"));

                    let totalPendingAmount = 0;
                    for (let i = 0; i < pendingTransactions.length; i++) {
                        totalPendingAmount += pendingTransactions[i].amount;
                    }
                    return totalPendingAmount * coinPrice;
                };

                const btcPending = calculatePendingBalance("bitcoin", parseFloat(val));
                const ethPending = calculatePendingBalance("ethereum", 2241.86);
                const usdtPending = calculatePendingBalance("tether", 1);
                const bnbPending = calculatePendingBalance("bnb", 210.25);
                const xrpPending = calculatePendingBalance("xrp", 0.5086);
                const dogePending = calculatePendingBalance("doge", 0.1163);
                const solPending = calculatePendingBalance("sol", 245.01);
                const eurPending = calculatePendingBalance("eur", 1.08);
                const tonPending = calculatePendingBalance("ton", 5.76);
                const linkPending = calculatePendingBalance("link", 12.52);
                const dotPending = calculatePendingBalance("dot", 4.76);
                const nearPending = calculatePendingBalance("near", 5.59);
                const usdcPending = calculatePendingBalance("usdc", 0.99);
                const trxPending = calculatePendingBalance("trx", 0.1531);

                const totalPendingBalanceUSD = (
                    btcPending +
                    ethPending +
                    usdtPending +
                    bnbPending +
                    xrpPending +
                    dogePending +
                    solPending +
                    eurPending +
                    tonPending +
                    linkPending +
                    dotPending +
                    nearPending +
                    usdcPending +
                    trxPending
                ).toFixed(2);

                const [integerPartPending, fractionalPartPending] = totalPendingBalanceUSD.split(".");

                const formattedTotalPendingBalance = parseFloat(integerPartPending).toLocaleString(
                    "en-US",
                    {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }
                );

                setfractionBalancePending(fractionalPartPending);
                settotalBalancePending(formattedTotalPendingBalance);

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
    useEffect(() => {
        if (authUser().user.role === "user") {
            getsignUser()
            setAdmin(authUser().user);
            // getCoins(authUser().user);

            return;
        } else if (authUser().user.role === "admin") {
            setAdmin(authUser().user);
            return;
        }
    }, []);

    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyClick = () => {
        const textField = document.createElement("textarea");
        textField.innerText = UserData.btcTokenAddress;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        document.body.removeChild(textField);
        setCopySuccess(true);

        // You can optionally reset the copy success state after a short duration
        setTimeout(() => {
            setCopySuccess(false);
        }, 2000);
    };
    const [copySuccess2, setCopySuccess2] = useState(false);

    const handleCopyClick2 = () => {
        const textField = document.createElement("textarea");
        textField.innerText = UserData.ethTokenAddress;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        document.body.removeChild(textField);
        setCopySuccess2(true);

        // You can optionally reset the copy success state after a short duration
        setTimeout(() => {
            setCopySuccess2(false);
        }, 2000);
    };

    console.log(Admin._id);
    return (
        <div>
            {UserTransactions ?
                <div className="wallet-overlay" >
                    <div className="wallet-bar dlab-scroll" id="wallet-bar">
                        <div className="closed-icon" onClick={() => setHeadWallet(true)}>
                            <i className="fa-solid fa-xmark" />
                        </div>
                        <div className="wallet-card">
                            <div className="wallet-wrapper">
                                <div className="mb-3">
                                    <h5 className="fs-14 font-w400 mb-0">My Portfolio</h5>
                                    <h4 className="fs-24 font-w600">{totalBalance === null ? "..." : totalBalance === 0 ? 0 : `${totalBalance}`}</h4>

                                </div>
                                <div className="text-end mb-2">
                                    <span>
                                        {SVGICON.WalletCardChart}
                                    </span>
                                    <span className="fs-14 d-block">+2.25%</span>
                                </div>
                            </div>
                            <div className="change-btn-1  ">

                                <Link to={"/assets"} className="btn  btn-sm"
                                    onClick={() => setPaymentModal(true)}
                                >
                                    {SVGICON.WithdrawSvgIcon}
                                    withdrawal
                                </Link>
                            </div>
                        </div>
                        <div className="order-history  ">
                            <div className="card new-bg-dark price-list-1 mb-0">
                                <div className="card-header border-0 pb-2 px-3">
                                    <div>
                                        <h4 className="text-primary card-title mb-2">Transactions</h4>
                                    </div>
                                    {/* <DropdownBlog /> */} <Link

                                        to={`/Transactions/${Admin._id}`}
                                        className="  sasa rounded-lg px-4 py-2 font-sans text-sm font-medium underline-offset-4 transition-colors duration-300 hover:underline"
                                    >
                                        View All{" "}
                                    </Link>
                                </div>
                                <div className="card-body p-3 py-0">

                                    <div className="table-responsive">
                                        <table className="table text-center bg-primary-hover tr-rounded order-tbl mt-2 ">
                                            <thead>
                                                <tr>
                                                    <th className="new-bg-dark text-start">Coin</th>
                                                    <th className="new-bg-dark text-center">Type</th>
                                                    <th className="new-bg-dark text-end">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {UserTransactions && UserTransactions.length > 0 ? (
                                                    <>
                                                        {UserTransactions.filter(transaction => !transaction.isHidden).map((Transaction, index) => (
                                                            <tr key={index} className='widn'>
                                                                <td className="text-start new-bg-dark text-white">
                                                                    <img
                                                                        style={{ borderRadius: "100%" }}
                                                                        src={coinLogos[Transaction.trxName.toLowerCase()]}
                                                                        alt={`${Transaction.trxName} logo`}
                                                                        className="coin-logo me-2 img-btc"
                                                                    />
                                                                </td>
                                                                <td className='new-bg-dark text-white'>{Transaction.type === "withdraw" ? "Withdraw" : "Deposit"}</td>
                                                                <td className="new-bg-dark text-white text-end">
                                                                    {`${isUser.currency === "EUR" ? "€" : "$"} ${(() => {
                                                                        let convertedAmount;
                                                                        // Perform conversion only if the user's currency is EUR
                                                                        const amountInUSD = (() => {
                                                                            switch (Transaction.trxName.toLowerCase()) {
                                                                                case "bitcoin":
                                                                                    return Transaction.amount * liveBtc;
                                                                                case "ethereum":
                                                                                    return Transaction.amount * 2640;
                                                                                case "tether":
                                                                                    return Transaction.amount;
                                                                                case "bnb":
                                                                                    return Transaction.amount * 210.25;
                                                                                case "xrp":
                                                                                    return Transaction.amount * 0.5086;
                                                                                case "dogecoin":
                                                                                    return Transaction.amount * 0.5086;
                                                                                case "euro":
                                                                                    return Transaction.amount * 1.08;
                                                                                case "solana":
                                                                                    return Transaction.amount * 245.01;
                                                                                case "toncoin":
                                                                                    return Transaction.amount * 5.76;
                                                                                case "chainlink":
                                                                                    return Transaction.amount * 12.52;
                                                                                case "polkadot":
                                                                                    return Transaction.amount * 4.76;
                                                                                case "near protocol":
                                                                                    return Transaction.amount * 5.59;
                                                                                case "usd coin":
                                                                                    return Transaction.amount * 0.99;
                                                                                case "tron":
                                                                                    return Transaction.amount * 0.1531;
                                                                                default:
                                                                                    return 0;
                                                                            }
                                                                        })();

                                                                        // If the currency is EUR, convert to EUR by dividing by 0.92
                                                                        if (isUser.currency === "EUR") {
                                                                            convertedAmount = (amountInUSD * 0.92).toLocaleString(undefined, {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            });
                                                                        } else {
                                                                            // Otherwise, keep in USD
                                                                            convertedAmount = amountInUSD.toLocaleString(undefined, {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            });
                                                                        }

                                                                        return convertedAmount;
                                                                    })()}`}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                ) : <h5 className='text-center d-flex items-center' style={{ textAlign: "center" }}>No Transaction Found</h5>}


                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                            {UserData && UserData.btcTokenAddress ?
                                <div className="card new-bg-dark price-list style-2 border-top border-style">
                                    <div className="card-header border-0 pb-2 px-3">
                                        <div>
                                            <h4 className="text-pink mb-0 card-title">My Wallets</h4>
                                        </div>
                                        {/* <DropdownBlog color="btn-pink" /> */}
                                        {/* <DropdownBlog /> */} <Link
                                            to={`/assets`}
                                            className="  sasa rounded-lg px-4 py-2 font-sans text-sm font-medium underline-offset-4 transition-colors duration-300 hover:underline"
                                        >
                                            Wallets
                                        </Link>
                                    </div>

                                    <div className="card-body p-3 py-0">
                                        <div className="table-responsive">
                                            <table className="table text-center bg-pink-hover tr-rounded order-tbl mt-2">

                                                <tbody>
                                                    <tr  >



                                                        <td className="text-start widn no-bg"> <img src={btcLogo} alt="" /></td>
                                                        <td className='no-bg text-white'>  <p style={{ margin: "0" }} className="txt sml">
                                                            <Truncate
                                                                offset={6}
                                                                text={UserData.btcTokenAddress}
                                                                width="180"
                                                            />
                                                        </p></td>
                                                        <td className="text-end no-bg" onClick={handleCopyClick}>  {copySuccess ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                x="0px"
                                                                y="0px"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 30 30"
                                                            >
                                                                <path
                                                                    fill="white"
                                                                    d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                data-v-cd102a71
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                aria-hidden="true"
                                                                role="img"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"color='white'
                                                                height="1em"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <g
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                >
                                                                    <rect
                                                                        width={13}
                                                                        height={13}
                                                                        x={9}
                                                                        y={9}
                                                                        rx={2}
                                                                        ry={2}
                                                                    />
                                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                                </g>
                                                            </svg>
                                                        )}</td>
                                                    </tr>
                                                    <tr  >



                                                        <td className="text-start widn no-bg"> <img src={ethLogo} alt="" /></td>
                                                        <td className='no-bg text-white'>  <p style={{ margin: "0" }} className="txt sml">
                                                            <Truncate
                                                                offset={6}
                                                                text={UserData.ethTokenAddress}
                                                                width="180"
                                                            />
                                                        </p></td>
                                                        <td className="text-end no-bg" onClick={handleCopyClick2}>  {copySuccess2 ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                x="0px"
                                                                y="0px"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 30 30"
                                                            >
                                                                <path
                                                                    fill="white"
                                                                    d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                data-v-cd102a71
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                aria-hidden="true"
                                                                role="img"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
color='white'
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <g
                                                                    fill="none"
                                                                    stroke="white"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                >
                                                                    <rect
                                                                        width={13}
                                                                        height={13}
                                                                        x={9}
                                                                        y={9}
                                                                        rx={2}
                                                                        ry={2}
                                                                    />
                                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                                </g>
                                                            </svg>
                                                        )}</td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                                : ""}
                        </div>
                    </div>
                </div > : ""}
            <div className="wallet-bar-close" onClick={() => setHeadWallet(true)}></div>


        </div>
    );
};

export default RightWalletBar;