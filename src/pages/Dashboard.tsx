import React from 'react';
import { Link } from 'react-router-dom';
import { useBills } from '../hooks/useBills';
import { TrendingUp, Users, FileText, CheckCircle, Clock, AlertCircle, Send, Eye, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { bills } = useBills();

  const stats = {
    totalBills: bills.length,
    successfulSends: bills.filter(b => b.status === 'sent').length,
    pendingBills: bills.filter(b => b.status === 'pending').length,
    failedBills: bills.filter(b => b.status === 'failed').length,
  };

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${color}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          color === 'text-green-600' ? 'bg-green-50' :
          color === 'text-blue-600' ? 'bg-blue-50' :
          color === 'text-amber-600' ? 'bg-amber-50' : 'bg-red-50'
        }`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString('en-IN')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Bills"
          value={stats.totalBills}
          change={12}
          color="text-blue-600"
        />
        <StatCard
          icon={CheckCircle}
          title="Successfully Sent"
          value={stats.successfulSends}
          change={8}
          color="text-green-600"
        />
        <StatCard
          icon={Clock}
          title="Pending"
          value={stats.pendingBills}
          color="text-amber-600"
        />
        <StatCard
          icon={AlertCircle}
          title="Failed"
          value={stats.failedBills}
          color="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {bills.slice(0, 5).map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{bill.customerName}</p>
                  <p className="text-sm text-gray-600">{bill.customerEmail}</p>
                  {bill.customerPhone && (
                    <p className="text-sm text-gray-500">+91 {bill.customerPhone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ₹{bill.amount?.toFixed(2)}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    bill.status === 'sent' ? 'bg-green-100 text-green-800' :
                    bill.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {bill.status}
                  </span>
                  {bill.deliveryMethod && (
                    <p className="text-xs text-gray-500 mt-1">
                      via {bill.deliveryMethod === 'both' ? 'Email & SMS' : bill.deliveryMethod.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {bills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No bills created yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to="/upload"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Create and send a new bill"
            >
              <Send className="w-5 h-5" />
              <span>Birdy It! 🚀</span>
            </Link>
            <Link 
              to="/history"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="View all sent bills"
            >
              <Eye className="w-4 h-4" />
              <span>View All Bills</span>
            </Link>
            <Link 
              to="/analytics"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="View analytics and reports"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;