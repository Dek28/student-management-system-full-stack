import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import AnnouncementForm from "./AnnouncementForm";

const AnnouncementList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await client.get("/announcements");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;

    return items.filter((a) => {
      const title = (a.title || "").toLowerCase();
      const audience = (a.audience || "").toLowerCase();
      const message = (a.message || "").toLowerCase();
      return title.includes(q) || audience.includes(q) || message.includes(q);
    });
  }, [items, search]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      if (editing) await client.put(`/announcements/${editing._id}`, payload);
      else await client.post("/announcements", payload);

      closeModal();
      await fetchItems();
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to save announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a) => {
    const ok = window.confirm(`Delete "${a.title}"?`);
    if (!ok) return;

    try {
      await client.delete(`/announcements/${a._id}`);
      await fetchItems();
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to delete announcement");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Announcements</h1>
          <p className="text-sm text-gray-500">Create and manage announcements</p>
        </div>

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, audience, message..."
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="mt-5 bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-gray-600">No announcements found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Audience</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-3 font-medium">{a.title}</td>
                  <td className="p-3">{a.audience || "All"}</td>
                  <td className="p-3">
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(a)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">
                {editing ? "Edit Announcement" : "Add Announcement"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4">
              <AnnouncementForm
                initialData={editing}
                onCancel={closeModal}
                onSubmit={handleSubmit}
                saving={saving}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;
