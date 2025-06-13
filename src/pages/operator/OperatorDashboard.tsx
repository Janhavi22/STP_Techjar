// import { useEffect, useState } from 'react';
// import { 
//   BadgeAlert, 
//   DropletIcon, 
//   ArrowUpRight, 
//   Gauge, 
//   Clock,
//   Calendar 
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import { DataCard } from '../../components/ui/DataCard';
// import { FlowRateChart } from '../../components/charts/FlowRateChart';
// import { 
//   mockSites, 
//   mockFlowmeterReadings, 
//   mockWaterQualityReadings, 
//   mockAlerts,
//   generateHistoricalFlowData
// } from '../../data/mockData';

// const OperatorDashboard = () => {
//   const { user } = useAuth();
//   const [flowData, setFlowData] = useState<{ date: string; value: number }[]>([]);
  
//   // Get operator's assigned site
//   const userSiteId = user?.siteId || '';
//   const site = mockSites.find(site => site.id === userSiteId);
  
//   // Get latest flow reading
//   const latestFlowReading = mockFlowmeterReadings
//     .filter(reading => reading.siteId === userSiteId)
//     .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  
//   // Get latest water quality reading
//   const latestWaterQuality = mockWaterQualityReadings
//     .filter(reading => reading.siteId === userSiteId)
//     .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  
//   // Get active alerts
//   const activeAlerts = mockAlerts
//     .filter(alert => alert.siteId === userSiteId && !alert.acknowledged)
//     .length;
    
//   // Calculate site usage percentage
//   const siteUsagePercent = site && latestFlowReading 
//     ? Math.round((latestFlowReading.value / site.capacity) * 100) 
//     : 0;
  
//   // Get last uploaded date
//   const lastUploadDate = latestFlowReading 
//     ? new Date(latestFlowReading.timestamp).toLocaleDateString()
//     : 'Never';
  
//   // Load historical flow data
//   useEffect(() => {
//     if (userSiteId) {
//       const historicalData = generateHistoricalFlowData(userSiteId);
//       setFlowData(historicalData);
//     }
//   }, [userSiteId]);

//   if (!site) {
//     return (
//       <div className="flex h-full items-center justify-center p-6">
//         <div className="text-center">
//           <BadgeAlert size={48} className="mx-auto mb-4 text-accent-500" />
//           <h2 className="text-xl font-bold text-slate-800">Site Not Assigned</h2>
//           <p className="mt-2 text-slate-600">You don't have any STP site assigned. Please contact your administrator.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Header with site name */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-slate-900">{site.name} Dashboard</h1>
//         <p className="mt-1 text-sm text-slate-500">{site.location}</p>
//       </div>

//       {/* Status cards */}
//       <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         <DataCard
//           title="Current Flow Rate"
//           value={`${latestFlowReading?.value || 0} L/min`}
//           icon={<Gauge size={20} />}
//           status={latestFlowReading?.status === 'normal' ? 'success' : 'warning'}
//         />
        
//         <DataCard
//           title="Site Usage"
//           value={`${siteUsagePercent}%`}
//           icon={<Gauge size={20} />}
//           status={siteUsagePercent > 85 ? 'warning' : 'success'}
//           footer={`${latestFlowReading?.value || 0} of ${site.capacity} L/min capacity`}
//         />
        
//         <DataCard
//           title="Water Quality"
//           value={latestWaterQuality?.classification || 'Unknown'}
//           icon={<DropletIcon size={20} />}
//           status={latestWaterQuality?.classification === 'healthy' ? 'success' : 'error'}
//         />
        
//         <DataCard
//           title="Active Alerts"
//           value={activeAlerts}
//           icon={<BadgeAlert size={20} />}
//           status={activeAlerts > 0 ? 'warning' : 'success'}
//         />
//       </div>

