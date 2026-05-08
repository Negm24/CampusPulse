import Header from './header';
import LeftSidebar from '../../sections/dashboard/components/LeftSideBar';
import { Outlet } from 'react-router-dom';
import Api from '../../utils/apiAxiosManager';
import { useState, useEffect } from 'react';
import Loading1 from './loading/loading';
import '../../sections/dashboard/styles/dashboard.css';

const ProtectedLayout = () => {
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await Api.get('auth/me');
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchGroups = async () => {
            if (!user || !user.id || user.role === 'admin') {
                setLoading(false);
                return;
            }

            try {
                const response = await Api.get(
                    `/groups/get_all_enrolled_groups/${user.id}`
                );
                setGroups(response.groups);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
                setGroups([]);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchGroups();
    }, [user]);

    if (loading) {
        return <Loading1 />;
    }

    return (
        <>
            <Header user={user} groups={groups} />

            {/* Wrap the sidebar and main in your dashboard-page div so Flexbox works! */}
            <div id="dashboard-page">
                <LeftSidebar role={user?.role} groups={groups} />

                {/* <main> acts as the wrapper for whatever page the Outlet renders */}
                <main style={{ flex: 1, width: '100%', overflowY: 'auto' }}>
                    <Outlet context={{ user, groups }} />
                </main>
            </div>
        </>
    );
};

export default ProtectedLayout;
