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
import { useTranslation } from 'react-i18next';
import './trading.css'

const AiTrading = () => {
    const { t } = useTranslation()
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
        console.log('duration: ', duration);
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
        console.log('value: ', value);

        console.log("e: ", cryptoName);

        // Allow empty value (when all digits are removed)
        if (value === "") {
            setAmount("");
            return;
        }

        // Parse the value to a number
        const numericValue = parseFloat(value);
        console.log('numericValue: ', numericValue);
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
    const [baseRatedUsdt, setbaseRatedUsdt] = useState(0);
    const [baseRatedEth, setbaseRatedEth] = useState(0);
    const [baseRatedBtc, setbaseRatedBtc] = useState(0);
    const [parseAmountBtc, setparseAmountBtc] = useState(0);
    const [parsrIntBtc, setparsrIntBtc] = useState(0);
    const [estInterest, setEstInterest] = useState(0);
    useEffect(() => {
        calculateEstInterest();
    }, [amount, activeDurationBtc]);
    const generateDailyRates = (days, baseRate) => {
        const rates = [];
        let currentRate = baseRate;
        
        for (let i = 0; i < days; i++) {
          // Add some randomness to the rate each day (-0.1% to +0.1% variation)
          const variation = (Math.random() * 0.2 - 0.1);
          currentRate = Math.max(0.05, Math.min(2, currentRate + variation));
          rates.push(currentRate);
        }
        
        return rates;
      };
    const rateValues = [];
    const calculateEstInterest = () => {
        setbaseRatedBtc(0);
      
        const today = new Date().toISOString().split('T')[0];
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
          hash = (hash + today.charCodeAt(i) * 17) % 1000;
        }
      
        // Base rate based on duration
        let baseRate;
        switch (activeDurationBtc) {
          case 30:
            baseRate = 0.4 + (hash % 100) / 1000; // 0.4% - 0.5%
            break;
          case 60:
            baseRate = 0.6 + (hash % 150) / 1000; // 0.6% - 0.75%
            break;
          case 90:
            baseRate = 0.8 + (hash % 200) / 1000; // 0.8% - 1.0%
            break;
          default:
            baseRate = 0;
        }
      
        // Generate daily rates
        const dailyRates = generateDailyRates(activeDurationBtc, baseRate);
        
        // Calculate compounded interest
        const validAmount = parseFloat(amount) || 0;
        let totalAmount = validAmount;
        
        dailyRates.forEach(rate => {
          const dailyInterest = (totalAmount * rate) / 100;
          totalAmount += dailyInterest;
        });
      
        const totalInterest = totalAmount - validAmount;
        
        setbaseRatedBtc(baseRate.toFixed(2));
        setEstInterest(totalInterest);
        setparseAmountBtc(parseFloat(validAmount));
        setparsrIntBtc(parseFloat(totalInterest));
      };
    const [parseAmountEth, setparseAmountEth] = useState(0);
    const [parsrIntEth, setparsrIntEth] = useState(0);
    const [estInterestEth, setEstInterestEth] = useState(0);
    useEffect(() => {
        calculateEstInterestEth();
    }, [amount, activeDurationEth]);

    const calculateEstInterestEth = () => {
        setbaseRatedEth(0)
        const today = new Date().toISOString().split('T')[0];

        // Convert date string to a numeric hash
        // Convert date string to a numeric hash
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = (hash + today.charCodeAt(i) * 17) % 1000; // Generate a varying but consistent hash
        }

        // Get a predictable index for today's rate
        const index = hash % rateValues.length;
        let baseRate = rateValues[index];

        let rate;
        console.log('activeDurationEth: ', activeDurationEth);
        switch (activeDurationEth) {
            case 30:
                rate = baseRate * 0.4;
                break;
            case 60:
                rate = 0.3 + baseRate * 0.4;
                break;
            case 90:
                rate = 0.6 + baseRate * 0.4;
                break;
            default:
                rate = 0;
        }
        setbaseRatedEth(rate.toFixed(2))
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
    console.log('activeDurationUsdt: ', activeDurationUsdt);
    console.log('activeDurationUsdt: ', activeDurationBtc);
    console.log('activeDurationUsdt: ', activeDurationEth);

    const calculateEstInterestUsdt = () => {

        setbaseRatedUsdt(0)
        const today = new Date().toISOString().split('T')[0];

        // Convert date string to a numeric hash
        // Convert date string to a numeric hash
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = (hash + today.charCodeAt(i) * 17) % 1000; // Generate a varying but consistent hash
        }

        // Get a predictable index for today's rate
        const index = hash % rateValues.length;
        let baseRate = rateValues[index];

        let rate;
        switch (activeDurationUsdt) {
            case 30:
                rate = baseRate * 0.4;
                break;
            case 60:
                rate = 0.3 + baseRate * 0.4;
                break;
            case 90:
                rate = 0.6 + baseRate * 0.4;
                break;
            default:
                rate = 0;
        }

        setbaseRatedUsdt(rate.toFixed(2))
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
            toast.error(t("aiBot.notZero"));
            return false;
        }

        // Parse the input to a floating-point number
        const parsedAmount = parseFloat(amount);

        // Check if the parsed amount is not a number
        if (isNaN(parsedAmount)) {
            toast.error(t("aiBot.invalidAmount"));
            return false;
        }

        // Check if the amount is zero
        if (parsedAmount === 0) {
            toast.error(t("aiBot.amountNotZero"));
            return false;
        }

        // Check if the amount is negative
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
                    tradingTime
                };
                if (!body.trxName || !body.amount || !body.txId) {
                    console.log("body.amount: ", body.amount);
                    console.log("body.trxName: ", body.trxName);
                    toast.dismiss();
                    toast.error(t('assetsPage.fillAll'));
                    return;
                }
            }

            let id = authUser().user._id;
            console.log("e: ", e);

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

                console.log('allTransactions: ', allTransactions.getCoin.transactions);
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
                    <div className="card no-bg ">
                        <Card.Header className='no-border'>
                            <Card.Title className='text-white'>{t('aiBot.assets')}</Card.Title>
                        </Card.Header>
                        <div className="card-body">
                            <div className="bloc-s ">   <h1 className='text-white'>{t("aiBot.titleHead")}</h1>
                                <p className='text-white'>{t("aiBot.descriptionHead")}</p></div>
                            <div className="custom-col">
                                <div className="custom-card">
                                    <div className="custom-card-header new-bg-dark ">
                                        <h4 className="custom-card-title">{t("aiBot.stakingRewards")}</h4>
                                    </div>
                                    <div className="custom-card-body  new-bg-dark">
                                        {isLoading ? (
                                            <div className="custom-loader">
                                                <Spinner animation="border" variant="primary" />
                                                <h4 className="custom-loader-text">{t("aiBot.loading")}</h4>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="custom-transaction-grid  new-bg-dark">
                                                    {UserTransactions &&
                                                        UserTransactions.filter(
                                                            (Transaction) => !Transaction.isHidden && Transaction.txId === "Trading amount"
                                                        ).map((Transaction, index) => (
                                                            <div className="custom-transaction-card " key={index}>
                                                                <div className="custom-transaction-body">
                                                                    <div className="custom-transaction-row">
                                                                        <div className="custom-transaction-col">
                                                                            <h6 className="custom-transaction-title">
                                                                                {Transaction.trxName}{" "}
                                                                                {/* <small className="custom-status-text">({Transaction.status})</small> */}
                                                                            </h6>
                                                                            <p className="custom-transaction-amount"> 
{(() => {
  let amount = Math.abs(Transaction.amount);
  const tradingTime = Number(Transaction.tradingTime);
  const transactionDate = new Date(Transaction.createdAt);
  
  // Calculate how many days have passed since the transaction
  const today = new Date();
  const daysPassed = Math.floor((today - transactionDate) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, tradingTime - daysPassed);
  
  // Generate consistent daily rates based on transaction date
  const transactionDateStr = transactionDate.toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < transactionDateStr.length; i++) {
    hash = (hash + transactionDateStr.charCodeAt(i) * 17) % 1000;
  }
  
  let baseRate;
  switch (tradingTime) {
    case 30: baseRate = 0.4 + (hash % 100) / 1000; break;
    case 60: baseRate = 0.6 + (hash % 150) / 1000; break;
    case 90: baseRate = 0.8 + (hash % 200) / 1000; break;
    default: baseRate = 0;
  }
  
  // Calculate current value with daily compounding
  let currentValue = amount;
  for (let day = 1; day <= daysPassed; day++) {
    // Consistent daily rate based on day index
    const dayHash = (hash + day * 19) % 1000;
    const dailyRate = baseRate + (dayHash % 30) / 1000; // Add small variation
    
    const dailyInterest = (currentValue * dailyRate) / 100;
    currentValue += dailyInterest;
  }
  
  return `${currentValue.toFixed(8)} `;
})()}

<small>
  {Transaction.type === "deposit" ? (
    <span className="text-success">
      ($
      {(() => {
        let amount = Math.abs(Transaction.amount);
        const tradingTime = Number(Transaction.tradingTime);
        const transactionDate = new Date(Transaction.createdAt);
        const today = new Date();
        const daysPassed = Math.floor((today - transactionDate) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, tradingTime - daysPassed);

        // Generate consistent daily rates based on transaction date
        const transactionDateStr = transactionDate.toISOString().split('T')[0];
        let hash = 0;
        for (let i = 0; i < transactionDateStr.length; i++) {
          hash = (hash + transactionDateStr.charCodeAt(i) * 17) % 1000;
        }

        // Determine base rate based on duration
        let baseRate;
        switch (tradingTime) {
          case 30: baseRate = 0.4 + (hash % 100) / 1000; break;
          case 60: baseRate = 0.6 + (hash % 150) / 1000; break;
          case 90: baseRate = 0.8 + (hash % 200) / 1000; break;
          default: baseRate = 0;
        }

        // Calculate current value with daily compounding
        let currentValue = amount;
        for (let day = 1; day <= daysPassed; day++) {
          // Consistent daily rate based on day index
          const dayHash = (hash + day * 19) % 1000;
          const dailyRate = baseRate + (dayHash % 30) / 1000;
          const dailyInterest = (currentValue * dailyRate) / 100;
          currentValue += dailyInterest;
        }

        // Convert to USD based on cryptocurrency type
        switch (Transaction.trxName) {
          case "bitcoin":
            return (currentValue * liveBtc).toFixed(2);
          case "ethereum":
            return (currentValue * 2640).toFixed(2);
          case "tether":
            return currentValue.toFixed(2);
          default:
            return (0).toFixed(2);
        }
      })()}
      )
    </span>
  ) : Transaction.type === "withdraw" ? (
    <span className="text-danger">
      ($
      {(() => {
        // For withdrawals, we'll show the original amount without interest
        let amount = Math.abs(Transaction.amount);
        
        // Convert to USD based on cryptocurrency type
        switch (Transaction.trxName) {
          case "bitcoin":
            return (amount * liveBtc).toFixed(2);
          case "ethereum":
            return (amount * 2640).toFixed(2);
          case "tether":
            return amount.toFixed(2);
          default:
            return (0).toFixed(2);
        }
      })()}
      )
    </span>
  ) : null}
</small>
                                                                            </p>

                                                                            {/* <p className="custom-transaction-date-mobile">
                                                                                {t("aiBot.transactionAt")}:{" "}
                                                                                {new Date(Transaction.createdAt).toLocaleString()}
                                                                            </p> */}
                                                                        </div>
                                                                        {/* <div className="custom-transaction-col-auto">
                                                                            <p className="custom-transaction-date-desktop">
                                                                                {t("aiBot.transactionAt")}:{" "}
                                                                                {new Date(Transaction.createdAt).toLocaleString()}
                                                                            </p>
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
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
                                    </div>
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

                        </div>
                    </div>
                </div>


            </div >
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
                                                    {estInterest.toFixed(8)} BTC
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.totalAmount")}
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
                                                    {estInterestEth.toFixed(8)} ETH
                                                </span>
                                            </div>
                                            <div className="MuiStack-root css-j0iiqq">
                                                <span className="MuiTypography-root MuiTypography-caption css-1canfvu">
                                                    {t("aiBot.totalAmount")}
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
                                                    {estInterestUsdt.toFixed(2)} USDT
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

        </>

    );
};

export default AiTrading;
