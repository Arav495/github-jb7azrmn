import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  HelpCircle, 
  ChevronRight,
  Palette,
  Smartphone,
  Mail,
  Globe,
  Lock
} from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    marketing: false
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const SettingCard = ({ icon: Icon, title, description, children, action }: any) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>
        {action && (
          <div className="ml-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );

  const ThemeOption = ({ theme, icon: Icon, label, description }: any) => (
    <button
      onClick={() => setTheme(theme)}
      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        (theme === 'dark' && isDarkMode) || (theme === 'light' && !isDarkMode)
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
      }`}
      aria-pressed={(theme === 'dark' && isDarkMode) || (theme === 'light' && !isDarkMode)}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <div className="text-left">
          <p className="font-medium">{label}</p>
          <p className="text-sm opacity-75">{description}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your account preferences and application settings</p>
      </div>

      {/* Profile Section */}
      <SettingCard
        icon={User}
        title="Profile Information"
        description="Manage your business profile and account details"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={user?.businessName || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Type
            </label>
            <input
              type="text"
              value={user?.businessType || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>
      </SettingCard>

      {/* Appearance Settings */}
      <SettingCard
        icon={Palette}
        title="Appearance"
        description="Customize how Birdy looks and feels"
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme Preference</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ThemeOption
                theme="light"
                icon={Sun}
                label="Light Mode"
                description="Clean and bright interface"
              />
              <ThemeOption
                theme="dark"
                icon={Moon}
                label="Dark Mode"
                description="Easy on the eyes"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Toggle</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={isDarkMode}
                aria-label="Toggle dark mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Notification Settings */}
      <SettingCard
        icon={Bell}
        title="Notifications"
        description="Control how you receive updates and alerts"
      >
        <div className="space-y-4">
          {[
            { key: 'email', icon: Mail, label: 'Email Notifications', description: 'Receive updates via email' },
            { key: 'sms', icon: Smartphone, label: 'SMS Notifications', description: 'Get alerts on your phone' },
            { key: 'push', icon: Bell, label: 'Push Notifications', description: 'Browser notifications' },
            { key: 'marketing', icon: Globe, label: 'Marketing Updates', description: 'Product news and offers' }
          ].map(({ key, icon: Icon, label, description }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  notifications[key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={notifications[key as keyof typeof notifications]}
                aria-label={`Toggle ${label.toLowerCase()}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </SettingCard>

      {/* Security Settings */}
      <SettingCard
        icon={Shield}
        title="Security & Privacy"
        description="Manage your account security and privacy settings"
      >
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="font-medium text-gray-900 dark:text-white">Change Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </SettingCard>

      {/* Help & Support */}
      <SettingCard
        icon={HelpCircle}
        title="Help & Support"
        description="Get help and contact our support team"
      >
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span className="font-medium text-gray-900 dark:text-white">Help Center</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span className="font-medium text-gray-900 dark:text-white">Contact Support</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span className="font-medium text-gray-900 dark:text-white">Privacy Policy</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </SettingCard>

      {/* Logout Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sign Out</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Sign out of your Birdy account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center space-x-2"
            aria-label="Sign out of your account"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;