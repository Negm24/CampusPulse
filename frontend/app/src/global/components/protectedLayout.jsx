import Header from './header';
import { Outlet } from 'react-router-dom';
import Api from '../../utils/apiAxiosManager';
import { useState, useEffect } from 'react';
import Loading1 from './loading/loading';

const ProtectedLayout = () => {
    const [user, setUser] = useState(null);

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

    if (!user) {
        return <Loading1 />;
    }
    return (
        <>
            <Header user={user} />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default ProtectedLayout;
