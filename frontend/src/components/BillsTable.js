import React from 'react';

const BillsTable = ({ bills }) => {
  if (bills.length === 0) {
    return (
      <div className="text-center text-[#B3B3B3] py-8">
        No bills added yet. Add your first bill above!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#B3B3B3]">
        <thead className="bg-[#191414]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
              Month
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
              Units (kWh)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
              Amount (₹)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
              Cost per Unit
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#121212] divide-y divide-[#B3B3B3]">
          {bills.map((bill) => (
            <tr key={bill.id} className="hover:bg-[#191414]">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {bill.month}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B3B3B3]">
                {bill.year}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B3B3B3]">
                {bill.unitsConsumed.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B3B3B3]">
                ₹{bill.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B3B3B3]">
                ₹{(bill.amount / bill.unitsConsumed).toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillsTable;