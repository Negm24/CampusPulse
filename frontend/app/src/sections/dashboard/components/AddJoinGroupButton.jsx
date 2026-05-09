import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import AddJoinGroupModal from './AddJoinGroupModal';

export default function AddJoinGroupButton({ user }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'create' or 'join'
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOptionClick = (type) => {
        setModalType(type);
        setIsModalOpen(true);
        setIsMenuOpen(false); // Close the dropdown menu
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                className="add-join-group-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'var(--transition)',
                }}
            >
                <FaPlus />
            </button>
            {isMenuOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50px',
                        left: 0,
                        zIndex: 100,
                        background: 'var(--white, #fff)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm, 6px)',
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '150px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Only Instructors and Admins can Create Groups */}
                    {(user.role === 'instructor' || user.role === 'admin') && (
                        <button
                            onClick={() => handleOptionClick('create')}
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                borderBottom: '1px solid var(--border-color)',
                            }}
                        >
                            Create Group
                        </button>
                    )}
                    {/* Everyone can Join a Group */}
                    <button
                        onClick={() => handleOptionClick('join')}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'none',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                        }}
                    >
                        Join Group
                    </button>
                </div>
            )}

            {/* Render the Modal physically outside the button layout */}
            {isModalOpen && (
                <AddJoinGroupModal
                    type={modalType}
                    user={user}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
