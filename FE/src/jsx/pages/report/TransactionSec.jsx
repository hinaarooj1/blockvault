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
import { Button, Card, Col, Form, DropdownDivider, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';


const TransactionSec = () => {

    const [modal, setModal] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [UserTransactions, setUserTransactions] = useState([]);
    const [singleTransaction, setsingleTransaction] = useState();
    const [userDetail, setuserDetail] = useState({});
    const [liveBtc, setliveBtc] = useState(null);

    let { id } = useParams();

    let authUser = useAuthUser();
    let Navigate = useNavigate();
    const [Active, setActive] = useState(false);
    const [copiedSec, setCopiedSec] = useState(false);

    // Function to copy the reference number
    const handleCopySec = () => {
        navigator.clipboard.writeText(singleTransaction.reference).then(() => {
            setCopiedSec(true); // Set copiedSec to true when the text is copiedSec
            setTimeout(() => setCopiedSec(false), 2000); // Revert back after 2 seconds
        });
    };

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
            const allTransactions = await getUserCoinApi(id);
            console.log('allTransactions: ', allTransactions.getCoin.transactions);
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
        console.log('data: ', data);
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
    const prices = {
        bitcoin: liveBtc || 0,
        ethereum: 2640.86,
        tether: 1,
        bnb: 210.25,
        xrp: 0.5086,
        dogecoin: 0.1163,
        euro: 1.08,
        solana: 245.01,
        toncoin: 5.76,
        chainlink: 12.52,
        polkadot: 4.76,
        "near protocol": 5.59,
        "usd coin": 0.99,
        tron: 0.1531,
    };

    const eurConversionRate = 0.92; // Example conversion rate USD to EUR

    const calculateTransactionValue = (transaction) => {
        const price = prices[transaction.trxName.toLowerCase()] || 0;
        let value = Math.abs(parseFloat(transaction.amount)) * price;

        // Convert to EUR if the user's currency is EUR
        if (isUser.currency === "EUR") {
            value *= eurConversionRate;
        }

        return value.toFixed(2);
    };

    return (
        <>
            <div className="row">
                <div className="col-xxl-12">
                    <div className="card new-bg-dark">
                        <Card.Header>
                            <Card.Title className='text-white'>Transactions</Card.Title>
                        </Card.Header>
                        <div className="card-body">
                            {isLoading ? (
                                <div className="text-center my-5">
                                    <Spinner animation="border" variant="primary" />
                                    <h4 className="mt-3"> Loading Transactions...</h4>
                                    <p>Please wait while we load the  transactions.</p>
                                </div>
                            ) : (

                                <>
                                    <div className="d-grid gap-4">
                                        {UserTransactions &&
                                            UserTransactions.filter(Transaction => !Transaction.isHidden).map((Transaction, index) => (
                                                <Card
                                                    key={index}
                                                    className="transaction-card no-bg border-0 shadow-sm rounded-3 transition-all duration-300"
                                                >
                                                    <Card.Body className="p-3">
                                                        <Row className="align-items-center">
                                                            <Col xs={2} className="text-center">
                                                                {Transaction.type === 'deposit' ? (
                                                                    <div className="icon-container   bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center">
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
                                                            </Col>
                                                            <Col>
                                                                <Card.Title as="h6" className="mb-1 text-white">
                                                                    {Transaction.trxName}{' '}
                                                                    <small className="transaction-status text-white">({Transaction.status})</small>
                                                                </Card.Title>
                                                                <Card.Text className="mb-1 transaction-amount">
                                                                    {Transaction.amount.toFixed(8)}{' '}
                                                                    <small>
                                                                        {Transaction.type === 'deposit' ? (
                                                                            <td className="text-success font-w600">
                                                                                {(() => {
                                                                                    const amount = Math.abs(parseFloat(Transaction.amount));
                                                                                    let priceInUSD = 0;

                                                                                    switch (Transaction.trxName.toLowerCase()) {
                                                                                        case "bitcoin":
                                                                                            priceInUSD = amount * liveBtc;
                                                                                            break;
                                                                                        case "ethereum":
                                                                                            priceInUSD = amount * 2640.86;
                                                                                            break;
                                                                                        case "tether":
                                                                                            priceInUSD = amount * 1;
                                                                                            break;
                                                                                        case "bnb":
                                                                                            priceInUSD = amount * 210.25;
                                                                                            break;
                                                                                        case "xrp":
                                                                                            priceInUSD = amount * 0.5086;
                                                                                            break;
                                                                                        case "dogecoin":
                                                                                            priceInUSD = amount * 0.1163;
                                                                                            break;
                                                                                        case "euro":
                                                                                            priceInUSD = amount * 1.08;
                                                                                            break;
                                                                                        case "solana":
                                                                                            priceInUSD = amount * 245.01;
                                                                                            break;
                                                                                        case "toncoin":
                                                                                            priceInUSD = amount * 5.76;
                                                                                            break;
                                                                                        case "chainlink":
                                                                                            priceInUSD = amount * 12.52;
                                                                                            break;
                                                                                        case "polkadot":
                                                                                            priceInUSD = amount * 4.76;
                                                                                            break;
                                                                                        case "near protocol":
                                                                                            priceInUSD = amount * 5.59;
                                                                                            break;
                                                                                        case "usd coin":
                                                                                            priceInUSD = amount * 0.99;
                                                                                            break;
                                                                                        case "tron":
                                                                                            priceInUSD = amount * 0.1531;
                                                                                            break;
                                                                                        default:
                                                                                            priceInUSD = 0;
                                                                                            break;
                                                                                    }

                                                                                    const convertedPrice =
                                                                                        isUser.currency === "EUR" ? priceInUSD * 0.92 : priceInUSD;

                                                                                    return `(+${convertedPrice.toFixed(2)} ${isUser.currency === "EUR" ? "EUR" : "USD"
                                                                                        })`;
                                                                                })()}
                                                                            </td>
                                                                        ) : Transaction.type === 'withdraw' ? (
                                                                            <td className="text-danger font-w600">
                                                                                {(() => {
                                                                                    const amount = Math.abs(parseFloat(Transaction.amount));
                                                                                    let priceInUSD = 0;

                                                                                    switch (Transaction.trxName.toLowerCase()) {
                                                                                        case "bitcoin":
                                                                                            priceInUSD = amount * liveBtc;
                                                                                            break;
                                                                                        case "ethereum":
                                                                                            priceInUSD = amount * 2640.86;
                                                                                            break;
                                                                                        case "tether":
                                                                                            priceInUSD = amount * 1;
                                                                                            break;
                                                                                        case "bnb":
                                                                                            priceInUSD = amount * 210.25;
                                                                                            break;
                                                                                        case "xrp":
                                                                                            priceInUSD = amount * 0.5086;
                                                                                            break;
                                                                                        case "dogecoin":
                                                                                            priceInUSD = amount * 0.1163;
                                                                                            break;
                                                                                        case "euro":
                                                                                            priceInUSD = amount * 1.08;
                                                                                            break;
                                                                                        case "solana":
                                                                                            priceInUSD = amount * 245.01;
                                                                                            break;
                                                                                        case "toncoin":
                                                                                            priceInUSD = amount * 5.76;
                                                                                            break;
                                                                                        case "chainlink":
                                                                                            priceInUSD = amount * 12.52;
                                                                                            break;
                                                                                        case "polkadot":
                                                                                            priceInUSD = amount * 4.76;
                                                                                            break;
                                                                                        case "near protocol":
                                                                                            priceInUSD = amount * 5.59;
                                                                                            break;
                                                                                        case "usd coin":
                                                                                            priceInUSD = amount * 0.99;
                                                                                            break;
                                                                                        case "tron":
                                                                                            priceInUSD = amount * 0.1531;
                                                                                            break;
                                                                                        default:
                                                                                            priceInUSD = 0;
                                                                                            break;
                                                                                    }

                                                                                    const convertedPrice =
                                                                                        isUser.currency === "EUR" ? priceInUSD * 0.92 : priceInUSD;

                                                                                    return `(-${convertedPrice.toFixed(2)} ${isUser.currency === "EUR" ? "EUR" : "USD"
                                                                                        })`;
                                                                                })()}
                                                                            </td>
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
                                                                <Button
                                                                    onClick={() => toggleModal(Transaction)}
                                                                    variant="outline-secondary"
                                                                    className="p-1 rounded-circle bg-light text-muted border-0 shadow-sm"
                                                                    style={{ width: '32px', height: '32px' }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                        <circle cx="12" cy="12" r="3" />
                                                                    </svg>
                                                                </Button>
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
                                                                No transactions found
                                                            </h4>
                                                            <p className="text-muted-400 font-sans text-sm">
                                                                Try to change the filter or add a new
                                                                transaction
                                                            </p>
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
                                        {singleTransaction.trxName.toLowerCase() === "bitcoin"
                                            ? " BTC"
                                            : singleTransaction.trxName.toLowerCase() === "ethereum"
                                                ? " ETH"
                                                : singleTransaction.trxName.toLowerCase() === "tether"
                                                    ? " USDT"
                                                    : singleTransaction.trxName.toLowerCase() === "euro"
                                                        ? "EUR"
                                                        : singleTransaction.trxName.toLowerCase() === "solana"
                                                            ? "SOL"
                                                            : singleTransaction.trxName.toLowerCase() === "bnb"
                                                                ? " BNB"
                                                                : singleTransaction.trxName.toLowerCase() === "xrp"
                                                                    ? " XRP"
                                                                    : singleTransaction.trxName.toLowerCase() === "dogecoin"
                                                                        ? " DOGE"
                                                                        : singleTransaction.trxName.toLowerCase() === "toncoin"
                                                                            ? " TON"
                                                                            : singleTransaction.trxName.toLowerCase() === "chainlink"
                                                                                ? " LINK"
                                                                                : singleTransaction.trxName.toLowerCase() === "polkadot"
                                                                                    ? " DOT"
                                                                                    : singleTransaction.trxName.toLowerCase() === "near protocol"
                                                                                        ? " NEAR"
                                                                                        : singleTransaction.trxName.toLowerCase() === "usdc coin"
                                                                                            ? " USDC"
                                                                                            : singleTransaction.trxName.toLowerCase() === "tron"
                                                                                                ? " TRX"
                                                                                                : ""}
                                        {' '}
                                        <span className="text-muted">
                                            {`(${isUser.currency === "EUR" ? "€" : "$"}${calculateTransactionValue(singleTransaction)})`}
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
                                </dd>

                            </div>
                            {singleTransaction.note ?

                                <div className="col-sm-6">
                                    <dt className="text-muted">Note</dt>
                                    <dd className="text-dark">


                                        <span className="text-muted ms-2">{singleTransaction.note}</span>
                                    </dd>
                                </div> : ""
                            }
                            {singleTransaction.reference ?

                                <div className="col-sm-6">
                                    <dt className="text-muted">Reference Number</dt>
                                    <dd className="text-dark">

                                        <span className="text-muted ml-2">{singleTransaction.reference}</span>     <span onClick={handleCopySec} className="cursor-pointer ml-1">
                                            {copiedSec ? (

                                                "copied!"
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-1" viewBox="0 0 24 24">
                                                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                        <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                    </g>
                                                </svg>
                                            )}
                                        </span>
                                    </dd>
                                </div> : ""
                            }
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
                                        {singleTransaction.trxName.toLowerCase() === "bitcoin"
                                            ? " BTC"
                                            : singleTransaction.trxName.toLowerCase() === "ethereum"
                                                ? " ETH"
                                                : singleTransaction.trxName.toLowerCase() === "tether"
                                                    ? " USDT"
                                                    : singleTransaction.trxName.toLowerCase() === "euro"
                                                        ? "EUR"
                                                        : singleTransaction.trxName.toLowerCase() === "solana"
                                                            ? "SOL"
                                                            : singleTransaction.trxName.toLowerCase() === "bnb"
                                                                ? " BNB"
                                                                : singleTransaction.trxName.toLowerCase() === "xrp"
                                                                    ? " XRP"
                                                                    : singleTransaction.trxName.toLowerCase() === "dogecoin"
                                                                        ? " DOGE"
                                                                        : singleTransaction.trxName.toLowerCase() === "toncoin"
                                                                            ? " TON"
                                                                            : singleTransaction.trxName.toLowerCase() === "chainlink"
                                                                                ? " LINK"
                                                                                : singleTransaction.trxName.toLowerCase() === "polkadot"
                                                                                    ? " DOT"
                                                                                    : singleTransaction.trxName.toLowerCase() === "near protocol"
                                                                                        ? " NEAR"
                                                                                        : singleTransaction.trxName.toLowerCase() === "usdc coin"
                                                                                            ? " USDC"
                                                                                            : singleTransaction.trxName.toLowerCase() === "tron"
                                                                                                ? " TRX"
                                                                                                : ""}
                                        {' '}
                                        <span className="text-muted">
                                            {`(${isUser.currency === "EUR" ? "€" : "$"}${calculateTransactionValue(singleTransaction)})`}
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
                                </dd>
                            </div>
                            {singleTransaction.note ?

                                <div className="col-sm-6">
                                    <dt className="text-muted">Note</dt>
                                    <dd className="text-dark">


                                        <span className="text-muted ms-2">{singleTransaction.note}</span>
                                    </dd>
                                </div> : ""
                            }
                            {singleTransaction.reference ?

                                <div className="col-sm-6">
                                    <dt className="text-muted">Reference Number</dt>
                                    <dd className="text-dark">

                                        <span className="text-muted ml-2">{singleTransaction.reference}</span>     <span onClick={handleCopySec} className="cursor-pointer ml-1">
                                            {copiedSec ? (

                                                "copied!"
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon w-5 h-5 inline-block -mt-1 ml-1" viewBox="0 0 24 24">
                                                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                                        <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                    </g>
                                                </svg>
                                            )}
                                        </span>
                                    </dd>
                                </div> : ""
                            }
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

export default TransactionSec;
