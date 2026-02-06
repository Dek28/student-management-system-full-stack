import { useEffect, useState } from "react";
import api from "../../api/client";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch (err) {
      alert("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Add class
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/classes", {
        name,
        year,
      });

      setName("");
      setYear("");
      setShowModal(false);
      fetchClasses();
    } catch (err) {
      alert("Failed to add class");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Classes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Class
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Year</th>
              </tr>
            </thead>
            <tbody>
              {classes.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-4 text-center text-gray-500">
                    No classes found
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls._id} className="border-t">
                    <td className="p-3">{cls.name}</td>
                    <td className="p-3">{cls.year || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add Class</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Class Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Class 10A"
                />
              </div>

              <div>
                <label className="block mb-1">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="2024"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassList;