//       {/* Flow rate chart */}
//       <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-slate-900">Flow Rate History</h2>
//           <div className="flex items-center text-sm text-slate-500">
//             <Calendar size={16} className="mr-2" />
//             <span>Last 7 days</span>
//           </div>
//         </div>
//         <FlowRateChart data={flowData} siteCapacity={site.capacity} />
//       </div>

//       {/* Quick actions and recent activity */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Quick actions */}
//         <div className="rounded-lg bg-white p-6 shadow-sm">
//           <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
//           <div className="grid gap-4 sm:grid-cols-2">
//             <button
//               onClick={() => window.location.href = '/operator/flowmeter'}
//               className="flex items-center justify-between rounded-md bg-primary-50 p-4 text-primary-700 transition-colors hover:bg-primary-100"
//             >
//               <div className="flex items-center">
//                 <Gauge size={20} className="mr-3" />
//                 <span>Upload Flowmeter</span>
//               </div>
//               <ArrowUpRight size={16} />
//             </button>
            
//             <button
//               onClick={() => window.location.href = '/operator/water-quality'}
//               className="flex items-center justify-between rounded-md bg-secondary-50 p-4 text-secondary-700 transition-colors hover:bg-secondary-100"
//             >
//               <div className="flex items-center">
//                 <DropletIcon size={20} className="mr-3" />
//                 <span>Upload Water Quality</span>
//               </div>
//               <ArrowUpRight size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Recent activity summary */}
//         <div className="rounded-lg bg-white p-6 shadow-sm">
//           <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</h2>
//           <div className="space-y-4">
//             <div className="flex items-start">
//               <div className="mr-3 rounded-full bg-primary-50 p-2 text-primary-500">
//                 <Clock size={16} />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-slate-900">Last flowmeter reading</p>
//                 <p className="text-xs text-slate-500">
//                   {latestFlowReading 
//                     ? `${latestFlowReading.value} L/min on ${new Date(latestFlowReading.timestamp).toLocaleString()}` 
//                     : 'No readings yet'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-start">
//               <div className="mr-3 rounded-full bg-secondary-50 p-2 text-secondary-500">
//                 <DropletIcon size={16} />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-slate-900">Last water quality check</p>
//                 <p className="text-xs text-slate-500">
//                   {latestWaterQuality 
//                     ? `Classification: ${latestWaterQuality.classification} (${Math.round(latestWaterQuality.confidence * 100)}% confidence) on ${new Date(latestWaterQuality.timestamp).toLocaleString()}`
//                     : 'No readings yet'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-start">
//               <div className="mr-3 rounded-full bg-slate-100 p-2 text-slate-500">
//                 <Calendar size={16} />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-slate-900">Site status</p>
//                 <p className="text-xs text-slate-500">
//                   {site.status.charAt(0).toUpperCase() + site.status.slice(1)} - 
//                   Last updated on {lastUploadDate}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OperatorDashboard;


import { useEffect, useState } from 'react';
import { 
  BadgeAlert, 
  DropletIcon, 
  ArrowUpRight, 
  Gauge, 
  Clock,
  Calendar 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DataCard } from '../../components/ui/DataCard';
