import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaUser, FaPhoneAlt, FaCog } from 'react-icons/fa';
import Api from '../../../utils/apiAxiosManager';
import DropDown from './DropDown';
import '../styles/settings.css';

const Settings = () => {
    const { user } = useOutletContext() || {};
    const [phone, setPhone] = useState(user?.phone || '');
    const [username, setUsername] = useState(user?.username || '');

    const [loading, setLoading] = useState(false);

    // Add 'details' to your feedback state
    const [feedback, setFeedback] = useState({
        type: '',
        message: '',
        details: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: '', message: '', details: null });

        try {
            const response = await Api.patch('/settings/update-profile', {
                phone,
                username,
            });
            setFeedback({
                type: 'success',
                message: response.message || 'Profile updated successfully!',
                details: {
                    username: response.username,
                    phone: response.phone,
                },
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            setFeedback({
                type: 'error',
                message: 'Failed to update profile. Please try again.',
                details: null,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page-wrapper">
            <div className="settings-card">
                <div className="settings-header">
                    <FaCog className="settings-icon-header" />
                    <h2 className="settings-title">Account Settings</h2>
                    <p className="settings-subtitle">
                        Manage your profile information
                    </p>
                </div>

                {feedback.message && (
                    <div className={`settings-alert alert-${feedback.type}`}>
                        {/* Wrap content in a div to stack message and dropdown */}
                        <div className="alert-content-wrapper">
                            <span>{feedback.message}</span>

                            {/* Render DropDown only on success and if details exist */}
                            {feedback.type === 'success' &&
                                feedback.details && (
                                    <DropDown details={feedback.details} />
                                )}
                        </div>
                        <button
                            type="button"
                            className="alert-close-btn"
                            onClick={() =>
                                setFeedback({
                                    type: '',
                                    message: '',
                                    details: null,
                                })
                            }
                        >
                            &times;
                        </button>
                    </div>
                )}

                <form className="settings-form" onSubmit={handleSubmit}>
                    {/* ... Your exact existing inputs for Username and Phone go here ... */}
                    <div className="form-group">
                        <label htmlFor="username" className="custom-label">
                            Username
                        </label>
                        <div className="custom-input-wrapper">
                            <span className="input-icon">
                                <FaUser />
                            </span>
                            <input
                                type="text"
                                className="custom-input"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone" className="custom-label">
                            Phone Number
                        </label>
                        <div className="custom-input-wrapper">
                            <span className="input-icon">
                                <FaPhoneAlt />
                            </span>
                            <input
                                type="text"
                                className="custom-input"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="custom-save-btn"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
