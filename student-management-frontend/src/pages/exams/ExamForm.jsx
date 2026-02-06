import { useEffect, useState } from "react";

const ExamForm = ({ initialData, onCancel, onSubmit, saving }) => {
  const [form, setForm] = useState({
    name: "",
    course: "",
    date: "",
    maxMarks: 100,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        course: initialData.course || "",
        date: initialData.date ? String(initialData.date).slice(0, 10) : "",
        maxMarks: initialData.maxMarks ?? 100,
      });
    } else {
      setForm({ name: "", course: "", date: "", maxMarks: 100 });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Exam name is required");

    onSubmit({
      name: form.name.trim(),
      course: form.course.trim(),
      date: form.date || undefined,
      maxMarks: form.maxMarks === "" ? 100 : Number(form.maxMarks),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Exam Name
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Midterm Exam"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course (optional)
        </label>
        <input
          name="course"
          value={form.course}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Course name or ID"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date (optional)
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Marks
        </label>
        <input
          type="number"
          name="maxMarks"
          value={form.maxMarks}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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

export default ExamForm;
