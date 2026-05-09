import React from 'react';
import Api from '../../../utils/apiAxiosManager'; // Adjust this path if needed!

const ViewGroupCodeButton = ({ group_id }) => {
    const handleViewCode = async () => {
        try {
            const res = await Api.get(`/groups/get_code/${group_id}`);
            const join_code = res.join_code;
            alert(`Group Code: ${join_code}`);
        } catch (error) {
            console.error('Failed to fetch group code:', error);
            alert('Could not fetch group code. Please try again.');
        }
    };

    return (
        <button onClick={handleViewCode} className="view-group-code-button">
            View Group Code
        </button>
    );
};

export default ViewGroupCodeButton;
