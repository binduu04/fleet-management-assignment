import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    const colors = {
      admin: 'bg-purple-100 text-purple-700',
      technician: 'bg-green-100 text-green-700',
      user: 'bg-blue-100 text-blue-700'
    };
    return colors[user?.role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Fleet Maintenance</h1>
            <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge()}`}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              <span className="font-medium">{user?.name}</span>
              <span className="text-gray-500 ml-2">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
