import React from "react";

const PlayerForm = ({ form, setForm, handleSubmit, editingId }) => {
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 max-w-md w-full mt-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Player Name</label>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded-md mt-1" required />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Position</label>
        <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="border px-3 py-2 rounded-md mt-1" required />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Age</label>
        <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} className="border px-3 py-2 rounded-md mt-1" required />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Nationality</label>
        <input type="text" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} className="border px-3 py-2 rounded-md mt-1" required />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Player Image</label>
        <input type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} className="mt-1" />
      </div>
      <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition">
        {editingId ? "Update Player" : "Add Player"}
      </button>
    </form>
  );
};

export default PlayerForm;
