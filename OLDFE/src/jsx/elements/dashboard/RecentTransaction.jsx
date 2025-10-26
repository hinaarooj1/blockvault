import React, { useState, useEffect, useReducer } from 'react';

import Btc from '../../../assets/images/svg/btc.svg';
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import BNBcoin from '../../../assets/images/new/bnb.png';
import Coin1 from '../../../assets/images/new/1.png';
import Coin2 from '../../../assets/images/new/2.png';
import Coin3 from '../../../assets/images/new/3.png';
import Coin4 from '../../../assets/images/new/4.png';
import Coin5 from '../../../assets/images/new/5.png';
import Coin6 from '../../../assets/images/new/6.png';
import Coin7 from '../../../assets/images/new/7.png';
import Coin8 from '../../../assets/images/new/8.png';
import EurIco from '../../../assets/images/new/euro.svg';
import SolIco from '../../../assets/images/new/solana.png';
import Dash from "../../../assets/images/svg/dash.svg"
import Eth from "../../../assets/images/svg/eth.svg"
import Truncate from 'react-truncate-inside/es';
import axios from 'axios';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { IMAGES, SVGICON } from '../../constant/theme';
import { createUserTransactionApi, getCoinsUserApi, getsignUserApi, getUserCoinApi } from '../../../Api/Service';
const coinLogos = {
    bitcoin: Btc,
    tether: UsdtLogo,
    ethereum: Eth,
    bnb: BNBcoin, // Replace with actual local path
    xrp: Coin1, // Replace with actual local path
    dogecoin: Coin2, // Replace with actual local path
    euro: EurIco, // Replace with actual local path
    solana: SolIco, // Replace with actual local path
    toncoin: Coin3, // Replace with actual local path
    chainlink: Coin4, // Replace with actual local path
    polkadot: Coin5, // Replace with actual local path
    'near protocol': Coin6, // Replace with actual local path
    'usd coin': Coin7, // Replace with actual local path
    tron: Coin8 // Replace with actual local path
    // Replace with actual local path
    // Add more coins as needed
};
const tableData = [
    { type: 'Week', icon: SVGICON.TransferSucces, sender: 'Donalt', reciver: 'Dr. Jackson', image: IMAGES.Avatar1, coin: Btc, color: 'success', status: 'COMPLETED' },
    { type: 'Week', icon: SVGICON.TransferPending, sender: 'Thomas', reciver: 'Kritiyan', image: IMAGES.Avatar2, coin: Dash, color: 'warning', status: 'PENDING' },
    { type: 'Week', icon: SVGICON.TransferCencel, sender: 'Hitesh', reciver: 'Prof. Kalyan', image: IMAGES.Avatar3, coin: Eth, color: 'danger', status: 'CANCEL' },

    { type: 'Month', icon: SVGICON.TransferPending, sender: 'Thomas', reciver: 'Kritiyan', image: IMAGES.Avatar2, coin: Dash, color: 'warning', status: 'PENDING' },
    { type: 'Month', icon: SVGICON.TransferSucces, sender: 'Donalt', reciver: 'Dr. Jackson', image: IMAGES.Avatar1, coin: Btc, color: 'success', status: 'COMPLETED' },
    { type: 'Month', icon: SVGICON.TransferCencel, sender: 'Hitesh', reciver: 'Prof. Kalyan', image: IMAGES.Avatar3, coin: Eth, color: 'danger', status: 'CANCEL' },

    { type: 'Year', icon: SVGICON.TransferSucces, sender: 'Donalt', reciver: 'Dr. Jackson', image: IMAGES.Avatar1, coin: Btc, color: 'success', status: 'COMPLETED' },
    { type: 'Year', icon: SVGICON.TransferCencel, sender: 'Hitesh', reciver: 'Prof. Kalyan', image: IMAGES.Avatar3, coin: Eth, color: 'danger', status: 'CANCEL' },
    { type: 'Year', icon: SVGICON.TransferPending, sender: 'Thomas', reciver: 'Kritiyan', image: IMAGES.Avatar2, coin: Dash, color: 'warning', status: 'PENDING' },
];

const tabMainData = [
    { name: 'Week', type: 'week' },
    { name: 'Month', type: 'month' },
    { name: 'Year', type: 'year' },
];



