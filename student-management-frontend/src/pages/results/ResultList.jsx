import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import ResultForm from "./ResultForm";

const ResultList = () => {
  const [results, setResults] = useState([]);
  const [studentMap, setStudentMap] = useState({}); // id -> label
  const [examMap, setExamMap] = useState({}); // id -> label

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // normalize possibly-populated fields to an id string
  const getId = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") return val._id || "";
    return "";
  };

  const fetchStudents = async () => {
    try {
      const res = await client.get("/students");
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

      const map = {};
      for (const s of list) {
        map[s._id] = `${s.name || "Unknown"}${s.regNo ? ` (${s.regNo})` : ""}`;
      }
      setStudentMap(map);
    } catch (err) {
      console.error(err?.response?.data || err.message);
    }
  };

  const fetchExams = async () => {
    try {
      const res = await client.get("/exams");
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

      const map = {};
      for (const e of list) {
        map[e._id] = `${e.name || "Unknown"}${e.course ? ` – ${e.course}` : ""}`;
      }
      setExamMap(map);
    } catch (err) {
      console.error(err?.response?.data || err.message);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await client.get("/results");
      setResults(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchExams();
    fetchResults();
  }, []);

  // ✅ show name/regNo if populated, else fallback to map, else id
  const studentLabel = (studentField) => {
    if (studentField && typeof studentField === "object") {
      return `${studentField.name || "Unknown"}${
        studentField.regNo ? ` (${studentField.regNo})` : ""
      }`;
    }
    const id = getId(studentField);
    return studentMap[id] || id || "-";
  };

  // ✅ show exam name/course if populated, else fallback to map, else id
  const examLabel = (examField) => {
    if (examField && typeof examField === "object") {
      const nm = examField.name || "Unknown";
      const cr = examField.course ? ` – ${examField.course}` : "";
      return `${nm}${cr}`;
    }
    const id = getId(examField);
    return examMap[id] || id || "-";
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return results;

    return results.filter((r) => {
      // ✅ backend fields are student/exam
      const sid = getId(r.student).toLowerCase();
      const studentText = studentLabel(r.student).toLowerCase();

      const eid = getId(r.exam).toLowerCase();
      const examText = examLabel(r.exam).toLowerCase();

      const grade = (r.grade || "").toLowerCase();
      const marks = r.marksObtained != null ? String(r.marksObtained) : "";

      return (
        sid.includes(q) ||
        studentText.includes(q) ||
        eid.includes(q) ||
        examText.includes(q) ||
        grade.includes(q) ||
        marks.includes(q)
      );
    });
  }, [results, search, studentMap, examMap]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r);
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

      // frontend form sends studentId/examId; backend controller maps -> student/exam
      const safePayload = {
        studentId: getId(payload.studentId) || payload.studentId,
        examId: getId(payload.examId) || payload.examId,
        marksObtained: Number(payload.marksObtained),
        grade: (payload.grade || "").trim(),
      };

      if (editing) await client.put(`/results/${editing._id}`, safePayload);
      else await client.post("/results", safePayload);

      closeModal();
      await fetchResults();
      await fetchStudents();
      await fetchExams();
    } catch (err) {
      console.error("Save result error:", err?.response?.data || err.message);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        JSON.stringify(err?.response?.data) ||
        err.message ||
        "Failed to save result";

      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r) => {
    const ok = window.confirm("Delete this result?");
    if (!ok) return;

    try {
      await client.delete(`/results/${r._id}`);
      await fetchResults();
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to delete result");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Results</h1>
          <p className="text-sm text-gray-500">Manage exam results</p>
        </div>

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, exam, grade, marks..."
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
          <div className="p-6 text-gray-600">No results found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Exam</th>
                <th className="p-3">Marks</th>
                <th className="p-3">Grade</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-3 font-medium">{studentLabel(r.student)}</td>
                  <td className="p-3">{examLabel(r.exam)}</td>
                  <td className="p-3">{r.marksObtained}</td>
                  <td className="p-3">{r.grade || "-"}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
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
                {editing ? "Edit Result" : "Add Result"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4">
              <ResultForm
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

export default ResultList;
