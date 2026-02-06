import { useEffect, useState } from "react";
import client from "../../api/client";

const ResultForm = ({ initialData, onCancel, onSubmit, saving }) => {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);

  const [form, setForm] = useState({
    studentId: "",
    examId: "",
    marksObtained: "",
    grade: "",
  });

  // 🔹 Load students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await client.get("/students");
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setStudents(list);
      } catch (err) {
        console.error(err);
        alert("Failed to load students");
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // 🔹 Load exams
  useEffect(() => {
    const fetchExams = async () => {
      setLoadingExams(true);
      try {
        const res = await client.get("/exams");
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setExams(list);
      } catch (err) {
        console.error(err);
        alert("Failed to load exams");
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, []);

  // ✅ Fill form when editing (handles populated objects OR plain ids)
  useEffect(() => {
    if (initialData) {
      setForm({
        studentId: initialData.studentId?._id || initialData.studentId || "",
        examId: initialData.examId?._id || initialData.examId || "",
        marksObtained: initialData.marksObtained ?? "",
        grade: initialData.grade || "",
      });
    } else {
      setForm({ studentId: "", examId: "", marksObtained: "", grade: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.studentId) return alert("Student is required");
    if (!form.examId) return alert("Exam is required");
    if (form.marksObtained === "") return alert("Marks are required");

    onSubmit({
      studentId: form.studentId,
      examId: form.examId,
      marksObtained: Number(form.marksObtained),
      grade: form.grade.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ✅ Student dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Student
        </label>
        <select
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          disabled={loadingStudents || saving}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">
            {loadingStudents ? "Loading students..." : "Select student"}
          </option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} {s.regNo ? `(${s.regNo})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Exam dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Exam
        </label>
        <select
          name="examId"
          value={form.examId}
          onChange={handleChange}
          disabled={loadingExams || saving}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">
            {loadingExams ? "Loading exams..." : "Select exam"}
          </option>
          {exams.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
              {e.course ? ` – ${e.course}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Marks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Marks Obtained
        </label>
        <input
          name="marksObtained"
          type="number"
          min="0"
          max="100"
          value={form.marksObtained}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Grade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Grade
        </label>
        <input
          name="grade"
          value={form.grade}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="A, B, C..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default ResultForm;