const RecentTransaction = () => {

    const [transactionData, setTransactionData] = useState(tableData.slice(0, 3));
    const [activeTab, setActiveTab] = useState('Week');

    function UpdateArray(name) {
        let updateDate = tableData.filter((ele) => {
            return ele.type === name
        })
        setTransactionData(updateDate);
        setActiveTab(name);
    }

    const [modal, setModal] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [UserTransactions, setUserTransactions] = useState([]);
    const [singleTransaction, setsingleTransaction] = useState();
    const [userDetail, setuserDetail] = useState({});
    const [liveBtc, setliveBtc] = useState(null);


    let authUser = useAuthUser();
    let Navigate = useNavigate();
    const [Active, setActive] = useState(false);

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
        }
    };
    const convertToCurrency = (amount, rate) => {
        return isUser.currency === "EUR"
            ? (Math.abs(amount) * rate * 0.92).toFixed(2) // Convert USD to EUR
            : (Math.abs(amount) * rate).toFixed(2); // Keep in USD
    };

    const getCryptoRate = (trxName) => {
        const rates = {
            bitcoin: liveBtc || 0,
            ethereum: 2640.86,
            tether: 1.0,
            bnb: 210.25,
            xrp: 0.5086,
            dogecoin: 0.1163,
            solana: 245.01,
            euro: 1.08,
            toncoin: 5.76,
            chainlink: 12.52,
            polkadot: 4.76,
            "near protocol": 5.59,
            "usd coin": 0.99,
            tron: 0.1531,
        };
        return rates[trxName.toLowerCase()] || 0;
    };
    const getTransactions = async () => {
        try {

            const allTransactions = await getUserCoinApi(authUser().user._id);
            if (allTransactions.success) {
                setUserTransactions(allTransactions.getCoin.transactions.reverse());
                let val = 0;
                if (allTransactions && allTransactions.btcPrice && allTransactions.btcPrice.quote && allTransactions.btcPrice.quote.USD) {

                    val = allTransactions.btcPrice.quote.USD.price
                } else {
                    val = 96075.25
                }

                setliveBtc(val);
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
    let toggleModal = async (data) => {
        setModal(true);

        setsingleTransaction(data);
    };
    let toggleModalClose = () => {
        setModal(false);
    };

    //

    //

    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };
    useEffect(() => {
        getsignUser();
        if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        } else if (authUser().user.role === "user") {
            setuserDetail(authUser().user);

            getTransactions();

        }

        // getSignleUser();
    }, []);
    // Copy
    const [timer, setTimer] = useState(null);
    const [copyStatus, setCopyStatus] = useState(false);

    const handleCopyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopyStatus(true);

                // Reset the copy status after 2 seconds
                setTimeout(() => {
                    setCopyStatus(false);
                }, 2000);
            })
            .catch(() => {
                setCopyStatus(false);

                // Reset the copy status after 2 seconds
                setTimeout(() => {
                    setCopyStatus(false);
                }, 2000);
            });
    };

    return (
        <div className="card new-bg-dark  transaction-table">
            <div className="card-header border-0 flex-wrap pb-0">
                <div className="mb-2">
                    <h4 className="card-title text-white">Recent Transactions</h4>
                </div>

            </div>
            <div className="card-body p-0">
                <div className="tab-content" id="myTabContent1">
                    <div className="tab-pane fade show active" id="Week" role="tabpanel" aria-labelledby="Week-tab">
                        <div className="table-responsive">
                            <table className="table table-responsive-md naman">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Transaction ID</th>
                                        <th>Date</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Coin</th>
                                        <th>Amount</th>
                                        <th className="text-end">Status</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {UserTransactions && UserTransactions.length > 0 ?
                                        UserTransactions.filter(
                                            (transaction) => !transaction.isHidden
                                        ).slice(0, 5).map((Transaction, index) => {
                                            const { type, trxName, amount, currency } = Transaction;

                                            console.log('currency: ', currency);
                                            const rate = getCryptoRate(trxName);
                                            const convertedAmount = convertToCurrency(amount, rate, currency);
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        {Transaction.type === 'deposit' ? (
                                                            <div className="icon-container bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M11 20V7.825l-5.6 5.6L4 12l8-8 8 8-1.4 1.425-5.6-5.6V20z" />
                                                                </svg>
                                                            </div>
                                                        ) : Transaction.type === 'withdraw' ? (
                                                            <div className="icon-container bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M11 4v12.175l-5.6-5.6L4 12l8 8 8-8-1.4-1.425-5.6 5.6V4z" />
                                                                </svg>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td>{Transaction._id}</td>
                                                    <td>{new Date(Transaction.createdAt).toISOString().split('T')[0]}</td>
                                                    <td>  <Truncate text={Transaction.fromAddress} offset={6} width="100" /></td>
                                                    <td>  <Truncate text={Transaction.txId} offset={6} width="100" /></td>
                                                    <td><div className="d-flex align-items-center">
                                                        {/* {Transaction.trxName === 'bitcoin'
                                                    ? <><img src={Btc} alt="" className="me-2 img-btc" />Bitcoin</>
                                                    : Transaction.trxName === 'ethereum'
                                                        ? <><img src={Eth} alt="" className="me-2 img-btc" />Ethereum</>
                                                        : Transaction.trxName === 'tether'
                                                            ? <><img src={UsdtLogo} alt="" className="me-2 img-btc" />USDT</>
                                                            : ""
                                                } */}

                                                        <img style={{ borderRadius: "100%" }} src={coinLogos[Transaction.trxName.toLowerCase()]} alt={`${Transaction.trxName} logo`} className="coin-logo me-2 img-btc" />
                                                    </div></td>
                                                    <>
                                                        <td
                                                            className={`font-w600 ${type === "deposit"
                                                                ? "text-success"
                                                                : type === "withdraw"
                                                                    ? "text-danger"
                                                                    : ""
                                                                }`}
                                                        >
                                                            {type === "deposit" ? `+${isUser.currency === "EUR" ? "€" : "$"}${convertedAmount}` : `-${isUser.currency === "EUR" ? "€" : "$"}${convertedAmount}`}
                                                        </td>
                                                    </>
                                                    {Transaction.status === "completed" ? <td className="text-end">
                                                        <div className={`badge badge-sm badge-success`}>
                                                            {Transaction.status}</div></td> : Transaction.status === "pending" ? <td className="text-end">
                                                                <div className={`badge badge-sm badge-warning`}>
                                                                    {Transaction.status}</div></td> : Transaction.status === "failed" ? <td className="text-end">
                                                                        <div className={`badge badge-sm badge-danger`}>
                                                                            {Transaction.status}</div></td> : ""}

                                                </tr>

                                            )
                                        }) : ""}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RecentTransaction;