import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const StepVerifyEmail = ({ next, updateForm, email }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [codeSent, setCodeSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [cooldown, setCooldown] = useState(0);

    const sendCode = async (data) => {
        try {
            setLoading(true);
            const res = await axios.post(
                'http://localhost:5000/auth/send_code',
                {
                    email: data.email,
                }
            );

            updateForm({ email: data.email });
            setCodeSent(true);
            setMessage('Verification code sent to your email');
            setCooldown(60);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                    'Failed to send code. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const verifyCode = async () => {
        try {
            setLoading(true);
            const res = await axios.post(
                'http://localhost:5000/auth/verify_code',
                {
                    email,
                    code,
                }
            );

            if (res.data.verified) {
                setVerified(true);
                setMessage('Email verified successfully!');
                setTimeout(() => next(), 1500);
            }
        } catch (err) {
            setMessage(
                err.response?.data?.message || 'Invalid or expired code.'
            );
        } finally {
            setLoading(false);
        }
    };

    const maskEmail = () => {
        const [local, domain] = email.split('@');
        const visibleParts = local.slice(-5);
        const masked = '*'.repeat(local.length - 5) + visibleParts;
        return `${masked}@${domain}`;
    };

    return (
        <div>
            <h2 className="step-title">Verify Your Email</h2>

            {!codeSent ? (
                <form onSubmit={handleSubmit(sendCode)}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            defaultValue={email || ''}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="form-error">{errors.email.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="button button-primary"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                </form>
            ) : !verified ? (
                <div>
                    <p className="form-label">
                        Enter the 6-digit code sent to {maskEmail(email)}
                    </p>
                    <div className="code-container">
                        {[...Array(6)].map((_, i) => (
                            <input
                                key={i}
                                type="number"
                                maxLength="1"
                                className="code-input"
                                value={code[i] || ''}
                                onChange={(e) => {
                                    const newCode = code.split('');
                                    newCode[i] = e.target.value;
                                    setCode(newCode.join(''));
                                    if (e.target.value && i < 5) {
                                        document
                                            .getElementById(`code-${i + 1}`)
                                            .focus();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace') {
                                        e.preventDefault(); // prevent default delete behavior
                                        const newCode = code.split('');
                                        newCode[i] = ''; // clear current digit
                                        setCode(newCode.join(''));
                                        if (i > 0) {
                                            document
                                                .getElementById(`code-${i - 1}`)
                                                .focus(); // move back
                                        }
                                    }
                                }}
                                id={`code-${i}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={verifyCode}
                        className="button button-primary"
                        disabled={loading || code.length < 6}
                        style={{ width: '100%', marginBottom: '1rem' }}
                    >
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                    <button
                        onClick={handleSubmit(sendCode)}
                        className="button button-secondary"
                        disabled={cooldown > 0 || loading}
                        style={{ width: '100%' }}
                    >
                        {cooldown > 0
                            ? `Resend in ${cooldown}s`
                            : 'Resend Code'}
                    </button>
                    {message && (
                        <p
                            style={{
                                color: message.includes('sent')
                                    ? 'var(--success-color)'
                                    : 'var(--error-color)',
                                textAlign: 'center',
                                marginTop: '1rem',
                            }}
                        >
                            {message}
                        </p>
                    )}
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--success-color)"
                        strokeWidth="2"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p
                        style={{
                            color: 'var(--success-color)',
                            marginTop: '1rem',
                        }}
                    >
                        {message}
                    </p>
                </div>
            )}
        </div>
    );
};

export default StepVerifyEmail;
