import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { register } from '../actions/UserAction';
import LoadingBox from '../components/LoadingBox';
import "../styles/Register.css"

const Register = (props) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [toast, setToast] = useState(null);

    const redirect = props.location.search
        ? props.location.search.split('=')[1]
        : '/';

    const userRegister = useSelector((state) => state.userRegister);
    const { userInfo, loading, error } = userRegister;

    const dispatch = useDispatch();

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const registerHandler = (e) => {
        e.preventDefault();

        if (!name.trim()) return showToast('Name is required.');
        if (!email.trim()) return showToast('Email is required.');
        if (password.length < 6) return showToast('Password must be at least 6 characters.');
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
            return showToast('Password must have uppercase, lowercase, and a number.');
        if (password !== confirmpassword) return showToast('Passwords do not match.');

        // FIX: pass confirmPassword as 4th argument — backend requires it
        dispatch(register(name, email, password, confirmpassword));
    };

    useEffect(() => {
        if (userInfo) props.history.push(redirect);
    }, [props.history, redirect, userInfo]);

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error]);

    return (
        <div className="register-container">
            {toast && (
                <div className={`reg-toast reg-toast--${toast.type}`}>
                    {toast.message}
                </div>
            )}
            <form className="form" onSubmit={registerHandler}>
                <div><h1>Register</h1></div>
                {loading && <LoadingBox />}

                <div className="form-ip-sec">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name"
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </div>

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

                <div className="form-ip-sec">
                    <label htmlFor="confirmpassword">Confirm Password:</label>
                    <input type="password" id="confirmpassword"
                        placeholder="Confirm password"
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <div>
                    <label />
                    <button className="submit-btn" type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>

                <div className="new-user-register">
                    <label />
                    <div>
                        Already have an account?
                        <Link to={`/signin?redirect=${redirect}`}> Sign In</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Register;