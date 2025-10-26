import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { getLinksApi, getMyTokensApi, getsignUserApi, } from '../../../Api/Service';

import { Card, Spinner } from 'react-bootstrap';
import './style.css'

const MyTokens = () => {
    const [isLoading, setisLoading] = useState(true);

    const [UserData, setUserData] = useState(true);

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
    const getCoins = async (data) => {let id = data._id;
        try {

            const successData = await getMyTokensApi(id);if (successData.success) {
                setUserData(successData.myTokens);return;
            } else {
                toast.dismiss();
                toast.error(successData.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisLoading(false)
        }
    };
    //

    useEffect(() => {
        getsignUser();
        if (authUser().user.role === "user") {
            getCoins(authUser().user);

            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
    }, []);
    // withdraw

   

    return (
        <>
            <div className="row">
                <div className="col-xxl-12">
                    <div className="card new-bg-dark">
                        <Card.Header>
                            <Card.Title className='text-white'>My Tokens</Card.Title>
                        </Card.Header>
                        <div className="card-body">
                            {isLoading ? (
                                <div className="text-center my-5">
                                    <Spinner animation="border" variant="primary" />
                                    <h4 className="mt-3">Loading Tokens...</h4>
                                    <p>Please wait while we load the Tokens.</p>
                                </div>
                            ) : UserData === null || !UserData ? (
                                <div className="text-center my-5">
                                    <h4> No Tokens found!</h4>
                                </div>) : (

                                <div className="table-responsive thatv">
                                    <table className="table tbleas tickettable display mb-4 no-footer" id="example6">
                                        <thead>
                                            <tr>

                                                <th className='tleft'>Token Name</th>
                                                <th>Token Symbol</th>
                                                <th>Quantity</th>
                                                <th>Token Value</th>
                                                <th>Total Value</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {UserData == null || UserData == undefined || !UserData ? "" :
                                                UserData.map((token, index) => (
                                                    < >
                                                        <tr key={index} >
                                                            <td className='tleft'>
                                                                <span className="font-w600 fs-14">
                                                                    <img className='img30' style={{ width: "50px", height: "50px", objectFit: "fill", borderRadius: "100%", border: "2px solid white" }} src={token.logo} alt="" />{token.name}</span>
                                                            </td>
                                                            <td className=''>
                                                                <span className="font-w600 fs-14">
                                                                    {token.symbol}</span>
                                                            </td>
                                                            <td className=''>
                                                                <span className="font-w600 fs-14">
                                                                    {token.quantity}</span>
                                                            </td>
                                                            <td className=''>
                                                                <span className="font-w600 fs-14">
                                                                    {token.value}</span>
                                                            </td>
                                                            <td className='text-center'>
                                                                <span className="font-w600 fs-14">
                                                                    {token.totalValue}</span>
                                                            </td>
                                                        </tr>

                                                    </>
                                                ))
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>

    );
};

export default MyTokens;
