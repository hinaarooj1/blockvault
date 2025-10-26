import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { verifyEmailApi } from "../../Api/Service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import PropagateLoader from "react-spinners/PropagateLoader";
const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(false);
    const [header, setHeader] = useState("");
    const { id, token } = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            const data = { id, token };
            try {
                const updateHeader = await verifyEmailApi(data);

                if (updateHeader.success) {
                    setHeader(updateHeader.msg);
                    setValidUrl(true);
                } else {
                    setHeader(updateHeader.msg);
                    setValidUrl(false);
                }
            } catch (error) {
                toast.dismiss();
                toast.error(
                    error?.data?.msg || error?.message || "Something went wrong"
                );
            }
        };

        verifyEmailUrl();
    }, [id, token]);

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Row className="text-center">
                <Col>
                    {validUrl ? (
                        <>
                            <FontAwesomeIcon icon={faCheckCircle} size="6x" color="green" className="mb-3" />
                            <h1 className="mb-3">Email Verified Successfully</h1>
                            <Link to="/auth/login">
                                <Button variant="success">Login</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {header ? (
                                <h1 className="mb-3" style={{ fontSize: "25px" }}>
                                    {header}
                                </h1>
                            ) : (
                                <div className="d-flex justify-content-center align-items-center">
                                    <PropagateLoader />
                                </div>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default EmailVerify;
