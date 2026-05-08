import SidebarButton from './SideBarButton';

const LeftSidebar = ({ groups }) => {
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
                    options={groups.map(
                        (group) =>
                            group.subject_name + ' (' + group.subject_code + ')'
                    )}
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
