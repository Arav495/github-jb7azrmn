import React from 'react';
import { useBills } from '../hooks/useBills';
import { TrendingUp, Users, DollarSign, Calendar, FileText, Mail, CheckCircle, XCircle, MessageSquare, AtSign } from 'lucide-react';

const Analytics = () => {
  const { bills } = useBills();

  const analytics = {
    totalBills: bills.length,
    totalRevenue: bills.reduce((sum, bill) => sum + (bill.amount || 0), 0),
    successRate: bills.length > 0 ? (bills.filter(b => b.status === 'sent').length / bills.length) * 100 : 0,
    uniqueCustomers: new Set(bills.map(b => b.customerEmail)).size,
    avgBillAmount: bills.length > 0 ? bills.reduce((sum, bill) => sum + (bill.amount || 0), 0) / bills.length : 0,
    thisMonth: bills.filter(b => {
      const billDate = new Date(b.uploadDate);
      const now = new Date();
      return billDate.getMonth() === now.getMonth() && billDate.getFullYear() === now.getFullYear();
    }).length,
    emailDeliveries: bills.filter(b => b.deliveryMethod === 'email' || b.deliveryMethod === 'both').length,
    smsDeliveries: bills.filter(b => b.deliveryMethod === 'sms' || b.deliveryMethod === 'both').length
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Monitor your billing performance and customer insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          icon={FileText}
          title="Total Bills Sent"
          value={analytics.totalBills}
          subtitle="All time"
          color="bg-blue-600"
        />
        <MetricCard
          icon={DollarSign}
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toFixed(2)}`}
          subtitle="From tracked bills"
          color="bg-green-600"
        />
        <MetricCard
          icon={CheckCircle}
          title="Success Rate"
          value={`${analytics.successRate.toFixed(1)}%`}
          subtitle="Bills delivered successfully"
          color="bg-emerald-600"
        />
        <MetricCard
          icon={Users}
          title="Unique Customers"
          value={analytics.uniqueCustomers}
          subtitle="Active customers"
          color="bg-purple-600"
        />
        <MetricCard
          icon={TrendingUp}
          title="Avg Bill Amount"
          value={`₹${analytics.avgBillAmount.toFixed(2)}`}
          subtitle="Per transaction"
          color="bg-orange-600"
        />
        <MetricCard
          icon={Calendar}
          title="This Month"
          value={analytics.thisMonth}
          subtitle="Bills sent"
          color="bg-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Method Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Methods</h3>
          <div className="space-y-4">
            {[
              { method: 'Email', count: analytics.emailDeliveries, color: 'bg-blue-500', icon: AtSign },
              { method: 'SMS', count: analytics.smsDeliveries, color: 'bg-green-500', icon: MessageSquare },
              { method: 'Both', count: bills.filter(b => b.deliveryMethod === 'both').length, color: 'bg-purple-500', icon: Mail }
            ].map(({ method, count, color, icon: Icon }) => (
              <div key={method} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${color}`}></div>
                  <span className="font-medium text-gray-700">{method}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">{count}</span>
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Status Breakdown</h3>
          <div className="space-y-4">
            {[
              { status: 'sent', count: bills.filter(b => b.status === 'sent').length, color: 'bg-green-500', icon: CheckCircle },
              { status: 'pending', count: bills.filter(b => b.status === 'pending').length, color: 'bg-amber-500', icon: Calendar },
              { status: 'failed', count: bills.filter(b => b.status === 'failed').length, color: 'bg-red-500', icon: XCircle }
            ].map(({ status, count, color, icon: Icon }) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${color}`}></div>
                  <span className="capitalize font-medium text-gray-700">{status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">{count}</span>
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(new Set(bills.map(b => b.customerEmail)))
            .map(email => ({
              email,
              count: bills.filter(b => b.customerEmail === email).length,
              name: bills.find(b => b.customerEmail === email)?.customerName || 'N/A',
              phone: bills.find(b => b.customerEmail === email)?.customerPhone,
              totalAmount: bills.filter(b => b.customerEmail === email).reduce((sum, bill) => sum + (bill.amount || 0), 0)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6)
            .map((customer, index) => (
              <div key={customer.email} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {customer.email}
                    </p>
                    {customer.phone && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        +91 {customer.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{customer.count} bills</span>
                  <span className="font-medium text-gray-900">₹{customer.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{bills.filter(b => b.status === 'sent').length}</p>
            <p className="text-sm text-green-700">Successfully Delivered</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <Calendar className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-600">{bills.filter(b => b.status === 'pending').length}</p>
            <p className="text-sm text-amber-700">Pending Delivery</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{bills.filter(b => b.status === 'failed').length}</p>
            <p className="text-sm text-red-700">Failed Deliveries</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;