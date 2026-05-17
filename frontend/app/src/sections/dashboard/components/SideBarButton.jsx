import React, { useState } from 'react';
import { FaRegArrowAltCircleDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SidebarButton = ({
    label,
    dropdown = false,
    options = [],
    path = '',
}) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        if (dropdown) {
            setOpen(!open);
        } else if (path) {
            navigate(path);
        }
    };

    return (
        <div className="sidebar-button">
            <button onClick={handleClick}>
                {label}
                {dropdown && (
                    <FaRegArrowAltCircleDown className="dropdown-icon" />
                )}
            </button>

            {dropdown && open && (
                <div className="dropdown-list">
                    {options.map((opt, idx) => (
                        <button key={idx} className="dropdown-item">
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SidebarButton;
