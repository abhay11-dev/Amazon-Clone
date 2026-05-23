import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listOrderMine } from '../actions/OrderAction'
import LoadingBox from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"
import "../styles/OrderHistory.css"
import InfoIcon from '@material-ui/icons/Info';
import EmptyState from '../components/EmptyState'

const OrderHistory = (props) => {

    const dispatch = useDispatch();
    const orderMineList = useSelector((state) => state.orderMineList);
    const { loading, error, orders } = orderMineList;

    useEffect(() => {
        dispatch(listOrderMine());
    }, [dispatch]);

    return (
        <div className="orderhistory-container">
            <h1>Order History</h1>
            {loading ? <LoadingBox />
            : error ? <MessageBox variant="danger">{error}</MessageBox>
            : (orders || []).length === 0 ? (
                <EmptyState
                    title="You have not placed any orders yet."
                    message="When you place an order, it will appear here with payment and delivery details."
                    actionLabel="Start shopping"
                    linkTo="/"
                />
            )
            : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* FIX: orders was the full API response object { success, count, orders }
                            because listOrderMine dispatched data instead of data.orders.
                            Now fixed in OrderAction — orders is always a proper array here. */}
                        {(orders || []).map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt?.substring(0, 10)}</td>
                                <td>${Number(order.totalPrice).toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt?.substring(0, 10) : 'No'}</td>
                                <td>{order.isDelivered ? order.deliveredAt?.substring(0, 10) : 'No'}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="order-details-btn"
                                        onClick={() => props.history.push(`/order/${order._id}`)}
                                    >
                                        <InfoIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory;
