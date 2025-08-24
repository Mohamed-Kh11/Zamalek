import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const MiniTable = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await axios.get(`${API_BASE}/api/table`);
        setTeams(res.data);
      } catch (error) {
        console.error("Error fetching league table:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading league table...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-2xl font-josefin">
      <div className="shadow rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th
                colSpan="3"
                className="bg-red-600 text-white text-center py-2 text-md font-extrabold"
              >
                📊 League Table
              </th>
            </tr>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="px-6 py-2 text-sm">#</th>
              <th className="px-6 py-2 text-sm">Team</th>
              <th className="px-6 py-2 text-sm">Pts</th>
            </tr>
          </thead>
        </table>

        <div className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-100">
          <table className="w-full border-collapse">
            <tbody>
              {teams.map((team, index) => (
                <motion.tr
                  key={team._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b hover:bg-red-50 transition ${
                    team.team === "Zamalek" ? "bg-red-100 font-bold" : ""
                  }`}
                >
                  <td className="px-6 py-2 font-semibold text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-2 text-gray-900">{team.team}</td>
                  <td className="px-6 py-2 font-bold text-gray-900">
                    {team.points}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MiniTable;
