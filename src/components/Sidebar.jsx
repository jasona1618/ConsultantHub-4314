import { Link, useLocation } from 'react-router-dom';
import { RiDashboardLine, RiProjectorLine, RiMessage2Line, RiFileList3Line, RiSettings4Line } from 'react-icons/ri';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();

  const links = [
    {
      to: '/',
      icon: RiDashboardLine,
      label: 'Dashboard',
      permission: 'view_dashboard'
    },
    {
      to: '/projects',
      icon: RiProjectorLine,
      label: 'Projects',
      permission: 'view_projects'
    },
    {
      to: '/messages',
      icon: RiMessage2Line,
      label: 'Messages',
      permission: 'view_messages'
    },
    {
      to: '/documents',
      icon: RiFileList3Line,
      label: 'Documents',
      permission: 'view_documents'
    },
    {
      to: '/settings',
      icon: RiSettings4Line,
      label: 'Settings',
      permission: 'view_settings'
    },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">ClientPortal</h1>
      </div>
      <nav className="mt-6">
        {links.map((link) => (
          hasPermission(link.permission) && (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 ${
                location.pathname === link.to ? 'bg-primary-50 text-primary-600' : ''
              }`}
            >
              <link.icon className="w-5 h-5 mr-3" />
              <span>{link.label}</span>
            </Link>
          )
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;