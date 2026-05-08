import SidebarButton from './SideBarButton';

const LeftSidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-buttons-container">
                <SidebarButton label="Home" />
                <SidebarButton label="Calendar" />
            </div>

            <div className="sidebar-buttons-container">
                <SidebarButton
                    label="Enrolled"
                    dropdown
                    options={['CS101', 'Math101']}
                />
            </div>

            <div className="sidebar-buttons-container">
                <SidebarButton label="Archived Classes" />
                <SidebarButton label="Settings" />
            </div>
        </div>
    );
};

export default LeftSidebar;
