import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import LeagueForm from "./LeagueForm";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const LeagueTable = () => {
  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    team: "",
    points: 0,
    gamesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  });
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")); // Admin check only
  const isAdmin = !!user;

  // ✅ Fetch league table
  useEffect(() => {
    const fetchTable = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/table`, {
          withCredentials: true,
        });
        const sorted = data.sort((a, b) => b.points - a.points);
        setTable(sorted);
      } catch (error) {
        console.error("Error fetching league table:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, []);

  // ✅ Add or update team
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await axios.put(`${API_URL}/api/table/${editingId}`, form, {
          withCredentials: true,
        });
        setTable((prev) =>
          prev.map((team) => (team._id === editingId ? res.data : team))
        );
      } else {
        res = await axios.post(`${API_URL}/api/table`, form, {
          withCredentials: true,
        });
        setTable((prev) => [res.data, ...prev]);
      }

      // Reset form
      setForm({
        team: "",
        points: 0,
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving team:", err);
    }
  };

  // ✅ Delete team
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/table/${id}`, {
        withCredentials: true,
      });
      setTable((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting team:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">
        Loading league table...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 font-josefin">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-4 text-center text-red-600"
      >
        📊 League Table
      </motion.h1>

      {/* Admin: toggle form */}
      {isAdmin && (
        <div className="flex flex-col items-center mb-6 gap-4">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
          >
            {showForm ? "Hide Form" : editingId ? "Edit Team" : "Add Team"}
          </button>

          {showForm && (
            <LeagueForm
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      )}

      {/* Toggle Button (small screens) */}
      <div className="flex justify-center mb-6 md:hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-2xl">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-red-600 text-white text-left">
              <th className="px-4 md:px-6 py-3">#</th>
              <th className="px-4 md:px-6 py-3">Team</th>

              <th className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>P</th>
              <th className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>W</th>
              <th className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>D</th>
              <th className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>L</th>
              <th className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>GF</th>
              <th className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>GA</th>
              <th className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>GD</th>

              <th className="px-4 md:px-6 py-3">Pts</th>
              {isAdmin && <th className="px-4 md:px-6 py-3">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {table.map((team, i) => (
              <motion.tr
                key={team._id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b hover:bg-red-50 transition"
              >
                <td className="px-4 md:px-6 py-3 font-bold text-red-600">{i + 1}</td>
                <td className="px-4 md:px-6 py-3 font-medium text-gray-700">{team.team}</td>
                <td className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>{team.gamesPlayed}</td>
                <td className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>{team.wins}</td>
                <td className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>{team.draws}</td>
                <td className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>{team.losses}</td>
                <td className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>{team.goalsFor}</td>
                <td className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>{team.goalsAgainst}</td>
                <td className={`px-4 md:px-6 py-3 ${showDetails ? "" : "hidden md:table-cell"}`}>{team.goalDifference}</td>
                <td className="px-4 md:px-6 py-3 font-semibold text-gray-900">{team.points}</td>

                {isAdmin && (
                  <td className="px-4 md:px-6 py-3 flex gap-2">
                    <button
                      onClick={() => {
                        setForm(team);
                        setEditingId(team._id);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(team._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeagueTable;
