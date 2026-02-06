// src/pages/students/StudentForm.jsx
import { useState } from "react";
import client from "../../api/client";
import FormField from "../../components/FormField";


const courseForm = ({ initialData, onClose, onSaved }) => {
  const [form, setForm] = useState(
    initialData || {
      name: "",
       code: "",
      teacher: ""
    }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (initialData) {
        await client.put(`/courses/${initialData._id}`, form);
      } else {
        await client.post("/courses", form);
      }
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {initialData ? "Edit Course" : "Add Course"}
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
            label="code"
            name="code"
            value={form.code}
            onChange={handleChange}
          />
          <FormField
            label="Teacher"
            name="Teacher"
           
            value={form.Teacher}
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

export default courseForm;
