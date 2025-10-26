import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SVGICON } from '../../constant/theme';
import Bitcoin from "../../../assets/images/img/btc.svg"
import EthLogo from "../../../assets/images/img/eth.svg"
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { createUserTransactionApi, getCoinsUserApi, getLinksApi, getsignUserApi, getUserCoinApi } from '../../../Api/Service';
import axios from 'axios';
import { Button, Card, Col, Form, DropdownDivider, InputGroup, Modal, Row, Spinner, Table } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';


const StocksSec = () => {
    const [stocksNew, setStocksNew] = useState([]);
    const [selectedStock, setSelectedStock] = useState('');
    const [stockValue, setStockValue] = useState('');
    const [apiLoading, setapiLoading] = useState(false);
    const [stocks, setStocks] = useState({
        stockName: '',
        stockSymbol: '',
        stockAmount: 1,
        stockValue: ''
    });
    const [modal, setModal] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [UserTransactions, setUserTransactions] = useState([]);
    const [singleTransaction, setsingleTransaction] = useState();
    const [userDetail, setuserDetail] = useState({});
    const [liveBtc, setliveBtc] = useState(null);
    const [liveStockValues, setLiveStockValues] = useState({});
    let { id } = useParams();

    let authUser = useAuthUser();
    let Navigate = useNavigate();
    const [Active, setActive] = useState(false);
    const [spValue, setspValue] = useState(true);

    const [isUser, setIsUser] = useState({});
    const [secLoading, setsecLoading] = useState(true);
    const fetchLinks = async () => {
        try {
            const data = await getLinksApi();
            console.log('data: ', data);

            if (data?.links[2]?.enabled) {

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
    const getTransactions = async () => {
        try {
            // const response = await axios.get(
            //     "https://api.coindesk.com/v1/bpi/currentprice.json"
            // );
            const userCoins = await getUserCoinApi(id);

            if (userCoins.success) {
                const stocks = userCoins.getCoin.stocks;

                // Check if stocks is defined and is an array
                if (Array.isArray(stocks) && stocks !== null && stocks !== undefined) {
                    if (stocks.length > 0) {
                        console.log('stocks: ', stocks);
                        setUserTransactions(stocks.reverse()); // Set the stocks if available
                    } else {
                        setUserTransactions(null); // Set to null if no stocks are available
                    }
                } else {
                    setUserTransactions(null); // Set to null if stocks is not defined or not an array
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
            setisLoading(false);

        }
    };
    useEffect(() => {
        // Fetch live stock values when UserTransactions is updated
        if (Array.isArray(UserTransactions) && UserTransactions.length > 0) {
            const symbols = UserTransactions.map(tx => tx.stockSymbol);
            fetchStockValues(symbols);
        }
    }, [UserTransactions]);

    const fetchStockValues = async (symbols) => {
        setspValue(true)
        try {
            const stockValuePromises = symbols.map(symbol =>
                axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`)
            );
            const responses = await Promise.all(stockValuePromises);
            console.log('responses: ', responses);

            const values = {};
            responses.forEach((response, index) => {
                const symbol = symbols[index];
                const timeSeries = response.data['Time Series (5min)'];
                console.log('timeSeries: ', timeSeries);
                if (timeSeries) {
                    const latestTime = Object.keys(timeSeries)[0];
                    const latestData = timeSeries[latestTime]['1. open'];
                    values[symbol] = latestData;
                } else {
                    values[symbol] = 'N/A';
                }
            });
            setLiveStockValues(values);
        } catch (error) {
            console.error('Error fetching stock values:', error);
        } finally {
            setspValue(false)
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
            if (authUser().user._id != id) {
                Navigate("/dashboard");
            }
        }

        getTransactions();
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
    const apiKey = 'JTJDB1ZIXDMIT0WN';


    // Predefined stock symbols and their corresponding company names
    const stockData = [
        { symbol: 'ibm', name: 'IBM' },
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corporation' },
        { symbol: 'TSLA', name: 'Tesla Inc.' },
        { symbol: 'FB', name: 'Meta Platforms Inc.' },
        { symbol: 'NFLX', name: 'Netflix Inc.' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation' },
        { symbol: 'BABA', name: 'Alibaba Group Holding Ltd.' },
        { symbol: 'DIS', name: 'Walt Disney Company' },
        { symbol: 'INTC', name: 'Intel Corporation' },
        { symbol: 'CSCO', name: 'Cisco Systems Inc.' },
        { symbol: 'ORCL', name: 'Oracle Corporation' },
        { symbol: 'IBM', name: 'International Business Machines Corporation' },
        { symbol: 'BA', name: 'Boeing Co.' },
        { symbol: 'UBER', name: 'Uber Technologies Inc.' },
        { symbol: 'LYFT', name: 'Lyft Inc.' },
        { symbol: 'ZM', name: 'Zoom Video Communications Inc.' },
        { symbol: 'TWTR', name: 'Twitter Inc.' },
        { symbol: 'SNAP', name: 'Snap Inc.' },
        { symbol: 'V', name: 'Visa Inc.' },
        { symbol: 'MA', name: 'Mastercard Inc.' },
        { symbol: 'PYPL', name: 'PayPal Holdings Inc.' },
        { symbol: 'SHOP', name: 'Shopify Inc.' },
        { symbol: 'SQ', name: 'Square Inc.' },
        { symbol: 'T', name: 'AT&T Inc.' },
        { symbol: 'VZ', name: 'Verizon Communications Inc.' },
        { symbol: 'TMUS', name: 'T-Mobile US Inc.' },
        { symbol: 'KO', name: 'The Coca-Cola Company' },
        { symbol: 'PEP', name: 'PepsiCo Inc.' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
        { symbol: 'BAC', name: 'Bank of America Corporation' },
        { symbol: 'C', name: 'Citigroup Inc.' },
        { symbol: 'GS', name: 'Goldman Sachs Group Inc.' },
        { symbol: 'MS', name: 'Morgan Stanley' },
        { symbol: 'XOM', name: 'Exxon Mobil Corporation' },
        { symbol: 'CVX', name: 'Chevron Corporation' },
        { symbol: 'BP', name: 'BP p.l.c.' },
        { symbol: 'WMT', name: 'Walmart Inc.' },
        { symbol: 'COST', name: 'Costco Wholesale Corporation' },
        { symbol: 'HD', name: 'The Home Depot Inc.' },
        { symbol: 'LOW', name: 'Lowe\'s Companies Inc.' },
        { symbol: 'NKE', name: 'Nike Inc.' },
        { symbol: 'ADBE', name: 'Adobe Inc.' },
        { symbol: 'CRM', name: 'Salesforce Inc.' },
        { symbol: 'SBUX', name: 'Starbucks Corporation' },
        { symbol: 'MCD', name: 'McDonald\'s Corporation' },
        { symbol: 'PG', name: 'Procter & Gamble Co.' },
        { symbol: 'JNJ', name: 'Johnson & Johnson' },
        { symbol: 'MRNA', name: 'Moderna Inc.' },
        { symbol: 'PFE', name: 'Pfizer Inc.' },
        { symbol: 'AZN', name: 'AstraZeneca PLC' },
        { symbol: 'LLY', name: 'Eli Lilly and Company' },
        { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.' },
        { symbol: 'UNH', name: 'UnitedHealth Group Incorporated' },
        { symbol: 'RDS-A', name: 'Royal Dutch Shell plc' },
        { symbol: 'GE', name: 'General Electric Company' },
        { symbol: 'GM', name: 'General Motors Company' },
        { symbol: 'F', name: 'Ford Motor Company' },
        { symbol: 'TSM', name: 'Taiwan Semiconductor Manufacturing Company Limited' },
        { symbol: 'SPCE', name: 'Virgin Galactic Holdings Inc.' },
        { symbol: 'PLTR', name: 'Palantir Technologies Inc.' },
        { symbol: 'DKNG', name: 'DraftKings Inc.' },
        { symbol: 'BB', name: 'BlackBerry Limited' },
        { symbol: 'NKLA', name: 'Nikola Corporation' },
    ];
    useEffect(() => {
        // Sort stock data alphabetically by company name
        const sortedStocks = stockData.sort((a, b) => a.name.localeCompare(b.name));
        setStocksNew(sortedStocks);
    }, []);

    const getStockValue = (symbol) => {
        setapiLoading(true)
        axios
            .get(
                `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`
            )
            .then((response) => {
                console.log('response: ', response);
                const timeSeries = response.data['Time Series (5min)'];
                if (timeSeries) {
                    setapiLoading(false)
                    // Get the latest stock price
                    const latestTime = Object.keys(timeSeries)[0];
                    const latestData = timeSeries[latestTime]['1. open'];
                    setStockValue(latestData);
                    console.log('latestData: ', latestData);
                } else {
                    alert('Stock data not available');
                }
            })
            .catch((error) => {
                console.error('Error fetching stock data:', error);
            });
    };

    // Handle dropdown selection
    const handleStockChange = (event) => {
        const selectedSymbol = event.target.value;
        setSelectedStock(selectedSymbol);
        getStockValue(selectedSymbol);

        // Find the stock name based on the selected symbol
        const stock = stockData.find(stock => stock.symbol === selectedSymbol);
        if (stock) {
            setStocks(prevStocks => ({
                ...prevStocks,
                stockName: stock.name
            }));
        }
    };

    return (
        <>
            <div className="row dark-nn" >
                <div className="col-xxl-12">
                    <div className="card">
                        
                        {secLoading ? "" :
                       <> <Card.Header>
                            <Card.Title>Stocks</Card.Title>
                        </Card.Header>
                            <div className="card-body">
                                {isLoading ? (
                                    <div className="text-center my-5">
                                        <Spinner animation="border" variant="primary" />
                                        <h4 className="mt-3"> Loading Stocks...</h4>
                                        <p>Please wait while we load the  Stocks.</p>
                                    </div>
                                ) : (

                                    <Row>
                                        <Col md={6}>
                                            <Card className='maon-00c'>
                                                <Card.Header><Card.Title>Buy Assets</Card.Title></Card.Header>
                                                <Card.Body>
                                                    <Form>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Asset ID</Form.Label>
                                                            {/* <Form.Control type="text" placeholder="Enter Asset ID" /> */}
                                                            <select className="form-control" value={selectedStock} onChange={handleStockChange}>
                                                                <option value="">Select a stock</option>
                                                                {stocksNew.map((stock, index) => (
                                                                    <option key={index} value={stock.symbol}>
                                                                        {stock.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Asset Quote</Form.Label>
                                                            <Form.Control type="text" placeholder="USD" disabled />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Quantity</Form.Label>
                                                            <Form.Control type="number" defaultValue={1} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Current Price</Form.Label>
                                                            <Form.Control type="number" />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Buy Amount</Form.Label>
                                                            <Form.Control type="number" />
                                                        </Form.Group>
                                                        <Button variant="success" type="submit">
                                                            Buy Asset
                                                        </Button>
                                                    </Form>
                                                </Card.Body>
                                            </Card>
                                        </Col>

                                        <Col md={6}>
                                            <Card className='maon-00c'>
                                                <Card.Header><Card.Title>Sell Assets</Card.Title></Card.Header>
                                                <Card.Body>
                                                    <Form>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Asset ID</Form.Label>
                                                            <Form.Control type="text" defaultValue="ETOR (Etoro Group Ltd - Class A)" />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Asset Quote</Form.Label>
                                                            <Form.Control type="text" defaultValue="USD" disabled />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Quantity</Form.Label>
                                                            <Form.Control type="number" defaultValue={1} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Current Price</Form.Label>
                                                            <Form.Control type="number" defaultValue={64.98} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Sell Price</Form.Label>
                                                            <Form.Control type="number" defaultValue={64.98} />
                                                        </Form.Group>
                                                        <Button variant="danger" type="submit">
                                                            Sell Asset
                                                        </Button>
                                                    </Form>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                )}
                            </div></>
                        }
                    </div>
                </div>
            </div>
            {modal && <Modal
                show={modal}
                onHide={toggleModalClose}
                dialogClassName={`modal-90w ${document.body.getAttribute('data-theme-version') === 'dark' ? 'dark-mode' : ''}`}
                aria-labelledby="transaction-modal-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="transaction-modal-title">
                        Transaction Details
                    </Modal.Title>
                </Modal.Header>
                {singleTransaction.by === "user" ? (
                    <Modal.Body>
                        <dl className="row main-modal" >
                            <div className="col-sm-6">
                                <dt className="text-muted">Transaction ID</dt>
                                <dd className="text-dark ">
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => handleCopyToClipboard(singleTransaction._id)}
                                        className="text-dark d-flexa"
                                    >
                                        <Truncate text={singleTransaction._id} offset={6} width="100" />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-1" viewBox="0 0 24 24">
                                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </g>
                                        </svg>
                                    </a>
                                </dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="text-muted">To</dt>
                                <dd className="text-dark">
                                    {singleTransaction.withdraw === "bank" ? (
                                        <a href="javascript:void(0)" className="text-dark">
                                            {singleTransaction.selectedPayment}
                                        </a>
                                    ) : (
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => handleCopyToClipboard(singleTransaction.txId)}
                                            className="text-dark d-flexa"
                                        >
                                            <Truncate text={singleTransaction.txId} offset={6} width="100" />
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-1" viewBox="0 0 24 24">
                                                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                    <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </g>
                                            </svg>
                                        </a>
                                    )}
                                </dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="text-muted">Timestamp</dt>
                                <dd className="text-dark">
                                    {new Date(singleTransaction.createdAt).toLocaleString()}
                                </dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="text-muted">Value</dt>
                                <dd className="text-dark">
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => handleCopyToClipboard(singleTransaction.amount.toFixed(8))}
                                        className="text-dark "
                                    >
                                        {singleTransaction.amount.toFixed(8)}{' '}
                                        {`${singleTransaction.trxName === "bitcoin"
                                            ? "BTC"
                                            : singleTransaction.trxName === "ethereum"
                                                ? "ETH"
                                                : singleTransaction.trxName === "tether"
                                                    ? "USDT"
                                                    : ""
                                            }`}
                                        {' '}
                                        <span className="text-muted">
                                            {`($${singleTransaction.trxName === "bitcoin"
                                                ? (singleTransaction.amount * liveBtc).toFixed(2)
                                                : singleTransaction.trxName === "ethereum"
                                                    ? (singleTransaction.amount * 2640).toFixed(2)
                                                    : singleTransaction.trxName === "tether"
                                                        ? singleTransaction.amount.toFixed(2)
                                                        : (0).toFixed(2)
                                                })`}
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-2" viewBox="0 0 24 24">
                                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </g>
                                        </svg>
                                    </a>
                                </dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="text-muted">Status</dt>
                                <dd className="text-dark">
                                    {singleTransaction.status === "pending" ? (
                                        <span className="badge bg-warning text-dark">Pending</span>
                                    ) : singleTransaction.status === "completed" ? (
                                        <span className="badge bg-success text-white">Completed</span>
                                    ) : singleTransaction.status === "failed" ? (
                                        <span className="badge bg-danger text-white">Failed</span>
                                    ) : (
                                        <span className="text-muted">Unknown</span>
                                    )}
                                    <span className="text-muted ml-2">{singleTransaction.note}</span>
                                </dd>
                            </div>
                        </dl>
                    </Modal.Body>) : (
                    <Modal.Body>
                        <dl className="row  main-modal">
                            <div className="col-md-6">
                                <dt className="text-muted">Transaction ID</dt>
                                <dd>
                                    <a
                                        onClick={() => handleCopyToClipboard(singleTransaction._id)}
                                        href="#" className="text-dark d-flexa"
                                    >
                                        <Truncate text={singleTransaction._id} offset={6} width="100" />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-1" viewBox="0 0 24 24">
                                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </g>
                                        </svg>
                                    </a>
                                </dd>
                            </div>
                            {singleTransaction.withdraw === "crypto" ? (
                                <>
                                    <div className="col-md-6">
                                        <dt className="text-muted">Transaction Hash</dt>
                                        <dd>
                                            <a
                                                onClick={() => handleCopyToClipboard(singleTransaction.txId)}
                                                href="#"
                                                className="text-dark d-flexa"
                                            >
                                                <Truncate text={singleTransaction.txId} offset={6} width="100" />
                                                {/* Use a truncated version if needed */}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-1" viewBox="0 0 24 24">
                                                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                        <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                    </g>
                                                </svg>
                                            </a>
                                        </dd>
                                    </div>
                                    <div className="col-md-6">
                                        <dt className="text-muted">Block</dt>
                                        <dd>{singleTransaction.txId} {/* Use a truncated version if needed */}</dd>
                                    </div>
                                </>
                            ) : (
                                <div className="col-md-6">
                                    <dt className="text-muted">To</dt>
                                    <dd>
                                        <a
                                            onClick={() => handleCopyToClipboard(singleTransaction.selectedPayment)}
                                            href="#"
                                            className="text-dark d-flexa"
                                        >

                                            <Truncate text={singleTransaction.selectedPayment} offset={6} width="100" />
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-1" viewBox="0 0 24 24">
                                                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                    <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </g>
                                            </svg>
                                        </a>
                                    </dd>
                                </div>
                            )}
                            <div className="col-md-6">
                                <dt className="text-muted">Timestamp</dt>
                                <dd>{new Date(singleTransaction.createdAt).toLocaleString()}</dd>
                            </div>
                            {singleTransaction.fromAddress && (
                                <div className="col-md-6">
                                    <dt className="text-muted">From</dt>
                                    <dd>
                                        <a
                                            onClick={() => handleCopyToClipboard(singleTransaction.fromAddress)}
                                            href="#"
                                            className="text-dark d-flexa"
                                        >

                                            <Truncate text={singleTransaction.fromAddress} offset={6} width="100" />
                                            {/* Use a truncated version if needed */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-1" viewBox="0 0 24 24">
                                                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                    <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </g>
                                            </svg>
                                        </a>
                                    </dd>
                                </div>
                            )}
                            {singleTransaction.withdraw === "crypto" && (
                                <div className="col-md-6">
                                    <dt className="text-muted">To</dt>
                                    <dd>
                                        <a
                                            onClick={() => handleCopyToClipboard(singleTransaction.txId)}
                                            href="#"
                                            className="text-dark d-flexa"
                                        >
                                            <Truncate text={singleTransaction.txId} offset={6} width="100" />
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-1" viewBox="0 0 24 24">
                                                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                    <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </g>
                                            </svg>

                                        </a>
                                    </dd>
                                </div>
                            )}
                            <div className="col-md-6">
                                <dt className="text-muted">Value</dt>
                                <dd>
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => handleCopyToClipboard(singleTransaction.amount.toFixed(8))}
                                        className="text-dark "
                                    >
                                        {singleTransaction.amount.toFixed(8)}{' '}
                                        {`${singleTransaction.trxName === "bitcoin"
                                            ? "BTC"
                                            : singleTransaction.trxName === "ethereum"
                                                ? "ETH"
                                                : singleTransaction.trxName === "tether"
                                                    ? "USDT"
                                                    : ""
                                            }`}
                                        {' '}
                                        <span className="text-muted">
                                            {`($${singleTransaction.trxName === "bitcoin"
                                                ? (singleTransaction.amount * liveBtc).toFixed(2)
                                                : singleTransaction.trxName === "ethereum"
                                                    ? (singleTransaction.amount * 2640).toFixed(2)
                                                    : singleTransaction.trxName === "tether"
                                                        ? singleTransaction.amount.toFixed(2)
                                                        : (0).toFixed(2)
                                                })`}
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-2" viewBox="0 0 24 24">
                                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </g>
                                        </svg>
                                    </a>
                                </dd>
                            </div>
                            <div className="col-md-6">
                                <dt className="text-muted">Status</dt>
                                <dd>
                                    {singleTransaction.status === "pending" ? (
                                        <span className="badge bg-warning text-dark">Pending</span>
                                    ) : singleTransaction.status === "completed" ? (
                                        <span className="badge bg-success text-light">Completed</span>
                                    ) : singleTransaction.status === "failed" ? (
                                        <span className="badge bg-danger text-light">Failed</span>
                                    ) : (
                                        <span className="text-muted">Unknown</span>
                                    )}
                                    <span className="text-muted ms-2">{singleTransaction.note}</span>
                                </dd>
                            </div>
                        </dl>
                    </Modal.Body>)}

                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>}

        </>

    );
};

export default StocksSec;
