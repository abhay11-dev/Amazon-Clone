import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signin } from '../actions/UserAction';
import LoadingBox from '../components/LoadingBox';
import "../styles/SignIn.css"

const SignIn = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState(null);

    const redirect = props.location.search
        ? props.location.search.split('=')[1]
        : '/';

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo, loading, error } = userSignin;

    const dispatch = useDispatch();

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const signInHandler = (e) => {
        e.preventDefault();
        if (!email.trim()) return showToast('Email is required.');
        if (!password) return showToast('Password is required.');
        dispatch(signin(email, password));
    };

    useEffect(() => {
        if (userInfo) props.history.push(redirect);
    }, [props.history, redirect, userInfo]);

    // FIX: surface backend errors as toast (e.g. "Invalid email or password")
    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error]);

    return (
        <div className="signin-container">
            {toast && (
                <div className={`reg-toast reg-toast--${toast.type}`}>
                    {toast.message}
                </div>
            )}
            <form className="form" onSubmit={signInHandler}>
                <div><h1>Sign In</h1></div>
                {loading && <LoadingBox />}

                <div className="form-ip-sec">
                    <label htmlFor="email">E-mail:</label>
                    <input type="email" id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="form-ip-sec">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div>
                    <label />
                    <button className="submit-btn" type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>

                <div className="new-user-register">
                    <label />
                    <div>
                        New user?
                        <Link to={`/register?redirect=${redirect}`}> Create Account</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignIn;