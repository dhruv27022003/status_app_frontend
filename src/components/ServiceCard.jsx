import React from 'react';
import StatusBadge from './StatusBadge';

const ServiceCard = ({ service, onEdit, onDelete, onStatusChange }) => {
  const handleStatusClick = () => {
    const statuses = ['operational', 'degraded', 'down'];
    const currentIndex = statuses.indexOf(service.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    onStatusChange(service._id, statuses[nextIndex]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
          {service.description && (
            <p className="text-gray-600 text-sm mb-3">{service.description}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <button onClick={handleStatusClick} className="focus:outline-none">
              <StatusBadge status={service.status} type="service" />
            </button>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(service)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(service._id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

