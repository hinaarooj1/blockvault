import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SVGICON } from '../../constant/theme';
import Bitcoin from "../../../assets/images/img/btc.svg"
import EthLogo from "../../../assets/images/img/eth.svg"
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { createUserTransactionApi, markTrxCloseApi, getCoinsUserApi, getsignUserApi, getUserCoinApi, getLinksApi } from '../../../Api/Service';
import axios from 'axios';
import { Button, Card, Col, Form, DropdownDivider, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';
import { useTranslation } from 'react-i18next';
import './trading.css'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AiTrading = () => {
    const { t } = useTranslation()
    const [activeDurationBtc, setActiveDurationBtc] = useState(30);
    const [activeDurationEth, setActiveDurationEth] = useState(30);
    const [activeDurationUsdt, setActiveDurationUsdt] = useState(30);
    const [isLoading, setisLoading] = useState(true);
    const [isDisable, setisDisable] = useState(false);
    const [liveBtc, setliveBtc] = useState(null);
    const [UserTransactions, setUserTransactions] = useState([]);
    const navigate = useNavigate();

    const [secLoading, setsecLoading] = useState(true);
    const [adminMode, setAdminMode] = useState(false);
    const [dailyRates, setDailyRates] = useState({
        bitcoin: { rate: 1.25, history: [] },
        ethereum: { rate: 1.25, history: [] },
        tether: { rate: 1.25, history: [] }
    });
    const [editingRate, setEditingRate] = useState({ crypto: null, value: '' });

    const fetchLinks = async () => {
        try {
            const data = await getLinksApi();
            if (data?.links[1]?.enabled) {
                setsecLoading(false)
            } else {
                navigate(-1);
            }
        } catch (error) {
            console.error("Error fetching links:", error);
        }
    };

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
            const userCoins = await getCoinsUserApi(id);

            if (userCoins.success) {
                setUserData(userCoins.getCoin);
                let val = 0;
                if (userCoins && userCoins.btcPrice && userCoins.btcPrice.quote && userCoins.btcPrice.quote.USD) {
                    val = userCoins.btcPrice.quote.USD.price
                } else {
                    val = 96075.25
                }
                setliveBtc(val);
                setisLoading(false);

                processTransactions(userCoins.getCoin.transactions, val);

                const totalValue = (
                    btcBalance * liveBtc +
                    ethBalance * 2640 +
                    usdtBalance
                ).toFixed(2);

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

    const processTransactions = (transactions, btcPrice) => {
        const btc = transactions.filter((transaction) =>
            transaction.trxName.includes("bitcoin")
        );
        const btccomplete = btc.filter((transaction) =>
            transaction.status.includes("completed")
        );
        let btcValueAdded = 0;
        for (let i = 0; i < btccomplete.length; i++) {
            const element = btccomplete[i];
            btcValueAdded += element.amount;
        }
        setbtcBalance(btcValueAdded);

        const eth = transactions.filter((transaction) =>
            transaction.trxName.includes("ethereum")
        );
        const ethcomplete = eth.filter((transaction) =>
            transaction.status.includes("completed")
        );
        let ethValueAdded = 0;
        for (let i = 0; i < ethcomplete.length; i++) {
            const element = ethcomplete[i];
            ethValueAdded += element.amount;
        }
        setethBalance(ethValueAdded);

        const usdt = transactions.filter((transaction) =>
            transaction.trxName.includes("tether")
        );
        const usdtcomplete = usdt.filter((transaction) =>
            transaction.status.includes("completed")
        );
        let usdtValueAdded = 0;
        for (let i = 0; i < usdtcomplete.length; i++) {
            const element = usdtcomplete[i];
            usdtValueAdded += element.amount;
        }
        setusdtBalance(usdtValueAdded);
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
            const userCoins = await getsignUserApi(formData);

            if (userCoins.success) {
                setIsUser(userCoins.signleUser);
                setDailyRates({
                    bitcoin: { rate: userCoins?.signleUser?.AiTradingPercentage },
                    ethereum: { rate: userCoins?.signleUser?.AiTradingPercentage },
                    tether: { rate: userCoins?.signleUser?.AiTradingPercentage },
                })
                if (userCoins.signleUser.role === "admin") {
                    setAdminMode(true);
                }
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

    useEffect(() => {
        getCoins(authUser().user);
        fetchLinks();
        getsignUser();
        if (authUser().user.role === "user") {
            return;
        } else if (authUser().user.role === "admin") {
            return;
        }
    }, []);

    const handleAmountChange = (e, cryptoName) => {
        const value = e.target.value;

        if (value === "") {
            setAmount("");
            return;
        }

        const numericValue = parseFloat(value);

        let balanceLimit = 0;
        if (cryptoName === "bitcoin") balanceLimit = btcBalance;
        if (cryptoName === "ethereum") balanceLimit = ethBalance;
        if (cryptoName === "tether") balanceLimit = usdtBalance;

        if (!isNaN(numericValue)) {
            if (numericValue > balanceLimit) {
                setAmount(balanceLimit.toString());
            } else {
                setAmount(value);
            }
        }
    };

    const [amount, setAmount] = useState("");
    const [baseRatedUsdt, setbaseRatedUsdt] = useState(0);
    const [baseRatedEth, setbaseRatedEth] = useState(0);
    const [baseRatedBtc, setbaseRatedBtc] = useState(0);
    const [parseAmountBtc, setparseAmountBtc] = useState(0);
    const [parsrIntBtc, setparsrIntBtc] = useState(0);
    const [estInterest, setEstInterest] = useState(0);
    const [dailyProfitData, setDailyProfitData] = useState([]);
    const [parseAmountEth, setparseAmountEth] = useState(0);
    const [parsrIntEth, setparsrIntEth] = useState(0);
    const [parseAmountUsdt, setparseAmountUsdt] = useState(0);
    const [parsrIntUsdt, setparsrIntUsdt] = useState(0);
    useEffect(() => {
        calculateEstInterest();
    }, [amount, activeDurationBtc, dailyRates.bitcoin.rate]);

    const calculateEstInterest = () => {
        setDailyProfitData([]);

        const validAmount = parseFloat(amount) || 0;

        // Select coin-specific settings
        let baseRate = 0;
        let duration = 0;
        let livePrice = 1;

        if (currentCrypto === "btc") {
            baseRate = dailyRates.bitcoin.rate;
            duration = activeDurationBtc;
            livePrice = liveBtc;
        } else if (currentCrypto === "eth") {
            baseRate = dailyRates.ethereum.rate;
            duration = activeDurationEth;
            livePrice = 2640;
        } else if (currentCrypto === "usdt") {
            baseRate = dailyRates.tether.rate;
            duration = activeDurationUsdt;
            livePrice = 1;
        }

        // Adjust baseRate by duration
        const multipliers = { 30: 1.0, 60: 1.2, 90: 1.5 };
        baseRate = baseRate * (multipliers[duration] || 0);

        // Calculate interest and totals
        const totalInterest = (validAmount * baseRate) / 100;
        const totalAmount = validAmount + totalInterest;

        // Update states per coin
        if (currentCrypto === "btc") {
            setbaseRatedBtc(baseRate.toFixed(2));
            setparseAmountBtc(validAmount);
            setparsrIntBtc(totalInterest);
        }
        if (currentCrypto === "eth") {
            setbaseRatedEth(baseRate.toFixed(2));
            setparseAmountEth(validAmount);
            setparsrIntEth(totalInterest);
        }
        if (currentCrypto === "usdt") {
            setbaseRatedUsdt(baseRate.toFixed(2));
            setparseAmountUsdt(validAmount);
            setparsrIntUsdt(totalInterest);
        }

        // Shared states
        setEstInterest(totalInterest);
        setDailyProfitData([
            {
                interestRate: baseRate.toFixed(2) + "%",
                balance: totalAmount.toFixed(2),
                usdValue: (totalAmount * livePrice).toFixed(2),
            },
        ]);
    };

    useEffect(() => {
        calculateEstInterest();
    }, [currentCrypto, amount, activeDurationBtc, activeDurationEth, activeDurationUsdt]);

    const confirmTransaction = async (depositName) => {

        let e = "crypto";
        if (amount.trim() === "") {
            toast.error(t("aiBot.notZero"));
            return false;
        }

        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount)) {
            toast.error(t("aiBot.invalidAmount"));
            return false;
        }

        if (parsedAmount === 0) {
            toast.error(t("aiBot.amountNotZero"));
            return false;
        }

        if (parsedAmount < 0) {
            toast.error(t("aiBot.amountNotNeg"));
            return false;
        }

        try {
            setisDisable(true);
            let body;
            let tradingTime;
            if (depositName === "bitcoin") {
                tradingTime = activeDurationBtc;
            } else if (depositName === "ethereum") {
                tradingTime = activeDurationEth;
            }
            else if (depositName === "tether") {
                tradingTime = activeDurationUsdt;
            }

            if (e == "crypto") {
                body = {
                    trxName: depositName,
                    amount: -parsedAmount,
                    txId: "Trading amount",
                    e: e,
                    status: "completed",
                    tradingTime,
                    // when trade started
                    lastProfitDate: null,                // will be updated daily at UTC+0
                    totalProfit: 0,
                    isTrading: true,
                    profit: 0,

                };
                if (!body.trxName || !body.amount || !body.txId) {
                    toast.dismiss();
                    toast.error(t('assetsPage.fillAll'));
                    return;
                }
            }

            let id = authUser().user._id;

            const newTransaction = await createUserTransactionApi(id, body);

            if (newTransaction.success) {
                toast.dismiss();
                toast.success(t('aiBot.stakeSuccess'));

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

            const allTransactions = await getUserCoinApi(authUser().user._id);

            if (allTransactions.success) {

                setisDisable(false);
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

    const handleEndTrade = async (transaction, currentBalance) => {

        try {
            setisDisable(true);
            const body = {
                trxName: transaction.trxName,
                amount: Math.abs(currentBalance),
                txId: "Trade closure",
                e: "crypto",
                status: "completed",
                type: "deposit",
                isTrading: false
            };
            const id = authUser().user._id;
            const response = await markTrxCloseApi(id, transaction._id);
            await createUserTransactionApi(id, body);
            if (response.success) {
                toast.success("Trade closed successfully, the profit has been added to your outstanding balance");
                getTransactions()
            } else {
                toast.error(response.msg);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
        }
    };

    // Admin panel to control daily rates

    return (
        <>
            <div className="row">
                <div className="col-xxl-12">
                    <div className="card no-bg ">
                        <Card.Header className='no-border'>
                            <Card.Title className='text-white'>{t('aiBot.assets')}</Card.Title>
                            {adminMode && (
                                <button
                                    className="admin-toggle-btn"
                                    onClick={() => setAdminMode(!adminMode)}
                                >
                                    {adminMode ? "Hide Admin Panel" : "Show Admin Panel"}
                                </button>
                            )}
                        </Card.Header>
                        <div className="card-body">
                            {/* {adminMode && <AdminRatePanel />} */}

                            <div className="bloc-s">
                                <h1 className='text-white'>{t("aiBot.titleHead")}</h1>
                                <p className='text-white'>{t("aiBot.descriptionHead")}</p>
                            </div>
                            <div className="custom-col">
                                <div className="custom-card">
                                    <div className="custom-card-header new-bg-dark ">
                                        <h4 className="custom-card-title">{t("aiBot.stakingRewards")}</h4>
                                    </div>
                                    {secLoading ? "" : <div className="custom-card-body  new-bg-dark">
                                        {isLoading ? (
                                            <div className="custom-loader">
                                                <Spinner animation="border" variant="primary" />
                                                <h4 className="custom-loader-text">{t("aiBot.loading")}</h4>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="custom-transaction-grid jasja new-bg-dark">
                                                    {UserTransactions &&
                                                        UserTransactions.filter(
                                                            (Transaction) => !Transaction.isHidden && Transaction.txId === "Trading amount"
                                                        ).map((Transaction, index) => {
                                                            // ✅ Always positive values
                                                            const amount = Math.abs(Transaction.amount);const totalProfit = Math.abs(Transaction.totalProfit || 0);
                                                            const currentBalance = amount + totalProfit;
                                                            const profitPercentage = amount > 0 ? ((totalProfit / amount) * 100).toFixed(2) : "0.00";

                                                            // USD value converter
                                                            const getUsdValue = (balance) => {
                                                                switch (Transaction.trxName) {
                                                                    case "bitcoin": return (balance * liveBtc).toFixed(2);
                                                                    case "ethereum": return (balance * 2640).toFixed(2);
                                                                    case "tether": return balance.toFixed(2);
                                                                    default: return "0.00";
                                                                }
                                                            };

                                                            // ✅ Build chart data from dailyProfits
                                                            const generateProfitChartData = () => {
                                                                const data = [];
                                                                let runningBalance = Math.abs(Transaction.amount || 0); // ✅ start with initial deposit
                           

                                                                if (Transaction.dailyProfits && Transaction.dailyProfits.length > 0) {
                                                                    Transaction.dailyProfits.forEach((p, idx) => {
                                                                        const dailyProfit = Math.abs(p.profit || 0); // ✅ always positive
                                                                         
                                                                        runningBalance = dailyProfit;

                                                                        data.push({
                                                                            day: idx + 1,
                                                                            balance: parseFloat(runningBalance.toFixed(8)),
                                                                            usdValue: parseFloat(getUsdValue(runningBalance)),
                                                                            date: new Date(p.date).toLocaleString(), // user timezone
                                                                            profit: dailyProfit.toFixed(8),
                                                                        });
                                                                    });
                                                                }

                                                                return data;
                                                            };

                                                            return (
                                                                <div className="custom-transaction-card" key={index}>
                                                                    <div className="custom-transaction-body">
                                                                        <div className="custom-transaction-row">
                                                                            <div className="custom-transaction-col">
                                                                                <h6 className="custom-transaction-title">
                                                                                    {Transaction.trxName.replace(/\b\w/g, (char) => char.toUpperCase())} Trading
                                                                                    {" "}({Transaction.tradingTime} days)
                                                                                    {Transaction.isTrading === false ? (
                                                                                        <span className="status-badge closed">CLOSED</span>
                                                                                    ) : <span className="status-badge green">{" "}OPEN</span>}
                                                                                </h6>

                                                                                {/* Profit Chart */}
                                                                                <div className="profit-mountain-chart">
                                                                                    <ResponsiveContainer width="100%" height={220}>
                                                                                        <AreaChart
                                                                                            data={generateProfitChartData()}
                                                                                            margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
                                                                                        >
                                                                                            <defs>
                                                                                                <linearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
                                                                                                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                                                                                                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                                                                                                </linearGradient>
                                                                                            </defs>

                                                                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal vertical={false} />

                                                                                            <XAxis
                                                                                                dataKey="day"
                                                                                                tick={{ fill: "#9CA3AF" }}
                                                                                                axisLine={{ stroke: "#4B5563" }}
                                                                                                label={{ value: "Day", position: "insideBottom", offset: -5, fill: "#9CA3AF" }}
                                                                                            />

                                                                                            <YAxis tick={{ fill: "#9CA3AF" }} />

                                                                                            <Tooltip
                                                                                                contentStyle={{
                                                                                                    background: "#1F2937",
                                                                                                    border: "none",
                                                                                                    borderRadius: "8px",
                                                                                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                                                                }}
                                                                                                formatter={(value, name, props) => {
                                                                                                    if (name === "balance") {
                                                                                                        return [`${Number(value).toFixed(6)} ${Transaction.trxName.toUpperCase()}`, "Profit"];
                                                                                                    }
                                                                                                    if (name === "usdValue") {
                                                                                                        return [`$${Number(value).toFixed(2)}`, "USD Value"];
                                                                                                    }
                                                                                                    return value;
                                                                                                }}
                                                                                                labelFormatter={(label, payload) =>
                                                                                                    `Day ${label} (${payload[0]?.payload?.date || ""})`
                                                                                                }
                                                                                            />

                                                                                            <Area
                                                                                                type="monotone"
                                                                                                dataKey="balance"
                                                                                                stroke="#10B981"
                                                                                                strokeWidth={2}
                                                                                                fill="url(#mountainGradient)"
                                                                                                activeDot={{
                                                                                                    r: 6,
                                                                                                    stroke: "#059669",
                                                                                                    strokeWidth: 2,
                                                                                                    fill: "#D1FAE5",
                                                                                                }}
                                                                                            />
                                                                                        </AreaChart>
                                                                                    </ResponsiveContainer>
                                                                                </div>

                                                                                {/* Investment Details */}
                                                                                <div className="investment-details">
                                                                                    <div className="detail-row">
                                                                                        <span className="detail-label">Initial:</span>
                                                                                        <span className="detail-value">
                                                                                            {amount.toFixed(8)} {Transaction.trxName} (${getUsdValue(amount)})
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="detail-row">
                                                                                        <span className="detail-label">Current:</span>
                                                                                        <span className="detail-value">
                                                                                            {currentBalance.toFixed(8)} {Transaction.trxName} (${getUsdValue(currentBalance)})
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="detail-row">
                                                                                        <span className="detail-label">Profit:</span>
                                                                                        <span className="detail-value profit">
                                                                                            +{totalProfit.toFixed(8)} {Transaction.trxName} (${(getUsdValue(currentBalance) - getUsdValue(amount)).toFixed(2)})
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="detail-row">
                                                                                        <span className="detail-label">Profit %:</span>
                                                                                        <span className="detail-value profit">
                                                                                            +{profitPercentage}%
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className="detail-row" style={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                                                                        <button
                                                                                            className="end-trade-btn"
                                                                                            onClick={() => handleEndTrade(Transaction, currentBalance)}
                                                                                            disabled={isDisable || Transaction.isTrading === false}
                                                                                        >
                                                                                            {Transaction.isTrading === false ? "Trade Closed" : isDisable ? "Closing..." : "End Trade"}
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>

                                                {(UserTransactions.length === 0 ||
                                                    !UserTransactions.some(
                                                        (transaction) =>
                                                            !transaction.isHidden && transaction.txId === "Trading amount"
                                                    )) && (
                                                        <div className="custom-empty-state">
                                                            <div className="custom-empty-center">
                                                                <div className="custom-empty-box">
                                                                    <h4 className="custom-empty-title">
                                                                        {t("aiBot.noStakingFound")}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                            </>
                                        )}
                                    </div>}

                                </div>
                            </div>

                            <div className='text-center'>
                                <h1 className='text-white'>{t("aiBot.currentBalance")}</h1>
                            </div>
                            <div className="staking-grid-wrapper">
                                {[
                                    {
                                        name: 'Bitcoin',
                                        symbol: 'BTC',
                                        icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png',
                                        min: '0.0117769844 BTC',
                                        onClick: toggleStaking,
                                        durations: [30, 60, 90],
                                        active: activeDurationBtc,
                                        setActive: activeBtc,
                                    },
                                    {
                                        name: 'Ethereum',
                                        symbol: 'ETH',
                                        icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png',
                                        min: '0.1969969781 ETH',
                                        onClick: toggleStaking,
                                        durations: [30, 60, 90],
                                        active: activeDurationEth,
                                        setActive: activeEth,
                                    },
                                    {
                                        name: 'Tether USDT',
                                        symbol: 'USDT',
                                        icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/usdt.png',
                                        min: '500.3001801081 USDT',
                                        onClick: toggleStaking,
                                        durations: [30, 60, 90],
                                        active: activeDurationUsdt,
                                        setActive: activeUsdt,
                                    },
                                ].map((coin, idx) => (
                                    <div key={idx} className="staking-card">
                                        <div className="staking-card-header">
                                            <img src={coin.icon} alt={coin.name} className="staking-icon" />
                                            <h3>{t('aiBot.staking')} {coin.name}</h3>
                                        </div>

                                        <p className="staking-duration-label">{t('aiBot.duration')}</p>

                                        <div className="staking-durations">
                                            {coin.durations.map(duration => (
                                                <div
                                                    key={duration}
                                                    className={`staking-duration-option ${coin.active === duration ? 'active' : ''}`}
                                                    onClick={() => coin.setActive(duration)}
                                                >
                                                    {duration} {t('aiBot.days')}
                                                </div>
                                            ))}
                                        </div>

                                        <p className="staking-note">{t('aiBot.tapToSee')}</p>

                                        <div className="staking-min">
                                            <span>{t('aiBot.minVal')}</span>
                                            <strong>{coin.min}</strong>
                                        </div>

                                        <button className="staking-btn" onClick={() => coin.onClick(coin.symbol.toLowerCase())}>
                                            Trade
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="staking-bot-info">
                                <div className="staking-bot-left">
                                    <h4>Automated Trading Bot</h4>
                                    <p>
                                        Let our smart trading bot handle the heavy lifting. It executes trades around the clock without needing your constant attention—generating profits 24/7 while giving you back your valuable time.
                                    </p>
                                    <h4>Profitable in Any Market Cycle</h4>
                                    <p>
                                        Whether the market is going up, down, or moving sideways, our bot has you covered. Simply identify the current trend, select the appropriate strategy, and let the algorithm take care of the rest.
                                    </p>
                                </div>
                                <div className="staking-bot-right">
                                    <h4>Why Choose a Trading Bot?</h4>
                                    <p>
                                        Trading bots use advanced algorithmic strategies tailored for different market conditions—bullish, bearish, or sideways.
                                    </p>
                                    <p>
                                        Unlike manual trading, a bot works 24/7, automatically spotting and executing profitable trades—even while you sleep.
                                    </p>
                                    <p>
                                        Plus, bots eliminate emotional trading. No fear, no hesitation—just consistent, data-driven execution. Trade smarter, not harder.
                                    </p>
                                </div>
                            </div>

                            {/* Rest of your component remains similar but with updated profit calculation */}
                            {/* I've focused on the key changes for dynamic rate control */}

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
                                Trade
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
                                                        placeholder={t("aiBot.lockedAmount")}
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
                                                            <span>{t("aiBot.lockedAmount")}</span>
                                                        </legend>
                                                    </fieldset>
                                                </div>
                                                <p
                                                    className="MuiFormHelperText-root MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-126giv0"
                                                    id=":r3:-helper-text"
                                                >
                                                    {t("aiBot.totalBalance")}{" "}
                                                    {`${btcBalance.toFixed(8)} (${(
                                                        btcBalance * liveBtc
                                                    ).toFixed(2)} USD)`}{" "}
                                                    BTC
                                                </p>
                                            </div>
                                            <div className="MuiStack-root css-9npne8">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.rate")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {baseRatedBtc}{" "}
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.minVal")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    0.0117769844 BTC
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.estInterest")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {estInterest.toFixed(8)} BTC {`(${(
                                                        estInterest * liveBtc
                                                    ).toFixed(2)} USD)`}
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.totalAmount")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {(parseAmountBtc + parsrIntBtc).toFixed(8)} BTC  {`(${(
                                                        (parseAmountBtc + parsrIntBtc) * liveBtc
                                                    ).toFixed(2)} USD)`}
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
                                                        Trade
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
                                                        placeholder={t("aiBot.lockedAmount")}
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
                                                            <span>{t("aiBot.lockedAmount")}</span>
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
                                                    {t("aiBot.rate")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {baseRatedEth}{" "}
                                                    {/* {activeDurationEth === 30
                                                        ? "11%"
                                                        : activeDurationEth === 60
                                                            ? "45%"
                                                            : activeDurationEth === 90
                                                                ? "123%"
                                                                : "..."} */}
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.minVal")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    0.1969969781 ETH
                                                </span>
                                            </div>

                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.estInterest")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {estInterest.toFixed(8)} ETH  {`(${(
                                                        estInterest * 2640
                                                    ).toFixed(2)} USD)`}
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.totalAmount")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {(parseAmountEth + parsrIntEth).toFixed(8)} ETH  {`(${(
                                                        (parseAmountEth + parsrIntEth) * 2640
                                                    ).toFixed(2)} USD)`}
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
                                                        Trade
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
                                                        placeholder={t("aiBot.lockedAmount")}
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
                                                            <span>{t("aiBot.lockedAmount")}</span>
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
                                                            {t("aiBot.totalBalance")}{" "}
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
                                                    {t("aiBot.rate")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {baseRatedUsdt}{" "}
                                                    {/* {activeDurationUsdt === 30
                                                        ? "11%"
                                                        : activeDurationUsdt === 60
                                                            ? "45%"
                                                            : activeDurationUsdt === 90
                                                                ? "123%"
                                                                : "..."} */}
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.minVal")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    500.3001801081 USDT
                                                </span>
                                            </div>

                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.estInterest")}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                    {estInterest.toFixed(2)} USDT
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.totalAmount")}
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
                                                        Trade
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

            {/* Modal and other components remain similar */}
        </>
    );
};

export default AiTrading;