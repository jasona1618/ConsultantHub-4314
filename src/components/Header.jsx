import { RiNotification3Line, RiUserLine } from 'react-icons/ri';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-0 left-64">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, {user.name}
          <span className="ml-2 text-sm font-normal text-gray-500 capitalize">
            ({user.role})
          </span>
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <RiNotification3Line className="w-6 h-6 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <RiUserLine className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;