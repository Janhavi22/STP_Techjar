import React, { useState } from 'react';
import { DataCard } from '../../components/ui/DataCard';
import { FlowRateChart } from '../../components/charts/FlowRateChart';
import { 
  Building, 
  Users, 
  AlertTriangle, 
  ChevronDown,
  ArrowUpRight 
} from 'lucide-react';
import { 
  mockSites, 
  mockOperators, 
  mockFlowmeterReadings,
  mockWaterQualityReadings,
  generateHistoricalFlowData 
} from '../../data/mockData';

const AdminDashboard = () => {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);

  // Get site-specific data
  const site = selectedSite ? mockSites.find(s => s.id === selectedSite) : null;
  const siteOperators = mockOperators.filter(op => op.siteId === selectedSite);
  const siteFlowReadings = mockFlowmeterReadings.filter(r => r.siteId === selectedSite);
  const siteWaterQuality = mockWaterQualityReadings.filter(r => r.siteId === selectedSite);
  
  // Get flow data for chart
  const flowData = selectedSite ? generateHistoricalFlowData(selectedSite) : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        
        {/* Site selector */}
        <div className="relative">
          <button
            onClick={() => setShowSiteDropdown(!showSiteDropdown)}
            className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Building className="mr-2 h-5 w-5 text-slate-400" />
            {selectedSite ? mockSites.find(s => s.id === selectedSite)?.name : 'Select Site'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>

          {showSiteDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu">
                {mockSites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => {
                      setSelectedSite(site.id);
                      setShowSiteDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{site.name}</p>
                      <p className="text-xs text-slate-500">{site.location}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      site.status === 'active' 
                        ? 'bg-success-100 text-success-800'
                        : site.status === 'maintenance'
                        ? 'bg-warning-100 text-warning-800'
                        : 'bg-error-100 text-error-800'
                    }`}>
                      {site.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DataCard
          title="Total Sites"
          value={mockSites.length}
          icon={<Building size={20} />}
          status="neutral"
          footer={`${mockSites.filter(s => s.status === 'active').length} sites active`}
        />
        <DataCard
          title="Active Operators"
          value={mockOperators.filter(o => o.status === 'active').length}
          icon={<Users size={20} />}
          status="success"
          footer="All operators assigned"
        />
        <DataCard
          title="Active Alerts"
          value="5"
          icon={<AlertTriangle size={20} />}
          status="warning"
          footer="2 critical alerts"
        />
      </div>

      {selectedSite ? (
        <>
          {/* Site details */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{site?.name}</h2>
                <p className="text-sm text-slate-500">{site?.location}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => window.location.href = `/admin/sites`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
                >
                  Manage Site
                  <ArrowUpRight size={16} className="ml-1.5" />
                </button>
              </div>
            </div>

            {/* Site statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-600">Total Flow Today</p>
                <p className="text-2xl font-bold text-slate-900">
                  {flowData[flowData.length - 1]?.value.toFixed(1)} m³/day
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-600">Site Capacity</p>
                <p className="text-2xl font-bold text-slate-900">{site?.capacity} m³/hr</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-600">Last Update</p>
                <p className="text-2xl font-bold text-slate-900">
                  {new Date(site?.lastUpdate || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Flow rate chart */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Flow Rate History</h3>
              <FlowRateChart data={flowData} warningLevel={80} />
            </div>

            {/* Site operators */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Site Operators</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {siteOperators.map((operator) => (
                      <tr key={operator.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {operator.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {operator.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            operator.status === 'active'
                              ? 'bg-success-100 text-success-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {operator.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(operator.lastActive || '').toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Building size={48} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Select a Site</h3>
          <p className="mt-1 text-sm text-slate-500">
            Choose a site from the dropdown above to view detailed information
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;