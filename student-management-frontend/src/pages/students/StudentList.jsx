// src/pages/students/StudentList.jsx
import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import DataTable from "../../components/DataTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import StudentForm from "./StudentForm";

const VIEW_MODE = "tabs"; // "tabs" | "accordion"

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [query, setQuery] = useState("");
  const [activeClass, setActiveClass] = useState("All"); // tab state
  const [openClasses, setOpenClasses] = useState({}); // accordion state

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await client.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleEdit = (student) => {
    setSelected(student);
    setShowForm(true);
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete student ${student.name || student.fullName}?`)) return;
    try {
      await client.delete(`/students/${student._id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete student.");
    }
  };

  // ✅ Adjust this to your data model
  const getClassLabel = (s) => {
    if (s.className) return s.className;        // ex: "Grade 10A"
    if (typeof s.class === "string") return s.class; // ex: "Form 2"
    if (s.classId?.name) return s.classId.name; // ex: populated class
    return "Unassigned";
  };

  const normalizedQuery = query.trim().toLowerCase();

  const filteredStudents = useMemo(() => {
    if (!normalizedQuery) return students;

    return students.filter((s) => {
      const name = (s.name || s.fullName || "").toLowerCase();
      const studentId = (s.studentId || "").toLowerCase();
      const email = (s.email || "").toLowerCase();
      const cls = getClassLabel(s).toLowerCase();

      return (
        name.includes(normalizedQuery) ||
        studentId.includes(normalizedQuery) ||
        email.includes(normalizedQuery) ||
        cls.includes(normalizedQuery)
      );
    });
  }, [students, normalizedQuery]);

  const groupedByClass = useMemo(() => {
    const map = new Map();
    for (const s of filteredStudents) {
      const key = getClassLabel(s);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredStudents]);

  const classNames = useMemo(() => {
    const names = groupedByClass.map(([k]) => k);
    return ["All", ...names];
  }, [groupedByClass]);

  // Keep active class valid when filters change
  useEffect(() => {
    if (activeClass !== "All" && !classNames.includes(activeClass)) {
      setActiveClass("All");
    }
  }, [classNames, activeClass]);

  const columns = [
    { header: "Name", accessor: "name" }, // change if you use fullName
    { header: "Student ID", accessor: "studentId" },
    { header: "Email", accessor: "email" },
  ];

  const renderTable = (data) => (
    <DataTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
  );

  const totalCount = filteredStudents.length;

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-xl font-semibold">Students</h2>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students (name, ID, email, class)..."
            className="w-full md:w-80 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={handleCreate}
            className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            + Add Student
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : groupedByClass.length === 0 ? (
        <div className="text-sm text-gray-500">No students found.</div>
      ) : VIEW_MODE === "tabs" ? (
        <div>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {classNames.map((name) => {
              const count =
                name === "All"
                  ? totalCount
                  : groupedByClass.find(([k]) => k === name)?.[1]?.length || 0;

              const active = activeClass === name;

              return (
                <button
                  key={name}
                  onClick={() => setActiveClass(name)}
                  className={[
                    "px-3 py-1.5 rounded-full text-sm border",
                    active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {name} <span className={active ? "opacity-90" : "text-gray-500"}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {activeClass === "All" ? (
            <div className="space-y-6">
              {groupedByClass.map(([className, classStudents]) => (
                <div key={className} className="bg-white rounded-xl shadow-sm border">
                  <div className="px-4 py-3 border-b flex items-center justify-between">
                    <div className="font-semibold">{className}</div>
                    <div className="text-sm text-gray-600">
                      {classStudents.length} student{classStudents.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="p-3">{renderTable(classStudents)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <div className="font-semibold">{activeClass}</div>
                <div className="text-sm text-gray-600">
                  {(groupedByClass.find(([k]) => k === activeClass)?.[1]?.length || 0)} students
                </div>
              </div>
              <div className="p-3">
                {renderTable(groupedByClass.find(([k]) => k === activeClass)?.[1] || [])}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Accordion mode
        <div className="space-y-3">
          {groupedByClass.map(([className, classStudents]) => {
            const isOpen = !!openClasses[className];
            return (
              <div key={className} className="bg-white rounded-xl shadow-sm border">
                <button
                  onClick={() =>
                    setOpenClasses((prev) => ({ ...prev, [className]: !prev[className] }))
                  }
                  className="w-full px-4 py-3 flex items-center justify-between border-b"
                >
                  <div className="font-semibold">{className}</div>
                  <div className="text-sm text-gray-600">
                    {classStudents.length} students {isOpen ? "▲" : "▼"}
                  </div>
                </button>

                {isOpen && <div className="p-3">{renderTable(classStudents)}</div>}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <StudentForm
          initialData={selected}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchStudents();
          }}
        />
      )}
    </div>
  );
};

export default StudentList;
