import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

interface Operator {
  id: string;
  name: string;
  email: string;
  siteId: string;
  siteName: string;
  status: "active" | "inactive";
  lastActive?: string;
}

interface Site {
  site_id: string;
  site_name: string;
}

const OperatorManagement = () => {
  const { token } = useAuth();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOperators();
    fetchSites();
  }, []);

  const fetchOperators = async () => {
    try {
      const response = await fetch("http://localhost:8000/operators", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOperators(data);
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
      toast.error("Failed to fetch operators");
    }
  };

  const fetchSites = async () => {
    try {
      const response = await fetch("http://localhost:8000/sites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSites(data);
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to fetch sites");
    }
  };

  const handleAssignSite = async () => {
    if (!selectedOperator || !selectedSite) {
      toast.error("Please select both operator and site");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/assign-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          operator_username: selectedOperator,
          site_id: selectedSite,
          site_name: sites.find((s) => s.site_id === selectedSite)?.site_name,
        }),
      });

      if (response.ok) {
        toast.success("Site assigned successfully");
        fetchOperators(); // Refresh the list
        setSelectedOperator("");
        setSelectedSite("");
      } else {
        const error = await response.json();
        throw new Error(error.detail || "Failed to assign site");
      }
    } catch (error: any) {
      console.error("Error assigning site:", error);
      toast.error(error.message || "Failed to assign site");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Operator Management
      </h1>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Assign Site to Operator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operator
              </label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select Operator</option>
                {operators.map((op) => (
                  <option key={op.id} value={op.email}>
                    {op.name} ({op.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site
              </label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select Site</option>
                {sites.map((site) => (
                  <option key={site.site_id} value={site.site_id}>
                    {site.site_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAssignSite}
                disabled={isLoading || !selectedOperator || !selectedSite}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Assigning..." : "Assign Site"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">System Operators</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add New Operator
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Sites
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {operators.map((operator) => (
                  <tr key={operator.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {operator.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {operator.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {operator.siteName || "No site assigned"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          operator.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {operator.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorManagement;
