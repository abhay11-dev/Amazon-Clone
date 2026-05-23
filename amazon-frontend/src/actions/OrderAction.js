import { 
    ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS,
    ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS,
    ORDER_MINE_FAIL, ORDER_MINE_REQUEST, ORDER_MINE_SUCCESS,
    ORDER_PAY_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS
} from "../constants/OrderConstant"
import axios from "../Axios"
import { CART_EMPTY } from "../constants/CartConstant";

// ─── CREATE ORDER ─────────────────────────────────────────────────────────────
export const createdOrder = (order) => async (dispatch, getState) => {
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
    try {
        const { userSignin: { userInfo } } = getState();
        const { data } = await axios.post('/api/orders', order, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
        dispatch({ type: CART_EMPTY });
        localStorage.removeItem("cartItems");
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// ─── GET ORDER BY ID ──────────────────────────────────────────────────────────
// FIX: Backend returns { success: true, order: {...} }
// Was dispatching full `data` object — so order.shippingAddress was undefined → crash.
// Now correctly unwraps data.order before storing in state.
export const detailsOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
    const { userSignin: { userInfo } } = getState();
    try {
        const { data } = await axios.get(`/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.order });
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// ─── PAY ORDER ────────────────────────────────────────────────────────────────
export const payOrder = (order, paymentResult) => async (dispatch, getState) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });
    const { userSignin: { userInfo } } = getState();
    try {
        const { data } = await axios.put(`/api/orders/${order._id}/pay`, paymentResult, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// ─── LIST MY ORDERS ───────────────────────────────────────────────────────────
// FIX: Backend returns { success: true, count, orders: [...] }
// Was dispatching full `data` — orders in state was the whole object, not the array.
// .map() on an object crashes. Now correctly unwraps data.orders.
export const listOrderMine = () => async (dispatch, getState) => {
    dispatch({ type: ORDER_MINE_REQUEST });
    const { userSignin: { userInfo } } = getState();
    try {
        const { data } = await axios.get('/api/orders/mine', {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: ORDER_MINE_SUCCESS, payload: data.orders });
    } catch (error) {
        dispatch({
            type: ORDER_MINE_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};