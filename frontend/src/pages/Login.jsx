import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'technician') {
        navigate('/technician');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@fleet.com');
      setPassword('admin123');
    } else if (role === 'technician') {
      setEmail('tech@fleet.com');
      setPassword('tech123');
    } else {
      setEmail('user@fleet.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Fleet Maintenance</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-gray-500 text-center mb-3">Quick Login (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('technician')}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors"
              >
                Technician
              </button>
              <button
                onClick={() => quickLogin('user')}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors"
              >
                User
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p className="font-medium">Demo Credentials:</p>
          <p className="text-xs mt-1">Admin: admin@fleet.com / admin123</p>
          <p className="text-xs">Tech: tech@fleet.com / tech123</p>
          <p className="text-xs">User: user@fleet.com / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
