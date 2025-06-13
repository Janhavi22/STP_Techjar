import { useState, useMemo } from 'react';
import { 
  Clock, 
  Filter, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Image as ImageIcon,
  Download, 
  BarChart,
  Droplet
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  mockFlowmeterReadings, 
  mockWaterQualityReadings 
} from '../../data/mockData';
import { FlowmeterReading, WaterQualityReading } from '../../types';

type ReadingType = 'flowmeter' | 'waterQuality';
type SortDirection = 'asc' | 'desc';
type SortField = 'timestamp' | 'value' | 'status' | 'classification' | 'confidence';

const HistoryPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ReadingType>('flowmeter');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedReading, setSelectedReading] = useState<FlowmeterReading | WaterQualityReading | null>(null);
  
  // Get operator's assigned site
  const userSiteId = user?.siteId || '';
  
  // Filter readings by site ID and date
  const filteredFlowmeterReadings = useMemo(() => {
    let filtered = mockFlowmeterReadings.filter(
      reading => reading.siteId === userSiteId
    );
    
    // Apply date filter
    if (dateRangeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateRangeFilter) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(
        reading => new Date(reading.timestamp) >= cutoffDate
      );
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'value') {
        return sortDirection === 'asc' ? a.value - b.value : b.value - a.value;
      } else if (sortBy === 'status') {
        const statusOrder = { normal: 0, warning: 1, critical: 2 };
        const statusA = statusOrder[a.status as keyof typeof statusOrder];
        const statusB = statusOrder[b.status as keyof typeof statusOrder];
        return sortDirection === 'asc' ? statusA - statusB : statusB - statusA;
      }
      return 0;
    });
  }, [userSiteId, dateRangeFilter, sortBy, sortDirection]);
  
  // Filter water quality readings
  const filteredWaterQualityReadings = useMemo(() => {
    let filtered = mockWaterQualityReadings.filter(
      reading => reading.siteId === userSiteId
    );
    
    // Apply date filter
    if (dateRangeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateRangeFilter) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(
        reading => new Date(reading.timestamp) >= cutoffDate
      );
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'classification') {
        const classA = a.classification === 'healthy' ? 0 : 1;
        const classB = b.classification === 'healthy' ? 0 : 1;
        return sortDirection === 'asc' ? classA - classB : classB - classA;
      } else if (sortBy === 'confidence') {
        return sortDirection === 'asc' 
          ? a.confidence - b.confidence 
          : b.confidence - a.confidence;
      }
      return 0;
    });
  }, [userSiteId, dateRangeFilter, sortBy, sortDirection]);
  
  // Handle sort click
  const handleSortClick = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp size={16} className="ml-1" /> 
      : <ChevronDown size={16} className="ml-1" />;
  };
  
  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render status badge
  const renderStatusBadge = (status: string) => {
    const getStatusClasses = () => {
      switch (status) {
        case 'normal':
          return 'bg-success-100 text-success-800';
        case 'warning':
          return 'bg-warning-100 text-warning-800';
        case 'critical':
          return 'bg-error-100 text-error-800';
        case 'healthy':
          return 'bg-success-100 text-success-800';
        case 'unhealthy':
          return 'bg-error-100 text-error-800';
        default:
          return 'bg-slate-100 text-slate-800';
      }
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusClasses()}`}>
        {status}
      </span>
    );
  };
  
  // Handle row click to view details
  const handleRowClick = (reading: FlowmeterReading | WaterQualityReading) => {
    setSelectedReading(reading);
  };
  
  // Close detail modal
  const closeDetailModal = () => {
    setSelectedReading(null);
  };
  
  // Render detail modal
  const renderDetailModal = () => {
    if (!selectedReading) return null;
    
    const isFlowmeter = 'value' in selectedReading;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
        <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {isFlowmeter ? 'Flowmeter Reading Details' : 'Water Quality Analysis Details'}
            </h2>
            <button
              onClick={closeDetailModal}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left side - Image */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              <img
                src={selectedReading.imageUrl}
                alt={isFlowmeter ? 'Flowmeter reading' : 'Water quality sample'}
                className="h-64 w-full rounded-md object-cover object-center"
              />
            </div>
            
            {/* Right side - Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Timestamp</h3>
                <p className="text-base font-semibold text-slate-900">
                  {formatDate(selectedReading.timestamp)}
                </p>
              </div>
              
              {isFlowmeter ? (
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Reading Value</h3>
                  <p className="text-2xl font-bold text-primary-600">
                    {(selectedReading as FlowmeterReading).value} L/min
                  </p>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-slate-500">Status</h3>
                    {renderStatusBadge((selectedReading as FlowmeterReading).status)}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Classification</h3>
                  <div className="flex items-center">
                    <p className="mr-2 text-xl font-bold text-slate-900 capitalize">
                      {(selectedReading as WaterQualityReading).classification}
                    </p>
                    {renderStatusBadge((selectedReading as WaterQualityReading).classification)}
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-slate-500">Confidence</h3>
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              (selectedReading as WaterQualityReading).classification === 'healthy'
                                ? 'bg-success-500'
                                : 'bg-error-500'
                            }`}
                            style={{
                              width: `${(selectedReading as WaterQualityReading).confidence * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-slate-700">
                        {Math.round((selectedReading as WaterQualityReading).confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-slate-500">Submitted by</h3>
                <p className="text-base text-slate-700">{selectedReading.operatorName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-500">Site</h3>
                <p className="text-base text-slate-700">{selectedReading.siteName}</p>
              </div>
              
              <button
                className="mt-2 inline-flex items-center rounded-md border border-transparent bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Download size={16} className="mr-2" />
                Download Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reading History</h1>
        <p className="mt-1 text-slate-500">
          View past flowmeter readings and water quality analyses
        </p>
      </div>
      
      {/* Filters and tabs */}
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        {/* Tabs */}
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`inline-flex items-center rounded-l-md px-4 py-2 text-sm font-medium ${
              activeTab === 'flowmeter'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('flowmeter')}
          >
            <BarChart size={16} className="mr-2" />
            Flowmeter
          </button>
          <button
            type="button"
            className={`inline-flex items-center rounded-r-md px-4 py-2 text-sm font-medium ${
              activeTab === 'waterQuality'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('waterQuality')}
          >
            <Droplet size={16} className="mr-2" />
            Water Quality
          </button>
        </div>
        
        {/* Date filter */}
        <div className="flex items-center">
          <Filter size={16} className="mr-2 text-slate-400" />
          <select
            className="rounded-md border-slate-300 py-1.5 pl-2 pr-8 text-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>
      
      {/* Data tables */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        {activeTab === 'flowmeter' ? (
          <>
            {filteredFlowmeterReadings.length === 0 ? (
              <div className="flex h-64 items-center justify-center p-6 text-center">
                <div>
                  <BarChart size={48} className="mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-900">No readings found</h3>
                  <p className="mt-1 text-slate-500">
                    No flowmeter readings match your selected filters
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        onClick={() => handleSortClick('timestamp')}
                      >
                        <div className="flex cursor-pointer items-center">
                          <Clock size={14} className="mr-2" />
                          Date
                          {renderSortIcon('timestamp')}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        onClick={() => handleSortClick('value')}
                      >
                        <div className="flex cursor-pointer items-center">
                          <BarChart size={14} className="mr-2" />
                          Reading (L/min)
                          {renderSortIcon('value')}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        onClick={() => handleSortClick('status')}
                      >
                        <div className="flex cursor-pointer items-center">
                          Status
                          {renderSortIcon('status')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        <div className="flex items-center">
                          <ImageIcon size={14} className="mr-2" />
                          Image
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredFlowmeterReadings.map((reading) => (
                      <tr 
                        key={reading.id} 
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => handleRowClick(reading)}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-slate-900">{formatDate(reading.timestamp)}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-slate-900">{reading.value}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {renderStatusBadge(reading.status)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="h-10 w-10 overflow-hidden rounded-md">
                            <img
                              src={reading.imageUrl}
                              alt="Flowmeter reading"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            {filteredWaterQualityReadings.length === 0 ? (
              <div className="flex h-64 items-center justify-center p-6 text-center">
                <div>
                  <Droplet size={48} className="mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-900">No readings found</h3>
                  <p className="mt-1 text-slate-500">
                    No water quality analyses match your selected filters
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        onClick={() => handleSortClick('timestamp')}
                      >
                        <div className="flex cursor-pointer items-center">
                          <Clock size={14} className="mr-2" />
                          Date
                          {renderSortIcon('timestamp')}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        onClick={() => handleSortClick('classification')}
                      >
                        <div className="flex cursor-pointer items-center">
                          <Droplet size={14} className="mr-2" />
                          Classification
                          {renderSortIcon('classification')}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                        onClick={() => handleSortClick('confidence')}
                      >
                        <div className="flex cursor-pointer items-center">
                          Confidence
                          {renderSortIcon('confidence')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        <div className="flex items-center">
                          <ImageIcon size={14} className="mr-2" />
                          Image
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredWaterQualityReadings.map((reading) => (
                      <tr 
                        key={reading.id} 
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => handleRowClick(reading)}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-slate-900">{formatDate(reading.timestamp)}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {renderStatusBadge(reading.classification)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-24">
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                <div
                                  className={`h-full rounded-full ${
                                    reading.classification === 'healthy'
                                      ? 'bg-success-500'
                                      : 'bg-error-500'
                                  }`}
                                  style={{ width: `${reading.confidence * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-slate-700">
                              {Math.round(reading.confidence * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="h-10 w-10 overflow-hidden rounded-md">
                            <img
                              src={reading.imageUrl}
                              alt="Water quality sample"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Data summary */}
      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar size={16} className="mr-2" />
            <span>
              Showing {activeTab === 'flowmeter' 
                ? filteredFlowmeterReadings.length 
                : filteredWaterQualityReadings.length
              } records
            </span>
          </div>
          <button
            className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download size={16} className="mr-2" />
            Export Data
          </button>
        </div>
      </div>
      
      {/* Detail modal */}
      {renderDetailModal()}
    </div>
  );
};

export default HistoryPage;