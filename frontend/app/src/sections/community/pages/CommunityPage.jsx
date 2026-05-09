import React, { useState, useEffect } from 'react';
import Api from '../../../utils/apiAxiosManager';
import { useOutletContext } from 'react-router-dom';
import ListDisplay from '../components/ListDisplay'; // Adjust import path if needed!
// import '../styles/dashboard.css';

export default function CommunityPage() {
    const { user, groups } = useOutletContext();

    // States to handle the "Master-Detail" view
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [instructors, setInstructors] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch members whenever the selected group changes
    useEffect(() => {
        const fetchMembers = async () => {
            if (!selectedGroupId) return;

            setIsLoading(true);
            try {
                // Call the backend to get all members for this specific group
                const res = await Api.get(`/groups/${selectedGroupId}/members`);

                // Assuming backend returns: { members: [{ first_name: "A", last_name: "B", role: "instructor" }, ...] }
                const membersList = res.members || [];

                // Filter and map them into simple strings for your ListDisplay component
                const insts = membersList
                    .filter(
                        (m) => m.role === 'instructor' || m.role === 'admin'
                    )
                    .map((m) => `${m.first_name} ${m.last_name}`.trim());

                const studs = membersList
                    .filter((m) => m.role === 'student')
                    .map((m) => `${m.first_name} ${m.last_name}`.trim());

                setInstructors(insts);
                setStudents(studs);
            } catch (error) {
                console.error('Failed to fetch members:', error);
                setInstructors([]);
                setStudents([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembers();
    }, [selectedGroupId]);

    return (
        <div id="community-page" style={{ padding: '0 2rem' }}>
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>
                Community
            </h1>

            <div
                style={{
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'flex-start',
                }}
            >
                {/* LEFT COLUMN: The Group Selector */}
                <div style={{ flex: '1', maxWidth: '350px' }}>
                    <h3 style={{ color: 'var(--text-dark)', marginTop: 0 }}>
                        My Groups
                    </h3>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                        }}
                    >
                        {groups && groups.length > 0 ? (
                            groups.map((group) => (
                                <button
                                    key={group.id}
                                    onClick={() => setSelectedGroupId(group.id)}
                                    style={{
                                        padding: '1rem',
                                        textAlign: 'left',
                                        background:
                                            selectedGroupId === group.id
                                                ? 'var(--primary)'
                                                : 'var(--white, #fff)',
                                        color:
                                            selectedGroupId === group.id
                                                ? '#fff'
                                                : 'var(--text-dark)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius:
                                            'var(--border-radius-md, 8px)',
                                        cursor: 'pointer',
                                        transition: 'var(--transition)',
                                        boxShadow:
                                            selectedGroupId === group.id
                                                ? 'var(--shadow-md)'
                                                : 'none',
                                    }}
                                >
                                    <strong
                                        style={{
                                            display: 'block',
                                            fontSize: '1.1rem',
                                        }}
                                    >
                                        {group.subject_name}
                                    </strong>
                                    <span
                                        style={{
                                            fontSize: '0.85rem',
                                            opacity: 0.8,
                                        }}
                                    >
                                        {group.subject_code}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-light)' }}>
                                You are not enrolled in any groups.
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: The Details (ListDisplay) */}
                <div
                    style={{
                        flex: '2',
                        background: 'var(--white, #fff)',
                        padding: '2rem',
                        borderRadius: 'var(--border-radius-lg, 12px)',
                        border: '1px solid var(--border-color)',
                        minHeight: '400px',
                    }}
                >
                    {!selectedGroupId ? (
                        <div
                            style={{
                                textAlign: 'center',
                                color: 'var(--text-light)',
                                marginTop: '4rem',
                            }}
                        >
                            <h2>Select a group to view its members.</h2>
                        </div>
                    ) : isLoading ? (
                        <div
                            style={{
                                textAlign: 'center',
                                color: 'var(--text-light)',
                                marginTop: '4rem',
                            }}
                        >
                            <h2>Loading community...</h2>
                        </div>
                    ) : (
                        <div>
                            <h2
                                style={{
                                    marginBottom: '2rem',
                                    color: 'var(--primary)',
                                    borderBottom:
                                        '2px solid var(--border-color)',
                                    paddingBottom: '0.5rem',
                                }}
                            >
                                {
                                    groups.find((g) => g.id === selectedGroupId)
                                        ?.subject_name
                                }{' '}
                                {
                                    groups.find((g) => g.id === selectedGroupId)
                                        ?.created_by
                                }
                                Members
                            </h2>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '3rem',
                                }}
                            >
                                {/* Calling your component twice! */}
                                <ListDisplay
                                    title="Instructors"
                                    items={instructors}
                                    user_id={user.id}
                                    creator={
                                        groups.find(
                                            (g) => g.id === selectedGroupId
                                        )?.instructor
                                    }
                                />
                                <ListDisplay
                                    user_id={user.id}
                                    title="Students"
                                    items={students}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
