import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { createTicketApi, getsignUserApi, getUserTicketsApi, sendTicketApi } from "../../Api/Service";
import axios from 'axios';
import { Button, Card, Col, Form, DropdownDivider, InputGroup, Modal, Row, Spinner, Container } from 'react-bootstrap';


const CreateTicket = () => {
    const [Active, setActive] = useState(false);
    let param = useParams()
    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };
    //

    let authUser = useAuthUser();
    let Navigate = useNavigate();

    const [isUser, setIsUser] = useState({});
    const [isTicket, setisTicket] = useState(false);
    const [isDisable, setisDisable] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const sendTicket = async (e) => {
        try {
            setisDisable(true);
            let body = {
                userId: param.id,
                title: title,
                description: description,
                isAdmin: true
            };
            if (!title || !description) {
                toast.dismiss();
                toast.error("Both the fields are required");
                return;
            }
            // if (description.length < 20) {
            //     toast.dismiss();
            //     toast.error("Please provide a more detailed description");
            //     return;
            // }

            const userCoins = await createTicketApi(body);

            if (userCoins.success) {
                toast.success("Ticket created successfully");
                Navigate("/admin/support")
                // setisTicket(true);
                return;
            } else {
                toast.dismiss();
                toast.error(userCoins.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisable(false);
        }
    };


    //

    useEffect(() => {
        if (authUser().user.role === "user") {

            Navigate("/dashboard");
            return;
        } else if (authUser().user.role === "admin") {
            return;
        }
    }, []);
    useEffect(() => {
        const theme = document.body.getAttribute('data-theme-version');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, []);
    return (
        <>
            <div className="row">
                <div className="col-xxl-12">
                    <div className="card">
                        <Card.Header>
                            <Card.Title style={{ cursor: "pointer" }} onClick={() => Navigate("/admin/users")}><i style={{ fontSize: "23px" }} className="fa-solid fa-arrow-left"></i></Card.Title>
                            <Card.Title>Create  new Ticket </Card.Title>

                        </Card.Header>

                        {isTicket ? (
                            <Card.Body className="">
                                <p>Your ticket was sent. You will be answered by one of our representatives.</p>
                            </Card.Body>
                        ) : (
                            <Card.Body>
                                <div className="d-flex align-items-center gap-4 mb-4">
                                    <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle" style={{ width: '56px', height: '56px' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M224 128a96 96 0 0 1-144.07 83.11l-37.39 12.47a8 8 0 0 1-10.12-10.12l12.47-37.39A96 96 0 1 1 224 128" opacity=".2" />
                                            <path d="M128 24a104 104 0 0 0-91.82 152.88l-11.35 34.05a16 16 0 0 0 20.24 20.24l34.05-11.35A104 104 0 1 0 128 24m0 192a87.87 87.87 0 0 1-44.06-11.81a8 8 0 0 0-6.54-.67L40 216l12.47-37.4a8 8 0 0 0-.66-6.54A88 88 0 1 1 128 216" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="h5 font-weight-semibold">Create a New Ticket for {param.email}</h3>
                                        <p className="text-muted">Fill in the form below to create a new ticket.</p>
                                    </div>
                                </div>
                                <Form>
                                    <Form.Group className="mb-4">
                                        <Form.Label htmlFor="title">Title</Form.Label>
                                        <Form.Control
                                            id="title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter ticket title"
                                            className="dark:bg-muted-900/75 dark:text-muted-200"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label htmlFor="description">Description</Form.Label>
                                        <Form.Control
                                            id="description"
                                            as="textarea"
                                            rows={5}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter ticket description"
                                            className="dark:bg-muted-900/75 dark:text-muted-200"
                                        />
                                    </Form.Group>
                                    <Button
                                        onClick={sendTicket}
                                        disabled={isDisable}
                                        variant="primary"
                                        className="w-100"
                                    >
                                        {isDisable ? (
                                            <div className="spinner-border text-light" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            'Create'
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        )}


                    </div>
                </div>
            </div>

        </>

    );
};

export default CreateTicket;
