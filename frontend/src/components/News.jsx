import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// --- NewsForm Component ---
const NewsForm = ({ form, setForm, handleSubmit, editingId }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg flex flex-col gap-4"
    >
      <h2 className="text-lg font-bold text-red-600">
        {editingId ? "Edit News" : "Add News"}
      </h2>

      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
        className="border p-2 rounded"
        required
      />
      <textarea
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        placeholder="Content"
        className="border p-2 rounded min-h-[120px]"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
      >
        {editingId ? "Update News" : "Add News"}
      </button>
    </form>
  );
};

// --- Main News Component ---
const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "", image: null });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // only admin exists
  const isAdmin = !!user;

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/news`, {
          withCredentials: true,
        });
        setNewsArticles(res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Add or update news
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
        res = await axios.patch(`${API_URL}/api/news/${editingId}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post(`${API_URL}/api/news`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const data = res.data;

      if (editingId) {
        setNewsArticles((prev) =>
          prev.map((n) => (n._id === editingId ? data : n))
        );
      } else {
        setNewsArticles((prev) => [data, ...prev]);
      }

      setForm({ title: "", content: "", image: null });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving news:", err.response?.data || err.message);
    }
  };

  // Delete news
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/news/${id}`, {
        withCredentials: true,
      });
      setNewsArticles((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting news:", err.response?.data || err.message);
    }
  };

  // UI States
  if (loading) {
    return (
      <div className="py-10 text-center text-gray-600 text-lg">
        Loading latest news...
      </div>
    );
  }

  if (newsArticles.length === 0) {
    return (
      <div className="py-10 text-center text-gray-600 text-lg">
        No news available yet.
        {isAdmin && (
          <div className="mt-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 text-white py-2 px-6 rounded-xl hover:bg-red-700 transition"
            >
              Add News
            </button>
            {showForm && (
              <NewsForm
                form={form}
                setForm={setForm}
                handleSubmit={handleSubmit}
                editingId={editingId}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-6 min-h-screen space-y-10 bg-gray-50">
      {/* Admin Form */}
      {isAdmin && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-red-600 text-white py-2 px-6 rounded-xl hover:bg-red-700 transition"
          >
            {showForm ? "Hide Form" : editingId ? "Edit News" : "Add News"}
          </button>

          {showForm && (
            <NewsForm
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              editingId={editingId}
            />
          )}
        </div>
      )}

      {/* Hero News */}
      <div className="cursor-pointer max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-lg">
          {newsArticles[0].image && (
            <img
              src={newsArticles[0].image}
              alt={newsArticles[0].title}
              className="w-full md:w-1/2 h-64 md:h-auto object-contain bg-gray-200"
              onClick={() => navigate(`/news/${newsArticles[0]._id}`)}
            />
          )}
          <div className="p-6 flex flex-col justify-between md:w-1/2">
            <div
              onClick={() => navigate(`/news/${newsArticles[0]._id}`)}
              className="cursor-pointer"
            >
              <h1 className="text-2xl md:text-3xl font-extrabold mb-3 text-red-600">
                {newsArticles[0].title}
              </h1>
              <p className="text-gray-700 line-clamp-5">
                {newsArticles[0].content}
              </p>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
              <p className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(newsArticles[0].publishedAt), {
                  addSuffix: true,
                })}
              </p>
              {isAdmin && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setForm({
                        title: newsArticles[0].title,
                        content: newsArticles[0].content,
                        image: null,
                      });
                      setEditingId(newsArticles[0]._id);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(newsArticles[0]._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary News */}
      <div>
        <h2 className="text-2xl font-bold border-b-2 border-red-600 pb-2 mb-6 text-center">
          📰 Latest News
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {newsArticles.slice(1).map((article) => (
            <div
              key={article._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => navigate(`/news/${article._id}`)}
                />
              )}
              <div className="p-4">
                <h3
                  className="font-bold text-lg text-gray-800 hover:text-red-600 cursor-pointer"
                  onClick={() => navigate(`/news/${article._id}`)}
                >
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {article.content}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {formatDistanceToNow(new Date(article.publishedAt), {
                    addSuffix: true,
                  })}
                </p>

                {isAdmin && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => {
                        setForm({
                          title: article.title,
                          content: article.content,
                          image: null,
                        });
                        setEditingId(article._id);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
