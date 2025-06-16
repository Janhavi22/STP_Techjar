import React, { useEffect, useState } from "react";
import axios from "axios";

interface HistoryDataItem {
  ID: string | number;
  DATE: string;
  TIME: string;
  TOT: string | number;
  SITE: string;
  "Today's TOT"?: string | number;
}

const HistoryData = () => {
  const [selectedSite, setSelectedSite] = useState("Phonyx");
  const [data, setData] = useState<HistoryDataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/history-data?site=${selectedSite}`);
        setData(Array.isArray(response.data) ? response.data : []);
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };
    fetchData();
  }, [selectedSite]);

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSite(e.target.value);
  };

  return (
    <div className="p-4">
      <div className="mt-4">
        <select
          id="site-select"
          value={selectedSite}
          onChange={handleSiteChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
        >
          <option value="Phonyx">Phonyx</option>
          <option value="Infosysy">Infosysy</option>
          <option value="Taj">Taj</option>
        </select>
      </div>
      <table className="min-w-full mt-4 border border-slate-200 rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-primary-100 text-primary-800">
            <th className="px-6 py-3 text-left font-semibold">ID</th>
            <th className="px-6 py-3 text-left font-semibold">Date</th>
            <th className="px-6 py-3 text-left font-semibold">Time</th>
            <th className="px-6 py-3 text-left font-semibold">Total Reading</th>
            <th className="px-6 py-3 text-left font-semibold">Site</th>
            <th className="px-6 py-3 text-left font-semibold">Today's Total</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="px-6 py-2 whitespace-nowrap">{item.ID}</td>
                <td className="px-6 py-2 whitespace-nowrap">{item.DATE}</td>
                <td className="px-6 py-2 whitespace-nowrap">{item.TIME}</td>
                <td className="px-6 py-2 whitespace-nowrap">{item.TOT}</td>
                <td className="px-6 py-2 whitespace-nowrap">{item.SITE}</td>
                <td className="px-6 py-2 whitespace-nowrap">{item["Today's TOT"] ?? "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryData;