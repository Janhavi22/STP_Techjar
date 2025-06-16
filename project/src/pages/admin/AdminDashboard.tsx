import React from "react";
import { DataCard } from "../../components/ui/DataCard";
import { FlowRateChart } from "../../components/charts/FlowRateChart";

const AdminDashboard = () => {
  // Mock data for the flow rate chart
  const mockFlowData = [
    { date: "2025-01-01", value: 250 },
    { date: "2025-01-02", value: 300 },
    { date: "2025-01-03", value: 275 },
    { date: "2025-01-04", value: 325 },
    { date: "2025-01-05", value: 290 },
    { date: "2025-01-06", value: 310 },
    { date: "2025-01-07", value: 280 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DataCard title="Total Sites" value="24" change={2} />
        <DataCard title="Active Operators" value="18" change={3} />
        <DataCard title="Pending Alerts" value="5" change={-2} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <FlowRateChart data={mockFlowData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
