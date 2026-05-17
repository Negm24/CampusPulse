import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaFilePdf,
    FaPaperPlane,
    FaPaperclip,
    FaTimes,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import '../styles/groupDashBoardPage.css';
import Api from '../../../utils/apiAxiosManager';
import ViewGroupCodeButton from '../components/ViewGroupCode';
import AttachmentModal from '../components/AttachementModal';

export default function GroupDashboard() {
    const { groupId } = useParams();
    const { user, groups } = useOutletContext();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [file, setFile] = useState(null);

    // NEW: State to hold the URL of the file currently being viewed in the modal
    const [viewingFileUrl, setViewingFileUrl] = useState(null);

    const currentGroup = groups?.find((g) => g.id.toString() === groupId);

    useEffect(() => {
        const fetchStream = async () => {
            if (!currentGroup) return;
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

    const handlePostSubmit = async () => {
        if (!newPostContent.trim() && !file) return;

        setIsPosting(true);
        try {
            const formData = new FormData();
            formData.append('group_id', groupId);
            formData.append('author_id', user.id);
            formData.append('content', newPostContent);

            if (file) {
                formData.append('file', file);
            }

            const res = await Api.post('/posts/create', formData);

            if (res.post) {
                setPosts([res.post, ...posts]);
                setNewPostContent('');
                setFile(null);
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Could not create post. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handlePostSubmit();
        }
    };

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

                <div className="create-post-wrapper">
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
                            disabled={isPosting}
                        />
                        <input
                            type="file"
                            id="file-attachment"
                            style={{ display: 'none' }}
                            onChange={(e) => setFile(e.target.files[0])}
                            disabled={isPosting}
                        />
                        <label
                            htmlFor="file-attachment"
                            className="attachment-btn"
                            title="Attach a file"
                        >
                            <FaPaperclip />
                        </label>
                        <button
                            className="post-send-btn"
                            onClick={handlePostSubmit}
                            disabled={
                                isPosting || (!newPostContent.trim() && !file)
                            }
                            style={{
                                opacity:
                                    !newPostContent.trim() && !file ? 0.5 : 1,
                            }}
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                    {file && (
                        <div className="selected-file-preview">
                            <span className="file-name">{file.name}</span>
                            <button
                                className="remove-file-btn"
                                onClick={() => setFile(null)}
                                title="Remove attachment"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}
                </div>

                {/* Stream Feed */}
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
                                            : '?'}
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

                                    {/* UPDATED: Attachment is now a button that opens the modal */}
                                    {post.attachment && (
                                        <div
                                            className="post-attachment"
                                            onClick={() =>
                                                setViewingFileUrl(
                                                    `http://localhost:5000/static/uploads/${post.attachment}`
                                                )
                                            }
                                            style={{ cursor: 'pointer' }}
                                            title="Click to view file"
                                        >
                                            <FaFilePdf className="pdf-icon" />
                                            <span>
                                                {post.attachment.includes('_')
                                                    ? post.attachment
                                                          .split('_')
                                                          .slice(1)
                                                          .join('_')
                                                    : post.attachment}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <AttachmentModal
                fileUrl={viewingFileUrl}
                onClose={() => setViewingFileUrl(null)}
            />
        </div>
    );
}
