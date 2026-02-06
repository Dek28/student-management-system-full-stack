import { useEffect, useState } from "react";

const AttendanceForm = ({ initialData, onCancel, onSubmit, saving }) => {
  const [form, setForm] = useState({
    studentId: "",
    date: "",
    status: "Present",
    remark: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        studentId: initialData.studentId || "",
        date: initialData.date ? String(initialData.date).slice(0, 10) : "",
        status: initialData.status || "Present",
        remark: initialData.remark || "",
      });
    } else {
      setForm({ studentId: "", date: "", status: "Present", remark: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.studentId.trim()) return alert("studentId is required");
    if (!form.date) return alert("date is required");

    onSubmit({
      studentId: form.studentId.trim(),
      date: form.date,
      status: form.status,
      remark: form.remark.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Student ID
        </label>
        <input
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mongo _id or your studentId"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Present</option>
          <option>Absent</option>
          <option>Late</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remark (optional)
        </label>
        <input
          name="remark"
          value={form.remark}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional note..."
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

export default AttendanceForm;
