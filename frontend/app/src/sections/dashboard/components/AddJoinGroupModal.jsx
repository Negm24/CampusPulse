import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Api from '../../../utils/apiAxiosManager'; // Adjust this path if needed!

export default function AddJoinGroupModal({ type, user, onClose }) {
    const [isLoading, setIsLoading] = useState(false);

    // Create Form States
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [subjectDay, setSubjectDay] = useState('');
    const [period, setPeriod] = useState('');

    // Join Form States
    const [joinCode, setJoinCode] = useState('');

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Replace '/groups/create' with your actual Flask route when it is built!
            console.log('Creating group with:', {
                subjectName,
                subjectCode,
                subjectDay,
                period,
                created_by: user.id,
            });
            await Api.post('/groups/create', {
                subject_name: subjectName,
                subject_code: subjectCode,
                day: subjectDay,
                period: period,
                created_by: user.id,
            });
            alert('Group created successfully!');
            // Reload page to refresh context, or you can trigger a context refresh here
            window.location.reload();
        } catch (error) {
            console.error('Failed to create group:', error);
            alert(error.response?.data?.error || 'Failed to create group.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Replace '/groups/join' with your actual Flask route when it is built!
            await Api.post('/groups/join', {
                join_code: joinCode,
                user_id: user.id,
            });
            window.location.reload();
        } catch (error) {
            console.error('Failed to join group:', error);
            alert(
                error.response?.data?.error ||
                    'Failed to join group. Check your code.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    background: 'var(--white, #fff)',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius-md, 8px)',
                    width: '400px',
                    boxShadow: 'var(--shadow-lg)',
                }}
            >
                {/* Modal Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '1.5rem',
                    }}
                >
                    <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>
                        {type === 'create' ? 'Create a Group' : 'Join a Group'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            color: 'var(--text-light)',
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Conditional Form Rendering */}
                {type === 'create' ? (
                    <form
                        onSubmit={handleCreateSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Subject Name (e.g., Computer Vision)"
                            required
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                outline: 'none',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Subject Code (e.g., CC112)"
                            required
                            value={subjectCode}
                            onChange={(e) => setSubjectCode(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                outline: 'none',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Day (e.g., Monday)"
                            required
                            value={subjectDay}
                            onChange={(e) => setSubjectDay(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                outline: 'none',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Period 7/8/9"
                            required
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                outline: 'none',
                            }}
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '0.75rem',
                                background: 'var(--primary)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                opacity: isLoading ? 0.7 : 1,
                            }}
                        >
                            {isLoading ? 'Creating...' : 'Create Group'}
                        </button>
                    </form>
                ) : (
                    <form
                        onSubmit={handleJoinSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Enter Class Join Code"
                            required
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                outline: 'none',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '0.75rem',
                                background: 'var(--primary)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                opacity: isLoading ? 0.7 : 1,
                            }}
                        >
                            {isLoading ? 'Joining...' : 'Join Group'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
