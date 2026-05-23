import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { detailsOrder, payOrder } from '../actions/OrderAction';
import "../styles/OrderDetails.css";
import axios from "../Axios";
import { PayPalButton } from 'react-paypal-button-v2';
import { ORDER_PAY_RESET } from '../constants/OrderConstant';

const OrderDetails = (props) => {

    const orderID = props.match.params.id;

    const [sdkReady, setSdkReady] = useState(false);

    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector((state) => state.orderPay);
    const {
        loading: loadingPay,
        error: errorPay,
        success: successPay
    } = orderPay;

    useEffect(() => {

        const addPayPalScript = async () => {
            const { data } = await axios.get('/api/config/paypal');

            // Prevent duplicate PayPal script loading
            const existingScript = document.querySelector(
                `script[src*="paypal.com/sdk/js"]`
            );

            if (!existingScript) {
                const script = document.createElement('script');

                script.type = 'text/javascript';
                script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
                script.async = true;

                script.onload = () => {
                    setSdkReady(true);
                };

                document.body.appendChild(script);
            } else {
                setSdkReady(true);
            }
        };

        // Reload order after successful payment
        if (!order || successPay || order._id !== orderID) {

            dispatch({ type: ORDER_PAY_RESET });
            dispatch(detailsOrder(orderID));

        } else {

            // Load PayPal only if order not paid
            if (!order.isPaid) {

                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }

            }

        }

    }, [dispatch, orderID, order, successPay]);

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order, paymentResult));
    };

    // Format numbers safely
    const fmt = (value) => Number(value || 0).toFixed(2);

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : !order ? null : (
        <div>

            <h3 id="order-id">Order ID: {order._id}</h3>

            <div className="row-container">

                {/* LEFT SECTION */}
                <div className="col-6">

                    <ul>

                        {/* SHIPPING */}
                        <li>
                            <div className="card-body">

                                <h2>Shipping</h2>

                                <p>
                                    <strong>Name: </strong>
                                    {order.shippingAddress?.fullName}
                                </p>

                                <p>
                                    <strong>Address: </strong>
                                    {order.shippingAddress?.address},{" "}
                                    {order.shippingAddress?.city},{" "}
                                    {order.shippingAddress?.postalcode},{" "}
                                    {order.shippingAddress?.country}
                                </p>

                                {order.isDelivered ? (
                                    <MessageBox variant="success">
                                        Delivered at{" "}
                                        {order.deliveredAt?.substring(0, 10)}
                                    </MessageBox>
                                ) : (
                                    <MessageBox variant="danger">
                                        Not Delivered
                                    </MessageBox>
                                )}

                            </div>
                        </li>

                        {/* PAYMENT */}
                        <li>
                            <div className="card-body">

                                <h2>Payment Method</h2>

                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>

                                {order.isPaid ? (
                                    <MessageBox variant="success">
                                        Paid at {order.paidAt?.substring(0, 10)}
                                    </MessageBox>
                                ) : (
                                    <MessageBox variant="danger">
                                        Not Paid
                                    </MessageBox>
                                )}

                            </div>
                        </li>

                        {/* ORDER ITEMS */}
                        <li>
                            <div className="card-body">

                                <h2>Order Items</h2>

                                {order.orderItems.length === 0 ? (
                                    <MessageBox>
                                        Cart is empty
                                    </MessageBox>
                                ) : (
                                    <ul>

                                        {order.orderItems.map((item) => (

                                            <li key={item.product}>

                                                <div className="row1 order-row1">

                                                    <div className="small">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                        />
                                                    </div>

                                                    <div className="min-30">
                                                        <Link to={`/products/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </div>

                                                    <div>
                                                        {item.qty} x ${fmt(item.price)} = $
                                                        {fmt(item.qty * item.price)}
                                                    </div>

                                                </div>

                                            </li>

                                        ))}

                                    </ul>
                                )}

                            </div>
                        </li>

                    </ul>

                </div>

                {/* RIGHT SECTION */}
                <div className="col-7">

                    <div className="card-body">

                        <ul>

                            <li>
                                <h2>Order Summary</h2>
                            </li>

                            <li>
                                <p>Items</p>
                                <p>${fmt(order.itemsPrice)}</p>
                            </li>

                            <li>
                                <p>Shipping</p>
                                <p>${fmt(order.shippingPrice)}</p>
                            </li>

                            <li>
                                <p>Tax</p>
                                <p>${fmt(order.taxPrice)}</p>
                            </li>

                            <li>
                                <p>
                                    <strong>Total</strong>
                                </p>

                                <p>
                                    <strong>${fmt(order.totalPrice)}</strong>
                                </p>
                            </li>

                            {/* PAYPAL BUTTON */}
                            {!order.isPaid && (
                                <li>

                                    {loadingPay && <LoadingBox />}

                                    {errorPay && (
                                        <MessageBox variant="danger">
                                            {errorPay}
                                        </MessageBox>
                                    )}

                                    {!sdkReady ? (
                                        <LoadingBox />
                                    ) : (
                                        <div className="order-page-pay-btn">

                                            <PayPalButton
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            />

                                        </div>
                                    )}

                                </li>
                            )}

                            {/* PAYMENT SUCCESS */}
                            {order.isPaid && (
                                <li>
                                    <MessageBox variant="success">
                                        Payment completed successfully
                                    </MessageBox>
                                </li>
                            )}

                        </ul>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default OrderDetails;