import { FlowRateChart } from '../../components/charts/FlowRateChart';
import { 
  mockSites, 
  mockFlowmeterReadings, 
  mockWaterQualityReadings, 
  mockAlerts,
  generateHistoricalFlowData
} from '../../data/mockData';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const OperatorDashboard = () => {
  const { user } = useAuth();
  const [flowData, setFlowData] = useState<{ date: string; value: number }[]>([]);
  const navigate = useNavigate();  // Get navigate function
  
  const userSiteId = user?.siteId || '';
  const site = mockSites.find(site => site.id === userSiteId);

  const latestFlowReading = mockFlowmeterReadings
    .filter(reading => reading.siteId === userSiteId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  const latestWaterQuality = mockWaterQualityReadings
    .filter(reading => reading.siteId === userSiteId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  const activeAlerts = mockAlerts
    .filter(alert => alert.siteId === userSiteId && !alert.acknowledged)
    .length;

  const siteUsagePercent = site && latestFlowReading 
    ? Math.round((latestFlowReading.value / site.capacity) * 100) 
    : 0;

  const lastUploadDate = latestFlowReading 
    ? new Date(latestFlowReading.timestamp).toLocaleDateString()
    : 'Never';

  useEffect(() => {
    if (userSiteId) {
      const historicalData = generateHistoricalFlowData(userSiteId);
      setFlowData(historicalData);
    }
  }, [userSiteId]);

  if (!site) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <BadgeAlert size={48} className="mx-auto mb-4 text-accent-500" />
          <h2 className="text-xl font-bold text-slate-800">Site Not Assigned</h2>
          <p className="mt-2 text-slate-600">You don't have any STP site assigned. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{site.name} Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">{site.location}</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Current Flow Rate"
          value={`${latestFlowReading?.value || 0} L/min`}
          icon={<Gauge size={20} />}
          status={latestFlowReading?.status === 'normal' ? 'success' : 'warning'}
        />
        
        <DataCard
          title="Site Usage"
          value={`${siteUsagePercent}%`}
          icon={<Gauge size={20} />}
          status={siteUsagePercent > 85 ? 'warning' : 'success'}
          footer={`${latestFlowReading?.value || 0} of ${site.capacity} L/min capacity`}
        />
        
        <DataCard
          title="Water Quality"
          value={latestWaterQuality?.classification || 'Unknown'}
          icon={<DropletIcon size={20} />}
          status={latestWaterQuality?.classification === 'healthy' ? 'success' : 'error'}
        />
        
        <DataCard
          title="Active Alerts"
          value={activeAlerts}
          icon={<BadgeAlert size={20} />}
          status={activeAlerts > 0 ? 'warning' : 'success'}
        />
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Flow Rate History</h2>
          <div className="flex items-center text-sm text-slate-500">
            <Calendar size={16} className="mr-2" />
            <span>Last 7 days</span>
          </div>
        </div>
        <FlowRateChart data={flowData} siteCapacity={site.capacity} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => navigate('/operator/flowmeter')}  // use navigate here
              className="flex items-center justify-between rounded-md bg-primary-50 p-4 text-primary-700 transition-colors hover:bg-primary-100"
            >
              <div className="flex items-center">
                <Gauge size={20} className="mr-3" />
                <span>Upload Flowmeter</span>
              </div>
              <ArrowUpRight size={16} />
            </button>
            
            <button
              onClick={() => navigate('/operator/water-quality')}  // use navigate here
              className="flex items-center justify-between rounded-md bg-secondary-50 p-4 text-secondary-700 transition-colors hover:bg-secondary-100"
            >
              <div className="flex items-center">
                <DropletIcon size={20} className="mr-3" />
                <span>Upload Water Quality</span>
              </div>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-3 rounded-full bg-primary-50 p-2 text-primary-500">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Last flowmeter reading</p>
                <p className="text-xs text-slate-500">
                  {latestFlowReading 
                    ? `${latestFlowReading.value} L/min on ${new Date(latestFlowReading.timestamp).toLocaleString()}` 
                    : 'No readings yet'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-3 rounded-full bg-secondary-50 p-2 text-secondary-500">
                <DropletIcon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Last water quality check</p>
                <p className="text-xs text-slate-500">
                  {latestWaterQuality 
                    ? `Classification: ${latestWaterQuality.classification} (${Math.round(latestWaterQuality.confidence * 100)}% confidence) on ${new Date(latestWaterQuality.timestamp).toLocaleString()}`
                    : 'No readings yet'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-3 rounded-full bg-slate-100 p-2 text-slate-500">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Site status</p>
                <p className="text-xs text-slate-500">
                  {site.status.charAt(0).toUpperCase() + site.status.slice(1)} - 
                  Last updated on {lastUploadDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
