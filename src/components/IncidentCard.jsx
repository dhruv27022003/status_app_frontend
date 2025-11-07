import React from 'react';
import StatusBadge from './StatusBadge';

const IncidentCard = ({ incident, onEdit, onDelete, onResolve }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{incident.title}</h3>
            <StatusBadge status={incident.status} type="incident" />
          </div>
          {incident.serviceId && (
            <p className="text-sm text-gray-500 mb-2">
              Service: <span className="font-medium">{incident.serviceId.name}</span>
            </p>
          )}
          <p className="text-gray-700 mb-3">{incident.message}</p>
          <div className="text-xs text-gray-500">
            Created: {formatDate(incident.createdAt)}
            {incident.resolvedAt && (
              <span className="ml-4">Resolved: {formatDate(incident.resolvedAt)}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          {incident.status !== 'resolved' && (
            <button
              onClick={() => onResolve(incident._id)}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Resolve
            </button>
          )}
          <button
            onClick={() => onEdit(incident)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(incident._id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentCard;

