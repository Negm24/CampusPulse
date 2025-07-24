import Header from './header';
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default ProtectedLayout;
