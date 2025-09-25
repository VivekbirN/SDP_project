import React, { useState } from 'react';
import axios from 'axios';

const BillForm = ({ onBillAdded }) => {
  const [formData, setFormData] = useState({
    month: '',
    year: '',
    unitsConsumed: '',
    amount: '',
    utilityType: 'electricity'
  });
  const [loading, setLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const utilityTypes = [
    { value: 'electricity', label: 'Electricity (kWh)', icon: '⚡' },
    { value: 'water', label: 'Water (gallons)', icon: '💧' },
    { value: 'gas', label: 'Gas (therms)', icon: '🔥' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/bill', formData);
      setFormData({ month: '', year: '', unitsConsumed: '', amount: '', utilityType: 'electricity' });
      onBillAdded();
    } catch (error) {
      console.error('Error adding bill:', error);
      alert('Failed to add bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="utilityType" className="block text-sm font-medium text-white mb-1">
            Utility Type
          </label>
          <select
            id="utilityType"
            name="utilityType"
            value={formData.utilityType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#B3B3B3] bg-[#121212] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          >
            {utilityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="month" className="block text-sm font-medium text-white mb-1">
            Month
          </label>
          <select
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#B3B3B3] bg-[#121212] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          >
            <option value="">Select Month</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="year" className="block text-sm font-medium text-white mb-1">
          Year
        </label>
        <input
          type="number"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          min="2020"
          max="2030"
          required
          className="w-full px-3 py-2 border border-[#B3B3B3] bg-[#121212] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          placeholder="2024"
        />
      </div>

      <div>
        <label htmlFor="unitsConsumed" className="block text-sm font-medium text-white mb-1">
          Units Consumed (kWh)
        </label>
        <input
          type="number"
          id="unitsConsumed"
          name="unitsConsumed"
          value={formData.unitsConsumed}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          className="w-full px-3 py-2 border border-[#B3B3B3] bg-[#121212] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          placeholder="250.5"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-white mb-1">
          Amount (₹)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          className="w-full px-3 py-2 border border-[#B3B3B3] bg-[#121212] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          placeholder="125.00"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1DB954] text-white py-2 px-4 rounded-md hover:bg-[#1ED760] focus:outline-none focus:ring-2 focus:ring-[#1DB954] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
      >
        {loading ? 'Adding Bill...' : 'Add Bill'}
      </button>
    </form>
  );
};

export default BillForm;