import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Row } from 'react-bootstrap';

//Import 
import { SVGICON } from '../../constant/theme';
import MainSlider from '../../elements/dashboard/MainSlider';
import StatisticsBlog from '../../elements/dashboard/StatisticsBlog';
import MarketOverViewBlog from '../../elements/dashboard/MarketOverViewBlog';
import RecentTransaction from '../../elements/dashboard/RecentTransaction';
import Truncate from "react-truncate-inside";
import { ThemeContext } from '../../../context/ThemeContext';

import btcLogo from "../../../assets/images/img/btc-logo.svg";
import ethLogo from "../../../assets/images/img/ethereum-logo.svg";
import usdtLogo from "../../../assets/images/img/usdt-logo.svg";
import BNBcoin from '../../../assets/images/new/bnb.png';
import Coin1 from '../../../assets/images/new/1.png';
import Coin2 from '../../../assets/images/new/2.png';
import Coin3 from '../../../assets/images/new/3.png';
import Coin4 from '../../../assets/images/new/4.png';
import Coin5 from '../../../assets/images/new/5.png';
import Coin6 from '../../../assets/images/new/6.png';
import Coin7 from '../../../assets/images/new/7.png';
import Coin8 from '../../../assets/images/new/8.png';
import eurIco from '../../../assets/images/new/euro.svg';
import solIco from '../../../assets/images/new/solana.png';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import { toast } from 'react-toastify';
import { getCoinsUserApi, getHtmlDataApi, getsignUserApi } from '../../../Api/Service';
import axios from 'axios';

