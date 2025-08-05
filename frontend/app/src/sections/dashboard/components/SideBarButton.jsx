import React, { useState } from 'react';
import { FaRegArrowAltCircleDown } from 'react-icons/fa';

const SidebarButton = ({ label, dropdown = false, options = [] }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="sidebar-button">
            <button onClick={() => dropdown && setOpen(!open)}>
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
