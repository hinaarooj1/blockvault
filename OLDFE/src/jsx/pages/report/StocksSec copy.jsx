import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SVGICON } from '../../constant/theme';
import Bitcoin from "../../../assets/images/img/btc.svg"
import EthLogo from "../../../assets/images/img/eth.svg"
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { createUserTransactionApi, getCoinsUserApi, getsignUserApi, getUserCoinApi } from '../../../Api/Service';
import axios from 'axios';
import { Button, Card, Col, Form, DropdownDivider, InputGroup, Modal, Row, Spinner, Table } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';


const StocksSec = () => {
    const [stocksNew, setStocksNew] = useState([]);
    const [selectedStock, setSelectedStock] = useState('');
    const [stockValue, setStockValue] = useState('');
    const [apiLoading, setapiLoading] = useState(false);
    const apiKey = 'JTJDB1ZIXDMIT0WN';
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

    return (
        <>
            <div className="row dark-nn" >
                <div className="col-xxl-12">
                    <div className="card">
                        <Card.Header>
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

                                <div className="  relative w-full    duration-300 rounded-md">
                                    <div className="flex items-center justify-between p-4">
                                        <div>
                                            <p
                                                className="font-heading text-sm font-medium leading-normal leading-normal uppercase tracking-wider"
                                                tag="h2"
                                            >
                                                {" "}
                                                All Stocks
                                            </p>
                                        </div>
                                    </div>
                                    {isLoading && (
                                        <div className="  p-5">Loading Stocks...</div>
                                    )}
                                    {!isLoading && (
                                        <div className="pt-6 asm">
                                            <Table   bordered  >
                                                <thead>
                                                    <tr>
                                                        <th>Stock Name</th>
                                                        <th>Stock Symbol</th>
                                                        <th>Quantity</th>
                                                        <th>Total Value</th>
                                                    </tr>
                                                </thead>
                                                {UserTransactions && Array.isArray(UserTransactions) && UserTransactions.length > 0 ? (
                                                    UserTransactions.map((transaction, index) => (
                                                        <tbody>
                                                            <tr key={index}>
                                                                <td>{transaction.stockName || 'N/A'}</td>
                                                                <td className="text-center">{transaction.stockSymbol || 'N/A'}</td>
                                                                <td>{transaction.stockAmount || 'N/A'}</td>
                                                                <td>
                                                                    {spValue ? (
                                                                        <div className="loader-container">
                                                                            <Spinner animation="border" role="status">
                                                                                <span className="visually-hidden">Loading...</span>
                                                                            </Spinner>
                                                                        </div>
                                                                    ) : (() => {
                                                                        const liveValue = liveStockValues[transaction.stockSymbol];
                                                                        const calculatedValue = parseFloat(liveValue) * parseFloat(transaction.stockAmount);
                                                                        const formattedValue = isNaN(calculatedValue)
                                                                            ? parseFloat(transaction.stockValue) * parseFloat(transaction.stockAmount)
                                                                            : calculatedValue;
                                                                        return `$${formattedValue.toFixed(3) || 'N/A'}`;
                                                                    })()}

                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center">No stocks available</td>
                                                    </tr>
                                                )}
                                            </Table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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
