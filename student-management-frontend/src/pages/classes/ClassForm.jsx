import { useState, useEffect } from "react";

const ClassForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setYear(initialData.year || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      name,
      year,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Class Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Class Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Class 10A"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Year
        </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="2024"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ClassForm;
