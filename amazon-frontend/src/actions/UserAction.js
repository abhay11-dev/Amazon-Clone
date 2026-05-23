import { 
    USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS,
    USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS,
    USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS,
    USER_SIGNOUT,
    USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS
} from "../constants/UserConstant"
import axios from "../Axios"

// ─── REGISTER ────────────────────────────────────────────────────────────────
// FIX 1: Backend requires confirmPassword in the body — was never sent.
// FIX 2: Backend returns { success, user, token } — we must flatten into a
//         single userInfo object so userInfo.token, userInfo.name, etc. all work.
export const register = (name, email, password, confirmPassword) => async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST });
    try {
        const { data } = await axios.post('/api/users/register', {
            name, email, password, confirmPassword
        });

        // Flatten: { _id, name, email, isAdmin, token }
        const userInfo = { ...data.user, token: data.token };

        dispatch({ type: USER_REGISTER_SUCCESS, payload: userInfo });
        dispatch({ type: USER_SIGNIN_SUCCESS,   payload: userInfo });
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// ─── SIGN IN ─────────────────────────────────────────────────────────────────
// FIX 3: Same shape mismatch — flatten { user, token } into one object.
export const signin = (email, password) => async (dispatch) => {
    dispatch({ type: USER_SIGNIN_REQUEST });
    try {
        const { data } = await axios.post('/api/users/signin', { email, password });

        const userInfo = { ...data.user, token: data.token };

        dispatch({ type: USER_SIGNIN_SUCCESS, payload: userInfo });
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
        dispatch({
            type: USER_SIGNIN_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// ─── SIGNOUT ─────────────────────────────────────────────────────────────────
export const signout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    dispatch({ type: USER_SIGNOUT });
};

// ─── USER DETAILS ─────────────────────────────────────────────────────────────
export const detailsUser = (userId) => async (dispatch, getState) => {
    dispatch({ type: USER_DETAILS_REQUEST, payload: userId });
    const { userSignin: { userInfo } } = getState();
    try {
        const { data } = await axios.get(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user || data });
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
export const updateUserProfile = (user) => async (dispatch, getState) => {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
    const { userSignin: { userInfo } } = getState();
    try {
        const { data } = await axios.put('/api/users/profile', user, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        // FIX 4: updateProfile also returns { user, token } shape — flatten same way
        const updatedInfo = { ...data.user, token: userInfo.token };

        dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: updatedInfo });
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: updatedInfo });
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// ─── VERIFY PASSWORD ──────────────────────────────────────────────────────────
export const verifyPassword = (currentPassword) => async (dispatch, getState) => {
    const { userSignin: { userInfo } } = getState();
    try {
        const { data } = await axios.post('/api/users/verify-password', 
            { currentPassword },
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        return data;
    } catch (error) {
    throw new Error(
        error.response?.data?.message || 'Password verification failed'
    );
    }
};
