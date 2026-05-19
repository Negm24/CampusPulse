import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

const PostOptionsMenu = ({ onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close the dropdown if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className="post-settings">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="post-settings-btn"
            >
                <FaEllipsisV />
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        backgroundColor: 'var(--white)',
                        boxShadow: 'var(--shadow-lg)',
                        borderRadius: 'var(--border-radius-sm)',
                        zIndex: 10,
                        minWidth: '120px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                    }}
                >
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onEdit();
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '10px 15px',
                            border: 'none',
                            borderBottom: '1px solid var(--border-color)',
                            background: 'var(--white)',
                            cursor: 'pointer',
                            gap: '8px',
                            color: 'var(--text-dark)',
                        }}
                    >
                        <FaEdit color="var(--primary)" /> Edit
                    </button>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onDelete();
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '10px 15px',
                            border: 'none',
                            background: 'var(--white)',
                            cursor: 'pointer',
                            gap: '8px',
                            color: 'var(--error-color)',
                        }}
                    >
                        <FaTrash /> Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostOptionsMenu;
