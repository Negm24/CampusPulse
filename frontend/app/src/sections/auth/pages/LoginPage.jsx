import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/auth.css';
import Api from '../../../utils/apiAxiosManager';

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const [success, setSuccess] = useState(false);

    const onSubmit = async (data) => {
        try {
            const res = await Api.post('/auth/login', {
                identifier: data.identifier,
                password: data.password,
                isRememberMe: data.isRememberMe,
            });

            const storage = data.isRememberMe ? localStorage : sessionStorage;
            storage.setItem('access_token', res.access_token);

            if (res.access_token) {
                setSuccess(true);
                setLoginError('');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setLoginError('Login failed. Please check your credentials.');
                setSuccess(false);
            }
        } catch (err) {
            console.error(err);
            setLoginError('Invalid credentials or server error.');
        }
    };

    const navigateToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-content">
                    <div
                        className={
                            success
                                ? 'success login-header'
                                : loginError
                                ? 'login-header fail'
                                : 'login-header'
                        }
                    >
                        <div className="login-icon">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                                ></path>
                            </svg>
                        </div>
                        <h2 className="login-title">Welcome Back {success}</h2>
                        <p className="login-subtitle">
                            Sign in to your account
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="login-form"
                    >
                        <div className="input-group">
                            <div className="input-icon">
                                <i className="fas fa-user"></i>
                            </div>
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Username / Email / Phone"
                                {...register('identifier', { required: true })}
                            />
                        </div>
                        {errors.identifier && (
                            <p className="error-message">
                                This field is required
                            </p>
                        )}

                        <div className="input-group">
                            <div className="input-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <input
                                type="password"
                                className="login-input"
                                placeholder="Password"
                                {...register('password', { required: true })}
                            />
                        </div>
                        {errors.password && (
                            <p className="error-message">
                                Password is required
                            </p>
                        )}

                        <div className="form-options">
                            <div className="remember-me">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    {...register('isRememberMe', {
                                        required: false,
                                    })}
                                />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="#" className="forgot-password">
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" className="login-button">
                            Sign in
                        </button>

                        {loginError && (
                            <p
                                className="error-message"
                                style={{ textAlign: 'center' }}
                            >
                                {loginError}
                            </p>
                        )}
                    </form>

                    <p className="signup-link">
                        Don't have an account?{' '}
                        <a
                            onClick={navigateToRegister}
                            style={{ cursor: 'pointer' }}
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
