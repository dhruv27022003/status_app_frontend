import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { connectSocket, getSocket } from '../services/socket';
import StatusBadge from '../components/StatusBadge';

const StatusPage = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatusData();
    setupSocket();
  }, [userId]);

  const fetchStatusData = async () => {
    try {
      const res = await api.get(`/api/public/${userId}`);
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load status page');
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    if (userId) {
      const socket = connectSocket(userId);
      
      socket.on('service:update', (updateData) => {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            services: prev.services.map((s) =>
              s._id === updateData.serviceId ? { ...s, status: updateData.status } : s
            ),
            overallStatus: calculateOverallStatus(
              prev.services.map((s) =>
                s._id === updateData.serviceId ? { ...s, status: updateData.status } : s
              )
            ),
          };
        });
      });

      socket.on('incident:update', () => {
        fetchStatusData(); // Refresh incidents
      });
    }
  };

  const calculateOverallStatus = (services) => {
    const hasDown = services.some((s) => s.status === 'down');
    const hasDegraded = services.some((s) => s.status === 'degraded');
    return hasDown ? 'down' : hasDegraded ? 'degraded' : 'operational';
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <div className="flex items-center justify-center gap-3">
            <StatusBadge status={data.overallStatus} type="service" />
            <span className="text-gray-600">
              {data.overallStatus === 'operational'
                ? 'All Systems Operational'
                : data.overallStatus === 'degraded'
                ? 'Some Systems Degraded'
                : 'Some Systems Down'}
            </span>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
          {data.services.length === 0 ? (
            <p className="text-gray-500">No services available.</p>
          ) : (
            <div className="space-y-4">
              {data.services.map((service) => (
                <div
                  key={service._id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    )}
                  </div>
                  <StatusBadge status={service.status} type="service" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incidents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Incidents</h2>
          {data.incidents.length === 0 ? (
            <p className="text-gray-500">No active incidents.</p>
          ) : (
            <div className="space-y-6">
              {data.incidents.map((incident) => (
                <div key={incident._id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                    <StatusBadge status={incident.status} type="incident" />
                  </div>
                  {incident.serviceId && (
                    <p className="text-sm text-gray-500 mb-2">
                      Service: <span className="font-medium">{incident.serviceId.name}</span>
                    </p>
                  )}
                  <p className="text-gray-700 mb-2">{incident.message}</p>
                  <p className="text-xs text-gray-500">{formatDate(incident.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Status page for {data.user.name}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;

