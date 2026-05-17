import React from 'react';

export default function ListDisplay({ title, items, user_id, creator }) {
    // Sort items alphabetically
    const sortedItems = [...items].sort();

    return (
        <div className="list-display">
            <h3 className="list-title">
                {title} ({items.length})
            </h3>

            {items.length === 0 ? (
                <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
                    No {title.toLowerCase()} found.
                </p>
            ) : (
                <ul
                    className="list-items"
                    style={{
                        listStyleType: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}
                >
                    {sortedItems.map((item, index) => (
                        <li
                            key={index}
                            className="list-item"
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'var(--bg-color, #f4f7f6)',
                                borderRadius: '6px',
                                borderLeft:
                                    title === 'Instructors'
                                        ? '4px solid var(--primary)'
                                        : '4px solid #ccc',
                            }}
                        >
                            {item} {creator === item ? ' (Creator)' : ''}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
