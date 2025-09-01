// src/pages/Matches.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import zamalekLogo from "../../src/images/zamalek.png";
import { MapPin, Trophy } from "lucide-react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// --- MatchForm Component ---
const MatchForm = ({ form, setForm, handleSubmit, editingId }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg flex flex-col gap-4"
    >
      <h2 className="text-lg font-bold text-red-600">
        {editingId ? "Edit Match" : "Add Match"}
      </h2>

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="border p-2 rounded"
        required
      />
      <input
        type="time"
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        value={form.stadium}
        onChange={(e) => setForm({ ...form, stadium: e.target.value })}
        placeholder="Stadium"
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        value={form.competition}
        onChange={(e) => setForm({ ...form, competition: e.target.value })}
        placeholder="Competition"
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        value={form.opponentName}
        onChange={(e) => setForm({ ...form, opponentName: e.target.value })}
        placeholder="Opponent Name"
        className="border p-2 rounded"
        required
      />
      <select
        value={form.homeOrAway}
        onChange={(e) => setForm({ ...form, homeOrAway: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="home">Home</option>
        <option value="away">Away</option>
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setForm({ ...form, logo: e.target.files[0] })}
        className="border p-2 rounded"
      />

      {/* Zamalek & Opponent Score Inputs */}
      <div className="flex gap-4">
        <input
          type="number"
          value={form.zamalekScore}
          onChange={(e) => setForm({ ...form, zamalekScore: e.target.value })}
          placeholder="Zamalek Score"
          className="border p-2 rounded w-1/2"
          min="0"
        />
        <input
          type="number"
          value={form.opponentScore}
          onChange={(e) => setForm({ ...form, opponentScore: e.target.value })}
          placeholder="Opponent Score"
          className="border p-2 rounded w-1/2"
          min="0"
        />
      </div>

      <select
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="upcoming">Upcoming</option>
        <option value="finished">Finished</option>
        <option value="live">Live</option>
      </select>
      <button
        type="submit"
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
      >
        {editingId ? "Update Match" : "Add Match"}
      </button>
    </form>
  );
};

// --- Main Matches Component ---
const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    date: "",
    time: "",
    stadium: "",
    competition: "",
    homeOrAway: "home",
    opponentName: "",
    logo: null,
    zamalekScore: "",
    opponentScore: "",
    status: "upcoming",
  });

  const user = JSON.parse(localStorage.getItem("user")); // Only admins exist
  const isAdmin = !!user;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/matches`, {
          withCredentials: true,
        });
        setMatches(res.data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const parseMatchDate = (match) => {
    const [year, month, day] = match.date.split("-").map(Number);
    const [hours, minutes] = match.time.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== "") {
        formData.append(key, form[key]);
      }
    });

    try {
      let res;
      if (editingId) {
        res = await axios.patch(`${API_URL}/api/matches/${editingId}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post(`${API_URL}/api/matches`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const data = res.data;

      if (editingId) {
        setMatches((prev) => prev.map((m) => (m._id === editingId ? data : m)));
      } else {
        setMatches((prev) => [data, ...prev]);
      }

      setForm({
        date: "",
        time: "",
        stadium: "",
        competition: "",
        homeOrAway: "home",
        opponentName: "",
        logo: null,
        zamalekScore: "",
        opponentScore: "",
        status: "upcoming",
      });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving match:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/matches/${id}`, {
        withCredentials: true,
      });
      setMatches((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting match:", err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-bold">
        Loading matches...
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 font-bold">
        No matches available
      </div>
    );
  }

  const today = new Date();
  const sortedMatches = [...matches].sort(
    (a, b) => parseMatchDate(a) - parseMatchDate(b)
  );
  const nearest =
    sortedMatches.find((m) => parseMatchDate(m) >= today) ||
    sortedMatches[sortedMatches.length - 1];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white to-gray-100 py-8 font-josefin">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-red-600 drop-shadow-sm">
        Upcoming & Recent Matches
      </h1>

      {isAdmin && (
        <div className="flex flex-col items-center gap-4 mb-6">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-red-600 text-white py-2 px-6 rounded-xl hover:bg-red-700 transition"
          >
            {showForm ? "Hide Form" : editingId ? "Edit Match" : "Add Match"}
          </button>

          {showForm && (
            <MatchForm
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              editingId={editingId}
            />
          )}
        </div>
      )}

      <div className="space-y-6 max-w-5xl mx-auto">
        {sortedMatches.map((match, index) => {
          const isNearest = match._id === nearest._id;
          const matchDate = parseMatchDate(match);
          const homeTeamFirst = match.homeOrAway === "home";

          const zamalekTeam = { logo: zamalekLogo, name: "Zamalek" };
          const opponentTeam = {
            logo: match.opponent.logoUrl,
            name: match.opponent.name,
          };

          const leftTeam = homeTeamFirst ? zamalekTeam : opponentTeam;
          const rightTeam = homeTeamFirst ? opponentTeam : zamalekTeam;

          return (
            <motion.div
              key={match._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative w-full flex flex-col rounded-2xl border transition-all transform hover:scale-105 hover:shadow-lg ${
                isNearest
                  ? "border-red-500 bg-gradient-to-r from-red-50 to-white shadow-md md:scale-[1.05]"
                  : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              {isNearest && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-3 px-5 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md z-10">
                  NEXT MATCH
                </div>
              )}

              {/* Admin Edit/Delete */}
              {isAdmin && (
                <div className="absolute top-2 left-2 flex gap-2 z-10">
                  <button
                    onClick={() => {
                      setForm({
                        date: match.date,
                        time: match.time,
                        stadium: match.stadium,
                        competition: match.competition,
                        homeOrAway: match.homeOrAway,
                        opponentName: match.opponent.name,
                        logo: null,
                        zamalekScore: match.score?.zamalek ?? "",
                        opponentScore: match.score?.opponent ?? "",
                        status: match.status,
                      });
                      setEditingId(match._id);
                      setShowForm(true);
                    }}
                    className="text-blue-600 text-xs hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(match._id)}
                    className="text-red-600 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Teams & Score */}
              <div className="grid grid-cols-3 items-center text-center px-6 py-6">
                <Team logo={leftTeam.logo} name={leftTeam.name} />
                <Score match={match} isNearest={isNearest} matchDate={matchDate} />
                <Team logo={rightTeam.logo} name={rightTeam.name} />
              </div>

              {/* Stadium & Competition */}
              <div className="flex justify-around items-center py-2 text-gray-600 text-xs border-t bg-gray-50">
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-red-500" />
                  {match.stadium}
                </div>
                <div className="flex items-center gap-1">
                  <Trophy size={14} className="text-red-500" />
                  {match.competition}
                </div>
              </div>

              {/* Home/Away Badge */}
              <div
                className={`absolute top-2 right-2 px-3 py-0.5 text-white text-[10px] font-bold rounded-full shadow-sm ${
                  homeTeamFirst ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {homeTeamFirst ? "HOME" : "AWAY"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// --- Subcomponents ---
const Team = ({ logo, name }) => (
  <div className="flex flex-col items-center">
    <img src={logo} alt={name} className="w-14 h-14 object-contain" />
    <p className="mt-1 text-sm font-semibold text-gray-700">{name}</p>
  </div>
);

const Score = ({ match, isNearest, matchDate }) => {
  const zamalekIsHome = match.homeOrAway === "home";
  const zamalekScore = match.score?.zamalek ?? null;
  const opponentScore = match.score?.opponent ?? null;

  const displayScore =
    zamalekScore != null && opponentScore != null
      ? zamalekIsHome
        ? `${zamalekScore} - ${opponentScore}` // Zamalek on left
        : `${opponentScore} - ${zamalekScore}` // Zamalek on right
      : "vs";

  return (
    <div className="flex flex-col items-center">
      <span
        className={`font-extrabold ${
          isNearest ? "text-red-600 text-3xl" : "text-gray-800 text-xl"
        }`}
      >
        {displayScore}
      </span>
      <span className="mt-1 text-xs text-gray-500">
        {matchDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}{" "}
        •{" "}
        {matchDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};

export default Matches;
