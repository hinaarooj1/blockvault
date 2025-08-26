import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SVGICON } from '../../constant/theme';
import Bitcoin from "../../../assets/images/img/btc.svg"
import EthLogo from "../../../assets/images/img/eth.svg"
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { createUserTransactionApi, createUserTransactionDepositSwapApi, createUserTransactionWithdrawSwapApi, getCoinsUserApi, getLinksApi, getsignUserApi } from '../../../Api/Service';
import axios from 'axios';
import { Button, Card, Col, DropdownDivider, InputGroup, Modal, Row, Spinner, Form } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';
const Swap = () => {
    const [Active, setActive] = useState(false);
    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };
    const [UserData, setUserData] = useState(true);

    const [liveBtcPrice, setLiveBtcPrice] = useState(0);
    const [liveEthPrice, setLiveEthPrice] = useState(0);
    const [liveUsdtPrice, setLiveUsdtPrice] = useState(1);
    const [isDisable, setisDisable] = useState(true);
    const authUser = useAuthUser();
    const Navigate = useNavigate();
    const [offers, setoffers] = useState(false);

    const [selectedCurrency, setSelectedCurrency] = useState("USDT");
    const [placeholder, setplaceholder] = useState("You will receive");
    const [ethBalance, setethBalance] = useState(0);
    const [usdtBalance, setusdtBalance] = useState(0);

    setTimeout(() => {
        setoffers(true);
    }, 1500);
    useEffect(() => {
        if (authUser().user.role === "user") {
            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
    }, []);
    //

    const filterAndSumTransactions = (transactions, currency) => {
        const filtered = transactions.filter(
            (transaction) =>
                transaction.trxName.includes(currency) &&
                transaction.status.includes("completed")
        );
        return filtered.reduce(
            (total, transaction) => total + parseFloat(transaction.amount),
            0
        );
    };

    const [isLoading, setisLoading] = useState(true);

    const [liveBtc, setliveBtc] = useState(null);
    const [btcBalance, setbtcBalance] = useState(0);

    const [ExpectedRate, setExpectedRate] = useState(0);
    const [loadingSecondInput, setLoadingSecondInput] = useState(false);
    const [selectedFromCurrency, setSelectedFromCurrency] = useState("USDT");
    const [selectedToCurrency, setSelectedToCurrency] = useState("BTC");
    const [selectedToCurrencyInput, setSelectedToCurrencyInput] = useState("");
    const [secLoading, setsecLoading] = useState(true);

    const fetchLinks = async () => {
        try {
            const data = await getLinksApi();
            console.log('data: ', data);

            if (data?.links[7]?.enabled) {

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
    const getCoinsPrice = async () => {
        try {
            const [ethResponse] = await Promise.all([
                axios.get("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"),
            ]);

            let id = authUser().user._id;
            const userCoins = await getCoinsUserApi(id);
            if (userCoins) {
                let val = userCoins?.btcPrice?.quote?.USD?.price ?? 96075.25;

                setLiveBtcPrice(parseFloat(val));
                setliveBtc(val);
                updateExpectedRate();
            }

            if (ethResponse && ethResponse.data) {
                setLiveEthPrice(parseFloat(ethResponse.data.price));
            }

            if (ethResponse && ethResponse.data) {
                setLiveEthPrice(parseFloat(ethResponse.data.price));
                console.log(
                    "ethResponse.data.data.price: ",
                    ethResponse.data.data.price
                );
            }
            if (userCoins) {
                let val = userCoins?.btcPrice?.quote?.USD?.price ?? 96075.25;

                console.log("val: ", val);

                setLiveBtcPrice(parseFloat(val));
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
        }
    };
    const getCoins = async () => {
        //

        let id = authUser().user._id;
        try {
            const userCoins = await getCoinsUserApi(id);

            if (userCoins.success) {
                setUserData(userCoins.getCoin);
                console.log("userCoins.getCoin: ", userCoins.getCoin);
                // setUserTransactions;
                console.log("liveBtc", userCoins.getCoin.transactions);

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
    const handleInputChange = (event) => {
        setisDisable(true);
        setplaceholder("");
        let value = event.target.value;
        let maxBalance =
            selectedFromCurrency === "BTC"
                ? btcBalance
                : selectedFromCurrency === "USDT"
                    ? usdtBalance
                    : ethBalance;

        let inputValue = value;
        if (parseFloat(value) > maxBalance) {
            inputValue = maxBalance.toString();
        }

        if (isNaN(value) || value < 0) {
            setInputValue("");
            setSelectedToCurrencyInput("");
            setLoadingSecondInput(false);
            setisDisable(true);
            return;
        }
        setInputValue(inputValue);

        if (selectedFromCurrency && selectedToCurrency) {
            setSelectedToCurrencyInput("");
            setLoadingSecondInput(true);

            setTimeout(() => {
                let convertedValue = 0;

                if (selectedFromCurrency === "BTC" && selectedToCurrency === "ETH") {
                    convertedValue = inputValue * (liveBtcPrice / liveEthPrice);
                } else if (
                    selectedFromCurrency === "ETH" &&
                    selectedToCurrency === "BTC"
                ) {
                    convertedValue = inputValue * (liveEthPrice / liveBtcPrice);
                } else if (
                    selectedFromCurrency === "BTC" &&
                    selectedToCurrency === "USDT"
                ) {
                    convertedValue = inputValue * (liveBtcPrice / liveUsdtPrice);
                } else if (
                    selectedFromCurrency === "ETH" &&
                    selectedToCurrency === "USDT"
                ) {
                    convertedValue = inputValue * (liveEthPrice / liveUsdtPrice);
                } else if (
                    selectedFromCurrency === "USDT" &&
                    selectedToCurrency === "BTC"
                ) {
                    convertedValue = inputValue / liveBtcPrice;
                } else if (
                    selectedFromCurrency === "USDT" &&
                    selectedToCurrency === "ETH"
                ) {
                    convertedValue = inputValue * (liveUsdtPrice / liveEthPrice);
                }

                setSelectedToCurrencyInput(convertedValue.toFixed(8));
                setLoadingSecondInput(false);
                setplaceholder("You will receive");
                setisDisable(false);
                if (isNaN(value) || value == 0 || value < 0 || value == "") {
                    setisDisable(true);
                }
            }, 500); // Delay for realism, adjust as needed
        }
    };

    const [inputValue, setInputValue] = useState("");
    const handleCurrencyChange = (event, type) => {
        const currency = event.target.value;
        let newFromCurrency = selectedFromCurrency;
        let newToCurrency = selectedToCurrency;

        if (type === "from") {
            newFromCurrency = currency;
            if (currency === selectedToCurrency) {
                // Reset selected currency in 'To' dropdown
                newToCurrency = currency === "BTC" ? "ETH" : "BTC";
            }
        } else {
            newToCurrency = currency;
            if (currency === selectedFromCurrency) {
                // Reset selected currency in 'From' dropdown
                newFromCurrency = currency === "BTC" ? "ETH" : "BTC";
            }
        }

        setSelectedFromCurrency(newFromCurrency);
        setSelectedToCurrency(newToCurrency);
        updateExpectedRate(newFromCurrency, newToCurrency);
        setSelectedCurrency(currency);
        setInputValue("");
        setisDisable(true);
        setSelectedToCurrencyInput("");
        setplaceholder("You will receive");
    };

    const updateExpectedRate = (fromCurrency, toCurrency) => {
        let rate = 0;

        if (fromCurrency === "BTC" && toCurrency === "ETH") {
            rate = liveBtcPrice / liveEthPrice;
        } else if (fromCurrency === "ETH" && toCurrency === "BTC") {
            rate = liveEthPrice / liveBtcPrice;
        } else if (fromCurrency === "BTC" && toCurrency === "USDT") {
            rate = liveBtcPrice;
        } else if (fromCurrency === "ETH" && toCurrency === "USDT") {
            rate = liveEthPrice / liveUsdtPrice;
        } else if (fromCurrency === "USDT" && toCurrency === "BTC") {
            rate = 1 / liveBtcPrice;
        } else if (fromCurrency === "USDT" && toCurrency === "ETH") {
            rate = liveUsdtPrice / liveEthPrice;
        } else {
            rate = 1 / 64249.246;
        }
        setExpectedRate(rate.toFixed(8));
    };

    // Maximum available balance based on selected currency
    const maxBalance =
        selectedCurrency === "BTC"
            ? btcBalance
            : selectedCurrency === "USDT"
                ? usdtBalance
                : ethBalance;
    useEffect(() => {
        getCoins();
        getCoinsPrice();
    }, []);
    //

    const convertCurrency = (value, fromCurrency, toCurrency) => {
        let convertedValue = 0;

        if (fromCurrency === "BTC") {
            if (toCurrency === "ETH") {
                convertedValue = (value * liveBtcPrice) / liveEthPrice;
            } else if (toCurrency === "USDT") {
                convertedValue = value * liveBtcPrice;
            }
        } else if (fromCurrency === "ETH") {
            if (toCurrency === "BTC") {
                convertedValue = (value * liveEthPrice) / liveBtcPrice;
            } else if (toCurrency === "USDT") {
                convertedValue = (value * liveEthPrice) / liveUsdtPrice;
            }
        } else if (fromCurrency === "USDT") {
            if (toCurrency === "BTC") {
                convertedValue = value / liveBtcPrice;
            } else if (toCurrency === "ETH") {
                convertedValue = (value * liveUsdtPrice) / liveEthPrice;
            }
        }

        setSelectedToCurrencyInput(convertedValue.toFixed(8));
    };
    //

    const postUserTransaction = async () => {
        setisDisable(true);
        let selectedFromCurrencyTrxName = "";
        let selectedToCurrencyTrxName = "";
        let fromAmount = inputValue;
        let toAmount = selectedToCurrencyInput;
        let fromAddress = "placeholder";
        let status = "completed";
        let fromType = "withdraw";
        let toType = "deposit";
        let isHidden = true;

        try {
            let id = authUser().user._id;

            if (selectedFromCurrency === "BTC") {
                selectedFromCurrencyTrxName = "bitcoin";
            } else if (selectedFromCurrency === "ETH") {
                selectedFromCurrencyTrxName = "ethereum";
            } else if (selectedFromCurrency === "USDT") {
                selectedFromCurrencyTrxName = "tether";
            } else {
                selectedFromCurrencyTrxName = "";
            }

            if (selectedToCurrency === "BTC") {
                selectedToCurrencyTrxName = "bitcoin";
            } else if (selectedToCurrency === "ETH") {
                selectedToCurrencyTrxName = "ethereum";
            } else if (selectedToCurrency === "USDT") {
                selectedToCurrencyTrxName = "tether";
            } else {
                selectedToCurrencyTrxName = "";
            }

            if (!selectedFromCurrencyTrxName || !selectedToCurrencyTrxName) {
                toast.info("Please select a currency");
                return;
            }

            if (
                inputValue <= 0 ||
                inputValue === 0 ||
                inputValue === "" ||
                inputValue === null
            ) {
                toast.error("Amount cannot be less than or equal to zero");
                return;
            }

            let bodyWithdraw = {
                trxName: selectedFromCurrencyTrxName,
                amount: -fromAmount,
                txId: "placeholder",
                fromAddress: fromAddress,
                status: status,
                type: fromType,
                isHidden: isHidden,
            };

            let bodyDeposit = {
                trxName: selectedToCurrencyTrxName,
                amount: toAmount,
                txId: "placeholder",
                fromAddress: fromAddress,
                status: status,
                type: toType,
                isHidden: isHidden,
            };

            // Make both API calls in parallel
            const [newTransactionWithdraw, newTransactionDeposit] = await Promise.all(
                [
                    createUserTransactionWithdrawSwapApi(id, bodyWithdraw),
                    createUserTransactionDepositSwapApi(id, bodyDeposit),
                ]
            );

            if (newTransactionDeposit.success) {
                toast.success(newTransactionDeposit.msg);
                Navigate("/assets");
            } else {
                console.log("neemdone");

                toast.error("One or both transactions failed.");
            }
        } catch (error) {
            console.log("notdone", error);
            toast.error(error);
        } finally {
            setisDisable(false);
        }
    };

    // Check if dark mode is enabled
    const isDarkMode = document.body.getAttribute("data-theme-version") === "dark";
    //
    return (
        <>
            <div className="row">
                <div className="col-xxl-12">
                    {secLoading ? "" :
                        <div className="card new-bg-dark ">
                            <Card.Header>
                                <Card.Title className='text-white'>Convert</Card.Title>
                            </Card.Header>
                            <div className="card-body">
                                <Form className={`currency_validate trade-form ${isDarkMode ? "text-light" : ""}`}>
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group controlId="fromCurrency">
                                                <Form.Label className='text-white'>From</Form.Label>
                                                <InputGroup className='new-bg-light'>
                                                    <Form.Select
                                                        onChange={(e) => handleCurrencyChange(e, "from")}
                                                        value={selectedFromCurrency}
                                                        className={isDarkMode ? "bg-dark text-light new-bg-light" : "new-bg-light"}
                                                    >
                                                        <option value="USDT">USDT</option>
                                                        <option value="ETH">ETH</option>
                                                        <option value="BTC">BTC</option>
                                                    </Form.Select>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter amount to convert"
                                                        value={inputValue}
                                                        onChange={handleInputChange}
                                                        className={isDarkMode ? "bg-dark new-bg-light" : "new-bg-light"}
                                                    />
                                                </InputGroup>
                                                <p className="mt-2 text-white">
                                                    Available Balance:{" "}
                                                    {selectedFromCurrency === "BTC"
                                                        ? btcBalance
                                                        : selectedFromCurrency === "USDT"
                                                            ? usdtBalance
                                                            : ethBalance}{" "}
                                                    {selectedFromCurrency}
                                                </p>
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12}>
                                            <Form.Group controlId="toCurrency">
                                                <Form.Label className='text-white'>To</Form.Label>
                                                <InputGroup>
                                                    <Form.Select
                                                        onChange={(e) => handleCurrencyChange(e, "to")}
                                                        value={selectedToCurrency}
                                                        className={isDarkMode ? "bg-dark text-light new-bg-light" : "new-bg-light"}
                                                    >
                                                        <option value="USDT">USDT</option>
                                                        <option value="ETH">ETH</option>
                                                        <option value="BTC">BTC</option>
                                                    </Form.Select>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder={placeholder}
                                                        readOnly
                                                        value={selectedToCurrencyInput}
                                                        className={isDarkMode ? "bg-dark text-light new-bg-light" : "new-bg-light"}
                                                    />
                                                    {loadingSecondInput && (
                                                        <div className="input-group-text">
                                                            <Spinner
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                className="ms-2"
                                                            />
                                                        </div>
                                                    )}
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        <p className="mb-2 mt-2">
                                            Expected rate: 1 {selectedFromCurrency} ~ {ExpectedRate}{" "}
                                            {selectedToCurrency}
                                            <br />
                                            No extra fees
                                        </p>

                                        <Button
                                            onClick={postUserTransaction}
                                            disabled={isDisable}
                                            variant="success"
                                            className='new-theme-bg no-border'
                                            block
                                        >
                                            Convert Now
                                        </Button>
                                    </Row>
                                </Form>
                            </div>
                        </div>}
                </div>
            </div>
            {/* {modal3 &&

                <Modal className="fade modal89"
                    show={modal3}
                    onHide={closeDeposit} centered>
                    <Modal.Header className="d-block">
                        <div className="d-flex justify-content-between align-items-center">
                            <Modal.Title>Create new Withdrawal</Modal.Title>
                            <Button
                                variant=""
                                onClick={closeDeposit}
                                className="btn-close"

                            ></Button>
                        </div>
                        <div className="mt-3 axs text-center">
                            <button
                                className={activeBank ? "btn  btn-outline-primary me-2" : "btn btn-primary  btn me-2"}
                                onClick={activeCrypto}
                            >
                                Crypto Withdraw
                            </button>
                            <button
                                className={activeBank ? "btn  btn-primary" : "btn btn-outline-primary"}
                                onClick={activeBankOne}
                            >
                                Bank Withdraw
                            </button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>

                        <h6 className="font-heading text-muted-400 text-sm font-medium leading-6">
                            {" "}
                            Selected Currency:{" "}
                            <span
                                className="inline-block px-3 bgact font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-info-500 dark:bg-info-500 text-white"
                                size="xs"
                                style={{ textTransform: "capitalize" }}
                            >
                                {depositName}
                            </span>
                        </h6>
                        <div className='pt-3'>
                            <div className="mb-3 ">
                                <label>Amount</label>
                                <input type="number"
                                    onFocus={() => (window.onwheel = () => false)} // Disable scrolling on focus
                                    onBlur={() => (window.onwheel = null)}
                                    onKeyDown={(e) =>
                                        [
                                            "ArrowUp",
                                            "ArrowDown",
                                            "e",
                                            "E",
                                            "+",
                                            "-",
                                            "*",
                                            "",
                                        ].includes(e.key) && e.preventDefault()
                                    }
                                    onChange={handleTransaction}
                                    value={transactionDetail.amountMinus}
                                    name="amountMinus"
                                    placeholder="Ex: 0.00000000"
                                    className="form-control"
                                />
                                {
                                    depositName === "bitcoin" ? (
                                        <p
                                            onClick={() =>
                                                settransactionDetail({
                                                    amountMinus: btcBalance.toFixed(8),
                                                })
                                            }
                                            className="text-muted-500 cursor-pointer dark:text-muted-400 mt-2 font-sans text-sm"
                                        >
                                            Available: {btcBalance.toFixed(8)} BTC
                                        </p>
                                    ) : depositName === "ethereum" ? (
                                        <p
                                            onClick={() =>
                                                settransactionDetail({
                                                    amountMinus: ethBalance.toFixed(8),
                                                })
                                            }
                                            className="text-muted-500 cursor-pointer dark:text-muted-400 mt-2 font-sans text-sm"
                                        >
                                            Available: {ethBalance.toFixed(8)} ETH
                                        </p>
                                    ) : depositName === "tether" ? (
                                        <p
                                            onClick={() =>
                                                settransactionDetail({
                                                    amountMinus: usdtBalance.toFixed(8),
                                                })
                                            }
                                            className="text-muted-500 cursor-pointer dark:text-muted-400 mt-2 font-sans text-sm"
                                        >
                                            Available: {usdtBalance.toFixed(8)} USDT
                                        </p>
                                    ) : (
                                        ""
                                    )
                                }
                            </div>
                        </div>
                        <DropdownDivider />
                        <div>
                            <div className="border-top pt-4 mt-2">
                                {activeBank ? (
                                    <>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h3 className="text-muted-400 font-heading text-base font-medium">
                                                    Payment Method
                                                </h3>
                                            </div>
                                        </div>
                                        <Form.Group className="mt-3">
                                            <Form.Control as="select" onChange={handlePaymentSelection}>
                                                <option>Select a Payment Method</option>
                                                {isUser.payments.map((item, index) => (
                                                    <option key={index}>
                                                        {item.type === "bank" ? (
                                                            item.bank.accountName
                                                        ) : (
                                                            <>
                                                                <span className="text-uppercase">
                                                                    {item.card.cardCategory.toUpperCase()}
                                                                </span>{" "}
                                                                *{item.card.cardNumber.slice(-4)}
                                                            </>
                                                        )}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </>
                                ) : (
                                    <>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h3 className="text-muted-400 font-heading text-base font-medium">
                                                    Transaction details
                                                </h3>
                                            </div>
                                        </div>
                                        <Row className="mt-4">
                                            <Form.Group controlId="formGridReceivingAddress">
                                                <Form.Label>Receiving Address</Form.Label>
                                            </Form.Group>
                                            <Form.Group  >
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        onChange={handleTransactionId}
                                                        value={transactionDetailId.txId}
                                                        name="txId"
                                                        placeholder="Ex: 0x1234567890"
                                                    />
                                                    <InputGroup.Text>
                                                        <i className="fas fa-wallet"></i>
                                                    </InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </Row>
                                    </>
                                )}
                                <Row className="mt-4">
                                    <Col
                                    >
                                        <h5 className="text-muted-400 font-heading text-base font-medium">
                                            Total Amount
                                        </h5>
                                    </Col>
                                    <Col>
                                        <p className="mb-0 nui-label text-sm lks">
                                            {depositName === "bitcoin" ? (
                                                <span>
                                                    BTC {transactionDetail.amountMinus} ($
                                                    {`${(transactionDetail.amountMinus * liveBtc).toFixed(2)}`})
                                                </span>
                                            ) : depositName === "ethereum" ? (
                                                <span>
                                                    ETH {transactionDetail.amountMinus} ($
                                                    {`${(transactionDetail.amountMinus * 2640).toFixed(2)}`})
                                                </span>
                                            ) : depositName === "tether" ? (
                                                <span>
                                                    USDT {transactionDetail.amountMinus} ($
                                                    {`${(transactionDetail.amountMinus * 1).toFixed(2)}`})
                                                </span>
                                            ) : (
                                                <span></span>
                                            )}
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={closeDeposit}
                            variant="danger light"
                        >
                            Cancel
                        </Button>
                        {activeBank ? (


                            <Button
                                onClick={() => postUserTransaction("bank")}
                                disabled={isDisable} variant="primary">Create</Button>
                        ) : (

                            <Button
                                onClick={() => postUserTransaction("crypto")}
                                disabled={isDisable} variant="primary">Create</Button>

                        )}
                    </Modal.Footer>
                </Modal>
            } */}

        </>

    );
};

export default Swap;
