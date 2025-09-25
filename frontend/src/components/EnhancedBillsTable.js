import React, { useState } from 'react';
import axios from 'axios';

const EnhancedBillsTable = ({ bills, onBillsUpdated }) => {
  const [editingBill, setEditingBill] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);

  const utilityIcons = {
    electricity: '⚡',
    water: '💧',
    gas: '🔥'
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const utilityTypes = [
    { value: 'electricity', label: 'Electricity', icon: '⚡' },
    { value: 'water', label: 'Water', icon: '💧' },
    { value: 'gas', label: 'Gas', icon: '🔥' }
  ];

  const handleEdit = (bill) => {
    setEditingBill(bill.id);
    setEditForm({
      month: bill.month,
      year: bill.year,
      unitsConsumed: bill.unitsConsumed,
      amount: bill.amount,
      utilityType: bill.utilityType
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async (billId) => {
    setLoading(true);
    try {
      await axios.put(`/bill/${billId}`, editForm);
      setEditingBill(null);
      onBillsUpdated();
    } catch (error) {
      console.error('Error updating bill:', error);
      alert('Failed to update bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingBill(null);
    setEditForm({});
  };

  const handleDelete = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      setLoading(true);
      try {
        await axios.delete(`/bill/${billId}`);
        onBillsUpdated();
      } catch (error) {
        console.error('Error deleting bill:', error);
        alert('Failed to delete bill. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getTotalConsumption = () => {
    return bills.reduce((sum, bill) => sum + bill.unitsConsumed, 0);
  };

  const getTotalAmount = () => {
    return bills.reduce((sum, bill) => sum + bill.amount, 0);
  };

  if (bills.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No bills added yet. Add your first bill above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Bills</h3>
          <p className="text-2xl font-bold text-blue-600">{bills.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Total Consumption</h3>
          <p className="text-2xl font-bold text-green-600">{getTotalConsumption().toLocaleString()} units</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Total Amount</h3>
          <p className="text-2xl font-bold text-purple-600">${getTotalAmount().toFixed(2)}</p>
        </div>
      </div>

      {/* Bills Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utility
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost/Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bills.map((bill) => (
              <tr key={bill.id} className="hover:bg-gray-50">
                {editingBill === bill.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        name="utilityType"
                        value={editForm.utilityType}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {utilityTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        name="month"
                        value={editForm.month}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {months.map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="year"
                        value={editForm.year}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        min="2020"
                        max="2030"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="unitsConsumed"
                        value={editForm.unitsConsumed}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="amount"
                        value={editForm.amount}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(editForm.amount / editForm.unitsConsumed).toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleSaveEdit(bill.id)}
                        disabled={loading}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="flex items-center">
                        <span className="mr-2">{utilityIcons[bill.utilityType]}</span>
                        {bill.utilityType.charAt(0).toUpperCase() + bill.utilityType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.unitsConsumed.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${bill.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(bill.amount / bill.unitsConsumed).toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnhancedBillsTable;