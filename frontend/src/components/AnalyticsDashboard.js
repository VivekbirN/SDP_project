import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsDashboard = ({ analytics, costSummary, bills }) => {
  const [selectedUtility, setSelectedUtility] = useState('all');
  const [threshold, setThreshold] = useState('');

  if (!analytics || !costSummary) {
    return (
      <div className="text-center text-gray-500 py-8">
        No analytics data available. Add some bills to see insights!
      </div>
    );
  }

  const utilityColors = {
    electricity: '#FFD700',
    water: '#00BFFF',
    gas: '#FF6347'
  };

  const utilityIcons = {
    electricity: '⚡',
    water: '💧',
    gas: '🔥'
  };

  // Prepare data for cost breakdown pie chart
  const costBreakdownData = Object.entries(costSummary)
    .filter(([_, data]) => data.totalAmount > 0)
    .map(([utility, data]) => ({
      name: utility.charAt(0).toUpperCase() + utility.slice(1),
      value: data.totalAmount,
      color: utilityColors[utility]
    }));

  // Prepare data for utility comparison bar chart
  const utilityComparisonData = Object.entries(costSummary)
    .filter(([_, data]) => data.totalAmount > 0)
    .map(([utility, data]) => ({
      utility: utility.charAt(0).toUpperCase() + utility.slice(1),
      totalAmount: data.totalAmount,
      averageAmount: data.averageAmount,
      totalUnits: data.totalUnits,
      averageUnits: data.averageUnits
    }));

  const filteredBills = selectedUtility === 'all' 
    ? bills 
    : bills.filter(bill => bill.utilityType === selectedUtility);

  const filteredAnalytics = selectedUtility === 'all'
    ? analytics
    : {
        ...analytics,
        averageConsumption: costSummary[selectedUtility]?.averageUnits || 0,
        averageAmount: costSummary[selectedUtility]?.averageAmount || 0,
        totalBills: costSummary[selectedUtility]?.count || 0,
        highConsumptionAlerts: analytics.highConsumptionAlerts?.filter(
          alert => alert.utilityType === selectedUtility
        ) || []
      };

  return (
    <div className="space-y-8">
      {/* Utility Filter */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter by utility:</label>
          <select
            value={selectedUtility}
            onChange={(e) => setSelectedUtility(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Utilities</option>
            <option value="electricity">⚡ Electricity</option>
            <option value="water">💧 Water</option>
            <option value="gas">🔥 Gas</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">High usage threshold:</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="Auto-calculated"
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
          />
          <span className="text-xs text-gray-500">units</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800">Average Consumption</h3>
          <p className="text-xl font-bold text-blue-600">
            {parseFloat(filteredAnalytics.averageConsumption).toFixed(1)}
            <span className="text-sm font-normal ml-1">units</span>
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-green-800">Average Amount</h3>
          <p className="text-xl font-bold text-green-600">
            ${parseFloat(filteredAnalytics.averageAmount).toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-800">Total Bills</h3>
          <p className="text-xl font-bold text-purple-600">
            {filteredAnalytics.totalBills}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-red-800">High Usage Alerts</h3>
          <p className="text-xl font-bold text-red-600">
            {filteredAnalytics.highConsumptionAlerts?.length || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      {costBreakdownData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown by Utility</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Utility Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilityComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="utility" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalAmount" fill="#8884d8" name="Total Amount ($)" />
                <Bar dataKey="averageAmount" fill="#82ca9d" name="Average Amount ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* High Consumption Alerts */}
      {filteredAnalytics.highConsumptionAlerts && filteredAnalytics.highConsumptionAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ High Consumption Alerts</h3>
          <div className="space-y-3">
            {filteredAnalytics.highConsumptionAlerts.map((alert, index) => (
              <div key={index} className="bg-white p-4 rounded border border-red-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-red-800">
                      {utilityIcons[alert.utilityType]} {alert.utilityType.charAt(0).toUpperCase() + alert.utilityType.slice(1)}
                    </p>
                    <p className="text-sm text-red-600">
                      {alert.month} {alert.year}: {alert.unitsConsumed} units (${alert.amount.toFixed(2)})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-700">
                      {alert.percentageAboveThreshold}% above threshold
                    </p>
                    <p className="text-xs text-red-500">
                      Threshold: {alert.threshold.toFixed(1)} units
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Bills */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bills ({selectedUtility === 'all' ? 'All' : selectedUtility.charAt(0).toUpperCase() + selectedUtility.slice(1)})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Utility</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost/Unit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.slice(0, 5).map((bill) => (
                <tr key={bill.id}>
                  <td className="px-4 py-2 text-sm">
                    <span className="flex items-center">
                      <span className="mr-2">
                        {bill.utilityType === 'electricity' && '⚡'}
                        {bill.utilityType === 'water' && '💧'}
                        {bill.utilityType === 'gas' && '🔥'}
                      </span>
                      {bill.utilityType.charAt(0).toUpperCase() + bill.utilityType.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">{bill.month} {bill.year}</td>
                  <td className="px-4 py-2 text-sm">{bill.unitsConsumed.toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm">${bill.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm">${(bill.amount / bill.unitsConsumed).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBills.length === 0 && (
            <p className="text-center text-gray-500 py-4">No bills found for the selected utility.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;