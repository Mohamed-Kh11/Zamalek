import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PlayerForm from "./PlayerForm";
import { toast, Toaster } from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const positionOrder = {
  GK: 1, CB: 2, RB: 3, LB: 4, CDM: 5, CM: 6, CAM: 7, RW: 8, LW: 9, ST: 10,
};

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    position: "",
    age: "",
    nationality: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isAdmin = !!user;

  // ✅ Fetch players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        toast.loading("Fetching players...");
        const { data } = await axios.get(`${API_URL}/api/players`, {
          withCredentials: true,
        });
        toast.dismiss();
        toast.success(`Loaded ${data.length} players`);
        const sorted = data.sort(
          (a, b) => (positionOrder[a.position] || 99) - (positionOrder[b.position] || 99)
        );
        setPlayers(sorted);
      } catch (err) {
        toast.dismiss();
        toast.error(`Error fetching players: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  // ✅ Handle add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast("Submitting form...");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("position", form.position);
    formData.append("age", form.age);
    formData.append("nationality", form.nationality);
    if (form.image) formData.append("image", form.image);

    try {
      let res;
      if (editingId) {
        toast.loading("Updating player...");
        res = await axios.put(`${API_URL}/api/players/${editingId}`, formData, {
          withCredentials: true,
        });
        toast.dismiss();
        toast.success("Player updated ✅");
        setPlayers((prev) =>
          prev.map((p) => (p._id === editingId ? res.data : p))
        );
      } else {
        toast.loading("Adding player...");
        res = await axios.post(`${API_URL}/api/players`, formData, {
          withCredentials: true,
        });
        toast.dismiss();
        toast.success("Player added ✅");
        setPlayers((prev) => [res.data, ...prev]);
      }

      setForm({ name: "", position: "", age: "", nationality: "", image: null });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      toast.dismiss();
      toast.error(`Error saving player: ${err.response?.data?.message || err.message}`);
    }
  };

  // ✅ Handle delete
  const handleDelete = async (id) => {
    try {
      toast.loading("Deleting player...");
      await axios.delete(`${API_URL}/api/players/${id}`, {
        withCredentials: true,
      });
      toast.dismiss();
      toast.success("Player deleted ✅");
      setPlayers((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.dismiss();
      toast.error(`Error deleting player: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">
        Loading players...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-6 font-josefin">
      {/* ✅ Add Toaster so we can see messages on screen */}
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">
        ⚽ Team Squad
      </h1>

      {isAdmin && (
        <div className="flex flex-col items-center mb-6">
          <button
            onClick={() => {
              if (editingId) {
                setEditingId(null);
                setForm({ name: "", position: "", age: "", nationality: "", image: null });
              }
              setShowForm((prev) => !prev);
            }}
            className="bg-red-600 text-white py-2 px-6 rounded-xl hover:bg-red-700 transition"
          >
            {showForm ? "Hide Form" : editingId ? "Edit Player" : "Add Player"}
          </button>

          {showForm && (
            <PlayerForm
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              editingId={editingId}
            />
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow rounded-xl overflow-hidden">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Player</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left hidden md:table-cell">Nationality</th>
              {isAdmin && <th className="p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <motion.tr
                key={p._id || i}
                className="odd:bg-white even:bg-gray-100 hover:bg-red-50 transition"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <td className="p-3 font-bold text-red-600">{i + 1}</td>
                <td className="p-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  <motion.img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    whileHover={{ scale: 1.15, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                  <span className="text-sm md:text-lg">{p.name}</span>

                  {/* Small screen actions */}
                  {isAdmin && (
                    <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-auto sm:hidden">
                      <button
                        onClick={() => {
                          toast("Editing player...");
                          setForm({
                            name: p.name,
                            position: p.position,
                            age: p.age,
                            nationality: p.nationality,
                            image: null,
                          });
                          setEditingId(p._id);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-3 text-gray-600 text-xs sm:text-sm">{p.position}</td>
                <td className="p-3 text-gray-600 text-xs sm:text-sm">{p.age}</td>
                <td className="p-3 text-gray-600 hidden md:table-cell text-xs sm:text-sm">
                  {p.nationality}
                </td>

                {/* Medium+ actions */}
                {isAdmin && (
                  <td className="p-3 hidden sm:flex gap-2">
                    <button
                      onClick={() => {
                        toast("Editing player...");
                        setForm({
                          name: p.name,
                          position: p.position,
                          age: p.age,
                          nationality: p.nationality,
                          image: null,
                        });
                        setEditingId(p._id);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline text-sm"
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

export default Players;
