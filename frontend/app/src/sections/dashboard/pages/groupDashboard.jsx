import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf, FaPaperPlane } from 'react-icons/fa';
import '../styles/groupDashBoardPage.css';

export default function GroupDashboard() {
    const { groupId } = useParams();
    const { user, groups } = useOutletContext();
    const navigate = useNavigate();

    // Find the specific group data from the context array
    const currentGroup = groups?.find((g) => g.id.toString() === groupId);

    // Dummy Data: This is exactly what our future 'posts' database table will look like
    const mockStreamPosts = [
        {
            id: 1,
            author_name: currentGroup?.instructor || 'Instructor',
            content:
                'Welcome to the class! Please read the syllabus attached below before our first lecture.',
            timestamp: 'Oct 24, 8:00 AM',
            type: 'material',
            attachment: 'CC112_Syllabus.pdf',
        },
        {
            id: 2,
            author_name: 'Youssef Negm',
            content:
                'Doctor, will the first quiz cover chapters 1 and 2, or just chapter 1?',
            timestamp: 'Oct 25, 2:30 PM',
            type: 'question',
            attachment: null,
        },
    ];

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
                    />
                    <button className="post-send-btn">
                        <FaPaperPlane />
                    </button>
                </div>

                {/* 3. The Stream Feed */}
                <div className="stream-feed">
                    {mockStreamPosts.map((post) => (
                        <div key={post.id} className="stream-post">
                            <div className="post-header">
                                <div className="avatar-small">
                                    {post.author_name.charAt(0)}
                                </div>
                                <div>
                                    <strong>{post.author_name}</strong>
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
                    ))}
                </div>
            </div>
        </div>
    );
}
