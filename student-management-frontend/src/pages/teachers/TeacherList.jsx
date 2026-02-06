// src/pages/teachers/TeacherList.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import DataTable from "../../components/DataTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import TeacherForm from "./TeacherForm";

const TeacherList = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAuthError = (err, fallbackMsg) => {
    console.error(err);

    const status = err?.response?.status;
    const msg = err?.response?.data?.message || fallbackMsg;

    // ✅ If token missing/expired -> redirect to login
    if (status === 401) {
      alert("Session expired or not logged in. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      return;
    }

    alert(msg);
  };

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.get("/teachers"); 
      setTeachers(res.data);
    } catch (err) {
      handleAuthError(err, "Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleEdit = (teacher) => {
    setSelected(teacher);
    setShowForm(true);
  };

  const handleDelete = async (teacher) => {
    if (!window.confirm(`Delete teacher ${teacher.name}?`)) return;

    try {
      await client.delete(`/teachers/${teacher._id}`); 
      fetchTeachers();
    } catch (err) {
      handleAuthError(err, "Failed to delete teacher.");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Teacher ID", accessor: "teacherId" },
    { header: "Subject", accessor: "subject" },
    { header: "Email", accessor: "email" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Teachers</h2>
        <button
          onClick={handleCreate}
          className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          + Add Teacher
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={teachers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <TeacherForm
          initialData={selected}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchTeachers();
          }}
        />
      )}
    </div>
  );
};

export default TeacherList;
