import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { vehicleAPI, serviceAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('vehicles');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, servicesRes] = await Promise.all([
        vehicleAPI.getMy(),
        serviceAPI.getUserServices()
      ]);
      setVehicles(vehiclesRes.data.data);
      setServices(servicesRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const getUpcomingServices = () => services.filter(s => s.status === 'pending' || s.status === 'in-progress');
  const getCompletedServices = () => services.filter(s => s.status === 'completed');

  const getServiceTimeline = () => {
    const completed = getCompletedServices();
    const monthlyData = {};
    
    completed.forEach(service => {
      const month = new Date(service.completedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    return Object.entries(monthlyData).map(([month, count]) => ({ month, services: count }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">My Vehicles</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{vehicles.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Upcoming Services</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">{getUpcomingServices().length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Completed Services</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{getCompletedServices().length}</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b">
          {['vehicles', 'upcoming', 'history', 'timeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'upcoming' ? 'Upcoming Services' : tab === 'timeline' ? 'Service Timeline' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'vehicles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No vehicles assigned
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{vehicle.vehicleNumber}</div>
                      <div className="text-sm text-gray-600">{vehicle.make} {vehicle.model}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      vehicle.status === 'active' ? 'bg-green-100 text-green-700' :
                      vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year</span>
                      <span className="font-medium">{vehicle.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium capitalize">{vehicle.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mileage</span>
                      <span className="font-medium">{vehicle.mileage?.toLocaleString()} mi</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="bg-white rounded-lg shadow">
            {getUpcomingServices().length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No upcoming services scheduled
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getUpcomingServices().map((service) => (
                      <tr key={service._id}>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{service.vehicle?.vehicleNumber}</div>
                          <div className="text-xs text-gray-500">{service.vehicle?.make} {service.vehicle?.model}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                          {service.serviceType?.replace('-', ' ')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(service.scheduledDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {service.assignedTechnician?.name || 'Not assigned'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            service.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {service.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow">
            {getCompletedServices().length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No service history available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getCompletedServices().map((service) => (
                      <tr key={service._id}>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{service.vehicle?.vehicleNumber}</div>
                          <div className="text-xs text-gray-500">{service.vehicle?.make} {service.vehicle?.model}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                          {service.serviceType?.replace('-', ' ')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {service.completedDate ? new Date(service.completedDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {service.assignedTechnician?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ${service.cost}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                          {service.notes || 'No notes'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Service History Timeline</h3>
            {getServiceTimeline().length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No service history available for timeline
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getServiceTimeline()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="services" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
