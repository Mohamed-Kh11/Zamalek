import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_BASE}/api/news/${id}`);
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-600 text-lg">
        Loading news...
      </div>
    );
  }

  if (!news) {
    return (
      <div className="py-20 text-center text-gray-600 text-lg">
        News not found.
      </div>
    );
  }

  return (
    <div className="min-h-[85svh] bg-gray-50 py-8 px-4 md:px-8 flex justify-center">
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Image */}
        {news.image && (
          <div className="md:w-1/2 flex-shrink-0">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-64 md:h-full object-cover bg-gray-200"
            />
          </div>
        )}

        {/* Right Content */}
        <div className="px-6 py-6 md:px-10 flex flex-col justify-start md:w-1/2 space-y-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="text-red-600 hover:underline text-sm font-medium"
          >
            &larr; Back
          </button>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-red-600">
            {news.title}
          </h1>

          {/* Metadata */}
          <p className="text-gray-400 text-sm md:text-base">
            Published on: {format(new Date(news.publishedAt), "PPPp")}
          </p>

          {/* Content */}
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {news.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
