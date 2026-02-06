import { useEffect, useState } from "react";

const AnnouncementForm = ({ initialData, onCancel, onSubmit, saving }) => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "All",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        message: initialData.message || "",
        audience: initialData.audience || "All",
      });
    } else {
      setForm({ title: "", message: "", audience: "All" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title is required");
    if (!form.message.trim()) return alert("Message is required");

    onSubmit({
      title: form.title.trim(),
      message: form.message.trim(),
      audience: form.audience,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Audience
        </label>
        <select
          name="audience"
          value={form.audience}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>Students</option>
          <option>Teachers</option>
          <option>Admins</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
