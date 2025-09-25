import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BillForm from './components/BillForm';
import EnhancedBillsTable from './components/EnhancedBillsTable';
import UsageChart from './components/UsageChart';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ChatBot from './components/ChatBot';
import AuthPage from './components/AuthPage';

function App() {
  const [bills, setBills] = useState([]);
  const [trends, setTrends] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [costSummary, setCostSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchBills = async () => {
    try {
      const response = await axios.get('/bills');
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const fetchTrends = async () => {
    try {
      const response = await axios.get('/trends');
      setTrends(response.data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchCostSummary = async () => {
    try {
      const response = await axios.get('/cost-summary');
      setCostSummary(response.data);
    } catch (error) {
      console.error('Error fetching cost summary:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchBills(), fetchTrends(), fetchAnalytics(), fetchCostSummary()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleBillAdded = async () => {
    await refreshData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#191414] to-[#121212] flex items-center justify-center">
        <AuthPage onLogin={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191414]">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Utility Bill Tracker
            </h1>
            <p className="text-[#B3B3B3]">
              Track your energy consumption and get personalized tips
            </p>
          </div>
          <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-[#1DB954] hover:bg-[#1ED760] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Add New Bill
            </h2>
            <BillForm onBillAdded={handleBillAdded} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Usage Trends
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <UsageChart trends={trends} bills={bills} />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Bill History
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <EnhancedBillsTable bills={bills} onBillsUpdated={handleBillAdded} />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Analytics Dashboard
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <AnalyticsDashboard 
              analytics={analytics} 
              costSummary={costSummary}
              bills={bills}
            />
          )}
        </div>
      </div>

      <ChatBot />
    </div>
  );
}

export default App;