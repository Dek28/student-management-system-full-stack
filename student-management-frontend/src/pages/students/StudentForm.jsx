// src/pages/students/StudentForm.jsx
import { useEffect, useState } from "react";
import client from "../../api/client";
import FormField from "../../components/FormField";

const StudentForm = ({ initialData, onClose, onSaved }) => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [form, setForm] = useState(
    initialData || {
      name: "",
      regNo: "",
      className: "",
      email: "",
      phone: "",
      course: "", 
    }
  );

  const [saving, setSaving] = useState(false);

  //load courses for dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await client.get("/courses");
        // supports res.data = [] OR res.data.data = []
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setCourses(list);
      } catch (err) {
        console.error(err);
        alert("Failed to load courses.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // 
  useEffect(() => {
    if (initialData?.course && typeof initialData.course === "object") {
      setForm((prev) => ({ ...prev, course: initialData.course._id }));
    }
  }, [initialData]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!form.course) {
        alert("Please select a course.");
        setSaving(false);
        return;
      }

      if (initialData) {
        await client.put(`/students/${initialData._id}`, form);
      } else {
        await client.post("/students", form);
      }
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to save student.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {initialData ? "Edit Student" : "Add Student"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <FormField
            label="Registration No"
            name="regNo"
            value={form.regNo}
            onChange={handleChange}
          />
          <FormField
            label="Class"
            name="className"
            value={form.className}
            onChange={handleChange}
          />

          {/* Course dropdown */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              disabled={loadingCourses}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60"
              required
            >
              <option value="">
                {loadingCourses ? "Loading courses..." : "Select course"}
              </option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name || c.title || c.courseName || "Unnamed course"}
                </option>
              ))}
            </select>
          </div>

          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <FormField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
