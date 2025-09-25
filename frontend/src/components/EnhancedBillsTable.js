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
      <div className="text-center text-[#B3B3B3] py-8">
        No bills added yet. Add your first bill above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#121212] border border-[#B3B3B3] p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Total Bills</h3>
          <p className="text-2xl font-bold text-[#1DB954]">{bills.length}</p>
        </div>
        <div className="bg-[#121212] border border-[#B3B3B3] p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Total Consumption</h3>
          <p className="text-2xl font-bold text-[#1ED760]">{getTotalConsumption().toLocaleString()} units</p>
        </div>
        <div className="bg-[#121212] border border-[#B3B3B3] p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Total Amount</h3>
          <p className="text-2xl font-bold text-[#1AA34A]">₹{getTotalAmount().toFixed(2)}</p>
        </div>
      </div>

      {/* Bills Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#B3B3B3]">
          <thead className="bg-[#191414]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
                Utility
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
                Month
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
                Units
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
                Cost/Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#121212] divide-y divide-[#B3B3B3]">
            {bills.map((bill) => (
              <tr key={bill.id} className="hover:bg-[#191414]">
                {editingBill === bill.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        name="utilityType"
                        value={editForm.utilityType}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-[#B3B3B3] bg-[#121212] text-white rounded text-sm focus:ring-[#1DB954] focus:border-[#1DB954]"
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
                        className="w-full px-2 py-1 border border-[#B3B3B3] bg-[#121212] text-white rounded text-sm focus:ring-[#1DB954] focus:border-[#1DB954]"
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
                        className="w-full px-2 py-1 border border-[#B3B3B3] bg-[#121212] text-white rounded text-sm focus:ring-[#1DB954] focus:border-[#1DB954]"
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
                        className="w-full px-2 py-1 border border-[#B3B3B3] bg-[#121212] text-white rounded text-sm focus:ring-[#1DB954] focus:border-[#1DB954]"
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
                        className="w-full px-2 py-1 border border-[#B3B3B3] bg-[#121212] text-white rounded text-sm focus:ring-[#1DB954] focus:border-[#1DB954]"
                        step="0.01"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B3B3B3]">
                      ₹{(editForm.amount / editForm.unitsConsumed).toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleSaveEdit(bill.id)}
                        disabled={loading}
                        className="text-[#1DB954] hover:text-[#1ED760] disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="text-[#B3B3B3] hover:text-white disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <span className="flex items-center">
                        <span className="mr-2">{utilityIcons[bill.utilityType]}</span>
                        {bill.utilityType.charAt(0).toUpperCase() + bill.utilityType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {bill.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B3B3B3]">
                      {bill.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B3B3B3]">
                      {bill.unitsConsumed.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      ₹{bill.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B3B3B3]">
                      ₹{(bill.amount / bill.unitsConsumed).toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="text-[#1DB954] hover:text-[#1ED760]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="text-red-500 hover:text-red-400"
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