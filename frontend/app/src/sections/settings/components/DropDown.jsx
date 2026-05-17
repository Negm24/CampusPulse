import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const DropDown = ({ details }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Do not render anything if there are no details or nothing was changed
    if (
        !details ||
        (details.username === 'unchanged' && details.phone === 'unchanged')
    ) {
        return null;
    }

    return (
        <div className="update-dropdown">
            <button
                type="button"
                className="update-dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>View Change Details</span>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {isOpen && (
                <div className="update-dropdown-content">
                    {details.username && details.username !== 'unchanged' && (
                        <div className="update-detail-item">
                            <strong>Username:</strong> {details.username}
                        </div>
                    )}
                    {details.phone && details.phone !== 'unchanged' && (
                        <div className="update-detail-item">
                            <strong>Phone:</strong> {details.phone}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropDown;
