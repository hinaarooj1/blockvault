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
    deleteUserTokensApi,
    getStocksApi,
    getAllTokensApi,
    deleteStockApi,
    updateStockApi,
    addMyTokensApi,
    updateTokenApi,
} from "../../../Api/Service";
import axios from "axios";
import './userStocks.css'
import AdminHeader from "../adminHeader";
const CustomTokenModal = ({ show, onClose, tokens, onEdit }) => {if (!show) return null;

    return (
        <div className="modal-overlay ASMD">
            <div className="modal-content" style={{ position: 'relative', zIndex: '1000', maxWidth: '800px', width: '90%' }}>
                <div onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: 'black' }}>X</div>
                <h3>Manage Tokens</h3>

                {tokens.length === 0 ? (
                    <p>No Tokens available</p>
                ) : (
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Logo</th>
                                    <th>Token Name</th>
                                    <th>Token Symbol</th>
                                    <th>Quantity</th>
                                    <th>Token Value</th>
                                    <th>Total Value</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tokens.map((token) => (
                                    <tr key={token._id}>
                                        <td><img style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%", border: "2px solid white" }} src={token.logo} /> </td>
                                        <td  >

                                            {token.name || 'N/A'}</td>
                                        <td className="text-center">{token.symbol || 'N/A'}</td>
                                        <td>{token.quantity || 'N/A'}</td>
                                        <td>{token.value || 'N/A'}</td>
                                        <td>{token.totalValue || 'N/A'}</td>
                                        <td>
                                            <button
                                                onClick={() => onEdit(token)}
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

                <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ backgroundColor: "gray" }}
                        className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
const EditTokenModal = ({ show, onClose, token, onDelete }) => {
    const [tokenData, settokenData] = useState({
        logo: token?.logo || '',
        symbol: token?.symbol || '',
        name: token?.name || '',
        quantity: token?.quantity || '',
        value: token?.value || '',
        totalValue: token?.totalValue || ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [totalValue, settotalValue] = useState(0);

    let { id } = useParams();
    useEffect(() => {
        if (token) {
            settokenData({
                symbol: token.symbol,
                name: token.name,
                quantity: token.quantity,
                value: token.value,
                totalValue: token.totalValue,
                logo: token.logo
            });
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        settokenData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    useEffect(() => {

        settotalValue((tokenData.value * tokenData.quantity).toFixed(2))
    }, [tokenData.value, tokenData.quantity]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {

            const response = await updateTokenApi(token._id, tokenData);
            if (response.success) {
                toast.success('Token updated successfully');
                onClose();

            } else {
                toast.error(response.msg || 'Failed to update stock');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {

        try {
            setIsDeleting(true);

            const deleteToken = await deleteUserTokensApi(token._id, id);

            if (deleteToken.success) {
                onDelete(token._id);
                onClose();
                toast.dismiss();
                toast.success(deleteToken.msg);

            } else {
                toast.dismiss();
                toast.error(deleteToken.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setIsDeleting(false);

        }
    };
    if (!show || !token) return null;

    return (
        <div className="modal-overlay ASMD">
            <div className="modal-content" style={{ position: 'relative', zIndex: '1000' }}>
                <div onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: 'black' }}>X</div>
                <h3>Edit Custom Token</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Token Logo</label>
                        <img src={tokenData.logo} style={{ width: "50px", height: "50px", borderRadius: "100%", objectFit: "fill", border: "2px solid grey" }} />

                    </div>
                    <div className="form-group">
                        <label>Token Symbol</label>
                        <input
                            type="text"
                            name="symbol"
                            value={tokenData.symbol}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Token Name</label>
                        <input
                            type="text"
                            name="name"
                            value={tokenData.name}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            step="0.01"
                            name="quantity"
                            value={tokenData.quantity}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Value</label>
                        <input
                            type="number"
                            step="0.01"
                            name="value"
                            value={tokenData.value}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Total Value</label>
                        <input
                            type="number"
                            step="0.01"
                            name="totalValue"
                            value={totalValue}
                            // onChange={handleChange}

                            readOnly

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
const AddTokenModal = ({ show, onClose, onAdd }) => {
    const [tokenData, setTokenData] = useState({
        logo: null, // File
        name: "",
        symbol: "",
        quantity: "",
        value: "",
        totalValue: 0,
    });
    const [preview, setPreview] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTokenData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {

            const fileSize = file.size;

            const maxSize = 10 * 1024 * 1024; // 3MB max size
            if (fileSize > maxSize) {
                toast.error("File size exceeds 10MB limit. Please choose a smaller file.");
                return;
            }

            // Directly set the File object 
            setTokenData((prev) => ({ ...prev, logo: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    // const totalValue =
    //     (parseFloat(tokenData.quantity) || 0) *
    //     (parseFloat(tokenData.value) || 0);

    useEffect(() => {
        setTokenData((prev) => ({
            ...prev,
            totalValue:
                (parseFloat(prev.quantity) || 0) *
                (parseFloat(prev.value) || 0),
        }));
    }, [tokenData.quantity, tokenData.value]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tokenData.logo || !tokenData.name.trim() || !tokenData.symbol.trim() ||
            !tokenData.quantity.trim() || !tokenData.value.trim()) {
            toast.info("All fields are required!");
            return;
        }
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', tokenData.name);
            formData.append('logo', tokenData.logo);
            formData.append('symbol', tokenData.symbol);
            formData.append('quantity', tokenData.quantity);
            formData.append('value', tokenData.value);
            formData.append('totalValue', tokenData.totalValue);

            let formResult = await onAdd(formData);

            if (formResult) {

                setTokenData({
                    logo: null, // File
                    name: "",
                    symbol: "",
                    quantity: "",
                    value: "",
                    totalValue: 0,
                })
                setPreview(null)
            }
            // settokenData({ symbol: '', name: '', price: '' });
            // onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay ASMD"
        >
            <div className="modal-content" style={{ position: 'relative', zIndex: '1000' }}>
                <div onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: 'black' }}>X</div>
                <h3>Add Token</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Token Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            required
                            className="form-control"
                        />
                        {preview && (
                            <div style={{ marginTop: "10px" }}>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                                />
                            </div>
                        )}
                    </div>
                    {/* Token Name */}
                    <div className="form-group">
                        <label>Token Name</label>
                        <input
                            type="text"
                            name="name"
                            value={tokenData.name}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="e.g. Bitcoin"
                        />
                    </div>

                    {/* Token Symbol */}
                    <div className="form-group">
                        <label>Token Symbol</label>
                        <input
                            type="text"
                            name="symbol"
                            value={tokenData.symbol}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="e.g. BTC"
                        />
                    </div>

                    {/* Quantity */}
                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={tokenData.quantity}
                            onChange={handleChange}
                            required
                            min="1"
                            className="form-control"
                            placeholder="e.g. 10"
                        />
                    </div>

                    {/* Value per Token */}
                    <div className="form-group">
                        <label>Token Value</label>
                        <input
                            type="number"
                            step="0.01"
                            name="value"
                            value={tokenData.value}
                            onChange={handleChange}
                            required
                            min="0"
                            className="form-control"
                            placeholder="e.g. 200"
                        />
                    </div>

                    {/* Auto Calculated Total */}
                    <div className="form-group">
                        <label>Total Value</label>
                        <input
                            type="number"
                            value={tokenData.totalValue}
                            readOnly
                            name="totalValue"
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
                            {isLoading ? 'Adding...' : 'Add Token'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
const UserTokens = () => {
    const [isLoading, setisLoading] = useState(true);

    const [isDisableDelete, setisDisableDelete] = useState(false);
    const [Active, setActive] = useState(false);

    const [showAddTokenModal, setShowAddTokenModal] = useState(false);
    const [AllTokens, setAllTokens] = useState([]);
    const [combinedStocks, setCombinedStocks] = useState([]);
    const [showCustomTokenModal, setShowCustomTokenModal] = useState(false);
    const [showEditTokenModal, setShowEditTokenModal] = useState(false);
    const [selectedCustomToken, setSelectedCustomToken] = useState(null);
    const fetchAllTokens = async () => {
        try {
            const response = await getAllTokensApi();
            if (response.success) {
                setAllTokens(response.stocks);}
        } catch (error) {
            console.error('Error fetching custom tokens:', error);
        } finally {
            setisLoading(false)
        }
    };
    const handleTokenDelete = (deletedTokenId) => {
        // Filter out the deleted token from the AllTokens array
        setAllTokens(prevTokens => prevTokens.filter(token => token._id !== deletedTokenId));
    };
    useEffect(() => {

        fetchAllTokens();
    }, []);

    const handleAddToken = async (formData) => {

        try {
            const response = await addMyTokensApi(id, formData);
            if (response.success) {
                toast.success('Token added successfully');
                // Update custom stocks list
                fetchAllTokens()
                setShowAddTokenModal(false);
                return true;
            } else {
                toast.error(response.msg || 'Failed to add Token');
                return false
            }
        } catch (error) {
            toast.error('Error adding Token');
            console.error(error);
            return false;
        }
    };
    // 
    // Add these state variables near the top of your UserTransactions component

    // Add these handler functions

    const handleEditStock = (token) => {
        setSelectedCustomToken(token);
        setShowCustomTokenModal(false);
        setShowEditTokenModal(true);
    };
    // 
    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };

    let { id } = useParams();

    let authUser = useAuthUser();
    let Navigate = useNavigate();

    //
    useEffect(() => {
        if (authUser().user.role === "user") {
            Navigate("/dashboard");
            return;
        }
    }, []);
    // Copy

    

    const deleteUserToken = async (coindId) => {

        try {
            setisDisableDelete(true);

            const deleteToken = await deleteUserTokensApi(coindId, id);

            if (deleteToken.success) {
                fetchAllTokens()
                toast.dismiss();
                toast.success(deleteToken.msg);

            } else {
                toast.dismiss();
                toast.error(deleteToken.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisableDelete(false);

        }
    };

    // Copy  

    // Predefined stock symbols and their corresponding company names

    const handleCloseEditModal = () => {
        setShowEditTokenModal(false);
        setShowCustomTokenModal(true); // Return to the list modal
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
                                        <div className="col-span-12 sm:col-span-8 ">
                                            <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white duration-300 rounded-md">
                                                <div className="flex items-center justify-between p-4">
                                                    <div>
                                                        <p
                                                            className="font-heading text-sm font-medium leading-normal leading-normal uppercase tracking-wider"
                                                            tag="h2"
                                                        >
                                                            {" "}
                                                            Add New Token
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pb-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAddTokenModal(true)}
                                                        className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"

                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        Add  Token
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCustomTokenModal(true)}
                                                        className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        Edit  Tokens
                                                    </button>
                                                </div>

                                                {/*                                                
                                                <div className="pt-6 asm">
                                                    <Table striped bordered hover>
                                                        <thead>
                                                            <tr>
                                                                <th>Token Name</th>
                                                                <th>Token Symbol</th>
                                                                <th>Quantity</th>
                                                                <th>Total Value</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <select className="this-sel" value={selectedStock} onChange={handleStockChange}>
                                                                        <option value="">Select a Token</option>
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
                                                </div> */}

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
                                                            All Tokens
                                                        </p>
                                                    </div>
                                                </div>
                                                {isLoading && (
                                                    <div className="  p-5">Loading Tokens...</div>
                                                )}
                                                {!isLoading && (
                                                    <div className="pt-6 asm">
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>Logo</th>
                                                                    <th>Token Name</th>
                                                                    <th>Token Symbol</th>
                                                                    <th>Quantity</th>
                                                                    <th>Token Value</th>
                                                                    <th>Total Value</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            {AllTokens && Array.isArray(AllTokens) && AllTokens.length > 0 ? (
                                                                AllTokens.map((token, index) => (
                                                                    <tbody>
                                                                        <tr key={index}>
                                                                            <td><img style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%", border: "2px solid white" }} src={token.logo} /> </td>
                                                                            <td  >

                                                                                {token.name || 'N/A'}</td>
                                                                            <td className="text-center">{token.symbol || 'N/A'}</td>
                                                                            <td>{token.quantity || 'N/A'}</td>
                                                                            <td>{token.value || 'N/A'}</td>
                                                                            <td>{token.totalValue || 'N/A'}</td>

                                                                            <td>
                                                                                <button
                                                                                    onClick={() => deleteUserToken(token._id)} disabled={isDisableDelete} style={{ backgroundColor: "red" }} type="button" className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"> <span>
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
                                                                    <td colSpan="5" className="text-center">No tokens available</td>
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
                <AddTokenModal
                    show={showAddTokenModal}
                    onClose={() => setShowAddTokenModal(false)}
                    onAdd={handleAddToken}
                    onDelete={handleTokenDelete}
                />

                <CustomTokenModal
                    show={showCustomTokenModal}
                    onClose={() => setShowCustomTokenModal(false)}
                    tokens={AllTokens}
                    onEdit={handleEditStock}
                    onDelete={handleTokenDelete}
                />

                <EditTokenModal
                    show={showEditTokenModal}
                    onClose={handleCloseEditModal}
                    token={selectedCustomToken}
                // onUpdate={handleUpdateStock}
                // onDelete={handleDeleteStock}
                />
                {/* Modal 1 */}
            </div>
        </>
    );
};

export default UserTokens;
