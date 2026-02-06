// src/pages/teachers/TeacherForm.jsx
import { useState } from "react";
import client from "../../api/client";
import FormField from "../../components/FormField";

const TeacherForm = ({ initialData, onClose, onSaved }) => {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      teacherId: "",
      subject: "",
      email: "",
      phone: "",
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
        await client.put(`/teachers/${initialData._id}`, form);
      } else {
        await client.post("/teachers", form);
      }
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to save teacher.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {initialData ? "Edit Teacher" : "Add Teacher"}
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
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <FormField
            label="Teacher ID"
            name="teacherId"
            value={form.teacherId}
            onChange={handleChange}
          />
          <FormField
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
          />
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

export default TeacherForm;
