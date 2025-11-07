import React from 'react';

const StatusBadge = ({ status, type = 'service' }) => {
  const getStatusConfig = () => {
    if (type === 'service') {
      switch (status) {
        case 'operational':
          return {
            label: 'Operational',
            className: 'bg-green-100 text-green-800 border-green-300',
            icon: '✅',
          };
        case 'degraded':
          return {
            label: 'Degraded',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            icon: '⚠️',
          };
        case 'down':
          return {
            label: 'Down',
            className: 'bg-red-100 text-red-800 border-red-300',
            icon: '❌',
          };
        default:
          return {
            label: 'Unknown',
            className: 'bg-gray-100 text-gray-800 border-gray-300',
            icon: '❓',
          };
      }
    } else {
      // Incident status
      switch (status) {
        case 'investigating':
          return {
            label: 'Investigating',
            className: 'bg-blue-100 text-blue-800 border-blue-300',
            icon: '🔍',
          };
        case 'identified':
          return {
            label: 'Identified',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            icon: '✅',
          };
        case 'resolved':
          return {
            label: 'Resolved',
            className: 'bg-green-100 text-green-800 border-green-300',
            icon: '✔️',
          };
        default:
          return {
            label: 'Unknown',
            className: 'bg-gray-100 text-gray-800 border-gray-300',
            icon: '❓',
          };
      }
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;

