import React, { useEffect, useState } from "react";
import { SVGICON } from '../../constant/theme';
import { useLocation } from 'react-router-dom';
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { logoutApi, getsignUserApi, getCoinsUserApi } from "../../../Api/Service";
import { toast } from "react-toastify";
import axios from "axios";
// let path = window.location.pathname;
// path = path.split("/");
// path = path[path.length - 1];

const SidebarExtraContent = () => {
	const location = useLocation();
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
	const { pathname } = location;
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
			// const response = await axios.get(
			// 	"https://api.coindesk.com/v1/bpi/currentprice.json"
			// );

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


				const conversionRate = 0.92;
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
				const eurPending = calculatePendingBalance("eur", 1.08);
				const solPending = calculatePendingBalance("sol", 245.01);
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
					eurPending +
					solPending +
					tonPending +
					linkPending +
					dotPending +
					nearPending +
					usdcPending +
					trxPending
				).toFixed(2);
				// Convert to EUR if user currency is EUR
				console.log('isUser.currency: ', isUserd);
				const totalBalancePendings = isUserd.currency === "EUR"
					? (totalPendingBalanceUSD * conversionRate).toFixed(2)
					: totalPendingBalanceUSD;

				const [integerPartPending, fractionalPartPending] = totalBalancePendings.split(".");

				// Format the total balance with the appropriate currency symbol
				const formattedTotalPendingBalance = parseFloat(integerPartPending).toLocaleString(
					"en-US",
					{
						style: "currency",
						currency: isUserd.currency === "EUR" ? "EUR" : "USD",
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					}
				);

				// Set the fractional part and formatted total balance in state
				setfractionBalancePending(fractionalPartPending);
				settotalBalancePending(formattedTotalPendingBalance);
				// const [integerPartPending, fractionalPartPending] = totalPendingBalanceUSD.split(".");

				// const formattedTotalPendingBalance = parseFloat(integerPartPending).toLocaleString(
				// 	"en-US",
				// 	{
				// 		style: "currency",
				// 		currency: "USD",
				// 		minimumFractionDigits: 0,
				// 		maximumFractionDigits: 0,
				// 	}
				// );

				// setfractionBalancePending(fractionalPartPending);
				// settotalBalancePending(formattedTotalPendingBalance);

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
			setAdmin(authUser().user);

			getsignUser()
			return;
		} else if (authUser().user.role === "admin") {
			setAdmin(authUser().user);
			return;
		}
	}, []);

	return (
		<>
			<div className={`feature-box  new-bg-dark ${compare.includes(pathname) ? '' : 'style-3'}`}>
				<div className="wallet-box new-bg-light">
					{SVGICON.SideWalletSvgIcon}
					<div className="ms-3">
						<h4 className="text-white mb-0 d-block">{totalBalance === null ? "..." : totalBalance === 0 ? 0 : `${totalBalance}`} </h4>
						<small className="new-theme-color">Available Funds</small>
					</div>
				</div>
				<div className="wallet-box new-bg-light">
					{SVGICON.SideWalletSvgIcon}
					<div className="ms-3">
						<h4 className="text-white mb-0 d-block">{totalBalancePending === null ? "..." : totalBalance === 0 ? 0 : `${totalBalancePending}`} </h4>
						<small className="new-theme-color"> Total Pending</small>
					</div>
				</div>

			</div>
		</>
	);
};

export default SidebarExtraContent;