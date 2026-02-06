
import { useEffect, useState } from "react";
import client from "../../api/client";
import DataTable from "../../components/DataTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import CourseForm from "../courses/CourseForm"

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await client.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load coures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleEdit = (course) => {
    setSelected(course);
    setShowForm(true);
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete course ${course.name}?`)) return;
    try {
      await client.delete(`/courses/${course._id}`);
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete course.");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "code", accessor: "code" },
    { header: "description", accessor: "description" },
    { header: "teacher", accessor: "teacher" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">courses</h2>
        <button
          onClick={handleCreate}
          className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          + Add course
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={courses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <CourseForm
          initialData={selected}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchCourses();
          }}
        />
      )}
    </div>
  );
};

export default CourseList;
