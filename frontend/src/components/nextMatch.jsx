import React, { useEffect, useState } from "react";
import axios from "axios";
import zamalekLogo from "../../src/images/zamalek.png";

const NextMatch = () => {
  const [nextMatch, setNextMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const API_BASE =
          process.env.REACT_APP_API_URL || "http://localhost:5000";

        const res = await axios.get(`${API_BASE}/api/matches`);
        const matches = res.data;

        const today = new Date();

        // Sort matches by date+time
        const sorted = matches.sort((a, b) => {
          const [ay, am, ad] = a.date.split("-").map(Number);
          const [ah, amn] = a.time.split(":").map(Number);
          const aDate = new Date(ay, am - 1, ad, ah, amn);

          const [by, bm, bd] = b.date.split("-").map(Number);
          const [bh, bmn] = b.time.split(":").map(Number);
          const bDate = new Date(by, bm - 1, bd, bh, bmn);

          return aDate - bDate;
        });

        const nearest =
          sorted.find((m) => {
            const [y, mo, d] = m.date.split("-").map(Number);
            const [h, mi] = m.time.split(":").map(Number);
            const matchDate = new Date(y, mo - 1, d, h, mi);
            return matchDate >= today;
          }) || sorted[sorted.length - 1];

        setNextMatch(nearest);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const Skeleton = () => (
    <div className="flex-1 bg-gradient-to-br from-red-600 to-black text-white rounded-xl shadow-lg p-5 flex flex-col justify-between animate-pulse">
      <div className="h-6 bg-red-300/40 rounded mb-6"></div>
      <div className="flex items-center justify-center gap-10">
        <div className="w-20 h-20 bg-white/30 rounded-full"></div>
        <div className="text-3xl text-white font-bold">vs</div>
        <div className="w-20 h-20 bg-white/30 rounded-full"></div>
      </div>
      <div className="mt-6 h-4 bg-red-300/40 rounded"></div>
      <div className="mt-2 h-4 bg-red-300/40 rounded w-1/2 mx-auto"></div>
    </div>
  );

  if (loading) return <Skeleton />;

  if (!nextMatch) {
    return (
      <div className="flex-1 bg-gradient-to-br from-red-600 to-black text-white rounded-xl shadow-lg p-6 flex items-center justify-center">
        No upcoming match
      </div>
    );
  }

  const [year, month, day] = nextMatch.date.split("-").map(Number);
  const [hours, minutes] = nextMatch.time.split(":").map(Number);
  const matchDate = new Date(year, month - 1, day, hours, minutes);

  return (
    <div className="flex-1 bg-gradient-to-br from-red-600 to-black text-white rounded-xl shadow-lg p-5 flex flex-col justify-between min-h-[280px]">
      <h3 className="text-xl font-bold mb-6 border-b border-red-300 pb-2 text-center">
        ⚽ Next Match
      </h3>

      {/* Teams Row */}
      <div className="flex items-center justify-center gap-10">
        {/* Team 1 (Zamalek) */}
        <div className="flex flex-col items-center">
          <img
            src={zamalekLogo}
            alt="Zamalek Logo"
            className="w-20 h-20 object-contain rounded-full bg-white p-2 shadow"
            width="80"
            height="80"
            loading="lazy"
          />
          <p className="mt-2 font-semibold text-sm">Zamalek</p>
        </div>

        {/* VS */}
        <div className="text-3xl font-extrabold text-white">vs</div>

        {/* Opponent */}
        <div className="flex flex-col items-center">
          {nextMatch.opponent.logoUrl ? (
            <img
              src={nextMatch.opponent.logoUrl}
              alt={`${nextMatch.opponent.name} Logo`}
              className="w-20 h-20 object-contain rounded-full bg-white p-2 shadow"
              width="80"
              height="80"
              loading="lazy"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black text-2xl font-bold shadow">
              {nextMatch.opponent.name[0]}
            </div>
          )}
          <p className="mt-2 font-semibold text-sm">{nextMatch.opponent.name}</p>
        </div>
      </div>

      {/* Match Info */}
      <div className="mt-6 text-center text-sm">
        <p className="mb-1">
          <span className="font-semibold">
            {matchDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>{" "}
          •{" "}
          <span className="font-semibold">
            {matchDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </p>
        <p>
          Stadium: <span className="font-semibold">{nextMatch.stadium}</span>
        </p>
      </div>
    </div>
  );
};

export default NextMatch;
