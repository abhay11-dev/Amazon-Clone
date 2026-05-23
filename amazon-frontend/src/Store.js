import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { cartReducer } from './reducers/CartReducer';
import { orderCreateReducer, orderDetailsReducer, orderMineListReducer, orderPayReducer } from './reducers/OrderReducer';
import { prodcutDetailsReducer, prodcutListReducer } from './reducers/ProductReducer';
import { userDetailsReducer, userRegisterReducer, userSigninReducer, userUpdateProfileReducer } from './reducers/UserReducer';

// FIX: Old localStorage may have saved the full API response object { success, user, token }
// instead of the flattened { _id, name, email, isAdmin, token } shape.
// This migration ensures the app doesn't silently break for users who registered before the fix.
const getRawUserInfo = () => {
    try {
        const raw = localStorage.getItem('userInfo');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        // If it's the old broken shape (has a nested .user object), flatten it now
        if (parsed?.user && !parsed?.token) {
            // completely broken — clear it
            localStorage.removeItem('userInfo');
            return null;
        }
        if (parsed?.user && parsed?.token) {
            // old shape: { success, user: {...}, token }
            const fixed = { ...parsed.user, token: parsed.token };
            localStorage.setItem('userInfo', JSON.stringify(fixed));
            return fixed;
        }
        // already correct flat shape
        return parsed;
    } catch {
        localStorage.removeItem('userInfo');
        return null;
    }
};

const initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
        paymentMethod: 'PayPal',
    },
    userSignin: {
        userInfo: getRawUserInfo(),
    }
};

const reducer = combineReducers({
    productList: prodcutListReducer,
    productDetails: prodcutDetailsReducer,
    cart: cartReducer,
    userRegister: userRegisterReducer,
    userSignin: userSigninReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderMineList: orderMineListReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducer,
    initialState,
    composeEnhancer(applyMiddleware(thunk)),
);

export default store;