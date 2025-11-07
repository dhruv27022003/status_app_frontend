import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getSocket } from '../services/socket';
import ServiceCard from '../components/ServiceCard';
import IncidentCard from '../components/IncidentCard';
import StatusBadge from '../components/StatusBadge';
import UptimeChart from '../components/UptimeChart';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingIncident, setEditingIncident] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', status: 'operational' });
  const [incidentForm, setIncidentForm] = useState({ title: '', message: '', serviceId: '', status: 'investigating' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
    setupSocket();
  }, [user]);

  const fetchData = async () => {
    try {
      const [servicesRes, incidentsRes] = await Promise.all([
        api.get('/api/services'),
        api.get('/api/incidents'),
      ]);
      setServices(servicesRes.data);
      setIncidents(incidentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    const socket = getSocket();
    if (socket) {
      socket.on('service:update', (data) => {
        setServices((prev) =>
          prev.map((s) => (s._id === data.serviceId ? { ...s, status: data.status } : s))
        );
      });

      socket.on('incident:update', (data) => {
        fetchData(); // Refresh incidents
      });
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/api/services/${editingService._id}`, serviceForm);
      } else {
        await api.post('/api/services', serviceForm);
      }
      setShowServiceModal(false);
      setEditingService(null);
      setServiceForm({ name: '', description: '', status: 'operational' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving service');
    }
  };

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    try {
      if (editingIncident) {
        await api.put(`/api/incidents/${editingIncident._id}`, incidentForm);
      } else {
        await api.post('/api/incidents', incidentForm);
      }
      setShowIncidentModal(false);
      setEditingIncident(null);
      setIncidentForm({ title: '', message: '', serviceId: '', status: 'investigating' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving incident');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/api/services/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting service');
    }
  };

  const handleDeleteIncident = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incident?')) return;
    try {
      await api.delete(`/api/incidents/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting incident');
    }
  };

  const handleStatusChange = async (serviceId, status) => {
    try {
      await api.patch(`/api/services/${serviceId}/status`, { status });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  const handleResolveIncident = async (id) => {
    try {
      await api.put(`/api/incidents/${id}`, { status: 'resolved' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error resolving incident');
    }
  };

  const openEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description || '',
      status: service.status,
    });
    setShowServiceModal(true);
  };

  const openEditIncident = (incident) => {
    setEditingIncident(incident);
    const serviceId = incident.serviceId?._id || incident.serviceId || '';
    setIncidentForm({
      title: incident.title,
      message: incident.message,
      serviceId: serviceId,
      status: incident.status,
    });
    setShowIncidentModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Services Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">My Services</h2>
            <button
              onClick={() => {
                setEditingService(null);
                setServiceForm({ name: '', description: '', status: 'operational' });
                setShowServiceModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Service
            </button>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No services yet. Add your first service!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  onEdit={openEditService}
                  onDelete={handleDeleteService}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Uptime Metrics Section */}
        {services.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Uptime Metrics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <UptimeChart
                  key={service._id}
                  serviceId={service._id}
                  serviceName={service.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Incidents Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Active Incidents</h2>
            <button
              onClick={() => {
                setEditingIncident(null);
                setIncidentForm({ title: '', message: '', serviceId: '', status: 'investigating' });
                setShowIncidentModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={services.length === 0}
            >
              + Create Incident
            </button>
          </div>

          {incidents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No incidents yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident._id}
                  incident={incident}
                  onEdit={openEditIncident}
                  onDelete={handleDeleteIncident}
                  onResolve={handleResolveIncident}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">
              {editingService ? 'Edit Service' : 'Add Service'}
            </h3>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={serviceForm.status}
                  onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}
                >
                  <option value="operational">Operational</option>
                  <option value="degraded">Degraded</option>
                  <option value="down">Down</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceModal(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">
              {editingIncident ? 'Edit Incident' : 'Create Incident'}
            </h3>
            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={incidentForm.serviceId}
                  onChange={(e) => setIncidentForm({ ...incidentForm, serviceId: e.target.value })}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={incidentForm.title}
                  onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  value={incidentForm.message}
                  onChange={(e) => setIncidentForm({ ...incidentForm, message: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={incidentForm.status}
                  onChange={(e) => setIncidentForm({ ...incidentForm, status: e.target.value })}
                >
                  <option value="investigating">Investigating</option>
                  <option value="identified">Identified</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowIncidentModal(false);
                    setEditingIncident(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingIncident ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

