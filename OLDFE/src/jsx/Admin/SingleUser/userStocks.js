import React, { useEffect, useState } from "react";
import SideBar from "../../layouts/AdminSidebar/Sidebar";
import UserSideBar from "./UserSideBar";
import Log from "../../../assets/images/img/log.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { Table, Form, Spinner } from 'react-bootstrap';
import {
    createUserStocksApi,
    getCoinsApi,
    signleUsersApi,
    deleteUserStocksApi,
    getStocksApi,
    addNewStockApi,
    deleteStockApi,
    updateStockApi,
} from "../../../Api/Service";
import axios from "axios";
import './userStocks.css'
import AdminHeader from "../adminHeader";
const CustomStocksModal = ({ show, onClose, stocks, onEdit }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{position:'relative', zIndex:'1000', maxWidth: '800px', width: '90%'}}>
        <div onClick={onClose} style={{position:'absolute',top:'10px',right:'10px', cursor:'pointer',color:'black'}}>X</div>
        <h3>Manage Custom Stocks</h3>
        
        {stocks.length === 0 ? (
          <p>No custom stocks available</p>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock._id}>
                    <td>{stock.symbol}</td>
                    <td>{stock.name}</td>
                    <td>${stock.price}</td>
                    <td>
                      <button
                        onClick={() => onEdit(stock)}
                        className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        
        <div className="modal-actions" style={{justifyContent: 'flex-end', marginTop: '20px'}}>
          <button 
            type="button" 
            onClick={onClose}
            style={{backgroundColor:"gray"}}
            className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
const EditStockModal = ({ show, onClose, stock, onUpdate, onDelete }) => {
    const [stockData, setStockData] = useState({
        symbol: stock?.symbol || '',
        name: stock?.name || '',
        price: stock?.price || ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (stock) {
            setStockData({
                symbol: stock.symbol,
                name: stock.name,
                price: stock.price
            });
        }
    }, [stock]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStockData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => { 
        e.preventDefault();
        setIsLoading(true);
        try {
            await onUpdate(stock._id, stockData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(stock._id);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!show || !stock) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ position: 'relative', zIndex: '1000' }}>
                <div onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: 'black' }}>X</div>
                <h3>Edit Custom Stock</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Stock Symbol</label>
                        <input
                            type="text"
                            name="symbol"
                            value={stockData.symbol}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Stock Name</label>
                        <input
                            type="text"
                            name="name"
                            value={stockData.name}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Price per Share ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            value={stockData.price}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            style={{ backgroundColor: "red" }}
                            className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Stock'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ backgroundColor: "gray" }}
                            className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
                        >
                            {isLoading ? 'Updating...' : 'Update Stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
const AddStockModal = ({ show, onClose, onAdd }) => {
    const [stockData, setStockData] = useState({
        symbol: '',
        name: '',
        price: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStockData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onAdd(stockData);
            // setStockData({ symbol: '', name: '', price: '' });
            // onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay"
        >
            <div className="modal-content" style={{ position: 'relative', zIndex: '1000' }}>
                <div onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: 'black' }}>X</div>
                <h3>Add Custom Stock</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Stock Symbol</label>
                        <input
                            type="text"
                            name="symbol"
                            value={stockData.symbol}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Stocks Name</label>
                        <input
                            type="text"
                            name="name"
                            value={stockData.name}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Price per Share ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            value={stockData.price}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} style={{ backgroundColor: "red" }} className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
                        >
                            {isLoading ? 'Adding...' : 'Add Stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
const UserTransactions = () => {
    const [isLoading, setisLoading] = useState(true);
    const [UserTransactions, setUserTransactions] = useState([]);
    const [isDisable, setisDisable] = useState(false);
    const [isDisableDelete, setisDisableDelete] = useState(false);
    const [Active, setActive] = useState(false);
    const [liveStockValues, setLiveStockValues] = useState({});
    const [spValue, setspValue] = useState(true);
    const [showAddStockModal, setShowAddStockModal] = useState(false);
    const [customStocks, setCustomStocks] = useState([]);
    const [combinedStocks, setCombinedStocks] = useState([]);
    const [showCustomStocksModal, setShowCustomStocksModal] = useState(false);
const [showEditStockModal, setShowEditStockModal] = useState(false);
const [selectedCustomStock, setSelectedCustomStock] = useState(null);
    useEffect(() => {
        const fetchCustomStocks = async () => {
            try {
                const response = await getStocksApi();
                if (response.success) {
                    setCustomStocks(response.stocks);
                }
            } catch (error) {
                console.error('Error fetching custom stocks:', error);
            }
        };

        fetchCustomStocks();
    }, []);
    useEffect(() => {
        // Format custom stocks to match predefined structure
        const formattedCustomStocks = customStocks.map(stock => ({
            symbol: stock.symbol,
            name: stock.name,
            custom: true
        }));

        // Combine with predefined stocks
        const allStocks = [...stockData, ...formattedCustomStocks].sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        setCombinedStocks(allStocks);
    }, [customStocks]);
    const handleAddCustomStock = async (stockData) => {

        try {
            const response = await addNewStockApi(stockData);
            if (response.success) {
                toast.success('Stock added successfully');
                // Update custom stocks list
                setShowAddStockModal(false);
                setCustomStocks(prev => [...prev, response.stock]);
            } else {
                toast.error(response.msg || 'Failed to add stock');
            }
        } catch (error) {
            toast.error('Error adding stock');
            console.error(error);
        }
    };
    // 
    // Add these state variables near the top of your UserTransactions component
   

    // Add these handler functions
    const handleUpdateStock = async (stockId, updatedData) => {
        try {
            const response = await updateStockApi(stockId, updatedData);
            if (response.success) {
                toast.success('Stock updated successfully');
                setCustomStocks(prev =>
                    prev.map(stock =>
                        stock._id === stockId ? { ...stock, ...updatedData } : stock
                    )
                );
            } else {
                toast.error(response.msg || 'Failed to update stock');
            }
        } catch (error) {
            toast.error('Error updating stock');
            console.error(error);
        }
    };

    const handleDeleteStock = async (stockId) => {
        try {
            const response = await deleteStockApi(stockId);
            if (response.success) {
                toast.success('Stock deleted successfully');
                setCustomStocks(prev => prev.filter(stock => stock._id !== stockId));
            } else {
                toast.error(response.msg || 'Failed to delete stock');
            }
        } catch (error) {
            toast.error('Error deleting stock');
            console.error(error);
        }
    };

 const handleEditStock = (stock) => {
  setSelectedCustomStock(stock);
  setShowCustomStocksModal(false);
  setShowEditStockModal(true);
};
    // 
    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };
    const [stocks, setStocks] = useState({
        stockName: '',
        stockSymbol: '',
        stockAmount: 1,
        stockValue: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStocks((prevStocks) => ({
            ...prevStocks,
            [name]: value
        }));
    };

    let { id } = useParams();

    let authUser = useAuthUser();
    let Navigate = useNavigate();

    const getCoins = async () => {
        try {

            const userCoins = await getCoinsApi(id);

            if (userCoins.success) {
                const stocks = userCoins.getCoin.stocks;

                // Check if stocks is defined and is an array
                if (Array.isArray(stocks)) {
                    if (Array.isArray(stocks) && stocks !== null && stocks !== undefined) {
                        setUserTransactions(stocks.reverse()); // Set the stocks if available
                        setisLoading(false);
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
        }
    };

    //
    useEffect(() => {
        if (authUser().user.role === "user") {
            Navigate("/dashboard");
            return;
        }
        getCoins();

    }, []);
    // Copy
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

            const values = {};
            responses.forEach((response, index) => {
                const symbol = symbols[index];
                const timeSeries = response.data['Time Series (5min)'];
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
    const createUserStocks = async (e) => {
        e.preventDefault();

        console.log(stocks);
        console.log(selectedStock);
        try {
            setisDisable(true);

            if (stocks.stockName === "" || stocks.stockAmount === "" || stockValue === null) {
                toast.dismiss();
                toast.error("All the fields are required!");
                return;
            }

            let body = {
                stockName: stocks.stockName,
                stockSymbol: selectedStock,
                stockValue: stockValue,
                stockAmount: stocks.stockAmount,
            };

            console.log('body: ', body);
            if (
                !body.stockName ||
                !body.stockSymbol ||
                !body.stockAmount ||
                !body.stockValue
            ) {
                toast.dismiss();
                toast.error("Fill all the required fields");
                return;
            }
            const newStocks = await createUserStocksApi(id, body);

            if (newStocks.success) {
                toast.dismiss();
                toast.success(newStocks.msg);
                setStocks({
                    stockName: '',
                    stockSymbol: '',
                    stockAmount: '',
                    stockValue: ''
                });
                // setStocksNew([])
                // setSelectedStock("")
                getCoins();
            } else {
                toast.dismiss();
                toast.error(newStocks.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisable(false);
        }
    };
    const deleteUserStock = async (coindId) => {


        try {
            setisDisableDelete(true);


            const deleteStock = await deleteUserStocksApi(coindId, id);

            if (deleteStock.success) {
                toast.dismiss();
                toast.success(deleteStock.msg);

                getCoins();
            } else {
                toast.dismiss();
                toast.error(deleteStock.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisableDelete(false);

        }
    };

    // Copy 
    const [stocksNew, setStocksNew] = useState([]);
    const [selectedStock, setSelectedStock] = useState('');
    const [stockValue, setStockValue] = useState('');
    const [apiLoading, setapiLoading] = useState(false);
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

    // Function to get stock price
    const getStockValue = (symbol) => {
        setapiLoading(true);

        // Check if it's a custom stock
        const customStock = customStocks.find(stock => stock.symbol === symbol);
        if (customStock) {
            setStockValue(customStock.price);
            setapiLoading(false);
            return;
        }

        // Otherwise, fetch from API
        axios
            .get(
                `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`
            )
            .then((response) => {
                const timeSeries = response.data['Time Series (5min)'];
                if (timeSeries) {
                    setapiLoading(false);
                    const latestTime = Object.keys(timeSeries)[0];
                    const latestData = timeSeries[latestTime]['1. open'];
                    setStockValue(latestData);
                } else {
                    alert('Stock data not available');
                }
            })
            .catch((error) => {
                console.error('Error fetching stock data:', error);
                setapiLoading(false);
            });
    };

    // Handle dropdown selection
    const handleStockChange = (event) => {
        const selectedSymbol = event.target.value;
        console.log('selectedSymbol: ', selectedSymbol);
        setSelectedStock(selectedSymbol);
        getStockValue(selectedSymbol);

        // First check in custom stocks
        const customStock = customStocks.find(stock => stock.symbol === selectedSymbol);
        if (customStock) {
            setStocks(prevStocks => ({
                ...prevStocks,
                stockName: customStock.name
            }));
            return;
        }

        // If not found in custom stocks, check in predefined stocks
        const predefinedStock = stockData.find(stock => stock.symbol === selectedSymbol);
        console.log('predefinedStock: ', predefinedStock);
        if (predefinedStock) {
            setStocks(prevStocks => ({
                ...prevStocks,
                stockName: predefinedStock.name
            }));
        }
    };
    useEffect(() => {
        if (stocks.stockAmount && stockValue) {
            const calculatedValue = parseFloat(stocks.stockAmount) * parseFloat(stockValue);
            setStocks((prevStocks) => ({
                ...prevStocks,
                stockValue: calculatedValue.toFixed(2) // Rounded to 2 decimal places
            }));
        } else if (stocks.stockAmount === '' || parseFloat(stocks.stockAmount) === 0) {
            // If the stock amount is cleared (backspace) or set to zero, reset stock value
            setStocks((prevStocks) => ({
                ...prevStocks,
                stockValue: '' // Reset the stockValue to an empty string
            }));
        }
    }, [stocks.stockAmount, stockValue]);
    const handleCloseEditModal = () => {
  setShowEditStockModal(false);
  setShowCustomStocksModal(true); // Return to the list modal
};
    return (
        <>



            <div className="admin">
                <div>
                    <div className="bg-muted-100 dark:bg-muted-900 pb-20">
                        <SideBar state={Active} toggle={toggleBar} />
                        <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
                            <div className="mx-auto w-full max-w-7xl">
                                <AdminHeader toggle={toggleBar} pageName="User Management" />
                                <div
                                    className="nuxt-loading-indicator"
                                    style={{
                                        position: "fixed",
                                        top: "0px",
                                        right: "0px",
                                        left: "0px",
                                        pointerEvents: "none",
                                        width: "auto",
                                        height: "3px",
                                        opacity: 0,
                                        background: "var(--color-primary-500)",
                                        transform: "scaleX(0)",
                                        transformOrigin: "left center",
                                        transition:
                                            "transform 0.1s ease 0s, height 0.4s ease 0s, opacity 0.4s ease 0s",
                                        zIndex: 999999,
                                    }}
                                />
                                <seokit />
                                <div className="min-h-screen overflow-hidden">
                                    <div className="grid gap-8 sm:grid-cols-12">
                                        <UserSideBar userid={id} />
                                        <div className="col-span-12 sm:col-span-8">
                                            <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white duration-300 rounded-md">
                                                <div className="flex items-center justify-between p-4">
                                                    <div>
                                                        <p
                                                            className="font-heading text-sm font-medium leading-normal leading-normal uppercase tracking-wider"
                                                            tag="h2"
                                                        >
                                                            {" "}
                                                            Add New Stock
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddStockModal(true)}
                                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"

                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    Add Custom Stock
                                                </button>
                                              <button
  type="button"
  onClick={() => setShowCustomStocksModal(true)}
  className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
  style={{ marginLeft: '10px' }}
>
  Edit Custom Stocks
</button>

                                               
                                                <div className="pt-6 asm">
                                                    <Table striped bordered hover>
                                                        <thead>
                                                            <tr>
                                                                <th>Stock Name</th>
                                                                <th>Stock Symbol</th>
                                                                <th>Quantity</th>
                                                                <th>Total Value</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <select className="this-sel" value={selectedStock} onChange={handleStockChange}>
                                                                        <option value="">Select a stock</option>
                                                                        {combinedStocks.map((stock, index) => (
                                                                            <option key={index} value={stock.symbol}>
                                                                                {stock.name} {stock.custom ? '(Custom)' : ''}
                                                                            </option>
                                                                        ))}
                                                                    </select>

                                                                </td>
                                                                <td className="text-center">
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Enter stock symbol"
                                                                        name="stockSymbol"
                                                                        readOnly={true}
                                                                        value={selectedStock}

                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Enter amount"
                                                                        name="stockAmount"
                                                                        value={stocks.stockAmount}
                                                                        onChange={handleChange}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {apiLoading ? <div className="loader-container">
                                                                        <Spinner animation="border" role="status">
                                                                            <span className="visually-hidden">Loading...</span>
                                                                        </Spinner>
                                                                    </div> :
                                                                        <Form.Control
                                                                            type="number"
                                                                            placeholder="Enter amount"
                                                                            name="stockAmount"
                                                                            value={stocks.stockValue}
                                                                            readOnly={true}
                                                                            onChange={handleChange}
                                                                        />
                                                                    }

                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                    <div style={{ textAlign: "center", padding: "5px 10px" }}>

                                                        <button disabled={isDisable || apiLoading}
                                                            onClick={createUserStocks}
                                                            type="button"
                                                            className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"> <span>
                                                                {isDisable ? (
                                                                    <div>
                                                                        <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                                                    </div>
                                                                ) : (
                                                                    "Add Stock"
                                                                )}

                                                            </span></button>
                                                    </div>
                                                </div>

                                            </div>
                                            <br />
                                            <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white duration-300 rounded-md">
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
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>Stock Name</th>
                                                                    <th>Stock Symbol</th>
                                                                    <th>Quantity</th>
                                                                    <th>Total Value</th>
                                                                    <th>Action</th>
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
                                                                                ) : (
                                                                                    (() => {
                                                                                        const liveValue = liveStockValues[transaction.stockSymbol];
                                                                                        const calculatedValue = parseFloat(liveValue) * parseFloat(transaction.stockAmount);
                                                                                        const formattedValue = isNaN(calculatedValue)
                                                                                            ? parseFloat(transaction.stockValue) * parseFloat(transaction.stockAmount)
                                                                                            : calculatedValue;
                                                                                        return `$${formattedValue.toFixed(3) || 'N/A'}`;
                                                                                    })()
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                <button
                                                                                    onClick={() => deleteUserStock(transaction._id)} disabled={isDisableDelete} style={{ backgroundColor: "red" }} type="button" className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"> <span>
                                                                                        {isDisableDelete ? (
                                                                                            <div>
                                                                                                <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                                                                            </div>
                                                                                        ) : (
                                                                                            "Delete"
                                                                                        )}
                                                                                    </span></button>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="5" className="text-center">No stocks available</td>
                                                                </tr>

                                                            )}
                                                        </Table>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div >
                                {/**/}
                            </div>
                        </div>

                    </div>
                </div>
                {/* Modal 1 */}
                <AddStockModal
                    show={showAddStockModal}
                    onClose={() => setShowAddStockModal(false)}
                    onAdd={handleAddCustomStock}
                />

<CustomStocksModal
  show={showCustomStocksModal}
  onClose={() => setShowCustomStocksModal(false)}
  stocks={customStocks}
  onEdit={handleEditStock}
/>

<EditStockModal
  show={showEditStockModal}
  onClose={handleCloseEditModal}
  stock={selectedCustomStock}
  onUpdate={handleUpdateStock}
  onDelete={handleDeleteStock}
/>
                {/* Modal 1 */}
            </div>
        </>
    );
};

export default UserTransactions;
