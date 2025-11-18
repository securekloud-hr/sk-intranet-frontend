import React, { useState, useEffect } from "react";
import API from "@/config";
type Announcement = {
  title: string;
  date: string;
  content: string;
  category: string;
};

const AdminAddAnnouncement = ({ user }: { user: any }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");

  const handleAdd = () => {
    const newAnnouncement: Announcement = {
      title,
      content,
      category,
      date: new Date().toISOString().split("T")[0]
    };

    const existing = JSON.parse(localStorage.getItem("announcements") || "[]");
    const updated = [newAnnouncement, ...existing];
    localStorage.setItem("announcements", JSON.stringify(updated));
    alert("✅ Announcement added!");
    setTitle("");
    setContent("");
    setCategory("General");
  };

  if (user?.role !== "admin") {
    return <p className="text-red-600 p-4">❌ Only admins can add announcements.</p>;
  }

  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📢 Add New Announcement</h2>
      <input
        className="border p-2 w-full mb-3"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <select
        className="border p-2 w-full mb-3"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="General">General</option>
        <option value="HR">HR</option>
        <option value="Policies">Policies</option>
        <option value="Employee Engagement">Employee Engagement</option>
      </select>
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Announcement
      </button>
    </div>
  );
};

export default AdminAddAnnouncement;
