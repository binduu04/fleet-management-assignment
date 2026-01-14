import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { serviceAPI } from '../services/api';

const TechnicianDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [statusData, setStatusData] = useState({ status: '', notes: '' });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const { data } = await serviceAPI.getTechnicianServices();
      setServices(data.data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await serviceAPI.updateStatus(selectedService._id, statusData);
      setSelectedService(null);
      setStatusData({ status: '', notes: '' });
      loadServices();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusCounts = () => {
    return {
      pending: services.filter(s => s.status === 'pending').length,
      inProgress: services.filter(s => s.status === 'in-progress').length,
      completed: services.filter(s => s.status === 'completed').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Technician Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{counts.pending}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">In Progress</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{counts.inProgress}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{counts.completed}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">My Assigned Services</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : services.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No services assigned</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service) => (
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
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {service.description || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedService(service);
                            setStatusData({ status: service.status, notes: service.notes || '' });
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Update Service Status</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Vehicle</div>
              <div className="font-medium">{selectedService.vehicle?.vehicleNumber} - {selectedService.vehicle?.make} {selectedService.vehicle?.model}</div>
              <div className="text-sm text-gray-600 mt-2">Service Type</div>
              <div className="font-medium capitalize">{selectedService.serviceType?.replace('-', ' ')}</div>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusData.status}
                  onChange={(e) => setStatusData({...statusData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Notes</label>
                <textarea
                  value={statusData.notes}
                  onChange={(e) => setStatusData({...statusData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Add notes about the service..."
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Service
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;
