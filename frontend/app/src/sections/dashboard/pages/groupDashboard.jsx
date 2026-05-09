import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf, FaPaperPlane } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import '../styles/groupDashBoardPage.css';
import Api from '../../../utils/apiAxiosManager';
import ViewGroupCodeButton from '../components/ViewGroupCode';

export default function GroupDashboard() {
    const { groupId } = useParams();
    const { user, groups } = useOutletContext();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    // Find the specific group data from the context array
    const currentGroup = groups?.find((g) => g.id.toString() === groupId);

    useEffect(() => {
        const fetchStream = async () => {
            if (!currentGroup) return; // Skip if group invalid

            try {
                const res = await Api.get(
                    `/posts/group/${groupId}/user/${user.id}`
                );
                setPosts(res.stream || []);
            } catch (error) {
                console.error('Failed to fetch stream:', error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.id) {
            fetchStream();
        }
    }, [groupId, user, currentGroup]);

    // 3. Handle sending a new post to the database
    const handlePostSubmit = async () => {
        // Prevent empty posts
        if (!newPostContent.trim()) return;

        setIsPosting(true);
        try {
            const payload = {
                group_id: groupId,
                author_id: user.id,
                content: newPostContent,
                post_type: 'announcement', // Defaulting to announcement for the wall
            };

            const res = await Api.post('/posts/create', payload);

            // If successful, instantly add the new post to the top of our state array!
            if (res.post) {
                setPosts([res.post, ...posts]);
                setNewPostContent(''); // Clear the input field
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Could not create post. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    // Optional UX: Allow pressing 'Enter' to submit
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handlePostSubmit();
        }
    };

    // Security check
    if (!currentGroup && user.role !== 'admin') {
        return (
            <div className="main-content">
                <h2>Group not found or you are not enrolled.</h2>
            </div>
        );
    }

    return (
        <div id="group-dashboard-page" className="group-dashboard-layout">
            <div className="stream-container">
                {/* 1. Header Banner */}
                <div className="group-banner">
                    <button
                        className="back-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        <FaArrowLeft /> Back to Dashboard
                    </button>
                    <div className="banner-text">
                        <h1>{currentGroup?.subject_name}</h1>
                        <p>
                            {currentGroup?.subject_code} •{' '}
                            {currentGroup?.instructor}
                        </p>
                    </div>
                    {user.role === 'instructor' && (
                        <div className="subject-code-view">
                            <ViewGroupCodeButton group_id={groupId} />
                        </div>
                    )}
                </div>

                {/* 2. Create Post Input (The Wall) */}
                <div className="create-post-box">
                    <div className="avatar-small">
                        {user?.first_name
                            ? user.first_name.charAt(0).toUpperCase()
                            : '?'}
                    </div>
                    <input
                        type="text"
                        placeholder="Announce something to your class..."
                        className="post-input"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isPosting} // Prevent typing while saving to DB
                    />
                    <button
                        className="post-send-btn"
                        onClick={handlePostSubmit}
                        disabled={isPosting || !newPostContent.trim()} // Disable if empty or loading
                        style={{ opacity: !newPostContent.trim() ? 0.5 : 1 }}
                    >
                        <FaPaperPlane />
                    </button>
                </div>

                {/* 3. The Stream Feed */}
                <div className="stream-feed">
                    {loading ? (
                        <p
                            style={{
                                textAlign: 'center',
                                marginTop: '2rem',
                                color: 'var(--text-light)',
                            }}
                        >
                            Loading announcements...
                        </p>
                    ) : posts.length === 0 ? (
                        <p
                            style={{
                                textAlign: 'center',
                                marginTop: '2rem',
                                color: 'var(--text-light)',
                            }}
                        >
                            No announcements yet. Be the first to post!
                        </p>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="stream-post">
                                <div className="post-header">
                                    <div className="avatar-small">
                                        {post.author_name
                                            ? post.author_name
                                                  .charAt(0)
                                                  .toUpperCase()
                                            : '?'}{' '}
                                    </div>
                                    <div>
                                        <strong>
                                            {post.author_name}{' '}
                                            {post.author_id === user.id &&
                                                '(You)'}
                                        </strong>
                                        <span className="post-time">
                                            {post.timestamp}
                                        </span>
                                    </div>
                                </div>

                                <div className="post-body">
                                    <p>{post.content}</p>

                                    {post.attachment && (
                                        <div className="post-attachment">
                                            <FaFilePdf className="pdf-icon" />
                                            <span>{post.attachment}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
