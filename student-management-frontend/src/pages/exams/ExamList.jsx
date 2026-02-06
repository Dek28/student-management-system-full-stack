import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import ExamForm from "./ExamForm";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await client.get("/exams");
      setExams(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return exams;

    return exams.filter((e) => {
      const name = (e.name || "").toLowerCase();
      const course = (e.course || "").toLowerCase();
      const date = e.date ? String(e.date).slice(0, 10) : "";
      return name.includes(q) || course.includes(q) || date.includes(q);
    });
  }, [exams, search]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (exam) => {
    setEditing(exam);
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

      if (editing) await client.put(`/exams/${editing._id}`, payload);
      else await client.post("/exams", payload);

      closeModal();
      await fetchExams();
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to save exam");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (exam) => {
    const ok = window.confirm(`Delete exam "${exam.name}"?`);
    if (!ok) return;

    try {
      await client.delete(`/exams/${exam._id}`);
      await fetchExams();
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to delete exam");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Exams</h1>
          <p className="text-sm text-gray-500">Manage exams</p>
        </div>

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, course, date..."
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
          <div className="p-6 text-gray-600">No exams found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Course</th>
                <th className="p-3">Date</th>
                <th className="p-3">Max Marks</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e._id} className="border-t">
                  <td className="p-3 font-medium">{e.name}</td>
                  <td className="p-3">{e.course || "-"}</td>
                  <td className="p-3">{e.date ? String(e.date).slice(0, 10) : "-"}</td>
                  <td className="p-3">{e.maxMarks ?? 100}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(e)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e)}
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
                {editing ? "Edit Exam" : "Add Exam"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4">
              <ExamForm
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

export default ExamList;
