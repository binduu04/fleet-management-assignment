import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { userAPI, vehicleAPI, serviceAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') await loadUsers();
      if (activeTab === 'vehicles') await loadVehicles();
      if (activeTab === 'services') await loadServices();
      if (activeTab === 'overview') await loadStats();
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    const { data } = await userAPI.getAll();
    setUsers(data.data);
  };

  const loadVehicles = async () => {
    const { data } = await vehicleAPI.getAll();
    setVehicles(data.data);
  };

  const loadServices = async () => {
    const { data } = await serviceAPI.getAll();
    setServices(data.data);
  };

  const loadStats = async () => {
    const { data } = await serviceAPI.getStats();
    setStats(data.data);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    await userAPI.create(formData);
    setShowModal(null);
    loadUsers();
  };

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    await vehicleAPI.create(formData);
    setShowModal(null);
    loadVehicles();
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    await serviceAPI.create(formData);
    setShowModal(null);
    loadServices();
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure?')) return;
    if (type === 'user') await userAPI.delete(id);
    if (type === 'vehicle') await vehicleAPI.delete(id);
    if (type === 'service') await serviceAPI.delete(id);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>

        <div className="flex gap-2 mb-6 border-b">
          {['overview', 'users', 'vehicles', 'services'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Total Users</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{users.length || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Total Vehicles</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{vehicles.length || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Total Services</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{services.length || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Pending Services</div>
                <div className="text-3xl font-bold text-orange-600 mt-2">
                  {stats.statusStats?.find(s => s._id === 'pending')?.count || 0}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Service Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.statusStats?.map(item => ({ name: item._id, value: item.count })) || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.statusStats?.map((entry, index) => {
                        const colors = { pending: '#f59e0b', 'in-progress': '#3b82f6', completed: '#10b981', cancelled: '#6b7280' };
                        return <Cell key={`cell-${index}`} fill={colors[entry._id] || '#8884d8'} />;
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Service Type Frequency</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.serviceTypeStats?.map(item => ({ name: item._id?.replace('-', ' '), count: item.count })) || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">User Management</h3>
              <button
                onClick={() => { setShowModal('user'); setFormData({}); }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'technician' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete('user', user._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Vehicle Management</h3>
              <button
                onClick={() => { setShowModal('vehicle'); setFormData({}); }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Add Vehicle
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Make/Model</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle._id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vehicle.make} {vehicle.model}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vehicle.year}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{vehicle.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vehicle.assignedTo?.name || 'Unassigned'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          vehicle.status === 'active' ? 'bg-green-100 text-green-700' :
                          vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete('vehicle', vehicle._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Service Management</h3>
              <button
                onClick={() => { setShowModal('service'); setFormData({}); }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Schedule Service
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{service.vehicle?.vehicleNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{service.serviceType?.replace('-', ' ')}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(service.scheduledDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{service.assignedTechnician?.name || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          service.status === 'completed' ? 'bg-green-100 text-green-700' :
                          service.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          service.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">${service.cost}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete('service', service._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal === 'user' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input type="text" placeholder="Name" required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email" required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="password" placeholder="Password" required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <select required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </select>
              <input type="tel" placeholder="Phone" className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'vehicle' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
            <form onSubmit={handleCreateVehicle} className="space-y-3">
              <input type="text" placeholder="Vehicle Number" required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})} />
              <input type="text" placeholder="Make" required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, make: e.target.value})} />
              <input type="text" placeholder="Model" required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, model: e.target.value})} />
              <input type="number" placeholder="Year" required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, year: e.target.value})} />
              <select required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="">Select Type</option>
                <option value="car">Car</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="bus">Bus</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'service' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Schedule Service</h3>
            <form onSubmit={handleCreateService} className="space-y-3">
              <select required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, vehicle: e.target.value})}>
                <option value="">Select Vehicle</option>
                {vehicles.map(v => <option key={v._id} value={v._id}>{v.vehicleNumber} - {v.make} {v.model}</option>)}
              </select>
              <select required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, serviceType: e.target.value})}>
                <option value="">Service Type</option>
                <option value="oil-change">Oil Change</option>
                <option value="brake-service">Brake Service</option>
                <option value="tire-rotation">Tire Rotation</option>
                <option value="inspection">Inspection</option>
              </select>
              <input type="date" required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} />
              <select required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, assignedTechnician: e.target.value})}>
                <option value="">Select Technician</option>
                {users.filter(u => u.role === 'technician').map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
              <input type="number" placeholder="Cost" className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, cost: e.target.value})} />
              <textarea placeholder="Description" className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Schedule</button>
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
