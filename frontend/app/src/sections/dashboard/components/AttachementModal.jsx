import React from 'react';
import { FaTimes } from 'react-icons/fa';

const AttachmentModal = ({ fileUrl, onClose }) => {
    if (!fileUrl) return null;

    const isImage = fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i);

    return (
        <div className="file-modal-overlay" onClick={onClose}>
            <div
                className="file-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="file-modal-header">
                    <button className="file-modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {isImage ? (
                    <div className="file-modal-image-container">
                        <img
                            src={fileUrl}
                            alt="Attachment Preview"
                            className="file-modal-image"
                        />
                    </div>
                ) : (
                    <iframe
                        src={fileUrl}
                        title="File Viewer"
                        className="file-modal-iframe"
                    ></iframe>
                )}
            </div>
        </div>
    );
};

export default AttachmentModal;