const coinLogos = {
	euro: eurIco, // Replace with actual local path
	bnb: BNBcoin, // Replace with actual local path
	xrp: Coin1, // Replace with actual local path
	solana: solIco, // Replace with actual local path
	dogecoin: Coin2, // Replace with actual local path
	toncoin: Coin3, // Replace with actual local path
	chainlink: Coin4, // Replace with actual local path
	polkadot: Coin5, // Replace with actual local path
	'near protocol': Coin6, // Replace with actual local path
	'usd coin': Coin7, // Replace with actual local path
	tron: Coin8 // Replace with actual local path
	// Replace with actual local path
	// Add more coins as needed
};
export function MainComponent() {
	const [modal, setModal] = useState(false);
	const [isLoading, setisLoading] = useState(true);
	const [UserData, setUserData] = useState(true);
	const [totalBalance, settotalBalance] = useState(null);
	const [totalBalancePending, settotalBalancePending] = useState(null);
	const [fractionBalance, setfractionBalance] = useState(null);
	const [fractionBalancePending, setfractionBalancePending] = useState(null);
	const [Description, setDescription] = useState(null);
	const [Description2, setDescription2] = useState(null);

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
	const [copySuccess3, setCopySuccess3] = useState(false);
	const [copySuccessUnique, setcopySuccessUnique] = useState({});

	const handleCopyClick3 = () => {
		const textField = document.createElement("textarea");
		textField.innerText = UserData.usdtTokenAddress;
		document.body.appendChild(textField);
		textField.select();
		document.execCommand("copy");
		document.body.removeChild(textField);
		setCopySuccess3(true);

		// You can optionally reset the copy success state after a short duration
		setTimeout(() => {
			setCopySuccess3(false);
		}, 2000);
	};



	const getCoins = async (data) => {
		let id = data._id;
		try {
			const userCoins = await getCoinsUserApi(id);
			// const response = await axios.get(
			// 	"https://api.coindesk.com/v1/bpi/currentprice.json"
			// );

			if (userCoins.success) {
				setUserData(userCoins.getCoin);
				// setUserTransactions;

				setUserTransactions(
					userCoins.getCoin.transactions.reverse().slice(0, 5)
				);
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
				let val = 0;
				if (userCoins && userCoins.btcPrice && userCoins.btcPrice.quote && userCoins.btcPrice.quote.USD) {

					val = userCoins.btcPrice.quote.USD.price
				} else {
					val = 96075.25
				}
				setliveBtc(val);
				let lakh = btcValueAdded * val;
				const totalValue = (
					lakh +
					ethValueAdded * 2640 +
					usdtValueAdded
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

				//
				setfractionBalance(fractionalPart);
				settotalBalance(formattedTotalValue);

				// Pending one  // tx
				const btcPending = userCoins.getCoin.transactions.filter(
					(transaction) => transaction.trxName.includes("bitcoin")
				);
				const btccompletePending = btcPending.filter((transaction) =>
					transaction.status.includes("pending")
				);
				let btcCountPending = 0;
				let btcValueAddedPending = 0;
				for (let i = 0; i < btccompletePending.length; i++) {
					const element = btccompletePending[i];
					btcCountPending = element.amount;
					btcValueAddedPending += btcCountPending;
				}
				// tx
				// tx
				const ethPending = userCoins.getCoin.transactions.filter(
					(transaction) => transaction.trxName.includes("ethereum")
				);
				const ethcompletePending = ethPending.filter((transaction) =>
					transaction.status.includes("pending")
				);
				let ethCountPending = 0;
				let ethValueAddedPending = 0;
				for (let i = 0; i < ethcompletePending.length; i++) {
					const element = ethcompletePending[i];
					ethCountPending = element.amount;
					ethValueAddedPending += ethCountPending;
				}
				// tx
				// tx
				const usdtPending = userCoins.getCoin.transactions.filter(
					(transaction) => transaction.trxName.includes("tether")
				);
				const usdtcompletePending = usdtPending.filter((transaction) =>
					transaction.status.includes("pending")
				);
				let usdtCountPending = 0;
				let usdtValueAddedPending = 0;
				for (let i = 0; i < usdtcompletePending.length; i++) {
					const element = usdtcompletePending[i];
					usdtCountPending = element.amount;
					usdtValueAddedPending += usdtCountPending;
				}
				// tx

				let lakhPending = btcValueAddedPending * val;
				const totalValuePending = (
					lakhPending +
					ethValueAddedPending * 2640 +
					usdtValueAddedPending
				).toFixed(2);

				const [integerPartPending, fractionalPartPending] =
					totalValuePending.split(".");

				const formattedTotalValuePending = parseFloat(
					integerPartPending
				).toLocaleString("en-US", {
					style: "currency",
					currency: "USD",
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				});

				//
				setfractionBalancePending(fractionalPartPending);
				settotalBalancePending(formattedTotalValuePending);

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

	const getHtmlData = async () => {
		try {
			const description = await getHtmlDataApi();
			console.log('description: ', description);

			if (description.success) {
				setDescription(description?.description[0]?.description);
				setDescription2(description?.description[1]?.description);

				return;
			} else {
				toast.error(description.msg);
			}
		} catch (error) {
			toast.error(error);
		} finally {
		}
	};
	useEffect(() => {
		if (authUser().user.role === "user") {
			getsignUser()
			getHtmlData()
			setAdmin(authUser().user);
			getCoins(authUser().user);

			return;
		} else if (authUser().user.role === "admin") {
			setAdmin(authUser().user);
			return;
		}
	}, []);
	return (
		<Row>
			<Col xl={12}>
				<div className="row main-card">
					<MainSlider />
				</div>
				{
					Description === "" || Description === null||Description === undefined ? "" :
						<Row className="my2 mt-2">
							<Col xl={12}>
								<div className="card new-bg-dark kyc-form-card">
									{/* <div className="card-header text-white">
										<h4 className="card-title text-white">Verify Your Identity for Enhanced Security</h4>
									</div> */}
									<div className="card-body text-white">

										<p
											className="htmData"
											dangerouslySetInnerHTML={{ __html: Description }}
										/>
									</div>
								</div>
							</Col>
						</Row>
				}
				{isUser.submitDoc && isUser.submitDoc.status === "pending" ? (<Row className="my-1">
					<Col xl={12}>
						<div className="card new-bg-dark kyc-form-card">
							<div className="card-header text-white">
								<h4 className="card-title text-white">Verify Your Identity for Enhanced Security</h4>
							</div>
							<div className="card-body text-white">
								<p>We prioritize the safety and security of our platform to ensure a seamless experience for all users.</p>
								<p>Completing the KYC process is an essential step in maintaining a secure environment and complying with regulatory standards.</p>
								<p>To activate your wallet, please complete the identification process.</p>
								<Alert variant="warning" dismissible className="solid alert-right-icon">
									<span><i className='mdi mdi-alert'></i></span>{" "}
									Please verify your identity
								</Alert>
								<Link to="/flows/kyc"><Button to="/flows/kyc" variant="primary" className="mt-3"  >
									Start KYC
								</Button></Link>
							</div>
						</div>
					</Col>
				</Row>) : ""}

				<Row>
					<div className="col-xl-12">

						<div className="card new-bg-dark  price-list style-2  rounded border-style">
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
							{UserData ?
								<div className="card-body p-3 py-0">
									<div className="table-responsive">
										<table className="table text-center bg-pink-hover tr-rounded order-tbl mt-2">

											<tbody>
												<tr>



													<td className="text-start widn no-bg"> <img src={btcLogo} alt="" /></td>
													<td className='no-bg text-white'>  <p style={{ margin: "0" }} className="txt no-bg sml">
														<Truncate
															offset={6}
															text={UserData.btcTokenAddress}
															width="180"
														/>
													</p></td>
													<td className="text-end no-bg" style={{ cursor: 'pointer' }} onClick={handleCopyClick}>  {copySuccess ? (
														<svg style={{ color: "white" }}
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
														<svg style={{ color: "white" }}
															data-v-cd102a71
															xmlns="http://www.w3.org/2000/svg"
															xmlnsXlink="http://www.w3.org/1999/xlink"
															aria-hidden="true"
															role="img"
															className="icon w-5 h-5 inline-block -mt-1 ml-1"
															width="1em"
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
												<tr>



													<td className="text-start no-bg widn"> <img src={ethLogo} alt="" /></td>
													<td className='no-bg text-white'>  <p style={{ margin: "0" }} className="txt sml">
														<Truncate
															offset={6}
															text={UserData.ethTokenAddress}
															width="180"
														/>
													</p></td>
													<td className="text-end no-bg" style={{ cursor: 'pointer' }} onClick={handleCopyClick2}>  {copySuccess2 ? (
														<svg style={{ color: "white" }}
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
														<svg style={{ color: "white" }}
															data-v-cd102a71
															xmlns="http://www.w3.org/2000/svg"
															xmlnsXlink="http://www.w3.org/1999/xlink"
															aria-hidden="true"
															role="img"
															className="icon w-5 h-5 inline-block -mt-1 ml-1"
															width="1em"
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
												<tr>



													<td className="text-start no-bg widn"> <img src={usdtLogo} alt="" /></td>
													<td className='no-bg  text-white'>  <p style={{ margin: "0" }} className="txt no-bg sml">
														<Truncate
															offset={6}
															text={UserData.usdtTokenAddress}
															width="180"
														/>
													</p></td>
													<td className="text-end no-bg" style={{ cursor: 'pointer' }} onClick={handleCopyClick3}>  {copySuccess3 ? (
														<svg style={{ color: "white" }}
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
														<svg style={{ color: "white" }}
															data-v-cd102a71
															xmlns="http://www.w3.org/2000/svg"
															xmlnsXlink="http://www.w3.org/1999/xlink"
															aria-hidden="true"
															role="img"
															className="icon w-5 h-5 inline-block -mt-1 ml-1"
															width="1em"
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
												{UserData && UserData.additionalCoins && UserData.additionalCoins.length > 0 ? (
													UserData.additionalCoins.map((coin) => {
														const handleCopyClickUnique = () => {
															navigator.clipboard.writeText(coin.tokenAddress) // Copy the coin address to clipboard
																.then(() => {
																	setcopySuccessUnique((prev) => ({ ...prev, [coin._id]: true })); // Set copy success for this coin
																	setTimeout(() => {
																		setcopySuccessUnique((prev) => ({ ...prev, [coin._id]: false })); // Reset after 2 seconds
																	}, 2000);
																})
																.catch((err) => console.error('Failed to copy: ', err));
														};

														return (
															<tr key={coin.id}> {/* Ensure you have a unique key for each mapped item */}
																<td className="text-start no-bg widn" >
																	<img style={{ borderRadius: "100%" }} src={coinLogos[coin.coinName.toLowerCase()]} alt={`${coin.coinName} logo`} className="coin-logo" />
																</td>
																<td className='no-bg text-white'>
																	<p style={{ margin: "0" }} className="txt sml">
																		<Truncate
																			offset={6}
																			text={coin.tokenAddress} // Use the address from the coin object
																			width="180"
																		/>
																	</p>
																</td>
																<td className="text-end no-bg" style={{ cursor: 'pointer' }} onClick={handleCopyClickUnique}>
																	{copySuccessUnique[coin._id] ? ( // Check if copy was successful for this coin
																		<svg style={{ color: "white" }}
																			xmlns="http://www.w3.org/2000/svg"
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
																		<svg style={{ color: "white" }}
																			xmlns="http://www.w3.org/2000/svg"
																			aria-hidden="true"
																			role="img"
																			className="icon w-5 h-5 inline-block -mt-1 ml-1"
																			width="1em"
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
																	)}
																</td>
															</tr>
														);
													})
												) : ""}




											</tbody>
										</table>
									</div>
								</div>

								: <p className='card-body p-3 py-4'>No wallet found</p>}
						</div>
					</div>
					{/* <div className="col-xl-6">
						<div className="card market-chart">
							<div className="card-header border-0 pb-0 flex-wrap">
								<div className="mb-0">
									<h4 className="card-title">Payment Methods</h4> 
								</div>
								<Link to={"/account"} className="btn-link text-primary get-report mb-2">
									
									All Accounts
								</Link>
							</div>
							<MarketOverViewBlog />
						</div>
					</div> */}
				</Row>
				<Col lg={12}>
					<RecentTransaction />
				</Col>
				{
					Description2 === "" || Description2 === null||Description2 === undefined ? "" :
						<Row className="my2 mt-2">
							<Col xl={12}>
								<div className="card new-bg-dark kyc-form-card">
									{/* <div className="card-header text-white">
										<h4 className="card-title text-white">Verify Your Identity for Enhanced Security</h4>
									</div> */}
									<div className="card-body text-white">

										<p
											className="htmData"
											dangerouslySetInnerHTML={{ __html: Description2 }}
										/>
									</div>
								</div>
							</Col>
						</Row>
				}
			</Col>
		</Row >
	)
}

const Home = () => {
	const { changeBackground } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);
	return (
		<>
			<MainComponent />
		</>
	)
}

export default Home;