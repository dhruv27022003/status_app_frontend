import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const UptimeChart = ({ serviceId, serviceName }) => {
  const [data, setData] = useState([]);
  const [uptimePercentage, setUptimePercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    fetchUptimeData();
  }, [serviceId, period]);

  const fetchUptimeData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/services/${serviceId}/uptime?period=${period}`);
      setUptimePercentage(res.data.uptimePercentage);
      
      // Format data for chart
      const chartData = res.data.hourlyData.map((item, index) => ({
        time: new Date(item.time).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          ...(period === '24h' && { hour: 'numeric' })
        }),
        uptime: item.uptime,
        status: item.status,
      }));
      
      setData(chartData);
    } catch (error) {
      console.error('Error fetching uptime data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUptimeColor = () => {
    if (uptimePercentage >= 99.9) return 'text-green-600';
    if (uptimePercentage >= 99) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading uptime data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{serviceName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600">Uptime:</span>
            <span className={`text-lg font-bold ${getUptimeColor()}`}>
              {uptimePercentage.toFixed(2)}%
            </span>
          </div>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>
      
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Uptime %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Uptime']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="uptime" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              name="Uptime %"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No data available for this period
        </div>
      )}
    </div>
  );
};

export default UptimeChart;

