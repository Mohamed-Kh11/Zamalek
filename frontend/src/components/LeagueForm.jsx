import React from "react";

const LeagueForm = ({ form, setForm, handleSubmit }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 max-w-md w-full"
    >
      {/* Team Name */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Team Name</label>
        <input
          type="text"
          value={form.team}
          onChange={(e) => setForm({ ...form, team: e.target.value })}
          className="border px-3 py-2 rounded-md mt-1"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Points */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Points</label>
          <input
            type="number"
            value={form.points}
            onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
            className="border px-3 py-2 rounded-md mt-1"
          />
        </div>

        {/* Games Played */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Games Played</label>
          <input
            type="number"
            value={form.gamesPlayed}
            onChange={(e) =>
              setForm({ ...form, gamesPlayed: Number(e.target.value) })
            }
            className="border px-3 py-2 rounded-md mt-1"
          />
        </div>

        {/* Wins */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Wins</label>
          <input
            type="number"
            value={form.wins}
            onChange={(e) => setForm({ ...form, wins: Number(e.target.value) })}
            className="border px-3 py-2 rounded-md mt-1"
          />
        </div>

        {/* Draws */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Draws</label>
          <input
            type="number"
            value={form.draws}
            onChange={(e) => setForm({ ...form, draws: Number(e.target.value) })}
            className="border px-3 py-2 rounded-md mt-1"
          />
        </div>

        {/* Losses */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Losses</label>
          <input
            type="number"
            value={form.losses}
            onChange={(e) => setForm({ ...form, losses: Number(e.target.value) })}
            className="border px-3 py-2 rounded-md mt-1"
          />
        </div>

        {/* Goals For */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Goals For</label>
          <input
            type="number"
            value={form.goalsFor}
            onChange={(e) => setForm({ ...form, goalsFor: Number(e.target.value) })}
            className="border px-3 py-2 rounded-md mt-1"
          />
        </div>

        {/* Goals Against */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Goals Against</label>
          <input
            type="number"
            value={form.goalsAgainst}
            onChange={(e) =>
              setForm({ ...form, goalsAgainst: Number(e.target.value) })
            }
            className="border px-3 py-2 rounded-md mt-1"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition mt-2"
      >
        Save
      </button>
    </form>
  );
};

export default LeagueForm;
