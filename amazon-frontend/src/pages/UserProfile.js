import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { detailsUser, updateUserProfile, verifyPassword } from '../actions/UserAction';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/UserConstant';
import EditIcon from '@material-ui/icons/Edit';
import "../styles/UserProfile.css";

const UserProfile = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [passwordVerified, setPasswordVerified] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(''); // 'success' or 'error'
    
    const userSignin = useSelector((state) => state.userSignin);
    const userDetails = useSelector((state) => state.userDetails);
    const userUpdateProfile = useSelector((state)=>state.userUpdateProfile);

    const {userInfo} = userSignin;
    const {loading,error,user} = userDetails;
    const {
        success: successUpdate,
        error: errorUpdate
    } = userUpdateProfile;

    const dispatch = useDispatch();

    useEffect(() => {
        if(!user){
            dispatch({
                type: 'USER_UPDATE_PROFILE_RESET'
            })
           dispatch(detailsUser(userInfo._id)); 
        }
        else{
            setName(user.name);
            setEmail(user.email);
        }
        
    }, [dispatch, userInfo._id,user]);

    useEffect(() => {
        if (successUpdate) {
            setIsEditing(false);
            setPasswordVerified(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
            showToast('Profile updated successfully!', 'success');
        }
    }, [successUpdate]);

    useEffect(() => {
        if (errorUpdate) {
            showToast(errorUpdate, 'error');
        }
    }, [errorUpdate]);

    const showToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
            setToastMessage('');
            setToastType('');
        }, 3000);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setPasswordError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPasswordVerified(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setName(user.name);
        setEmail(user.email);
    };

    const verifyPasswordHandler = async (e) => {
        e.preventDefault();
        
        if (!currentPassword.trim()) {
            setPasswordError('Please enter your current password');
            return;
        }

        setIsVerifying(true);
        setPasswordError('');

        try {
            const response = await dispatch(verifyPassword(currentPassword));
            if (response && response.success) {
                setPasswordVerified(true);
                setPasswordError('');
                showToast('Password verified successfully!', 'success');
            }
        } catch (err) {
            setPasswordError(err.message || 'Password verification failed');
            showToast(err.message || 'Incorrect password', 'error');
            setCurrentPassword('');
        } finally {
            setIsVerifying(false);
        }
    };

    const updateDetails = (e) =>{
        e.preventDefault();

        if (!name.trim()) {
            setPasswordError('Name is required');
            return;
        }

        if (!email.trim()) {
            setPasswordError('Email is required');
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        dispatch(updateUserProfile({
            userId: user._id,
            name,
            email,
            currentPassword,
            newPassword: newPassword || undefined
        }));
    }

    if (loading) {
        return <LoadingBox />;
    }

    if (error) {
        return <MessageBox variant="danger">{error}</MessageBox>;
    }

    return (
        <div className="profile-container">
            {toastMessage && (
                <div className={`toast toast-${toastType}`}>
                    {toastMessage}
                </div>
            )}

            <div className="profile-card">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user && user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                    </div>
                    <div className="profile-info-display">
                        <h1 className="profile-name">{user ? user.name : 'User'}</h1>
                        <p className="profile-email">{user ? user.email : ''}</p>
                    </div>
                    {!isEditing && (
                        <button 
                            type="button" 
                            className="edit-profile-btn"
                            onClick={handleEditClick}
                        >
                            <EditIcon />
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <div className="profile-edit-section">
                        <h2>Edit Profile</h2>

                        {!passwordVerified ? (
                            <div className="password-verification-section">
                                <p className="verification-info">
                                    For security, please verify your current password before making changes.
                                </p>
                                <form onSubmit={verifyPasswordHandler} className="verification-form">
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Current Password *</label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            placeholder="Enter your current password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                            disabled={isVerifying}
                                        />
                                    </div>

                                    {passwordError && (
                                        <div className="error-message">{passwordError}</div>
                                    )}

                                    <div className="form-actions">
                                        <button type="submit" className="btn-verify" disabled={isVerifying}>
                                            {isVerifying ? 'Verifying...' : 'Verify'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn-cancel"
                                            onClick={handleCancel}
                                            disabled={isVerifying}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <form onSubmit={updateDetails} className="edit-profile-form">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="password-change-section">
                                    <h3>Change Password (Optional)</h3>
                                    <p className="password-hint">Leave blank to keep your current password</p>

                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            placeholder="Enter new password (optional)"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {passwordError && (
                                    <div className="error-message">{passwordError}</div>
                                )}

                                <div className="form-actions">
                                    <button type="submit" className="btn-save">
                                        Save Changes
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-cancel"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserProfile
