import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UsageChart = ({ trends, bills }) => {
  const [selectedUtility, setSelectedUtility] = useState('all');
  
  const utilityTypes = [
    { value: 'all', label: 'All Utilities', color: '#6B7280' },
    { value: 'electricity', label: 'Electricity', color: '#F59E0B' },
    { value: 'water', label: 'Water', color: '#3B82F6' },
    { value: 'gas', label: 'Gas', color: '#10B981' }
  ];

  if (trends.length === 0 && bills.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No data available for chart. Add some bills to see trends!
      </div>
    );
  }

  // Process data based on selected utility
  const processChartData = () => {
    if (selectedUtility === 'all') {
      // Show all utilities in one chart
      return trends.map(trend => ({
        period: trend.period,
        electricity: trend.utilityTypes?.electricity?.unitsConsumed || 0,
        water: trend.utilityTypes?.water?.unitsConsumed || 0,
        gas: trend.utilityTypes?.gas?.unitsConsumed || 0,
        electricityAmount: trend.utilityTypes?.electricity?.amount || 0,
        waterAmount: trend.utilityTypes?.water?.amount || 0,
        gasAmount: trend.utilityTypes?.gas?.amount || 0
      }));
    } else {
      // Show only selected utility
      return trends.map(trend => ({
        period: trend.period,
        units: trend.utilityTypes?.[selectedUtility]?.unitsConsumed || 0,
        amount: trend.utilityTypes?.[selectedUtility]?.amount || 0
      }));
    }
  };

  const chartData = processChartData();

  return (
    <div className="space-y-4">
      {/* Utility Selection */}
      <div className="flex justify-center">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {utilityTypes.map((utility) => (
            <button
              key={utility.value}
              onClick={() => setSelectedUtility(utility.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedUtility === utility.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {utility.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            
            {selectedUtility === 'all' ? (
              // All utilities view
              <>
                <YAxis yAxisId="left" orientation="left" stroke="#6B7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                <Tooltip 
                  formatter={(value, name) => {
                    const unit = name.includes('Amount') ? '$' : 'kWh';
                    const label = name.includes('Amount') ? 'Amount' : 'Units';
                    return [`${unit}${value.toFixed(2)}`, `${label}`];
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="electricity" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  name="Electricity (Units)"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="water" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name="Water (Units)"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="gas" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Gas (Units)"
                />
              </>
            ) : (
              // Single utility view
              <>
                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'units' ? `${value} kWh` : `$${value.toFixed(2)}`,
                    name === 'units' ? 'Units Consumed' : 'Amount'
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="units" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name="Units Consumed"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Amount ($)"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsageChart;