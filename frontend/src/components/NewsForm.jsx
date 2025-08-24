import React from "react";

const NewsForm = ({ form, setForm, handleSubmit, editingId }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md mb-8"
    >
      <h2 className="text-xl font-bold mb-2">
        {editingId ? "✏️ Edit News" : "➕ Add News"}
      </h2>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        name="content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        placeholder="Content"
        className="w-full p-2 border rounded"
        rows="4"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
      />

      <button
        type="submit"
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        {editingId ? "Update News" : "Add News"}
      </button>
    </form>
  );
};

export default NewsForm;
